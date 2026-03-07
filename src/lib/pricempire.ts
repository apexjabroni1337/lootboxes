/**
 * CS2 skin price client using the FREE Skinport API.
 *
 * Endpoint: GET https://api.skinport.com/v1/items?app_id=730&currency=USD
 * No authentication required.
 *
 * Caches the full item list for 15 minutes (only ~1 request every 15 min).
 *
 * We keep the same exported types/functions so existing API routes don't break.
 * Prices from Skinport are already in dollars (not cents).
 */

const SKINPORT_API = "https://api.skinport.com/v1/items";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

/* ── Types ── */

/** Raw Skinport API item */
interface SkinportItem {
  market_hash_name: string;
  currency: string;
  suggested_price: number | null;
  item_page: string;
  market_page: string;
  min_price: number | null;
  max_price: number | null;
  mean_price: number | null;
  median_price: number | null;
  quantity: number;
  created_at: number;
  updated_at: number;
}

/** Normalized skin price for our frontend — kept compatible with existing code */
export interface SkinPrice {
  name: string; // "AK-47 | Asiimov (Field-Tested)"
  weapon: string; // "AK-47"
  skin: string; // "Asiimov"
  wear: string; // "Field-Tested"
  rarity: string;
  image: string | null;
  prices: {
    steam: number | null;
    csfloat: number | null;
    skinport: number | null;
    buff163: number | null;
    dmarket: number | null;
  };
  cheapestMarket: string;
  cheapestPrice: number;
  steamPrice: number;
  savings: number;
  updatedAt: string | null;
}

/* ── In-memory cache ── */
let cachedData: SkinPrice[] | null = null;
let cacheTimestamp = 0;

/* ── Rarity inference from market_hash_name patterns ── */
function inferRarity(name: string): string {
  if (name.startsWith("★")) return "Covert"; // Knives/gloves
  if (name.includes("Contraband")) return "Contraband";
  return "";
}

/* ── Parse market_hash_name into parts ── */
function parseName(marketHashName: string): { weapon: string; skin: string; wear: string } {
  let name = marketHashName.replace(/^★\s*/, "").replace(/^StatTrak™\s*/, "");

  const wearMatch = name.match(/\(([^)]+)\)\s*$/);
  const wear = wearMatch ? wearMatch[1] : "";
  name = name.replace(/\s*\([^)]+\)\s*$/, "");

  const parts = name.split(" | ");
  const weapon = parts[0]?.trim() || "";
  const skin = parts[1]?.trim() || "";

  return { weapon, skin, wear };
}

/* ── Fetch from Skinport API ── */
async function fetchPrices(): Promise<SkinportItem[]> {
  const url = `${SKINPORT_API}?app_id=730&currency=USD`;

  const res = await fetch(url, {
    headers: {
      "Accept-Encoding": "br, gzip, deflate",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(`[SkinPrices] API error: ${res.status} ${res.statusText}`);
    return [];
  }

  const data: SkinportItem[] = await res.json();
  return data;
}

/* ── Convert raw API data to our SkinPrice format ── */
function transformItem(item: SkinportItem): SkinPrice | null {
  const { weapon, skin, wear } = parseName(item.market_hash_name);

  // Skip items without a skin name (stickers, agents, cases, etc.)
  if (!skin || !wear) return null;

  const validWears = ["Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"];
  if (!validWears.includes(wear)) return null;

  // Skinport gives us their prices — use suggested_price as a Steam-equivalent "reference" price
  // and min_price as the actual Skinport listing price
  const skinportPrice = item.min_price ?? item.suggested_price ?? null;
  const suggestedPrice = item.suggested_price ?? item.min_price ?? 0;

  // We don't have per-marketplace data from the free API,
  // so we set skinport as known and leave others null.
  // The frontend gracefully handles null prices.
  const prices = {
    steam: suggestedPrice > 0 ? suggestedPrice : null, // suggested ≈ market value (Steam-like reference)
    csfloat: null,
    skinport: skinportPrice,
    buff163: null,
    dmarket: null,
  };

  // Cheapest is Skinport (the only real price we have)
  const cheapestPrice = skinportPrice ?? suggestedPrice ?? 0;
  const cheapestMarket = skinportPrice ? "skinport" : "steam";
  const steamPrice = suggestedPrice;
  const savings = steamPrice > 0 && cheapestPrice > 0 ? Math.max(steamPrice - cheapestPrice, 0) : 0;

  const updatedAt = item.updated_at
    ? new Date(item.updated_at * 1000).toISOString()
    : null;

  return {
    name: item.market_hash_name,
    weapon,
    skin,
    wear,
    rarity: inferRarity(item.market_hash_name),
    image: null, // Skinport API doesn't include image URLs in the items endpoint
    prices,
    cheapestMarket,
    cheapestPrice,
    steamPrice,
    savings: Math.max(savings, 0),
    updatedAt,
  };
}

/* ── Public API: Get all skin prices (cached) ── */
export async function getSkinPrices(): Promise<SkinPrice[]> {
  const now = Date.now();

  // Return cached data if still fresh
  if (cachedData && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedData;
  }

  try {
    const rawItems = await fetchPrices();

    if (rawItems.length === 0 && cachedData) {
      console.warn("[SkinPrices] API returned empty, using stale cache");
      return cachedData;
    }

    const skinPrices = rawItems
      .map(transformItem)
      .filter((item): item is SkinPrice => item !== null)
      .filter((item) => item.cheapestPrice > 0)
      .sort((a, b) => b.cheapestPrice - a.cheapestPrice);

    // Update cache
    cachedData = skinPrices;
    cacheTimestamp = now;

    console.log(`[SkinPrices] Fetched ${skinPrices.length} skin prices from Skinport`);
    return skinPrices;
  } catch (error) {
    console.error("[SkinPrices] Fetch error:", error);
    if (cachedData) return cachedData;
    return [];
  }
}

/**
 * Get prices for specific skins by market_hash_name.
 * Uses the cached full list.
 */
export async function getSkinPricesByNames(names: string[]): Promise<SkinPrice[]> {
  const allPrices = await getSkinPrices();
  const nameSet = new Set(names.map((n) => n.toLowerCase()));
  return allPrices.filter((s) => nameSet.has(s.name.toLowerCase()));
}

/**
 * Search skins by query string.
 * Searches weapon name, skin name, and full market_hash_name.
 */
export async function searchSkins(query: string, limit = 50): Promise<SkinPrice[]> {
  const allPrices = await getSkinPrices();
  const q = query.toLowerCase();
  return allPrices
    .filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.weapon.toLowerCase().includes(q) ||
        s.skin.toLowerCase().includes(q)
    )
    .slice(0, limit);
}
