import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { searchGame, igdbImageUrl } from "@/lib/igdb";

/**
 * Cron endpoint: Enrich games with images.
 *
 * Strategy (per game):
 *   1. Try IGDB search (best quality covers + screenshots)
 *   2. Fallback: Steam store search → Steam CDN images
 *
 * Runs every 6 hours via Vercel Cron (30 min after discover-games).
 */

export const maxDuration = 60;
const DEFAULT_LIMIT = 30;

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

  const limit = Math.min(
    parseInt(request.nextUrl.searchParams.get("limit") || String(DEFAULT_LIMIT)),
    200
  );

  const supabase = createServerClient();
  const stats = {
    processed: 0,
    enrichedCovers: 0,
    enrichedScreenshots: 0,
    igdbHits: 0,
    steamHits: 0,
    notFound: 0,
    errors: [] as string[],
  };

  try {
    const { data: games, error: queryErr } = await supabase
      .from("games")
      .select("id, title, cover_image, screenshot_image")
      .or("cover_image.is.null,screenshot_image.is.null")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (queryErr) throw new Error(`Query failed: ${queryErr.message}`);

    if (!games?.length) {
      return NextResponse.json({ ok: true, message: "All games enriched", ...stats });
    }

    for (const game of games) {
      stats.processed++;

      try {
        const updates: Record<string, any> = {};
        let found = false;

        // ── Strategy 1: IGDB ──
        try {
          const igdb = await searchGame(game.title);
          if (igdb) {
            if (!game.cover_image && igdb.cover?.image_id) {
              updates.cover_image = igdbImageUrl(igdb.cover.image_id, "cover_big");
              stats.enrichedCovers++;
            }
            if (!game.screenshot_image && igdb.screenshots?.length) {
              updates.screenshot_image = igdbImageUrl(igdb.screenshots[0].image_id, "screenshot_big");
              stats.enrichedScreenshots++;
            }
            if (Object.keys(updates).length > 0) {
              stats.igdbHits++;
              found = true;
            }
          }
        } catch (igdbErr: any) {
          // IGDB failure (rate limit, etc) — continue to Steam fallback
        }

        // ── Strategy 2: Steam store search ──
        if (!found && !game.cover_image) {
          try {
            const steamAppId = await searchSteamAppId(game.title);
            if (steamAppId) {
              if (!updates.cover_image && !game.cover_image) {
                updates.cover_image = `https://cdn.akamai.steamstatic.com/steam/apps/${steamAppId}/library_600x900.jpg`;
                stats.enrichedCovers++;
              }
              if (!updates.screenshot_image && !game.screenshot_image) {
                updates.screenshot_image = `https://cdn.akamai.steamstatic.com/steam/apps/${steamAppId}/header.jpg`;
                stats.enrichedScreenshots++;
              }
              stats.steamHits++;
              found = true;
            }
          } catch {
            // Steam search failed — skip
          }
        }

        if (!found) stats.notFound++;

        if (Object.keys(updates).length > 0) {
          const { error: updateErr } = await supabase
            .from("games")
            .update(updates)
            .eq("id", game.id);

          if (updateErr) {
            stats.errors.push(`Update ${game.title}: ${updateErr.message}`);
          }
        }

        // Rate limit between requests (IGDB is the bottleneck)
        await new Promise((r) => setTimeout(r, 400));
      } catch (err: any) {
        stats.errors.push(`${game.title}: ${err.message}`);
      }
    }

    return NextResponse.json({ ok: true, ...stats, timestamp: new Date().toISOString() });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message, ...stats }, { status: 500 });
  }
}

/**
 * Search Steam's store API by game title and return the first matching app ID.
 * Uses Steam's storefront search endpoint (no API key needed).
 */
async function searchSteamAppId(title: string): Promise<string | null> {
  const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(title)}&l=english&cc=US`;

  const res = await fetch(url, {
    headers: { "User-Agent": "LootBoxes/1.0" },
  });

  if (!res.ok) return null;

  const data = await res.json();
  if (!data?.items?.length) return null;

  // Try exact match first
  const titleLower = title.toLowerCase();
  const exact = data.items.find(
    (item: any) => item.name?.toLowerCase() === titleLower
  );

  const match = exact || data.items[0];
  return match?.id ? String(match.id) : null;
}
