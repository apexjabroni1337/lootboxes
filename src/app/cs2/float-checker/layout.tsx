import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import ToolSchema from "@/components/seo/ToolSchema";
import HowToSchema from "@/components/seo/HowToSchema";

export const metadata: Metadata = {
  title: "CS2 Float Value Checker — Look Up Wear, Pattern & Float",
  description:
    "Check CS2 skin float values, wear tiers, and pattern indices. Find low-float gems and rare patterns. Compare prices across marketplaces for similar listings.",
  alternates: {
    canonical: "https://lootboxes.com/cs2/float-checker",
  },
  openGraph: {
    title: "CS2 Float Value Checker — Look Up Wear, Pattern & Float",
    description:
      "Check CS2 skin float values, wear tiers, and pattern indices. Find low-float gems and rare patterns.",
    images: [
      {
        url: "https://lootboxes.com/og-cs2.png",
        width: 1200,
        height: 630,
        alt: "CS2 Float Value Checker — LootBoxes.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CS2 Float Value Checker",
    description:
      "Check CS2 skin float values, wear tiers, and pattern indices. Find low-float gems.",
    images: ["https://lootboxes.com/og-cs2.png"],
  },
};

export default function FloatCheckerLayout({
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
          { name: "Float Checker", url: "https://lootboxes.com/cs2/float-checker" },
        ]}
      />
      <ToolSchema
        name="CS2 Float Value Checker"
        description="Check CS2 skin float values, wear tiers, and pattern indices. Find low-float gems and rare patterns."
        url="https://lootboxes.com/cs2/float-checker"
      />
      <HowToSchema
        name="How to Check CS2 Skin Float Values"
        description="Look up the exact float value, wear tier, and pattern index for any CS2 skin using its inspect link."
        totalTime="PT1M"
        steps={[
          { name: "Get the inspect link", text: "Copy the inspect link for a CS2 skin from Steam, a marketplace listing, or your inventory." },
          { name: "Paste the inspect link", text: "Paste the inspect link into the Float Checker input field." },
          { name: "View float details", text: "See the exact float value, wear tier (Factory New through Battle-Scarred), paint seed, and pattern index." },
          { name: "Compare prices", text: "Check marketplace listings for skins with similar float values to gauge market value." },
        ]}
      />
      {children}
    </>
  );
}
