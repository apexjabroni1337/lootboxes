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
function buildItemUrl(
  partnerId: string,
  affiliateUrl: string,
  item: string | null
): string {
  if (!item) return affiliateUrl;

  const q = encodeURIComponent(item);

  switch (partnerId) {
    case "skinport":
      // skinport.com/market/csgo?search=ITEM&ref=lootboxes
      return `https://skinport.com/market/csgo?search=${q}&ref=lootboxes`;

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
