import Link from "next/link";
import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import ScoreBadge from "@/components/analytics/ScoreBadge";
import { AnalyticsMeta, Game } from "@/lib/types";
import { BarChart3, Sparkles } from "lucide-react";

// TODO: Replace with MDX content index + Supabase metadata
const MOCK_GAMES: Record<string, Game> = {
  fortnite: { id: "3", title: "Fortnite", slug: "fortnite", cover_image: null, platforms: ["PC", "PS5", "Xbox", "Switch"], genres: ["Battle Royale"], release_date: "2017-07-21", metacritic: null, lootboxes_score: 7.2, created_at: "", updated_at: "" },
  genshin: { id: "4", title: "Genshin Impact", slug: "genshin-impact", cover_image: null, platforms: ["PC", "PS5", "Mobile"], genres: ["Action RPG", "Gacha"], release_date: "2020-09-28", metacritic: 84, lootboxes_score: 4.8, created_at: "", updated_at: "" },
  valorant: { id: "6", title: "Valorant", slug: "valorant", cover_image: null, platforms: ["PC"], genres: ["FPS"], release_date: "2020-06-02", metacritic: 80, lootboxes_score: 5.5, created_at: "", updated_at: "" },
  ow2: { id: "7", title: "Overwatch 2", slug: "overwatch-2", cover_image: null, platforms: ["PC", "PS5", "Xbox"], genres: ["FPS"], release_date: "2022-10-04", metacritic: 79, lootboxes_score: 3.9, created_at: "", updated_at: "" },
};

const MOCK_ARTICLES: AnalyticsMeta[] = [
  { id: "a1", game_id: "3", slug: "fortnite-chapter-6-season-1-battle-pass", title: "Fortnite Chapter 6 Season 1 Battle Pass — Is It Worth It?", excerpt: "We break down every tier, calculate the V-Buck value, and compare it to direct cosmetic purchases. This season's pass offers solid value for regular players.", type: "battlepass", lootboxes_score: 7.2, cover_image: null, published_at: "2026-02-20", updated_at: "2026-02-20", game: MOCK_GAMES.fortnite },
  { id: "a2", game_id: "4", slug: "genshin-impact-gacha-analysis-2026", title: "Genshin Impact Gacha System — Complete Drop Rate Analysis", excerpt: "Official drop rates, pity system breakdown, and expected spending to pull featured characters. We calculated the average cost per 5-star.", type: "lootbox", lootboxes_score: 4.8, cover_image: null, published_at: "2026-02-18", updated_at: "2026-02-18", game: MOCK_GAMES.genshin },
  { id: "a3", game_id: "6", slug: "valorant-battle-pass-episode-10", title: "Valorant Episode 10 Battle Pass Review", excerpt: "New skins, gun buddies, and sprays — here's whether this pass delivers enough value for 1000 VP.", type: "battlepass", lootboxes_score: 5.5, cover_image: null, published_at: "2026-02-15", updated_at: "2026-02-15", game: MOCK_GAMES.valorant },
  { id: "a4", game_id: "7", slug: "overwatch-2-shop-analysis", title: "Overwatch 2 Shop & Battle Pass: A Monetization Deep-Dive", excerpt: "From the old loot box system to the new shop model — we analyze whether players are getting better or worse value.", type: "lootbox", lootboxes_score: 3.9, cover_image: null, published_at: "2026-02-12", updated_at: "2026-02-12", game: MOCK_GAMES.ow2 },
];

const TYPES = [
  { label: "All", value: "all" },
  { label: "Battle Pass Reviews", value: "battlepass" },
  { label: "Loot Box Analysis", value: "lootbox" },
  { label: "Economy Deep-Dives", value: "economy" },
  { label: "Drop Rate Reports", value: "droprates" },
];

export const metadata = {
  title: "Loot Box Analytics & Battle Pass Reviews",
  description:
    "Data-driven analysis of loot boxes, battle passes, gacha systems, and in-game economies. Our Lootboxes Score rates every game's monetization.",
};

export default function AnalyticsPage() {
  return (
    <div className="pb-12">
      {/* Page hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-8 sm:py-10">
        <div className="container-main">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-brand-600" />
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Data-driven analysis of loot boxes, battle passes, and in-game
            economies. Rated with our proprietary Lootboxes Score.
          </p>
        </div>
      </section>

      <div className="container-main mt-6">
        {/* Type filter tabs */}
        <div className="flex flex-wrap gap-2">
          {TYPES.map((type) => (
            <button
              key={type.value}
              className={`badge border ${
                type.value === "all"
                  ? "border-brand-300 bg-brand-50 text-brand-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Articles grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {MOCK_ARTICLES.map((article) => (
              <AnalyticsCard key={article.id} article={article} />
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Methodology link */}
            <div className="card border-brand-200 bg-brand-50">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-600" />
                <h3 className="font-semibold text-brand-900">
                  How We Score Games
                </h3>
              </div>
              <p className="mt-2 text-sm text-brand-700">
                Our Lootboxes Score rates monetization on value, transparency,
                fairness, and consumer practices.
              </p>
              <Link
                href="/methodology"
                className="mt-3 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Read our methodology →
              </Link>
            </div>

            {/* Recent scores */}
            <div className="card">
              <h3 className="text-sm font-semibold text-gray-900">
                Recent Scores
              </h3>
              <ul className="mt-3 space-y-3">
                {MOCK_ARTICLES.filter((a) => a.lootboxes_score).map(
                  (article) => (
                    <li key={article.id} className="flex items-center gap-3">
                      <ScoreBadge score={article.lootboxes_score!} size="sm" />
                      <div>
                        <Link
                          href={`/analytics/${article.slug}`}
                          className="text-sm text-gray-700 hover:text-brand-600"
                        >
                          {article.game?.title}
                        </Link>
                        <p className="text-xs text-gray-400">
                          {article.type === "battlepass"
                            ? "Battle Pass"
                            : "Loot Box"}
                        </p>
                      </div>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
