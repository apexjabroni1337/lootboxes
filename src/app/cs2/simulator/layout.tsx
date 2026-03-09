import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import ToolSchema from "@/components/seo/ToolSchema";
import HowToSchema from "@/components/seo/HowToSchema";

export const metadata: Metadata = {
  title: "CS2 Case Opening Simulator — Real Valve Odds, No Money Required",
  description:
    "Open CS2 cases with real Valve drop rates for free. See how much you'd really spend to get that knife. Track your simulated profit/loss across sessions.",
  alternates: {
    canonical: "https://lootboxes.com/cs2/simulator",
  },
  openGraph: {
    title: "CS2 Case Opening Simulator — Real Valve Odds",
    description:
      "Open CS2 cases with real Valve drop rates for free. Track your simulated profit/loss.",
    images: [
      {
        url: "https://lootboxes.com/og-cs2.png",
        width: 1200,
        height: 630,
        alt: "CS2 Case Opening Simulator — LootBoxes.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CS2 Case Opening Simulator",
    description:
      "Open CS2 cases with real Valve drop rates for free. No money required.",
    images: ["https://lootboxes.com/og-cs2.png"],
  },
};

export default function SimulatorLayout({
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
          { name: "Case Simulator", url: "https://lootboxes.com/cs2/simulator" },
        ]}
      />
      <ToolSchema
        name="CS2 Case Opening Simulator"
        description="Open CS2 cases with real Valve drop rates for free. See how much you'd really spend to get that knife."
        url="https://lootboxes.com/cs2/simulator"
      />
      <HowToSchema
        name="How to Use the CS2 Case Opening Simulator"
        description="Simulate opening CS2 cases with real Valve drop rates without spending real money."
        totalTime="PT2M"
        steps={[
          { name: "Select a case", text: "Browse the list of all CS2 weapon cases and click on the one you want to open." },
          { name: "Open the case", text: "Click the Open Case button to simulate an unboxing using real Valve drop rate percentages." },
          { name: "View your result", text: "See which skin you unboxed, its rarity tier, and estimated market value." },
          { name: "Track your stats", text: "Review your session statistics including total spent, total value received, and profit/loss over multiple openings." },
        ]}
      />
      {children}
    </>
  );
}
