"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Dices,
  ChevronLeft,
  RotateCcw,
  DollarSign,
  TrendingUp,
  Sparkles,
  ExternalLink,
} from "lucide-react";

/* ── Drop rate data (Valve's published odds) ── */
const RARITY_TIERS = [
  { name: "Mil-Spec (Blue)", chance: 0.7992, color: "#4b69ff", minVal: 0.03, maxVal: 0.50 },
  { name: "Restricted (Purple)", chance: 0.1598, color: "#8847ff", minVal: 0.50, maxVal: 5.00 },
  { name: "Classified (Pink)", chance: 0.032, color: "#d32ce6", minVal: 5.00, maxVal: 30.00 },
  { name: "Covert (Red)", chance: 0.0064, color: "#eb4b4b", minVal: 25.00, maxVal: 500.00 },
  { name: "Rare Special (Gold)", chance: 0.0026, color: "#e4ae39", minVal: 100.00, maxVal: 15000.00 },
];

const CASES = [
  { name: "Revolution Case", cost: 2.49, image: null },
  { name: "Kilowatt Case", cost: 2.49, image: null },
  { name: "Dreams & Nightmares", cost: 2.49, image: null },
  { name: "Recoil Case", cost: 2.49, image: null },
  { name: "Fracture Case", cost: 2.49, image: null },
];

const EXAMPLE_SKINS: Record<string, string[]> = {
  "Mil-Spec (Blue)": ["MP9 | Hydra", "MAG-7 | SWAG-7", "P250 | Visions", "Tec-9 | Fubar", "Nova | Dark Sigil"],
  "Restricted (Purple)": ["M4A1-S | Emphorosaur-S", "AK-47 | Head Shot", "USP-S | Jawbreaker", "AWP | Chromatic Aberration"],
  "Classified (Pink)": ["AK-47 | Inheritance", "M4A4 | Temukau", "AWP | Duality"],
  "Covert (Red)": ["AK-47 | Nightwish", "M4A1-S | Printstream"],
  "Rare Special (Gold)": ["Butterfly Knife | Fade", "Karambit | Doppler", "M9 Bayonet | Crimson Web", "Sport Gloves | Vice"],
};

interface OpenResult {
  id: number;
  rarity: string;
  color: string;
  skinName: string;
  value: number;
  isKnife: boolean;
}

function rollCase(): OpenResult {
  const roll = Math.random();
  let cumulative = 0;

  for (const tier of RARITY_TIERS) {
    cumulative += tier.chance;
    if (roll <= cumulative) {
      const skins = EXAMPLE_SKINS[tier.name] || ["Unknown Skin"];
      const skinName = skins[Math.floor(Math.random() * skins.length)];
      const value = +(tier.minVal + Math.random() * (tier.maxVal - tier.minVal)).toFixed(2);
      return {
        id: Date.now() + Math.random(),
        rarity: tier.name,
        color: tier.color,
        skinName,
        value,
        isKnife: tier.name === "Rare Special (Gold)",
      };
    }
  }

  // Fallback (shouldn't reach)
  const tier = RARITY_TIERS[0];
  return {
    id: Date.now(),
    rarity: tier.name,
    color: tier.color,
    skinName: "MP9 | Hydra",
    value: 0.10,
    isKnife: false,
  };
}

export default function CS2SimulatorPage() {
  const [selectedCase, setSelectedCase] = useState(0);
  const [results, setResults] = useState<OpenResult[]>([]);
  const [opening, setOpening] = useState(false);
  const [lastResult, setLastResult] = useState<OpenResult | null>(null);

  const totalSpent = results.length * CASES[selectedCase].cost;
  const totalValue = results.reduce((sum, r) => sum + r.value, 0);
  const profit = totalValue - totalSpent;
  const knivesFound = results.filter((r) => r.isKnife).length;

  const openCase = useCallback(() => {
    setOpening(true);
    // Brief animation delay
    setTimeout(() => {
      const result = rollCase();
      setResults((prev) => [result, ...prev]);
      setLastResult(result);
      setOpening(false);
    }, 600);
  }, []);

  const openTen = useCallback(() => {
    setOpening(true);
    setTimeout(() => {
      const newResults: OpenResult[] = [];
      let best: OpenResult | null = null;
      for (let i = 0; i < 10; i++) {
        const r = rollCase();
        newResults.push(r);
        if (!best || r.value > best.value) best = r;
      }
      setResults((prev) => [...newResults, ...prev]);
      setLastResult(best);
      setOpening(false);
    }, 800);
  }, []);

  const reset = () => {
    setResults([]);
    setLastResult(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 py-10">
        <div className="container-main">
          <Link href="/cs2" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ChevronLeft className="h-4 w-4" /> CS2 Skins Hub
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white">
              <Dices className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Case Opening Simulator</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Open CS2 cases with real Valve drop rates — completely free. See how much you&apos;d actually spend to get that knife.
          </p>
        </div>
      </section>

      <div className="container-main py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case selector */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Select a Case</h3>
              <div className="flex flex-wrap gap-2">
                {CASES.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedCase(i)}
                    className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                      i === selectedCase
                        ? "border-purple-300 bg-purple-50 text-purple-700 shadow-sm"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {c.name}
                    <span className="ml-2 text-xs text-gray-400">${c.cost}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Opening area */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-center relative overflow-hidden">
              {/* Glow effect on knife */}
              {lastResult?.isKnife && (
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent animate-pulse" />
              )}

              <div className="relative z-10">
                {lastResult ? (
                  <div className={`transition-all duration-300 ${opening ? "scale-90 opacity-50" : "scale-100 opacity-100"}`}>
                    <div
                      className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl text-white text-3xl font-black"
                      style={{ backgroundColor: lastResult.color }}
                    >
                      {lastResult.isKnife ? "★" : lastResult.skinName.charAt(0)}
                    </div>
                    <p className="text-xl font-bold text-white">{lastResult.skinName}</p>
                    <p className="text-sm mt-1" style={{ color: lastResult.color }}>{lastResult.rarity}</p>
                    <p className="text-2xl font-black text-emerald-400 mt-2">${lastResult.value.toFixed(2)}</p>
                  </div>
                ) : (
                  <div className="py-8">
                    <Dices className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Click below to open a case</p>
                  </div>
                )}
              </div>

              <div className="relative z-10 mt-8 flex justify-center gap-3">
                <button
                  onClick={openCase}
                  disabled={opening}
                  className="rounded-xl bg-purple-600 px-8 py-3 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                >
                  {opening ? "Opening..." : `Open Case — $${CASES[selectedCase].cost}`}
                </button>
                <button
                  onClick={openTen}
                  disabled={opening}
                  className="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-3 text-sm font-bold text-white hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                >
                  {opening ? "Opening..." : `Open 10x — $${(CASES[selectedCase].cost * 10).toFixed(2)}`}
                </button>
              </div>
            </div>

            {/* Drop rates reference */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Official Drop Rates (Valve)</h3>
              <div className="flex flex-wrap gap-3">
                {RARITY_TIERS.map((tier) => (
                  <div key={tier.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: tier.color }} />
                    <span className="text-xs text-gray-700">{tier.name.split(" (")[0]}</span>
                    <span className="text-xs font-bold text-gray-500">{(tier.chance * 100).toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Results history */}
            {results.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-700">Opening History ({results.length} cases)</h3>
                  <button
                    onClick={reset}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" /> Reset
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto space-y-1.5 rounded-xl border border-gray-200 bg-white p-3">
                  {results.map((r) => (
                    <div
                      key={r.id}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${r.isKnife ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50"}`}
                    >
                      <div
                        className="h-8 w-8 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: r.color }}
                      >
                        {r.isKnife ? "★" : r.skinName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{r.skinName}</p>
                        <p className="text-[10px]" style={{ color: r.color }}>{r.rarity}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">${r.value.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar stats */}
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Your Session</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    Total Spent
                  </div>
                  <p className="text-lg font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4" />
                    Total Value
                  </div>
                  <p className="text-lg font-bold text-gray-900">${totalValue.toFixed(2)}</p>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Profit / Loss</span>
                    <p className={`text-xl font-black ${profit >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {profit >= 0 ? "+" : ""}{profit.toFixed(2)}
                    </p>
                  </div>
                  {results.length > 0 && (
                    <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${profit >= 0 ? "bg-emerald-500" : "bg-red-400"}`}
                        style={{ width: `${Math.min(Math.max((totalValue / Math.max(totalSpent, 0.01)) * 50, 2), 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    Knives / Gloves
                  </div>
                  <p className="text-lg font-bold text-yellow-600">{knivesFound}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cases Opened</span>
                  <p className="text-lg font-bold text-gray-900">{results.length}</p>
                </div>
              </div>

              {/* Reality check */}
              {results.length >= 5 && (
                <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-semibold text-amber-800 mb-1">Reality Check</p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    {profit < 0
                      ? `You've lost $${Math.abs(profit).toFixed(2)} so far. This is typical — the house edge on cases is significant. Consider buying skins directly from marketplaces instead.`
                      : `You're up $${profit.toFixed(2)} — nice luck! But remember: most case openers lose money over time. The expected return is ~60¢ per $2.50 case.`
                    }
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="mt-6 space-y-2">
                <a
                  href="/go/cs2/csfloat?from=simulator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors"
                  style={{ backgroundColor: "#4f8df0" }}
                >
                  Buy Real Skins on CSFloat <ExternalLink className="h-3 w-3" />
                </a>
                <Link
                  href="/cs2/prices"
                  className="block w-full rounded-lg bg-gray-900 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                >
                  Compare Prices Across Markets
                </Link>
                <Link
                  href="/cs2/compare"
                  className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  See All Marketplaces
                </Link>
              </div>
              <p className="mt-3 text-[10px] text-gray-400 text-center">
                Affiliate link — we may earn a commission at no cost to you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
