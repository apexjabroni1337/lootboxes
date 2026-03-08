import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import ToolSchema from "@/components/seo/ToolSchema";
import FAQSchema from "@/components/seo/FAQSchema";

const FAQS = [
  {
    question: "Which game has the best loot box odds?",
    answer:
      "It varies by rarity tier, but games like CS2 openly publish their odds (0.26% for knives). Use our Odds Comparison tool to compare drop rates side-by-side across any games in our database.",
  },
  {
    question: "How do pity systems affect loot box odds?",
    answer:
      "Pity systems guarantee a rare item after a set number of pulls. For example, Genshin Impact guarantees a 5-star character within 90 pulls. This dramatically improves effective odds compared to the base drop rate.",
  },
];

export const metadata: Metadata = {
  title: "Compare Loot Box Odds Across Games — Side-by-Side Drop Rates",
  description:
    "Compare loot box drop rates, pity systems, and spending costs side-by-side. Pick any games and see which offers better odds.",
  alternates: {
    canonical: "https://lootboxes.com/lootbox/odds-comparison",
  },
  openGraph: {
    title: "Compare Loot Box Odds Across Games — Side-by-Side Drop Rates",
    description: "Compare loot box drop rates and pity systems side-by-side across games.",
    images: [{ url: "https://lootboxes.com/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Loot Box Odds Comparison Tool",
    description: "Compare drop rates across games side-by-side.",
    images: ["https://lootboxes.com/og-default.png"],
  },
};

export default function OddsComparisonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://lootboxes.com" },
          { name: "Loot Boxes", url: "https://lootboxes.com/lootbox" },
          { name: "Odds Comparison", url: "https://lootboxes.com/lootbox/odds-comparison" },
        ]}
      />
      <ToolSchema
        name="Loot Box Odds Comparison Tool"
        description="Compare loot box drop rates, pity systems, and costs across multiple games side-by-side."
        url="https://lootboxes.com/lootbox/odds-comparison"
      />
      <FAQSchema faqs={FAQS} />
      {children}
    </>
  );
}
