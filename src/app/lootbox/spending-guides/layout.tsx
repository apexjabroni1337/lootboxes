import { Metadata } from "next";

const title = "Free-to-Play Spending Guides — Smart Budgets for Every Game";
const description =
  "Expert spending guides for the most popular free-to-play and loot box games. Learn the best value purchases at every budget level — from $0 to whale.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/lootbox/spending-guides" },
  openGraph: {
    title,
    description,
    url: "/lootbox/spending-guides",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
              { "@type": "ListItem", position: 3, name: "Spending Guides", item: "https://lootboxes.com/lootbox/spending-guides" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
