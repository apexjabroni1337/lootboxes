/**
 * CS2 skin price client using the FREE Skinport API.
 *
 * Endpoint: GET https://api.skinport.com/v1/items?app_id=730&currency=USD
 * No authentication required.
 *
 * Caches the full item list for 15 minutes.
 * Prices from Skinport are already in dollars.
 */

const SKINPORT_API = "https://api.skinport.com/v1/items";
const BYMYKEL_SKINS_API =
  "https://bymykel.github.io/CSGO-API/api/en/skins.json";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const IMAGE_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours (images rarely change)

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

/** Normalized skin price for our frontend */
export interface SkinPrice {
  name: string;            // "AK-47 | Asiimov (Field-Tested)"
  weapon: string;          // "AK-47"
  skin: string;            // "Asiimov"
  wear: string;            // "Field-Tested"
  rarity: string;
  image: string | null;
  // All prices from Skinport (in USD)
  skinportPrice: number | null;   // min_price — cheapest current listing on Skinport
  marketValue: number | null;     // suggested_price — Skinport's estimated market value
  medianPrice: number | null;     // median_price — median recent sale price
  meanPrice: number | null;       // mean_price — average recent sale price
  quantity: number;               // number of listings on Skinport
  itemPage: string | null;        // direct link to Skinport item page
  // Convenience fields
  cheapestPrice: number;          // best price we know of (skinportPrice or marketValue)
  savings: number;                // marketValue - skinportPrice (when positive)
  updatedAt: string | null;
}

/** Minimal ByMykel skin item (only fields we need) */
interface ByMykelSkin {
  market_hash_name?: string;
  image?: string;
}

/* ── In-memory caches ── */
let cachedData: SkinPrice[] | null = null;
let cacheTimestamp = 0;

/** Map of market_hash_name → image URL (and base name → image for fallback) */
let imageMap: Map<string, string> | null = null;
let imageMapTimestamp = 0;

/* ── Fetch skin images from ByMykel CSGO API ── */
async function fetchImageMap(): Promise<Map<string, string>> {
  const now = Date.now();
  if (imageMap && now - imageMapTimestamp < IMAGE_CACHE_TTL_MS) {
    return imageMap;
  }

  try {
    const res = await fetch(BYMYKEL_SKINS_API, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      console.error(`[SkinImages] ByMykel API error: ${res.status}`);
      return imageMap ?? new Map();
    }

    const skins: ByMykelSkin[] = await res.json();
    const map = new Map<string, string>();

    for (const skin of skins) {
      if (!skin.market_hash_name || !skin.image) continue;

      // Exact match key (includes wear)
      map.set(skin.market_hash_name.toLowerCase(), skin.image);

      // Also store by base name (without wear) for fallback matching
      const baseName = skin.market_hash_name
        .replace(/\s*\([^)]+\)\s*$/, "")
        .toLowerCase();
      if (!map.has(baseName)) {
        map.set(baseName, skin.image);
      }
    }

    imageMap = map;
    imageMapTimestamp = now;
    console.log(`[SkinImages] Loaded ${map.size} image mappings from ByMykel`);
    return map;
  } catch (error) {
    console.error("[SkinImages] ByMykel fetch error:", error);
    return imageMap ?? new Map();
  }
}

/** Look up image URL for a market_hash_name */
function lookupImage(
  map: Map<string, string>,
  marketHashName: string
): string | null {
  const key = marketHashName.toLowerCase();
  // Try exact match first (e.g. "AK-47 | Asiimov (Field-Tested)")
  const exact = map.get(key);
  if (exact) return exact;

  // Fallback: try base name without wear condition
  const baseName = key.replace(/\s*\([^)]+\)\s*$/, "");
  return map.get(baseName) ?? null;
}

/* ── Rarity inference from market_hash_name patterns ── */
function inferRarity(name: string): string {
  if (name.startsWith("★")) return "Covert";
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
    headers: { "Accept-Encoding": "br, gzip, deflate" },
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

  if (!skin || !wear) return null;

  const validWears = ["Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"];
  if (!validWears.includes(wear)) return null;

  const skinportPrice = item.min_price;
  const marketValue = item.suggested_price;
  const cheapestPrice = skinportPrice ?? marketValue ?? 0;
  const savings = (marketValue && skinportPrice && marketValue > skinportPrice)
    ? marketValue - skinportPrice
    : 0;

  const updatedAt = item.updated_at
    ? new Date(item.updated_at * 1000).toISOString()
    : null;

  return {
    name: item.market_hash_name,
    weapon,
    skin,
    wear,
    rarity: inferRarity(item.market_hash_name),
    image: null,
    skinportPrice,
    marketValue,
    medianPrice: item.median_price,
    meanPrice: item.mean_price,
    quantity: item.quantity ?? 0,
    itemPage: item.item_page || null,
    cheapestPrice,
    savings: Math.max(savings, 0),
    updatedAt,
  };
}

/* ── Public API: Get all skin prices (cached) ── */
export async function getSkinPrices(): Promise<SkinPrice[]> {
  const now = Date.now();

  if (cachedData && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedData;
  }

  try {
    // Fetch prices and images in parallel
    const [rawItems, imgMap] = await Promise.all([
      fetchPrices(),
      fetchImageMap(),
    ]);

    if (rawItems.length === 0 && cachedData) {
      console.warn("[SkinPrices] API returned empty, using stale cache");
      return cachedData;
    }

    const skinPrices = rawItems
      .map(transformItem)
      .filter((item): item is SkinPrice => item !== null)
      .filter((item) => item.cheapestPrice > 0)
      .sort((a, b) => b.cheapestPrice - a.cheapestPrice);

    // Merge images from ByMykel
    let imagesFound = 0;
    for (const skin of skinPrices) {
      const img = lookupImage(imgMap, skin.name);
      if (img) {
        skin.image = img;
        imagesFound++;
      }
    }

    cachedData = skinPrices;
    cacheTimestamp = now;

    console.log(
      `[SkinPrices] Fetched ${skinPrices.length} skin prices from Skinport, ${imagesFound} with images`
    );
    return skinPrices;
  } catch (error) {
    console.error("[SkinPrices] Fetch error:", error);
    if (cachedData) return cachedData;
    return [];
  }
}

/**
 * Get prices for specific skins by market_hash_name.
 */
export async function getSkinPricesByNames(names: string[]): Promise<SkinPrice[]> {
  const allPrices = await getSkinPrices();
  const nameSet = new Set(names.map((n) => n.toLowerCase()));
  return allPrices.filter((s) => nameSet.has(s.name.toLowerCase()));
}

/**
 * Search skins by query string.
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
