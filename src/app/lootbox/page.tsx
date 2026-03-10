import { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase";
import { Sparkles, Box, Layers, ShoppingBag, Shield, Trophy, ChevronRight } from "lucide-react";
import LootboxDatabaseClient, { GameWithContent } from "./LootboxDatabaseClient";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

export const dynamic = "force-dynamic";

/* ── System type metadata ── */
const SYSTEM_TYPE_META: Record<
  string,
  {
    title: string;
    description: string;
    heading: string;
    subtitle: string;
    icon: typeof Sparkles;
    accentColor: string;
    accentBg: string;
    accentBorder: string;
    darkAccentBg: string;
    pillColor: string;
  }
> = {
  gacha: {
    title: "Gacha Games — Drop Rates, Pity Systems & Cost Analysis",
    description:
      "In-depth gacha analysis for every major gacha game. Banner rates, pity mechanics, cost-per-pull breakdowns, and consumer protection scores.",
    heading: "Gacha Games",
    subtitle:
      "Complete analysis of gacha systems — banner rates, pity mechanics, cost breakdowns, and fairness scores for every major gacha game.",
    icon: Sparkles,
    accentColor: "text-purple-600",
    accentBg: "bg-purple-50",
    accentBorder: "border-purple-100",
    darkAccentBg: "dark:bg-purple-950/30",
    pillColor: "bg-purple-500",
  },
  loot_box: {
    title: "Loot Box Games — Drop Rates, Odds & Value Analysis",
    description:
      "Comprehensive loot box analysis for every major game. Drop rates, odds disclosures, cost analysis, and consumer protection scores.",
    heading: "Loot Box Games",
    subtitle:
      "Every major loot box system analyzed — drop rates, odds transparency, value for money, and fairness scores.",
    icon: Box,
    accentColor: "text-red-600",
    accentBg: "bg-red-50",
    accentBorder: "border-red-100",
    darkAccentBg: "dark:bg-red-950/30",
    pillColor: "bg-red-500",
  },
  card_pack: {
    title: "Card Pack Games — Pull Rates, Pack Odds & Cost Analysis",
    description:
      "Detailed card pack analysis for digital card games. Pull rates, pack odds, crafting systems, and value breakdowns.",
    heading: "Card Pack Games",
    subtitle:
      "Digital card pack systems analyzed — pull rates, pack odds, crafting economics, and overall fairness ratings.",
    icon: Layers,
    accentColor: "text-blue-600",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-100",
    darkAccentBg: "dark:bg-blue-950/30",
    pillColor: "bg-blue-500",
  },
  cosmetic_shop: {
    title: "Cosmetic Shop Games — Pricing, Value & Fairness Analysis",
    description:
      "Cosmetic shop analysis for every major game. Pricing fairness, battle pass value, skin economics, and consumer protection scores.",
    heading: "Cosmetic Shop Games",
    subtitle:
      "Cosmetic monetization systems analyzed — shop pricing, skin economics, battle pass value, and fairness scores.",
    icon: ShoppingBag,
    accentColor: "text-emerald-600",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-100",
    darkAccentBg: "dark:bg-emerald-950/30",
    pillColor: "bg-emerald-500",
  },
  battle_pass: {
    title: "Battle Pass Games — Value, Progression & Fairness Analysis",
    description:
      "Battle pass system analysis for every major game. Progression pacing, premium value, and consumer fairness scores.",
    heading: "Battle Pass Games",
    subtitle:
      "Battle pass systems analyzed — progression pacing, premium tier value, free vs paid rewards, and fairness scores.",
    icon: Shield,
    accentColor: "text-amber-600",
    accentBg: "bg-amber-50",
    accentBorder: "border-amber-100",
    darkAccentBg: "dark:bg-amber-950/30",
    pillColor: "bg-amber-500",
  },
};

const VALID_TYPES = Object.keys(SYSTEM_TYPE_META);

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}): Promise<Metadata> {
  const { type } = await searchParams;
  if (type && VALID_TYPES.includes(type)) {
    const meta = SYSTEM_TYPE_META[type];
    return { title: meta.title, description: meta.description };
  }
  return {
    title: "Loot Box Database — In-Depth Analysis of Every Game's Monetization",
    description:
      "The world's most comprehensive loot box database. Drop rates, cost analysis, pity systems, and expert reviews for every major game's monetization system.",
  };
}

interface LootboxContentRow {
  cost_per_pull: number | null;
  has_pity_system: boolean;
  overview_html: string | null;
}

async function getAllGamesWithLootboxContent(): Promise<GameWithContent[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("games")
    .select(
      `id, title, slug, cover_image, screenshot_image, lootboxes_score, loot_system_type, tags, genres,
       lootbox_content (cost_per_pull, has_pity_system, overview_html)`
    )
    .not("loot_system_type", "is", null)
    .order("lootboxes_score", { ascending: false });

  if (error || !data) {
    console.error("[lootbox page] query error:", error?.message, "data:", data);
    return [];
  }
  const filtered = (data as GameWithContent[]).filter(
    (g) => g.lootbox_content !== null && (Array.isArray(g.lootbox_content) ? g.lootbox_content.length > 0 : true)
  );
  return filtered;
}

export default async function LootboxHubPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const sp = await searchParams;
  const typeFilter =
    sp.type && VALID_TYPES.includes(sp.type) ? sp.type : undefined;
  const typeMeta = typeFilter ? SYSTEM_TYPE_META[typeFilter] : undefined;

  const allGames = await getAllGamesWithLootboxContent();

  /* Count system types from ALL games */
  const typeCounts: Record<string, number> = {};
  allGames.forEach((g) => {
    if (g.loot_system_type) {
      typeCounts[g.loot_system_type] = (typeCounts[g.loot_system_type] || 0) + 1;
    }
  });

  /* Apply system type filter */
  const games = typeFilter
    ? allGames.filter((g) => g.loot_system_type === typeFilter)
    : allGames;

  /* Stats for info bar */
  const avgScore =
    games.length > 0
      ? (games.reduce((s, g) => s + (g.lootboxes_score || 0), 0) / games.length).toFixed(1)
      : "—";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://lootboxes.com" },
          { name: "Loot Box Database", url: "https://lootboxes.com/lootbox" },
        ]}
      />
      {/* ── Header ── */}
      <div className="container-main pt-10 pb-6">
        <div className="flex flex-col gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 dark:from-indigo-950/30 to-violet-50 border border-indigo-200 dark:border-indigo-700/30 rounded-full px-4 py-1.5 mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                Loot Box Database
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {typeFilter && typeMeta ? (
                <>{typeMeta.heading}</>
              ) : (
                <>
                  Every Game&apos;s Monetization,
                  <br className="hidden md:block" /> Analyzed &amp; Scored
                </>
              )}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-lg text-sm">
              {typeFilter && typeMeta
                ? typeMeta.subtitle
                : `${allGames.length} games analyzed across ${Object.keys(typeCounts).length} monetization systems. Data-driven. No guesswork.`}
            </p>
          </div>

          {/* ── System Type Filter Pills ── */}
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/lootbox"
              className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl border transition-all ${
                !typeFilter
                  ? "bg-gray-900 border-gray-900 text-white shadow-lg"
                  : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>All</span>
              <span className={`text-xs font-medium ${!typeFilter ? "text-gray-300" : "text-gray-400 dark:text-gray-500"}`}>
                {allGames.length}
              </span>
            </Link>

            {VALID_TYPES.map((t) => {
              const meta = SYSTEM_TYPE_META[t];
              const count = typeCounts[t] || 0;
              const isActive = typeFilter === t;
              const Icon = meta.icon;

              /* Per-type color schemes */
              const colorMap: Record<string, { active: string; inactive: string; count: string; inactiveCount: string }> = {
                gacha: {
                  active: "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-200",
                  inactive: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 hover:border-purple-300",
                  count: "text-purple-200",
                  inactiveCount: "text-purple-400",
                },
                loot_box: {
                  active: "bg-red-600 border-red-600 text-white shadow-lg shadow-red-200",
                  inactive: "bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300",
                  count: "text-red-200",
                  inactiveCount: "text-red-400",
                },
                card_pack: {
                  active: "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200",
                  inactive: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300",
                  count: "text-blue-200",
                  inactiveCount: "text-blue-400",
                },
                cosmetic_shop: {
                  active: "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200",
                  inactive: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300",
                  count: "text-emerald-200",
                  inactiveCount: "text-emerald-400",
                },
                battle_pass: {
                  active: "bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-200",
                  inactive: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300",
                  count: "text-amber-200",
                  inactiveCount: "text-amber-400",
                },
              };

              const colors = colorMap[t] || colorMap.gacha;

              return (
                <Link
                  key={t}
                  href={`/lootbox?type=${t}`}
                  className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl border transition-all ${
                    isActive ? colors.active : colors.inactive
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{meta.heading.replace(" Games", "")}</span>
                  <span className={`text-xs font-medium ${isActive ? colors.count : colors.inactiveCount}`}>
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Filtered info bar ── */}
      {typeFilter && typeMeta && games.length > 0 &&
        (() => {
          const toContentArray = (c: any) => (!c ? [] : Array.isArray(c) ? c : [c]);
          const contents = games.map((g) => toContentArray(g.lootbox_content)[0]).filter(Boolean);
          const withPity = contents.filter((c: any) => c.has_pity_system).length;
          const costs = contents.map((c: any) => c.cost_per_pull).filter((c: any): c is number => c !== null && c > 0);
          const avgCostVal = costs.length > 0 ? costs.reduce((a: number, b: number) => a + b, 0) / costs.length : null;
          return (
            <div className="container-main pb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4">
                  <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Games</p>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{games.length}</p>
                </div>
                <div className="rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4">
                  <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Avg Score</p>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{avgScore}</p>
                </div>
                <div className="rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4">
                  <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Pity System</p>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{Math.round((withPity / games.length) * 100)}%</p>
                </div>
                <div className="rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4">
                  <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Avg Cost/Pull</p>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{avgCostVal ? `$${avgCostVal.toFixed(2)}` : "—"}</p>
                </div>
              </div>
            </div>
          );
        })()}

      {/* ── Client-side search, genre filters, and game grid ── */}
      <LootboxDatabaseClient games={games} allGamesCount={allGames.length} />

      {/* ── Rankings CTA Banner ── */}
      <div className="container-main py-4">
        <Link
          href="/lootbox/rankings"
          className="group flex items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-50 dark:from-indigo-950/30 via-purple-50 dark:via-purple-950/20 to-pink-50 border border-indigo-200 dark:border-indigo-700/30 px-6 md:px-8 py-5 hover:border-indigo-300 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 dark:from-indigo-950/300 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-base">Loot Box Rankings</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">See every game ranked by monetization fairness — best to worst</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:text-white group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* ── Methodology Section ── */}
      <div className="container-main py-8 pb-16">
        <div className="rounded-2xl bg-gradient-to-br from-gray-50 dark:from-gray-900 to-slate-50 dark:to-slate-950/20 border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 dark:from-blue-950/300 to-indigo-600 flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">How We Rate Games</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-2xl">
            Every game receives a Lootboxes Score from 1-10 based on 8 criteria across three
            weighted categories. Our methodology is transparent, criteria-based, and open to scrutiny.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              {
                title: "Consumer Protection",
                pct: "40%",
                gradient: "from-blue-500 to-indigo-600",
                border: "border-blue-200",
                desc: "Transparency, regulatory compliance, and spending safeguards.",
              },
              {
                title: "Value & Fairness",
                pct: "35%",
                gradient: "from-emerald-500 to-teal-600",
                border: "border-emerald-200",
                desc: "Value for money, fairness mechanics, and pay-to-win impact.",
              },
              {
                title: "Player Experience",
                pct: "25%",
                gradient: "from-purple-500 to-violet-600",
                border: "border-purple-200",
                desc: "Player control over purchases and psychological design integrity.",
              },
            ].map((cat) => (
              <div
                key={cat.title}
                className={`rounded-xl bg-white dark:bg-gray-950 border ${cat.border} p-5 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">{cat.title}</h3>
                  <span
                    className={`text-xs font-bold text-white bg-gradient-to-r ${cat.gradient} px-2.5 py-0.5 rounded-full`}
                  >
                    {cat.pct}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>

          <Link
            href="/methodology"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Read our full methodology →
          </Link>
        </div>
      </div>

      {/* Quick links */}
      <div className="container-main pb-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Looking for raw data?{" "}
          <Link href="/drop-rates" className="text-blue-600 font-medium hover:text-blue-500 transition-colors">
            View the Drop Rate Database →
          </Link>
        </p>
      </div>
    </div>
  );
}
