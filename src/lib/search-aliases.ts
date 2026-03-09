/**
 * Game search aliases — maps common abbreviations/alternate names
 * to the actual game titles stored in the database.
 *
 * Used by both the API search route and client-side lootbox database filter.
 */

// Map of alias → array of title substrings to also search for
const SEARCH_ALIASES: Record<string, string[]> = {
  // Counter-Strike
  "cs2": ["counter-strike 2"],
  "cs 2": ["counter-strike 2"],
  "csgo": ["counter-strike"],
  "cs go": ["counter-strike"],
  "cs": ["counter-strike"],
  "counter strike": ["counter-strike"],
  "counter strike 2": ["counter-strike 2"],

  // Popular abbreviations
  "genshin": ["genshin impact"],
  "hsr": ["honkai: star rail", "honkai star rail"],
  "zzz": ["zenless zone zero"],
  "lol": ["league of legends"],
  "dota": ["dota 2"],
  "ow2": ["overwatch 2"],
  "ow": ["overwatch"],
  "cod": ["call of duty"],
  "mw": ["modern warfare"],
  "warzone": ["call of duty: warzone", "warzone"],
  "fifa": ["ea fc", "ea sports fc"],
  "fc 25": ["ea fc 25"],
  "fc25": ["ea fc 25"],
  "pubg": ["playerunknown", "pubg"],
  "poe": ["path of exile"],
  "poe2": ["path of exile 2"],
  "ff14": ["final fantasy xiv"],
  "ffxiv": ["final fantasy xiv"],
  "ff11": ["final fantasy xi"],
  "wow": ["world of warcraft"],
  "rl": ["rocket league"],
  "r6": ["rainbow six"],
  "apex": ["apex legends"],
  "val": ["valorant"],
  "tf2": ["team fortress"],
  "bg3": ["baldur's gate 3", "baldurs gate 3"],
  "elden ring": ["elden ring"],
  "gta": ["grand theft auto"],
  "rdr": ["red dead redemption"],
  "nba 2k": ["nba 2k"],
  "mlbb": ["mobile legends"],
  "ml": ["mobile legends"],
  "aov": ["arena of valor"],
  "hok": ["honor of kings"],
  "dbz": ["dragon ball"],
  "fgo": ["fate/grand order", "fate grand order"],
};

/**
 * Given a user's search query, return an array of additional search terms
 * to try (the original query is always included).
 *
 * Example: expandQuery("cs2") → ["cs2", "counter-strike 2"]
 */
export function expandSearchQuery(query: string): string[] {
  const q = query.toLowerCase().trim();
  const results = [q];

  // Check exact alias match
  if (SEARCH_ALIASES[q]) {
    results.push(...SEARCH_ALIASES[q]);
  }

  // Also check if the query is a prefix of any alias key
  // e.g. "counter strike" should match "counter strike 2" alias
  for (const [alias, expansions] of Object.entries(SEARCH_ALIASES)) {
    if (alias.startsWith(q) && alias !== q) {
      // Only add if query is a meaningful prefix (at least 2 chars)
      if (q.length >= 2) {
        results.push(...expansions);
      }
    }
  }

  return Array.from(new Set(results));
}

/**
 * Client-side: check if a game title matches a search query,
 * including alias expansion.
 */
export function matchesSearch(title: string, query: string): boolean {
  const t = title.toLowerCase();
  const q = query.toLowerCase().trim();

  // Direct match
  if (t.includes(q)) return true;

  // Alias-expanded match
  const expanded = expandSearchQuery(q);
  return expanded.some((term) => t.includes(term));
}
