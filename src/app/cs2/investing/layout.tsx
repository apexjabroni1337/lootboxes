import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS2 Skin Investing Guide — How to Profit from CS2 Skins",
  description:
    "Learn how to invest in CS2 skins. Discover which skins appreciate in value, when to buy and sell, and how to build a profitable CS2 skin portfolio.",
  alternates: {
    canonical: "https://lootboxes.com/cs2/investing",
  },
  openGraph: {
    title: "CS2 Skin Investing Guide — How to Profit from CS2 Skins",
    description:
      "Learn how to invest in CS2 skins. Discover which skins appreciate and how to profit.",
    images: [
      {
        url: "https://lootboxes.com/og-cs2.png",
        width: 1200,
        height: 630,
        alt: "CS2 Skin Investing Guide — LootBoxes.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CS2 Skin Investing Guide",
    description:
      "Learn how to invest in CS2 skins and build a profitable portfolio.",
    images: ["https://lootboxes.com/og-cs2.png"],
  },
};

export default function InvestingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
