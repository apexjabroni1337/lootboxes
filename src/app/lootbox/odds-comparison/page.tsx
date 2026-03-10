"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  BarChart3,
  ChevronLeft,
  X,
  Loader2,
  ArrowRight,
  Scale,
  AlertCircle,
  Trophy,
  Shield,
  DollarSign,
  Eye,
  Star,
  HelpCircle,
  Info,
  RefreshCw,
  Search,
} from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";

interface GameOption {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  lootboxes_score: number;
  loot_system_type: string;
  cost_per_pull: number | null;
  has_pity_system: boolean;
  score_transparency: number;
  score_value: number;
}

interface DropRate {
  item_name: string;
  rarity: string;
  drop_rate_pct: number;
  source: string;
}

interface GameData {
  game: GameOption;
  rates: DropRate[];
  error?: boolean;
}

function GameIcon({ game, className = "w-full h-full" }: { game: GameOption; className?: string }) {
  if (game.cover_image) {
    return <img src={game.cover_image} alt={game.title} className={`${className} object-cover`} loading="lazy" />;
  }
  return <GameAvatar gameName={game.title} size="sm" aspectRatio="square" />;
}

const SYSTEM_COLORS: Record<string, string> = {
  gacha: "bg-purple-500",
  loot_box: "bg-red-500",
  card_pack: "bg-blue-500",
  battle_pass: "bg-amber-500",
  cosmetic_shop: "bg-emerald-500",
};

const SYSTEM_LABELS: Record<string, string> = {
  gacha: "Gacha",
  loot_box: "Loot Box",
  card_pack: "Card Pack",
  battle_pass: "Battle Pass",
  cosmetic_shop: "Cosmetic Shop",
};

const COMPARE_COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

function scoreColor(score: number): string {
  if (score >= 7) return "text-emerald-600";
  if (score >= 5) return "text-amber-600";
  return "text-red-600";
}

function scoreBg(score: number): string {
  if (score >= 7) return "bg-emerald-50";
  if (score >= 5) return "bg-amber-50";
  return "bg-red-50";
}

function findBest(games: GameData[], getValue: (g: GameOption) => number, higher = true): string | null {
  if (games.length < 2) return null;
  let bestId = games[0].game.id;
  let bestVal = getValue(games[0].game);
  for (const gd of games.slice(1)) {
    const val = getValue(gd.game);
    if (higher ? val > bestVal : val < bestVal) {
      bestVal = val;
      bestId = gd.game.id;
    }
  }
  return bestId;
}

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  official: { label: "Official", color: "text-emerald-600 bg-emerald-50" },
  community_verified: { label: "Community", color: "text-blue-600 bg-blue-50" },
  user_reported: { label: "Reported", color: "text-gray-500 bg-gray-100" },
};

export default function OddsComparisonPage() {
  const [allGames, setAllGames] = useState<GameOption[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [gameData, setGameData] = useState<Map<string, GameData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingRates, setLoadingRates] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch game list
  useEffect(() => {
    fetch("/api/lootbox/games")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!Array.isArray(data.games)) throw new Error("Invalid response");
        setAllGames(data.games);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load games");
        setLoading(false);
      });
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch drop rates for a game
  const fetchRates = useCallback(
    async (gameId: string) => {
      if (gameData.has(gameId)) return;
      setLoadingRates((prev) => new Set(prev).add(gameId));

      try {
        const res = await fetch(`/api/lootbox/rates?gameId=${gameId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const game = allGames.find((g) => g.id === gameId);
        if (game) {
          setGameData((prev) => {
            const next = new Map(prev);
            next.set(gameId, { game, rates: Array.isArray(data.rates) ? data.rates : [] });
            return next;
          });
        }
      } catch {
        const game = allGames.find((g) => g.id === gameId);
        if (game) {
          setGameData((prev) => {
            const next = new Map(prev);
            next.set(gameId, { game, rates: [], error: true });
            return next;
          });
        }
      } finally {
        setLoadingRates((prev) => {
          const next = new Set(prev);
          next.delete(gameId);
          return next;
        });
      }
    },
    [allGames, gameData]
  );

  const retryRates = (gameId: string) => {
    setGameData((prev) => {
      const next = new Map(prev);
      next.delete(gameId);
      return next;
    });
    fetchRates(gameId);
  };

  const addGame = (gameId: string) => {
    if (selectedIds.length >= 4 || selectedIds.includes(gameId)) return;
    setSelectedIds((prev) => [...prev, gameId]);
    fetchRates(gameId);
  };

  const removeGame = (gameId: string) => {
    setSelectedIds((prev) => prev.filter((id) => id !== gameId));
  };

  const selectedData = selectedIds
    .map((id) => gameData.get(id))
    .filter((d): d is GameData => d !== undefined);

  // Find max drop rate for bar scaling
  const maxRate = Math.max(
    ...selectedData.flatMap((d) => d.rates.map((r) => r.drop_rate_pct)),
    1
  );

  // Winner IDs for highlighting
  const bestOverall = findBest(selectedData, (g) => g.lootboxes_score);
  const bestTransparency = findBest(selectedData, (g) => g.score_transparency);
  const bestValue = findBest(selectedData, (g) => g.score_value);
  const bestCost = findBest(selectedData, (g) => g.cost_per_pull ?? Infinity, false);

  function cellHighlight(gameId: string, bestId: string | null) {
    return gameId === bestId ? "bg-emerald-50 font-bold" : "";
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        <div className="container-main relative z-10">
          <Link
            href="/lootbox"
            className="inline-flex items-center gap-1 text-sm text-purple-300 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Loot Boxes
          </Link>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20 backdrop-blur-sm border border-purple-400/20">
              <BarChart3 className="h-7 w-7 text-purple-300" />
            </div>
            <div className="inline-flex rounded-full bg-purple-500/20 backdrop-blur-sm px-4 py-1.5 text-sm font-bold text-white border border-purple-400/25">
              <Scale className="h-4 w-4 mr-1.5" /> Comparison Tool
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Odds Comparison
          </h1>
          <p className="mt-2 text-lg text-purple-300 font-semibold">
            Compare loot box odds side-by-side across games
          </p>
          <p className="mt-4 max-w-2xl text-gray-300 leading-relaxed">
            Select up to 4 games from our database to compare their drop rates, costs per pull,
            pity systems, transparency scores, and value ratings in one unified view. The best
            performer in each category is highlighted in green so you can instantly spot which game
            treats your wallet and time with the most respect.
          </p>
        </div>
      </section>

      {/* Game selector */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 sticky top-16 z-30">
        <div className="container-main py-4">
          <div className="flex flex-wrap items-center gap-2">
            {selectedIds.map((id, idx) => {
              const game = allGames.find((g) => g.id === id);
              if (!game) return null;
              return (
                <div
                  key={id}
                  className="flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-1.5 py-1 text-sm"
                  style={{ borderLeftColor: COMPARE_COLORS[idx], borderLeftWidth: 3 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden">
                    <GameIcon game={game} />
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-100 truncate max-w-[140px]">
                    {game.title}
                  </span>
                  <button
                    onClick={() => removeGame(id)}
                    className="text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}

            {selectedIds.length < 4 && (
              <div ref={searchRef} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchDropdown(true);
                    }}
                    onFocus={() => setShowSearchDropdown(true)}
                    placeholder={
                      loading
                        ? "Loading games..."
                        : error
                          ? "Failed to load games"
                          : `Search or browse games (${4 - selectedIds.length} remaining)`
                    }
                    className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 pl-9 pr-3 py-2 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 focus:outline-none w-64"
                    disabled={loading}
                  />
                </div>
                {showSearchDropdown && !loading && !error && (
                  <div className="absolute top-full left-0 mt-1 w-72 max-h-60 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl z-50">
                    {allGames
                      .filter(
                        (g) =>
                          !selectedIds.includes(g.id) &&
                          g.title.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .slice(0, 20)
                      .map((g) => (
                        <button
                          key={g.id}
                          onClick={() => {
                            addGame(g.id);
                            setSearchQuery("");
                            setShowSearchDropdown(false);
                          }}
                          className="flex items-center gap-2.5 w-full px-3 py-2.5 text-left text-sm hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0"
                        >
                          <div className="flex-shrink-0 w-6 h-6 rounded overflow-hidden">
                            <GameIcon game={g} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-gray-800 dark:text-gray-200 truncate block">{g.title}</span>
                            <span className="text-[10px] text-gray-400">
                              {SYSTEM_LABELS[g.loot_system_type] || g.loot_system_type} • Score: {g.lootboxes_score}
                            </span>
                          </div>
                        </button>
                      ))}
                    {allGames.filter(
                      (g) =>
                        !selectedIds.includes(g.id) &&
                        g.title.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length === 0 && (
                      <div className="px-4 py-3 text-sm text-gray-400 text-center">
                        No games found
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedIds.length > 0 && (
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
              <Trophy className="h-3 w-3 text-emerald-500" />
              Green highlights = best in category
            </p>
          )}
        </div>
      </section>

      {/* Error state */}
      {error && !loading && (
        <section className="py-8">
          <div className="container-main">
            <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 p-8 text-center">
              <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-red-800 mb-2">Failed to Load Games</h2>
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                <RefreshCw className="h-4 w-4" /> Retry
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Loading state */}
      {loading && (
        <section className="py-16">
          <div className="container-main text-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Loading game database...</p>
          </div>
        </section>
      )}

      {/* Comparison content */}
      {!loading && !error && (
        <section className="py-8">
          <div className="container-main">
            {selectedData.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-16 text-center">
                <Scale className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Select games to compare
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Choose up to 4 games from the dropdown above to see their drop rates,
                  costs, and pity systems compared side-by-side.
                </p>

                {/* Suggested comparisons */}
                {allGames.length >= 4 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
                      Quick Comparisons
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => {
                          const gachaGames = allGames.filter((g) => g.loot_system_type === "gacha").slice(0, 4);
                          gachaGames.forEach((g) => addGame(g.id));
                        }}
                        className="rounded-full border border-purple-200 dark:border-purple-700/30 bg-purple-50 dark:bg-purple-950/30 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                      >
                        Top Gacha Games
                      </button>
                      <button
                        onClick={() => {
                          const lootGames = allGames.filter((g) => g.loot_system_type === "loot_box").slice(0, 4);
                          lootGames.forEach((g) => addGame(g.id));
                        }}
                        className="rounded-full border border-red-200 bg-red-50 dark:bg-red-950/30 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
                      >
                        Top Loot Box Games
                      </button>
                      <button
                        onClick={() => {
                          const shopGames = allGames.filter((g) => g.loot_system_type === "cosmetic_shop").slice(0, 4);
                          shopGames.forEach((g) => addGame(g.id));
                        }}
                        className="rounded-full border border-emerald-200 dark:border-emerald-700/30 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                      >
                        Top Cosmetic Shops
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Overview comparison table */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-x-auto mb-8 shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 sticky left-0 bg-gray-50 dark:bg-gray-900 z-10">
                          Metric
                        </th>
                        {selectedData.map(({ game }, idx) => (
                          <th
                            key={game.id}
                            className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide min-w-[140px]"
                            style={{ color: COMPARE_COLORS[idx] }}
                          >
                            <div className="flex flex-col items-center gap-1.5">
                              <div className="w-8 h-8 rounded-lg overflow-hidden mx-auto">
                                <GameIcon game={game} />
                              </div>
                              {game.title}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200 sticky left-0 bg-white dark:bg-gray-950 z-10">
                          <span className="flex items-center gap-1.5"><Info className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" /> System Type</span>
                        </td>
                        {selectedData.map(({ game }) => (
                          <td key={game.id} className="px-4 py-3 text-center">
                            <span
                              className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold text-white ${
                                SYSTEM_COLORS[game.loot_system_type] || "bg-gray-500"
                              }`}
                            >
                              {SYSTEM_LABELS[game.loot_system_type] || game.loot_system_type}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200 sticky left-0 bg-white dark:bg-gray-950 z-10">
                          <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-400" /> Overall Score</span>
                        </td>
                        {selectedData.map(({ game }) => (
                          <td key={game.id} className={`px-4 py-3 text-center ${cellHighlight(game.id, bestOverall)}`}>
                            <span className={`text-lg font-black ${scoreColor(game.lootboxes_score)}`}>
                              {game.lootboxes_score.toFixed(1)}
                            </span>
                            <span className="text-gray-400 dark:text-gray-500 text-xs">/10</span>
                            {game.id === bestOverall && <Trophy className="h-3 w-3 text-emerald-500 inline ml-1" />}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200 sticky left-0 bg-white dark:bg-gray-950 z-10">
                          <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-green-500" /> Cost Per Pull</span>
                        </td>
                        {selectedData.map(({ game }) => (
                          <td key={game.id} className={`px-4 py-3 text-center font-semibold text-gray-900 dark:text-white ${cellHighlight(game.id, bestCost)}`}>
                            {game.cost_per_pull != null
                              ? `$${game.cost_per_pull.toFixed(2)}`
                              : <span className="text-gray-400 dark:text-gray-500">N/A</span>}
                            {game.id === bestCost && game.cost_per_pull != null && <Trophy className="h-3 w-3 text-emerald-500 inline ml-1" />}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200 sticky left-0 bg-white dark:bg-gray-950 z-10">
                          <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-blue-500" /> Pity System</span>
                        </td>
                        {selectedData.map(({ game }) => (
                          <td key={game.id} className="px-4 py-3 text-center">
                            {game.has_pity_system ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                                <Shield className="h-3 w-3" /> Yes
                              </span>
                            ) : (
                              <span className="text-red-500 font-semibold">No</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200 sticky left-0 bg-white dark:bg-gray-950 z-10">
                          <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5 text-indigo-500" /> Transparency</span>
                        </td>
                        {selectedData.map(({ game }) => (
                          <td key={game.id} className={`px-4 py-3 text-center ${cellHighlight(game.id, bestTransparency)}`}>
                            <span className={`font-bold ${scoreColor(game.score_transparency)}`}>
                              {game.score_transparency}/10
                            </span>
                            {game.id === bestTransparency && <Trophy className="h-3 w-3 text-emerald-500 inline ml-1" />}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200 sticky left-0 bg-white dark:bg-gray-950 z-10">
                          <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-emerald-500" /> Value Score</span>
                        </td>
                        {selectedData.map(({ game }) => (
                          <td key={game.id} className={`px-4 py-3 text-center ${cellHighlight(game.id, bestValue)}`}>
                            <span className={`font-bold ${scoreColor(game.score_value)}`}>
                              {game.score_value}/10
                            </span>
                            {game.id === bestValue && <Trophy className="h-3 w-3 text-emerald-500 inline ml-1" />}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Winner summary */}
                {selectedData.length >= 2 && bestOverall && (
                  <div className="rounded-2xl border border-emerald-200 dark:border-emerald-700/30 bg-gradient-to-r from-emerald-50 dark:from-emerald-950/30 to-teal-50 dark:to-teal-950/20 p-6 mb-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 dark:from-emerald-950 to-teal-600">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-emerald-900">Best Overall</h3>
                    </div>
                    <p className="text-sm text-emerald-800">
                      <span className="font-bold">
                        {selectedData.find((d) => d.game.id === bestOverall)?.game.title}
                      </span>{" "}
                      has the highest overall Lootboxes.com score among your selected games at{" "}
                      <span className="font-bold">
                        {selectedData.find((d) => d.game.id === bestOverall)?.game.lootboxes_score.toFixed(1)}/10
                      </span>
                      . This reflects its combined transparency, fairness, value, and player-friendliness.
                    </p>
                  </div>
                )}

                {/* Drop rate bars per game */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Drop Rate Breakdown</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Item-level drop rate data for each game. Bars are scaled relative to the highest rate across
                  all selected games for easy visual comparison. Source quality is shown next to each rate.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedData.map(({ game, rates, error: rateError }, idx) => (
                    <div
                      key={game.id}
                      className="rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-shadow"
                      style={{ borderTopWidth: 3, borderTopColor: COMPARE_COLORS[idx] }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden" style={{ boxShadow: `0 0 0 2px ${COMPARE_COLORS[idx]}` }}>
                          <GameIcon game={game} />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{game.title}</h3>
                      </div>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-4">
                        {SYSTEM_LABELS[game.loot_system_type] || game.loot_system_type} •{" "}
                        {game.cost_per_pull != null ? `$${game.cost_per_pull.toFixed(2)}/pull` : "Price N/A"}
                      </p>

                      {loadingRates.has(game.id) ? (
                        <div className="flex items-center gap-2 py-8 justify-center text-gray-400 dark:text-gray-500">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Loading drop rates...
                        </div>
                      ) : rateError ? (
                        <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 p-4 text-center">
                          <AlertCircle className="h-5 w-5 text-red-400 mx-auto mb-2" />
                          <p className="text-sm text-red-600 mb-2">Failed to load drop rates</p>
                          <button
                            onClick={() => retryRates(game.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline"
                          >
                            <RefreshCw className="h-3 w-3" /> Retry
                          </button>
                        </div>
                      ) : rates.length === 0 ? (
                        <div className="rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 text-center">
                          <HelpCircle className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No drop rate data yet</p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                            We haven&apos;t cataloged drop rates for this game.
                            Check back soon or view the{" "}
                            <Link href={`/lootbox/${game.slug}`} className="text-brand-600 hover:underline">
                              full analysis
                            </Link>{" "}
                            for other details.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {rates.slice(0, 10).map((rate, i) => {
                            const src = SOURCE_LABELS[rate.source] || SOURCE_LABELS.user_reported;
                            return (
                              <div key={i}>
                                <div className="flex items-center justify-between mb-0.5">
                                  <p className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate max-w-[150px]">
                                    {rate.rarity}
                                    {rate.item_name !== rate.rarity && (
                                      <span className="text-gray-400 dark:text-gray-500 font-normal"> — {rate.item_name}</span>
                                    )}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[9px] font-bold rounded px-1 py-0.5 ${src.color}`}>
                                      {src.label}
                                    </span>
                                    <span className="text-xs font-mono text-gray-600 dark:text-gray-300 w-16 text-right">
                                      {rate.drop_rate_pct < 1
                                        ? `${rate.drop_rate_pct.toFixed(2)}%`
                                        : `${rate.drop_rate_pct.toFixed(1)}%`}
                                    </span>
                                  </div>
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${Math.max((rate.drop_rate_pct / maxRate) * 100, 2)}%`,
                                      backgroundColor: COMPARE_COLORS[idx],
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                          {rates.length > 10 && (
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 pt-1">
                              + {rates.length - 10} more items.{" "}
                              <Link href={`/lootbox/${game.slug}`} className="text-brand-600 hover:underline">
                                View all
                              </Link>
                            </p>
                          )}
                        </div>
                      )}

                      <Link
                        href={`/lootbox/${game.slug}`}
                        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
                      >
                        Full analysis <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="border-t border-gray-100 dark:border-gray-800 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-950 py-12">
        <div className="container-main">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">How the Comparison Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { num: "1", title: "Pick Games", desc: "Select up to 4 games from our database of analyzed titles. Use quick-compare buttons to load preset groups.", gradient: "from-purple-500 to-indigo-600" },
              { num: "2", title: "Compare Metrics", desc: "See score breakdowns, cost per pull, pity systems, and transparency ratings side-by-side. Green highlights mark category winners.", gradient: "from-blue-500 to-purple-600" },
              { num: "3", title: "Check Drop Rates", desc: "Dive into item-level drop rate data with visual bars scaled across all games. Source quality is labeled for each rate.", gradient: "from-indigo-500 to-purple-600" },
            ].map((step) => (
              <div key={step.num} className="text-center group">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} text-white mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-lg font-black">{step.num}</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{step.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO content */}
      <section className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 py-10">
        <div className="container-main max-w-3xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Why Compare Loot Box Odds?
          </h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
            <p>
              Not all loot box systems are created equal. A gacha game with a guaranteed pity system
              at 90 pulls and published drop rates is fundamentally different from a loot box game
              that hides its odds and offers no safety net. By comparing games side-by-side, you can
              make informed decisions about where your time and money go.
            </p>
            <p>
              Our comparison tool pulls data from each game&apos;s full analysis — including official
              publisher-disclosed drop rates, community-verified data, and our own scoring across
              8 dimensions of monetization fairness. The &ldquo;best in category&rdquo; highlights help you
              quickly spot which game wins on each metric, though keep in mind that different
              system types (gacha vs. cosmetic shop vs. card pack) serve fundamentally different models.
            </p>
            <p>
              For a deeper dive into any individual game, click &ldquo;Full analysis&rdquo; to see
              complete cost breakdowns, pity system explanations, historical controversy, and
              community spending tips.
            </p>
          </div>
        </div>
      </section>

      {/* Explore CTA */}
      <section className="border-t border-gray-100 dark:border-gray-800 bg-gradient-to-r from-purple-50 dark:from-purple-950/30 to-indigo-50 py-10">
        <div className="container-main text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Want a quick value verdict instead?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-6 max-w-md mx-auto">
            Our value calculator gives you an instant &ldquo;Worth It / Caution / Avoid&rdquo; verdict
            for any game based on its scores.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/lootbox/value-calculator"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-semibold text-white hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
            >
              Value Calculator <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/lootbox"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-6 py-3 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
            >
              Browse All Games <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
