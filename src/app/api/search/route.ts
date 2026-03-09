import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { expandSearchQuery } from "@/lib/search-aliases";

export const dynamic = "force-dynamic";

/**
 * GET /api/search?q=elden+ring — Search across games, deals & analytics.
 *
 * Returns combined results from games, deals, and analytics_meta tables.
 * Supports alias expansion (e.g. "CS2" → "Counter-Strike 2").
 * Used by SearchDialog and /search page (client-side fetch with debounce).
 */
export async function GET(request: NextRequest) {
  try {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2 || q.length > 200) {
    return NextResponse.json({ games: [], deals: [], analytics: [] });
  }

  const supabase = createServerClient();

  // Sanitize input: strip characters that could break PostgREST filter syntax
  const sanitize = (s: string) => s.replace(/[,()."'\\]/g, "");

  // Expand query with aliases (e.g. "cs2" → ["cs2", "counter-strike 2"])
  const searchTerms = expandSearchQuery(q).map(sanitize).filter(Boolean);

  if (searchTerms.length === 0) {
    return NextResponse.json({ games: [], deals: [], analytics: [] });
  }

  // Build OR filter for games: match any of the expanded terms
  const gameFilter = searchTerms.map((t) => `title.ilike.%${t}%`).join(",");

  // Search games by title with alias expansion
  const { data: games, error: gamesErr } = await supabase
    .from("games")
    .select("id, title, slug, cover_image, platforms, genres, lootboxes_score")
    .or(gameFilter)
    .order("title")
    .limit(8);

  // Search deals with alias expansion
  // For deals with join, we need to search per term and merge
  let allDeals: any[] = [];
  let dealsErr: any = null;
  for (const term of searchTerms) {
    const { data: deals, error } = await supabase
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
      .ilike("games.title", `%${term}%`)
      .gt("discount_pct", 0)
      .order("discount_pct", { ascending: false })
      .limit(10);

    if (error) {
      dealsErr = error;
    } else if (deals) {
      allDeals.push(...deals);
    }
  }

  // Deduplicate deals: best deal per game
  // Sort by discount first
  allDeals.sort((a: any, b: any) => (b.discount_pct || 0) - (a.discount_pct || 0));
  const seenGames = new Set<string>();
  const bestDeals: any[] = [];
  for (const deal of allDeals) {
    const game = (deal as any).games;
    if (seenGames.has(game.id)) continue;
    seenGames.add(game.id);
    bestDeals.push({
      ...deal,
      game: game,
    });
    if (bestDeals.length >= 5) break;
  }

  // Search analytics by title with alias expansion
  const analyticsFilter = searchTerms.map((t) => `title.ilike.%${t}%`).join(",");
  const { data: analytics, error: analyticsErr } = await supabase
    .from("analytics_meta")
    .select("id, title, slug, type, excerpt, lootboxes_score, cover_image")
    .or(analyticsFilter)
    .order("published_at", { ascending: false })
    .limit(5);

  if (gamesErr || dealsErr || analyticsErr) {
    console.error("[API /search] Error:", gamesErr || dealsErr || analyticsErr);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      games: games || [],
      deals: bestDeals,
      analytics: analytics || [],
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
  } catch (err: any) {
    console.error("[API /search] Unhandled error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
