import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS2 Skin Price Tracker — Compare Prices Across 5 Marketplaces",
  description:
    "Compare CS2 skin prices across Steam Market, CSFloat, Skinport, Buff163, and DMarket in real time. Find the cheapest listing and save money on every skin purchase.",
};

export default function PricesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
