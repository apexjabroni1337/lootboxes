import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { searchGame, igdbImageUrl } from "@/lib/igdb";
import { MANUAL_COVERS } from "@/lib/manual-covers";

/**
 * Cron endpoint: Enrich games with images.
 *
 * Image enrichment pipeline (per game, in priority order):
 *
 *   1. IGDB (via Twitch API) — Best quality. Covers most PC/console/mobile
 *      games. Returns portrait covers (264×374) and landscape screenshots.
 *
 *   2. Steam Store API — Fallback for Steam-available titles that IGDB
 *      missed. Uses predictable CDN URLs based on Steam App ID.
 *
 *   3. Manual Overrides (src/lib/manual-covers.ts) — For mobile-only,
 *      region-specific, or niche titles that neither API can match.
 *      Add entries to the MANUAL_COVERS map as needed.
 *
 *   4. GameAvatar component (UI-level) — Final graceful fallback.
 *      Renders a deterministic gradient + initials when no image exists.
 *
 * Uses parallel processing (3 concurrent) to maximize throughput
 * within Vercel's 60s timeout. Processes ~80-100 games per run.
 *
 * Runs every 6 hours via Vercel Cron (30 min after discover-games).
 */

export const maxDuration = 60;
const DEFAULT_LIMIT = 80;
const CONCURRENCY = 3;
const SAFETY_TIMEOUT_MS = 55_000; // Stop 5s before Vercel kills us

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
      .select("id, title, slug, cover_image, screenshot_image")
      .or("cover_image.is.null,screenshot_image.is.null")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (queryErr) throw new Error(`Query failed: ${queryErr.message}`);

    if (!games?.length) {
      return NextResponse.json({ ok: true, message: "All games enriched", ...stats });
    }

    // Process games in parallel batches of CONCURRENCY
    const startTime = Date.now();

    for (let i = 0; i < games.length; i += CONCURRENCY) {
      // Safety: bail before Vercel timeout
      if (Date.now() - startTime > SAFETY_TIMEOUT_MS) {
        stats.errors.push(`Stopped early at ${stats.processed} games (timeout safety)`);
        break;
      }

      const batch = games.slice(i, i + CONCURRENCY);

      const results = await Promise.allSettled(
        batch.map((game) => enrichGame(game))
      );

      for (const result of results) {
        stats.processed++;
        if (result.status === "fulfilled") {
          const r = result.value;
          if (r.igdbHit) stats.igdbHits++;
          if (r.steamHit) stats.steamHits++;
          if (r.coversAdded) stats.enrichedCovers++;
          if (r.screenshotsAdded) stats.enrichedScreenshots++;
          if (!r.found) stats.notFound++;
          if (r.error) stats.errors.push(r.error);

          // Write updates to DB
          if (Object.keys(r.updates).length > 0) {
            const { error: updateErr } = await supabase
              .from("games")
              .update(r.updates)
              .eq("id", r.gameId);
            if (updateErr) {
              stats.errors.push(`Update ${r.gameId}: ${updateErr.message}`);
            }
          }
        } else {
          stats.errors.push(`Batch error: ${result.reason?.message || "unknown"}`);
        }
      }

      // Small delay between batches to respect rate limits
      if (i + CONCURRENCY < games.length) {
        await new Promise((r) => setTimeout(r, 350));
      }
    }

    return NextResponse.json({ ok: true, ...stats, timestamp: new Date().toISOString() });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message, ...stats }, { status: 500 });
  }
}

// ── Per-game enrichment (pure, no DB writes) ──

interface EnrichResult {
  gameId: string;
  updates: Record<string, any>;
  found: boolean;
  igdbHit: boolean;
  steamHit: boolean;
  coversAdded: boolean;
  screenshotsAdded: boolean;
  error?: string;
}

async function enrichGame(game: {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  screenshot_image: string | null;
}): Promise<EnrichResult> {
  const result: EnrichResult = {
    gameId: game.id,
    updates: {},
    found: false,
    igdbHit: false,
    steamHit: false,
    coversAdded: false,
    screenshotsAdded: false,
  };

  try {
    // ── Strategy 1: IGDB ──
    try {
      const igdb = await searchGame(game.title);
      if (igdb) {
        if (!game.cover_image && igdb.cover?.image_id) {
          result.updates.cover_image = igdbImageUrl(igdb.cover.image_id, "cover_big");
          result.coversAdded = true;
        }
        if (!game.screenshot_image && igdb.screenshots?.length) {
          result.updates.screenshot_image = igdbImageUrl(igdb.screenshots[0].image_id, "screenshot_big");
          result.screenshotsAdded = true;
        }
        if (Object.keys(result.updates).length > 0) {
          result.igdbHit = true;
          result.found = true;
        }
      }
    } catch {
      // IGDB failure — continue to Steam fallback
    }

    // ── Strategy 2: Steam store search ──
    if (!result.found && !game.cover_image) {
      try {
        const steamAppId = await searchSteamAppId(game.title);
        if (steamAppId) {
          if (!result.updates.cover_image && !game.cover_image) {
            result.updates.cover_image = `https://cdn.akamai.steamstatic.com/steam/apps/${steamAppId}/library_600x900.jpg`;
            result.coversAdded = true;
          }
          if (!result.updates.screenshot_image && !game.screenshot_image) {
            result.updates.screenshot_image = `https://cdn.akamai.steamstatic.com/steam/apps/${steamAppId}/header.jpg`;
            result.screenshotsAdded = true;
          }
          result.steamHit = true;
          result.found = true;
        }
      } catch {
        // Steam search failed — skip
      }
    }

    // ── Strategy 3: Manual overrides (for mobile/niche titles) ──
    if (!result.found && game.slug in MANUAL_COVERS) {
      const manual = MANUAL_COVERS[game.slug];
      if (!game.cover_image && manual.cover) {
        result.updates.cover_image = manual.cover;
        result.coversAdded = true;
      }
      if (!game.screenshot_image && manual.screenshot) {
        result.updates.screenshot_image = manual.screenshot;
        result.screenshotsAdded = true;
      }
      if (Object.keys(result.updates).length > 0) {
        result.found = true;
      }
    }
  } catch (err: any) {
    result.error = `${game.title}: ${err.message}`;
  }

  return result;
}

/**
 * Search Steam's store API by game title and return the first matching app ID.
 */
async function searchSteamAppId(title: string): Promise<string | null> {
  const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(title)}&l=english&cc=US`;

  const res = await fetch(url, {
    headers: { "User-Agent": "LootBoxes/1.0" },
  });

  if (!res.ok) return null;

  const data = await res.json();
  if (!data?.items?.length) return null;

  const titleLower = title.toLowerCase();
  const exact = data.items.find(
    (item: any) => item.name?.toLowerCase() === titleLower
  );

  const match = exact || data.items[0];
  return match?.id ? String(match.id) : null;
}
