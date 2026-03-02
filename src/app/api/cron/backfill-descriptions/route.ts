import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { searchGame, igdbImageUrl } from "@/lib/igdb";

/**
 * Backfill game descriptions from IGDB for games that don't have one.
 *
 * Processes games in batches, searching IGDB by title to find summaries.
 * Respects IGDB rate limit (4 req/sec) with delays between searches.
 *
 * GET /api/cron/backfill-descriptions?secret=<CRON_SECRET>&limit=50
 */

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 500 }
    );
  }
  if (secret !== cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = Math.min(
    parseInt(request.nextUrl.searchParams.get("limit") || "50"),
    200
  );

  const supabase = createServerClient();
  const startTime = Date.now();

  // Fetch games without descriptions, prioritized by rating
  const { data: games, error: fetchErr } = await supabase
    .from("games")
    .select("id, title, slug")
    .is("description", null)
    .not("metacritic", "is", null)
    .order("metacritic", { ascending: false })
    .limit(limit);

  if (fetchErr) {
    return NextResponse.json(
      { ok: false, error: fetchErr.message },
      { status: 500 }
    );
  }

  if (!games || games.length === 0) {
    // If no rated games need descriptions, try unrated ones
    const { data: unratedGames } = await supabase
      .from("games")
      .select("id, title, slug")
      .is("description", null)
      .limit(limit);

    if (!unratedGames || unratedGames.length === 0) {
      return NextResponse.json({
        ok: true,
        message: "All games have descriptions!",
        updated: 0,
        remaining: 0,
      });
    }

    // Process unrated games
    return processGames(supabase, unratedGames, startTime);
  }

  return processGames(supabase, games, startTime);
}

async function processGames(
  supabase: any,
  games: { id: string; title: string; slug: string }[],
  startTime: number
) {
  const stats = {
    processed: 0,
    updated: 0,
    notFound: 0,
    errors: [] as string[],
  };

  // Process in batches of 3 (IGDB allows 4 req/sec)
  for (let i = 0; i < games.length; i += 3) {
    // Safety timeout — stop 30s before max duration
    if (Date.now() - startTime > 270_000) break;

    const batch = games.slice(i, i + 3);
    const promises = batch.map(async (game) => {
      try {
        // Use IGDB's Apicalypse query to search by name and get summary
        const { getTwitchToken } = await import("@/lib/igdb");
        const token = await getTwitchToken();
        const clientId = process.env.TWITCH_CLIENT_ID!;

        const res = await fetch("https://api.igdb.com/v4/games", {
          method: "POST",
          headers: {
            "Client-ID": clientId,
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain",
          },
          body: `search "${game.title.replace(/"/g, '\\"')}"; fields name, summary; limit 5;`,
        });

        if (!res.ok) {
          stats.errors.push(`${game.slug}: IGDB ${res.status}`);
          return;
        }

        const results = await res.json();
        if (!results.length) {
          stats.notFound++;
          return;
        }

        // Find best match (exact title match preferred)
        const titleLower = game.title.toLowerCase();
        const exact = results.find(
          (r: any) => r.name?.toLowerCase() === titleLower && r.summary
        );
        const withSummary = results.find((r: any) => r.summary);
        const match = exact || withSummary;

        if (!match?.summary) {
          stats.notFound++;
          return;
        }

        // Update the game's description
        const { error: updateErr } = await supabase
          .from("games")
          .update({ description: match.summary })
          .eq("id", game.id);

        if (updateErr) {
          stats.errors.push(`${game.slug}: ${updateErr.message}`);
        } else {
          stats.updated++;
        }
      } catch (err: any) {
        stats.errors.push(`${game.slug}: ${err.message}`);
      }
      stats.processed++;
    });

    await Promise.all(promises);

    // Rate limit delay
    if (i + 3 < games.length) {
      await new Promise((r) => setTimeout(r, 800));
    }
  }

  // Get remaining count
  const { count: remaining } = await supabase
    .from("games")
    .select("id", { count: "exact", head: true })
    .is("description", null);

  return NextResponse.json({
    ok: true,
    ...stats,
    remaining: remaining || 0,
    elapsedSeconds: Math.round((Date.now() - startTime) / 1000),
  });
}
