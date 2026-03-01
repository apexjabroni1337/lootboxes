import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { searchGame, igdbImageUrl } from "@/lib/igdb";

/**
 * Cron endpoint: Enrich games with IGDB metadata.
 *
 * Finds games missing cover images, screenshots, or genres,
 * then queries IGDB to fill in the gaps.
 *
 * Can be run standalone or chained after discover-games.
 *
 * Auth: requires CRON_SECRET
 * Usage:
 *   Cron: Authorization: Bearer {CRON_SECRET}
 *   Manual: GET /api/cron/enrich-games?secret={CRON_SECRET}
 *   Optional: &limit=50 (default 50, max games to process per run)
 */

export const maxDuration = 60;
const DEFAULT_LIMIT = 30;

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

  const limit = Math.min(
    parseInt(request.nextUrl.searchParams.get("limit") || String(DEFAULT_LIMIT)),
    200
  );

  const supabase = createServerClient();
  const stats = {
    processed: 0,
    enrichedCovers: 0,
    enrichedScreenshots: 0,
    enrichedGenres: 0,
    notFound: 0,
    errors: [] as string[],
  };

  try {
    // Find games that need enrichment (missing BOTH images — already having one is fine)
    const { data: games, error: queryErr } = await supabase
      .from("games")
      .select("id, title, itad_id, cover_image, screenshot_image")
      .or("cover_image.is.null,screenshot_image.is.null")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (queryErr) throw new Error(`Query failed: ${queryErr.message}`);

    if (!games?.length) {
      return NextResponse.json({
        ok: true,
        message: "All games are fully enriched",
        ...stats,
      });
    }

    for (const game of games) {
      stats.processed++;

      try {
        const updates: Record<string, any> = {};

        // Try IGDB first
        const igdb = await searchGame(game.title);

        if (igdb) {
          if (!game.cover_image && igdb.cover?.image_id) {
            updates.cover_image = igdbImageUrl(igdb.cover.image_id, "cover_big");
            stats.enrichedCovers++;
          }
          if (!game.screenshot_image && igdb.screenshots?.length) {
            updates.screenshot_image = igdbImageUrl(
              igdb.screenshots[0].image_id,
              "screenshot_big"
            );
            stats.enrichedScreenshots++;
          }
        } else {
          stats.notFound++;
        }

        // Fallback: Try to get Steam images from the game's deal URLs
        if (!updates.cover_image && !game.cover_image) {
          const steamImages = await getSteamImagesForGame(supabase, game.id);
          if (steamImages.cover) {
            updates.cover_image = steamImages.cover;
            stats.enrichedCovers++;
          }
          if (!updates.screenshot_image && !game.screenshot_image && steamImages.screenshot) {
            updates.screenshot_image = steamImages.screenshot;
            stats.enrichedScreenshots++;
          }
        }

        if (Object.keys(updates).length > 0) {
          const { error: updateErr } = await supabase
            .from("games")
            .update(updates)
            .eq("id", game.id);

          if (updateErr) {
            stats.errors.push(`Update ${game.title}: ${updateErr.message}`);
          }
        }

        // Respect IGDB rate limit (4 req/sec, use 500ms for safety)
        await new Promise((r) => setTimeout(r, 500));
      } catch (err: any) {
        stats.errors.push(`${game.title}: ${err.message}`);
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

/**
 * Look up a game's deals to find a Steam store URL, then construct
 * Steam CDN image URLs from the app ID.
 */
async function getSteamImagesForGame(
  supabase: ReturnType<typeof createServerClient>,
  gameId: string
): Promise<{ cover: string | null; screenshot: string | null }> {
  const { data: deals } = await supabase
    .from("deals")
    .select("store_url")
    .eq("game_id", gameId)
    .eq("store", "steam")
    .limit(1);

  if (!deals?.length) return { cover: null, screenshot: null };

  const url = deals[0].store_url || "";
  const match = url.match(/store\.steampowered\.com\/app\/(\d+)/);
  if (!match) return { cover: null, screenshot: null };

  const appId = match[1];
  return {
    cover: `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`,
    screenshot: `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`,
  };
}
