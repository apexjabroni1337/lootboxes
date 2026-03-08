import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import FAQSchema from "@/components/seo/FAQSchema";

const FAQS = [
  {
    question: "Which games publish their loot box drop rates?",
    answer:
      "Games like Genshin Impact, Counter-Strike 2, and Apex Legends publish official drop rates. Our transparency report grades every analyzed game from A to F based on how openly they disclose odds, pricing, and pity system details.",
  },
  {
    question: "Why do loot box drop rates matter?",
    answer:
      "Drop rate transparency lets players make informed spending decisions. Without knowing the odds, you can't calculate expected cost per rare item. Games that hide drop rates are essentially asking you to spend blindly.",
  },
];

export const metadata: Metadata = {
  title: "Loot Box Transparency Report — Which Games Publish Drop Rates?",
  description:
    "Scorecard grading every major game on loot box transparency. See which games openly publish drop rates and which hide them.",
  alternates: {
    canonical: "https://lootboxes.com/lootbox/transparency-report",
  },
  openGraph: {
    title: "Loot Box Transparency Report — Which Games Publish Drop Rates?",
    description:
      "Scorecard grading every major game on loot box transparency.",
    images: [{ url: "https://lootboxes.com/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Loot Box Transparency Report",
    description: "Which games publish loot box drop rates? See the full scorecard.",
    images: ["https://lootboxes.com/og-default.png"],
  },
};

export default function TransparencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://lootboxes.com" },
          { name: "Loot Boxes", url: "https://lootboxes.com/lootbox" },
          { name: "Transparency Report", url: "https://lootboxes.com/lootbox/transparency-report" },
        ]}
      />
      <FAQSchema faqs={FAQS} />
      {children}
    </>
  );
}
