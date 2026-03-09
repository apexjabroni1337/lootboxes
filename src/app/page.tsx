import Link from "next/link";
import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import ScoreBadge from "@/components/analytics/ScoreBadge";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import HowItWorks from "@/components/home/HowItWorks";
import AffiliateNotice from "@/components/shared/AffiliateNotice";
import TrustSignals from "@/components/home/TrustSignals";
import GameAvatar from "@/components/ui/GameAvatar";
import {
  ArrowRight,
  Sparkles,
  Bell,
  Shield,
  Zap,
  BarChart3,
  Box,
  Layers,
  ShoppingBag,
  TrendingDown,
  Award,
  Flame,
} from "lucide-react";
import type { Metadata } from "next";
import { AnalyticsMeta } from "@/lib/types";
import { createServerClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "LootBoxes.com — Gaming Deals, Drop Rates & In-Game Value Analysis",
  description:
    "Find the best gaming deals across every store. Get data-driven loot box analysis, battle pass reviews, and drop rates for every major game.",
  openGraph: {
    title: "LootBoxes.com — Gaming Deals, Drop Rates & In-Game Value Analysis",
    description:
      "Compare game deals across 30+ stores. Transparent loot box analysis, drop rates, and monetization reviews.",
    url: "https://lootboxes.com",
    images: [
      {
        url: "https://lootboxes.com/og-default.png",
        width: 1200,
        height: 630,
        alt: "LootBoxes.com — Gaming Deals, Drop Rates & In-Game Value Analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LootBoxes.com — Gaming Deals & Loot Box Analysis",
    description:
      "Data-driven loot box analysis, drop rates, and gaming deals across every store.",
    images: ["https://lootboxes.com/og-default.png"],
  },
};

export const revalidate = 300;

/* ── Fetch lootbox games for the homepage ── */
async function getFeaturedGames() {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("games")
    .select(
      `id, title, slug, cover_image, screenshot_image, lootboxes_score, loot_system_type,
       lootbox_content (cost_per_pull, has_pity_system)`
    )
    .not("loot_system_type", "is", null)
    .order("lootboxes_score", { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return (data as any[]).filter(
    (g) =>
      g.lootbox_content !== null &&
      (Array.isArray(g.lootbox_content)
        ? g.lootbox_content.length > 0
        : true)
  );
}

/* ── Fetch dynamic lootbox database stats ── */
async function getSiteStats() {
  const supabase = createServerClient();

  const [
    { count: lootboxGames },
    { count: dropRatesTracked },
    { count: analyticsArticles },
  ] = await Promise.all([
    supabase
      .from("games")
      .select("id", { count: "exact", head: true })
      .not("loot_system_type", "is", null),
    supabase.from("drop_rates").select("id", { count: "exact", head: true }),
    supabase.from("analytics").select("id", { count: "exact", head: true }),
  ]);

  return {
    lootboxGames: lootboxGames || 0,
    dropRatesTracked: dropRatesTracked || 0,
    analyticsArticles: analyticsArticles || 0,
  };
}

/* ── Score helpers ── */
function scoreColor(score: number | null): string {
  if (score === null) return "bg-gray-400";
  if (score >= 7) return "bg-emerald-500";
  if (score >= 5) return "bg-amber-500";
  if (score >= 3) return "bg-orange-500";
  return "bg-red-500";
}

function systemLabel(type: string | null): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    gacha: { label: "Gacha", color: "bg-purple-100 text-purple-700" },
    loot_box: { label: "Loot Box", color: "bg-red-100 text-red-700" },
    card_pack: { label: "Card Pack", color: "bg-blue-100 text-blue-700" },
    cosmetic_shop: { label: "Cosmetic Shop", color: "bg-emerald-100 text-emerald-700" },
    battle_pass: { label: "Battle Pass", color: "bg-amber-100 text-amber-700" },
  };
  return type && map[type]
    ? map[type]
    : { label: type || "Unknown", color: "bg-gray-100 text-gray-600" };
}

/* ── System type browse cards ── */
const SYSTEM_TYPES = [
  {
    type: "gacha",
    label: "Gacha Games",
    description: "Banner rates, pity systems & cost-per-pull analysis",
    icon: Sparkles,
    gradient: "from-purple-500 to-fuchsia-600",
  },
  {
    type: "loot_box",
    label: "Loot Boxes",
    description: "Drop odds, transparency & value breakdowns",
    icon: Box,
    gradient: "from-red-500 to-rose-600",
  },
  {
    type: "card_pack",
    label: "Card Packs",
    description: "Pull rates, pack odds & crafting economics",
    icon: Layers,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    type: "cosmetic_shop",
    label: "Cosmetic Shops",
    description: "Pricing fairness, skin economics & shop value",
    icon: ShoppingBag,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    type: "battle_pass",
    label: "Battle Passes",
    description: "Progression pacing, premium value & reward fairness",
    icon: Shield,
    gradient: "from-amber-500 to-orange-600",
  },
];

/* ── Fetch system type counts + representative images from DB ── */
async function getSystemTypeCounts(): Promise<
  Record<string, { count: number; image: string | null }>
> {
  const supabase = createServerClient();
  const types = ["gacha", "loot_box", "card_pack", "cosmetic_shop", "battle_pass"];
  const result: Record<string, { count: number; image: string | null }> = {};

  const [counts, images] = await Promise.all([
    Promise.all(
      types.map((type) =>
        supabase
          .from("games")
          .select("id", { count: "exact", head: true })
          .eq("loot_system_type", type)
      )
    ),
    Promise.all(
      types.map((type) =>
        supabase
          .from("games")
          .select("screenshot_image, cover_image")
          .eq("loot_system_type", type)
          .not("screenshot_image", "is", null)
          .order("lootboxes_score", { ascending: false })
          .limit(1)
          .single()
      )
    ),
  ]);

  types.forEach((type, i) => {
    const img = images[i].data;
    result[type] = {
      count: counts[i].count || 0,
      image: img?.screenshot_image || img?.cover_image || null,
    };
  });

  return result;
}

/* ── Fetch analytics article cover images from DB ── */
async function getAnalyticsCovers(): Promise<Record<string, string | null>> {
  const supabase = createServerClient();
  const slugs = ["fortnite", "genshin-impact", "valorant"];
  const { data } = await supabase
    .from("games")
    .select("slug, cover_image, screenshot_image")
    .in("slug", slugs);

  const map: Record<string, string | null> = {};
  for (const g of data || []) {
    // Prefer screenshot (gameplay) over cover (logo art)
    map[g.slug] = g.screenshot_image || g.cover_image;
  }
  // Fallback: use gameplay screenshots for hardcoded articles
  // if the DB image is missing or is just logo-style cover art
  const SCREENSHOT_FALLBACKS: Record<string, string> = {
    fortnite:
      "https://images.igdb.com/igdb/image/upload/t_screenshot_big/scvtmt.jpg",
    "genshin-impact":
      "https://images.igdb.com/igdb/image/upload/t_screenshot_big/scbh5m.jpg",
  };
  for (const slug of slugs) {
    if (!map[slug] || map[slug]?.includes("cover_big")) {
      map[slug] = SCREENSHOT_FALLBACKS[slug] || map[slug] || null;
    }
  }
  return map;
}

function buildHomeAnalytics(covers: Record<string, string | null>): AnalyticsMeta[] {
  return [
    {
      id: "a1",
      game_id: "3",
      slug: "fortnite-chapter-6-season-1-battle-pass",
      title: "Fortnite Chapter 6 Season 1 Battle Pass — Is It Worth It?",
      excerpt: "We break down every single tier of the Chapter 6 Season 1 Battle Pass, calculate the total V-Buck value you get back, and compare it to what you'd spend buying the same cosmetics directly from the Item Shop. Plus, we look at the XP grind required to hit Tier 100 and whether casual players can realistically finish the pass before the season ends.",
      type: "battlepass",
      lootboxes_score: 7.2,
      cover_image: covers["fortnite"] || null,
      published_at: "2026-02-20",
      updated_at: "2026-02-20",
    },
    {
      id: "a2",
      game_id: "4",
      slug: "genshin-impact-gacha-analysis-2026",
      title: "Genshin Impact Gacha System — Complete Drop Rate Analysis",
      excerpt: "A deep dive into Genshin Impact's gacha system: we break down the official drop rates for 5-star and 4-star characters, explain exactly how the soft pity and hard pity systems work, and calculate the expected real-money cost to pull a featured character. We also compare Genshin's rates to other gacha games and rate its overall fairness.",
      type: "lootbox",
      lootboxes_score: 4.8,
      cover_image: covers["genshin-impact"] || null,
      published_at: "2026-02-18",
      updated_at: "2026-02-18",
    },
    {
      id: "a3",
      game_id: "6",
      slug: "valorant-battle-pass-episode-10",
      title: "Valorant Episode 10 Battle Pass Review",
      excerpt: "Riot's latest battle pass brings new weapon skins, gun buddies, sprays, and player cards across 50 tiers. We analyze whether the 1000 VP price tag delivers enough value compared to buying skins from the rotating store, how the XP curve compares to previous episodes, and whether the premium rewards justify the grind for both casual and competitive players.",
      type: "battlepass",
      lootboxes_score: 5.5,
      cover_image: covers["valorant"] || null,
      published_at: "2026-02-15",
      updated_at: "2026-02-15",
    },
  ];
}

export default async function HomePage() {
  const [games, siteStats, analyticCovers, systemCounts] = await Promise.all([
    getFeaturedGames(),
    getSiteStats(),
    getAnalyticsCovers(),
    getSystemTypeCounts(),
  ]);
  const homeAnalytics = buildHomeAnalytics(analyticCovers);

  // Stats — use lootbox-analyzed games for scoring, site-wide for hero
  const analyzedCount = games.length;
  const avgScore =
    games.length > 0
      ? (
          games.reduce((s, g) => s + (g.lootboxes_score || 0), 0) /
          games.length
        ).toFixed(1)
      : "—";
  const bestGames = games.filter((g) => g.lootboxes_score >= 7);
  const worstGames = games.filter((g) => g.lootboxes_score !== null && g.lootboxes_score < 4);

  // Top 6 for featured grid
  const topGames = games.slice(0, 6);
  // Best & worst for leaderboard
  const bestThree = games.slice(0, 3);
  const worstThree = [...games].sort((a, b) => (a.lootboxes_score || 0) - (b.lootboxes_score || 0)).slice(0, 3);

  return (
    <>
      {/* ─── Hero: Loot Box Database ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDI4NDAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtNGgydjRoNHYyaC00djRoLTJ2LTR6bTAtMzBoLTJ2LTRoMnYtNGgydjRoNHYyaC00djRoLTJ2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative container-main py-16 sm:py-20">
          <div className="grid lg:grid-cols-[1fr,auto] gap-10 items-center">
            {/* Left: Text content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1.5 mb-6">
                <Sparkles className="h-3.5 w-3.5 text-blue-300" />
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                  THE LOOT BOX DATABASE
                </span>
              </div>

              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Loot Box Transparency{" "}
                <span className="text-blue-400">for Every Game</span>
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-blue-200/80">
                Data-driven loot box analysis, drop rates, and monetization scores
                for every major game. Exposing the real odds behind gacha, loot boxes, card packs, and battle passes.
              </p>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/lootbox"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-blue-50"
                >
                  <BarChart3 className="h-4 w-4" />
                  Browse Loot Box Database
                </Link>
                <Link
                  href="/lootbox/rankings"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
                >
                  <Award className="h-4 w-4" />
                  View Rankings
                </Link>
                <Link
                  href="/deals"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-blue-200 backdrop-blur transition-all hover:bg-white/10"
                >
                  <TrendingDown className="h-4 w-4" />
                  Game Deals
                </Link>
              </div>
            </div>

            {/* Right: Stacked CS2 Cases */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-[340px] h-[300px]">
                {/* Ambient glow */}
                <div
                  className="absolute rounded-full blur-[50px]"
                  style={{
                    width: 280,
                    height: 280,
                    top: 10,
                    left: 30,
                    background: "radial-gradient(circle, rgba(245,158,11,0.25), transparent)",
                  }}
                />
                {/* Back case — Kilowatt (rotated, faded) */}
                <img
                  src="https://static.wikia.nocookie.net/cswikia/images/e/e7/Kilowatt-case.png/revision/latest?cb=20240210202000"
                  alt="CS2 Kilowatt Case"
                  className="absolute drop-shadow-xl"
                  style={{
                    maxHeight: 200,
                    top: 60,
                    left: 120,
                    transform: "rotate(8deg)",
                    opacity: 0.6,
                    zIndex: 1,
                  }}
                />
                {/* Middle case — Gallery (slight tilt) */}
                <img
                  src="https://static.wikia.nocookie.net/cswikia/images/d/d1/Gallery-case.png/revision/latest?cb=20250925192158"
                  alt="CS2 Gallery Case"
                  className="absolute drop-shadow-xl"
                  style={{
                    maxHeight: 200,
                    top: 30,
                    left: 70,
                    transform: "rotate(-5deg)",
                    opacity: 0.8,
                    zIndex: 2,
                  }}
                />
                {/* Front case — Dreams & Nightmares (prominent) */}
                <img
                  src="https://static.wikia.nocookie.net/cswikia/images/f/f3/Dreams_nighmares_case.png/revision/latest?cb=20220121083639"
                  alt="CS2 Dreams and Nightmares Case"
                  className="absolute drop-shadow-2xl"
                  style={{
                    maxHeight: 230,
                    top: 10,
                    left: 20,
                    transform: "rotate(-2deg)",
                    zIndex: 3,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <p className="text-4xl font-bold text-white sm:text-5xl">
                {siteStats.lootboxGames}+
              </p>
              <p className="mt-1 text-sm text-blue-200">Games Analyzed</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white sm:text-5xl">{siteStats.dropRatesTracked || "0"}+</p>
              <p className="mt-1 text-sm text-blue-200">Drop Rates Tracked</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white sm:text-5xl">5</p>
              <p className="mt-1 text-sm text-blue-200">System Types Covered</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white sm:text-5xl">{siteStats.analyticsArticles || analyzedCount}</p>
              <p className="mt-1 text-sm text-blue-200">Deep-Dive Articles</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Browse by System Type ─── */}
      <section className="py-12 sm:py-16">
        <div className="container-main">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Browse by System Type
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Explore loot box mechanics across every monetization model
              </p>
            </div>
            <Link
              href="/lootbox"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SYSTEM_TYPES.map((st) => {
              const info = systemCounts[st.type] || { count: 0, image: null };
              return (
                <Link
                  key={st.type}
                  href={`/lootbox?type=${st.type}`}
                  className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]"
                  style={{ minHeight: "220px" }}
                >
                  {/* Background game art */}
                  {info.image && (
                    <img
                      src={info.image}
                      alt={`${st.label} games — browse ${st.type} loot systems`}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  )}
                  {/* Gradient overlay — stronger for legibility */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${st.gradient} ${
                      info.image ? "opacity-85" : "opacity-100"
                    } transition-opacity duration-300 group-hover:opacity-90`}
                  />
                  {/* Dark vignette — heavier at bottom where text lives */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/5" />
                  {/* Content */}
                  <div className="relative flex h-full flex-col justify-between px-5 py-6" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.45)" }}>
                    <div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/25 backdrop-blur-sm ring-1 ring-white/20 shadow-lg">
                        <st.icon className="h-5 w-5 text-white drop-shadow-md" />
                      </div>
                      <h3 className="mt-3 text-lg font-extrabold text-white" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.5)" }}>
                        {st.label}
                      </h3>
                      <p className="mt-1 text-[13px] font-medium leading-snug text-white/90">
                        {st.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3">
                      <span className="text-xs font-bold uppercase tracking-wide text-white/80">
                        {info.count} games
                      </span>
                      <span className="flex items-center gap-1 text-sm font-bold text-white transition-transform duration-200 group-hover:translate-x-0.5">
                        Explore
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Featured Games Grid ─── */}
      <section className="border-y border-gray-100 bg-gray-50/50 py-12 sm:py-16 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="container-main">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recently Analyzed
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                The latest games we&apos;ve scored for monetization fairness
              </p>
            </div>
            <Link
              href="/lootbox"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              See all games
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topGames.map((game) => {
              const bannerImage = game.screenshot_image || game.cover_image;
              const sys = systemLabel(game.loot_system_type);
              return (
                <Link
                  key={game.slug}
                  href={`/lootbox/${game.slug}`}
                  className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.01]"
                  style={{ minHeight: "280px" }}
                >
                  {/* Full-bleed background image */}
                  {bannerImage ? (
                    <img
                      src={bannerImage}
                      alt={game.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0">
                      <GameAvatar
                        gameName={game.title}
                        size="lg"
                        aspectRatio="video"
                        className="h-full w-full rounded-none"
                      />
                    </div>
                  )}
                  {/* Cinematic gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  {/* Top badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${sys.color} ring-1 ring-black/5`}
                    >
                      {sys.label}
                    </span>
                    {/* Score badge */}
                    {game.lootboxes_score !== null && (
                      <div
                        className={`${scoreColor(
                          game.lootboxes_score
                        )} flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/90 text-sm font-bold text-white shadow-xl backdrop-blur-sm`}
                      >
                        {game.lootboxes_score.toFixed(1)}
                      </div>
                    )}
                  </div>
                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-lg font-bold text-white drop-shadow-lg line-clamp-1">
                      {game.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-white/70">
                        Monetization Analysis
                      </span>
                      <span className="flex items-center gap-1 text-sm font-semibold text-white opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5">
                        View
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <HowItWorks />

      {/* ─── Leaderboard + Latest Analysis ─── */}
      <section className="py-14 sm:py-18">
        <div className="container-main">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Latest Analysis
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Deep dives into the monetization systems that matter
              </p>
            </div>
            <Link
              href="/analytics"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              All analytics
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Articles */}
            <div className="space-y-5 lg:col-span-2">
              {homeAnalytics.map((article) => (
                <AnalyticsCard key={article.id} article={article} />
              ))}
            </div>

            {/* Lootboxes Score Leaderboard */}
            <div className="space-y-5">
              {/* Best Value */}
              <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50/50 dark:border-emerald-900/40 dark:from-gray-900 dark:to-emerald-950/20">
                <div className="border-b border-emerald-100 bg-emerald-50/50 px-5 py-3 dark:border-emerald-900/30 dark:bg-emerald-950/30">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 text-[10px] text-white shadow-sm">
                      ▲
                    </span>
                    Best Value Monetization
                  </h3>
                  <p className="mt-0.5 text-[11px] text-emerald-600/70 dark:text-emerald-500/60">
                    Games with the fairest in-game spending
                  </p>
                </div>
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                  {bestThree.map((item, idx) => {
                    const thumb = item.cover_image || item.screenshot_image;
                    return (
                      <li key={item.slug}>
                        <Link
                          href={`/lootbox/${item.slug}`}
                          className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20"
                        >
                          <span className="text-xs font-bold text-gray-300 dark:text-gray-600 w-4">
                            {idx + 1}
                          </span>
                          <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={item.title}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <GameAvatar gameName={item.title} size="sm" aspectRatio="square" className="h-full w-full" />
                            )}
                          </div>
                          <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                            {item.title}
                          </span>
                          <ScoreBadge score={item.lootboxes_score} size="sm" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800">
                  <Link
                    href="/lootbox/rankings"
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                  >
                    See full rankings
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Watch Out */}
              <div className="overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-br from-white to-red-50/50 dark:border-red-900/40 dark:from-gray-900 dark:to-red-950/20">
                <div className="border-b border-red-100 bg-red-50/50 px-5 py-3 dark:border-red-900/30 dark:bg-red-950/30">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-400">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500 text-[10px] text-white shadow-sm">
                      ▼
                    </span>
                    Watch Out
                  </h3>
                  <p className="mt-0.5 text-[11px] text-red-600/70 dark:text-red-500/60">
                    Games with aggressive monetization
                  </p>
                </div>
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                  {worstThree.map((item, idx) => {
                    const thumb = item.cover_image || item.screenshot_image;
                    return (
                      <li key={item.slug}>
                        <Link
                          href={`/lootbox/${item.slug}`}
                          className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-red-50/50 dark:hover:bg-red-950/20"
                        >
                          <span className="text-xs font-bold text-gray-300 dark:text-gray-600 w-4">
                            {idx + 1}
                          </span>
                          <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={item.title}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <GameAvatar gameName={item.title} size="sm" aspectRatio="square" className="h-full w-full" />
                            )}
                          </div>
                          <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                            {item.title}
                          </span>
                          <ScoreBadge score={item.lootboxes_score} size="sm" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Rankings CTA ─── */}
      <section className="py-8">
        <div className="container-main">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-purple-950 px-8 py-8 sm:px-10 transition-all hover:shadow-2xl">
            {/* Subtle glow */}
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-purple-500/15 blur-2xl" />
            <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 mb-3">
                  <Award className="h-3.5 w-3.5 text-blue-300" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-200">
                    Leaderboard
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  Loot Box Rankings
                </h2>
                <p className="mt-2 max-w-lg text-sm text-blue-200/70">
                  Every game ranked by monetization fairness — from best to worst.
                  See tier breakdowns, category leaders, and the worst offenders.
                </p>
              </div>
              <Link
                href="/lootbox/rankings"
                className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-blue-50 hover:shadow-lg"
              >
                View Full Rankings
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Game Deals Crossover ─── */}
      <section className="py-10 sm:py-12">
        <div className="container-main">
          <div className="overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 dark:border-orange-900/30 dark:from-orange-950/30 dark:to-amber-950/30">
            <div className="flex flex-col items-center gap-6 px-8 py-10 text-center sm:flex-row sm:text-left">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-900/40">
                <Flame className="h-7 w-7 text-orange-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Also Looking for Game Deals?
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Compare prices across 13+ stores for thousands of games.
                  Find historic lows, track price drops, and never overpay.
                </p>
              </div>
              <div className="flex flex-shrink-0 gap-3">
                <Link
                  href="/deals"
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                >
                  <TrendingDown className="h-4 w-4" />
                  Browse Deals
                </Link>
                <Link
                  href="/games"
                  className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-white px-5 py-2.5 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-50 dark:border-orange-800 dark:bg-gray-900 dark:text-orange-400 dark:hover:bg-gray-800"
                >
                  All Games
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust Signals ─── */}
      <TrustSignals />

      {/* ─── Newsletter CTA ─── */}
      <section className="py-12 sm:py-14">
        <div className="container-main">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="grid items-center gap-0 lg:grid-cols-2">
              {/* Left: Content */}
              <div className="px-8 py-10 sm:px-12">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  <Bell className="h-3.5 w-3.5" />
                  Weekly Roundup
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                  Stay in the loop
                </h2>
                <p className="mt-3 max-w-md text-gray-500 dark:text-gray-400">
                  Get weekly loot box analysis updates, new game scores, deal
                  roundups, and battle pass reviews delivered to your inbox.
                </p>

                <div className="mt-5 flex flex-col gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-brand-600" />
                    New game analysis every week
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-brand-600" />
                    No spam — unsubscribe anytime
                  </div>
                </div>

                <NewsletterForm variant="inline" className="mt-6 max-w-md" />
              </div>

              {/* Right: Visual accent */}
              <div className="hidden bg-gradient-to-br from-brand-500 to-brand-700 px-12 py-10 lg:flex lg:flex-col lg:items-center lg:justify-center">
                <div className="text-center text-white">
                  <p className="text-5xl font-extrabold">
                    {siteStats.lootboxGames}+
                  </p>
                  <p className="mt-1 text-lg font-medium text-brand-100">
                    Games analyzed
                  </p>
                  <div className="mx-auto my-5 h-px w-20 bg-white/20" />
                  <p className="text-5xl font-extrabold">5</p>
                  <p className="mt-1 text-lg font-medium text-brand-100">
                    System types covered
                  </p>
                  <div className="mx-auto my-5 h-px w-20 bg-white/20" />
                  <p className="text-5xl font-extrabold">100%</p>
                  <p className="mt-1 text-lg font-medium text-brand-100">
                    Free forever
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <AffiliateNotice />
    </>
  );
}
