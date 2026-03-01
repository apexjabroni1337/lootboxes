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

// ─── Public API ───

/**
 * Search for a game by name and return its cover image info.
 */
export async function searchGame(title: string): Promise<IGDBGame | null> {
  // Search by exact name first, then fuzzy
  const results = await igdbQuery<IGDBGame>(
    "games",
    `search "${title.replace(/"/g, '\\"')}";
     fields name, cover.image_id, screenshots.image_id;
     limit 5;`
  );

  if (!results.length) return null;

  // Try exact match (case-insensitive)
  const exact = results.find(
    (g) => g.name.toLowerCase() === title.toLowerCase()
  );

  return exact || results[0];
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
