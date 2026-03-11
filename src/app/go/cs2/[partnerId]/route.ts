import { NextRequest, NextResponse } from "next/server";
import { getPartner } from "@/lib/affiliates";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Build a deep-link URL for a specific CS2 item on a marketplace.
 * Falls back to the partner's base affiliate URL if no item is provided.
 *
 * Each marketplace has its own URL structure for item search pages.
 * The affiliate/referral param is preserved in all cases.
 */
/**
 * Parse a CS2 item name like "★ Butterfly Knife | Doppler (Factory New)"
 * into its weapon, skin, and wear components.
 */
function parseCS2ItemName(itemName: string): {
  weapon: string;
  skin: string;
  wear: string;
} {
  // Strip leading special chars (★, StatTrak™, Souvenir)
  let cleaned = itemName
    .replace(/^★\s*/, "")
    .replace(/^StatTrak™\s*/i, "")
    .replace(/^Souvenir\s*/i, "")
    .trim();

  // Extract wear from parentheses at the end
  let wear = "";
  const wearMatch = cleaned.match(/\(([^)]+)\)\s*$/);
  if (wearMatch) {
    wear = wearMatch[1];
    cleaned = cleaned.replace(/\s*\([^)]+\)\s*$/, "").trim();
  }

  // Split on " | " to get weapon and skin
  const parts = cleaned.split(" | ");
  const weapon = parts[0]?.trim() || "";
  const skin = parts[1]?.trim() || "";

  return { weapon, skin, wear };
}

/**
 * Map a CS2 weapon name to its Skinport market category.
 */
function getSkinportCategory(weapon: string): string {
  const w = weapon.toLowerCase();

  // Knives
  const knives = [
    "bayonet", "bowie knife", "butterfly knife", "classic knife",
    "falchion knife", "flip knife", "gut knife", "huntsman knife",
    "karambit", "kukri knife", "m9 bayonet", "navaja knife",
    "nomad knife", "paracord knife", "shadow daggers", "skeleton knife",
    "stiletto knife", "survival knife", "talon knife", "ursus knife",
  ];
  if (knives.some((k) => w === k)) return "knife";

  // Gloves
  const gloves = [
    "bloodhound gloves", "broken fang gloves", "driver gloves",
    "hand wraps", "hydra gloves", "moto gloves", "specialist gloves",
    "sport gloves",
  ];
  if (gloves.some((g) => w === g)) return "glove";

  // Rifles
  const rifles = [
    "ak-47", "m4a4", "m4a1-s", "awp", "sg 553", "aug",
    "famas", "galil ar", "ssg 08", "scar-20", "g3sg1",
  ];
  if (rifles.some((r) => w === r)) return "rifle";

  // SMGs
  const smgs = ["mac-10", "mp9", "mp7", "mp5-sd", "pp-bizon", "p90", "ump-45"];
  if (smgs.some((s) => w === s)) return "smg";

  // Pistols
  const pistols = [
    "glock-18", "usp-s", "p250", "desert eagle", "five-seven",
    "tec-9", "cz75-auto", "p2000", "dual berettas", "r8 revolver",
  ];
  if (pistols.some((p) => w === p)) return "pistol";

  // Heavy
  const heavy = ["nova", "xm1014", "mag-7", "sawed-off", "m249", "negev"];
  if (heavy.some((h) => w === h)) return "heavy";

  // Agents
  if (w.includes("agent")) return "agent";

  // Fallback — use the generic market search
  return "";
}

/**
 * Slugify a weapon name for Skinport URL paths.
 * "Butterfly Knife" → "butterfly-knife", "AK-47" → "ak-47"
 */
function skinportSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/™/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Build a Skinport deep-link URL.
 * Format: /market/{category}/{weapon-slug}?item={skin}&ref=lootboxes
 * Example: /market/knife/butterfly-knife?item=Doppler&ref=lootboxes
 */
function buildSkinportUrl(itemName: string): string {
  const { weapon, skin } = parseCS2ItemName(itemName);
  const category = getSkinportCategory(weapon);
  const weaponSlug = skinportSlug(weapon);

  if (category && weaponSlug && skin) {
    const skinParam = encodeURIComponent(skin);
    return `https://skinport.com/market/${category}/${weaponSlug}?item=${skinParam}&ref=lootboxes`;
  }

  // Fallback: use category + type params if we at least have weapon & skin
  if (weapon && skin) {
    return `https://skinport.com/market?type=${encodeURIComponent(weapon)}&item=${encodeURIComponent(skin)}&ref=lootboxes`;
  }

  // Last resort: homepage with ref
  return `https://skinport.com/?ref=lootboxes`;
}

function buildItemUrl(
  partnerId: string,
  affiliateUrl: string,
  item: string | null
): string {
  if (!item) return affiliateUrl;

  const q = encodeURIComponent(item);

  switch (partnerId) {
    case "skinport":
      return buildSkinportUrl(item);

    case "dmarket":
      // dmarket.com/ingame-items/item-list/csgo-skins?title=ITEM&ref=ID
      return `https://dmarket.com/ingame-items/item-list/csgo-skins?title=${q}&ref=6Ajfc3hm9r`;

    case "waxpeer":
      // waxpeer.com/csgo?search=ITEM — ref cookie set by /r/ redirect
      // Use direct search URL with ref param to preserve attribution
      return `https://waxpeer.com/csgo?search=${q}&r=lootboxes`;

    case "tradeit":
      return `https://tradeit.gg/csgo?search=${q}&aff=LootBoxes.com`;

    case "buff163":
      // Buff uses hash-based routing; ref param as query string sets cookie
      return `https://buff.163.com/market/csgo#tab=selling&page_num=1&search=${q}`;

    case "csfloat":
      return `https://csfloat.com/search?market_hash_name=${q}&ref=lootboxes`;

    case "bitskins":
      return `https://bitskins.com/market/csgo?search=${q}&ref=lootboxes`;

    case "mannco":
      return `https://mannco.store/search?q=${q}&ref=yzvmnzj`;

    case "steam":
      return `https://steamcommunity.com/market/search?appid=730&q=${q}`;

    default:
      return affiliateUrl;
  }
}

/**
 * GET /go/cs2/:partnerId
 *
 * CS2 skin marketplace affiliate redirect with click tracking.
 * 1. Looks up partner in affiliates config
 * 2. Logs click to Supabase (fire-and-forget)
 * 3. Redirects to item-specific search page if ?item= is provided,
 *    otherwise redirects to affiliate homepage
 *
 * Query params:
 *   ?from=<page>  — tracks which page originated the click
 *   ?item=<name>  — CS2 item name for deep-linking (e.g., "AK-47 | Redline")
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { partnerId: string } }
) {
  const { partnerId } = params;
  const partner = getPartner(partnerId);

  if (!partner) {
    return NextResponse.redirect(new URL("/cs2/compare", request.url));
  }

  // Log click (fire-and-forget — don't block the redirect)
  try {
    const supabase = createServerClient();
    const referrer = request.headers.get("referer") || null;
    const userAgent = request.headers.get("user-agent") || null;
    const from = request.nextUrl.searchParams.get("from") || null;

    supabase
      .from("clicks")
      .insert({
        deal_id: `cs2-${partnerId}`,
        referrer: from ? `cs2:${from}` : referrer,
        user_agent: userAgent,
      })
      .then(() => {});
  } catch {
    // Don't let tracking errors block the redirect
  }

  const baseUrl = partner.active ? partner.affiliateUrl : partner.baseUrl;
  const item = request.nextUrl.searchParams.get("item") || null;
  const targetUrl = partner.active ? buildItemUrl(partnerId, baseUrl, item) : baseUrl;

  return NextResponse.redirect(targetUrl, { status: 302 });
}
