import Link from "next/link";
import {
  Wallet,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Box,
  Layers,
  ShoppingBag,
  Shield,
  DollarSign,
  Zap,
  Search,
  TrendingUp,
} from "lucide-react";
import { SPENDING_GUIDES } from "@/data/spending-guides";
import GameAvatar from "@/components/ui/GameAvatar";
import { createServerClient } from "@/lib/supabase";

const SYSTEM_ICONS: Record<string, typeof Sparkles> = {
  gacha: Sparkles,
  loot_box: Box,
  card_pack: Layers,
  cosmetic_shop: ShoppingBag,
  battle_pass: Shield,
};

const SYSTEM_COLORS: Record<
  string,
  { bg: string; text: string; border: string; badge: string }
> = {
  gacha: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-800",
  },
  loot_box: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    badge: "bg-red-100 text-red-800",
  },
  card_pack: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-800",
  },
  cosmetic_shop: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-800",
  },
  battle_pass: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-800",
  },
};

const SYSTEM_LABELS: Record<string, string> = {
  gacha: "Gacha",
  loot_box: "Loot Box",
  card_pack: "Card Pack",
  cosmetic_shop: "Cosmetic Shop",
  battle_pass: "Battle Pass",
};

const F2P_COLORS: Record<string, string> = {
  "Fully Viable": "text-emerald-600 bg-emerald-50",
  "Very Viable": "text-blue-600 bg-blue-50",
  "Viable with Grind": "text-amber-600 bg-amber-50",
  "Viable with Patience": "text-amber-600 bg-amber-50",
  "Viable with Limits": "text-amber-600 bg-amber-50",
  Challenging: "text-red-600 bg-red-50",
};

/* Group guides by system type */
const systemGroups = [
  { type: "gacha", label: "Gacha Games" },
  { type: "cosmetic_shop", label: "Cosmetic Shop Games" },
  { type: "loot_box", label: "Loot Box Games" },
  { type: "card_pack", label: "Card Pack Games" },
  { type: "battle_pass", label: "Battle Pass Games" },
].filter((g) => SPENDING_GUIDES.some((s) => s.systemType === g.type));

export const revalidate = 3600;

export default async function SpendingGuidesHub() {
  /* Fetch cover images from Supabase for all guide games */
  const slugs = SPENDING_GUIDES.map((g) => g.gameSlug);
  const sb = createServerClient();
  const { data: games } = await sb
    .from("games")
    .select("slug, cover_image, screenshot_image")
    .in("slug", slugs);

  const imageMap: Record<string, string> = {};
  if (games) {
    for (const g of games) {
      const img = g.cover_image || g.screenshot_image;
      if (img) imageMap[g.slug] = img;
    }
  }

  const totalGuides = SPENDING_GUIDES.length;
  const systemTypeCounts = Object.entries(
    SPENDING_GUIDES.reduce(
      (acc, g) => {
        acc[g.systemType] = (acc[g.systemType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    )
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-slate-900 via-amber-900 to-orange-900 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        <div className="container-main relative z-10">
          <Link
            href="/lootbox"
            className="inline-flex items-center gap-1 text-sm text-amber-300 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Loot Boxes
          </Link>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 backdrop-blur-sm border border-amber-400/20">
              <Wallet className="h-7 w-7 text-amber-400" />
            </div>
            <div className="inline-flex rounded-full bg-amber-500/20 backdrop-blur-sm px-4 py-1.5 text-sm font-bold text-amber-300 border border-amber-400/20">
              <DollarSign className="h-4 w-4 mr-1.5" /> {totalGuides} Games Covered
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Spending Guides
          </h1>
          <p className="mt-2 text-lg text-amber-300 font-semibold">
            Smart budgets for every game
          </p>
          <p className="mt-4 max-w-2xl text-gray-300 leading-relaxed">
            Expert spending advice for {totalGuides} of the biggest free-to-play
            and loot box games. We break down what&apos;s worth buying at every
            budget level — from completely free to high-spender — so you get the
            most value for your money.
          </p>
        </div>
      </section>

      {/* Quick stats */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="container-main py-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {systemTypeCounts.map(([type, count]) => {
              const colors = SYSTEM_COLORS[type] || SYSTEM_COLORS.cosmetic_shop;
              const Icon = SYSTEM_ICONS[type] || ShoppingBag;
              return (
                <div
                  key={type}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 flex-shrink-0 ${colors.border} ${colors.bg}`}
                >
                  <Icon className={`h-4 w-4 ${colors.text}`} />
                  <div>
                    <p className={`text-xs font-bold ${colors.text}`}>
                      {SYSTEM_LABELS[type] || type}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {count} guide{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guides grouped by system type */}
      <section className="py-8">
        <div className="container-main">
          {systemGroups.map((group) => {
            const guides = SPENDING_GUIDES.filter(
              (g) => g.systemType === group.type
            );
            const colors =
              SYSTEM_COLORS[group.type] || SYSTEM_COLORS.cosmetic_shop;
            const GroupIcon = SYSTEM_ICONS[group.type] || ShoppingBag;

            return (
              <div key={group.type} className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <GroupIcon className={`h-5 w-5 ${colors.text}`} />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {group.label}
                  </h2>
                  <span className="text-sm text-gray-400 dark:text-gray-500">
                    ({guides.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {guides.map((guide) => {
                    const f2pColor =
                      F2P_COLORS[guide.freeToPlay.rating] ||
                      "text-gray-600 bg-gray-50";
                    return (
                      <Link
                        key={guide.gameSlug}
                        href={`/lootbox/spending-guides/${guide.gameSlug}`}
                        className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 hover:shadow-lg transition-all hover:border-amber-200 overflow-hidden"
                      >
                        {/* Card header with game image */}
                        <div className="flex items-center gap-3 p-4 pb-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden">
                            <GameAvatar
                              gameName={guide.gameName}
                              src={imageMap[guide.gameSlug] || null}
                              size="sm"
                              aspectRatio="square"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-amber-700 transition-colors">
                              {guide.gameName}
                            </h3>
                            <span
                              className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${colors.badge}`}
                            >
                              <GroupIcon className="h-2.5 w-2.5" />
                              {SYSTEM_LABELS[guide.systemType] ||
                                guide.systemType}
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-amber-500 transition-colors flex-shrink-0" />
                        </div>

                        {/* Card body */}
                        <div className="px-4 pb-4">
                          <div className="flex items-center gap-2 mb-2.5">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${f2pColor}`}
                            >
                              <Zap className="h-2.5 w-2.5" />
                              F2P: {guide.freeToPlay.rating}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 px-2.5 py-2">
                              <p className="text-gray-400 dark:text-gray-500 font-medium">
                                Low Spend
                              </p>
                              <p className="font-bold text-blue-700">
                                {guide.lowSpend.budget}
                              </p>
                            </div>
                            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 px-2.5 py-2">
                              <p className="text-gray-400 dark:text-gray-500 font-medium">
                                Moderate
                              </p>
                              <p className="font-bold text-amber-700">
                                {guide.moderate.budget}
                              </p>
                            </div>
                          </div>

                          <p className="mt-2.5 text-[10px] text-gray-400 dark:text-gray-500">
                            Updated {guide.updatedAt}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* What's in a guide */}
      <section className="border-t border-gray-100 dark:border-gray-800 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-950 py-12">
        <div className="container-main">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            What&apos;s Inside Each Guide
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {[
              { icon: Zap, gradient: "from-emerald-500 to-teal-600", title: "F2P Viability", desc: "Can you enjoy the game without spending a penny?" },
              { icon: DollarSign, gradient: "from-blue-500 to-indigo-600", title: "Budget Tiers", desc: "Optimized tips at free, low, moderate, and high budgets." },
              { icon: TrendingUp, gradient: "from-amber-500 to-orange-600", title: "Best Value", desc: "Exactly which purchases give the most bang for your buck." },
              { icon: Shield, gradient: "from-red-500 to-rose-600", title: "What to Avoid", desc: "Traps, bad deals, and spending patterns to steer clear of." },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-6 text-center hover:shadow-lg transition-shadow group">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{card.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 dark:border-gray-800 bg-gradient-to-r from-amber-50 dark:from-amber-950/30 to-orange-50 dark:to-orange-950/20 py-10">
        <div className="container-main text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Want to check if a game is worth your money?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-6 max-w-md mx-auto">
            Use our value calculator for a quick score-based verdict on any game
            in our database.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/lootbox/value-calculator"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 font-semibold text-white hover:from-amber-700 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
            >
              Value Calculator <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/lootbox/odds-comparison"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-6 py-3 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
            >
              Compare Odds <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
