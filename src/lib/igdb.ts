/**
 * IGDB (Internet Game Database) API client.
 *
 * Uses Twitch OAuth2 for authentication.
 * Docs: https://api-docs.igdb.com/
 *
 * Image URL pattern:
 *   https://images.igdb.com/igdb/image/upload/t_{size}/{image_id}.jpg
 *
 * Available sizes:
 *   cover_small    (90x128)
 *   cover_big      (264x374)
 *   screenshot_med (569x320)
 *   screenshot_big (889x500)
 *   720p           (1280x720)
 *   1080p          (1920x1080)
 */

const IGDB_BASE = "https://api.igdb.com/v4";
const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";

let cachedToken: { access_token: string; expires_at: number } | null = null;

/**
 * Get a Twitch OAuth2 app access token (client credentials flow).
 * Tokens are cached until they expire.
 */
export async function getTwitchToken(): Promise<string> {
  // Return cached token if still valid (with 5 min buffer)
  if (cachedToken && Date.now() < cachedToken.expires_at - 300_000) {
    return cachedToken.access_token;
  }

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET must be set");
  }

  const res = await fetch(TWITCH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Twitch token failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };

  return cachedToken.access_token;
}

/**
 * Make a request to the IGDB API.
 * Uses Apicalypse query language (body is a query string, not JSON).
 */
async function igdbQuery<T>(endpoint: string, query: string): Promise<T[]> {
  const token = await getTwitchToken();
  const clientId = process.env.TWITCH_CLIENT_ID!;

  const res = await fetch(`${IGDB_BASE}/${endpoint}`, {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
    body: query,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`IGDB ${endpoint} failed (${res.status}): ${text}`);
  }

  return res.json();
}

// ─── Types ───

export interface IGDBGame {
  id: number;
  name: string;
  cover?: {
    id: number;
    image_id: string;
  };
  screenshots?: {
    id: number;
    image_id: string;
  }[];
}

/** Extended game type for bulk IGDB imports with full metadata */
export interface IGDBBulkGame {
  id: number;
  name: string;
  slug: string;
  cover?: { image_id: string };
  screenshots?: { image_id: string }[];
  genres?: { name: string }[];
  platforms?: { abbreviation: string; name: string }[];
  total_rating?: number;
  first_release_date?: number; // Unix timestamp
  external_games?: { category: number; uid: string }[]; // category 1 = Steam
}

// ─── Public API ───

/**
 * Clean a game title for better IGDB search matching.
 * Strips edition names, DLC markers, platform tags, etc.
 */
function cleanTitle(title: string): string {
  return title
    // Remove common edition/bundle suffixes
    .replace(/\s*[-–—:]\s*(deluxe|gold|premium|ultimate|complete|goty|game of the year|definitive|enhanced|remastered|special|collector'?s?|anniversary|legacy|standard|digital|limited)\s*(edition|version|pack|bundle)?/gi, "")
    // Remove soundtrack/DLC markers
    .replace(/\s*[-–—:]\s*(original\s+)?soundtrack$/gi, "")
    .replace(/\s*[-–—:]\s*(season\s+pass|expansion\s+pass|dlc|upgrade|pack|bundle)$/gi, "")
    // Remove platform tags
    .replace(/\s*\((pc|mac|linux|windows|steam|epic)\)/gi, "")
    // Remove trademark symbols
    .replace(/[™®©]/g, "")
    // Normalize whitespace
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Search for a game by name and return its cover image info.
 * Uses progressive search: exact title → cleaned title → shorter title.
 */
export async function searchGame(title: string): Promise<IGDBGame | null> {
  const escTitle = (t: string) => t.replace(/"/g, '\\"');

  // Attempt 1: Search with exact title
  let results = await igdbQuery<IGDBGame>(
    "games",
    `search "${escTitle(title)}";
     fields name, cover.image_id, screenshots.image_id;
     limit 10;`
  );

  // Attempt 2: Try cleaned title if no results
  const cleaned = cleanTitle(title);
  if (!results.length && cleaned !== title) {
    results = await igdbQuery<IGDBGame>(
      "games",
      `search "${escTitle(cleaned)}";
       fields name, cover.image_id, screenshots.image_id;
       limit 10;`
    );
  }

  // Attempt 3: Try just the first part before colon/dash (e.g. "Witcher 3" from "Witcher 3: Wild Hunt - Complete")
  if (!results.length) {
    const shortTitle = title.split(/\s*[-–—:]\s*/)[0].trim();
    if (shortTitle.length >= 3 && shortTitle !== title && shortTitle !== cleaned) {
      results = await igdbQuery<IGDBGame>(
        "games",
        `search "${escTitle(shortTitle)}";
         fields name, cover.image_id, screenshots.image_id;
         limit 10;`
      );
    }
  }

  if (!results.length) return null;

  // Prefer results that have cover images
  const withCover = results.filter((g) => g.cover?.image_id);

  // Try exact match first (case-insensitive)
  const pool = withCover.length ? withCover : results;
  const titleLower = title.toLowerCase();
  const cleanedLower = cleaned.toLowerCase();

  const exact = pool.find((g) => g.name.toLowerCase() === titleLower);
  if (exact) return exact;

  const cleanedMatch = pool.find((g) => g.name.toLowerCase() === cleanedLower);
  if (cleanedMatch) return cleanedMatch;

  // Return first result with a cover, or just first result
  return withCover[0] || results[0];
}

/**
 * Get multiple games by their exact names.
 * Returns a map of title (lowercased) → IGDBGame.
 */
export async function searchGames(
  titles: string[]
): Promise<Map<string, IGDBGame>> {
  const result = new Map<string, IGDBGame>();

  // IGDB doesn't support batch search, so we search one at a time
  // but we can parallelize with a small concurrency
  const CONCURRENCY = 3;
  for (let i = 0; i < titles.length; i += CONCURRENCY) {
    const batch = titles.slice(i, i + CONCURRENCY);
    const promises = batch.map(async (title) => {
      try {
        const game = await searchGame(title);
        if (game) {
          result.set(title.toLowerCase(), game);
        }
      } catch (err) {
        console.error(`IGDB search failed for "${title}":`, err);
      }
    });
    await Promise.all(promises);

    // Small delay between batches
    if (i + CONCURRENCY < titles.length) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  return result;
}

/**
 * Build the IGDB image URL for a given image_id and size.
 */
export function igdbImageUrl(
  imageId: string,
  size:
    | "cover_small"
    | "cover_big"
    | "screenshot_med"
    | "screenshot_big"
    | "720p"
    | "1080p" = "cover_big"
): string {
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
}

// ─── Bulk Import API ───

/**
 * Fetch a page of games from IGDB with full metadata for bulk import.
 *
 * Filters:
 *  - category = 0 (main games only, excludes DLC/expansions/mods)
 *  - cover != null (guaranteed to have cover art)
 *  - PC/PS4/PS5/Xbox One/Series X|S/Switch platforms
 *  - Sorted by total_rating desc (best-rated games first)
 *
 * IGDB limits: 500 results per request, 4 requests/sec.
 * At 500/request, fetching 9,000 games takes only 18 requests.
 */
export async function bulkFetchGames(
  offset: number,
  limit = 500
): Promise<IGDBBulkGame[]> {
  return igdbQuery<IGDBBulkGame>(
    "games",
    `fields name, slug, cover.image_id, screenshots.image_id,
            genres.name, platforms.abbreviation, platforms.name,
            total_rating, first_release_date,
            external_games.category, external_games.uid;
     where category = 0 & cover != null & platforms = (6,48,49,130,167,169);
     sort id asc;
     limit ${Math.min(limit, 500)};
     offset ${offset};`
  );
}

/**
 * Extract Steam App ID from IGDB external_games array.
 * Category 1 = Steam in IGDB's external game category enum.
 */
export function extractSteamAppId(
  externalGames?: { category: number; uid: string }[]
): string | null {
  if (!externalGames?.length) return null;
  const steam = externalGames.find((eg) => eg.category === 1);
  return steam?.uid || null;
}
