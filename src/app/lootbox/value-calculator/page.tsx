"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Calculator,
  ChevronLeft,
  Loader2,
  DollarSign,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Eye,
  Star,
  Target,
  Brain,
  Gamepad2,
  Info,
  Wallet,
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

const SYSTEM_LABELS: Record<string, string> = {
  gacha: "Gacha",
  loot_box: "Loot Box",
  card_pack: "Card Pack",
  battle_pass: "Battle Pass",
  cosmetic_shop: "Cosmetic Shop",
};

const SYSTEM_TIPS: Record<string, string> = {
  gacha: "Gacha games typically require many pulls to get a specific character or item. Pity systems help guarantee results after a set number of pulls.",
  loot_box: "Loot box systems give randomized rewards per purchase. Some allow direct purchase of items, which is almost always better value than gambling on boxes.",
  card_pack: "Card pack games simulate physical card collecting. Pack odds are usually known but individual card targeting is difficult.",
  battle_pass: "Battle passes offer structured rewards for a fixed price. They generally offer the best value-per-dollar in gaming monetization.",
  cosmetic_shop: "Cosmetic shops sell items directly. While prices can be high, what you see is what you get — no randomization involved.",
};

function scoreColor(score: number): string {
  if (score >= 7) return "text-emerald-600";
  if (score >= 5) return "text-amber-600";
  return "text-red-600";
}

function scoreBarColor(score: number): string {
  if (score >= 7) return "bg-emerald-500";
  if (score >= 5) return "bg-amber-500";
  return "bg-red-500";
}

function getVerdict(overallScore: number): {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  icon: typeof CheckCircle;
  tips: string[];
} {
  if (overallScore >= 7)
    return {
      label: "Worth It",
      description:
        "This game offers fair monetization with good transparency and reasonable costs. You generally get value for your money.",
      color: "text-emerald-700",
      bgColor: "bg-emerald-50 border-emerald-200",
      icon: CheckCircle,
      tips: [
        "The monetization is player-friendly — spending here is generally rewarding",
        "Look for battle pass or subscription options for the best sustained value",
        "Check our spending guide for optimal purchase strategies",
      ],
    };
  if (overallScore >= 5)
    return {
      label: "Proceed With Caution",
      description:
        "Monetization is a mixed bag. Some aspects are fair, but watch out for specific pain points. Set a budget and stick to it.",
      color: "text-amber-700",
      bgColor: "bg-amber-50 border-amber-200",
      icon: AlertTriangle,
      tips: [
        "Set a strict monthly budget before you start spending",
        "Focus only on the best-value purchases (battle passes, subscriptions)",
        "Avoid chasing specific rare items — the odds are designed to make that expensive",
      ],
    };
  return {
    label: "Avoid Spending",
    description:
      "This game has predatory or opaque monetization. Drop rates are poor relative to cost, and the odds are heavily stacked against you.",
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
    icon: AlertTriangle,
    tips: [
      "Consider playing free-to-play only if the core gameplay is enjoyable",
      "If you must spend, limit yourself to the absolute minimum (e.g., a single battle pass)",
      "Be aware that the game is designed to encourage more spending over time",
    ],
  };
}

function estimatedPulls(hasPity: boolean): { pulls: number; note: string } {
  if (hasPity) {
    return { pulls: 75, note: "With pity system (worst case ~90, avg ~75)" };
  }
  return { pulls: 100, note: "No pity — pure RNG, could take 100+ pulls" };
}

export default function ValueCalculatorPage() {
  const [allGames, setAllGames] = useState<GameOption[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(20);

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

  const selected = allGames.find((g) => g.id === selectedId);

  const avgScore = useMemo(
    () =>
      allGames.length > 0
        ? allGames.reduce((sum, g) => sum + g.lootboxes_score, 0) / allGames.length
        : 0,
    [allGames]
  );

  const percentile = useMemo(() => {
    if (!selected || allGames.length === 0) return 0;
    const below = allGames.filter((g) => g.lootboxes_score < selected.lootboxes_score).length;
    return Math.round((below / allGames.length) * 100);
  }, [selected, allGames]);

  const pullEstimate = selected ? estimatedPulls(selected.has_pity_system) : null;
  const costForRare = selected?.cost_per_pull && pullEstimate
    ? selected.cost_per_pull * pullEstimate.pulls
    : null;
  const monthlyPulls = selected?.cost_per_pull && monthlyBudget > 0
    ? Math.floor(monthlyBudget / selected.cost_per_pull)
    : null;
  const monthsToRare = costForRare && monthlyBudget > 0
    ? Math.ceil(costForRare / monthlyBudget)
    : null;

  const scoreMetrics = selected
    ? [
        { label: "Overall Score", score: selected.lootboxes_score, desc: "Combined rating across all dimensions", icon: Star },
        { label: "Transparency", score: selected.score_transparency, desc: "How openly are drop rates disclosed?", icon: Eye },
        { label: "Value", score: selected.score_value, desc: "What you get relative to cost", icon: DollarSign },
      ]
    : [];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        <div className="container-main relative z-10">
          <Link href="/lootbox" className="inline-flex items-center gap-1 text-sm text-emerald-300 hover:text-white mb-6 transition-colors">
            <ChevronLeft className="h-4 w-4" /> Loot Boxes
          </Link>
          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/20">
              <Calculator className="h-7 w-7 text-emerald-300" />
            </div>
            <div className="inline-flex rounded-full bg-emerald-500/20 backdrop-blur-sm px-4 py-1.5 text-sm font-bold text-white border border-emerald-400/25">
              <DollarSign className="h-4 w-4 mr-1.5" /> Value Tool
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Is It Worth It?
          </h1>
          <p className="mt-2 text-lg text-emerald-300 font-semibold">Loot box value calculator</p>
          <p className="mt-4 max-w-2xl text-gray-300 leading-relaxed">
            Pick any game from our database and we&apos;ll break down the real cost of its monetization
            system — cost per pull, estimated spending for rare items, a budget simulator, and our
            overall verdict on whether it&apos;s worth your money.
          </p>
        </div>
      </section>

      {/* Game selector */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 sticky top-16 z-30">
        <div className="container-main py-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex-shrink-0">Select a game:</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="flex-1 max-w-md rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3 py-2.5 text-sm focus:border-emerald-400 focus:outline-none"
              disabled={loading || !!error}
            >
              <option value="">
                {loading ? "Loading games..." : error ? "Failed to load — try refreshing" : "Choose a game to analyze..."}
              </option>
              {allGames.map((g) => (
                <option key={g.id} value={g.id}>{g.title} — {g.lootboxes_score.toFixed(1)}/10</option>
              ))}
            </select>
          </div>
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
              <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
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
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Loading game database...</p>
          </div>
        </section>
      )}

      {/* Results */}
      {!loading && !error && (
        <section className="py-8">
          <div className="container-main">
            {!selected ? (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-16 text-center">
                <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Pick a game above</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Select any game from our database of {allGames.length}+ analyzed titles to see its
                  value breakdown, budget simulation, and our spending verdict.
                </p>
                {allGames.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Popular Picks</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {allGames.slice(0, 6).map((g) => (
                        <button key={g.id} onClick={() => setSelectedId(g.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 pl-1.5 pr-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden">
                            <GameAvatar gameName={g.title} src={g.cover_image} size="sm" aspectRatio="square" />
                          </div>
                          {g.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Game header */}
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden">
                          <GameAvatar gameName={selected.title} src={selected.cover_image} size="sm" aspectRatio="square" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-gray-900 dark:text-white">{selected.title}</h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Gamepad2 className="h-3.5 w-3.5" />
                            {SYSTEM_LABELS[selected.loot_system_type] || selected.loot_system_type} System
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-4xl font-black ${scoreColor(selected.lootboxes_score)}`}>
                          {selected.lootboxes_score.toFixed(1)}
                        </span>
                        <p className="text-xs text-gray-400 dark:text-gray-500">/10 overall</p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 mb-4">
                      <p className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2">
                        <Info className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                        {SYSTEM_TIPS[selected.loot_system_type] || "This game uses a monetization system we analyze across multiple dimensions."}
                      </p>
                    </div>
                    <div className="space-y-3">
                      {scoreMetrics.map((metric) => {
                        const MetricIcon = metric.icon;
                        return (
                          <div key={metric.label}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                                <MetricIcon className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" /> {metric.label}
                              </span>
                              <span className={`font-bold ${scoreColor(metric.score)}`}>{metric.score}/10</span>
                            </div>
                            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-500 ${scoreBarColor(metric.score)}`} style={{ width: `${metric.score * 10}%` }} />
                            </div>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{metric.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cost breakdown */}
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 dark:from-emerald-950 to-teal-600">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      Cost Breakdown
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 text-center">
                        <DollarSign className="h-5 w-5 text-gray-400 dark:text-gray-500 mx-auto mb-1" />
                        <p className="text-2xl font-black text-gray-900 dark:text-white">
                          {selected.cost_per_pull != null ? `$${selected.cost_per_pull.toFixed(2)}` : <span className="text-gray-400 dark:text-gray-500 text-lg">N/A</span>}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Cost Per Pull</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 text-center">
                        <Target className="h-5 w-5 text-gray-400 dark:text-gray-500 mx-auto mb-1" />
                        <p className="text-2xl font-black text-gray-900 dark:text-white">
                          {costForRare != null ? `~$${costForRare.toFixed(0)}` : <span className="text-gray-400 dark:text-gray-500 text-lg">N/A</span>}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Est. Cost Per Rare</p>
                        {pullEstimate && <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{pullEstimate.note}</p>}
                      </div>
                      <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 text-center">
                        <Shield className="h-5 w-5 text-gray-400 dark:text-gray-500 mx-auto mb-1" />
                        <p className="text-2xl font-black">
                          {selected.has_pity_system ? <span className="text-emerald-600">Yes</span> : <span className="text-red-500">No</span>}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Pity System</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 text-center">
                        <Brain className="h-5 w-5 text-gray-400 dark:text-gray-500 mx-auto mb-1" />
                        <p className="text-2xl font-black text-gray-900 dark:text-white">
                          {percentile > 0 ? `Top ${100 - percentile}%` : <span className="text-gray-400 dark:text-gray-500 text-lg">—</span>}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">vs All Games</p>
                      </div>
                    </div>
                  </div>

                  {/* Budget simulator */}
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 dark:from-blue-950 to-indigo-600">
                        <Wallet className="h-5 w-5 text-white" />
                      </div>
                      Budget Simulator
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Set your monthly budget to see how far your money goes in this game.
                    </p>
                    <div className="flex items-center gap-4 mb-6">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex-shrink-0">Monthly budget:</label>
                      <div className="flex items-center gap-2 flex-1 max-w-xs">
                        <span className="text-sm text-gray-500 dark:text-gray-400">$</span>
                        <input type="range" min={0} max={200} step={5} value={monthlyBudget}
                          onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                          className="flex-1 accent-emerald-500" />
                        <span className="text-lg font-bold text-gray-900 dark:text-white w-14 text-right">${monthlyBudget}</span>
                      </div>
                    </div>
                    {selected.cost_per_pull != null && monthlyBudget > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-700/30 p-4 text-center">
                          <p className="text-3xl font-black text-emerald-700">{monthlyPulls}</p>
                          <p className="text-xs text-emerald-600 font-medium">Pulls Per Month</p>
                        </div>
                        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 p-4 text-center">
                          <p className="text-3xl font-black text-blue-700">{monthsToRare != null ? monthsToRare : "∞"}</p>
                          <p className="text-xs text-blue-600 font-medium">Months to Rare Item</p>
                          <p className="text-[10px] text-blue-400">at ${monthlyBudget}/mo</p>
                        </div>
                        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 p-4 text-center">
                          <p className="text-3xl font-black text-amber-700">${(monthlyBudget * 12).toLocaleString()}</p>
                          <p className="text-xs text-amber-600 font-medium">Yearly Spending</p>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selected.cost_per_pull == null
                            ? "Cost per pull data isn't available for this game yet."
                            : "Set a budget above $0 to see the simulation."}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* vs Average */}
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-gray-400 dark:text-gray-500" /> Compared to Average
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Average score across <span className="font-semibold">{allGames.length} games</span> in our database:
                    </p>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-center">
                        <span className="text-3xl font-black text-gray-400 dark:text-gray-500">{avgScore.toFixed(1)}</span>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">DB Average</p>
                      </div>
                      <span className="text-gray-300 text-lg">vs</span>
                      <div className="text-center">
                        <span className={`text-3xl font-black ${scoreColor(selected.lootboxes_score)}`}>{selected.lootboxes_score.toFixed(1)}</span>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">{selected.title}</p>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative">
                      <div className="absolute h-full bg-gray-300 rounded-full" style={{ width: `${avgScore * 10}%` }} />
                      <div className={`absolute h-full rounded-full ${scoreBarColor(selected.lootboxes_score)}`} style={{ width: `${selected.lootboxes_score * 10}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      {selected.lootboxes_score > avgScore
                        ? `${(selected.lootboxes_score - avgScore).toFixed(1)} points above average — better than ${percentile}% of games`
                        : selected.lootboxes_score < avgScore
                          ? `${(avgScore - selected.lootboxes_score).toFixed(1)} points below average — only better than ${percentile}% of games`
                          : "Right at the database average"}
                    </p>
                  </div>
                </div>

                {/* Right: Verdict */}
                <div className="space-y-6">
                  {(() => {
                    const verdict = getVerdict(selected.lootboxes_score);
                    const VerdictIcon = verdict.icon;
                    return (
                      <div className={`rounded-xl border p-6 ${verdict.bgColor}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <VerdictIcon className={`h-6 w-6 ${verdict.color}`} />
                          <h3 className={`text-xl font-black ${verdict.color}`}>{verdict.label}</h3>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed mb-4">{verdict.description}</p>
                        <div className="border-t border-gray-200 dark:border-gray-700/50 pt-3">
                          <p className="text-xs font-bold text-gray-600 dark:text-gray-300 mb-2">Our Tips:</p>
                          <ul className="space-y-1.5">
                            {verdict.tips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                                <span className="text-gray-400 dark:text-gray-500 mt-0.5">•</span> {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Quick facts */}
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Quick Facts</h3>
                    <dl className="space-y-3 text-sm">
                      {[
                        { label: "System Type", value: SYSTEM_LABELS[selected.loot_system_type] || selected.loot_system_type },
                        { label: "Pity System", value: selected.has_pity_system ? "Yes" : "No", color: selected.has_pity_system ? "text-emerald-600" : "text-red-500" },
                        { label: "Cost Per Pull", value: selected.cost_per_pull != null ? `$${selected.cost_per_pull.toFixed(2)}` : "N/A" },
                        { label: "Transparency", value: `${selected.score_transparency}/10`, color: scoreColor(selected.score_transparency) },
                        { label: "Value Score", value: `${selected.score_value}/10`, color: scoreColor(selected.score_value) },
                        { label: "Percentile", value: `Better than ${percentile}% of games` },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between">
                          <dt className="text-gray-500 dark:text-gray-400">{item.label}</dt>
                          <dd className={`font-semibold ${item.color || "text-gray-900 dark:text-white"}`}>{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="space-y-2">
                    <Link href={`/lootbox/${selected.slug}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 transition-colors w-full">
                      Full Analysis <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href={`/lootbox/spending-guides/${selected.slug}`}
                      className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-6 py-3 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full">
                      Spending Guide <Wallet className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-10">
        <div className="container-main max-w-3xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How the Value Calculator Works</h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
            <p>
              Our value calculator combines multiple data points from each game&apos;s monetization analysis
              to give you a quick, actionable verdict. Here&apos;s what goes into the calculation:
            </p>
            <p>
              <strong>Transparency Score</strong> measures how openly a game discloses its drop rates, pity
              mechanics, and pricing structures. Games that publish exact percentages score higher than those
              that hide their odds.
            </p>
            <p>
              <strong>Value Score</strong> assesses whether what you receive is proportional to what you pay.
              A game with a $2.50 pull cost, 0.6% legendary rate, and no pity system scores much lower than
              one with a similar cost but guaranteed results.
            </p>
            <p>
              <strong>Budget Simulation</strong> uses cost-per-pull data and estimated pull counts (based on
              whether the game has a pity system) to show how your real monthly budget translates into in-game
              progress. Pity games average ~75 pulls per rare; non-pity games average ~100+.
            </p>
            <p>
              The overall verdict (&ldquo;Worth It&rdquo; / &ldquo;Proceed With Caution&rdquo; / &ldquo;Avoid
              Spending&rdquo;) is based on the combined overall score, which factors in all dimensions of our
              analysis including fairness, player control, and psychological design patterns.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 dark:border-gray-800 bg-gradient-to-r from-emerald-50 dark:from-emerald-950/30 to-teal-50 dark:to-teal-950/20 py-10">
        <div className="container-main text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Want to compare multiple games?</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-6 max-w-md mx-auto">
            Use our odds comparison tool to see drop rates side-by-side across up to 4 games.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/lootbox/odds-comparison"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-semibold text-white hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg">
              Compare Games <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/lootbox/spending-guides"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-6 py-3 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
              Spending Guides <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
