import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getDeals, mapShopId, type ITADDeal } from "@/lib/itad";

/**
 * Cron endpoint: Discover new games from the ITAD deals feed.
 *
 * Paginates through ITAD's global deals list (all games across all stores),
 * discovers games we don't yet track, inserts them, and imports their deals.
 *
 * Runs every 6 hours via Vercel Cron.
 * After this runs, enrich-games should run to fetch IGDB images.
 *
 * Auth: requires CRON_SECRET
 * Usage:
 *   Cron: Authorization: Bearer {CRON_SECRET}
 *   Manual: GET /api/cron/discover-games?secret={CRON_SECRET}
 *   Optional: &pages=8 (default 4, each page = 500 deals)
 */

const DEALS_PER_PAGE = 500;
const DEFAULT_PAGES = 4; // 4 pages × 500 = 2000 deals scanned per run

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
    newGamesDiscovered: 0,
    dealsImported: 0,
    errors: [] as string[],
  };

  try {
    // Get all existing ITAD IDs so we can detect new games
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
          sort: "cut:desc", // Best discounts first
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

        // Process each game
        for (const [itadId, gameDeals] of Array.from(dealsByGame.entries())) {
          const firstDeal = gameDeals[0];

          // Skip if we already track this game
          if (existingItadIds.has(itadId)) {
            // Still import the deals though
            await importDeals(supabase, itadId, gameDeals, stats);
            continue;
          }

          // New game! Create it
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
                genres: [], // Will be filled by enrich-games
              })
              .select("id")
              .single();

            if (insertErr) {
              // Might be a slug collision — try with a suffix
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
                await importDealsForNewGame(supabase, retryGame!.id, gameDeals, stats);
              } else {
                stats.errors.push(`Insert ${firstDeal.title}: ${insertErr.message}`);
              }
              continue;
            }

            existingItadIds.add(itadId);
            stats.newGamesDiscovered++;

            // Import deals for the new game
            await importDealsForNewGame(supabase, newGame!.id, gameDeals, stats);
          } catch (err: any) {
            stats.errors.push(`Game ${firstDeal.title}: ${err.message}`);
          }
        }

        // Stop if we've seen all available deals
        if (offset + deals.length >= count) break;

        // Polite delay between pages
        await new Promise((r) => setTimeout(r, 500));
      } catch (pageErr: any) {
        stats.errors.push(`Page ${page}: ${pageErr.message}`);
      }
    }

    // After discovering games, trigger enrichment inline (for new games only)
    // This is limited to avoid timeout — the enrich-games cron handles the rest
    if (stats.newGamesDiscovered > 0) {
      try {
        const enrichCount = await enrichNewGames(supabase, 20); // Enrich up to 20 games
        stats.errors.push(`Enriched ${enrichCount} new games with IGDB data`);
      } catch (enrichErr: any) {
        stats.errors.push(`Enrichment: ${enrichErr.message}`);
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
        // Normalize platform names
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
 * Import deals for a game that already exists (we know the itad_id → game_id mapping)
 */
async function importDeals(
  supabase: ReturnType<typeof createServerClient>,
  itadId: string,
  deals: ITADDeal[],
  stats: { dealsImported: number; errors: string[] }
) {
  // Look up the game_id
  const { data: game } = await supabase
    .from("games")
    .select("id")
    .eq("itad_id", itadId)
    .single();

  if (!game) return;

  await importDealsForNewGame(supabase, game.id, deals, stats);
}

/**
 * Import deal records for a given game_id
 */
async function importDealsForNewGame(
  supabase: ReturnType<typeof createServerClient>,
  gameId: string,
  deals: ITADDeal[],
  stats: { dealsImported: number; errors: string[] }
) {
  for (const deal of deals) {
    const d = deal.deal;
    const storeKey = mapShopId(d.shop);

    const { error } = await supabase.from("deals").upsert(
      {
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
      },
      { onConflict: "game_id,store,price", ignoreDuplicates: false }
    );

    if (error) {
      stats.errors.push(`Deal upsert ${deal.title}/${storeKey}: ${error.message}`);
    } else {
      stats.dealsImported++;
    }
  }
}

/**
 * Quick enrichment pass for newly discovered games (runs inline).
 * Fetches IGDB covers + screenshots for games missing images.
 */
async function enrichNewGames(
  supabase: ReturnType<typeof createServerClient>,
  limit: number
): Promise<number> {
  // Dynamic import to avoid loading IGDB module unless needed
  const { searchGame, igdbImageUrl } = await import("@/lib/igdb");

  const { data: unenriched } = await supabase
    .from("games")
    .select("id, title")
    .is("cover_image", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!unenriched?.length) return 0;

  let enriched = 0;
  for (const game of unenriched) {
    try {
      const igdb = await searchGame(game.title);
      if (!igdb) continue;

      const updates: Record<string, any> = {};

      if (igdb.cover?.image_id) {
        updates.cover_image = igdbImageUrl(igdb.cover.image_id, "cover_big");
      }
      if (igdb.screenshots?.length) {
        updates.screenshot_image = igdbImageUrl(igdb.screenshots[0].image_id, "screenshot_big");
      }

      if (Object.keys(updates).length > 0) {
        await supabase.from("games").update(updates).eq("id", game.id);
        enriched++;
      }

      // IGDB rate limit: 4 req/sec
      await new Promise((r) => setTimeout(r, 350));
    } catch {
      // Skip failures silently — enrich-games cron will retry
    }
  }

  return enriched;
}
