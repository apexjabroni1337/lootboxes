"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import GameAvatar from "@/components/ui/GameAvatar";
import StoreIcon from "@/components/ui/StoreIcon";
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
  ArrowUpDown,
  ChevronDown,
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

/* ── Sort options ── */
const SORT_OPTIONS = [
  { id: "trending", label: "Trending" },
  { id: "deals", label: "Most Deals" },
  { id: "price_asc", label: "Price: Low → High" },
  { id: "metacritic", label: "Metacritic Score" },
  { id: "alpha", label: "A → Z" },
] as const;

type SortId = (typeof SORT_OPTIONS)[number]["id"];

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
  screenshot_image?: string | null;
  genres: string[] | null;
  platforms: string[] | null;
  metacritic: number | null;
  release_date?: string | null;
  hot_score?: number | null;
  bestPrice: number | null;
  bestStore?: string | null;
  dealCount: number;
}

interface GamesGridProps {
  games: GameWithDeals[];
  initialGenre?: string | null;
}

export default function GamesGrid({ games, initialGenre = null }: GamesGridProps) {
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState<string | null>(initialGenre);
  const [sortBy, setSortBy] = useState<SortId>("trending");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [visibleCount, setVisibleCount] = useState(40);

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

    // Sort
    const sorted = [...result].sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          if (a.bestPrice === null && b.bestPrice === null) return 0;
          if (a.bestPrice === null) return 1;
          if (b.bestPrice === null) return -1;
          return a.bestPrice - b.bestPrice;
        case "deals":
          return b.dealCount - a.dealCount;
        case "metacritic":
          return (b.metacritic || 0) - (a.metacritic || 0);
        case "alpha":
          return a.title.localeCompare(b.title);
        case "trending":
        default:
          return (b.hot_score || 0) - (a.hot_score || 0) || b.dealCount - a.dealCount;
      }
    });

    return sorted;
  }, [games, search, activeGenre, sortBy]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <>
      {/* Search + Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setVisibleCount(40); }}
            placeholder="Search games..."
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-9 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
            {SORT_OPTIONS.find((s) => s.id === sortBy)?.label}
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>
          {showSortMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setSortBy(opt.id); setShowSortMenu(false); setVisibleCount(40); }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      sortBy === opt.id
                        ? "bg-brand-50 text-brand-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
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
              onClick={() => { setActiveGenre(isActive ? null : genre.id); setVisibleCount(40); }}
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

      {/* Results count */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">{Math.min(visibleCount, filtered.length)}</span> of{" "}
          <span className="font-medium text-gray-900">{filtered.length}</span> games
          {activeGenre && (
            <span className="text-gray-400">
              {" "}in <span className="font-medium text-brand-600">{GENRE_OPTIONS.find(g => g.id === activeGenre)?.label}</span>
            </span>
          )}
        </p>
      </div>

      {/* Games grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((game) => {
          const bgImage = game.screenshot_image || game.cover_image;
          return (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              {/* Landscape image */}
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                {bgImage ? (
                  <img
                    src={bgImage}
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

                {/* Metacritic */}
                {game.metacritic && (
                  <div className="absolute top-2 right-2">
                    <span className={`rounded-lg px-2 py-1 text-xs font-bold text-white shadow-md ${
                      game.metacritic >= 75 ? "bg-success-600" : game.metacritic >= 50 ? "bg-amber-500" : "bg-red-500"
                    }`}>
                      {game.metacritic}
                    </span>
                  </div>
                )}

                {/* Deal count badge */}
                {game.dealCount > 0 && (
                  <div className="absolute top-2 left-2">
                    <span className="rounded-lg bg-black/60 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                      {game.dealCount} {game.dealCount === 1 ? "deal" : "deals"}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 line-clamp-1 text-sm">
                  {game.title}
                </h3>
                {game.genres && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {(Array.isArray(game.genres) ? game.genres : [])
                      .slice(0, 3)
                      .map((g: string) => (
                        <span key={g} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                          {g}
                        </span>
                      ))}
                  </div>
                )}

                <div className="mt-2.5 flex items-center justify-between">
                  {game.dealCount > 0 ? (
                    <div className="flex items-center gap-1.5">
                      {game.bestStore && <StoreIcon store={game.bestStore} size="sm" />}
                      <span className="text-sm font-bold text-gray-900">
                        From {formatPrice(game.bestPrice!)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">No deals yet</span>
                  )}
                  <span className="text-xs font-medium text-brand-600">
                    Compare →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (search.length >= 2 || activeGenre) && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">
            No games found{search.length >= 2 ? <> for &ldquo;{search}&rdquo;</> : ""}{activeGenre ? ". Try removing the genre filter." : ""}
          </p>
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 40)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all"
          >
            Load More Games
            <span className="text-xs text-gray-400">({filtered.length - visibleCount} remaining)</span>
          </button>
        </div>
      )}
    </>
  );
}
