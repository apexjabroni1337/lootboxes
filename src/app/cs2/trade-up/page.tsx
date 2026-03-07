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

function nextRarity(r: Rarity): string {
  const idx = RARITIES.indexOf(r);
  if (idx < RARITIES.length - 1) return RARITIES[idx + 1];
  return "Covert";
}

/* ── Collection & skin database ── */
interface Skin {
  weapon: string;
  name: string;
  collection: string;
  rarity: Rarity;
  price: number; // Fallback price — overridden by live data
  minFloat: number;
  maxFloat: number;
  livePrice?: number; // Live price from PriceEmpire
}

const COLLECTIONS: Record<string, Skin[]> = {
  "Recoil Collection": [
    { weapon: "MAC-10", name: "Monkeyflage", collection: "Recoil Collection", rarity: "Mil-Spec", price: 0.12, minFloat: 0, maxFloat: 0.65 },
    { weapon: "SG 553", name: "Dragon Tech", collection: "Recoil Collection", rarity: "Mil-Spec", price: 0.15, minFloat: 0, maxFloat: 0.5 },
    { weapon: "P250", name: "Visions", collection: "Recoil Collection", rarity: "Mil-Spec", price: 0.10, minFloat: 0, maxFloat: 0.44 },
    { weapon: "Galil AR", name: "Connexion", collection: "Recoil Collection", rarity: "Mil-Spec", price: 0.14, minFloat: 0, maxFloat: 0.7 },
    { weapon: "UMP-45", name: "Roadblock", collection: "Recoil Collection", rarity: "Restricted", price: 0.45, minFloat: 0, maxFloat: 0.55 },
    { weapon: "USP-S", name: "Printstream", collection: "Recoil Collection", rarity: "Restricted", price: 5.20, minFloat: 0, maxFloat: 0.7 },
    { weapon: "P2000", name: "Woven", collection: "Recoil Collection", rarity: "Restricted", price: 0.80, minFloat: 0, maxFloat: 0.44 },
    { weapon: "AK-47", name: "Ice Coaled", collection: "Recoil Collection", rarity: "Classified", price: 18.50, minFloat: 0, maxFloat: 0.7 },
    { weapon: "M4A1-S", name: "Printstream", collection: "Recoil Collection", rarity: "Covert", price: 142.00, minFloat: 0, maxFloat: 0.7 },
    { weapon: "Famas", name: "Rapid Eye Movement", collection: "Recoil Collection", rarity: "Classified", price: 6.80, minFloat: 0, maxFloat: 0.55 },
  ],
  "Revolution Collection": [
    { weapon: "MAG-7", name: "Insomnia", collection: "Revolution Collection", rarity: "Mil-Spec", price: 0.10, minFloat: 0, maxFloat: 0.5 },
    { weapon: "MP5-SD", name: "Liquidation", collection: "Revolution Collection", rarity: "Mil-Spec", price: 0.08, minFloat: 0, maxFloat: 0.55 },
    { weapon: "XM1014", name: "Watchdog", collection: "Revolution Collection", rarity: "Mil-Spec", price: 0.12, minFloat: 0, maxFloat: 0.65 },
    { weapon: "PP-Bizon", name: "Lake", collection: "Revolution Collection", rarity: "Mil-Spec", price: 0.09, minFloat: 0, maxFloat: 0.44 },
    { weapon: "P250", name: "Re.built", collection: "Revolution Collection", rarity: "Restricted", price: 0.55, minFloat: 0, maxFloat: 0.55 },
    { weapon: "Glock-18", name: "Umbral Rabbit", collection: "Revolution Collection", rarity: "Restricted", price: 1.80, minFloat: 0, maxFloat: 0.7 },
    { weapon: "M4A4", name: "Temukau", collection: "Revolution Collection", rarity: "Classified", price: 25.00, minFloat: 0, maxFloat: 0.65 },
    { weapon: "AK-47", name: "Head Shot", collection: "Revolution Collection", rarity: "Covert", price: 45.00, minFloat: 0, maxFloat: 0.7 },
    { weapon: "MAC-10", name: "Sakkaku", collection: "Revolution Collection", rarity: "Restricted", price: 0.40, minFloat: 0, maxFloat: 0.5 },
    { weapon: "UMP-45", name: "Wild Child", collection: "Revolution Collection", rarity: "Classified", price: 4.50, minFloat: 0, maxFloat: 0.55 },
  ],
  "Dreams & Nightmares": [
    { weapon: "MAG-7", name: "Foresight", collection: "Dreams & Nightmares", rarity: "Mil-Spec", price: 0.08, minFloat: 0, maxFloat: 0.5 },
    { weapon: "PP-Bizon", name: "Space Cat", collection: "Dreams & Nightmares", rarity: "Mil-Spec", price: 0.22, minFloat: 0, maxFloat: 0.65 },
    { weapon: "SCAR-20", name: "Poultrygeist", collection: "Dreams & Nightmares", rarity: "Mil-Spec", price: 0.06, minFloat: 0, maxFloat: 0.7 },
    { weapon: "Dual Berettas", name: "Melondrama", collection: "Dreams & Nightmares", rarity: "Mil-Spec", price: 0.11, minFloat: 0, maxFloat: 0.55 },
    { weapon: "Five-SeveN", name: "Scrawl", collection: "Dreams & Nightmares", rarity: "Restricted", price: 0.65, minFloat: 0, maxFloat: 0.44 },
    { weapon: "MP9", name: "Starlight Protector", collection: "Dreams & Nightmares", rarity: "Restricted", price: 3.50, minFloat: 0, maxFloat: 0.7 },
    { weapon: "USP-S", name: "Ticket to Hell", collection: "Dreams & Nightmares", rarity: "Classified", price: 12.00, minFloat: 0, maxFloat: 0.55 },
    { weapon: "AK-47", name: "Nightwish", collection: "Dreams & Nightmares", rarity: "Covert", price: 38.00, minFloat: 0, maxFloat: 0.65 },
    { weapon: "MP7", name: "Abyssal Apparition", collection: "Dreams & Nightmares", rarity: "Classified", price: 3.80, minFloat: 0, maxFloat: 0.5 },
    { weapon: "FAMAS", name: "Dark Water", collection: "Dreams & Nightmares", rarity: "Restricted", price: 0.90, minFloat: 0, maxFloat: 0.55 },
  ],
  "Kilowatt Collection": [
    { weapon: "Nova", name: "Windblown", collection: "Kilowatt Collection", rarity: "Mil-Spec", price: 0.10, minFloat: 0, maxFloat: 0.55 },
    { weapon: "Tec-9", name: "Slag", collection: "Kilowatt Collection", rarity: "Mil-Spec", price: 0.12, minFloat: 0, maxFloat: 0.5 },
    { weapon: "MP7", name: "Just Smile", collection: "Kilowatt Collection", rarity: "Mil-Spec", price: 0.08, minFloat: 0, maxFloat: 0.7 },
    { weapon: "XM1014", name: "Irezumi", collection: "Kilowatt Collection", rarity: "Mil-Spec", price: 0.14, minFloat: 0, maxFloat: 0.44 },
    { weapon: "Five-SeveN", name: "Hybrid", collection: "Kilowatt Collection", rarity: "Restricted", price: 0.70, minFloat: 0, maxFloat: 0.55 },
    { weapon: "M4A4", name: "Etch Lord", collection: "Kilowatt Collection", rarity: "Restricted", price: 2.20, minFloat: 0, maxFloat: 0.65 },
    { weapon: "Zeus x27", name: "Olympus", collection: "Kilowatt Collection", rarity: "Classified", price: 22.00, minFloat: 0, maxFloat: 0.7 },
    { weapon: "AWP", name: "Chrome Cannon", collection: "Kilowatt Collection", rarity: "Covert", price: 85.00, minFloat: 0, maxFloat: 0.7 },
    { weapon: "USP-S", name: "Black Lotus", collection: "Kilowatt Collection", rarity: "Covert", price: 165.00, minFloat: 0, maxFloat: 0.65 },
    { weapon: "Glock-18", name: "Block-18", collection: "Kilowatt Collection", rarity: "Classified", price: 15.50, minFloat: 0, maxFloat: 0.55 },
  ],
  "Operation Bravo": [
    { weapon: "MAC-10", name: "Ultraviolet", collection: "Operation Bravo", rarity: "Mil-Spec", price: 0.35, minFloat: 0.06, maxFloat: 0.8 },
    { weapon: "SG 553", name: "Wave Spray", collection: "Operation Bravo", rarity: "Mil-Spec", price: 0.20, minFloat: 0, maxFloat: 0.5 },
    { weapon: "Nova", name: "Tempest", collection: "Operation Bravo", rarity: "Mil-Spec", price: 0.28, minFloat: 0, maxFloat: 0.65 },
    { weapon: "P90", name: "Emerald Dragon", collection: "Operation Bravo", rarity: "Restricted", price: 4.50, minFloat: 0, maxFloat: 0.7 },
    { weapon: "Dual Berettas", name: "Black Limba", collection: "Operation Bravo", rarity: "Restricted", price: 1.20, minFloat: 0.06, maxFloat: 0.8 },
    { weapon: "Desert Eagle", name: "Golden Koi", collection: "Operation Bravo", rarity: "Classified", price: 42.00, minFloat: 0, maxFloat: 0.08 },
    { weapon: "AK-47", name: "Fire Serpent", collection: "Operation Bravo", rarity: "Covert", price: 860.00, minFloat: 0.06, maxFloat: 0.76 },
    { weapon: "AWP", name: "Lightning Strike", collection: "Operation Bravo", rarity: "Classified", price: 145.00, minFloat: 0, maxFloat: 0.08 },
  ],
  "Operation Phoenix": [
    { weapon: "Negev", name: "Terrain", collection: "Operation Phoenix", rarity: "Mil-Spec", price: 0.08, minFloat: 0, maxFloat: 0.65 },
    { weapon: "SG 553", name: "Pulse", collection: "Operation Phoenix", rarity: "Mil-Spec", price: 0.10, minFloat: 0, maxFloat: 0.5 },
    { weapon: "Tec-9", name: "Sandstorm", collection: "Operation Phoenix", rarity: "Mil-Spec", price: 0.42, minFloat: 0, maxFloat: 0.7 },
    { weapon: "UMP-45", name: "Corporal", collection: "Operation Phoenix", rarity: "Mil-Spec", price: 0.15, minFloat: 0, maxFloat: 0.55 },
    { weapon: "FAMAS", name: "Sergeant", collection: "Operation Phoenix", rarity: "Restricted", price: 0.55, minFloat: 0, maxFloat: 0.65 },
    { weapon: "P90", name: "Trigon", collection: "Operation Phoenix", rarity: "Restricted", price: 0.85, minFloat: 0, maxFloat: 0.7 },
    { weapon: "AUG", name: "Chameleon", collection: "Operation Phoenix", rarity: "Classified", price: 3.50, minFloat: 0, maxFloat: 0.5 },
    { weapon: "AK-47", name: "Asiimov", collection: "Operation Phoenix", rarity: "Covert", price: 76.00, minFloat: 0.05, maxFloat: 0.7 },
  ],
};

const COLLECTION_NAMES = Object.keys(COLLECTIONS);

export default function TradeUpPage() {
  const [selectedCollection, setSelectedCollection] = useState(COLLECTION_NAMES[0]);
  const [inputRarity, setInputRarity] = useState<Rarity>("Mil-Spec");
  const [selectedInputs, setSelectedInputs] = useState<Skin[]>([]);
  const [skinSearch, setSkinSearch] = useState("");
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [pricesLoading, setPricesLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);

  /* Fetch live prices for the current collection */
  const fetchLivePrices = useCallback(async (collectionName: string) => {
    const skins = COLLECTIONS[collectionName];
    if (!skins) return;

    setPricesLoading(true);
    try {
      const names = skins
        .map((s) => `${s.weapon}|${s.name}`)
        .filter((v, i, a) => a.indexOf(v) === i) // dedupe
        .join(",");

      const res = await fetch(`/api/cs2/skin-lookup?names=${encodeURIComponent(names)}`);
      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      const priceMap: Record<string, number> = {};

      for (const [key, value] of Object.entries(data.results)) {
        const v = value as { avgPrice: number };
        if (v.avgPrice > 0) {
          priceMap[key] = v.avgPrice;
        }
      }

      setLivePrices(priceMap);
      setIsLive(Object.keys(priceMap).length > 0);
    } catch {
      console.warn("Failed to fetch live prices for trade-up calculator");
      setIsLive(false);
    } finally {
      setPricesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLivePrices(selectedCollection);
  }, [selectedCollection, fetchLivePrices]);

  /* Helper: get effective price for a skin (live or fallback) */
  const getPrice = (skin: Skin): number => {
    const key = `${skin.weapon}|${skin.name}`;
    return livePrices[key] ?? skin.price;
  };

  /* Available input skins = skins in selected collection at selected rarity */
  const availableSkins = useMemo(() => {
    const skins = COLLECTIONS[selectedCollection]?.filter(
      (s) => s.rarity === inputRarity
    ) || [];
    if (skinSearch) {
      const q = skinSearch.toLowerCase();
      return skins.filter(
        (s) =>
          s.weapon.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      );
    }
    return skins;
  }, [selectedCollection, inputRarity, skinSearch]);

  /* Possible outcomes = next rarity tier skins from the selected collection */
  const outputRarity = nextRarity(inputRarity);
  const possibleOutcomes = useMemo(() => {
    return (
      COLLECTIONS[selectedCollection]?.filter(
        (s) => s.rarity === outputRarity
      ) || []
    );
  }, [selectedCollection, outputRarity]);

  const addSkin = (skin: Skin) => {
    if (selectedInputs.length >= 10) return;
    setSelectedInputs((prev) => [...prev, skin]);
  };

  const removeSkin = (index: number) => {
    setSelectedInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => setSelectedInputs([]);

  /* Calculations — using live prices when available */
  const totalInputCost = selectedInputs.reduce((sum, s) => sum + getPrice(s), 0);
  const avgInputFloat = selectedInputs.length > 0
    ? selectedInputs.reduce((sum, s) => sum + (s.minFloat + s.maxFloat) / 2, 0) / selectedInputs.length
    : 0;

  const probPerOutcome = possibleOutcomes.length > 0 ? 1 / possibleOutcomes.length : 0;
  const expectedValue = possibleOutcomes.reduce(
    (sum, o) => sum + probPerOutcome * getPrice(o),
    0
  );
  const profit = expectedValue - totalInputCost;
  const profitPct = totalInputCost > 0 ? (profit / totalInputCost) * 100 : 0;
  const isReady = selectedInputs.length === 10;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 py-10">
        <div className="container-main">
          <Link href="/cs2" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ChevronLeft className="h-4 w-4" /> CS2 Skins Hub
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
              <Calculator className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Trade-Up Calculator</h1>
            <div className="flex items-center gap-1.5 text-[10px] ml-3">
              {isLive ? (
                <>
                  <Wifi className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-600 font-semibold">LIVE PRICES</span>
                </>
              ) : pricesLoading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                  <span className="text-gray-400">Loading prices...</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-400">Estimated prices</span>
                </>
              )}
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Select 10 input skins, see all possible outcomes with probabilities, and know your expected profit before you commit.
            {isLive && " Prices updated live from 5 marketplaces."}
          </p>
        </div>
      </section>

      <div className="container-main py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Input selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Controls */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Step 1: Choose Collection & Rarity</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Collection</label>
                  <select
                    value={selectedCollection}
                    onChange={(e) => { setSelectedCollection(e.target.value); setSelectedInputs([]); }}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-amber-300 focus:outline-none"
                  >
                    {COLLECTION_NAMES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Input Rarity</label>
                  <select
                    value={inputRarity}
                    onChange={(e) => { setInputRarity(e.target.value as Rarity); setSelectedInputs([]); }}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-amber-300 focus:outline-none"
                  >
                    {RARITIES.slice(0, -1).map((r) => (
                      <option key={r} value={r}>{r} → {nextRarity(r)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Available skins */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Step 2: Select 10 Input Skins</h2>
                <span className="text-xs font-semibold" style={{ color: RARITY_COLORS[inputRarity] }}>
                  {selectedInputs.length}/10 selected
                </span>
              </div>

              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter skins..."
                  value={skinSearch}
                  onChange={(e) => setSkinSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm focus:border-amber-300 focus:outline-none"
                />
              </div>

              {availableSkins.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No {inputRarity} skins in this collection.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableSkins.map((skin, idx) => {
                    const canAdd = selectedInputs.length < 10;
                    const price = getPrice(skin);
                    const hasLive = livePrices[`${skin.weapon}|${skin.name}`] != null;
                    return (
                      <button
                        key={`${skin.weapon}-${skin.name}-${idx}`}
                        onClick={() => addSkin(skin)}
                        disabled={!canAdd}
                        className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                          canAdd
                            ? "border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 cursor-pointer"
                            : "border-gray-100 opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <div
                          className="h-8 w-8 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: RARITY_COLORS[skin.rarity] }}
                        >
                          {skin.weapon.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{skin.weapon} | {skin.name}</p>
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs text-gray-500">${price.toFixed(2)}</p>
                            {hasLive && (
                              <span className="text-[9px] font-semibold text-emerald-600">LIVE</span>
                            )}
                          </div>
                        </div>
                        <Plus className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected inputs */}
            {selectedInputs.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Your 10 Inputs</h2>
                  <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700 font-medium">Clear All</button>
                </div>
                <div className="space-y-1.5">
                  {selectedInputs.map((skin, idx) => (
                    <div key={idx} className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2">
                      <span className="text-xs font-bold text-gray-400 w-5">{idx + 1}.</span>
                      <div
                        className="h-6 w-6 rounded flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{ backgroundColor: RARITY_COLORS[skin.rarity] }}
                      >
                        {skin.weapon.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-700 flex-1 truncate">{skin.weapon} | {skin.name}</span>
                      <span className="text-xs font-medium text-gray-500">${getPrice(skin).toFixed(2)}</span>
                      <button onClick={() => removeSkin(idx)} className="text-gray-400 hover:text-red-500">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {selectedInputs.length < 10 && (
                    <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-400">
                      <Plus className="h-4 w-4" />
                      {10 - selectedInputs.length} more skin{10 - selectedInputs.length !== 1 ? "s" : ""} needed
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Results sidebar */}
          <div className="space-y-6">
            {/* EV Summary */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 sticky top-20">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                <Calculator className="inline h-4 w-4 mr-1 -mt-0.5" />
                Expected Value
              </h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Input Cost ({"\u00D7"}{selectedInputs.length})</span>
                  <span className="font-bold text-gray-900">${totalInputCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Expected Output</span>
                  <span className="font-bold text-gray-900">${expectedValue.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-sm">
                  <span className="text-gray-500">Expected Profit</span>
                  <span className={`font-bold flex items-center gap-1 ${profit >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {profit >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {profit >= 0 ? "+" : ""}${profit.toFixed(2)} ({profitPct >= 0 ? "+" : ""}{profitPct.toFixed(1)}%)
                  </span>
                </div>
              </div>

              {/* Profit bar */}
              {totalInputCost > 0 && (
                <div className="mb-5">
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(Math.max((expectedValue / (totalInputCost * 2)) * 100, 5), 100)}%`,
                        backgroundColor: profit >= 0 ? "#10b981" : "#ef4444",
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                    <span>$0</span>
                    <span className="font-medium">Break-even: ${totalInputCost.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Float prediction */}
              {selectedInputs.length > 0 && (
                <div className="rounded-lg bg-gray-50 p-3 mb-5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Target className="h-3.5 w-3.5 text-gray-500" />
                    <span className="text-xs font-medium text-gray-500">Predicted Output Float</span>
                  </div>
                  <p className="text-lg font-bold font-mono text-gray-900">{avgInputFloat.toFixed(6)}</p>
                </div>
              )}

              {!isReady && (
                <p className="text-xs text-amber-600 font-medium text-center">
                  Select {10 - selectedInputs.length} more skin{10 - selectedInputs.length !== 1 ? "s" : ""} to see full results
                </p>
              )}

              {/* Affiliate CTA */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <a
                  href="/go/cs2/csfloat?from=trade-up"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors"
                  style={{ backgroundColor: "#4f8df0" }}
                >
                  Buy Skins on CSFloat <ExternalLink className="h-3 w-3" />
                </a>
                <p className="text-[10px] text-gray-400 text-center mt-2">Affiliate link</p>
              </div>
            </div>

            {/* Possible outcomes */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                Possible Outcomes
                <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: RARITY_COLORS[outputRarity] + "20", color: RARITY_COLORS[outputRarity] }}>
                  {outputRarity}
                </span>
              </h2>

              {possibleOutcomes.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No outcomes at this rarity tier.</p>
              ) : (
                <div className="space-y-2">
                  {possibleOutcomes.map((outcome, idx) => {
                    const outcomePrice = getPrice(outcome);
                    const hasLive = livePrices[`${outcome.weapon}|${outcome.name}`] != null;
                    return (
                      <div key={idx} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                        <div
                          className="h-8 w-8 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: RARITY_COLORS[outcome.rarity] }}
                        >
                          {outcome.weapon.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{outcome.weapon} | {outcome.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-semibold text-gray-900">${outcomePrice.toFixed(2)}</span>
                            {hasLive && (
                              <span className="text-[9px] font-semibold text-emerald-600">LIVE</span>
                            )}
                            <span className="text-[10px] text-gray-400">({(probPerOutcome * 100).toFixed(1)}% chance)</span>
                          </div>
                        </div>
                        {totalInputCost > 0 && (
                          <span className={`text-xs font-bold ${outcomePrice > totalInputCost ? "text-emerald-600" : "text-red-500"}`}>
                            {outcomePrice > totalInputCost ? "+" : ""}${(outcomePrice - totalInputCost).toFixed(2)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Key insights */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Key Insights</h2>
              <div className="space-y-2 text-xs text-gray-600">
                <p><span className="font-semibold text-gray-800">Float formula:</span> Output float = avg input float {"\u00D7"} (max - min) + min of output skin range.</p>
                <p><span className="font-semibold text-gray-800">Knives craftable:</span> Since Oct 2025, knives and gloves can appear as trade-up outcomes.</p>
                <p><span className="font-semibold text-gray-800">EV tip:</span> Positive EV trade-ups are rare. Mix collections strategically to shift probabilities.</p>
                {isLive && (
                  <p className="text-emerald-600 font-medium">Prices are live from PriceEmpire across 5 marketplaces. Updated every 15 minutes.</p>
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
