"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import GameAvatar from "@/components/ui/GameAvatar";
import {
  Search,
  X,
  Swords,
  Gamepad2,
  Crosshair,
  Globe,
  Car,
  Puzzle,
  Users,
  Trophy,
} from "lucide-react";

/* ── Genre options ── */
const GENRE_OPTIONS = [
  { id: "action", label: "Action", icon: Swords },
  { id: "rpg", label: "RPG", icon: Gamepad2 },
  { id: "fps", label: "FPS", icon: Crosshair },
  { id: "open-world", label: "Open World", icon: Globe },
  { id: "racing", label: "Racing", icon: Car },
  { id: "strategy", label: "Strategy", icon: Puzzle },
  { id: "multiplayer", label: "Multiplayer", icon: Users },
  { id: "sports", label: "Sports", icon: Trophy },
] as const;

function normalise(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function gameMatchesGenre(genres: string[] | null | undefined, genreId: string): boolean {
  if (!genres || genres.length === 0) return false;
  const target = normalise(genreId);
  return genres.some((g) => {
    const n = normalise(g);
    if (n === target) return true;
    if (target === "rpg" && (n.includes("role") || n.includes("rpg"))) return true;
    if (target === "fps" && (n.includes("shooter") || n.includes("fps"))) return true;
    if (target === "openworld" && (n.includes("openworld") || n.includes("adventure") || n.includes("sandbox"))) return true;
    if (target === "action" && n.includes("action")) return true;
    if (target === "racing" && n.includes("racing")) return true;
    if (target === "strategy" && n.includes("strategy")) return true;
    if (target === "multiplayer" && (n.includes("multiplayer") || n.includes("mmo"))) return true;
    if (target === "sports" && n.includes("sport")) return true;
    return false;
  });
}

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

interface GamesGridProps {
  games: GameWithDeals[];
  initialGenre?: string | null;
}

export default function GamesGrid({ games, initialGenre = null }: GamesGridProps) {
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState<string | null>(initialGenre);

  const filtered = useMemo(() => {
    let result = games;
    if (search.length >= 2) {
      result = result.filter((g) =>
        g.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (activeGenre) {
      result = result.filter((g) => gameMatchesGenre(g.genres, activeGenre));
    }
    return result;
  }, [games, search, activeGenre]);

  return (
    <>
      {/* Header with search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Game Deals — Browse All Games</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Compare prices across 13+ stores for {games.length} tracked games.
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

      {/* Genre filter pills */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mr-1">Genre:</span>
        {GENRE_OPTIONS.map((genre) => {
          const Icon = genre.icon;
          const isActive = activeGenre === genre.id;
          return (
            <button
              key={genre.id}
              onClick={() => setActiveGenre(isActive ? null : genre.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Icon className="h-3 w-3" />
              {genre.label}
              {isActive && <X className="h-3 w-3 ml-0.5" />}
            </button>
          );
        })}
        {activeGenre && (
          <button
            onClick={() => setActiveGenre(null)}
            className="text-xs text-gray-400 hover:text-gray-600 underline ml-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results count when filtering */}
      {(search.length >= 2 || activeGenre) && (
        <p className="mt-3 text-sm text-gray-500">
          {filtered.length} {filtered.length === 1 ? "game" : "games"}
          {search.length >= 2 && <> matching &ldquo;{search}&rdquo;</>}
          {activeGenre && (
            <span className="text-gray-400">
              {" "}in <span className="font-medium text-brand-600">{GENRE_OPTIONS.find(g => g.id === activeGenre)?.label}</span>
            </span>
          )}
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
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 dark:text-white">
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
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
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
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {game.metacritic}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (search.length >= 2 || activeGenre) && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
          <p className="text-gray-500">
            No games found{search.length >= 2 ? <> for &ldquo;{search}&rdquo;</> : ""}{activeGenre ? ". Try removing the genre filter." : ""}
          </p>
        </div>
      )}
    </>
  );
}
