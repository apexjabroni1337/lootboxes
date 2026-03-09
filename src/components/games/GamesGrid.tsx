"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
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
  Loader2,
} from "lucide-react";
import SteamGameRow, { CompactGameCard } from "@/components/games/SteamGameRow";
import { normalizeGame } from "@/lib/game-normalizer";

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

/* ── Genre matching ── */
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

/* ── Types ── */
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
  totalCount: number;
  initialGenre?: string | null;
}

const PAGE_SIZE = 48;

export default function GamesGrid({ games: initialGames, totalCount, initialGenre = null }: GamesGridProps) {
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState<string | null>(initialGenre);
  const [sortBy, setSortBy] = useState<SortId>("trending");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [apiGames, setApiGames] = useState<GameWithDeals[]>([]);
  const [apiTotalCount, setApiTotalCount] = useState(0);
  const [apiHasMore, setApiHasMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [useApiMode, setUseApiMode] = useState(false);
  const [apiOffset, setApiOffset] = useState(0);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const isSearchMode = search.length >= 2;

  const fetchGames = useCallback(async (params: {
    q?: string;
    offset?: number;
    sort?: string;
    genre?: string;
    append?: boolean;
  }) => {
    const { q, offset = 0, sort = sortBy, genre = activeGenre || "", append = false } = params;

    if (!append) setIsSearching(true);
    else setIsLoadingMore(true);

    try {
      const url = new URL("/api/games/browse", window.location.origin);
      if (q && q.length >= 2) url.searchParams.set("q", q);
      url.searchParams.set("offset", String(offset));
      url.searchParams.set("limit", String(PAGE_SIZE));
      url.searchParams.set("sort", sort);
      if (genre) url.searchParams.set("genre", genre);

      const res = await fetch(url.toString());
      const data = await res.json();

      if (append) {
        setApiGames((prev) => [...prev, ...(data.games || [])]);
      } else {
        setApiGames(data.games || []);
      }
      setApiTotalCount(data.totalCount || 0);
      setApiHasMore(data.hasMore || false);
      setApiOffset(offset + PAGE_SIZE);
      setUseApiMode(true);
    } catch (err) {
      console.error("Failed to fetch games:", err);
    } finally {
      setIsSearching(false);
      setIsLoadingMore(false);
    }
  }, [sortBy, activeGenre]);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (search.length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        fetchGames({ q: search, offset: 0, sort: sortBy, genre: activeGenre || "" });
      }, 300);
    } else if (search.length === 0 && useApiMode) {
      if (activeGenre || sortBy !== "trending") {
        fetchGames({ offset: 0, sort: sortBy, genre: activeGenre || "" });
      } else {
        setUseApiMode(false);
      }
    }

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (useApiMode || activeGenre || sortBy !== "trending") {
      fetchGames({ q: search.length >= 2 ? search : undefined, offset: 0, sort: sortBy, genre: activeGenre || "" });
    }
  }, [sortBy, activeGenre]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && !isSearching) {
          if (useApiMode && apiHasMore) {
            fetchGames({
              q: search.length >= 2 ? search : undefined,
              offset: apiOffset,
              sort: sortBy,
              genre: activeGenre || "",
              append: true,
            });
          }
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [useApiMode, apiHasMore, apiOffset, isLoadingMore, isSearching, search, sortBy, activeGenre, fetchGames]);

  const displayGames = useMemo(() => {
    if (useApiMode) return apiGames;

    let result = initialGames;

    if (activeGenre) {
      result = result.filter((g) => gameMatchesGenre(g.genres, activeGenre));
    }

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
  }, [useApiMode, apiGames, initialGames, activeGenre, sortBy]);

  const displayCount = useApiMode ? apiTotalCount : (activeGenre ? displayGames.length : totalCount);
  const showingCount = displayGames.length;

  return (
    <>
      {/* Search + Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search all ${totalCount.toLocaleString()} games...`}
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-9 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

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
                    onClick={() => { setSortBy(opt.id); setShowSortMenu(false); }}
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
          <button onClick={() => setActiveGenre(null)} className="text-xs text-gray-400 hover:text-gray-600 underline ml-1">
            Clear
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {isSearching ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Searching...
            </span>
          ) : (
            <>
              Showing <span className="font-medium text-gray-900">{showingCount.toLocaleString()}</span>
              {displayCount > showingCount && (
                <> of <span className="font-medium text-gray-900">{displayCount.toLocaleString()}</span></>
              )}
              {" "}games
              {search.length >= 2 && (
                <span className="text-gray-400"> matching &ldquo;{search}&rdquo;</span>
              )}
              {activeGenre && (
                <span className="text-gray-400">
                  {" "}in <span className="font-medium text-brand-600">{GENRE_OPTIONS.find(g => g.id === activeGenre)?.label}</span>
                </span>
              )}
            </>
          )}
        </p>
      </div>

      {/* Loading state */}
      {isSearching && (
        <div className="mt-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      )}

      {/* Games list */}
      {!isSearching && (
        <>
          {/* Desktop: Steam-style rows */}
          <div className="mt-6 hidden md:flex md:flex-col gap-1.5">
            {displayGames.map((game) => (
              <SteamGameRow key={game.id} game={normalizeGame(game)} />
            ))}
          </div>

          {/* Mobile: compact card grid */}
          <div className="mt-6 grid gap-4 grid-cols-2 md:hidden">
            {displayGames.map((game) => (
              <CompactGameCard key={game.id} game={normalizeGame(game)} />
            ))}
          </div>

          {/* Empty state */}
          {displayGames.length === 0 && !isSearching && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-500">
                No games found{search.length >= 2 ? <> for &ldquo;{search}&rdquo;</> : ""}{activeGenre ? ". Try removing the genre filter." : ""}
              </p>
            </div>
          )}

          {/* Infinite scroll sentinel */}
          {useApiMode && apiHasMore && (
            <div ref={sentinelRef} className="mt-8 flex justify-center py-4">
              {isLoadingMore && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading more games...
                </div>
              )}
            </div>
          )}

          {/* Initial mode: "Browse more" button */}
          {!useApiMode && !isSearchMode && !activeGenre && displayGames.length < totalCount && (
            <div className="mt-8 text-center">
              <button
                onClick={() => fetchGames({ offset: 0, sort: sortBy })}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all"
              >
                Browse All {totalCount.toLocaleString()} Games
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
