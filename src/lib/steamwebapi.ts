/**
 * SteamWebAPI client for multi-marketplace CS2 skin pricing.
 *
 * Uses the SteamWebAPI.com Items endpoint (paid — "Item Small" plan).
 * Docs: https://www.steamwebapi.com/api/doc/steamwebapi-documentation-getting-started
 *
 * ACTUAL API RESPONSE FORMAT (verified via /api/cs2/debug-steam):
 *
 * Each item has:
 *   markethashname  — "AK-47 | Asiimov (Field-Tested)"
 *   itemimage       — Steam CDN image URL
 *   pricelatestsell — latest Steam Market sale price (USD)
 *   pricesafe       — "safe" recommended price
 *   priceavg        — average price
 *   pricemedian     — median price
 *   pricemin / pricemax — range
 *   buyorderprice   — highest Steam buy order
 *   sold24h, sold7d, sold30d — trade volume
 *   rarity, quality, bordercolor, color
 *   wear, minfloat, maxfloat
 *   prices          — ARRAY of marketplace-specific prices:
 *     [{ price: 203.33, source: "bitskins", name: "BitSkins", logo: "...", link: "..." }, ...]
 *     source values include: "skinport", "csfloat", "buff", "bitskins", "dmarket", "waxpeer", etc.
 *
 * Caches responses for 10 minutes to stay within rate limits.
 */

const STEAMWEBAPI_BASE = "https://www.steamwebapi.com/steam/api";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/* ── Types ── */

/** A single marketplace price entry from the `prices` array */
interface MarketplacePriceEntry {
  price: number;
  source: string;
  name: string;
  logo?: string;
  link?: string;
  quantity?: number;
  winloss?: number | null;
}

/** Raw item from the SteamWebAPI /items endpoint */
interface SteamWebApiItem {
  markethashname: string;
  normalizedname?: string;
  slug?: string;
  itemimage?: string;
  // Steam Market pricing
  pricelatest?: number | null;
  pricelatestsell?: number | null;
  pricesafe?: number | null;
  priceavg?: number | null;
  pricemedian?: number | null;
  pricemin?: number | null;
  pricemax?: number | null;
  buyorderprice?: number | null;
  // Volume
  sold24h?: number | null;
  sold7d?: number | null;
  sold30d?: number | null;
  soldtotal?: number | null;
  // Item metadata
  rarity?: string;
  quality?: string;
  bordercolor?: string;
  color?: string;
  wear?: string;
  itemgroup?: string;
  itemtype?: string;
  // Third-party marketplace prices — THE KEY FIELD
  prices?: MarketplacePriceEntry[];
}

/** Normalized multi-marketplace price for our frontend */
export interface MultiMarketPrice {
  name: string;
  weapon: string;
  skin: string;
  wear: string;
  image: string | null;
  rarity: string;
  borderColor: string;
  // Multi-marketplace prices (USD)
  steamPrice: number | null;
  skinportPrice: number | null;
  csfloatPrice: number | null;
  buff163Price: number | null;
  dmarketPrice: number | null;
  bitskinPrice: number | null;
  waxpeerPrice: number | null;
  // Marketplace links (direct from API)
  marketLinks: Record<string, string>;
  // Aggregated stats
  lowestPrice: number | null;
  highestPrice: number | null;
  averagePrice: number | null;
  medianPrice: number | null;
  bestMarket: string | null;
  bestSavingsVsSteam: number | null;
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

/* ── Map API source names to our dealIds ── */
const SOURCE_TO_DEALID: Record<string, string> = {
  skinport: "skinport",
  csfloat: "csfloat",
  buff: "buff163",
  buff163: "buff163",
  dmarket: "dmarket",
  bitskins: "bitskins",
  waxpeer: "waxpeer",
  tradeit: "tradeit",
  mannco: "mannco",
};

/* ── Extract marketplace prices from `prices` array ── */
function extractMarketplacePrices(prices?: MarketplacePriceEntry[]): {
  skinport: number | null;
  csfloat: number | null;
  buff163: number | null;
  dmarket: number | null;
  bitskins: number | null;
  waxpeer: number | null;
  links: Record<string, string>;
} {
  const result = {
    skinport: null as number | null,
    csfloat: null as number | null,
    buff163: null as number | null,
    dmarket: null as number | null,
    bitskins: null as number | null,
    waxpeer: null as number | null,
    links: {} as Record<string, string>,
  };

  if (!prices || !Array.isArray(prices)) return result;

  for (const entry of prices) {
    if (!entry.price || entry.price <= 0) continue;
    const src = entry.source?.toLowerCase();
    const dealId = SOURCE_TO_DEALID[src];
    if (!dealId) continue;

    // Store the link
    if (entry.link) {
      result.links[dealId] = entry.link;
    }

    // Map to our fields
    switch (dealId) {
      case "skinport":
        if (!result.skinport || entry.price < result.skinport) result.skinport = entry.price;
        break;
      case "csfloat":
        if (!result.csfloat || entry.price < result.csfloat) result.csfloat = entry.price;
        break;
      case "buff163":
        if (!result.buff163 || entry.price < result.buff163) result.buff163 = entry.price;
        break;
      case "dmarket":
        if (!result.dmarket || entry.price < result.dmarket) result.dmarket = entry.price;
        break;
      case "bitskins":
        if (!result.bitskins || entry.price < result.bitskins) result.bitskins = entry.price;
        break;
      case "waxpeer":
        if (!result.waxpeer || entry.price < result.waxpeer) result.waxpeer = entry.price;
        break;
    }
  }

  return result;
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

  // Must have weapon | skin format with a valid wear
  if (!skin || !wear) return null;

  const validWears = ["Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"];
  if (!validWears.includes(wear)) return null;

  // Steam Market price: prefer pricelatestsell, fallback to pricesafe
  const steamPrice = raw.pricelatestsell ?? raw.pricesafe ?? raw.pricelatest ?? null;

  // Extract per-marketplace prices from the `prices` array
  const mp = extractMarketplacePrices(raw.prices);

  const thirdPartyPrices: Record<string, number | null> = {
    skinport: mp.skinport,
    csfloat: mp.csfloat,
    buff163: mp.buff163,
    dmarket: mp.dmarket,
    bitskins: mp.bitskins,
    waxpeer: mp.waxpeer,
  };

  const best = findBestMarket(thirdPartyPrices);
  const bestSavings = (steamPrice && best)
    ? Math.max(steamPrice - best.price, 0)
    : null;

  // Compute lowest/highest across ALL sources (steam + 3rd party)
  const allPrices = [
    steamPrice,
    mp.skinport,
    mp.csfloat,
    mp.buff163,
    mp.dmarket,
    mp.bitskins,
    mp.waxpeer,
  ].filter((p): p is number => p != null && p > 0);

  const lowestPrice = allPrices.length ? Math.min(...allPrices) : null;
  const highestPrice = allPrices.length ? Math.max(...allPrices) : null;

  return {
    name: raw.markethashname,
    weapon,
    skin,
    wear,
    image: raw.itemimage || null,
    rarity: raw.rarity || "",
    borderColor: raw.bordercolor || "",
    steamPrice,
    skinportPrice: mp.skinport,
    csfloatPrice: mp.csfloat,
    buff163Price: mp.buff163,
    dmarketPrice: mp.dmarket,
    bitskinPrice: mp.bitskins,
    waxpeerPrice: mp.waxpeer,
    marketLinks: mp.links,
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

  // Only fetch skins (not stickers, cases, etc.) by filtering grouped items
  // Use limit to avoid the 31k+ item full dump
  const url = `${STEAMWEBAPI_BASE}/items?key=${key}&game=cs2&currency=USD&format=json&limit=2000&sort=pricelatestsell&order=desc`;

  console.log("[SteamWebAPI] Fetching items...");
  const start = Date.now();

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
  const elapsed = Date.now() - start;
  console.log(`[SteamWebAPI] Response received in ${elapsed}ms`);

  if (Array.isArray(data)) return data;
  if (data?.items && Array.isArray(data.items)) return data.items;
  if (data?.data && Array.isArray(data.data)) return data.data;

  console.warn("[SteamWebAPI] Unexpected response shape:", Object.keys(data));
  return [];
}

/* ── Public API ── */

/**
 * Get CS2 skin prices from SteamWebAPI (cached 10 min).
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
      `[SteamWebAPI] Processed ${items.length} skins with multi-market prices (from ${rawItems.length} raw items)`
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
