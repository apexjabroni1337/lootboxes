import type { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  Dices,
  LineChart,
  Search,
  Calculator,
  ExternalLink,
  Crosshair,
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
  Tag,
  Package,
} from "lucide-react";
import AffiliateDisclosure from "@/components/cs2/AffiliateDisclosure";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import FAQSchema from "@/components/seo/FAQSchema";

export const metadata: Metadata = {
  title: "CS2 Skins Hub — Track Prices, Simulate Cases, Compare Marketplaces",
  description:
    "Compare CS2 skin prices across 5+ marketplaces. Simulate case openings with real Valve odds, check float values, and calculate trade-ups.",
};

const CS2_FAQS = [
  {
    question: "What is the cheapest CS2 skin marketplace?",
    answer:
      "Prices vary per skin — use our Price Tracker to compare prices across Skinport, Buff163, DMarket, Waxpeer, and Steam Market in real time to find the cheapest option.",
  },
  {
    question: "How often are CS2 skin prices updated?",
    answer:
      "Our Price Tracker updates prices every 10 minutes using live data from SteamWebAPI. We pull pricing from Steam Market, Skinport, Buff163, DMarket, and Waxpeer simultaneously, so you always see the cheapest option.",
  },
  {
    question: "What is a CS2 skin float value?",
    answer:
      "A float value is a decimal number between 0 and 1 that determines the visual wear of a CS2 skin. Lower float values mean less wear (cleaner appearance). Float values are permanent and cannot be changed. Use our Float Checker to look up any skin's float value.",
  },
  {
    question: "How do CS2 trade-up contracts work?",
    answer:
      "Trade-up contracts let you exchange 10 skins of the same rarity for 1 skin of the next higher rarity from the same collection. The output float is calculated from the average float of inputs. Use our Trade-Up Calculator to analyze expected value before committing.",
  },
  {
    question: "Are CS2 skins a good investment?",
    answer:
      "CS2 skins can appreciate in value, especially rare items, discontinued skins, and items from limited collections. However, skin investing carries risk — prices can drop due to game updates, new case releases, or market trends. Check our Investment Guide for data-driven analysis.",
  },
];

const TOOLS = [
  {
    title: "Skin Price Tracker",
    description: "Compare prices across Steam Market, Skinport, Buff163, DMarket, and Waxpeer in real time. Find the cheapest listing instantly.",
    href: "/cs2/prices",
    icon: TrendingUp,
    color: "bg-orange-500",
    bg: "bg-orange-50",
    hoverBg: "hover:bg-orange-100",
  },
  {
    title: "Case Opening Simulator",
    description: "Open cases with real Valve drop rates — no money required. See how much you'd really spend to get that knife.",
    href: "/cs2/simulator",
    icon: Dices,
    color: "bg-purple-600",
    bg: "bg-purple-50",
    hoverBg: "hover:bg-purple-100",
  },
  {
    title: "Market Trends",
    description: "Track skin price history, market movements, and trending items with data-driven analysis.",
    href: "/cs2/investing",
    icon: LineChart,
    color: "bg-emerald-600",
    bg: "bg-emerald-50",
    hoverBg: "hover:bg-emerald-100",
  },
  {
    title: "Float Value Checker",
    description: "Look up exact float values, paint seeds, and wear ratings. Find rare patterns and low-float gems.",
    href: "/cs2/float-checker",
    icon: Search,
    color: "bg-blue-500",
    bg: "bg-blue-50",
    hoverBg: "hover:bg-blue-100",
  },
  {
    title: "Trade-Up Calculator",
    description: "Calculate the expected value of trade-up contracts. Know whether your trade-up is profitable before you commit.",
    href: "/cs2/trade-up",
    icon: Calculator,
    color: "bg-amber-500",
    bg: "bg-amber-50",
    hoverBg: "hover:bg-amber-100",
  },
  {
    title: "Best Deals",
    description: "Real-time price comparison across every marketplace. Find the biggest savings, trending skins, and undervalued items.",
    href: "/cs2/deals",
    icon: Tag,
    color: "bg-emerald-500",
    bg: "bg-emerald-50",
    hoverBg: "hover:bg-emerald-100",
  },
  {
    title: "Marketplace Comparison",
    description: "Side-by-side comparison of CS2 skin marketplaces. Fees, cashout options, trust ratings, and exclusive deals.",
    href: "/cs2/compare",
    icon: ExternalLink,
    color: "bg-gray-700",
    bg: "bg-gray-50",
    hoverBg: "hover:bg-gray-100",
  },
];

const MARKETPLACES = [
  { name: "Skinport", fee: "5%", color: "#eb4b98", dealId: "skinport", pick: true },
  { name: "Buff163", fee: "2.5%", color: "#ff6b35", dealId: "buff163", pick: false },
  { name: "DMarket", fee: "3%", color: "#00c9a7", dealId: "dmarket", pick: false },
  { name: "Tradeit.gg", fee: "0-7%", color: "#5865F2", dealId: "tradeit", pick: false },
  { name: "Waxpeer", fee: "5%", color: "#7c3aed", dealId: "waxpeer", pick: false },
];

export default function CS2HubPage() {
  return (
    <div className="min-h-screen bg-white">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://lootboxes.com" },
          { name: "CS2 Skins", url: "https://lootboxes.com/cs2" },
        ]}
      />
      <FAQSchema faqs={CS2_FAQS} />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-gray-900 via-gray-800 to-yellow-900 py-16 sm:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
        </div>

        <div className="container-main relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/20 backdrop-blur-sm">
              <Crosshair className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="inline-flex rounded-full bg-yellow-500/20 backdrop-blur-sm px-4 py-1 text-sm font-semibold text-yellow-300">
              CS2 Skin Economy Hub
            </div>
          </div>

          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            CS2 Skins
          </h1>
          <p className="mt-2 text-xl sm:text-2xl font-semibold text-yellow-300">
            Track. Trade. Profit.
          </p>

          <p className="mt-6 max-w-2xl text-lg text-gray-300 leading-relaxed">
            The most comprehensive CS2 skin resource on the web. Compare prices across every major marketplace, simulate case openings with real odds, and make data-driven decisions about your skin portfolio.
          </p>

          {/* Score callout */}
          <div className="mt-8 inline-flex items-center gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm px-6 py-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-xl font-black text-white">
              8.5
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-300">LootBoxes Score: Great</p>
              <p className="text-sm text-gray-400">Tradeable skins, transparent odds, zero pay-to-win</p>
            </div>
            <Link
              href="/lootbox/counter-strike-2"
              className="ml-4 flex items-center gap-1 rounded-lg bg-emerald-500/20 px-3 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-colors"
            >
              Read review <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why CS2 skins are different */}
      <section className="py-12 border-b border-gray-100">
        <div className="container-main">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-900">Why CS2 Skins Score 8.5/10</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Fully Tradeable", desc: "Sell skins on Steam Market or 3rd-party platforms. Recover real money anytime." },
              { title: "Transparent Odds", desc: "Valve publishes exact drop rates for every case. Knife odds: ~0.26%." },
              { title: "100% Cosmetic", desc: "Zero pay-to-win. Skins are purely visual — no gameplay advantage whatsoever." },
              { title: "Investment Potential", desc: "Many skins appreciate over time. Some players break even or profit on their collection." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12">
        <div className="container-main">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tools & Resources</h2>
          <p className="text-gray-600 mb-8">Everything you need to navigate the CS2 skin economy.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group rounded-xl border border-gray-200 ${tool.bg} p-6 transition-all hover:shadow-lg ${tool.hoverBg}`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tool.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                  <tool.icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{tool.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                  Explore <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cases & Capsules CTA */}
      <section className="py-12 border-t border-gray-100">
        <div className="container-main">
          <Link
            href="/cs2/cases"
            className="group flex items-center justify-between rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-200 px-6 md:px-8 py-6 hover:border-amber-300 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Browse All Cases & Capsules</h2>
                <p className="text-sm text-gray-500">
                  Every weapon case, sticker capsule, and souvenir package with full item lists and skin images.
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </Link>
        </div>
      </section>

      {/* Marketplace overview — now with affiliate links */}
      <section className="py-12 border-t border-gray-100 bg-gray-50">
        <div className="container-main">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trusted Marketplaces</h2>
          <p className="text-gray-600 mb-8">We track prices and availability across all major CS2 skin platforms.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {MARKETPLACES.map((mp) => (
              <a
                key={mp.name}
                href={`/go/cs2/${mp.dealId}?from=hub`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={`rounded-xl border bg-white p-5 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 ${
                  mp.pick ? "border-blue-200 ring-1 ring-blue-100" : "border-gray-200"
                } relative`}
              >
                {mp.pick && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-bold text-white whitespace-nowrap">
                    <Star className="h-2.5 w-2.5" /> OUR PICK
                  </div>
                )}
                <div
                  className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-bold"
                  style={{ backgroundColor: mp.color }}
                >
                  {mp.name.charAt(0)}
                </div>
                <p className="font-semibold text-gray-900">{mp.name}</p>
                <p className="text-xs text-gray-500 mt-1">Seller fee: {mp.fee}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-brand-600">
                  Visit <ExternalLink className="h-2.5 w-2.5" />
                </span>
              </a>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/cs2/compare"
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              Full Marketplace Comparison ({MARKETPLACES.length + 4} platforms)
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="container-main">
          <div className="rounded-2xl bg-gradient-to-r from-yellow-50 via-orange-50 to-amber-50 border border-yellow-200 p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Ready to dive into the CS2 skin economy?
            </h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              Start with our Price Tracker to find the best deals, or try the Case Simulator to test your luck without spending a dime.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/cs2/prices"
                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 transition-colors"
              >
                <TrendingUp className="h-4 w-4" />
                Track Prices
              </Link>
              <Link
                href="/cs2/simulator"
                className="inline-flex items-center gap-2 rounded-lg border border-purple-300 bg-white px-6 py-3 font-semibold text-purple-700 hover:bg-purple-50 transition-colors"
              >
                <Dices className="h-4 w-4" />
                Open Cases Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate disclosure */}
      <AffiliateDisclosure />
    </div>
  );
}
