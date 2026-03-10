import type { Metadata } from "next";
import CS2PricesClient from "../CS2PricesClient";

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

export default function CS2BestDealsPage() {
  return (
    <CS2PricesClient
      initialMultiItems={[]}
      initialFallbackItems={[]}
      defaultMode="deals"
      pageTitle="Best CS2 Skin Deals"
      pageDescription="Live deals on CS2 skins — sorted by biggest savings vs Steam Market. Compare prices across 5 marketplaces and save on every purchase."
    />
  );
}
