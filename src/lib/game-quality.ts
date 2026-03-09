/**
 * Game Quality & Promotion Filters
 *
 * Central place to define what makes a game "promotable" — worthy of
 * appearing on featured pages (trending, new releases, deals hub, homepage).
 *
 * Junk games (shovelware, hentai, asset flips, dead games nobody plays)
 * should only be findable via the full "Browse All Games" search or the
 * global search bar. They should NOT appear as cards on curated pages.
 *
 * Signals we use:
 *   1. Title-based filtering (NSFW, asset-flip, junk keywords)
 *   2. Genre-based filtering (sexual content, hentai, etc.)
 *   3. Popularity threshold (hot_score minimum)
 *   4. Image requirement (no cover = not promotable)
 */

// ── Title Blocklist ──
// Games with these words/patterns in their title are never promoted.
// They can still be found via search.
const BLOCKED_TITLE_PATTERNS = [
  // NSFW / Adult content
  /\bhentai\b/i,
  /\bharem\b/i,
  /\bsexy\b/i,
  /\bnaked\b/i,
  /\bnude\b/i,
  /\bstrip\b/i,
  /\bporn\b/i,
  /\berotic\b/i,
  /\badult\s*only\b/i,
  /\bfuta\b/i,
  /\bwaifu\b/i,
  /\bahegao\b/i,
  /\buncensor/i,
  /\blewd\b/i,
  /\bboob/i,
  /\bbikini\s*(party|girls|babes)/i,
  /\bsex\b/i,
  /\bhot\s*girls?\b/i,
  /\bdate\s*(girls?|her|him)\b/i,
  /\blove\s*hotel\b/i,

  // Shovelware / Asset flips
  /\basset\s*flip\b/i,
  /\bclicker\s*(heroes|tycoon)?\s*\d{2,}\b/i, // "Clicker 47839"
  /\b(hentai|anime)\s*(puzzle|jigsaw|match|girls?|babes?)\b/i,
  /\bjigsaw\s*(puzzle\s*)?(18\+|adult|sexy|hentai)\b/i,

  // Non-game software that slips through
  /\bwallpaper\s*(engine|changer)\b/i,
  /\bscreensaver\b/i,
  /\bdesktop\s*(pet|buddy|waifu)\b/i,

  // Non-game products (guides, soundtracks, artbooks, etc.)
  /\bofficial\s*guide\b/i,
  /\b(strategy|game|player'?s?)\s*guide\b/i,
  /\bguidebook\b/i,
  /\bartbook\b/i,
  /\bart\s*book\b/i,
  /\bsoundtrack\b/i,
  /\boriginal\s*soundtrack\b/i,
  /\b(ost)\b/i,
  /\bwallpaper\s*pack\b/i,
  /\bdigital\s*(art|comic|novel)\b/i,

  // Test / Placeholder games
  /^test\s*game$/i,
  /^untitled$/i,
  /^game\s*\d+$/i,
];

// ── Genre Blocklist ──
// Games tagged with these genres are not promoted on curated pages.
const BLOCKED_GENRES = [
  "sexual content",
  "nudity",
  "hentai",
  "adult only",
  "nsfw",
  "erotic",
];

// ── Tag Blocklist ──
// Games with these tags are not promoted.
const BLOCKED_TAGS = [
  "sexual content",
  "nudity",
  "hentai",
  "adult only",
  "nsfw",
  "mature",
];

/**
 * Check if a game's title contains blocked patterns.
 */
export function hasBadTitle(title: string): boolean {
  return BLOCKED_TITLE_PATTERNS.some((pattern) => pattern.test(title));
}

/**
 * Check if a game's genres contain blocked content.
 */
export function hasBadGenres(genres: string[] | null | undefined): boolean {
  if (!genres || genres.length === 0) return false;
  return genres.some((g) => {
    const lower = g.toLowerCase();
    return BLOCKED_GENRES.some((blocked) => lower.includes(blocked));
  });
}

/**
 * Check if a game's tags contain blocked content.
 */
export function hasBadTags(tags: string[] | null | undefined): boolean {
  if (!tags || tags.length === 0) return false;
  return tags.some((t) => {
    const lower = t.toLowerCase();
    return BLOCKED_TAGS.some((blocked) => lower.includes(blocked));
  });
}

/**
 * Minimum hot_score for a game to appear on curated/featured pages.
 * Games below this threshold are considered "not popular enough" and
 * only show up in search / browse-all.
 *
 * Scoring reference:
 *   0-10:   No deals, no popularity, unknown game
 *   10-30:  Has some deals but not popular
 *   30-60:  Decent deals or moderate popularity
 *   60-100: Good deals + some recognition
 *   100+:   Popularity-ranked by sync-popularity (genuine Steam players)
 */
export const MIN_HOT_SCORE_FOR_PROMOTION = 5;

/**
 * Master filter: should this game appear on curated/featured pages?
 *
 * Use this on any page that shows game cards as recommendations
 * (trending, new releases, deals, homepage features).
 *
 * Do NOT use this on:
 *   - Browse All Games (search results)
 *   - Global search bar results
 *   - Individual game detail pages
 *   - Lootbox database (those are hand-curated)
 */
export function isPromotableGame(game: {
  title: string;
  cover_image?: string | null;
  hot_score?: number | null;
  genres?: string[] | null;
  tags?: string[] | null;
}): boolean {
  // Must have a real cover image — no placeholder games
  // Empty strings and whitespace-only values don't count
  if (!game.cover_image || game.cover_image.trim().length === 0) return false;

  // Title check
  if (hasBadTitle(game.title)) return false;

  // Genre check
  if (hasBadGenres(game.genres)) return false;

  // Tag check
  if (hasBadTags(game.tags)) return false;

  // Popularity threshold — games nobody plays don't get promoted
  if ((game.hot_score ?? 0) < MIN_HOT_SCORE_FOR_PROMOTION) return false;

  return true;
}

/**
 * Filter an array of games to only promotable ones.
 * Convenience wrapper around isPromotableGame.
 */
export function filterPromotableGames<T extends {
  title: string;
  cover_image?: string | null;
  hot_score?: number | null;
  genres?: string[] | null;
  tags?: string[] | null;
}>(games: T[]): T[] {
  return games.filter(isPromotableGame);
}

/**
 * For deal-based queries where game data is nested under `.games`,
 * filter deals where the associated game is promotable.
 *
 * Historic low deals get a relaxed hot_score threshold — if a game
 * is at its all-time lowest price, it's noteworthy even if niche.
 */
export function filterPromotableDeals<T extends { games: any; is_historic_low?: boolean }>(deals: T[]): T[] {
  return deals.filter((deal) => {
    const game = deal.games;
    if (!game) return false;

    // Always block NSFW / junk titles & genres
    if (hasBadTitle(game.title || "")) return false;
    if (hasBadGenres(game.genres)) return false;
    if (hasBadTags(game.tags)) return false;

    // Must have a real cover image
    if (!game.cover_image || game.cover_image.trim().length === 0) return false;

    // Historic lows skip the hot_score check — they're inherently notable
    if ((deal as any).is_historic_low) return true;

    // Regular deals still need minimum popularity
    if ((game.hot_score ?? 0) < MIN_HOT_SCORE_FOR_PROMOTION) return false;

    return true;
  });
}

// ── DLC / Edition Deduplication ──

/**
 * Extract a "base title" from a game name to group DLC / edition variants.
 * "Kitaria Fables - Grouch Christmas Outfit" → "kitaria fables"
 * "Pals Go Only Up - Knight Character"       → "pals go only up"
 * "XEL Save the World Edition"               → "xel save the world"
 * "Elden Ring"                                → "elden ring"
 */
export function getBaseTitle(title: string): string {
  let base = title.toLowerCase().trim();

  // Strip everything after common DLC/edition separators
  // " - " is the most common: "Game - DLC Name"
  const dashIdx = base.indexOf(" - ");
  if (dashIdx > 3) base = base.substring(0, dashIdx);

  // Strip trailing ": DLC Name" style separators
  const colonIdx = base.indexOf(": ");
  if (colonIdx > 3) base = base.substring(0, colonIdx);

  // Strip edition suffixes
  base = base
    .replace(/\s+(edition|pack|bundle|collection|dlc|character|upgrade|pass|season|chapter|episode|volume|vol)\b.*$/i, "")
    .replace(/\s+(goty|game\s*of\s*the\s*year|deluxe|gold|premium|ultimate|complete|enhanced|definitive|standard|special)\b.*$/i, "")
    .replace(/\s+(soundtrack|ost|artbook|art\s*book|wallpaper|skin|costume|outfit)\b.*$/i, "")
    .trim();

  return base;
}

/**
 * Collapse DLC/edition/character-pack variants so only one entry per
 * base game appears in the list. Keeps the deal with the highest
 * priority: historic low > higher hot_score > bigger discount.
 *
 * Works with any deal shape where game data is nested under `.games`.
 */
export function deduplicateByBaseTitle<T extends { games?: any; is_historic_low?: boolean; discount_pct?: number }>(deals: T[]): T[] {
  const byBase = new Map<string, T>();
  for (const deal of deals) {
    const title = deal.games?.title || "";
    const base = getBaseTitle(title);
    const existing = byBase.get(base);
    if (!existing) {
      byBase.set(base, deal);
    } else {
      // Prefer: historic low > higher hot_score > bigger discount
      const existingHL = (existing as any).is_historic_low;
      const newHL = (deal as any).is_historic_low;
      if (newHL && !existingHL) {
        byBase.set(base, deal);
      } else if (!newHL && existingHL) {
        // keep existing
      } else {
        const existingScore = existing.games?.hot_score || 0;
        const newScore = deal.games?.hot_score || 0;
        if (newScore > existingScore) {
          byBase.set(base, deal);
        } else if (newScore === existingScore && (deal.discount_pct || 0) > ((existing as any).discount_pct || 0)) {
          byBase.set(base, deal);
        }
      }
    }
  }
  return Array.from(byBase.values());
}
