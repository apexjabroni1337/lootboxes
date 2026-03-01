"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import GameAvatar from "@/components/ui/GameAvatar";
import { Search } from "lucide-react";

interface GameWithDeals {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  genres: string[] | null;
  platforms: string[] | null;
  metacritic: number | null;
  bestPrice: number | null;
  dealCount: number;
}

export default function GamesGrid({ games }: { games: GameWithDeals[] }) {
  const [search, setSearch] = useState("");

  const filtered = search.length >= 2
    ? games.filter((g) =>
        g.title.toLowerCase().includes(search.toLowerCase())
      )
    : games;

  return (
    <>
      {/* Header with search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Games</h1>
          <p className="mt-1 text-gray-500">
            Browse our catalog of {games.length} tracked games with live prices.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search games..."
            className="input pl-9 text-sm"
          />
        </div>
      </div>

      {/* Results count when filtering */}
      {search.length >= 2 && (
        <p className="mt-3 text-sm text-gray-500">
          {filtered.length} {filtered.length === 1 ? "game" : "games"} matching &ldquo;{search}&rdquo;
        </p>
      )}

      {/* Games grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((game) => (
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
                  loading="lazy"
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
                {game.genres && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {(Array.isArray(game.genres) ? game.genres : [])
                      .slice(0, 3)
                      .map((g: string) => (
                        <span key={g} className="badge-type text-[10px]">
                          {g}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {game.dealCount > 0 ? (
                    <>
                      <span className="text-sm font-bold text-gray-900">
                        From {formatPrice(game.bestPrice!)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {game.dealCount}{" "}
                        {game.dealCount === 1 ? "deal" : "deals"}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">No deals yet</span>
                  )}
                </div>

                {game.metacritic && (
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-600">
                    {game.metacritic}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && search.length >= 2 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">
            No games found for &ldquo;{search}&rdquo;
          </p>
        </div>
      )}
    </>
  );
}
