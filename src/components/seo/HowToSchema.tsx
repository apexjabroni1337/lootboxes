/**
 * HowTo JSON-LD structured data component.
 * Enables step-by-step rich results in Google SERPs for tool/guide pages.
 *
 * Usage:
 *   <HowToSchema
 *     name="How to Calculate CS2 Trade-Up Value"
 *     description="Calculate the expected value of a trade-up contract."
 *     steps={[
 *       { name: "Choose a case", text: "Select the weapon case..." },
 *       { name: "Pick 10 skins", text: "Select 10 skins of the same rarity..." },
 *     ]}
 *   />
 */

interface HowToStep {
  name: string;
  text: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration, e.g. "PT5M"
}

export default function HowToSchema({
  name,
  description,
  steps,
  totalTime,
}: HowToSchemaProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...(totalTime && { totalTime }),
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
