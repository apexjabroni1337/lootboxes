/**
 * IsThereAnyDeal API v2 Client
 * Fetches live deal data from ITAD and maps it into our schema.
 *
 * Docs: https://docs.isthereanydeal.com/
 * Rate limit: 200 req/min on free tier
 */

const ITAD_BASE = "https://api.isthereanydeal.com";

function getKey(): string {
  const key = process.env.ITAD_API_KEY;
  if (!key) throw new Error("Missing ITAD_API_KEY env variable");
  return key;
}

// ---------- Types ----------

export interface ITADPrice {
  amount: number;
  amountInt: number;
  currency: string;
}

export interface ITADDeal {
  id: string;
  slug: string;
  title: string;
  type: string | null;
  deal: {
    shop: { id: number; name: string };
    price: ITADPrice;
    regular: ITADPrice;
    cut: number;
    voucher: string | null;
    storeLow?: ITADPrice;
    historyLow?: ITADPrice;
    flag: string | null;     // "H" = historic low, "S" = store low
    drm: { id: number; name: string }[];
    platforms: { id: number; name: string }[];
    timestamp: string;
    expiry: string | null;
    url: string;
  };
}

export interface ITADGameInfo {
  id: string;
  slug: string;
  title: string;
  type: string | null;
  reviews?: {
    score: number;
    count: number;
    text: string;
  } | null;
  urls: {
    game: string;
  };
}

export interface ITADHistoryPoint {
  timestamp: number;
  shop: { id: string; name: string };
  deal: {
    price: ITADPrice;
    regular: ITADPrice;
    cut: number;
  };
}

// ---------- API Methods ----------

/**
 * Search for games by title.
 * Returns up to `limit` matching games.
 */
export async function searchGames(
  query: string,
  limit = 20
): Promise<{ id: string; slug: string; title: string; type: string | null }[]> {
  const url = new URL(`${ITAD_BASE}/games/search/v1`);
  url.searchParams.set("key", getKey());
  url.searchParams.set("title", query);
  url.searchParams.set("results", String(limit));

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`ITAD search failed: ${res.status}`);
  return res.json();
}

/**
 * Look up a game by exact ITAD ID and get full info.
 */
export async function getGameInfo(ids: string[]): Promise<ITADGameInfo[]> {
  if (!ids.length) return [];
  const url = new URL(`${ITAD_BASE}/games/info/v2`);
  url.searchParams.set("key", getKey());

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ids),
    next: { revalidate: 3600 },
  } as any);
  if (!res.ok) throw new Error(`ITAD game info failed: ${res.status}`);
  return res.json();
}

/**
 * Get current deals/prices for one or more games.
 * This is the primary endpoint we use for the price comparison table.
 */
export async function getPrices(
  ids: string[],
  country = "US",
  shops?: string[]
): Promise<Record<string, ITADDeal["deal"][]>> {
  if (!ids.length) return {};
  const url = new URL(`${ITAD_BASE}/games/prices/v2`);
  url.searchParams.set("key", getKey());
  url.searchParams.set("country", country);
  if (shops?.length) url.searchParams.set("shops", shops.join(","));
  url.searchParams.set("nondeals", "true"); // Include base prices too

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ids),
    next: { revalidate: 300 },
  } as any);
  if (!res.ok) throw new Error(`ITAD prices failed: ${res.status}`);

  // ITAD v2 returns an array: [{id, deals: [...]}]
  // Transform into a Record keyed by ITAD ID for easy lookup
  const raw: { id: string; deals: ITADDeal["deal"][] }[] = await res.json();
  const result: Record<string, ITADDeal["deal"][]> = {};
  for (const entry of raw) {
    result[entry.id] = entry.deals || [];
  }
  return result;
}

/**
 * Get the all-time lowest price for a list of games.
 */
export async function getHistoricLow(
  ids: string[],
  country = "US"
): Promise<
  Record<
    string,
    { shop: { id: string; name: string }; price: ITADPrice; regular: ITADPrice; cut: number; timestamp: string }
  >
> {
  if (!ids.length) return {};
  const url = new URL(`${ITAD_BASE}/games/historylow/v1`);
  url.searchParams.set("key", getKey());
  url.searchParams.set("country", country);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ids),
    next: { revalidate: 3600 },
  } as any);
  if (!res.ok) throw new Error(`ITAD historic low failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch deals list — the main "deals" feed across all games.
 * Supports pagination and filtering.
 */
export async function getDeals(opts: {
  offset?: number;
  limit?: number;
  sort?: string;
  shops?: string[];
  country?: string;
} = {}): Promise<{ list: ITADDeal[]; count: number }> {
  const url = new URL(`${ITAD_BASE}/deals/v2`);
  url.searchParams.set("key", getKey());
  url.searchParams.set("country", opts.country || "US");
  url.searchParams.set("offset", String(opts.offset || 0));
  url.searchParams.set("limit", String(Math.min(opts.limit || 20, 200)));
  if (opts.sort) url.searchParams.set("sort", opts.sort);
  if (opts.shops?.length) url.searchParams.set("shops", opts.shops.join(","));

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ITAD deals failed: ${res.status} ${body}`);
  }
  return res.json();
}

// ---------- Store ID mapper ----------

/**
 * Maps ITAD shop names (lowercased) to our internal store keys.
 * The ITAD v2 API returns numeric shop IDs + string names,
 * so we normalize by lowercasing the name for lookup.
 */
const ITAD_SHOP_MAP: Record<string, string> = {
  steam: "steam",
  gog: "gog",
  "humble store": "humble",
  "humble bundle": "humble",
  "epic game store": "epic",
  fanatical: "fanatical",
  greenmangaming: "gmg",
  "itch.io": "itch",
  wingamestore: "wingamestore",
  gamebillet: "gamebillet",
  "indiegala store": "indiegala",
  "amazon us": "amazon",
  voidu: "voidu",
  direct2drive: "d2d",
  gamersgate: "gamersgate",
  nuuvem: "nuuvem",
  dlgamer: "dlgamer",
  allyouplay: "allyouplay",
  "2game": "2game",
  "gamesplanet us": "gamesplanet",
  gamesload: "gamesload",
  newegg: "newegg",
  planetplay: "planetplay",
};

/**
 * Maps an ITAD shop identifier to our internal store key.
 * Accepts either a shop name (string) or shop object with id/name.
 */
export function mapShopId(shop: string | { id: number; name: string }): string {
  const name = typeof shop === "string" ? shop : shop.name;
  const key = name.toLowerCase();
  return ITAD_SHOP_MAP[key] || key.replace(/\s+/g, "");
}
