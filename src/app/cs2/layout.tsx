import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | CS2 Skins — LootBoxes",
    default: "CS2 Skins Hub — Price Tracker, Case Simulator & More",
  },
  description:
    "The #1 CS2 skin economy resource. Compare prices across Skinport, Buff163, DMarket & Waxpeer. Open cases with real odds. Calculate trade-ups. Check float values.",
  keywords: [
    "CS2 skins",
    "CS2 skin prices",
    "Counter-Strike 2 skins",
    "CS2 case simulator",
    "CS2 float checker",
    "CS2 trade up calculator",
    "CS2 marketplace comparison",
    "Skinport",
    "Waxpeer",
    "Buff163",
  ],
  openGraph: {
    title: "CS2 Skins Hub — LootBoxes",
    description:
      "Compare CS2 skin prices, simulate case openings, check float values, and calculate trade-ups across all major marketplaces.",
    type: "website",
    images: [
      {
        url: "https://lootboxes.com/og-cs2.png",
        width: 1200,
        height: 630,
        alt: "CS2 Skins Hub — LootBoxes.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CS2 Skins Hub — LootBoxes",
    description:
      "Compare CS2 skin prices, simulate case openings, check float values, and calculate trade-ups.",
    images: ["https://lootboxes.com/og-cs2.png"],
  },
  alternates: {
    canonical: "https://lootboxes.com/cs2",
  },
};

export default function CS2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
