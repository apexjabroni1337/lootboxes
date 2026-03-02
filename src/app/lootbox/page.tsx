import { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase";
import { Zap, Shield, BarChart3, CheckCircle, ArrowLeft, Sparkles, Box, Layers, ShoppingBag } from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";

export const revalidate = 3600;

/* ── System type metadata for filtered views ── */
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
  },
};

const VALID_TYPES = Object.keys(SYSTEM_TYPE_META);

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { type?: string };
}): Promise<Metadata> {
  const type = searchParams.type;
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

interface GameWithContent {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  screenshot_image: string | null;
  lootboxes_score: number | null;
  loot_system_type: string | null;
  lootbox_content: LootboxContentRow | LootboxContentRow[] | null;
}

function toContentArray(
  content: LootboxContentRow | LootboxContentRow[] | null
): LootboxContentRow[] {
  if (!content) return [];
  return Array.isArray(content) ? content : [content];
}

function systemLabel(type: string | null): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    gacha: { label: "Gacha", color: "bg-purple-100 text-purple-700" },
    loot_box: { label: "Loot Box", color: "bg-red-100 text-red-700" },
    card_pack: { label: "Card Pack", color: "bg-blue-100 text-blue-700" },
    cosmetic_shop: {
      label: "Cosmetic Shop",
      color: "bg-emerald-100 text-emerald-700",
    },
    battle_pass: {
      label: "Battle Pass",
      color: "bg-amber-100 text-amber-700",
    },
  };
  return type && map[type] ? map[type] : { label: type || "Unknown", color: "bg-gray-100 text-gray-600" };
}

function scoreColor(score: number | null): string {
  if (score === null) return "bg-gray-400";
  if (score >= 7) return "bg-emerald-500";
  if (score >= 5) return "bg-amber-500";
  if (score >= 3) return "bg-orange-500";
  return "bg-red-500";
}

function scoreVerdict(score: number | null): string {
  if (score === null) return "";
  if (score >= 7) return "Good value — fair monetization";
  if (score >= 5) return "Average — mixed practices";
  if (score >= 3) return "Below average — concerning practices";
  return "Poor value — predatory monetization";
}

async function getGamesWithLootboxContent(
  typeFilter?: string
): Promise<GameWithContent[]> {
  const supabase = createServerClient();

  let query = supabase
    .from("games")
    .select(
      `id, title, slug, cover_image, screenshot_image, lootboxes_score, loot_system_type,
       lootbox_content (cost_per_pull, has_pity_system, overview_html)`
    )
    .not("loot_system_type", "is", null)
    .order("lootboxes_score", { ascending: false });

  if (typeFilter && VALID_TYPES.includes(typeFilter)) {
    query = query.eq("loot_system_type", typeFilter);
  }

  const { data, error } = await query;

  if (error || !data) return [];
  return (data as GameWithContent[]).filter(
    (g) => g.lootbox_content !== null && (Array.isArray(g.lootbox_content) ? g.lootbox_content.length > 0 : true)
  );
}

export default async function LootboxHubPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const typeFilter =
    searchParams.type && VALID_TYPES.includes(searchParams.type)
      ? searchParams.type
      : undefined;
  const typeMeta = typeFilter ? SYSTEM_TYPE_META[typeFilter] : undefined;
  const games = await getGamesWithLootboxContent(typeFilter);
  const totalDropRates = games.length * 6; // approximate

  return (
    <div className="container-main py-8">
      {/* Dark Hero Section (unfiltered only) */}
      {!typeFilter && (
        <div className="mb-12 -mx-6 -mt-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl overflow-hidden">
          <div className="px-8 py-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-3.5 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">LOOT BOX DATABASE</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl leading-tight">
              Every Game&apos;s Monetization,<br className="hidden md:block" /> Analyzed &amp; Scored
            </h1>
            <p className="text-lg text-blue-200/80 max-w-2xl mb-2">
              Drop rates, pity systems, cost breakdowns, and fairness scores for {games.length} major games. Data-driven. No guesswork.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
              <div>
                <p className="text-4xl md:text-5xl font-bold text-white">{games.length}</p>
                <p className="text-blue-200 text-sm mt-1">Games Analyzed</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-bold text-white">{totalDropRates}+</p>
                <p className="text-blue-200 text-sm mt-1">Drop Rates Tracked</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-bold text-white">
                  {games.length > 0 ? (games.reduce((s, g) => s + (g.lootboxes_score || 0), 0) / games.length).toFixed(1) : "—"}
                </p>
                <p className="text-blue-200 text-sm mt-1">Avg Score</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-bold text-white">8</p>
                <p className="text-blue-200 text-sm mt-1">Score Dimensions</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero (filtered views) */}
      {typeFilter && (
      <div className="mb-10">
        <Link
          href="/lootbox"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All Games
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
            typeMeta
              ? `${typeMeta.accentBg} ${typeMeta.accentBorder} border`
              : "bg-gradient-to-br from-blue-600 to-purple-600"
          }`}>
            {typeMeta ? (
              <typeMeta.icon className={`w-5 h-5 ${typeMeta.accentColor}`} />
            ) : (
              <Zap className="w-5 h-5 text-white" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {typeMeta ? typeMeta.heading : "Loot Box Database"}
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl">
          {typeMeta ? typeMeta.subtitle : ""}
        </p>

        {/* Stats (filtered views only) */}
        <div className="flex flex-wrap gap-4 mt-6">
          <div className={`flex items-center gap-2 rounded-lg px-4 py-2.5 border ${
            typeMeta
              ? `${typeMeta.accentBg} ${typeMeta.accentBorder}`
              : "bg-blue-50 border-blue-100"
          }`}>
            <BarChart3 className={`w-4 h-4 ${typeMeta ? typeMeta.accentColor : "text-blue-600"}`} />
            <span className={`text-sm font-semibold ${typeMeta ? "text-gray-900" : "text-blue-900"}`}>
              {games.length} {typeMeta ? `${typeMeta.heading.replace(" Games", "")} Game${games.length !== 1 ? "s" : ""}` : "Games Analyzed"}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200">
            <span className="text-sm font-semibold text-gray-700">
              Avg Score: {games.length > 0 ? (games.reduce((s, g) => s + (g.lootboxes_score || 0), 0) / games.length).toFixed(1) : "—"}
            </span>
          </div>
        </div>

        {/* Type filter pills (shown on filtered pages) */}
          <div className="flex flex-wrap gap-2 mt-5">
            {VALID_TYPES.filter(t => t !== "battle_pass").map((t) => {
              const meta = SYSTEM_TYPE_META[t];
              const isActive = t === typeFilter;
              return (
                <Link
                  key={t}
                  href={`/lootbox?type=${t}`}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    isActive
                      ? `${meta.accentBg} ${meta.accentBorder} ${meta.accentColor}`
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {meta.heading.replace(" Games", "")}
                </Link>
              );
            })}
            <Link
              href="/lootbox"
              className="text-xs font-medium px-3 py-1.5 rounded-full border bg-white border-gray-200 text-gray-500 hover:border-gray-300 transition-colors"
            >
              View All
            </Link>
          </div>
      </div>
      )}

      {/* Rankings CTA */}
      {!typeFilter && (
        <div className="mb-8 flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 px-6 py-4">
          <div>
            <h2 className="font-bold text-gray-900">Loot Box Rankings</h2>
            <p className="text-sm text-gray-600">See every game ranked by monetization fairness — best to worst.</p>
          </div>
          <Link
            href="/lootbox/rankings"
            className="flex-shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
          >
            View Rankings
          </Link>
        </div>
      )}

      {/* Type-specific stats cards (shown on filtered pages) */}
      {typeFilter && games.length > 0 && (() => {
        const contents = games.map((g) => toContentArray(g.lootbox_content)[0]).filter(Boolean);
        const withPity = contents.filter((c) => c.has_pity_system).length;
        const pityPct = Math.round((withPity / games.length) * 100);
        const costs = contents.map((c) => c.cost_per_pull).filter((c): c is number => c !== null && c > 0);
        const avgCost = costs.length > 0 ? (costs.reduce((a, b) => a + b, 0) / costs.length) : null;
        const scores = games.map((g) => g.lootboxes_score).filter((s): s is number => s !== null);
        const bestGame = games.reduce((best, g) => (!best || (g.lootboxes_score || 0) > (best.lootboxes_score || 0) ? g : best), games[0]);
        const worstGame = games.reduce((worst, g) => (!worst || (g.lootboxes_score || 0) < (worst.lootboxes_score || 0) ? g : worst), games[0]);

        return (
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className={`rounded-xl border p-4 ${typeMeta!.accentBg} ${typeMeta!.accentBorder}`}>
                <p className="text-xs font-medium text-gray-500 mb-1">Pity System Rate</p>
                <p className="text-2xl font-bold text-gray-900">{pityPct}%</p>
                <p className="text-xs text-gray-500">{withPity} of {games.length} games</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-medium text-gray-500 mb-1">Avg Cost / Pull</p>
                <p className="text-2xl font-bold text-gray-900">{avgCost ? `$${avgCost.toFixed(2)}` : "—"}</p>
                <p className="text-xs text-gray-500">{costs.length} games with data</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-medium text-gray-500 mb-1">Best Rated</p>
                <p className="text-lg font-bold text-gray-900 line-clamp-1">{bestGame.title}</p>
                <p className="text-xs text-emerald-600 font-semibold">{bestGame.lootboxes_score?.toFixed(1)} / 10</p>
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                <p className="text-xs font-medium text-gray-500 mb-1">Lowest Rated</p>
                <p className="text-lg font-bold text-gray-900 line-clamp-1">{worstGame.title}</p>
                <p className="text-xs text-rose-600 font-semibold">{worstGame.lootboxes_score?.toFixed(1)} / 10</p>
              </div>
            </div>

            {/* Quick comparison link */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-3">
              <p className="text-sm text-gray-600">
                See how these {games.length} {typeMeta!.heading.toLowerCase().replace(" games", "")} games compare to all {typeFilter === "gacha" ? "loot box" : "gacha"} games and more.
              </p>
              <Link href="/lootbox/rankings" className="text-sm font-medium text-blue-600 hover:underline flex-shrink-0 ml-4">
                Full Rankings →
              </Link>
            </div>
          </div>
        );
      })()}

      {/* Games Grid */}
      {games.length === 0 && typeFilter && (
        <div className="text-center py-16 mb-12">
          <p className="text-gray-500 mb-4">No {typeMeta?.heading.toLowerCase() || "games"} found yet.</p>
          <Link href="/lootbox" className="text-sm font-medium text-blue-600 hover:underline">
            View all games →
          </Link>
        </div>
      )}

      {/* Section heading for filtered views */}
      {typeFilter && games.length > 0 && (
        <h2 className="text-xl font-bold text-gray-900 mb-4">All {typeMeta!.heading} ({games.length})</h2>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-12">
        {games.map((game) => {
          const content = toContentArray(game.lootbox_content)[0];
          const sys = systemLabel(game.loot_system_type);
          const bannerImage = game.screenshot_image || game.cover_image;
          return (
            <Link
              key={game.slug}
              href={`/lootbox/${game.slug}`}
              className="group rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              {/* Banner Section */}
              <div className="relative h-20 overflow-hidden bg-gray-100">
                {bannerImage ? (
                  <img
                    src={bannerImage}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
                )}
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Score Ring - positioned at top right */}
                {game.lootboxes_score !== null && (
                  <div
                    className={`absolute top-3 right-3 ${scoreColor(
                      game.lootboxes_score
                    )} w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow-lg`}
                  >
                    {game.lootboxes_score.toFixed(1)}
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-4">
                <div className="mb-3">
                  <h2 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-base">
                    {game.title}
                  </h2>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${sys.color}`}
                  >
                    {sys.label}
                  </span>
                  {content?.has_pity_system && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                      Has Pity System
                    </span>
                  )}
                  {content?.cost_per_pull !== null && content.cost_per_pull > 0 && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                      ${content.cost_per_pull.toFixed(2)}/pull
                    </span>
                  )}
                </div>

                {/* Verdict */}
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                  {scoreVerdict(game.lootboxes_score)}
                </p>

                <span className="inline-block text-sm font-medium text-blue-600 group-hover:underline">
                  View Full Analysis →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Methodology (only on main hub) */}
      {!typeFilter && <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
        <div className="flex items-center gap-3 mb-5">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            How We Rate Games
          </h2>
        </div>
        <p className="text-sm text-gray-600 mb-6 max-w-2xl">
          Every game receives a Lootboxes Score from 1-10 based on 8 criteria
          across three weighted categories. Our methodology is transparent,
          criteria-based, and open to scrutiny.
        </p>

        {/* Category cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-blue-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-sm">
                Consumer Protection
              </h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                40%
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Transparency, regulatory compliance, and spending safeguards.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-emerald-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-sm">
                Value &amp; Fairness
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                35%
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Value for money, fairness mechanics, and pay-to-win impact.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-purple-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-sm">
                Player Experience
              </h3>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                25%
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Player control over purchases and psychological design integrity.
            </p>
          </div>
        </div>

        <Link
          href="/methodology"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
        >
          Read our full methodology →
        </Link>
      </div>}

      {/* Quick links */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 mb-3">
          Looking for raw data?{" "}
          <Link
            href="/drop-rates"
            className="text-blue-600 font-medium hover:underline"
          >
            View the Drop Rate Database →
          </Link>
        </p>
      </div>
    </div>
  );
}
