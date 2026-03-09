/**
 * SteamWebAPI client for multi-marketplace CS2 skin pricing.
 *
 * Uses the SteamWebAPI.com Items endpoint (paid — "Item Small" plan).
 * Docs: https://www.steamwebapi.com/api/doc/steamwebapi-documentation-getting-started
 *
 * Provides real-time pricing from Steam Market + third-party marketplaces,
 * enabling true cross-marketplace price comparison on /cs2/prices.
 *
 * Caches responses for 10 minutes to stay within rate limits.
 */

const STEAMWEBAPI_BASE = "https://www.steamwebapi.com/steam/api";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/* ── Types ── */

/** Raw item from the SteamWebAPI /items endpoint */
export interface SteamWebApiItem {
  markethashname: string;
  classid?: string;
  image?: string;
  // Pricing fields (all in USD cents or dollars depending on config)
  pricelatest?: number;        // Latest Steam Market price
  pricereal?: number;          // "Real" aggregated market price
  pricemin?: number;           // Minimum across markets
  pricemax?: number;           // Maximum across markets
  priceavg?: number;           // Average price
  pricemedian?: number;        // Median price
  pricesafe?: number;          // "Safe" recommended price
  buyorderprice?: number;      // Highest buy order on Steam
  sold24h?: number;            // Units sold in last 24h
  sold7d?: number;             // Units sold in last 7 days
  sold30d?: number;            // Units sold in last 30 days
  // Third-party marketplace prices
  priceskinport?: number;
  pricecsfloat?: number;
  pricebuff163?: number;
  [key: string]: string | number | boolean | undefined;
}

/** Normalized multi-marketplace price for our frontend */
export interface MultiMarketPrice {
  name: string;            // market_hash_name
  weapon: string;
  skin: string;
  wear: string;
  image: string | null;
  // Multi-marketplace prices (USD)
  steamPrice: number | null;
  skinportPrice: number | null;
  csfloatPrice: number | null;
  buff163Price: number | null;
  dmarketPrice: number | null;
  // Aggregated stats
  lowestPrice: number | null;
  highestPrice: number | null;
  averagePrice: number | null;
  medianPrice: number | null;
  bestMarket: string | null;         // dealId of cheapest marketplace
  bestSavingsVsSteam: number | null; // savings vs Steam Market price
  // Volume
  sold24h: number;
  sold7d: number;
  sold30d: number;
  // Buy order
  buyOrderPrice: number | null;
}

/* ── Cache ── */
let cachedItems: MultiMarketPrice[] | null = null;
let cacheTimestamp = 0;

/* ── API Key ── */
function getApiKey(): string {
  const key = process.env.STEAMWEBAPI_KEY;
  if (!key) {
    throw new Error(
      "[SteamWebAPI] Missing STEAMWEBAPI_KEY environment variable. " +
      "Get your key from https://www.steamwebapi.com/dashboard"
    );
  }
  return key;
}

/* ── Parse market_hash_name ── */
function parseName(marketHashName: string): { weapon: string; skin: string; wear: string } {
  let name = marketHashName.replace(/^★\s*/, "").replace(/^StatTrak™\s*/, "");
  const wearMatch = name.match(/\(([^)]+)\)\s*$/);
  const wear = wearMatch ? wearMatch[1] : "";
  name = name.replace(/\s*\([^)]+\)\s*$/, "");
  const parts = name.split(" | ");
  return {
    weapon: parts[0]?.trim() || "",
    skin: parts[1]?.trim() || "",
    wear,
  };
}

/* ── Determine cheapest marketplace ── */
function findBestMarket(prices: Record<string, number | null>): { dealId: string; price: number } | null {
  const entries = Object.entries(prices).filter(
    (e): e is [string, number] => e[1] != null && e[1] > 0
  );
  if (entries.length === 0) return null;
  entries.sort((a, b) => a[1] - b[1]);
  return { dealId: entries[0][0], price: entries[0][1] };
}

/* ── Transform raw item ── */
function transformItem(raw: SteamWebApiItem): MultiMarketPrice | null {
  const { weapon, skin, wear } = parseName(raw.markethashname);
  if (!skin || !wear) return null;

  const validWears = ["Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"];
  if (!validWears.includes(wear)) return null;

  const steamPrice = raw.pricelatest ?? raw.pricesafe ?? null;
  const skinportPrice = raw.priceskinport ?? null;
  const csfloatPrice = raw.pricecsfloat ?? null;
  const buff163Price = raw.pricebuff163 ?? null;
  // DMarket not always in SteamWebAPI — use pricereal as fallback
  const dmarketPrice = (raw as Record<string, number | undefined>).pricedmarket ?? null;

  const marketPrices: Record<string, number | null> = {
    skinport: skinportPrice,
    csfloat: csfloatPrice,
    buff163: buff163Price,
    dmarket: dmarketPrice,
  };

  const best = findBestMarket(marketPrices);
  const bestSavings = (steamPrice && best)
    ? Math.max(steamPrice - best.price, 0)
    : null;

  // Compute lowest/highest across ALL sources
  const allPrices = [steamPrice, skinportPrice, csfloatPrice, buff163Price, dmarketPrice]
    .filter((p): p is number => p != null && p > 0);
  const lowestPrice = allPrices.length ? Math.min(...allPrices) : null;
  const highestPrice = allPrices.length ? Math.max(...allPrices) : null;

  return {
    name: raw.markethashname,
    weapon,
    skin,
    wear,
    image: raw.image || null,
    steamPrice,
    skinportPrice,
    csfloatPrice,
    buff163Price,
    dmarketPrice,
    lowestPrice,
    highestPrice,
    averagePrice: raw.priceavg ?? null,
    medianPrice: raw.pricemedian ?? null,
    bestMarket: best?.dealId ?? null,
    bestSavingsVsSteam: bestSavings,
    sold24h: raw.sold24h ?? 0,
    sold7d: raw.sold7d ?? 0,
    sold30d: raw.sold30d ?? 0,
    buyOrderPrice: raw.buyorderprice ?? null,
  };
}

/* ── Fetch from SteamWebAPI ── */
async function fetchItems(): Promise<SteamWebApiItem[]> {
  const key = getApiKey();
  const url = `${STEAMWEBAPI_BASE}/items?key=${key}&game=cs2&currency=USD&format=json`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`[SteamWebAPI] Error ${res.status}: ${text.slice(0, 200)}`);
    return [];
  }

  const data = await res.json();
  // SteamWebAPI may return an array directly or { items: [...] }
  if (Array.isArray(data)) return data;
  if (data?.items && Array.isArray(data.items)) return data.items;
  if (data?.data && Array.isArray(data.data)) return data.data;

  console.warn("[SteamWebAPI] Unexpected response shape:", Object.keys(data));
  return [];
}

/* ── Public API ── */

/**
 * Get all CS2 item prices from SteamWebAPI (cached 10 min).
 * Returns normalized multi-marketplace prices.
 */
export async function getMultiMarketPrices(): Promise<MultiMarketPrice[]> {
  const now = Date.now();

  if (cachedItems && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedItems;
  }

  try {
    const rawItems = await fetchItems();

    if (rawItems.length === 0 && cachedItems) {
      console.warn("[SteamWebAPI] Empty response, using stale cache");
      return cachedItems;
    }

    const items = rawItems
      .map(transformItem)
      .filter((item): item is MultiMarketPrice => item !== null)
      .filter((item) => (item.lowestPrice ?? 0) > 0)
      .sort((a, b) => (b.lowestPrice ?? 0) - (a.lowestPrice ?? 0));

    cachedItems = items;
    cacheTimestamp = now;

    console.log(
      `[SteamWebAPI] Fetched ${items.length} items with multi-market prices`
    );
    return items;
  } catch (error) {
    console.error("[SteamWebAPI] Fetch error:", error);
    if (cachedItems) return cachedItems;
    return [];
  }
}

/**
 * Search multi-market prices by query string.
 */
export async function searchMultiMarket(query: string, limit = 100): Promise<MultiMarketPrice[]> {
  const all = await getMultiMarketPrices();
  const q = query.toLowerCase();
  return all
    .filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.weapon.toLowerCase().includes(q) ||
        s.skin.toLowerCase().includes(q)
    )
    .slice(0, limit);
}

/**
 * Get items with the biggest savings vs Steam Market.
 * Great for a "Best Deals" feature.
 */
export async function getBestDeals(limit = 50): Promise<MultiMarketPrice[]> {
  const all = await getMultiMarketPrices();
  return all
    .filter((item) => (item.bestSavingsVsSteam ?? 0) > 0.5)
    .sort((a, b) => (b.bestSavingsVsSteam ?? 0) - (a.bestSavingsVsSteam ?? 0))
    .slice(0, limit);
}

/**
 * Get the most traded items (by 24h volume).
 */
export async function getMostTraded(limit = 50): Promise<MultiMarketPrice[]> {
  const all = await getMultiMarketPrices();
  return all
    .filter((item) => item.sold24h > 0)
    .sort((a, b) => b.sold24h - a.sold24h)
    .slice(0, limit);
}
