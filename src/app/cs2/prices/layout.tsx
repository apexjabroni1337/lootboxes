import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import ToolSchema from "@/components/seo/ToolSchema";

// Default metadata — overridden by each subpage's own metadata export
export const metadata: Metadata = {
  title: "CS2 Skin Price Tracker — Compare Prices Across 5 Marketplaces",
  description:
    "Compare CS2 skin prices across Steam Market, Skinport, Buff163, DMarket, and Waxpeer in real time. Find the cheapest listing and save money on every skin purchase.",
  alternates: {
    canonical: "https://lootboxes.com/cs2/prices",
  },
  openGraph: {
    title: "CS2 Skin Price Tracker — Compare Prices Across 5 Marketplaces",
    description:
      "Compare CS2 skin prices across Steam Market, Skinport, Buff163, DMarket, and Waxpeer in real time.",
    images: [
      {
        url: "https://lootboxes.com/og-cs2.png",
        width: 1200,
        height: 630,
        alt: "CS2 Skin Price Tracker — LootBoxes.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CS2 Skin Price Tracker",
    description:
      "Compare CS2 skin prices across 5+ marketplaces in real time. Find the cheapest listing.",
    images: ["https://lootboxes.com/og-cs2.png"],
  },
};

export default function PricesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://lootboxes.com" },
          { name: "CS2 Skins", url: "https://lootboxes.com/cs2" },
          { name: "Price Tracker", url: "https://lootboxes.com/cs2/prices" },
        ]}
      />
      <ToolSchema
        name="CS2 Skin Price Tracker"
        description="Compare CS2 skin prices across Steam Market, Skinport, Buff163, DMarket, and Waxpeer in real time. Find the cheapest listing and save money."
        url="https://lootboxes.com/cs2/prices"
      />
      {children}
    </>
  );
}
