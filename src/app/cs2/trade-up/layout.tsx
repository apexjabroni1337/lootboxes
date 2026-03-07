import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import ToolSchema from "@/components/seo/ToolSchema";

export const metadata: Metadata = {
  title: "CS2 Trade-Up Calculator — Expected Value & Profit Analysis",
  description:
    "Calculate the expected value of CS2 trade-up contracts before you commit. Select 10 input skins, see all possible outcomes with probabilities, and analyze profit/loss.",
  alternates: {
    canonical: "https://lootboxes.com/cs2/trade-up",
  },
  openGraph: {
    title: "CS2 Trade-Up Calculator — Expected Value & Profit Analysis",
    description:
      "Calculate the expected value of CS2 trade-up contracts. See all possible outcomes with probabilities.",
    images: [
      {
        url: "https://lootboxes.com/og-cs2.png",
        width: 1200,
        height: 630,
        alt: "CS2 Trade-Up Calculator — LootBoxes.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CS2 Trade-Up Calculator",
    description:
      "Calculate CS2 trade-up contract expected value and profit/loss before you commit.",
    images: ["https://lootboxes.com/og-cs2.png"],
  },
};

export default function TradeUpLayout({
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
          { name: "Trade-Up Calculator", url: "https://lootboxes.com/cs2/trade-up" },
        ]}
      />
      <ToolSchema
        name="CS2 Trade-Up Calculator"
        description="Calculate the expected value of CS2 trade-up contracts. Select 10 input skins, see all possible outcomes with probabilities, and analyze profit/loss."
        url="https://lootboxes.com/cs2/trade-up"
      />
      {children}
    </>
  );
}
