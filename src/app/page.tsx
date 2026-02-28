import Link from "next/link";
import DealCard from "@/components/deals/DealCard";
import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import ScoreBadge from "@/components/analytics/ScoreBadge";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import {
  Search,
  TrendingDown,
  BarChart3,
  Zap,
  ArrowRight,
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
];

const MOCK_DEALS: Deal[] = [
  { id: "d1", game_id: "1", store: "steam", store_url: "", price: 29.99, original_price: 59.99, discount_pct: 50, currency: "USD", is_historic_low: true, expires_at: null, affiliate_url: null, scraped_at: new Date().toISOString(), game: MOCK_GAMES[0] },
  { id: "d2", game_id: "2", store: "gog", store_url: "", price: 35.99, original_price: 59.99, discount_pct: 40, currency: "USD", is_historic_low: false, expires_at: null, affiliate_url: null, scraped_at: new Date().toISOString(), game: MOCK_GAMES[1] },
  { id: "d3", game_id: "5", store: "epic", store_url: "", price: 19.99, original_price: 59.99, discount_pct: 67, currency: "USD", is_historic_low: true, expires_at: null, affiliate_url: null, scraped_at: new Date().toISOString(), game: MOCK_GAMES[4] },
  { id: "d4", game_id: "1", store: "humble", store_url: "", price: 32.99, original_price: 59.99, discount_pct: 45, currency: "USD", is_historic_low: false, expires_at: null, affiliate_url: null, scraped_at: new Date().toISOString(), game: MOCK_GAMES[0] },
  { id: "d5", game_id: "5", store: "fanatical", store_url: "", price: 22.49, original_price: 59.99, discount_pct: 63, currency: "USD", is_historic_low: false, expires_at: null, affiliate_url: null, scraped_at: new Date().toISOString(), game: MOCK_GAMES[4] },
  { id: "d6", game_id: "2", store: "steam", store_url: "", price: 41.99, original_price: 59.99, discount_pct: 30, currency: "USD", is_historic_low: false, expires_at: null, affiliate_url: null, scraped_at: new Date().toISOString(), game: MOCK_GAMES[1] },
];

const MOCK_ANALYTICS: AnalyticsMeta[] = [
  { id: "a1", game_id: "3", slug: "fortnite-chapter-6-season-1-battle-pass", title: "Fortnite Chapter 6 Season 1 Battle Pass — Is It Worth It?", excerpt: "We break down every tier, calculate the V-Buck value, and compare it to direct cosmetic purchases.", type: "battlepass", lootboxes_score: 7.2, cover_image: null, published_at: "2026-02-20", updated_at: "2026-02-20", game: MOCK_GAMES[2] },
  { id: "a2", game_id: "4", slug: "genshin-impact-gacha-analysis-2026", title: "Genshin Impact Gacha System — Complete Drop Rate Analysis", excerpt: "Official drop rates, pity system breakdown, and expected spending to pull featured characters.", type: "lootbox", lootboxes_score: 4.8, cover_image: null, published_at: "2026-02-18", updated_at: "2026-02-18", game: MOCK_GAMES[3] },
  { id: "a3", game_id: "6", slug: "valorant-battle-pass-episode-10", title: "Valorant Episode 10 Battle Pass Review", excerpt: "New skins, gun buddies, and sprays — here's whether this pass delivers enough value for 1000 VP.", type: "battlepass", lootboxes_score: 5.5, cover_image: null, published_at: "2026-02-15", updated_at: "2026-02-15", game: MOCK_GAMES[5] },
];

const SCORE_LEADERBOARD = {
  best: [
    { game: "Fortnite", score: 7.2, slug: "fortnite" },
    { game: "Warframe", score: 8.5, slug: "warframe" },
    { game: "Deep Rock Galactic", score: 9.1, slug: "deep-rock-galactic" },
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
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-brand-50/50 to-white py-12 sm:py-16">
        <div className="container-main text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Save smarter.{" "}
            <span className="text-brand-600">Spend wiser.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            The best gaming deals across every store, plus data-driven loot box
            analysis so you know what&apos;s actually worth your money.
          </p>

          {/* Search bar */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
              <Search className="ml-2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search games, deals, or analytics..."
                className="flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
              <button className="btn-primary">Search</button>
            </div>
          </div>

          {/* Quick filter chips */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link
              href="/deals"
              className="badge border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100"
            >
              <TrendingDown className="mr-1 h-3 w-3" />
              Today&apos;s Best Deals
            </Link>
            <Link
              href="/analytics?type=battlepass"
              className="badge border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
            >
              <BarChart3 className="mr-1 h-3 w-3" />
              Battle Pass Reviews
            </Link>
            <Link
              href="/drop-rates"
              className="badge border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
            >
              <Zap className="mr-1 h-3 w-3" />
              Drop Rate Database
            </Link>
          </div>
        </div>
      </section>

      {/* Today's Top Deals */}
      <section className="py-12">
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

      {/* Featured Analytics + Score Leaderboard */}
      <section className="border-t border-gray-100 bg-gray-50 py-12">
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
                <h3 className="text-sm font-semibold text-success-700">
                  ✦ Best Value Monetization
                </h3>
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
              </div>

              <div className="card">
                <h3 className="text-sm font-semibold text-danger-600">
                  ✦ Worst Value Monetization
                </h3>
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

      {/* Newsletter CTA */}
      <section className="py-12">
        <div className="container-main">
          <div className="rounded-2xl bg-brand-600 px-6 py-10 text-center sm:px-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Never overpay for a game again
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-brand-100">
              Get weekly deal roundups and loot box analysis delivered to your
              inbox. No spam, just savings.
            </p>
            <NewsletterForm variant="inline" className="mx-auto mt-6 max-w-md" />
          </div>
        </div>
      </section>
    </>
  );
}
