/**
 * SoftwareApplication JSON-LD structured data for CS2 tools.
 * Marks tools as free web applications in Google's index.
 *
 * Usage:
 *   <ToolSchema
 *     name="CS2 Skin Price Tracker"
 *     description="Compare CS2 skin prices across 5+ marketplaces in real time."
 *     url="https://lootboxes.com/cs2/prices"
 *   />
 */

interface ToolSchemaProps {
  name: string;
  description: string;
  url: string;
}

export default function ToolSchema({ name, description, url }: ToolSchemaProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
