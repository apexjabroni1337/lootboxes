import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getDeals, mapShopId, type ITADDeal } from "@/lib/itad";

/**
 * Cron endpoint: Discover new games from the ITAD deals feed.
 *
 * Strategy: Scan ITAD deals pages → collect new games → ONE batch insert
 * for games → ONE batch insert for deals. Minimizes DB round-trips.
 *
 * Runs every 6 hours via Vercel Cron.
 */

export const maxDuration = 60;

const DEALS_PER_PAGE = 200;
const DEFAULT_PAGES = 3;

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  if (secret !== cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const maxPages = parseInt(request.nextUrl.searchParams.get("pages") || String(DEFAULT_PAGES));
  const supabase = createServerClient();

  const stats = {
    pagesScanned: 0,
    dealsScanned: 0,
    existingGamesSkipped: 0,
    newGamesDiscovered: 0,
    dealsImported: 0,
    errors: [] as string[],
  };

  try {
    // Step 1: Get all existing ITAD IDs
    const { data: existingGames, error: gamesErr } = await supabase
      .from("games")
      .select("itad_id");

    if (gamesErr) throw new Error(`Failed to fetch existing games: ${gamesErr.message}`);

    const existingItadIds = new Set(
      (existingGames || []).map((g) => g.itad_id).filter(Boolean)
    );

    // Step 2: Scan ITAD pages and collect new games + their deals
    const newGamesMap = new Map<string, { title: string; slug: string; platforms: string[]; deals: ITADDeal[] }>();

    for (let page = 0; page < maxPages; page++) {
      try {
        const offset = page * DEALS_PER_PAGE;
        const { list: deals, count } = await getDeals({ offset, limit: DEALS_PER_PAGE });

        stats.pagesScanned++;
        stats.dealsScanned += deals.length;
        if (!deals.length) break;

        for (const deal of deals) {
          const itadId = deal.id;

          if (existingItadIds.has(itadId)) {
            continue; // sync-deals handles existing games
          }

          // Skip DLC, bundles, soundtracks — only import actual games
          if (deal.type && deal.type !== "game") {
            continue;
          }

          if (newGamesMap.has(itadId)) {
            newGamesMap.get(itadId)!.deals.push(deal);
          } else {
            newGamesMap.set(itadId, {
              title: deal.title,
              slug: makeSlug(deal.title),
              platforms: extractPlatforms([deal]),
              deals: [deal],
            });
          }
        }

        if (offset + deals.length >= count) break;
        await new Promise((r) => setTimeout(r, 200));
      } catch (pageErr: any) {
        stats.errors.push(`Page ${page}: ${pageErr.message}`);
      }
    }

    stats.existingGamesSkipped = stats.dealsScanned - Array.from(newGamesMap.values()).reduce((sum, g) => sum + g.deals.length, 0);

    if (newGamesMap.size === 0) {
      return NextResponse.json({ ok: true, ...stats, timestamp: new Date().toISOString() });
    }

    // Step 3: Build game rows with guaranteed-unique slugs
    const { data: existingSlugs } = await supabase.from("games").select("slug");
    const usedSlugs = new Set((existingSlugs || []).map((g) => g.slug));
    const gameRows: { title: string; slug: string; itad_id: string; platforms: string[]; genres: never[] }[] = [];

    for (const [itadId, game] of Array.from(newGamesMap.entries())) {
      let slug = game.slug;
      if (usedSlugs.has(slug)) {
        slug = `${game.slug}-${itadId.slice(0, 8)}`;
      }
      if (usedSlugs.has(slug)) {
        slug = `${game.slug}-${itadId}`;
      }
      usedSlugs.add(slug);

      gameRows.push({
        title: game.title,
        slug,
        itad_id: itadId,
        platforms: game.platforms,
        genres: [],
      });
    }

    // Insert games in chunks — fall back to individual inserts on error
    const CHUNK_SIZE = 50;
    const insertedGames: { id: string; itad_id: string }[] = [];

    for (let i = 0; i < gameRows.length; i += CHUNK_SIZE) {
      const chunk = gameRows.slice(i, i + CHUNK_SIZE);
      const { data, error } = await supabase
        .from("games")
        .upsert(chunk, { onConflict: "itad_id", ignoreDuplicates: false })
        .select("id, itad_id");

      if (error) {
        // Batch failed — try individual inserts so one bad row doesn't kill the rest
        for (const row of chunk) {
          const { data: single, error: singleErr } = await supabase
            .from("games")
            .upsert(row, { onConflict: "itad_id", ignoreDuplicates: false })
            .select("id, itad_id")
            .single();
          if (singleErr) {
            stats.errors.push(`Insert ${row.title}: ${singleErr.message}`);
          } else if (single) {
            insertedGames.push(single);
          }
        }
      } else if (data) {
        insertedGames.push(...data);
      }
    }

    stats.newGamesDiscovered = insertedGames.length;

    // Step 4: Build game_id lookup and batch insert ALL deals
    const gameIdByItad = new Map<string, string>();
    for (const g of insertedGames) {
      gameIdByItad.set(g.itad_id, g.id);
    }

    const allDealRows: Record<string, any>[] = [];
    const now = new Date().toISOString();

    for (const [itadId, game] of Array.from(newGamesMap.entries())) {
      const gameId = gameIdByItad.get(itadId);
      if (!gameId) continue;

      for (const deal of game.deals) {
        const d = deal.deal;
        allDealRows.push({
          game_id: gameId,
          store: mapShopId(d.shop),
          store_url: d.url,
          price: d.price.amount,
          original_price: d.regular.amount,
          discount_pct: d.cut,
          currency: d.price.currency,
          is_historic_low: d.flag === "H",
          affiliate_url: d.url,
          expires_at: d.expiry || null,
          scraped_at: now,
        });
      }
    }

    // Insert deals in chunks
    for (let i = 0; i < allDealRows.length; i += CHUNK_SIZE) {
      const chunk = allDealRows.slice(i, i + CHUNK_SIZE);
      const { error } = await supabase
        .from("deals")
        .upsert(chunk, { onConflict: "game_id,store,price", ignoreDuplicates: false });

      if (error) {
        stats.errors.push(`Deal batch chunk ${i}: ${error.message}`);
      } else {
        stats.dealsImported += chunk.length;
      }
    }

    return NextResponse.json({
      ok: true,
      ...stats,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message, ...stats },
      { status: 500 }
    );
  }
}

// ── Helpers ──

function makeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function extractPlatforms(deals: ITADDeal[]): string[] {
  const platformSet = new Set<string>();
  for (const deal of deals) {
    if (deal.deal?.platforms) {
      for (const p of deal.deal.platforms) {
        const name = p.name.toLowerCase();
        if (name.includes("windows") || name.includes("pc")) platformSet.add("PC");
        else if (name.includes("mac")) platformSet.add("Mac");
        else if (name.includes("linux")) platformSet.add("Linux");
        else platformSet.add(p.name);
      }
    }
  }
  return Array.from(platformSet);
}

