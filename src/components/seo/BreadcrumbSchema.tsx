/**
 * BreadcrumbList JSON-LD structured data component.
 * Helps Google display breadcrumb navigation in search results.
 *
 * Usage:
 *   <BreadcrumbSchema items={[
 *     { name: "Home", url: "https://lootboxes.com" },
 *     { name: "CS2 Skins", url: "https://lootboxes.com/cs2" },
 *     { name: "Price Tracker", url: "https://lootboxes.com/cs2/prices" },
 *   ]} />
 */

interface BreadcrumbItem {
  name: string;
  url: string;
}

export default function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
