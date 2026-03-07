import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS2 Trade-Up Calculator — Expected Value & Profit Analysis",
  description:
    "Calculate the expected value of CS2 trade-up contracts before you commit. Select 10 input skins, see all possible outcomes with probabilities, and analyze profit/loss.",
};

export default function TradeUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
