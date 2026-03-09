import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * GET /api/games/browse
 *
 * Supports two modes:
 * 1. Search mode (q param): searches full library by title using ilike
 * 2. Browse mode (no q): returns paginated games sorted by various criteria
 *
 * Query params:
 *   q       - search query (min 2 chars, searches full library)
 *   offset  - pagination offset (default 0)
 *   limit   - results per page (default 48, max 100)
 *   sort    - trending | deals | metacritic | alpha | price_asc (default: trending)
 *   genre   - genre filter (action, rpg, fps, etc.)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim() || "";
  const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "48", 10)));
  const sort = searchParams.get("sort") || "trending";
  const genre = searchParams.get("genre") || "";

  const supabase = createServerClient();

  // Build games query
  let gamesQuery = supabase
    .from("games")
    .select("id, title, slug, cover_image, screenshot_image, genres, platforms, metacritic, release_date, hot_score", { count: "exact" });

  // Search mode: full-text search across entire library
  if (query.length >= 2) {
    gamesQuery = gamesQuery.ilike("title", `%${query}%`);
  }

  // Genre filter (server-side using Postgres containment)
  // Since genres is a text[] column, we can use contains for exact genre matches
  // But for fuzzy matching we'll do it client-side after fetching

  // Sort
  switch (sort) {
    case "alpha":
      gamesQuery = gamesQuery.order("title", { ascending: true });
      break;
    case "metacritic":
      gamesQuery = gamesQuery.order("metacritic", { ascending: false, nullsFirst: false });
      break;
    case "deals":
    case "price_asc":
    case "trending":
    default:
      // For trending/deals/price, we sort by hot_score first then refine client-side with deal data
      gamesQuery = gamesQuery.order("hot_score", { ascending: false, nullsFirst: false });
      break;
  }

  gamesQuery = gamesQuery.range(offset, offset + limit - 1);

  const { data: games, count: totalCount, error } = await gamesQuery;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!games || games.length === 0) {
    return NextResponse.json({ games: [], totalCount: totalCount || 0, hasMore: false });
  }

  // Get deal stats for these games
  const gameIds = games.map((g) => g.id);
  const { data: deals } = await supabase
    .from("deals")
    .select("game_id, price, store")
    .in("game_id", gameIds)
    .gt("discount_pct", 0);

  const dealStats = new Map<string, { bestPrice: number; dealCount: number; store: string }>();
  for (const deal of deals || []) {
    const existing = dealStats.get(deal.game_id);
    if (!existing) {
      dealStats.set(deal.game_id, { bestPrice: deal.price, dealCount: 1, store: deal.store });
    } else {
      existing.dealCount++;
      if (deal.price < existing.bestPrice) {
        existing.bestPrice = deal.price;
        existing.store = deal.store;
      }
    }
  }

  const enriched = games.map((game: any) => ({
    ...game,
    bestPrice: dealStats.get(game.id)?.bestPrice ?? null,
    dealCount: dealStats.get(game.id)?.dealCount ?? 0,
    bestStore: dealStats.get(game.id)?.store ?? null,
  }));

  return NextResponse.json({
    games: enriched,
    totalCount: totalCount || 0,
    hasMore: offset + limit < (totalCount || 0),
  });
}
