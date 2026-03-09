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
  Info,
  Calculator,
  Sparkles,
  Box,
  Layers,
  ShoppingBag,
  Shield,
} from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";
import { getGuideBySlug, SPENDING_GUIDES, type SpendingGuide } from "@/data/spending-guides";
import { createServerClient } from "@/lib/supabase";

const SYSTEM_LABELS: Record<string, string> = {
  gacha: "Gacha",
  loot_box: "Loot Box",
  card_pack: "Card Pack",
  cosmetic_shop: "Cosmetic Shop",
  battle_pass: "Battle Pass",
};

const SYSTEM_ICONS: Record<string, typeof Sparkles> = {
  gacha: Sparkles,
  loot_box: Box,
  card_pack: Layers,
  cosmetic_shop: ShoppingBag,
  battle_pass: Shield,
};

const SYSTEM_EXPLAINER: Record<string, string> = {
  gacha:
    "Gacha games use a slot-machine-style pull mechanic where you spend premium currency for a random character, weapon, or item. Most gacha games feature pity systems that guarantee a rare drop after a set number of pulls.",
  loot_box:
    "Loot box games sell sealed containers with randomized contents. Unlike gacha, loot box items are often tradeable on a secondary market, meaning they can hold real-world monetary value.",
  card_pack:
    "Card pack systems work like physical trading card games — you buy randomized packs hoping for rare cards. These are common in sports games and digital card games.",
  cosmetic_shop:
    "Cosmetic shops sell items directly at fixed prices. While not randomized, they often use FOMO tactics like rotating inventories and limited-time exclusives to drive spending.",
  battle_pass:
    "Battle pass systems charge a flat seasonal fee for access to a tiered reward track. Progress is earned through gameplay, with premium tiers offering exclusive cosmetics.",
};

/* Parse a budget string like "$5–15/month" to extract a rough monthly cost for the summary table */
function parseBudgetMid(budget: string): number | null {
  const match = budget.match(/\$(\d+)[–-](\d+)/);
  if (match) return Math.round((parseInt(match[1]) + parseInt(match[2])) / 2);
  const single = budget.match(/\$(\d+)/);
  if (single) return parseInt(single[1]);
  return null;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export default async function SpendingGuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  /* Fetch cover image from Supabase */
  const sb = createServerClient();
  const allSlugs = [guide.gameSlug, ...SPENDING_GUIDES.filter(g => g.gameSlug !== guide.gameSlug).map(g => g.gameSlug)];
  const { data: gameImages } = await sb
    .from("games")
    .select("slug, cover_image, screenshot_image")
    .in("slug", allSlugs);

  const imageMap: Record<string, string> = {};
  if (gameImages) {
    for (const g of gameImages) {
      const img = g.cover_image || g.screenshot_image;
      if (img) imageMap[g.slug] = img;
    }
  }

  const heroImage = imageMap[guide.gameSlug];
  const SystemIcon = SYSTEM_ICONS[guide.systemType] || ShoppingBag;
  const explainer = SYSTEM_EXPLAINER[guide.systemType] || "";

  /* Related guides: same system type, excluding current */
  const relatedGuides = SPENDING_GUIDES.filter(
    (g) => g.gameSlug !== guide.gameSlug && g.systemType === guide.systemType
  ).slice(0, 3);

  /* Also grab a few from different system types if needed */
  const otherGuides =
    relatedGuides.length < 3
      ? SPENDING_GUIDES.filter(
          (g) =>
            g.gameSlug !== guide.gameSlug &&
            !relatedGuides.some((r) => r.gameSlug === g.gameSlug)
        ).slice(0, 3 - relatedGuides.length)
      : [];

  const allRelated = [...relatedGuides, ...otherGuides];

  /* Monthly cost summary */
  const costRows = [
    { tier: "Free-to-Play", budget: "$0", color: "text-emerald-700" },
    { tier: "Low Spend", budget: guide.lowSpend.budget, color: "text-blue-700" },
    { tier: "Moderate", budget: guide.moderate.budget, color: "text-amber-700" },
    { tier: "Big Spend", budget: "$$$+", color: "text-red-700" },
  ];

  const lowMid = parseBudgetMid(guide.lowSpend.budget);
  const modMid = parseBudgetMid(guide.moderate.budget);

  const tiers = [
    {
      label: "Free-to-Play",
      icon: Zap,
      color: "border-emerald-200 bg-emerald-50",
      iconColor: "text-emerald-600",
      headerColor: "bg-emerald-600",
      budget: "$0",
      tips: guide.freeToPlay.tips,
      extra: (
        <div className="flex items-center gap-2 mt-3 rounded-lg bg-emerald-100/60 px-3 py-2">
          <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <p className="text-sm font-semibold text-emerald-700">
            F2P Viability: {guide.freeToPlay.rating}
          </p>
        </div>
      ),
    },
    {
      label: "Low Spend",
      icon: DollarSign,
      color: "border-blue-200 bg-blue-50",
      iconColor: "text-blue-600",
      headerColor: "bg-blue-600",
      budget: guide.lowSpend.budget,
      tips: guide.lowSpend.tips,
      extra: null,
    },
    {
      label: "Moderate Spend",
      icon: TrendingUp,
      color: "border-amber-200 bg-amber-50",
      iconColor: "text-amber-600",
      headerColor: "bg-amber-600",
      budget: guide.moderate.budget,
      tips: guide.moderate.tips,
      extra: null,
    },
    {
      label: "Big Spend",
      icon: AlertTriangle,
      color: "border-red-200 bg-red-50",
      iconColor: "text-red-600",
      headerColor: "bg-red-600",
      budget: "$$$$",
      tips: guide.bigSpend.tips,
      extra:
        guide.bigSpend.warnings.length > 0 ? (
          <div className="mt-3 rounded-lg bg-red-100/60 p-3">
            <p className="text-xs font-bold text-red-700 mb-1.5">
              <AlertTriangle className="h-3 w-3 inline mr-1" />
              Warnings
            </p>
            <ul className="space-y-1">
              {guide.bigSpend.warnings.map((w, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-red-700"
                >
                  <span className="text-red-400 mt-0.5">•</span>
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

          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden ring-2 ring-white/20">
              {heroImage ? (
                <img src={heroImage} alt={guide.gameName} className="w-full h-full object-cover" />
              ) : (
                <GameAvatar gameName={guide.gameName} size="sm" aspectRatio="square" />
              )}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 backdrop-blur-sm px-4 py-1 text-sm font-semibold text-amber-300 mb-1">
                <SystemIcon className="h-3.5 w-3.5" />
                {SYSTEM_LABELS[guide.systemType] || guide.systemType}
              </div>
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

      {/* Intro + system explainer */}
      <section className="border-b border-gray-100 bg-gray-50/50 py-8">
        <div className="container-main">
          <div className="max-w-3xl">
            <p className="text-gray-700 leading-relaxed">
              {guide.gameName} uses a{" "}
              <span className="font-semibold">
                {(SYSTEM_LABELS[guide.systemType] || guide.systemType).toLowerCase()}
              </span>{" "}
              monetization system. This guide breaks down exactly what&apos;s worth
              buying at every budget level — from completely free to big-spender
              — so you get the most value for your money.
            </p>
            {explainer && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">
                    What is a {SYSTEM_LABELS[guide.systemType] || guide.systemType}?
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {explainer}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick cost summary table */}
      <section className="border-b border-gray-100 py-6">
        <div className="container-main">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-amber-500" />
            Monthly Cost at a Glance
          </h2>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Tier
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Budget
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden sm:table-cell">
                    Est. Yearly
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden sm:table-cell">
                    What You Get
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-semibold text-emerald-700">
                    Free-to-Play
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-bold">$0</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    $0
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    Core gameplay, earned rewards
                  </td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="px-4 py-3 font-semibold text-blue-700">
                    Low Spend
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-bold">
                    {guide.lowSpend.budget}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    {lowMid ? `~$${lowMid * 12}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    Best-value subscriptions/passes
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-amber-700">
                    Moderate
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-bold">
                    {guide.moderate.budget}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    {modMid ? `~$${modMid * 12}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    Passes + targeted premium items
                  </td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="px-4 py-3 font-semibold text-red-700">
                    Big Spend
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-bold">$$$$</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    $1,000+
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    Max collection / competitive edge
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Spending tiers — detailed */}
      <section className="py-8">
        <div className="container-main">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Detailed Spending Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiers.map((tier) => {
              const TierIcon = tier.icon;
              return (
                <div
                  key={tier.label}
                  className={`rounded-xl border overflow-hidden ${tier.color}`}
                >
                  <div className={`${tier.headerColor} px-6 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <TierIcon className="h-5 w-5 text-white" />
                      <h3 className="text-base font-bold text-white">
                        {tier.label}
                      </h3>
                    </div>
                    <span className="text-sm font-bold text-white/80">
                      {tier.budget}
                    </span>
                  </div>
                  <div className="p-5">
                    <ul className="space-y-2.5">
                      {tier.tips.map((tip, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <span className="text-gray-400 mt-0.5 flex-shrink-0">
                            •
                          </span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                    {tier.extra && <div className="mt-2">{tier.extra}</div>}
                  </div>
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
              <h2 className="text-lg font-bold text-emerald-900">
                Best Value Purchases
              </h2>
            </div>
            <ul className="space-y-2.5">
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
            <ul className="space-y-2.5">
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

      {/* Related guides */}
      {allRelated.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50/50 py-8">
          <div className="container-main">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Related Spending Guides
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {relatedGuides.length > 0
                ? `Other ${(SYSTEM_LABELS[guide.systemType] || guide.systemType).toLowerCase()} games you might play`
                : "More games with spending guides"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {allRelated.map((related) => {
                const RelIcon = SYSTEM_ICONS[related.systemType] || ShoppingBag;
                return (
                  <Link
                    key={related.gameSlug}
                    href={`/lootbox/spending-guides/${related.gameSlug}`}
                    className="group rounded-xl border border-gray-200 bg-white p-5 hover:shadow-lg transition-all hover:border-amber-200"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden">
                        {imageMap[related.gameSlug] ? (
                          <img src={imageMap[related.gameSlug]} alt={related.gameName} className="w-full h-full object-cover" />
                        ) : (
                          <GameAvatar gameName={related.gameName} size="sm" aspectRatio="square" />
                        )}
                      </div>
                      <h3 className="flex-1 font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                        {related.gameName}
                      </h3>
                      <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-amber-500 transition-colors flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 ml-11">
                      <RelIcon className="h-3 w-3" />
                      <span>{SYSTEM_LABELS[related.systemType] || related.systemType}</span>
                      <span className="text-gray-300">•</span>
                      <span>F2P: {related.freeToPlay.rating}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50 py-10">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                See the full loot box analysis for {guide.gameName}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Drop rates, score breakdown, pity system details, and community
                insights.
              </p>
            </div>
            <Link
              href={`/lootbox/${guide.gameSlug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white hover:bg-amber-700 transition-colors whitespace-nowrap"
            >
              Full Analysis <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm">
            <Link
              href="/lootbox/value-calculator"
              className="text-amber-700 hover:text-amber-900 hover:underline font-medium"
            >
              Value Calculator →
            </Link>
            <Link
              href="/lootbox/odds-comparison"
              className="text-amber-700 hover:text-amber-900 hover:underline font-medium"
            >
              Compare Odds →
            </Link>
            <Link
              href="/lootbox/spending-guides"
              className="text-amber-700 hover:text-amber-900 hover:underline font-medium"
            >
              All Guides →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
