import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  Wallet,
  Zap,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { getGuideBySlug } from "@/data/spending-guides";

const SYSTEM_LABELS: Record<string, string> = {
  gacha: "Gacha",
  loot_box: "Loot Box",
  card_pack: "Card Pack",
  cosmetic_shop: "Cosmetic Shop",
  battle_pass: "Battle Pass",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SpendingGuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const tiers = [
    {
      label: "Free-to-Play",
      icon: Zap,
      color: "border-emerald-200 bg-emerald-50",
      iconColor: "text-emerald-600",
      budget: "$0",
      tips: guide.freeToPlay.tips,
      extra: (
        <p className="text-sm font-semibold text-emerald-700">
          F2P Rating: {guide.freeToPlay.rating}
        </p>
      ),
    },
    {
      label: "Low Spend",
      icon: DollarSign,
      color: "border-blue-200 bg-blue-50",
      iconColor: "text-blue-600",
      budget: guide.lowSpend.budget,
      tips: guide.lowSpend.tips,
      extra: null,
    },
    {
      label: "Moderate Spend",
      icon: TrendingUp,
      color: "border-amber-200 bg-amber-50",
      iconColor: "text-amber-600",
      budget: guide.moderate.budget,
      tips: guide.moderate.tips,
      extra: null,
    },
    {
      label: "Big Spend",
      icon: AlertTriangle,
      color: "border-red-200 bg-red-50",
      iconColor: "text-red-600",
      budget: "$$$$",
      tips: guide.bigSpend.tips,
      extra:
        guide.bigSpend.warnings.length > 0 ? (
          <div className="mt-3 rounded-lg bg-red-100/60 p-3">
            <p className="text-xs font-bold text-red-700 mb-1">Warnings</p>
            <ul className="space-y-1">
              {guide.bigSpend.warnings.map((w, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-red-700"
                >
                  <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-slate-900 via-amber-900 to-slate-800 py-16">
        <div className="container-main">
          <Link
            href="/lootbox/spending-guides"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-200 mb-4"
          >
            <ChevronLeft className="h-4 w-4" /> All Spending Guides
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 backdrop-blur-sm">
              <Wallet className="h-6 w-6 text-amber-400" />
            </div>
            <div className="inline-flex rounded-full bg-amber-500/20 backdrop-blur-sm px-4 py-1 text-sm font-semibold text-amber-300">
              {SYSTEM_LABELS[guide.systemType] || guide.systemType} Game
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {guide.gameName}
          </h1>
          <p className="mt-2 text-lg text-amber-300 font-semibold">
            Spending guide &amp; best value purchases
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Last updated: {guide.updatedAt}
          </p>
        </div>
      </section>

      {/* BreadcrumbSchema */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://lootboxes.com" },
              { "@type": "ListItem", position: 2, name: "Loot Boxes", item: "https://lootboxes.com/lootbox" },
              { "@type": "ListItem", position: 3, name: "Spending Guides", item: "https://lootboxes.com/lootbox/spending-guides" },
              { "@type": "ListItem", position: 4, name: guide.gameName, item: `https://lootboxes.com/lootbox/spending-guides/${guide.gameSlug}` },
            ],
          }),
        }}
      />

      {/* Spending tiers */}
      <section className="py-8">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiers.map((tier) => {
              const TierIcon = tier.icon;
              return (
                <div
                  key={tier.label}
                  className={`rounded-xl border p-6 ${tier.color}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <TierIcon className={`h-5 w-5 ${tier.iconColor}`} />
                    <h2 className="text-lg font-bold text-gray-900">
                      {tier.label}
                    </h2>
                  </div>
                  <p className="text-sm font-semibold text-gray-600 mb-4">
                    Budget: {tier.budget}
                  </p>

                  <ul className="space-y-2">
                    {tier.tips.map((tip, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span className="text-gray-400 mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>

                  {tier.extra && <div className="mt-3">{tier.extra}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Best Value + Avoid */}
      <section className="border-t border-gray-100 py-8">
        <div className="container-main grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-emerald-900">Best Value Purchases</h2>
            </div>
            <ul className="space-y-2">
              {guide.bestValue.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-emerald-800"
                >
                  <CheckCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-bold text-red-900">What to Avoid</h2>
            </div>
            <ul className="space-y-2">
              {guide.avoid.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-red-800"
                >
                  <XCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-red-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50 py-10">
        <div className="container-main flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              See the full loot box analysis for {guide.gameName}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Drop rates, score breakdown, pity system details, and community insights.
            </p>
          </div>
          <Link
            href={`/lootbox/${guide.gameSlug}`}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white hover:bg-amber-700 transition-colors whitespace-nowrap"
          >
            Full Analysis <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
