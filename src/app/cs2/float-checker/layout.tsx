import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS2 Float Value Checker — Look Up Wear, Pattern & Float",
  description:
    "Check CS2 skin float values, wear tiers, and pattern indices. Find low-float gems and rare patterns. Compare prices across marketplaces for similar listings.",
};

export default function FloatCheckerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
