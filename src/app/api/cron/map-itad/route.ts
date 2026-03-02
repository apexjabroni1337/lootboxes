import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { searchGames } from "@/lib/itad";

/**
 * Map games to ITAD IDs for deal syncing.
 *
 * Fetches games where itad_id IS NULL and searches ITAD by title.
 * Processes in batches of 5 with delays to respect ITAD rate limits (200 req/min).
 *
 * Run in a loop after bulk IGDB import:
 *   do {
 *     $r = Invoke-RestMethod ".../map-itad?secret=..."
 *   } while ($r.remaining -gt 0)
 *
 * GET /api/cron/map-itad?secret=<CRON_SECRET>&batch=50
 */

export const maxDuration = 300;

const CONCURRENCY = 5;
const SAFETY_MS = 55_000;

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

  const batchSize = Math.min(
    parseInt(request.nextUrl.searchParams.get("batch") || "50"),
    100
  );

  const supabase = createServerClient();
  const stats = {
    mapped: 0,
    failed: 0,
    failedTitles: [] as string[],
    remaining: 0,
    errors: [] as string[],
  };

  const startTime = Date.now();

  try {
    // Fetch games that need ITAD mapping
    const { data: unmapped, error: fetchErr } = await supabase
      .from("games")
      .select("id, title, slug")
      .is("itad_id", null)
      .order("metacritic", { ascending: false, nullsFirst: false })
      .limit(batchSize);

    if (fetchErr) throw new Error(`Fetch unmapped: ${fetchErr.message}`);
    if (!unmapped?.length) {
      return NextResponse.json({ ok: true, ...stats, message: "All games mapped" });
    }

    // Count total remaining (including this batch)
    const { count } = await supabase
      .from("games")
      .select("id", { count: "exact", head: true })
      .is("itad_id", null);
    stats.remaining = (count || 0) - batchSize;
    if (stats.remaining < 0) stats.remaining = 0;

    // Process in batches of CONCURRENCY
    for (let i = 0; i < unmapped.length; i += CONCURRENCY) {
      if (Date.now() - startTime > SAFETY_MS) {
        stats.errors.push(`Timeout at ${stats.mapped} mappings`);
        break;
      }

      const batch = unmapped.slice(i, i + CONCURRENCY);
      const results = await Promise.allSettled(
        batch.map(async (game) => {
          try {
            // Search ITAD by exact title
            const itadResults = await searchGames(game.title, 1);

            if (itadResults.length > 0) {
              const match = itadResults[0];
              // Only accept if type is "game" (not DLC, bundle, etc.)
              if (!match.type || match.type === "game") {
                await supabase
                  .from("games")
                  .update({ itad_id: match.id })
                  .eq("id", game.id);
                return { success: true, title: game.title };
              }
            }

            // No match found
            return { success: false, title: game.title };
          } catch (err: any) {
            return { success: false, title: game.title, error: err.message };
          }
        })
      );

      for (const r of results) {
        if (r.status === "fulfilled") {
          if (r.value.success) {
            stats.mapped++;
          } else {
            stats.failed++;
            stats.failedTitles.push(r.value.title);
          }
        } else {
          stats.failed++;
          stats.errors.push(r.reason?.message || "Unknown error");
        }
      }

      // Respect ITAD rate limit: 200 req/min ≈ 3.3 req/sec
      // With CONCURRENCY=5, wait 1.5s between batches
      if (i + CONCURRENCY < unmapped.length) {
        await new Promise((r) => setTimeout(r, 1500));
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
