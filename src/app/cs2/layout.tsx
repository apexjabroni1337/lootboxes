import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | CS2 Skins — LootBoxes",
    default: "CS2 Skins — LootBoxes",
  },
  description:
    "The #1 CS2 skin economy resource. Track prices, simulate case openings, compare marketplaces, and maximize your skin investments.",
};

export default function CS2Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
