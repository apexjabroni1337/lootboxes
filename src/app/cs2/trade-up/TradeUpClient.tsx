"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Calculator,
  ChevronLeft,
  ExternalLink,
  Plus,
  X,
  Search,
  TrendingUp,
  TrendingDown,
  Target,
  Loader2,
  Wifi,
  WifiOff,
  Package,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import AffiliateDisclosure from "@/components/cs2/AffiliateDisclosure";

/* ── Rarity tiers (in order) ── */
const RARITIES = ["Mil-Spec", "Restricted", "Classified", "Covert"] as const;
type Rarity = (typeof RARITIES)[number];

const RARITY_COLORS: Record<string, string> = {
  "Mil-Spec": "#4b69ff",
  Restricted: "#8847ff",
  Classified: "#d32ce6",
  Covert: "#eb4b4b",
  Contraband: "#e4ae39",
};

/* Estimated fallback prices per rarity when live prices unavailable */
const FALLBACK_PRICES: Record<Rarity, number> = {
  "Mil-Spec": 0.15,
  Restricted: 1.50,
  Classified: 8.00,
  Covert: 50.00,
};

function nextRarity(r: Rarity): Rarity | null {
  const idx = RARITIES.indexOf(r);
  if (idx < RARITIES.length - 1) return RARITIES[idx + 1];
  return null;
}

/**
 * Map DB rarity names (e.g. "Mil-Spec Grade") to our simplified tier names.
 */
function normalizeRarity(dbRarity: string): Rarity | null {
  const r = dbRarity.toLowerCase();
  if (r.includes("mil-spec") || r.includes("mil spec")) return "Mil-Spec";
  if (r.includes("restricted")) return "Restricted";
  if (r.includes("classified")) return "Classified";
  if (r.includes("covert")) return "Covert";
  return null;
}

/* ── Types from the server ── */
export interface TradeUpCase {
  id: string;
  name: string;
  image: string | null;
  first_sale_date: string | null;
}

export interface TradeUpItem {
  id: string;
  crate_id: string;
  name: string; // "AK-47 | Nightwish"
  rarity_name: string;
  rarity_color: string | null;
  image: string | null;
  is_rare_special: boolean;
}

interface TradeUpSkin {
  id: string;
  weapon: string;
  skinName: string;
  fullName: string;
  collection: string;
  collectionId: string;
  rarity: Rarity;
  image: string | null;
  price: number; // fallback estimated price
  minFloat: number;
  maxFloat: number;
}

interface Props {
  cases: TradeUpCase[];
  itemsByCase: Record<string, TradeUpItem[]>;
}

export default function TradeUpClient({ cases, itemsByCase }: Props) {
  // Build a collection map: caseName -> normalized skins
  const collections = useMemo(() => {
    const map: Record<string, TradeUpSkin[]> = {};
    for (const c of cases) {
      const items = itemsByCase[c.id] || [];
      const skins: TradeUpSkin[] = [];
      for (const item of items) {
        if (item.is_rare_special) continue;
        const rarity = normalizeRarity(item.rarity_name);
        if (!rarity) continue;

        const parts = item.name.split(" | ");
        const weapon = parts[0] || item.name;
        const skinName = parts[1] || "";

        skins.push({
          id: item.id,
          weapon,
          skinName,
          fullName: item.name,
          collection: c.name,
          collectionId: c.id,
          rarity,
          image: item.image,
          price: FALLBACK_PRICES[rarity],
          minFloat: 0,
          maxFloat: 0.7,
        });
      }
      if (skins.length > 0) {
        map[c.name] = skins;
      }
    }
    return map;
  }, [cases, itemsByCase]);

  const collectionNames = useMemo(() => Object.keys(collections), [collections]);

  const caseImageMap = useMemo(() => {
    const map: Record<string, string | null> = {};
    for (const c of cases) {
      map[c.name] = c.image;
    }
    return map;
  }, [cases]);

  const [selectedCollection, setSelectedCollection] = useState(collectionNames[0] || "");
  const [inputRarity, setInputRarity] = useState<Rarity>("Mil-Spec");
  const [selectedInputs, setSelectedInputs] = useState<TradeUpSkin[]>([]);
  const [skinSearch, setSkinSearch] = useState("");
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [pricesLoading, setPricesLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);

  /* Fetch live prices for the current collection */
  const fetchLivePrices = useCallback(
    async (collectionName: string) => {
      const skins = collections[collectionName];
      if (!skins) return;

      setPricesLoading(true);
      try {
        const names = skins
          .map((s) => `${s.weapon}|${s.skinName}`)
          .filter((v, i, a) => a.indexOf(v) === i)
          .join(",");

        const res = await fetch(
          `/api/cs2/skin-lookup?names=${encodeURIComponent(names)}`
        );
        if (!res.ok) throw new Error("API error");

        const data = await res.json();
        const priceMap: Record<string, number> = {};

        for (const [key, value] of Object.entries(data.results)) {
          const v = value as { avgPrice: number };
          if (v.avgPrice > 0) {
            priceMap[key] = v.avgPrice;
          }
        }

        setLivePrices((prev) => ({ ...prev, ...priceMap }));
        setIsLive(Object.keys(priceMap).length > 0);
      } catch {
        console.warn("Failed to fetch live prices for trade-up calculator");
        setIsLive(false);
      } finally {
        setPricesLoading(false);
      }
    },
    [collections]
  );

  useEffect(() => {
    if (selectedCollection) {
      fetchLivePrices(selectedCollection);
    }
  }, [selectedCollection, fetchLivePrices]);

  /* Helper: get effective price for a skin (live or fallback) */
  const getPrice = useCallback(
    (skin: TradeUpSkin): number => {
      const key = `${skin.weapon}|${skin.skinName}`;
      return livePrices[key] ?? skin.price;
    },
    [livePrices]
  );

  /* Available input skins = skins in selected collection at selected rarity */
  const availableSkins = useMemo(() => {
    const skins =
      collections[selectedCollection]?.filter((s) => s.rarity === inputRarity) ||
      [];
    if (skinSearch) {
      const q = skinSearch.toLowerCase();
      return skins.filter(
        (s) =>
          s.weapon.toLowerCase().includes(q) ||
          s.skinName.toLowerCase().includes(q)
      );
    }
    return skins;
  }, [collections, selectedCollection, inputRarity, skinSearch]);

  /* Possible outcomes = next rarity tier skins from the selected collection */
  const outputRarityVal = nextRarity(inputRarity);
  const possibleOutcomes = useMemo(() => {
    if (!outputRarityVal) return [];
    return (
      collections[selectedCollection]?.filter(
        (s) => s.rarity === outputRarityVal
      ) || []
    );
  }, [collections, selectedCollection, outputRarityVal]);

  const addSkin = (skin: TradeUpSkin) => {
    if (selectedInputs.length >= 10) return;
    setSelectedInputs((prev) => [...prev, skin]);
  };

  const removeSkin = (index: number) => {
    setSelectedInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => setSelectedInputs([]);

  /* ── Core calculations ── */
  const isReady = selectedInputs.length === 10;
  const totalInputCost = selectedInputs.reduce(
    (sum, s) => sum + getPrice(s),
    0
  );
  const avgInputFloat =
    selectedInputs.length > 0
      ? selectedInputs.reduce(
          (sum, s) => sum + (s.minFloat + s.maxFloat) / 2,
          0
        ) / selectedInputs.length
      : 0;

  const probPerOutcome =
    possibleOutcomes.length > 0 ? 1 / possibleOutcomes.length : 0;
  const expectedValue = possibleOutcomes.reduce(
    (sum, o) => sum + probPerOutcome * getPrice(o),
    0
  );
  const profit = expectedValue - totalInputCost;
  const profitPct = totalInputCost > 0 ? (profit / totalInputCost) * 100 : 0;

  // Count how many outcomes are profitable
  const profitableCount = possibleOutcomes.filter(
    (o) => getPrice(o) > totalInputCost
  ).length;
  const winChance = possibleOutcomes.length > 0
    ? (profitableCount / possibleOutcomes.length) * 100
    : 0;

  /* Available rarities for the current collection */
  const availableRarities = useMemo(() => {
    const skins = collections[selectedCollection] || [];
    const raritySet = new Set(skins.map((s) => s.rarity));
    return RARITIES.filter(
      (r, idx) => idx < RARITIES.length - 1 && raritySet.has(r)
    );
  }, [collections, selectedCollection]);

  useEffect(() => {
    if (availableRarities.length > 0 && !availableRarities.includes(inputRarity)) {
      setInputRarity(availableRarities[0]);
    }
  }, [availableRarities, inputRarity]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-amber-50 dark:from-amber-950/30 via-yellow-50 dark:via-yellow-950/20 to-orange-50 dark:to-orange-950/20 py-10">
        <div className="container-main">
          <Link
            href="/cs2"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-200 mb-4"
          >
            <ChevronLeft className="h-4 w-4" /> CS2 Skins Hub
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/300 text-white">
              <Calculator className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Trade-Up Calculator
            </h1>
            <div className="flex items-center gap-1.5 text-[10px] ml-3">
              {isLive ? (
                <>
                  <Wifi className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-600 font-semibold">
                    LIVE PRICES
                  </span>
                </>
              ) : pricesLoading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin text-gray-400 dark:text-gray-500" />
                  <span className="text-gray-400 dark:text-gray-500">Loading prices...</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                  <span className="text-gray-400 dark:text-gray-500">Estimated prices</span>
                </>
              )}
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
            Select 10 input skins, see all possible outcomes with probabilities,
            and know your expected profit before you commit.
            {isLive && " Prices updated live from Skinport."}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            {collectionNames.length} weapon cases with real items and prices
          </p>
        </div>
      </section>

      <div className="container-main py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Input selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Controls */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-5">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4">
                Step 1: Choose Case & Rarity
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    Case
                  </label>
                  <div className="flex items-center gap-2">
                    {caseImageMap[selectedCollection] && (
                      <img
                        src={caseImageMap[selectedCollection]!}
                        alt=""
                        className="h-8 w-8 object-contain flex-shrink-0"
                      />
                    )}
                    <select
                      value={selectedCollection}
                      onChange={(e) => {
                        setSelectedCollection(e.target.value);
                        setSelectedInputs([]);
                      }}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2.5 text-sm focus:border-amber-300 focus:outline-none"
                    >
                      {collectionNames.map((c) => (
                        <option key={c} value={c}>
                          {c} ({collections[c].length} skins)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    Input Rarity
                  </label>
                  <select
                    value={inputRarity}
                    onChange={(e) => {
                      setInputRarity(e.target.value as Rarity);
                      setSelectedInputs([]);
                    }}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2.5 text-sm focus:border-amber-300 focus:outline-none"
                  >
                    {availableRarities.map((r) => {
                      const nr = nextRarity(r);
                      return (
                        <option key={r} value={r}>
                          {r} {nr ? `\u2192 ${nr}` : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            {/* Available skins */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                  Step 2: Select 10 Input Skins
                </h2>
                <span
                  className="text-xs font-semibold"
                  style={{ color: RARITY_COLORS[inputRarity] }}
                >
                  {selectedInputs.length}/10 selected
                </span>
              </div>

              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Filter skins..."
                  value={skinSearch}
                  onChange={(e) => setSkinSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2 pl-9 pr-3 text-sm focus:border-amber-300 focus:outline-none"
                />
              </div>

              {availableSkins.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No {inputRarity} skins in this case.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableSkins.map((skin) => {
                    const canAdd = selectedInputs.length < 10;
                    const price = getPrice(skin);
                    const hasLive =
                      livePrices[`${skin.weapon}|${skin.skinName}`] != null;
                    return (
                      <button
                        key={skin.id}
                        onClick={() => addSkin(skin)}
                        disabled={!canAdd}
                        className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                          canAdd
                            ? "border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 cursor-pointer"
                            : "border-gray-100 opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {skin.image ? (
                          <img
                            src={skin.image}
                            alt={skin.fullName}
                            className="h-10 w-10 object-contain flex-shrink-0 rounded"
                          />
                        ) : (
                          <div
                            className="h-10 w-10 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{
                              backgroundColor: RARITY_COLORS[skin.rarity],
                            }}
                          >
                            {skin.weapon.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {skin.weapon} | {skin.skinName}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              ${price.toFixed(2)}
                            </p>
                            {hasLive && (
                              <span className="text-[9px] font-semibold text-emerald-600">
                                LIVE
                              </span>
                            )}
                          </div>
                        </div>
                        <Plus className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected inputs */}
            {selectedInputs.length > 0 && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                    Your 10 Inputs
                  </h2>
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-1.5">
                  {selectedInputs.map((skin, idx) => (
                    <div
                      key={`${skin.id}-${idx}`}
                      className="flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-900 px-3 py-2"
                    >
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-5">
                        {idx + 1}.
                      </span>
                      {skin.image ? (
                        <img
                          src={skin.image}
                          alt={skin.fullName}
                          className="h-7 w-7 object-contain flex-shrink-0 rounded"
                        />
                      ) : (
                        <div
                          className="h-6 w-6 rounded flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{
                            backgroundColor: RARITY_COLORS[skin.rarity],
                          }}
                        >
                          {skin.weapon.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm text-gray-700 dark:text-gray-200 flex-1 truncate">
                        {skin.weapon} | {skin.skinName}
                      </span>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        ${getPrice(skin).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeSkin(idx)}
                        className="text-gray-400 dark:text-gray-500 hover:text-red-500"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {selectedInputs.length < 10 && (
                    <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-400 dark:text-gray-500">
                      <Plus className="h-4 w-4" />
                      {10 - selectedInputs.length} more skin
                      {10 - selectedInputs.length !== 1 ? "s" : ""} needed
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ═══ RESULTS PANEL — only when 10 items selected ═══ */}
            {isReady && possibleOutcomes.length > 0 && (
              <div
                className={`rounded-xl border-2 p-6 ${
                  profit >= 0
                    ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50"
                    : "border-red-200 bg-gradient-to-br from-red-50 to-orange-50"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {profit >= 0 ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  )}
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">
                    Trade-Up Results
                  </h2>
                </div>

                {/* Verdict */}
                <div
                  className={`rounded-lg p-4 mb-4 ${
                    profit >= 0 ? "bg-emerald-100" : "bg-red-100"
                  }`}
                >
                  <p
                    className={`text-2xl font-black ${
                      profit >= 0 ? "text-emerald-700" : "text-red-600"
                    }`}
                  >
                    {profit >= 0 ? "PROFITABLE" : "LOSING"} TRADE-UP
                  </p>
                  <p
                    className={`text-sm font-semibold mt-1 ${
                      profit >= 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    Expected {profit >= 0 ? "profit" : "loss"}: {profit >= 0 ? "+" : ""}
                    ${profit.toFixed(2)} ({profitPct >= 0 ? "+" : ""}
                    {profitPct.toFixed(1)}%)
                  </p>
                </div>

                {/* Summary grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  <div className="rounded-lg bg-white dark:bg-gray-950 p-3 text-center border border-gray-200 dark:border-gray-700">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">
                      Input Cost
                    </p>
                    <p className="text-lg font-black text-gray-900 dark:text-white">
                      ${totalInputCost.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white dark:bg-gray-950 p-3 text-center border border-gray-200 dark:border-gray-700">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">
                      Expected Output
                    </p>
                    <p className="text-lg font-black text-gray-900 dark:text-white">
                      ${expectedValue.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white dark:bg-gray-950 p-3 text-center border border-gray-200 dark:border-gray-700">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">
                      Win Chance
                    </p>
                    <p
                      className={`text-lg font-black ${
                        winChance >= 50 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {winChance.toFixed(0)}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-white dark:bg-gray-950 p-3 text-center border border-gray-200 dark:border-gray-700">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">
                      Output Float
                    </p>
                    <p className="text-lg font-black font-mono text-gray-900 dark:text-white">
                      {avgInputFloat.toFixed(4)}
                    </p>
                  </div>
                </div>

                {/* Outcome breakdown */}
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase mb-3">
                  Possible Outcomes ({possibleOutcomes.length})
                  <span
                    className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor:
                        (outputRarityVal
                          ? RARITY_COLORS[outputRarityVal]
                          : "#888") + "20",
                      color: outputRarityVal
                        ? RARITY_COLORS[outputRarityVal]
                        : "#888",
                    }}
                  >
                    {outputRarityVal}
                  </span>
                </h3>
                <div className="space-y-2">
                  {possibleOutcomes.map((outcome) => {
                    const outcomePrice = getPrice(outcome);
                    const hasLive =
                      livePrices[`${outcome.weapon}|${outcome.skinName}`] !=
                      null;
                    const outProfit = outcomePrice - totalInputCost;
                    const isProfitable = outProfit > 0;
                    return (
                      <div
                        key={outcome.id}
                        className={`flex items-center gap-3 rounded-lg p-3 border ${
                          isProfitable
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        {outcome.image ? (
                          <img
                            src={outcome.image}
                            alt={outcome.fullName}
                            className="h-12 w-12 object-contain flex-shrink-0 rounded"
                          />
                        ) : (
                          <div
                            className="h-10 w-10 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{
                              backgroundColor: outputRarityVal
                                ? RARITY_COLORS[outputRarityVal]
                                : "#888",
                            }}
                          >
                            {outcome.weapon.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {outcome.weapon} | {outcome.skinName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                              ${outcomePrice.toFixed(2)}
                            </span>
                            {hasLive && (
                              <span className="text-[9px] font-semibold text-emerald-600">
                                LIVE
                              </span>
                            )}
                            <span className="text-[10px] text-gray-400 dark:text-gray-500">
                              ({(probPerOutcome * 100).toFixed(1)}% chance)
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p
                            className={`text-sm font-black ${
                              isProfitable
                                ? "text-emerald-600"
                                : "text-red-500"
                            }`}
                          >
                            {isProfitable ? "+" : ""}$
                            {outProfit.toFixed(2)}
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">
                            {isProfitable ? "profit" : "loss"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Sidebar */}
          <div className="space-y-6">
            {/* EV Summary */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-5 sticky top-20">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4">
                <Calculator className="inline h-4 w-4 mr-1 -mt-0.5" />
                Expected Value
              </h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Input Cost ({"\u00D7"}
                    {selectedInputs.length})
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    ${totalInputCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Expected Output</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    ${expectedValue.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Expected Profit</span>
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      profit >= 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {profit >= 0 ? (
                      <TrendingUp className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" />
                    )}
                    {profit >= 0 ? "+" : ""}${profit.toFixed(2)} (
                    {profitPct >= 0 ? "+" : ""}
                    {profitPct.toFixed(1)}%)
                  </span>
                </div>
              </div>

              {/* Profit bar */}
              {totalInputCost > 0 && (
                <div className="mb-5">
                  <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          Math.max(
                            (expectedValue / (totalInputCost * 2)) * 100,
                            5
                          ),
                          100
                        )}%`,
                        backgroundColor:
                          profit >= 0 ? "#10b981" : "#ef4444",
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                    <span>$0</span>
                    <span className="font-medium">
                      Break-even: ${totalInputCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Float prediction */}
              {selectedInputs.length > 0 && (
                <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-3 mb-5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Target className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Predicted Output Float
                    </span>
                  </div>
                  <p className="text-lg font-bold font-mono text-gray-900 dark:text-white">
                    {avgInputFloat.toFixed(6)}
                  </p>
                </div>
              )}

              {/* Win probability */}
              {isReady && possibleOutcomes.length > 0 && (
                <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-3 mb-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Win Chance
                    </span>
                    <span
                      className={`text-sm font-black ${
                        winChance >= 50 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {winChance.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${winChance}%`,
                        backgroundColor:
                          winChance >= 50 ? "#10b981" : "#ef4444",
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                    {profitableCount} of {possibleOutcomes.length} outcomes beat
                    your ${totalInputCost.toFixed(2)} input
                  </p>
                </div>
              )}

              {!isReady && (
                <p className="text-xs text-amber-600 font-medium text-center">
                  Select {10 - selectedInputs.length} more skin
                  {10 - selectedInputs.length !== 1 ? "s" : ""} to see full
                  results
                </p>
              )}

              {/* Affiliate CTA */}
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
                <a
                  href="/go/cs2/skinport?from=trade-up"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors"
                  style={{ backgroundColor: "#eb4b98" }}
                >
                  Buy Skins on Skinport{" "}
                  <ExternalLink className="h-3 w-3" />
                </a>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2">
                  Affiliate link
                </p>
              </div>
            </div>

            {/* Possible outcomes preview (before 10 selected) */}
            {!isReady && possibleOutcomes.length > 0 && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-5">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4">
                  Possible Outcomes
                  <span
                    className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor:
                        (outputRarityVal
                          ? RARITY_COLORS[outputRarityVal]
                          : "#888") + "20",
                      color: outputRarityVal
                        ? RARITY_COLORS[outputRarityVal]
                        : "#888",
                    }}
                  >
                    {outputRarityVal}
                  </span>
                </h2>
                <div className="space-y-2">
                  {possibleOutcomes.map((outcome) => {
                    const outcomePrice = getPrice(outcome);
                    const hasLive =
                      livePrices[`${outcome.weapon}|${outcome.skinName}`] !=
                      null;
                    return (
                      <div
                        key={outcome.id}
                        className="flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-900 p-3"
                      >
                        {outcome.image ? (
                          <img
                            src={outcome.image}
                            alt={outcome.fullName}
                            className="h-10 w-10 object-contain flex-shrink-0 rounded"
                          />
                        ) : (
                          <div
                            className="h-8 w-8 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{
                              backgroundColor: outputRarityVal
                                ? RARITY_COLORS[outputRarityVal]
                                : "#888",
                            }}
                          >
                            {outcome.weapon.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {outcome.weapon} | {outcome.skinName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-semibold text-gray-900 dark:text-white">
                              ${outcomePrice.toFixed(2)}
                            </span>
                            {hasLive && (
                              <span className="text-[9px] font-semibold text-emerald-600">
                                LIVE
                              </span>
                            )}
                            <span className="text-[10px] text-gray-400 dark:text-gray-500">
                              ({(probPerOutcome * 100).toFixed(1)}% chance)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Key insights */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-5">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3">
                Key Insights
              </h2>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <p>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    Float formula:
                  </span>{" "}
                  Output float = avg input float {"\u00D7"} (max - min) + min of
                  output skin range.
                </p>
                <p>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    Knives craftable:
                  </span>{" "}
                  Since Oct 2025, knives and gloves can appear as trade-up
                  outcomes.
                </p>
                <p>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">EV tip:</span>{" "}
                  Positive EV trade-ups are rare. Mix collections strategically
                  to shift probabilities.
                </p>
                {isLive && (
                  <p className="text-emerald-600 font-medium">
                    Prices are live from Skinport. Updated every 15 minutes.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AffiliateDisclosure />
    </div>
  );
}
