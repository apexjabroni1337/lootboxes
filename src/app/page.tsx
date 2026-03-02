import Link from "next/link";
import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import ScoreBadge from "@/components/analytics/ScoreBadge";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import HowItWorks from "@/components/home/HowItWorks";
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
} from "lucide-react";
import { AnalyticsMeta } from "@/lib/types";
import { createServerClient } from "@/lib/supabase";

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

// Analytics section mock data
const MOCK_ANALYTICS: AnalyticsMeta[] = [
  {
    id: "a1",
    game_id: "3",
    slug: "fortnite-chapter-6-season-1-battle-pass",
    title: "Fortnite Chapter 6 Season 1 Battle Pass — Is It Worth It?",
    excerpt:
      "We break down every tier, calculate the V-Buck value, and compare it to direct cosmetic purchases.",
    type: "battlepass",
    lootboxes_score: 7.2,
    cover_image: null,
    published_at: "2026-02-20",
    updated_at: "2026-02-20",
  },
  {
    id: "a2",
    game_id: "4",
    slug: "genshin-impact-gacha-analysis-2026",
    title: "Genshin Impact Gacha System — Complete Drop Rate Analysis",
    excerpt:
      "Official drop rates, pity system breakdown, and expected spending to pull featured characters.",
    type: "lootbox",
    lootboxes_score: 4.8,
    cover_image: null,
    published_at: "2026-02-18",
    updated_at: "2026-02-18",
  },
  {
    id: "a3",
    game_id: "6",
    slug: "valorant-battle-pass-episode-10",
    title: "Valorant Episode 10 Battle Pass Review",
    excerpt:
      "New skins, gun buddies, and sprays — here's whether this pass delivers enough value for 1000 VP.",
    type: "battlepass",
    lootboxes_score: 5.5,
    cover_image: null,
    published_at: "2026-02-15",
    updated_at: "2026-02-15",
  },
];

export default async function HomePage() {
  const games = await getFeaturedGames();

  // Stats
  const totalGames = games.length;
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
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1.5 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-blue-300" />
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
              THE LOOT BOX DATABASE
            </span>
          </div>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Every Game&apos;s Monetization,{" "}
            <span className="text-blue-400">Analyzed &amp; Scored</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-200/80">
            Drop rates, pity systems, cost breakdowns, and fairness scores for{" "}
            {totalGames} major games. Data-driven analysis. No guesswork.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/lootbox"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-blue-50"
            >
              <BarChart3 className="h-4 w-4" />
              Browse All Games
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
              Hot Deals
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <p className="text-4xl font-bold text-white sm:text-5xl">{totalGames}</p>
              <p className="mt-1 text-sm text-blue-200">Games Analyzed</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white sm:text-5xl">{totalGames * 6}+</p>
              <p className="mt-1 text-sm text-blue-200">Drop Rates Tracked</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white sm:text-5xl">{avgScore}</p>
              <p className="mt-1 text-sm text-blue-200">Avg Score</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white sm:text-5xl">8</p>
              <p className="mt-1 text-sm text-blue-200">Score Dimensions</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Browse by System Type ─── */}
      <section className="py-10 sm:py-12">
        <div className="container-main">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Browse by System Type
            </h2>
            <Link
              href="/lootbox"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SYSTEM_TYPES.map((st) => {
              const count = games.filter(
                (g) => g.loot_system_type === st.type
              ).length;
              return (
                <Link
                  key={st.type}
                  href={`/lootbox?type=${st.type}`}
                  className="group relative overflow-hidden rounded-xl shadow-md transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div
                    className={`bg-gradient-to-br ${st.gradient} px-6 py-7`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                      <st.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-white">
                      {st.label}
                    </h3>
                    <p className="mt-1 text-sm text-white/75">
                      {st.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-white/60">
                        {count} games
                      </span>
                      <span className="text-sm font-medium text-white/90 group-hover:text-white">
                        Explore →
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
      <section className="border-y border-gray-100 bg-gray-50/50 py-10 sm:py-12">
        <div className="container-main">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Recently Analyzed
              </h2>
              <p className="mt-1 text-sm text-gray-500">
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

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topGames.map((game) => {
              const bannerImage = game.screenshot_image || game.cover_image;
              const sys = systemLabel(game.loot_system_type);
              return (
                <Link
                  key={game.slug}
                  href={`/lootbox/${game.slug}`}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  {/* Banner */}
                  <div className="relative h-24 overflow-hidden bg-gray-100">
                    {bannerImage ? (
                      <img
                        src={bannerImage}
                        alt={game.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <GameAvatar
                        gameName={game.title}
                        size="sm"
                        aspectRatio="video"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {/* Score ring */}
                    {game.lootboxes_score !== null && (
                      <div
                        className={`absolute bottom-2 right-2 ${scoreColor(
                          game.lootboxes_score
                        )} flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-sm font-bold text-white shadow-lg`}
                      >
                        {game.lootboxes_score.toFixed(1)}
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                      {game.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${sys.color}`}
                      >
                        {sys.label}
                      </span>
                    </div>
                    <span className="mt-3 inline-block text-sm font-medium text-brand-600 group-hover:underline">
                      View Analysis →
                    </span>
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
      <section className="py-12 sm:py-14">
        <div className="container-main">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Latest Analysis
            </h2>
            <Link
              href="/analytics"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              All analytics
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Articles */}
            <div className="space-y-4 lg:col-span-2">
              {MOCK_ANALYTICS.map((article) => (
                <AnalyticsCard key={article.id} article={article} />
              ))}
            </div>

            {/* Lootboxes Score Leaderboard */}
            <div className="space-y-4">
              <div className="card">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-success-700">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-success-100 text-[10px]">
                    ▲
                  </span>
                  Best Value Monetization
                </h3>
                <p className="mt-1 text-[11px] text-gray-400">
                  Games with the fairest in-game spending
                </p>
                <ul className="mt-3 space-y-3">
                  {bestThree.map((item) => (
                    <li key={item.slug} className="flex items-center gap-3">
                      <ScoreBadge score={item.lootboxes_score} size="sm" />
                      <Link
                        href={`/lootbox/${item.slug}`}
                        className="text-sm text-gray-700 hover:text-brand-600"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/lootbox/rankings"
                  className="mt-4 block text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  See full rankings →
                </Link>
              </div>

              <div className="card">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-danger-600">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-danger-100 text-[10px]">
                    ▼
                  </span>
                  Watch Out
                </h3>
                <p className="mt-1 text-[11px] text-gray-400">
                  Games with aggressive monetization
                </p>
                <ul className="mt-3 space-y-3">
                  {worstThree.map((item) => (
                    <li key={item.slug} className="flex items-center gap-3">
                      <ScoreBadge score={item.lootboxes_score} size="sm" />
                      <Link
                        href={`/lootbox/${item.slug}`}
                        className="text-sm text-gray-700 hover:text-brand-600"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Rankings CTA ─── */}
      <section className="py-8">
        <div className="container-main">
          <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 px-8 py-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Loot Box Rankings
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Every game ranked by monetization fairness — from best to worst.
                See tier breakdowns, category leaders, and the worst offenders.
              </p>
            </div>
            <Link
              href="/lootbox/rankings"
              className="flex-shrink-0 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
            >
              View Full Rankings
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Trust Signals ─── */}
      <TrustSignals />

      {/* ─── Newsletter CTA ─── */}
      <section className="py-12 sm:py-14">
        <div className="container-main">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="grid items-center gap-0 lg:grid-cols-2">
              {/* Left: Content */}
              <div className="px-8 py-10 sm:px-12">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  <Bell className="h-3.5 w-3.5" />
                  Weekly Roundup
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
                  Stay in the loop
                </h2>
                <p className="mt-3 max-w-md text-gray-500">
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
                  <p className="text-5xl font-extrabold">{totalGames}</p>
                  <p className="mt-1 text-lg font-medium text-brand-100">
                    Games scored
                  </p>
                  <div className="mx-auto my-5 h-px w-20 bg-white/20" />
                  <p className="text-5xl font-extrabold">8</p>
                  <p className="mt-1 text-lg font-medium text-brand-100">
                    Scoring criteria
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
    </>
  );
}
