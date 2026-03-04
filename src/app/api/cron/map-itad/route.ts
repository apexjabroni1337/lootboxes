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
const SAFETY_MS = 270_000;

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
    parseInt(request.nextUrl.searchParams.get("batch") || "100"),
    500
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
    // Auto-loop: keep fetching and processing batches until timeout
    let done = false;

    while (!done && Date.now() - startTime < SAFETY_MS) {
      // Fetch next batch of unmapped games
      const { data: unmapped, error: fetchErr } = await supabase
        .from("games")
        .select("id, title, slug")
        .is("itad_id", null)
        .order("metacritic", { ascending: false, nullsFirst: false })
        .limit(batchSize);

      if (fetchErr) throw new Error(`Fetch unmapped: ${fetchErr.message}`);
      if (!unmapped?.length) {
        done = true;
        break;
      }

      // Process in batches of CONCURRENCY
      for (let i = 0; i < unmapped.length; i += CONCURRENCY) {
        if (Date.now() - startTime > SAFETY_MS) break;

        const batch = unmapped.slice(i, i + CONCURRENCY);
        const results = await Promise.allSettled(
          batch.map(async (game) => {
            try {
              const itadResults = await searchGames(game.title, 1);

              if (itadResults.length > 0) {
                const match = itadResults[0];
                if (!match.type || match.type === "game") {
                  await supabase
                    .from("games")
                    .update({ itad_id: match.id })
                    .eq("id", game.id);
                  return { success: true, title: game.title };
                }
              }

              // No match or wrong type — mark so we don't retry
              await supabase
                .from("games")
                .update({ itad_id: "NOT_FOUND" })
                .eq("id", game.id);
              return { success: false, title: game.title };
            } catch (err: any) {
              await supabase
                .from("games")
                .update({ itad_id: "NOT_FOUND" })
                .eq("id", game.id);
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
            }
          } else {
            stats.failed++;
            stats.errors.push(r.reason?.message || "Unknown error");
          }
        }

        // Respect ITAD rate limit: 200 req/min
        if (i + CONCURRENCY < unmapped.length) {
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
    }

    // Get final remaining count
    const { count } = await supabase
      .from("games")
      .select("id", { count: "exact", head: true })
      .is("itad_id", null);
    stats.remaining = count || 0;

    const elapsed = Math.round((Date.now() - startTime) / 1000);

    return NextResponse.json({
      ok: true,
      ...stats,
      done,
      elapsedSeconds: elapsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message, ...stats },
      { status: 500 }
    );
  }
}
