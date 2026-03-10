import type { Metadata } from "next";
import { getMostTraded, type MultiMarketPrice } from "@/lib/steamwebapi";
import { getSkinPrices } from "@/lib/pricempire";
import CS2PricesClient from "../CS2PricesClient";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Trending CS2 Skins — Most Traded Skins Right Now",
  description:
    "See which CS2 skins are trending right now. Sorted by 24-hour trade volume across Steam, Skinport, Buff163, DMarket, and Waxpeer.",
  alternates: {
    canonical: "https://lootboxes.com/cs2/prices/trending",
  },
  openGraph: {
    title: "Trending CS2 Skins — Most Traded Skins Right Now",
    description:
      "See which CS2 skins are trending right now, sorted by 24h trade volume across 5 marketplaces.",
    images: [
      {
        url: "https://lootboxes.com/og-cs2.png",
        width: 1200,
        height: 630,
        alt: "Trending CS2 Skins — LootBoxes.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trending CS2 Skins",
    description:
      "Most traded CS2 skins right now across 5+ marketplaces.",
    images: ["https://lootboxes.com/og-cs2.png"],
  },
};

export default async function CS2TrendingPage() {
  let multiItems: MultiMarketPrice[] = [];
  let fallbackItems: any[] = [];

  try {
    const items = await getMostTraded(500);
    multiItems = items.filter((i) => (i.lowestPrice ?? 0) >= 1).slice(0, 500);
  } catch {
    console.warn("[CS2 Trending] Multi-market prefetch failed, trying fallback");
  }

  if (multiItems.length === 0) {
    try {
      const all = await getSkinPrices();
      fallbackItems = all
        .filter((s) => s.cheapestPrice >= 1)
        .sort((a, b) => b.cheapestPrice - a.cheapestPrice)
        .slice(0, 500);
    } catch {
      console.warn("[CS2 Trending] Fallback prefetch also failed");
    }
  }

  return (
    <CS2PricesClient
      initialMultiItems={multiItems}
      initialFallbackItems={fallbackItems}
      defaultMode="trending"
      pageTitle="Trending CS2 Skins"
      pageDescription="The most traded CS2 skins right now — sorted by 24-hour volume. See what the community is buying and selling across 5 marketplaces."
    />
  );
}
