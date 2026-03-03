import { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase";
import { Zap, Shield, BarChart3, ArrowLeft, Sparkles, Box, Layers, ShoppingBag, Trophy, ChevronRight } from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";

export const revalidate = 3600;

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
  tags: string[] | null;
  lootbox_content: LootboxContentRow | LootboxContentRow[] | null;
}

function toContentArray(
  content: LootboxContentRow | LootboxContentRow[] | null
): LootboxContentRow[] {
  if (!content) return [];
  return Array.isArray(content) ? content : [content];
}

function systemLabel(type: string | null): { label: string; color: string; darkColor: string } {
  const map: Record<string, { label: string; color: string; darkColor: string }> = {
    gacha: { label: "Gacha", color: "bg-purple-100 text-purple-700", darkColor: "dark:bg-purple-900/40 dark:text-purple-300" },
    loot_box: { label: "Loot Box", color: "bg-red-100 text-red-700", darkColor: "dark:bg-red-900/40 dark:text-red-300" },
    card_pack: { label: "Card Pack", color: "bg-blue-100 text-blue-700", darkColor: "dark:bg-blue-900/40 dark:text-blue-300" },
    cosmetic_shop: { label: "Cosmetic Shop", color: "bg-emerald-100 text-emerald-700", darkColor: "dark:bg-emerald-900/40 dark:text-emerald-300" },
    battle_pass: { label: "Battle Pass", color: "bg-amber-100 text-amber-700", darkColor: "dark:bg-amber-900/40 dark:text-amber-300" },
  };
  return type && map[type] ? map[type] : { label: type || "Unknown", color: "bg-gray-100 text-gray-600", darkColor: "dark:bg-gray-800 dark:text-gray-400" };
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

async function getAllGamesWithLootboxContent(): Promise<GameWithContent[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("games")
    .select(
      `id, title, slug, cover_image, screenshot_image, lootboxes_score, loot_system_type, tags,
       lootbox_content (cost_per_pull, has_pity_system, overview_html)`
    )
    .not("loot_system_type", "is", null)
    .order("lootboxes_score", { ascending: false });

  if (error || !data) return [];
  return (data as GameWithContent[]).filter(
    (g) => g.lootbox_content !== null && (Array.isArray(g.lootbox_content) ? g.lootbox_content.length > 0 : true)
  );
}

/* ── Bento Game Card ── */
function BentoGameCard({
  game,
  featured = false,
}: {
  game: GameWithContent;
  featured?: boolean;
}) {
  const content = toContentArray(game.lootbox_content)[0];
  const sys = systemLabel(game.loot_system_type);
  const tags = game.tags || [];
  const bannerImage = game.screenshot_image || game.cover_image;

  return (
    <Link
      href={`/lootbox/${game.slug}`}
      className={`group relative block rounded-2xl overflow-hidden ${
        featured ? "h-full" : "h-full min-h-[200px]"
      }`}
    >
      {/* Background Image */}
      {bannerImage ? (
        <img
          src={bannerImage}
          alt={game.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          style={{ filter: featured ? "brightness(0.6)" : "brightness(0.55)" }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Score Badge */}
      {game.lootboxes_score !== null && (
        <div
          className={`absolute top-3 right-3 ${
            featured ? "w-14 h-14 text-lg" : "w-10 h-10 text-sm"
          } ${scoreColor(
            game.lootboxes_score
          )} rounded-full flex items-center justify-center text-white font-extrabold border-2 border-white/90 shadow-lg shadow-black/30`}
        >
          {game.lootboxes_score.toFixed(1)}
        </div>
      )}

      {/* Content at bottom */}
      <div className={`absolute bottom-0 left-0 right-0 ${featured ? "p-6" : "p-4"}`}>
        {featured && (
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-3 py-1 mb-3">
            Top Rated
          </span>
        )}

        <h3
          className={`font-extrabold text-white leading-tight ${
            featured ? "text-2xl md:text-3xl" : "text-sm md:text-base"
          }`}
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
        >
          {game.title}
        </h3>

        <div className={`flex items-center gap-1.5 flex-wrap ${featured ? "mt-3" : "mt-2"}`}>
          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/15 text-white/80 backdrop-blur-sm">
            {sys.label}
          </span>
          {tags.includes("mobile") && (
            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 backdrop-blur-sm">
              Mobile
            </span>
          )}
          {tags.includes("multi_system") && (
            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 backdrop-blur-sm">
              Multi-System
            </span>
          )}
          {featured && content?.has_pity_system && (
            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 backdrop-blur-sm">
              Pity System
            </span>
          )}
          {featured && (
            <span className="text-xs text-white/50 ml-auto group-hover:text-white/70 transition-colors">
              View Analysis <ChevronRight className="w-3 h-3 inline" />
            </span>
          )}
        </div>

        {featured && (
          <p className="text-sm text-white/50 mt-2 line-clamp-2">
            {scoreVerdict(game.lootboxes_score)}
            {content?.cost_per_pull ? ` • $${content.cost_per_pull.toFixed(2)}/pull` : ""}
          </p>
        )}
      </div>
    </Link>
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

  /* Fetch ALL games — we need totals for the pills regardless of filter */
  const allGames = await getAllGamesWithLootboxContent();

  /* Count system types from ALL games (not filtered) */
  const typeCounts: Record<string, number> = {};
  allGames.forEach((g) => {
    if (g.loot_system_type) {
      typeCounts[g.loot_system_type] = (typeCounts[g.loot_system_type] || 0) + 1;
    }
  });

  /* Apply filter for display */
  const games = typeFilter
    ? allGames.filter((g) => g.loot_system_type === typeFilter)
    : allGames;

  const totalDropRates = games.length * 6;
  const avgScore =
    games.length > 0
      ? (games.reduce((s, g) => s + (g.lootboxes_score || 0), 0) / games.length).toFixed(1)
      : "—";

  /* Split games for bento layout */
  const featuredGame = games[0];
  const topRowGames = games.slice(1, 5);
  const statsRowGames = games.slice(5, 7);
  const remainingGames = games.slice(7);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* ── Header ── */}
      <div className="container-main pt-10 pb-6">
        <div className="flex flex-col gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/15 border border-indigo-400/25 rounded-full px-3.5 py-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider">
                Loot Box Database
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              {typeFilter && typeMeta ? (
                <>
                  {typeMeta.heading}
                </>
              ) : (
                <>
                  Every Game&apos;s Monetization,<br className="hidden md:block" /> Analyzed &amp; Scored
                </>
              )}
            </h1>
            <p className="text-slate-400 mt-2 max-w-lg text-sm">
              {typeFilter && typeMeta
                ? typeMeta.subtitle
                : `${allGames.length} games analyzed across ${Object.keys(typeCounts).length} monetization systems. Data-driven. No guesswork.`}
            </p>
          </div>

          {/* ── Filter Pills ── */}
          <div className="flex flex-wrap gap-2.5">
            {/* All button */}
            <Link
              href="/lootbox"
              className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl border transition-all ${
                !typeFilter
                  ? "bg-white/15 border-white/25 text-white shadow-lg shadow-white/5"
                  : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:bg-white/[0.08] hover:border-white/15 hover:text-white"
              }`}
            >
              <span>All</span>
              <span className={`text-xs font-medium ${!typeFilter ? "text-slate-300" : "text-slate-500"}`}>{allGames.length}</span>
            </Link>

            {VALID_TYPES.filter((t) => t !== "battle_pass").map((t) => {
              const meta = SYSTEM_TYPE_META[t];
              const count = typeCounts[t] || 0;
              const isActive = typeFilter === t;
              return (
                <Link
                  key={t}
                  href={`/lootbox?type=${t}`}
                  className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl border transition-all ${
                    isActive
                      ? "bg-white/15 border-white/25 text-white shadow-lg shadow-white/5"
                      : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:bg-white/[0.08] hover:border-white/15 hover:text-white"
                  }`}
                >
                  <span>{meta.heading.replace(" Games", "")}</span>
                  <span className={`text-xs font-medium ${isActive ? "text-slate-300" : "text-slate-500"}`}>{count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Filtered info bar ── */}
      {typeFilter && typeMeta && games.length > 0 && (() => {
        const contents = games.map((g) => toContentArray(g.lootbox_content)[0]).filter(Boolean);
        const withPity = contents.filter((c) => c.has_pity_system).length;
        const costs = contents.map((c) => c.cost_per_pull).filter((c): c is number => c !== null && c > 0);
        const avgCostVal = costs.length > 0 ? (costs.reduce((a, b) => a + b, 0) / costs.length) : null;
        return (
          <div className="container-main pb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Games</p>
                <p className="text-2xl font-extrabold text-white">{games.length}</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Avg Score</p>
                <p className="text-2xl font-extrabold text-white">{avgScore}</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Pity System</p>
                <p className="text-2xl font-extrabold text-white">{Math.round((withPity / games.length) * 100)}%</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Avg Cost/Pull</p>
                <p className="text-2xl font-extrabold text-white">{avgCostVal ? `$${avgCostVal.toFixed(2)}` : "—"}</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Empty State ── */}
      {games.length === 0 && (
        <div className="container-main text-center py-20">
          <p className="text-slate-400 mb-4">
            No {typeMeta?.heading.toLowerCase() || "games"} found yet.
          </p>
          <Link href="/lootbox" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
            View all games →
          </Link>
        </div>
      )}

      {/* ── Bento Grid ── */}
      {featuredGame && (
        <div className="container-main pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {/* Featured game — 2 col × 2 row */}
            <div className="col-span-2 row-span-2 min-h-[340px] md:min-h-[416px]">
              <BentoGameCard game={featuredGame} featured />
            </div>

            {/* Top row — up to 4 regular cards */}
            {topRowGames.map((game) => (
              <div key={game.slug} className="min-h-[200px]">
                <BentoGameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Stats Row + 2 more game cards ── */}
      {games.length > 5 && (
        <div className="container-main pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {/* Stats card — 2 cols */}
            <div className="col-span-2 rounded-2xl bg-gradient-to-br from-indigo-950 to-violet-950 border border-indigo-500/15 p-6 md:p-8 flex items-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 w-full">
                <div className="text-center md:text-left">
                  <p className="text-3xl md:text-4xl font-extrabold text-white">{games.length}</p>
                  <p className="text-xs text-indigo-300/60 font-medium mt-1">Games Analyzed</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-3xl md:text-4xl font-extrabold text-white">{totalDropRates}+</p>
                  <p className="text-xs text-indigo-300/60 font-medium mt-1">Drop Rates</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-3xl md:text-4xl font-extrabold text-white">{avgScore}</p>
                  <p className="text-xs text-indigo-300/60 font-medium mt-1">Avg Score</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-3xl md:text-4xl font-extrabold text-white">8</p>
                  <p className="text-xs text-indigo-300/60 font-medium mt-1">Dimensions</p>
                </div>
              </div>
            </div>

            {/* 2 more game cards */}
            {statsRowGames.map((game) => (
              <div key={game.slug} className="min-h-[200px]">
                <BentoGameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Remaining games — 4-col grid ── */}
      {remainingGames.length > 0 && (
        <div className="container-main pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {remainingGames.map((game) => (
              <div key={game.slug} className="min-h-[200px]">
                <BentoGameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Rankings CTA Banner ── */}
      <div className="container-main py-4">
        <Link
          href="/lootbox/rankings"
          className="group flex items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-600/20 via-purple-600/15 to-pink-600/10 border border-indigo-500/20 px-6 md:px-8 py-5 hover:border-indigo-400/30 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Loot Box Rankings</h2>
              <p className="text-sm text-slate-400">See every game ranked by monetization fairness — best to worst</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* ── Methodology Section ── */}
      <div className="container-main py-8 pb-16">
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">How We Rate Games</h2>
          </div>
          <p className="text-sm text-slate-400 mb-6 max-w-2xl">
            Every game receives a Lootboxes Score from 1-10 based on 8 criteria across three
            weighted categories. Our methodology is transparent, criteria-based, and open to scrutiny.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl bg-slate-800/60 border border-blue-500/15 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white text-sm">Consumer Protection</h3>
                <span className="text-xs font-bold text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded-full">40%</span>
              </div>
              <p className="text-xs text-slate-500">Transparency, regulatory compliance, and spending safeguards.</p>
            </div>
            <div className="rounded-xl bg-slate-800/60 border border-emerald-500/15 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white text-sm">Value &amp; Fairness</h3>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">35%</span>
              </div>
              <p className="text-xs text-slate-500">Value for money, fairness mechanics, and pay-to-win impact.</p>
            </div>
            <div className="rounded-xl bg-slate-800/60 border border-purple-500/15 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white text-sm">Player Experience</h3>
                <span className="text-xs font-bold text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded-full">25%</span>
              </div>
              <p className="text-xs text-slate-500">Player control over purchases and psychological design integrity.</p>
            </div>
          </div>

          <Link
            href="/methodology"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Read our full methodology →
          </Link>
        </div>
      </div>

      {/* Quick links */}
      <div className="container-main pb-12 text-center">
        <p className="text-slate-500 text-sm">
          Looking for raw data?{" "}
          <Link href="/drop-rates" className="text-blue-400 font-medium hover:text-blue-300 transition-colors">
            View the Drop Rate Database →
          </Link>
        </p>
      </div>
    </div>
  );
}
