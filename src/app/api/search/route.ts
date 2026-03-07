import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET /api/search?q=elden+ring — Search across games, deals & analytics.
 *
 * Returns combined results from games, deals, and analytics_meta tables.
 * Used by SearchDialog and /search page (client-side fetch with debounce).
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ games: [], deals: [], analytics: [] });
  }

  const supabase = createServerClient();

  // Search games by title (ilike for partial match)
  const { data: games, error: gamesErr } = await supabase
    .from("games")
    .select("id, title, slug, cover_image, platforms, genres, lootboxes_score")
    .ilike("title", `%${q}%`)
    .order("title")
    .limit(8);

  // Search deals by joining with games table — find deals for matching games
  const { data: deals, error: dealsErr } = await supabase
    .from("deals")
    .select(`
      id,
      store,
      price,
      original_price,
      discount_pct,
      is_historic_low,
      store_url,
      affiliate_url,
      games!inner (
        id,
        title,
        slug,
        cover_image
      )
    `)
    .ilike("games.title", `%${q}%`)
    .gt("discount_pct", 0)
    .order("discount_pct", { ascending: false })
    .limit(10);

  // Deduplicate deals: best deal per game
  const seenGames = new Set<string>();
  const bestDeals: any[] = [];
  for (const deal of deals || []) {
    const game = (deal as any).games;
    if (seenGames.has(game.id)) continue;
    seenGames.add(game.id);
    bestDeals.push({
      ...deal,
      game: game,
    });
    if (bestDeals.length >= 5) break;
  }

  // Search analytics by title
  const { data: analytics, error: analyticsErr } = await supabase
    .from("analytics_meta")
    .select("id, title, slug, type, excerpt, lootboxes_score, cover_image")
    .ilike("title", `%${q}%`)
    .order("published_at", { ascending: false })
    .limit(5);

  if (gamesErr || dealsErr || analyticsErr) {
    console.error("Search error:", gamesErr || dealsErr || analyticsErr);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    games: games || [],
    deals: bestDeals,
    analytics: analytics || [],
  });
}
