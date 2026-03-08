import { Metadata } from "next";

const title = "Loot Box Value Calculator — Is It Worth Spending?";
const description =
  "Calculate the true cost of loot boxes in any game. See expected spending per rare item, collection costs, and our value verdict before you spend.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/lootbox/value-calculator" },
  openGraph: {
    title,
    description,
    url: "/lootbox/value-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* ToolSchema */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Loot Box Value Calculator",
            url: "https://lootboxes.com/lootbox/value-calculator",
            applicationCategory: "GameApplication",
            description,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
      {/* BreadcrumbSchema */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://lootboxes.com" },
              { "@type": "ListItem", position: 2, name: "Loot Boxes", item: "https://lootboxes.com/lootbox" },
              { "@type": "ListItem", position: 3, name: "Value Calculator", item: "https://lootboxes.com/lootbox/value-calculator" },
            ],
          }),
        }}
      />
      {/* FAQSchema */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How much do loot boxes really cost?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The true cost depends on the game's drop rates and pity systems. Our calculator shows expected spending based on official drop rates so you can make informed decisions.",
                },
              },
              {
                "@type": "Question",
                name: "Are loot boxes worth the money?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "It varies by game. Games with high transparency, fair drop rates, and pity systems score well. Our value calculator grades each game so you can compare before spending.",
                },
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
