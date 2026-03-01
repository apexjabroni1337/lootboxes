import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { searchGame, igdbImageUrl } from "@/lib/igdb";

/**
 * Admin endpoint: Fetch game cover images from IGDB.
 *
 * For each game in the DB that has no cover_image:
 * 1. Searches IGDB for the game by title
 * 2. Gets the cover image_id
 * 3. Constructs the IGDB CDN URL and saves to Supabase
 *
 * Auth: requires CRON_SECRET
 * Usage: GET /api/admin/fetch-covers?secret=YOUR_CRON_SECRET
 *        Add &force=true to re-fetch even if cover_image already set
 */

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

  const force = request.nextUrl.searchParams.get("force") === "true";
  const supabase = createServerClient();

  // Get all games, optionally only those missing covers
  const query = supabase.from("games").select("id, title, slug, cover_image");
  if (!force) {
    query.is("cover_image", null);
  }
  const { data: games, error: gamesErr } = await query;

  if (gamesErr) {
    return NextResponse.json({ error: gamesErr.message }, { status: 500 });
  }

  if (!games || games.length === 0) {
    return NextResponse.json({ ok: true, message: "No games need covers", summary: { updated: 0, total: 0 } });
  }

  const results: { title: string; status: string; cover_image?: string; screenshot?: string }[] = [];

  for (const game of games) {
    try {
      const igdbGame = await searchGame(game.title);

      if (!igdbGame) {
        results.push({ title: game.title, status: "not_found" });
        continue;
      }

      if (!igdbGame.cover?.image_id) {
        results.push({ title: game.title, status: "no_cover_image" });
        continue;
      }

      // Use 720p for wide hero images, cover_big for portrait thumbnails
      // We'll store the 720p as primary (great for deal cards & hero sections)
      const coverUrl = igdbImageUrl(igdbGame.cover.image_id, "720p");
      const coverBigUrl = igdbImageUrl(igdbGame.cover.image_id, "cover_big");

      // Also grab a screenshot if available (for hero backgrounds)
      let screenshotUrl: string | undefined;
      if (igdbGame.screenshots?.length) {
        screenshotUrl = igdbImageUrl(igdbGame.screenshots[0].image_id, "screenshot_big");
      }

      // Save the cover_big URL as the primary cover_image
      // (portrait format, 264x374, good for game detail pages)
      const { error } = await supabase
        .from("games")
        .update({ cover_image: coverBigUrl })
        .eq("id", game.id);

      if (error) {
        results.push({ title: game.title, status: `update_error: ${error.message}` });
      } else {
        results.push({
          title: game.title,
          status: "updated",
          cover_image: coverBigUrl,
          screenshot: screenshotUrl,
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
