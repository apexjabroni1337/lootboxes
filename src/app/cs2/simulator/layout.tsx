import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS2 Case Opening Simulator — Real Valve Odds, No Money Required",
  description:
    "Open CS2 cases with real Valve drop rates for free. See how much you'd really spend to get that knife. Track your simulated profit/loss across sessions.",
};

export default function SimulatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
