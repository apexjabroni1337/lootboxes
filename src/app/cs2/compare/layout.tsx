import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS2 Marketplace Comparison — Fees, Features & Trust Ratings",
  description:
    "Compare CS2 skin marketplaces side by side. See seller fees, buyer protection, payment methods, and trust ratings for Skinport, Buff163, DMarket, Tradeit.gg, and more.",
  alternates: {
    canonical: "https://lootboxes.com/cs2/compare",
  },
  openGraph: {
    title: "CS2 Marketplace Comparison — Fees, Features & Trust Ratings",
    description:
      "Compare CS2 skin marketplaces side by side. Fees, buyer protection, payment methods & trust.",
    images: [
      {
        url: "https://lootboxes.com/og-cs2.png",
        width: 1200,
        height: 630,
        alt: "CS2 Marketplace Comparison — LootBoxes.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CS2 Marketplace Comparison",
    description:
      "Compare CS2 skin marketplace fees, features, and trust ratings side by side.",
    images: ["https://lootboxes.com/og-cs2.png"],
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
