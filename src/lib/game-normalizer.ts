/**
 * Normalizes different game/deal data shapes into a unified GameRowData
 * interface for the Steam-style list components.
 */

export interface GameRowData {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  screenshot_image?: string | null;
  genres?: string[] | null;
  platforms?: string[] | null;
  metacritic?: number | null;
  release_date?: string | null;
  hot_score?: number | null;
  // Deal info
  price?: number | null;
  original_price?: number | null;
  discount_pct?: number | null;
  store?: string | null;
  store_url?: string | null;
  affiliate_url?: string | null;
  is_historic_low?: boolean;
  currency?: string;
  // Browse-specific
  dealCount?: number;
  bestPrice?: number | null;
  bestStore?: string | null;
  // Flags
  hasDeal?: boolean;
  isComingSoon?: boolean;
}

/**
 * Normalize a deal object (with nested .games) into GameRowData.
 */
export function normalizeDeal(deal: any): GameRowData {
  const game = deal.games || deal.game || {};
  return {
    id: game.id || deal.id,
    title: game.title || "Unknown",
    slug: game.slug || "",
    cover_image: game.cover_image || null,
    screenshot_image: game.screenshot_image || null,
    genres: game.genres || null,
    platforms: game.platforms || null,
    metacritic: game.metacritic ?? null,
    release_date: game.release_date || null,
    hot_score: game.hot_score ?? null,
    price: deal.price ?? null,
    original_price: deal.original_price ?? null,
    discount_pct: deal.discount_pct ?? null,
    store: deal.store || null,
    store_url: deal.store_url || null,
    affiliate_url: deal.affiliate_url || null,
    is_historic_low: deal.is_historic_low || false,
    currency: deal.currency || "USD",
    hasDeal: deal.hasDeal !== false && deal.store != null,
  };
}

/**
 * Normalize a flat game object (new releases, browse) into GameRowData.
 */
export function normalizeGame(game: any): GameRowData {
  return {
    id: game.id,
    title: game.title || "Unknown",
    slug: game.slug || "",
    cover_image: game.cover_image || null,
    screenshot_image: game.screenshot_image || null,
    genres: game.genres || null,
    platforms: game.platforms || null,
    metacritic: game.metacritic ?? null,
    release_date: game.release_date || null,
    hot_score: game.hot_score ?? null,
    price: game.bestPrice ?? game.price ?? null,
    original_price: game.original_price ?? null,
    discount_pct: game.discount_pct ?? null,
    store: game.bestStore ?? game.store ?? null,
    dealCount: game.dealCount ?? 0,
    bestPrice: game.bestPrice ?? null,
    bestStore: game.bestStore ?? null,
    hasDeal: (game.dealCount ?? 0) > 0 || game.bestPrice != null,
    isComingSoon: game.isComingSoon || false,
  };
}
