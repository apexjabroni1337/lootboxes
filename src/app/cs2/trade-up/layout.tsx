import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import ToolSchema from "@/components/seo/ToolSchema";
import HowToSchema from "@/components/seo/HowToSchema";

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
      <HowToSchema
        name="How to Calculate CS2 Trade-Up Contract Value"
        description="Use the trade-up calculator to determine expected value and profit before committing skins to a trade-up contract."
        totalTime="PT3M"
        steps={[
          { name: "Choose a weapon case", text: "Select a CS2 weapon case from the case picker to browse its available skins." },
          { name: "Pick a rarity tier", text: "Filter by rarity tier (Mil-Spec, Restricted, or Classified) to see eligible trade-up input skins." },
          { name: "Select 10 input skins", text: "Click on 10 skins of the same rarity to add them as trade-up inputs. You can mix skins from different cases." },
          { name: "Review possible outcomes", text: "See every possible outcome skin from the next rarity tier, with probability percentages and estimated market values." },
          { name: "Analyze profit or loss", text: "Check the expected value, win chance, and whether the trade-up is profitable or a losing bet overall." },
        ]}
      />
      {children}
    </>
  );
}
