"use client";

import { useState, useEffect } from "react";
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

const SYSTEM_LABELS: Record<string, string> = {
  gacha: "Gacha",
  loot_box: "Loot Box",
  card_pack: "Card Pack",
  battle_pass: "Battle Pass",
  cosmetic_shop: "Cosmetic Shop",
};

function scoreColor(score: number): string {
  if (score >= 7) return "text-emerald-600";
  if (score >= 5) return "text-amber-600";
  return "text-red-600";
}

function getVerdict(score: number): {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  icon: typeof CheckCircle;
} {
  if (score >= 7)
    return {
      label: "Worth It",
      description:
        "This game offers fair monetization with good transparency and reasonable costs. You generally get value for your money.",
      color: "text-emerald-700",
      bgColor: "bg-emerald-50 border-emerald-200",
      icon: CheckCircle,
    };
  if (score >= 5)
    return {
      label: "Proceed With Caution",
      description:
        "Monetization is a mixed bag. Some aspects are fair, but watch for specific pain points. Set a budget and stick to it.",
      color: "text-amber-700",
      bgColor: "bg-amber-50 border-amber-200",
      icon: AlertTriangle,
    };
  return {
    label: "Avoid Spending",
    description:
      "This game has predatory or opaque monetization. Drop rates are poor relative to cost, and the odds are heavily stacked against you.",
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
    icon: AlertTriangle,
  };
}

export default function ValueCalculatorPage() {
  const [allGames, setAllGames] = useState<GameOption[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/lootbox/games")
      .then((r) => r.json())
      .then((data) => {
        setAllGames(data.games || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const selected = allGames.find((g) => g.id === selectedId);

  // Calculate derived metrics
  const costPerRare = selected?.cost_per_pull
    ? selected.cost_per_pull * 10
    : null; // ~10 pulls average for a rare
  const avgScore =
    allGames.length > 0
      ? allGames.reduce((sum, g) => sum + g.lootboxes_score, 0) /
        allGames.length
      : 5;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 py-16">
        <div className="container-main">
          <Link
            href="/lootbox"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-200 mb-4"
          >
            <ChevronLeft className="h-4 w-4" /> Loot Boxes
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 backdrop-blur-sm">
              <Calculator className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="inline-flex rounded-full bg-emerald-500/20 backdrop-blur-sm px-4 py-1 text-sm font-semibold text-emerald-300">
              Value Tool
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Is It Worth It?
          </h1>
          <p className="mt-2 text-lg text-emerald-300 font-semibold">
            Loot box value calculator
          </p>
          <p className="mt-4 max-w-2xl text-gray-300 leading-relaxed">
            Pick a game and we&apos;ll break down the real cost of its loot box
            system — from cost per pull to expected spending for rare items, plus
            our overall value verdict.
          </p>
        </div>
      </section>

      {/* Game selector */}
      <section className="border-b border-gray-100 bg-gray-50 sticky top-16 z-30">
        <div className="container-main py-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-700">
              Select a game:
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="flex-1 max-w-md rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-400 focus:outline-none"
              disabled={loading}
            >
              <option value="">
                {loading ? "Loading games..." : "Choose a game to analyze..."}
              </option>
              {allGames.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title} — {g.lootboxes_score.toFixed(1)}/10
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="container-main">
          {!selected ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
              <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Pick a game above
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Select any game from our database to see its value breakdown,
                cost analysis, and our spending verdict.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Score breakdown */}
              <div className="lg:col-span-2 space-y-6">
                {/* Game header */}
                <div className="rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">
                        {selected.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {SYSTEM_LABELS[selected.loot_system_type] ||
                          selected.loot_system_type}{" "}
                        System
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-4xl font-black ${scoreColor(selected.lootboxes_score)}`}
                      >
                        {selected.lootboxes_score.toFixed(1)}
                      </span>
                      <p className="text-xs text-gray-400">/10 overall</p>
                    </div>
                  </div>

                  {/* Score bars */}
                  <div className="space-y-3">
                    {[
                      {
                        label: "Transparency",
                        score: selected.score_transparency,
                        desc: "How openly are drop rates published?",
                      },
                      {
                        label: "Value",
                        score: selected.score_value,
                        desc: "Cost relative to what you get",
                      },
                    ].map((metric) => (
                      <div key={metric.label}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">
                            {metric.label}
                          </span>
                          <span
                            className={`font-bold ${scoreColor(metric.score)}`}
                          >
                            {metric.score}/10
                          </span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              metric.score >= 7
                                ? "bg-emerald-500"
                                : metric.score >= 5
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${metric.score * 10}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {metric.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost breakdown */}
                <div className="rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Cost Breakdown
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="rounded-lg bg-gray-50 p-4 text-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-2xl font-black text-gray-900">
                        {selected.cost_per_pull
                          ? `$${selected.cost_per_pull.toFixed(2)}`
                          : "—"}
                      </p>
                      <p className="text-xs text-gray-500">Cost Per Pull</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4 text-center">
                      <TrendingUp className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-2xl font-black text-gray-900">
                        {costPerRare ? `~$${costPerRare.toFixed(0)}` : "—"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Est. Cost Per Rare
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4 text-center">
                      <Shield className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-2xl font-black text-gray-900">
                        {selected.has_pity_system ? (
                          <span className="text-emerald-600">Yes</span>
                        ) : (
                          <span className="text-red-500">No</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">Pity System</p>
                    </div>
                  </div>
                </div>

                {/* vs Average */}
                <div className="rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Compared to Average
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">
                        Average loot box score across{" "}
                        <span className="font-semibold">
                          {allGames.length} games
                        </span>{" "}
                        in our database:
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-black text-gray-400">
                          {avgScore.toFixed(1)}
                        </span>
                        <span className="text-gray-300">vs</span>
                        <span
                          className={`text-3xl font-black ${scoreColor(selected.lootboxes_score)}`}
                        >
                          {selected.lootboxes_score.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {selected.lootboxes_score > avgScore
                          ? `${(selected.lootboxes_score - avgScore).toFixed(1)} points above average`
                          : selected.lootboxes_score < avgScore
                            ? `${(avgScore - selected.lootboxes_score).toFixed(1)} points below average`
                            : "Right at average"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Verdict */}
              <div className="space-y-6">
                {(() => {
                  const verdict = getVerdict(selected.score_value);
                  const VerdictIcon = verdict.icon;
                  return (
                    <div
                      className={`rounded-xl border p-6 ${verdict.bgColor}`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <VerdictIcon className={`h-6 w-6 ${verdict.color}`} />
                        <h3
                          className={`text-xl font-black ${verdict.color}`}
                        >
                          {verdict.label}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {verdict.description}
                      </p>
                    </div>
                  );
                })()}

                {/* Quick facts */}
                <div className="rounded-xl border border-gray-200 p-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">
                    Quick Facts
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">System Type</dt>
                      <dd className="font-semibold text-gray-900">
                        {SYSTEM_LABELS[selected.loot_system_type] ||
                          selected.loot_system_type}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Pity System</dt>
                      <dd
                        className={`font-semibold ${selected.has_pity_system ? "text-emerald-600" : "text-red-500"}`}
                      >
                        {selected.has_pity_system ? "Yes" : "No"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Transparency</dt>
                      <dd
                        className={`font-semibold ${scoreColor(selected.score_transparency)}`}
                      >
                        {selected.score_transparency}/10
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Value Score</dt>
                      <dd
                        className={`font-semibold ${scoreColor(selected.score_value)}`}
                      >
                        {selected.score_value}/10
                      </dd>
                    </div>
                  </dl>
                </div>

                <Link
                  href={`/lootbox/${selected.slug}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 transition-colors w-full"
                >
                  Full Analysis <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50 py-10">
        <div className="container-main text-center">
          <h2 className="text-xl font-bold text-gray-900">
            Want to compare multiple games?
          </h2>
          <p className="text-sm text-gray-600 mt-2 mb-6 max-w-md mx-auto">
            Use our odds comparison tool to see drop rates side-by-side across
            up to 4 games.
          </p>
          <Link
            href="/lootbox/odds-comparison"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Compare Games <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
