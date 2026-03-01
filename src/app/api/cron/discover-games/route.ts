import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getDeals, mapShopId, type ITADDeal } from "@/lib/itad";

/**
 * Cron endpoint: Discover new games from the ITAD deals feed.
 *
 * Paginates through ITAD's global deals list, discovers games we don't
 * yet track, inserts them + their deals. Existing games are SKIPPED
 * (sync-deals handles those). This keeps runtime fast.
 *
 * Runs every 6 hours via Vercel Cron.
 * After this runs, enrich-games fetches IGDB images.
 *
 * Auth: requires CRON_SECRET
 * Usage:
 *   Cron: Authorization: Bearer {CRON_SECRET}
 *   Manual: GET /api/cron/discover-games?secret={CRON_SECRET}
 *   Optional: &pages=5 (default 3, each page = 200 deals)
 */

export const maxDuration = 60; // Allow up to 60s on Vercel Pro

const DEALS_PER_PAGE = 200;
const DEFAULT_PAGES = 3; // 3 pages × 200 = 600 deals scanned per run

export async function GET(request: NextRequest) {
  // Auth
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
    // Get all existing ITAD IDs so we can skip known games
    const { data: existingGames, error: gamesErr } = await supabase
      .from("games")
      .select("itad_id");

    if (gamesErr) throw new Error(`Failed to fetch existing games: ${gamesErr.message}`);

    const existingItadIds = new Set(
      (existingGames || []).map((g) => g.itad_id).filter(Boolean)
    );

    // Paginate through ITAD deals feed
    for (let page = 0; page < maxPages; page++) {
      try {
        const offset = page * DEALS_PER_PAGE;
        const { list: deals, count } = await getDeals({
          offset,
          limit: DEALS_PER_PAGE,
        });

        stats.pagesScanned++;
        stats.dealsScanned += deals.length;

        if (!deals.length) break; // No more deals

        // Group deals by game ITAD ID
        const dealsByGame = new Map<string, ITADDeal[]>();
        for (const deal of deals) {
          const gameId = deal.id;
          if (!dealsByGame.has(gameId)) {
            dealsByGame.set(gameId, []);
          }
          dealsByGame.get(gameId)!.push(deal);
        }

        // Process each game — ONLY new games
        for (const [itadId, gameDeals] of Array.from(dealsByGame.entries())) {
          if (existingItadIds.has(itadId)) {
            stats.existingGamesSkipped++;
            continue; // sync-deals handles existing games
          }

          const firstDeal = gameDeals[0];

          try {
            const slug = makeSlug(firstDeal.title);
            const platforms = extractPlatforms(gameDeals);

            const { data: newGame, error: insertErr } = await supabase
              .from("games")
              .insert({
                title: firstDeal.title,
                slug,
                itad_id: itadId,
                platforms,
                genres: [],
              })
              .select("id")
              .single();

            if (insertErr) {
              // Slug collision — try with suffix
              if (insertErr.message.includes("duplicate") || insertErr.message.includes("unique")) {
                const { data: retryGame, error: retryErr } = await supabase
                  .from("games")
                  .insert({
                    title: firstDeal.title,
                    slug: `${slug}-${itadId.slice(0, 6)}`,
                    itad_id: itadId,
                    platforms,
                    genres: [],
                  })
                  .select("id")
                  .single();

                if (retryErr) {
                  stats.errors.push(`Insert retry ${firstDeal.title}: ${retryErr.message}`);
                  continue;
                }

                existingItadIds.add(itadId);
                stats.newGamesDiscovered++;
                await batchImportDeals(supabase, retryGame!.id, gameDeals, stats);
              } else {
                stats.errors.push(`Insert ${firstDeal.title}: ${insertErr.message}`);
              }
              continue;
            }

            existingItadIds.add(itadId);
            stats.newGamesDiscovered++;
            await batchImportDeals(supabase, newGame!.id, gameDeals, stats);
          } catch (err: any) {
            stats.errors.push(`Game ${firstDeal.title}: ${err.message}`);
          }
        }

        // Stop if we've seen all available deals
        if (offset + deals.length >= count) break;

        // Polite delay between pages
        await new Promise((r) => setTimeout(r, 300));
      } catch (pageErr: any) {
        stats.errors.push(`Page ${page}: ${pageErr.message}`);
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

/**
 * Batch upsert deals for a newly discovered game.
 * Uses a single Supabase upsert call instead of one per deal.
 */
async function batchImportDeals(
  supabase: ReturnType<typeof createServerClient>,
  gameId: string,
  deals: ITADDeal[],
  stats: { dealsImported: number; errors: string[] }
) {
  const rows = deals.map((deal) => {
    const d = deal.deal;
    const storeKey = mapShopId(d.shop);
    return {
      game_id: gameId,
      store: storeKey,
      store_url: d.url,
      price: d.price.amount,
      original_price: d.regular.amount,
      discount_pct: d.cut,
      currency: d.price.currency,
      is_historic_low: d.flag === "H",
      affiliate_url: d.url,
      expires_at: d.expiry || null,
      scraped_at: new Date().toISOString(),
    };
  });

  const { error } = await supabase
    .from("deals")
    .upsert(rows, { onConflict: "game_id,store,price", ignoreDuplicates: false });

  if (error) {
    stats.errors.push(`Batch deal upsert (${rows.length} deals): ${error.message}`);
  } else {
    stats.dealsImported += rows.length;
  }
}
