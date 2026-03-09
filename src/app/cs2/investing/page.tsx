import type { Metadata } from "next";
import Link from "next/link";
import { LineChart, ChevronLeft, ArrowRight, TrendingUp, Shield, AlertTriangle, ExternalLink } from "lucide-react";
import AffiliateDisclosure from "@/components/cs2/AffiliateDisclosure";
import CS2NewsletterCTA from "@/components/cs2/CS2NewsletterCTA";

export const metadata: Metadata = {
  title: "CS2 Skin Investment Guide — Strategies, Risk Tiers & ROI",
  description:
    "Data-driven CS2 skin investment strategies. Low, medium, and high-risk tiers with historical ROI analysis. Learn which skins appreciate and where to buy them cheapest.",
};

const INVESTMENT_TIERS = [
  {
    tier: "Low Risk",
    color: "emerald",
    bgClass: "bg-emerald-50 border-emerald-200",
    textClass: "text-emerald-700",
    icon: Shield,
    examples: ["Popular play skins (AK-47 Redline, AWP Asiimov)", "High-demand stickers from recent majors", "Operation pass skins after supply dries up"],
    roi: "+5-15% annually",
    description: "Established skins with consistent demand. Low volatility, steady appreciation over 1-2 years.",
  },
  {
    tier: "Medium Risk",
    color: "amber",
    bgClass: "bg-amber-50 border-amber-200",
    textClass: "text-amber-700",
    icon: TrendingUp,
    examples: ["Operation collection skins", "Discontinued case skins", "Low-float craft materials"],
    roi: "+15-50% annually",
    description: "Skins with limited supply that may appreciate significantly. Requires market knowledge and patience.",
  },
  {
    tier: "High Risk",
    color: "red",
    bgClass: "bg-red-50 border-red-200",
    textClass: "text-red-700",
    icon: AlertTriangle,
    examples: ["Katowice 2014 stickers & applied skins", "Blue gem patterns & rare floats", "Souvenir AWP Dragon Lores"],
    roi: "+50-500%+ (or -30%)",
    description: "Rare collectibles with extreme price swings. Massive upside potential but significant downside risk.",
  },
];

export default function CS2InvestingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 py-10">
        <div className="container-main">
          <Link href="/cs2" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ChevronLeft className="h-4 w-4" /> CS2 Skins Hub
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <LineChart className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">CS2 Skin Investment Guide</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Data-driven strategies for CS2 skin investing. Understand risk tiers, historical trends, and how to build a profitable skin portfolio.
          </p>
        </div>
      </section>

      {/* Key insight */}
      <section className="py-8 border-b border-gray-100">
        <div className="container-main">
          <div className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Why CS2 Skins Are Investable</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Unlike every other in-game cosmetic system, CS2 skins can be freely traded, sold for real money, and even appreciate in value over time. The Steam Community Market processes billions in transactions annually, and third-party marketplaces like Buff163 and DMarket offer even better rates. This makes CS2 skins one of the only digital assets in gaming that function like actual investments.
            </p>
          </div>
        </div>
      </section>

      {/* Risk tiers */}
      <section className="py-10">
        <div className="container-main">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Investment Risk Tiers</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {INVESTMENT_TIERS.map((tier) => (
              <div
                key={tier.tier}
                className={`rounded-xl border ${tier.bgClass} p-6`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <tier.icon className={`h-5 w-5 ${tier.textClass}`} />
                  <h3 className={`text-lg font-bold ${tier.textClass}`}>{tier.tier}</h3>
                </div>
                <p className="text-sm text-gray-700 mb-4">{tier.description}</p>
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Expected ROI</p>
                  <p className={`text-xl font-black ${tier.textClass}`}>{tier.roi}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Examples</p>
                  <ul className="space-y-1">
                    {tier.examples.map((ex) => (
                      <li key={ex} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where to buy */}
      <section className="py-10 border-t border-gray-100">
        <div className="container-main">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Best Marketplaces for Investing</h2>
          <p className="text-sm text-gray-600 mb-6">Low fees matter when you&apos;re buying to hold. These platforms keep your costs down.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: "Buff163", fee: "2.5%", reason: "Largest volume, best liquidity", color: "#ff6b35", dealId: "buff163" },
              { name: "DMarket", fee: "3%", reason: "Crypto cashout, instant trades", color: "#00c9a7", dealId: "dmarket" },
              { name: "Skinport", fee: "5%", reason: "Best UI & checkout experience", color: "#eb4b98", dealId: "skinport" },
            ].map((mp) => (
              <a
                key={mp.name}
                href={`/go/cs2/${mp.dealId}?from=investing`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-white text-sm font-bold"
                    style={{ backgroundColor: mp.color }}
                  >
                    {mp.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{mp.name}</p>
                    <p className="text-xs text-emerald-600 font-medium">{mp.fee} seller fee</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{mp.reason}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
                  Visit {mp.name} <ExternalLink className="h-3 w-3" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 border-t border-gray-100 bg-gray-50">
        <div className="container-main text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Ready to start investing?</h2>
          <p className="text-sm text-gray-600 mb-6">Compare marketplace fees and find the best platform for your strategy.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/cs2/prices" className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 transition-colors">
              Track Prices <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/cs2/compare" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Compare All Marketplaces
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-10 border-t border-gray-100">
        <div className="container-main">
          <CS2NewsletterCTA />
        </div>
      </section>

      {/* Affiliate disclosure */}
      <AffiliateDisclosure />
    </div>
  );
}
