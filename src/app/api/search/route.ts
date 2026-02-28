import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * GET /api/search?q=elden+ring — Full-text search across games & analytics.
 *
 * Returns combined results from games and analytics_meta tables.
 * Used by the header search bar (client-side fetch with debounce).
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ games: [], analytics: [] });
  }

  const supabase = createServerClient();

  // Search games by title (ilike for partial match)
  const { data: games, error: gamesErr } = await supabase
    .from("games")
    .select("id, title, slug, cover_image, platforms, genres, lootboxes_score")
    .ilike("title", `%${q}%`)
    .order("title")
    .limit(8);

  // Search analytics by title
  const { data: analytics, error: analyticsErr } = await supabase
    .from("analytics_meta")
    .select("id, title, slug, type, excerpt, lootboxes_score, cover_image")
    .ilike("title", `%${q}%`)
    .order("published_at", { ascending: false })
    .limit(5);

  if (gamesErr || analyticsErr) {
    console.error("Search error:", gamesErr || analyticsErr);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    games: games || [],
    analytics: analytics || [],
  });
}
