import type { Metadata } from "next";
import { getMultiMarketPrices, getBestDeals, type MultiMarketPrice } from "@/lib/steamwebapi";
import { getSkinPrices } from "@/lib/pricempire";
import CS2PricesClient from "../CS2PricesClient";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "CS2 Best Skin Deals — Cheapest Prices vs Steam Market",
  description:
    "Find the best CS2 skin deals right now. Compare prices across Skinport, Buff163, DMarket, and Waxpeer to find the biggest savings vs Steam Market prices.",
  alternates: {
    canonical: "https://lootboxes.com/cs2/prices/best-deals",
  },
  openGraph: {
    title: "CS2 Best Skin Deals — Cheapest Prices vs Steam Market",
    description:
      "Find the best CS2 skin deals right now. Compare prices across 5 marketplaces to save the most.",
    images: [
      {
        url: "https://lootboxes.com/og-cs2.png",
        width: 1200,
        height: 630,
        alt: "CS2 Best Skin Deals — LootBoxes.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CS2 Best Skin Deals",
    description:
      "Find the biggest savings on CS2 skins across 5+ marketplaces.",
    images: ["https://lootboxes.com/og-cs2.png"],
  },
};

export default async function CS2BestDealsPage() {
  let multiItems: MultiMarketPrice[] = [];
  let fallbackItems: any[] = [];

  try {
    const items = await getBestDeals(500);
    multiItems = items.filter((i) => (i.lowestPrice ?? 0) >= 1).slice(0, 500);
  } catch {
    console.warn("[CS2 Best Deals] Multi-market prefetch failed, trying fallback");
  }

  if (multiItems.length === 0) {
    try {
      const all = await getSkinPrices();
      fallbackItems = all
        .filter((s) => s.cheapestPrice >= 1 && s.savings > 0.5)
        .sort((a, b) => b.savings - a.savings)
        .slice(0, 500);
    } catch {
      console.warn("[CS2 Best Deals] Fallback prefetch also failed");
    }
  }

  return (
    <CS2PricesClient
      initialMultiItems={multiItems}
      initialFallbackItems={fallbackItems}
      defaultMode="deals"
      pageTitle="Best CS2 Skin Deals"
      pageDescription="Live deals on CS2 skins — sorted by biggest savings vs Steam Market. Compare prices across 5 marketplaces and save on every purchase."
    />
  );
}
