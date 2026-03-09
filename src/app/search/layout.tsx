import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Games & Deals | LootBoxes",
  description:
    "Search across every game, deal, and analytics article on LootBoxes.com. Find the best prices, loot box scores, and monetization analysis.",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
