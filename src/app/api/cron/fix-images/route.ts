import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { searchGame, igdbImageUrl } from "@/lib/igdb";

/**
 * Fix missing / broken cover images.
 *
 * 1. Fetches all games ordered by hot_score.
 * 2. HEAD-checks each cover_image URL to detect broken links.
 * 3. Re-fetches via IGDB → Steam fallback for any NULL or broken URLs.
 *
 * GET /api/cron/fix-images?secret=<CRON_SECRET>&limit=60
 */

export const maxDuration = 60;
const DEFAULT_LIMIT = 60;
const CONCURRENCY = 3;
const SAFETY_MS = 52_000;

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
    300
  );
  const forceAll = request.nextUrl.searchParams.get("force") === "true";

  const supabase = createServerClient();
  const stats = {
    total: 0,
    checked: 0,
    broken: 0,
    missing: 0,
    fixed: 0,
    igdbHits: 0,
    steamHits: 0,
    unfixable: 0,
    errors: [] as string[],
  };

  try {
    // Fetch games — prioritise those most visible (highest hot_score)
    let query = supabase
      .from("games")
      .select("id, title, slug, cover_image, screenshot_image")
      .order("hot_score", { ascending: false, nullsFirst: false })
      .limit(limit);

    // Unless force=true, only target games with no image or potentially broken ones
    if (!forceAll) {
      // Get all — we'll check broken ones client-side via HEAD
    }

    const { data: games, error: qErr } = await query;
    if (qErr) throw new Error(`Query failed: ${qErr.message}`);
    if (!games?.length) {
      return NextResponse.json({ ok: true, message: "No games found", ...stats });
    }

    stats.total = games.length;
    const startTime = Date.now();

    // Phase 1: Identify games that need fixing (NULL or broken URL)
    const needsFix: typeof games = [];

    for (let i = 0; i < games.length; i += CONCURRENCY * 2) {
      if (Date.now() - startTime > SAFETY_MS * 0.4) break; // reserve time for enrichment

      const batch = games.slice(i, i + CONCURRENCY * 2);
      const checks = await Promise.allSettled(
        batch.map(async (game) => {
          stats.checked++;
          if (!game.cover_image) {
            stats.missing++;
            return { game, broken: true };
          }
          // HEAD-check the image URL
          try {
            const res = await fetch(game.cover_image, {
              method: "HEAD",
              signal: AbortSignal.timeout(4000),
            });
            if (!res.ok) {
              stats.broken++;
              return { game, broken: true };
            }
            // Check content-type is actually an image
            const ct = res.headers.get("content-type") || "";
            if (!ct.startsWith("image/")) {
              stats.broken++;
              return { game, broken: true };
            }
            return { game, broken: false };
          } catch {
            stats.broken++;
            return { game, broken: true };
          }
        })
      );

      for (const r of checks) {
        if (r.status === "fulfilled" && r.value.broken) {
          needsFix.push(r.value.game);
        }
      }
    }

    // Phase 2: Re-fetch images for broken ones
    for (let i = 0; i < needsFix.length; i += CONCURRENCY) {
      if (Date.now() - startTime > SAFETY_MS) {
        stats.errors.push(`Stopped early at ${stats.fixed} fixes (timeout safety)`);
        break;
      }

      const batch = needsFix.slice(i, i + CONCURRENCY);
      const results = await Promise.allSettled(
        batch.map(async (game) => {
          const updates: Record<string, any> = {};

          // Try IGDB first
          try {
            const igdb = await searchGame(game.title);
            if (igdb?.cover?.image_id) {
              updates.cover_image = igdbImageUrl(igdb.cover.image_id, "cover_big");
              if (!game.screenshot_image && igdb.screenshots?.length) {
                updates.screenshot_image = igdbImageUrl(igdb.screenshots[0].image_id, "screenshot_big");
              }
              stats.igdbHits++;
              return { game, updates };
            }
          } catch {
            // IGDB failed — try Steam
          }

          // Fallback: Steam
          try {
            const steamId = await searchSteamAppId(game.title);
            if (steamId) {
              updates.cover_image = `https://cdn.akamai.steamstatic.com/steam/apps/${steamId}/library_600x900.jpg`;
              if (!game.screenshot_image) {
                updates.screenshot_image = `https://cdn.akamai.steamstatic.com/steam/apps/${steamId}/header.jpg`;
              }
              stats.steamHits++;
              return { game, updates };
            }
          } catch {
            // Steam also failed
          }

          return { game, updates };
        })
      );

      for (const r of results) {
        if (r.status === "fulfilled") {
          const { game, updates } = r.value;
          if (Object.keys(updates).length > 0) {
            const { error: updErr } = await supabase
              .from("games")
              .update(updates)
              .eq("id", game.id);

            if (updErr) {
              stats.errors.push(`Update ${game.title}: ${updErr.message}`);
            } else {
              stats.fixed++;
            }
          } else {
            stats.unfixable++;
          }
        } else {
          stats.errors.push(`Fix error: ${r.reason?.message || "unknown"}`);
        }
      }

      if (i + CONCURRENCY < needsFix.length) {
        await new Promise((r) => setTimeout(r, 350));
      }
    }

    return NextResponse.json({
      ok: true,
      ...stats,
      needsFix: needsFix.length,
      unfixableGames: needsFix
        .filter((g) => !stats.errors.some((e) => e.includes(g.title)))
        .slice(0, 20)
        .map((g) => g.title),
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message, ...stats }, { status: 500 });
  }
}

async function searchSteamAppId(title: string): Promise<string | null> {
  const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(title)}&l=english&cc=US`;
  const res = await fetch(url, {
    headers: { "User-Agent": "LootBoxes/1.0" },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.items?.length) return null;
  const titleLower = title.toLowerCase();
  const exact = data.items.find((item: any) => item.name?.toLowerCase() === titleLower);
  const match = exact || data.items[0];
  return match?.id ? String(match.id) : null;
}
