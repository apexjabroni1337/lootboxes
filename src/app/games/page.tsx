import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { STORES, getScoreClass } from "@/lib/types";
import ScoreBadge from "@/components/analytics/ScoreBadge";
import GameAvatar from "@/components/ui/GameAvatar";
import { Monitor, Calendar, Search, SlidersHorizontal, Star } from "lucide-react";

// TODO: Replace with Supabase queries + search params
const MOCK_GAMES = [
  { id: "1", title: "Elden Ring", slug: "elden-ring", platforms: ["PC", "PS5", "Xbox"], genres: ["RPG", "Action"], metacritic: 96, lootboxes_score: null, bestPrice: 29.99, dealCount: 6, cover_image: null },
  { id: "2", title: "Baldur's Gate 3", slug: "baldurs-gate-3", platforms: ["PC", "PS5", "Mac"], genres: ["RPG", "Strategy"], metacritic: 96, lootboxes_score: 9.2, bestPrice: 35.99, dealCount: 4, cover_image: null },
  { id: "3", title: "Counter-Strike 2", slug: "counter-strike-2", platforms: ["PC"], genres: ["FPS", "Competitive"], metacritic: 83, lootboxes_score: 3.8, bestPrice: 0, dealCount: 1, cover_image: null },
  { id: "4", title: "Diablo IV", slug: "diablo-4", platforms: ["PC", "PS5", "Xbox"], genres: ["RPG", "Action"], metacritic: 86, lootboxes_score: 5.2, bestPrice: 24.99, dealCount: 5, cover_image: null },
  { id: "5", title: "Hogwarts Legacy", slug: "hogwarts-legacy", platforms: ["PC", "PS5", "Xbox", "Switch"], genres: ["RPG", "Action"], metacritic: 84, lootboxes_score: 8.5, bestPrice: 19.99, dealCount: 7, cover_image: null },
  { id: "6", title: "Starfield", slug: "starfield", platforms: ["PC", "Xbox"], genres: ["RPG", "Open World"], metacritic: 83, lootboxes_score: 6.1, bestPrice: 29.99, dealCount: 4, cover_image: null },
  { id: "7", title: "FIFA 25", slug: "fifa-25", platforms: ["PC", "PS5", "Xbox"], genres: ["Sports"], metacritic: 72, lootboxes_score: 2.1, bestPrice: 34.99, dealCount: 3, cover_image: null },
  { id: "8", title: "Overwatch 2", slug: "overwatch-2", platforms: ["PC", "PS5", "Xbox", "Switch"], genres: ["FPS", "Competitive"], metacritic: 79, lootboxes_score: 4.0, bestPrice: 0, dealCount: 1, cover_image: null },
  { id: "9", title: "Cyberpunk 2077", slug: "cyberpunk-2077", platforms: ["PC", "PS5", "Xbox"], genres: ["RPG", "Open World"], metacritic: 86, lootboxes_score: 9.0, bestPrice: 14.99, dealCount: 8, cover_image: null },
  { id: "10", title: "Genshin Impact", slug: "genshin-impact", platforms: ["PC", "PS5", "Mobile"], genres: ["RPG", "Gacha"], metacritic: 84, lootboxes_score: 3.2, bestPrice: 0, dealCount: 1, cover_image: null },
  { id: "11", title: "Lies of P", slug: "lies-of-p", platforms: ["PC", "PS5", "Xbox"], genres: ["RPG", "Action"], metacritic: 80, lootboxes_score: 8.8, bestPrice: 29.99, dealCount: 5, cover_image: null },
  { id: "12", title: "Dark Souls III", slug: "dark-souls-3", platforms: ["PC", "PS4", "Xbox One"], genres: ["RPG", "Action"], metacritic: 89, lootboxes_score: null, bestPrice: 14.99, dealCount: 6, cover_image: null },
];

export const metadata = {
  title: "All Games — Browse Deals & Prices",
  description:
    "Browse our complete catalog of video game deals and price comparisons across every major store.",
};

export default function GamesPage() {
  return (
    <div className="py-8">
      <div className="container-main">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Games</h1>
            <p className="mt-1 text-gray-500">
              Browse our catalog of {MOCK_GAMES.length} tracked games with live prices.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search games..."
                className="input pl-9 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {["All", "RPG", "FPS", "Action", "Strategy", "Sports", "Open World"].map(
            (genre) => (
              <button
                key={genre}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  genre === "All"
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:text-brand-600"
                }`}
              >
                {genre}
              </button>
            )
          )}
        </div>

        {/* Games grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_GAMES.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="card group flex gap-4 transition-shadow hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                {game.cover_image ? (
                  <img
                    src={game.cover_image}
                    alt={game.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <GameAvatar
                    gameName={game.title}
                    size="sm"
                    aspectRatio="portrait"
                    className="h-full w-full"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand-600">
                    {game.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {game.genres.map((g) => (
                      <span key={g} className="badge-type text-[10px]">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {game.bestPrice === 0 ? (
                      <span className="text-sm font-bold text-success-600">
                        Free to Play
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-gray-900">
                        From {formatPrice(game.bestPrice)}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {game.dealCount} deals
                    </span>
                  </div>

                  {game.lootboxes_score && (
                    <ScoreBadge score={game.lootboxes_score} size="sm" />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination placeholder */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <button className="btn-secondary px-3 py-1.5 text-sm" disabled>
            Previous
          </button>
          <span className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white">
            1
          </span>
          <button className="btn-secondary px-3 py-1.5 text-sm">2</button>
          <button className="btn-secondary px-3 py-1.5 text-sm">3</button>
          <button className="btn-secondary px-3 py-1.5 text-sm">Next</button>
        </div>
      </div>
    </div>
  );
}
