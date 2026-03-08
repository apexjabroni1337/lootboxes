import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import FAQSchema from "@/components/seo/FAQSchema";

const FAQS = [
  {
    question: "Which countries have banned loot boxes?",
    answer:
      "Belgium and the Netherlands have the strictest bans. Belgium classified paid loot boxes as gambling in 2018 with criminal penalties for publishers. The Netherlands banned loot boxes with tradeable items, though non-tradeable ones remain legal.",
  },
  {
    question: "Do game publishers have to disclose loot box drop rates?",
    answer:
      "It depends on the country. China, South Korea, and Japan (via industry self-regulation) require drop rate disclosure. In most Western countries, disclosure is voluntary — though Apple and Google require it for mobile apps on their stores.",
  },
  {
    question: "Are loot boxes considered gambling?",
    answer:
      "It varies by jurisdiction. Belgium considers them gambling. The UK Gambling Commission says they are not gambling under current law. Australia has called them 'psychologically akin to gambling' without a formal legal classification. The debate is ongoing worldwide.",
  },
  {
    question: "Can minors buy loot boxes?",
    answer:
      "In most countries, yes — there are no specific age restrictions for loot box purchases separate from the game's age rating. China is the strictest, limiting minors to 3 hours of gaming per week with spending caps. Several countries are considering age-verification requirements.",
  },
];

export const metadata: Metadata = {
  title: "Loot Box Laws by Country — Global Regulations Tracker 2026",
  description:
    "Complete tracker of loot box legislation worldwide. See which countries ban loot boxes, require drop rate disclosure, or have pending regulation.",
  alternates: {
    canonical: "https://lootboxes.com/lootbox/regulations",
  },
  openGraph: {
    title: "Loot Box Laws by Country — Global Regulations Tracker 2026",
    description:
      "Which countries ban loot boxes? Which require drop rate disclosure? Complete global legislation tracker.",
    images: [
      {
        url: "https://lootboxes.com/og-default.png",
        width: 1200,
        height: 630,
        alt: "Loot Box Regulations Tracker — LootBoxes.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Loot Box Laws by Country — Global Regulations Tracker",
    description:
      "Which countries ban loot boxes? Complete global legislation tracker.",
    images: ["https://lootboxes.com/og-default.png"],
  },
};

export default function RegulationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://lootboxes.com" },
          { name: "Loot Boxes", url: "https://lootboxes.com/lootbox" },
          { name: "Regulations", url: "https://lootboxes.com/lootbox/regulations" },
        ]}
      />
      <FAQSchema faqs={FAQS} />
      {children}
    </>
  );
}
