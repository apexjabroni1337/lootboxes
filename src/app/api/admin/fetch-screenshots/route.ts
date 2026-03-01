import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { searchGame, igdbImageUrl } from "@/lib/igdb";

/**
 * Admin endpoint: Fetch game screenshot images from IGDB.
 *
 * For each game in the DB:
 * 1. Searches IGDB for the game by title
 * 2. Gets the first screenshot image_id
 * 3. Constructs the IGDB CDN URL (screenshot_big, 889x500) and saves to Supabase
 *
 * Auth: requires CRON_SECRET
 * Usage: GET /api/admin/fetch-screenshots?secret=YOUR_CRON_SECRET
 */

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

  const supabase = createServerClient();

  // Get all games
  const { data: games, error: gamesErr } = await supabase
    .from("games")
    .select("id, title, slug");

  if (gamesErr) {
    return NextResponse.json({ error: gamesErr.message }, { status: 500 });
  }

  if (!games || games.length === 0) {
    return NextResponse.json({ ok: true, message: "No games found", summary: { updated: 0, total: 0 } });
  }

  const results: { title: string; status: string; screenshot_image?: string }[] = [];

  for (const game of games) {
    try {
      const igdbGame = await searchGame(game.title);

      if (!igdbGame) {
        results.push({ title: game.title, status: "not_found" });
        continue;
      }

      if (!igdbGame.screenshots?.length) {
        results.push({ title: game.title, status: "no_screenshots" });
        continue;
      }

      // Use screenshot_big (889x500) — good for carousel backgrounds
      const screenshotUrl = igdbImageUrl(igdbGame.screenshots[0].image_id, "screenshot_big");

      const { error } = await supabase
        .from("games")
        .update({ screenshot_image: screenshotUrl })
        .eq("id", game.id);

      if (error) {
        results.push({ title: game.title, status: `update_error: ${error.message}` });
      } else {
        results.push({
          title: game.title,
          status: "updated",
          screenshot_image: screenshotUrl,
        });
      }

      // Small delay to be polite to IGDB API (4 requests/sec limit)
      await new Promise((r) => setTimeout(r, 300));
    } catch (err: any) {
      results.push({ title: game.title, status: `error: ${err.message}` });
    }
  }

  const updated = results.filter((r) => r.status === "updated").length;

  return NextResponse.json({
    ok: true,
    summary: { updated, total: games.length },
    results,
  });
}
