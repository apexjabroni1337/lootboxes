import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | CS2 Skins — LootBoxes",
    default: "CS2 Skins Hub — Price Tracker, Case Simulator & More",
  },
  description:
    "The #1 CS2 skin economy resource. Compare prices across CSFloat, Skinport, Buff163 & DMarket. Open cases with real odds. Calculate trade-ups. Check float values.",
  keywords: [
    "CS2 skins",
    "CS2 skin prices",
    "Counter-Strike 2 skins",
    "CS2 case simulator",
    "CS2 float checker",
    "CS2 trade up calculator",
    "CS2 marketplace comparison",
    "CSFloat",
    "Skinport",
    "Buff163",
  ],
  openGraph: {
    title: "CS2 Skins Hub — LootBoxes",
    description: "Compare CS2 skin prices, simulate case openings, check float values, and calculate trade-ups across all major marketplaces.",
    type: "website",
  },
};

export default function CS2Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
