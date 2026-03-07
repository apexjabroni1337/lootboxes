/**
 * PriceEmpire API client with in-memory caching.
 *
 * Fetches CS2 skin prices across 5 marketplaces: Steam, CSFloat, Skinport, Buff163, DMarket.
 * Caches the full item list for 15 minutes to stay well within the free tier (30k req/month).
 *
 * Prices from PriceEmpire are in CENTS (integers). We convert to dollars here.
 */

const API_BASE = "https://api.pricempire.com/v4/paid";
const API_KEY = process.env.PRICEEMPIRE_API_KEY || "";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

/* ── Types ── */

export interface PriceEntry {
  price: number | null; // cents
  count: number | null;
  updated_at: string | null;
  provider_key: string;
}

export interface PricempireItem {
  market_hash_name: string;
  image?: string;
  liquidity?: number;
  count?: number;
  rank?: number;
  prices: PriceEntry[];
}

/** Normalized skin price for our frontend */
export interface SkinPrice {
  name: string; // "AK-47 | Asiimov (Field-Tested)"
  weapon: string; // "AK-47"
  skin: string; // "Asiimov"
  wear: string; // "Field-Tested"
  rarity: string; // We'll infer from name patterns or leave blank
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

/* ── Source keys for our 5 marketplaces ── */
const SOURCES = "steam,csfloat,skinport,buff163,dmarket";
const SOURCE_KEYS = ["steam", "csfloat", "skinport", "buff163", "dmarket"] as const;

/* ── Rarity inference from market_hash_name patterns ── */
function inferRarity(name: string): string {
  if (name.startsWith("★")) return "Covert"; // Knives/gloves
  if (name.includes("Contraband")) return "Contraband";
  // Can't fully determine from name alone — return empty to let frontend fallback
  return "";
}

/* ── Parse market_hash_name into parts ── */
function parseName(marketHashName: string): { weapon: string; skin: string; wear: string } {
  // Remove ★ prefix for knives
  let name = marketHashName.replace(/^★\s*/, "").replace(/^StatTrak™\s*/, "");

  // Extract wear from parentheses at end
  const wearMatch = name.match(/\(([^)]+)\)\s*$/);
  const wear = wearMatch ? wearMatch[1] : "";
  name = name.replace(/\s*\([^)]+\)\s*$/, "");

  // Split by " | "
  const parts = name.split(" | ");
  const weapon = parts[0]?.trim() || "";
  const skin = parts[1]?.trim() || "";

  return { weapon, skin, wear };
}

/* ── Fetch from PriceEmpire API ── */
async function fetchPrices(): Promise<PricempireItem[]> {
  if (!API_KEY) {
    console.warn("[PriceEmpire] No API key set — returning empty data");
    return [];
  }

  const url = `${API_BASE}/items/prices?app_id=730&sources=${SOURCES}&currency=USD`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${API_KEY}` },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(`[PriceEmpire] API error: ${res.status} ${res.statusText}`);
    return [];
  }

  const data: PricempireItem[] = await res.json();
  return data;
}

/* ── Convert raw API data to our SkinPrice format ── */
function transformItem(item: PricempireItem): SkinPrice | null {
  const { weapon, skin, wear } = parseName(item.market_hash_name);

  // Skip items without a skin name (stickers, agents, cases, etc.)
  if (!skin || !wear) return null;

  // Only include items that are actual weapon skins (not stickers, patches, etc.)
  // Simple heuristic: must have weapon | skin format and a wear condition
  const validWears = ["Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"];
  if (!validWears.includes(wear)) return null;

  // Extract prices per marketplace (convert cents to dollars)
  const prices: Record<string, number | null> = {};
  for (const sourceKey of SOURCE_KEYS) {
    const entry = item.prices.find((p) => p.provider_key === sourceKey);
    prices[sourceKey] = entry?.price != null ? entry.price / 100 : null;
  }

  // Find cheapest
  let cheapestMarket = "steam";
  let cheapestPrice = Infinity;
  for (const key of SOURCE_KEYS) {
    const p = prices[key];
    if (p != null && p > 0 && p < cheapestPrice) {
      cheapestPrice = p;
      cheapestMarket = key;
    }
  }
  if (cheapestPrice === Infinity) cheapestPrice = 0;

  const steamPrice = prices.steam ?? 0;
  const savings = steamPrice > 0 && cheapestPrice > 0 ? steamPrice - cheapestPrice : 0;

  // Get latest update time
  const latestUpdate = item.prices
    .filter((p) => p.updated_at)
    .sort((a, b) => new Date(b.updated_at!).getTime() - new Date(a.updated_at!).getTime())[0];

  // Build image URL
  const imageUrl = item.image
    ? `https://cs2-cdn.pricempire.com${item.image}`
    : null;

  return {
    name: item.market_hash_name,
    weapon,
    skin,
    wear,
    rarity: inferRarity(item.market_hash_name),
    image: imageUrl,
    prices: {
      steam: prices.steam ?? null,
      csfloat: prices.csfloat ?? null,
      skinport: prices.skinport ?? null,
      buff163: prices.buff163 ?? null,
      dmarket: prices.dmarket ?? null,
    },
    cheapestMarket,
    cheapestPrice,
    steamPrice,
    savings: Math.max(savings, 0),
    updatedAt: latestUpdate?.updated_at || null,
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
      // API failed but we have stale cache — return stale data
      console.warn("[PriceEmpire] API returned empty, using stale cache");
      return cachedData;
    }

    const skinPrices = rawItems
      .map(transformItem)
      .filter((item): item is SkinPrice => item !== null)
      .filter((item) => item.cheapestPrice > 0) // Skip items with no prices
      .sort((a, b) => b.cheapestPrice - a.cheapestPrice); // Sort by price desc

    // Update cache
    cachedData = skinPrices;
    cacheTimestamp = now;

    console.log(`[PriceEmpire] Fetched ${skinPrices.length} skin prices`);
    return skinPrices;
  } catch (error) {
    console.error("[PriceEmpire] Fetch error:", error);
    // Return stale cache on error
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
