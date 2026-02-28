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

// TODO: Replace with real data from Supabase
const MOCK_GAMES: Game[] = [
  { id: "1", title: "Elden Ring", slug: "elden-ring", cover_image: null, platforms: ["PC", "PS5", "Xbox"], genres: ["RPG", "Action"], release_date: "2022-02-25", metacritic: 96, lootboxes_score: null, created_at: "", updated_at: "" },
  { id: "2", title: "Baldur's Gate 3", slug: "baldurs-gate-3", cover_image: null, platforms: ["PC", "PS5"], genres: ["RPG"], release_date: "2023-08-03", metacritic: 96, lootboxes_score: null, created_at: "", updated_at: "" },
  { id: "3", title: "Fortnite", slug: "fortnite", cover_image: null, platforms: ["PC", "PS5", "Xbox", "Switch"], genres: ["Battle Royale"], release_date: "2017-07-21", metacritic: null, lootboxes_score: 7.2, created_at: "", updated_at: "" },
  { id: "4", title: "Genshin Impact", slug: "genshin-impact", cover_image: null, platforms: ["PC", "PS5", "Mobile"], genres: ["Action RPG", "Gacha"], release_date: "2020-09-28", metacritic: 84, lootboxes_score: 4.8, created_at: "", updated_at: "" },
  { id: "5", title: "Cyberpunk 2077", slug: "cyberpunk-2077", cover_image: null, platforms: ["PC", "PS5", "Xbox"], genres: ["RPG", "Action"], release_date: "2020-12-10", metacritic: 86, lootboxes_score: null, created_at: "", updated_at: "" },
  { id: "6", title: "Valorant", slug: "valorant", cover_image: null, platforms: ["PC"], genres: ["FPS"], release_date: "2020-06-02", metacritic: 80, lootboxes_score: 5.5, created_at: "", updated_at: "" },
  { id: "7", title: "Hades II", slug: "hades-ii", cover_image: null, platforms: ["PC"], genres: ["Roguelike", "Action"], release_date: "2024-05-06", metacritic: 92, lootboxes_score: null, created_at: "", updated_at: "" },
  { id: "8", title: "Monster Hunter Wilds", slug: "monster-hunter-wilds", cover_image: null, platforms: ["PC", "PS5", "Xbox"], genres: ["Action RPG"], release_date: "2025-02-28", metacritic: 90, lootboxes_score: null, created_at: "", updated_at: "" },
];

const MOCK_DEALS: Deal[] = [
  { id: "d1", game_id: "1", store: "steam", store_url: "", price: 29.99, original_price: 59.99, discount_pct: 50, currency: "USD", is_historic_low: true, expires_at: null, affiliate_url: null, scraped_at: new Date().toISOString(), game: MOCK_GAMES[0] },
  { id: "d2", game_id: "2", store: "gog", store_url: "", price: 35.99, original_price: 59.99, discount_pct: 40, currency: "USD", is_historic_low: false, expires_at: null, affiliate_url: null, scraped_at: new Date().toISOString(), game: MOCK_GAMES[1] },
  { id: "d3", game_id: "5", store: "epic", store_url: "", price: 19.99, original_price: 59.99, discount_pct: 67, currency: "USD", is_historic_low: true, expires_at: null, affiliate_url: null, scraped_at: new Date().toISOString(), game: MOCK_GAMES[4] },
  { id: "d4", game_id: "7", store: "steam", store_url: "", price: 22.49, original_price: 29.99, discount_pct: 25, currency: "USD", is_historic_low: true, expires_at: null, affiliate_url: null, scraped_at: new Date().toISOString(), game: MOCK_GAMES[6] },
  { id: "d5", game_id: "8", store: "fanatical", store_url: "", price: 44.99, original_price: 69.99, discount_pct: 36, currency: "USD", is_historic_low: false, expires_at: null, affiliate_url: null, scraped_at: new Date().toISOString(), game: MOCK_GAMES[7] },
  { id: "d6", game_id: "5", store: "humble", store_url: "", price: 22.49, original_price: 59.99, discount_pct: 63, currency: "USD", is_historic_low: false, expires_at: null, affiliate_url: null, scraped_at: new Date().toISOString(), game: MOCK_GAMES[4] },
];

const MOCK_ANALYTICS: AnalyticsMeta[] = [
  { id: "a1", game_id: "3", slug: "fortnite-chapter-6-season-1-battle-pass", title: "Fortnite Chapter 6 Season 1 Battle Pass — Is It Worth It?", excerpt: "We break down every tier, calculate the V-Buck value, and compare it to direct cosmetic purchases.", type: "battlepass", lootboxes_score: 7.2, cover_image: null, published_at: "2026-02-20", updated_at: "2026-02-20", game: MOCK_GAMES[2] },
  { id: "a2", game_id: "4", slug: "genshin-impact-gacha-analysis-2026", title: "Genshin Impact Gacha System — Complete Drop Rate Analysis", excerpt: "Official drop rates, pity system breakdown, and expected spending to pull featured characters.", type: "lootbox", lootboxes_score: 4.8, cover_image: null, published_at: "2026-02-18", updated_at: "2026-02-18", game: MOCK_GAMES[3] },
  { id: "a3", game_id: "6", slug: "valorant-battle-pass-episode-10", title: "Valorant Episode 10 Battle Pass Review", excerpt: "New skins, gun buddies, and sprays — here's whether this pass delivers enough value for 1000 VP.", type: "battlepass", lootboxes_score: 5.5, cover_image: null, published_at: "2026-02-15", updated_at: "2026-02-15", game: MOCK_GAMES[5] },
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

export default function HomePage() {
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
            Comparing prices across 8+ stores
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

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_DEALS.slice(0, 6).map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
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
              <span>✓ Best deals across 8+ stores</span>
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
