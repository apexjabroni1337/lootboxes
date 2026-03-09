"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Dices,
  RotateCcw,
  DollarSign,
  TrendingUp,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Package,
  Search,
} from "lucide-react";

/* ── Types ── */

interface CaseData {
  id: string;
  name: string;
  image: string | null;
  first_sale_date: string | null;
  type: string;
}

interface CaseItemData {
  id: string;
  crate_id: string;
  name: string;
  rarity_name: string;
  rarity_color: string | null;
  image: string | null;
  is_rare_special: boolean;
}

interface OpenResult {
  id: number;
  rarity: string;
  rarityColor: string;
  skinName: string;
  image: string | null;
  value: number;
  isKnife: boolean;
}

/* ── Drop rate data (Valve's published odds) ── */
const RARITY_TIERS = [
  { name: "Mil-Spec (Blue)", match: ["mil-spec grade", "mil-spec"], chance: 0.7992, color: "#4b69ff", minVal: 0.03, maxVal: 0.50 },
  { name: "Restricted (Purple)", match: ["restricted"], chance: 0.1598, color: "#8847ff", minVal: 0.50, maxVal: 5.00 },
  { name: "Classified (Pink)", match: ["classified"], chance: 0.032, color: "#d32ce6", minVal: 5.00, maxVal: 30.00 },
  { name: "Covert (Red)", match: ["covert"], chance: 0.0064, color: "#eb4b4b", minVal: 25.00, maxVal: 500.00 },
  { name: "Rare Special (Gold)", match: ["extraordinary", "contraband", "rare special"], chance: 0.0026, color: "#e4ae39", minVal: 100.00, maxVal: 15000.00 },
];

const CASE_COST = 2.49;

function matchRarity(rarityName: string): typeof RARITY_TIERS[number] | null {
  const lower = rarityName.toLowerCase();
  for (const tier of RARITY_TIERS) {
    if (tier.match.some((m) => lower.includes(m))) return tier;
  }
  return null;
}

/* ── Component Props ── */

interface SimulatorClientProps {
  cases: CaseData[];
  itemsByCase: Record<string, CaseItemData[]>;
}

export default function SimulatorClient({ cases, itemsByCase }: SimulatorClientProps) {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [results, setResults] = useState<OpenResult[]>([]);
  const [opening, setOpening] = useState(false);
  const [lastResult, setLastResult] = useState<OpenResult | null>(null);
  const [showContents, setShowContents] = useState(false);
  const [caseSearch, setCaseSearch] = useState("");

  // Filtered cases for the two-column list
  const filteredCases = useMemo(() => {
    if (!caseSearch) return cases;
    const q = caseSearch.toLowerCase();
    return cases.filter((c) => c.name.toLowerCase().includes(q));
  }, [cases, caseSearch]);

  const selectedCase = cases[selectedCaseIdx];
  const caseItems = useMemo(
    () => (selectedCase ? itemsByCase[selectedCase.id] || [] : []),
    [selectedCase, itemsByCase]
  );

  // Group items by rarity for the roll
  const itemsByRarity = useMemo(() => {
    const groups: Record<string, CaseItemData[]> = {};
    for (const item of caseItems) {
      const tier = matchRarity(item.is_rare_special ? "extraordinary" : item.rarity_name);
      const key = tier?.name || "Other";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }
    return groups;
  }, [caseItems]);

  const totalSpent = results.length * CASE_COST;
  const totalValue = results.reduce((sum, r) => sum + r.value, 0);
  const profit = totalValue - totalSpent;
  const knivesFound = results.filter((r) => r.isKnife).length;

  const rollCase = useCallback((): OpenResult => {
    const roll = Math.random();
    let cumulative = 0;

    for (const tier of RARITY_TIERS) {
      cumulative += tier.chance;
      if (roll <= cumulative) {
        const tierItems = itemsByRarity[tier.name] || [];
        if (tierItems.length > 0) {
          const item = tierItems[Math.floor(Math.random() * tierItems.length)];
          const value = +(tier.minVal + Math.random() * (tier.maxVal - tier.minVal)).toFixed(2);
          return {
            id: Date.now() + Math.random(),
            rarity: tier.name,
            rarityColor: item.rarity_color || tier.color,
            skinName: item.name,
            image: item.image,
            value,
            isKnife: tier.name === "Rare Special (Gold)",
          };
        }
        // Fallback: no items for this tier in this case, generate generic
        const value = +(tier.minVal + Math.random() * (tier.maxVal - tier.minVal)).toFixed(2);
        return {
          id: Date.now() + Math.random(),
          rarity: tier.name,
          rarityColor: tier.color,
          skinName: `Unknown ${tier.name.split(" (")[0]} Skin`,
          image: null,
          value,
          isKnife: tier.name === "Rare Special (Gold)",
        };
      }
    }

    // Should not reach here
    return {
      id: Date.now(),
      rarity: "Mil-Spec (Blue)",
      rarityColor: "#4b69ff",
      skinName: "Unknown Skin",
      image: null,
      value: 0.10,
      isKnife: false,
    };
  }, [itemsByRarity]);

  const openCase = useCallback(() => {
    setOpening(true);
    setTimeout(() => {
      const result = rollCase();
      setResults((prev) => [result, ...prev]);
      setLastResult(result);
      setOpening(false);
    }, 600);
  }, [rollCase]);

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
  }, [rollCase]);

  const reset = () => {
    setResults([]);
    setLastResult(null);
  };

  // Group contents for preview
  const contentsGrouped = useMemo(() => {
    const normal = caseItems.filter((i) => !i.is_rare_special);
    const rare = caseItems.filter((i) => i.is_rare_special);
    return { normal, rare };
  }, [caseItems]);

  return (
    <div className="container-main py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case selector — two-column scrollable list */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500">
                Select a Case ({cases.length})
              </span>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter..."
                  value={caseSearch}
                  onChange={(e) => setCaseSearch(e.target.value)}
                  className="w-32 rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-7 pr-2 text-xs focus:border-purple-300 focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto pr-1">
              {filteredCases.length === 0 ? (
                <p className="col-span-2 text-xs text-gray-400 text-center py-3">No cases found</p>
              ) : (
                filteredCases.map((c) => {
                  const origIdx = cases.indexOf(c);
                  const isSelected = origIdx === selectedCaseIdx;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCaseIdx(origIdx);
                        setShowContents(false);
                      }}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all ${
                        isSelected
                          ? "bg-purple-50 border border-purple-300"
                          : "border border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                      }`}
                    >
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={c.name}
                          className="h-7 w-7 object-contain flex-shrink-0"
                        />
                      ) : (
                        <Package className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      )}
                      <span
                        className={`text-xs font-medium truncate ${
                          isSelected ? "text-purple-700 font-semibold" : "text-gray-700"
                        }`}
                      >
                        {c.name.replace(" Case", "").replace(" Weapon", "")}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
            {/* Selected case info */}
            <div className="mt-3 flex items-center gap-3 rounded-lg bg-purple-50 border border-purple-200 px-3 py-2">
              {selectedCase?.image && (
                <img
                  src={selectedCase.image}
                  alt=""
                  className="h-10 w-10 object-contain flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-purple-800 truncate">{selectedCase?.name}</p>
                <p className="text-[11px] text-purple-600">
                  ${CASE_COST} · {caseItems.length} items
                </p>
              </div>
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
                  {lastResult.image ? (
                    <img
                      src={lastResult.image}
                      alt={lastResult.skinName}
                      className="mx-auto mb-4 h-32 w-32 object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                    />
                  ) : (
                    <div
                      className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl text-white text-3xl font-black"
                      style={{ backgroundColor: lastResult.rarityColor }}
                    >
                      {lastResult.isKnife ? "★" : lastResult.skinName.charAt(0)}
                    </div>
                  )}
                  <p className="text-xl font-bold text-white">{lastResult.skinName}</p>
                  <p className="text-sm mt-1" style={{ color: lastResult.rarityColor }}>
                    {lastResult.rarity}
                  </p>
                  <p className="text-2xl font-black text-emerald-400 mt-2">
                    ${lastResult.value.toFixed(2)}
                  </p>
                </div>
              ) : (
                <div className="py-8">
                  {selectedCase?.image ? (
                    <img
                      src={selectedCase.image}
                      alt={selectedCase.name}
                      className="h-24 w-24 mx-auto mb-4 object-contain opacity-60"
                    />
                  ) : (
                    <Dices className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  )}
                  <p className="text-gray-400 text-lg">Click below to open a case</p>
                </div>
              )}
            </div>

            <div className="relative z-10 mt-8 flex justify-center gap-3">
              <button
                onClick={openCase}
                disabled={opening || caseItems.length === 0}
                className="rounded-xl bg-purple-600 px-8 py-3 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
              >
                {opening ? "Opening..." : `Open Case — $${CASE_COST}`}
              </button>
              <button
                onClick={openTen}
                disabled={opening || caseItems.length === 0}
                className="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-3 text-sm font-bold text-white hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
              >
                {opening ? "Opening..." : `Open 10x — $${(CASE_COST * 10).toFixed(2)}`}
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
                  <span className="text-xs font-bold text-gray-500">
                    {(tier.chance * 100).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Case contents preview */}
          {caseItems.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <button
                onClick={() => setShowContents(!showContents)}
                className="flex w-full items-center justify-between px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-purple-500" />
                  What&apos;s Inside {selectedCase?.name} ({caseItems.length} items)
                </div>
                {showContents ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </button>

              {showContents && (
                <div className="border-t border-gray-100 p-4">
                  {/* Normal items */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {contentsGrouped.normal.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col items-center rounded-lg border border-gray-100 bg-gray-50 p-2"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 object-contain mb-1"
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className="h-16 w-16 rounded flex items-center justify-center text-white text-xs font-bold mb-1"
                            style={{ backgroundColor: item.rarity_color || "#666" }}
                          >
                            {item.name.charAt(0)}
                          </div>
                        )}
                        <p className="text-[10px] font-medium text-gray-700 text-center leading-tight line-clamp-2">
                          {item.name}
                        </p>
                        <span
                          className="mt-0.5 text-[9px] font-bold"
                          style={{ color: item.rarity_color || "#666" }}
                        >
                          {item.rarity_name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Rare special items */}
                  {contentsGrouped.rare.length > 0 && (
                    <>
                      <div className="mt-4 mb-2 flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                        <p className="text-xs font-bold text-yellow-700">
                          Rare Special Items ({contentsGrouped.rare.length})
                        </p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {contentsGrouped.rare.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col items-center rounded-lg border border-yellow-200 bg-yellow-50 p-2"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-16 w-16 object-contain mb-1"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-16 w-16 rounded flex items-center justify-center text-white text-xs font-bold mb-1 bg-yellow-500">
                                ★
                              </div>
                            )}
                            <p className="text-[10px] font-medium text-gray-700 text-center leading-tight line-clamp-2">
                              {item.name}
                            </p>
                            <span className="mt-0.5 text-[9px] font-bold text-yellow-600">
                              Rare Special
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Results history */}
          {results.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-700">
                  Opening History ({results.length} cases)
                </h3>
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
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                      r.isKnife ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50"
                    }`}
                  >
                    {r.image ? (
                      <img
                        src={r.image}
                        alt={r.skinName}
                        className="h-10 w-10 object-contain flex-shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="h-8 w-8 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: r.rarityColor }}
                      >
                        {r.isKnife ? "★" : r.skinName.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {r.skinName}
                      </p>
                      <p className="text-[10px]" style={{ color: r.rarityColor }}>
                        {r.rarity}
                      </p>
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
                  <p
                    className={`text-xl font-black ${
                      profit >= 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {profit >= 0 ? "+" : ""}
                    {profit.toFixed(2)}
                  </p>
                </div>
                {results.length > 0 && (
                  <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        profit >= 0 ? "bg-emerald-500" : "bg-red-400"
                      }`}
                      style={{
                        width: `${Math.min(
                          Math.max((totalValue / Math.max(totalSpent, 0.01)) * 50, 2),
                          100
                        )}%`,
                      }}
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
                    : `You're up $${profit.toFixed(2)} — nice luck! But remember: most case openers lose money over time. The expected return is ~60¢ per $2.50 case.`}
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="mt-6 space-y-2">
              <a
                href="/go/cs2/skinport?from=simulator"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: "#eb4b98" }}
              >
                Buy Real Skins on Skinport <ExternalLink className="h-3 w-3" />
              </a>
              <Link
                href="/cs2/prices"
                className="block w-full rounded-lg bg-gray-900 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
              >
                Compare Prices Across Markets
              </Link>
              <Link
                href="/cs2/cases"
                className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Browse All Cases & Capsules
              </Link>
            </div>
            <p className="mt-3 text-[10px] text-gray-400 text-center">
              Affiliate link — we may earn a commission at no cost to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
