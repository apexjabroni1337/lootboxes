"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BarChart3,
  ChevronLeft,
  Plus,
  X,
  Loader2,
  ArrowRight,
  Scale,
} from "lucide-react";

interface GameOption {
  id: string;
  title: string;
  slug: string;
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

export default function OddsComparisonPage() {
  const [allGames, setAllGames] = useState<GameOption[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [gameData, setGameData] = useState<Map<string, GameData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [loadingRates, setLoadingRates] = useState<Set<string>>(new Set());

  // Fetch game list
  useEffect(() => {
    fetch("/api/lootbox/games")
      .then((r) => r.json())
      .then((data) => {
        setAllGames(data.games || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fetch drop rates for a game
  const fetchRates = useCallback(
    async (gameId: string) => {
      if (gameData.has(gameId)) return;
      setLoadingRates((prev) => new Set(prev).add(gameId));

      try {
        const res = await fetch(`/api/lootbox/rates?gameId=${gameId}`);
        const data = await res.json();
        const game = allGames.find((g) => g.id === gameId);
        if (game) {
          setGameData((prev) => {
            const next = new Map(prev);
            next.set(gameId, { game, rates: data.rates || [] });
            return next;
          });
        }
      } catch {
        console.error("Failed to fetch rates for", gameId);
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 py-16">
        <div className="container-main">
          <Link
            href="/lootbox"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-200 mb-4"
          >
            <ChevronLeft className="h-4 w-4" /> Loot Boxes
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 backdrop-blur-sm">
              <BarChart3 className="h-6 w-6 text-purple-400" />
            </div>
            <div className="inline-flex rounded-full bg-purple-500/20 backdrop-blur-sm px-4 py-1 text-sm font-semibold text-purple-300">
              Comparison Tool
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Odds Comparison
          </h1>
          <p className="mt-2 text-lg text-purple-300 font-semibold">
            Compare loot box odds side-by-side
          </p>
          <p className="mt-4 max-w-2xl text-gray-300 leading-relaxed">
            Pick up to 4 games and compare their drop rates, costs, and pity systems.
            See which game gives you the best odds for your money.
          </p>
        </div>
      </section>

      {/* Game selector */}
      <section className="border-b border-gray-100 bg-gray-50 sticky top-16 z-30">
        <div className="container-main py-4">
          <div className="flex flex-wrap items-center gap-2">
            {selectedIds.map((id, idx) => {
              const game = allGames.find((g) => g.id === id);
              if (!game) return null;
              return (
                <div
                  key={id}
                  className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm"
                  style={{ borderLeftColor: COMPARE_COLORS[idx], borderLeftWidth: 3 }}
                >
                  <span className="font-medium text-gray-800 truncate max-w-[140px]">
                    {game.title}
                  </span>
                  <button
                    onClick={() => removeGame(id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}

            {selectedIds.length < 4 && (
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) addGame(e.target.value);
                }}
                className="rounded-lg border border-dashed border-gray-300 bg-white px-3 py-2 text-sm text-gray-500 focus:border-purple-300 focus:outline-none"
                disabled={loading}
              >
                <option value="">
                  {loading ? "Loading games..." : `+ Add game (${4 - selectedIds.length} remaining)`}
                </option>
                {allGames
                  .filter((g) => !selectedIds.includes(g.id))
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
              </select>
            )}
          </div>
        </div>
      </section>

      {/* Comparison content */}
      <section className="py-8">
        <div className="container-main">
          {selectedData.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
              <Scale className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Select games to compare
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Choose up to 4 games from the dropdown above to see their drop rates,
                costs, and pity systems compared side-by-side.
              </p>
            </div>
          ) : (
            <>
              {/* Overview comparison table */}
              <div className="rounded-xl border border-gray-200 overflow-hidden mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Metric
                      </th>
                      {selectedData.map(({ game }, idx) => (
                        <th
                          key={game.id}
                          className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide"
                          style={{ color: COMPARE_COLORS[idx] }}
                        >
                          {game.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-700">System Type</td>
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
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-700">Overall Score</td>
                      {selectedData.map(({ game }) => (
                        <td key={game.id} className="px-4 py-3 text-center">
                          <span className={`text-lg font-black ${scoreColor(game.lootboxes_score)}`}>
                            {game.lootboxes_score.toFixed(1)}
                          </span>
                          <span className="text-gray-400 text-xs">/10</span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-700">Cost Per Pull</td>
                      {selectedData.map(({ game }) => (
                        <td key={game.id} className="px-4 py-3 text-center font-semibold text-gray-900">
                          {game.cost_per_pull
                            ? `$${game.cost_per_pull.toFixed(2)}`
                            : "—"}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-700">Pity System</td>
                      {selectedData.map(({ game }) => (
                        <td key={game.id} className="px-4 py-3 text-center">
                          {game.has_pity_system ? (
                            <span className="text-emerald-600 font-semibold">Yes</span>
                          ) : (
                            <span className="text-red-500 font-semibold">No</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-700">Transparency</td>
                      {selectedData.map(({ game }) => (
                        <td key={game.id} className="px-4 py-3 text-center">
                          <span className={`font-bold ${scoreColor(game.score_transparency)}`}>
                            {game.score_transparency}/10
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">Value Score</td>
                      {selectedData.map(({ game }) => (
                        <td key={game.id} className="px-4 py-3 text-center">
                          <span className={`font-bold ${scoreColor(game.score_value)}`}>
                            {game.score_value}/10
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Drop rate bars per game */}
              <h2 className="text-xl font-bold text-gray-900 mb-4">Drop Rate Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedData.map(({ game, rates }, idx) => (
                  <div
                    key={game.id}
                    className="rounded-xl border border-gray-200 p-5"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COMPARE_COLORS[idx] }}
                      />
                      <h3 className="font-bold text-gray-900">{game.title}</h3>
                    </div>

                    {loadingRates.has(game.id) ? (
                      <div className="flex items-center gap-2 py-8 justify-center text-gray-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading rates...
                      </div>
                    ) : rates.length === 0 ? (
                      <p className="text-sm text-gray-400 py-4 text-center">
                        No drop rate data available for this game.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {rates.slice(0, 10).map((rate, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-28 flex-shrink-0">
                              <p className="text-xs font-medium text-gray-700 truncate">
                                {rate.rarity}
                              </p>
                            </div>
                            <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.max((rate.drop_rate_pct / maxRate) * 100, 2)}%`,
                                  backgroundColor: COMPARE_COLORS[idx],
                                }}
                              />
                            </div>
                            <span className="text-xs font-mono text-gray-600 w-16 text-right">
                              {rate.drop_rate_pct < 1
                                ? `${rate.drop_rate_pct.toFixed(2)}%`
                                : `${rate.drop_rate_pct.toFixed(1)}%`}
                            </span>
                          </div>
                        ))}
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

      {/* Explore CTA */}
      <section className="border-t border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50 py-10">
        <div className="container-main text-center">
          <h2 className="text-xl font-bold text-gray-900">
            Want to explore individual games in depth?
          </h2>
          <p className="text-sm text-gray-600 mt-2 mb-6 max-w-md mx-auto">
            Check our full database for detailed monetization analysis, cost calculators,
            and community insights.
          </p>
          <Link
            href="/lootbox"
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 transition-colors"
          >
            Browse All Games <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
