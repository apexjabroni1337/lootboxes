import { Metadata } from "next";

const title = "CS2 Skin Deals — Best Prices Across All Marketplaces";
const description =
  "Find the biggest savings on CS2 skins. Compare prices across Skinport, Buff163, DMarket, Waxpeer and more — updated every 10 minutes.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/cs2/deals" },
  openGraph: { title, description, url: "/cs2/deals", type: "website" },
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
              { "@type": "ListItem", position: 2, name: "CS2 Skins", item: "https://lootboxes.com/cs2" },
              { "@type": "ListItem", position: 3, name: "Deals", item: "https://lootboxes.com/cs2/deals" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
