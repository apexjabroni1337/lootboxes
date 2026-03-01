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

const DEFAULT_LIMIT = 50;

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
    // Find games that need enrichment:
    // - Missing cover_image (most important — means freshly imported)
    // - OR missing screenshot_image
    const { data: games, error: queryErr } = await supabase
      .from("games")
      .select("id, title, cover_image, screenshot_image, genres")
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

    // Process games with IGDB rate limiting (4 req/sec → 350ms between)
    for (const game of games) {
      stats.processed++;

      try {
        const igdb = await searchGame(game.title);

        if (!igdb) {
          stats.notFound++;
          continue;
        }

        const updates: Record<string, any> = {};

        // Cover image
        if (!game.cover_image && igdb.cover?.image_id) {
          updates.cover_image = igdbImageUrl(igdb.cover.image_id, "cover_big");
          stats.enrichedCovers++;
        }

        // Screenshot image
        if (!game.screenshot_image && igdb.screenshots?.length) {
          updates.screenshot_image = igdbImageUrl(
            igdb.screenshots[0].image_id,
            "screenshot_big"
          );
          stats.enrichedScreenshots++;
        }

        // Genres (if empty array)
        if ((!game.genres || game.genres.length === 0) && igdb) {
          // IGDB returns genre IDs — we need to query for names
          // For now, skip genre enrichment (would require additional API call)
          // The discover-games endpoint doesn't set genres, so we leave them for later
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

        // Respect IGDB rate limit
        await new Promise((r) => setTimeout(r, 350));
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
