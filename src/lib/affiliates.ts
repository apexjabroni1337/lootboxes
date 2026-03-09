/**
 * Central affiliate configuration for CS2 skin marketplaces.
 * All affiliate/referral URLs are managed here so every page stays in sync.
 *
 * HOW IT WORKS
 * ─────────────
 * 1. Each marketplace has a `affiliateUrl` (the link with our referral/tracking param).
 * 2. The `/go/[dealId]` API route looks up the dealId here and redirects the user.
 * 3. Every outbound marketplace link on the site should go through `/go/<dealId>`
 *    so we can track clicks server-side and swap URLs without redeploying pages.
 *
 * TO ACTIVATE A NEW PARTNER
 * ─────────────────────────
 * 1. Sign up for their affiliate/referral program.
 * 2. Replace the `affiliateUrl` below with your actual referral link.
 * 3. Set `active: true`.
 */

export interface AffiliatePartner {
  /** Short slug used in /go/<dealId> URLs */
  dealId: string;
  /** Display name */
  name: string;
  /** Brand hex color */
  color: string;
  /** Single-char logo fallback */
  logo: string;
  /** Default (non-affiliate) URL */
  baseUrl: string;
  /** Affiliate / referral URL — replace with your real link once approved */
  affiliateUrl: string;
  /** Whether the affiliate link is live (set true once you have a real referral link) */
  active: boolean;
  /** Seller fee displayed on the site */
  sellerFee: string;
  /** Estimated commission we earn */
  commission: string;
  /** Short tagline */
  tagline: string;
}

export const AFFILIATE_PARTNERS: AffiliatePartner[] = [
  {
    dealId: "csfloat",
    name: "CSFloat",
    color: "#4f8df0",
    logo: "C",
    baseUrl: "https://csfloat.com",
    affiliateUrl: "https://csfloat.com/?ref=lootboxes",
    active: false, // Pending affiliate approval — re-enable once approved
    sellerFee: "2%",
    commission: "~35% of fees",
    tagline: "Lowest fees in the industry",
  },
  {
    dealId: "skinport",
    name: "Skinport",
    color: "#eb4b98",
    logo: "S",
    baseUrl: "https://skinport.com",
    affiliateUrl: "https://skinport.com/?ref=lootboxes",
    active: true,
    sellerFee: "5%",
    commission: "Negotiable",
    tagline: "Best UI & checkout experience",
  },
  {
    dealId: "buff163",
    name: "Buff163",
    color: "#ff6b35",
    logo: "B",
    baseUrl: "https://buff.163.com",
    affiliateUrl: "https://buff.163.com/?ref=lootboxes",
    active: true,
    sellerFee: "2.5%",
    commission: "~20% of fees",
    tagline: "Largest marketplace by volume",
  },
  {
    dealId: "dmarket",
    name: "DMarket",
    color: "#00c9a7",
    logo: "D",
    baseUrl: "https://dmarket.com",
    affiliateUrl: "https://dmarket.com?ref=6Ajfc3hm9r",
    active: true,
    sellerFee: "3%",
    commission: "~20% of fees",
    tagline: "Best for instant crypto cashout",
  },
  {
    dealId: "tradeit",
    name: "Tradeit.gg",
    color: "#5865F2",
    logo: "T",
    baseUrl: "https://tradeit.gg",
    affiliateUrl: "https://tradeit.gg/?aff=LootBoxes.com",
    active: true,
    sellerFee: "0-7%",
    commission: "1% lifetime",
    tagline: "Instant skin trading with low fees",
  },
  {
    dealId: "mannco",
    name: "Mannco.store",
    color: "#cf6a32",
    logo: "M",
    baseUrl: "https://mannco.store",
    affiliateUrl: "https://mannco.store/?ref=yzvmnzj",
    active: true,
    sellerFee: "5%",
    commission: "60% (30 days)",
    tagline: "Generous affiliate — great for TF2 + CS2",
  },
  {
    dealId: "waxpeer",
    name: "Waxpeer",
    color: "#7c3aed",
    logo: "W",
    baseUrl: "https://waxpeer.com",
    affiliateUrl: "https://waxpeer.com/r/lootboxes",
    active: true,
    sellerFee: "5%",
    commission: "~10% of fees",
    tagline: "P2P marketplace with bot trading",
  },
  {
    dealId: "bitskins",
    name: "BitSkins",
    color: "#f97316",
    logo: "B",
    baseUrl: "https://bitskins.com",
    affiliateUrl: "https://bitskins.com/?ref=lootboxes",
    active: false, // Pending KYC verification — re-enable once approved
    sellerFee: "5%",
    commission: "1-40% tiered",
    tagline: "Volume-based affiliate tiers",
  },
  {
    dealId: "steam",
    name: "Steam Market",
    color: "#1b2838",
    logo: "V",
    baseUrl: "https://steamcommunity.com/market",
    affiliateUrl: "https://steamcommunity.com/market",
    active: false, // No affiliate program
    sellerFee: "15%",
    commission: "None",
    tagline: "Most trusted — but highest fees",
  },
];

/** Look up a partner by dealId */
export function getPartner(dealId: string): AffiliatePartner | undefined {
  return AFFILIATE_PARTNERS.find((p) => p.dealId === dealId);
}

/** Get the best URL for a partner (affiliate if active, otherwise base) */
export function getPartnerUrl(dealId: string): string {
  const partner = getPartner(dealId);
  if (!partner) return "#";
  return partner.active ? partner.affiliateUrl : partner.baseUrl;
}

/** The 5 "core" marketplaces shown on price tracker (same order as before) */
export const PRICE_TRACKER_MARKETS = ["steam", "skinport", "buff163", "dmarket", "waxpeer"] as const;
export type PriceMarketKey = (typeof PRICE_TRACKER_MARKETS)[number];

/** The marketplaces shown on the comparison page */
export const COMPARE_MARKETS = ["skinport", "buff163", "dmarket", "tradeit", "mannco", "waxpeer", "steam"] as const;
