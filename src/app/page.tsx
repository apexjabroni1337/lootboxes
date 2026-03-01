import Link from "next/link";
import DealCard from "@/components/deals/DealCard";
import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import ScoreBadge from "@/components/analytics/ScoreBadge";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import HowItWorks from "@/components/home/HowItWorks";
import TrustSignals from "@/components/home/TrustSignals";
import {
  Search,
  TrendingDown,
  BarChart3,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Deal, AnalyticsMeta, Game } from "@/lib/types";
import { createServerClient } from "@/lib/supabase";

export const revalidate = 300; // Revalidate every 5 minutes

async function getTopDeals(): Promise<Deal[]> {
  const supabase = createServerClient();

  // Get the best deals (highest discount, one per game)
  const { data: deals, error } = await supabase
    .from("deals")
    .select(`
      id,
      game_id,
      store,
      store_url,
      price,
      original_price,
      discount_pct,
      currency,
      is_historic_low,
      expires_at,
      affiliate_url,
      scraped_at,
      games!inner (
        id,
        title,
        slug,
        cover_image
      )
    `)
    .gt("discount_pct", 0)
    .order("discount_pct", { ascending: false })
    .limit(30);

  if (error || !deals) return [];

  // Deduplicate: one deal per game (best discount)
  const seenGames = new Set<string>();
  const topDeals: Deal[] = [];
  for (const d of deals as any[]) {
    if (seenGames.has(d.game_id)) continue;
    seenGames.add(d.game_id);
    topDeals.push({
      ...d,
      game: d.games,
    });
    if (topDeals.length >= 8) break;
  }

  return topDeals;
}

// Analytics section mock data (will be replaced when analytics content is added)
const MOCK_ANALYTICS: AnalyticsMeta[] = [
  { id: "a1", game_id: "3", slug: "fortnite-chapter-6-season-1-battle-pass", title: "Fortnite Chapter 6 Season 1 Battle Pass — Is It Worth It?", excerpt: "We break down every tier, calculate the V-Buck value, and compare it to direct cosmetic purchases.", type: "battlepass", lootboxes_score: 7.2, cover_image: null, published_at: "2026-02-20", updated_at: "2026-02-20" },
  { id: "a2", game_id: "4", slug: "genshin-impact-gacha-analysis-2026", title: "Genshin Impact Gacha System — Complete Drop Rate Analysis", excerpt: "Official drop rates, pity system breakdown, and expected spending to pull featured characters.", type: "lootbox", lootboxes_score: 4.8, cover_image: null, published_at: "2026-02-18", updated_at: "2026-02-18" },
  { id: "a3", game_id: "6", slug: "valorant-battle-pass-episode-10", title: "Valorant Episode 10 Battle Pass Review", excerpt: "New skins, gun buddies, and sprays — here's whether this pass delivers enough value for 1000 VP.", type: "battlepass", lootboxes_score: 5.5, cover_image: null, published_at: "2026-02-15", updated_at: "2026-02-15" },
];

const SCORE_LEADERBOARD = {
  best: [
    { game: "Deep Rock Galactic", score: 9.1, slug: "deep-rock-galactic" },
    { game: "Warframe", score: 8.5, slug: "warframe" },
    { game: "Fortnite", score: 7.2, slug: "fortnite" },
  ],
  worst: [
    { game: "Diablo Immortal", score: 2.1, slug: "diablo-immortal" },
    { game: "EA FC 25", score: 2.8, slug: "ea-fc-25" },
    { game: "Genshin Impact", score: 4.8, slug: "genshin-impact" },
  ],
};

export default async function HomePage() {
  const topDeals = await getTopDeals();

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 py-16 sm:py-20">
        {/* Decorative mesh */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="container-main relative text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            Comparing prices across 15+ stores
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Save smarter.{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
              Spend wiser.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-brand-100 sm:text-lg">
            The best gaming deals across every store, plus data-driven loot box
            analysis so you know what&apos;s actually worth your money.
          </p>

          {/* Search bar */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/95 p-2 shadow-lg backdrop-blur-sm">
              <Search className="ml-2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search games, deals, or analytics..."
                className="flex-1 border-0 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button className="btn-primary">Search</button>
            </div>
          </div>

          {/* Quick filter chips */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link
              href="/deals"
              className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
            >
              <TrendingDown className="h-3 w-3" />
              Today&apos;s Best Deals
            </Link>
            <Link
              href="/analytics?type=battlepass"
              className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
            >
              <BarChart3 className="h-3 w-3" />
              Battle Pass Reviews
            </Link>
            <Link
              href="/drop-rates"
              className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
            >
              <Zap className="h-3 w-3" />
              Drop Rate Database
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Today's Top Deals ─── */}
      <section className="py-12 sm:py-14">
        <div className="container-main">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Today&apos;s Top Deals
            </h2>
            <Link
              href="/deals"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              See all deals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {topDeals.length > 0 ? (
            <div className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {topDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-500">Deals are being synced. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <HowItWorks />

      {/* ─── Featured Analytics + Score Leaderboard ─── */}
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
                  {SCORE_LEADERBOARD.best.map((item) => (
                    <li key={item.slug} className="flex items-center gap-3">
                      <ScoreBadge score={item.score} size="sm" />
                      <Link
                        href={`/games/${item.slug}`}
                        className="text-sm text-gray-700 hover:text-brand-600"
                      >
                        {item.game}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/analytics?sort=score_desc"
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
                  {SCORE_LEADERBOARD.worst.map((item) => (
                    <li key={item.slug} className="flex items-center gap-3">
                      <ScoreBadge score={item.score} size="sm" />
                      <Link
                        href={`/games/${item.slug}`}
                        className="text-sm text-gray-700 hover:text-brand-600"
                      >
                        {item.game}
                      </Link>
                    </li>
                  ))}
                </ul>
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
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-10 text-center sm:px-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Never overpay for a game again
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-brand-100">
              Get weekly deal roundups, battle pass reviews, and loot box
              analysis delivered to your inbox.
            </p>

            <div className="mx-auto mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-brand-200">
              <span>✓ Best deals across 15+ stores</span>
              <span>✓ Monetization fairness scores</span>
              <span>✓ Unsubscribe anytime</span>
            </div>

            <NewsletterForm variant="inline" className="mx-auto mt-6 max-w-md" />
          </div>
        </div>
      </section>
    </>
  );
}
