"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Star,
  ArrowUpDown,
  ChevronLeft,
  Info,
  Filter,
} from "lucide-react";

/* ── Mock skin data (would come from PriceEmpire API in production) ── */
const SKINS = [
  { id: "1", name: "AK-47 | Asiimov", rarity: "Covert", wear: "Field-Tested", prices: { steam: 82.50, csfloat: 76.20, skinport: 74.99, buff163: 71.50, dmarket: 77.30 }, trend: 5.2, spark: [68, 69.5, 70, 71, 72, 71.5, 71.5] },
  { id: "2", name: "AWP | Dragon Lore", rarity: "Covert", wear: "Field-Tested", prices: { steam: 4250, csfloat: 3980, skinport: 3850, buff163: 3720, dmarket: 4100 }, trend: -2.1, spark: [3800, 3750, 3700, 3680, 3710, 3730, 3720] },
  { id: "3", name: "M4A4 | Howl", rarity: "Contraband", wear: "Field-Tested", prices: { steam: 6800, csfloat: 6500, skinport: 6350, buff163: 6100, dmarket: 6700 }, trend: 8.4, spark: [5700, 5800, 5900, 6000, 6050, 6080, 6100] },
  { id: "4", name: "Butterfly Knife | Fade", rarity: "Covert", wear: "Factory New", prices: { steam: 2100, csfloat: 1950, skinport: 1920, buff163: 1850, dmarket: 1980 }, trend: 3.7, spark: [1790, 1800, 1810, 1830, 1840, 1845, 1850] },
  { id: "5", name: "Karambit | Doppler (Phase 2)", rarity: "Covert", wear: "Factory New", prices: { steam: 1450, csfloat: 1340, skinport: 1310, buff163: 1280, dmarket: 1370 }, trend: 1.2, spark: [1270, 1265, 1275, 1280, 1285, 1278, 1280] },
  { id: "6", name: "Glock-18 | Fade", rarity: "Restricted", wear: "Factory New", prices: { steam: 1350, csfloat: 1280, skinport: 1250, buff163: 1190, dmarket: 1300 }, trend: -0.8, spark: [1200, 1210, 1195, 1205, 1200, 1195, 1190] },
  { id: "7", name: "AWP | Gungnir", rarity: "Covert", wear: "Factory New", prices: { steam: 8500, csfloat: 8100, skinport: 7900, buff163: 7600, dmarket: 8200 }, trend: 12.3, spark: [6800, 6900, 7000, 7200, 7350, 7500, 7600] },
  { id: "8", name: "M4A1-S | Printstream", rarity: "Covert", wear: "Factory New", prices: { steam: 155, csfloat: 142, skinport: 138, buff163: 132, dmarket: 145 }, trend: -3.5, spark: [138, 136, 135, 134, 133, 132, 132] },
  { id: "9", name: "Desert Eagle | Blaze", rarity: "Restricted", wear: "Factory New", prices: { steam: 480, csfloat: 445, skinport: 435, buff163: 415, dmarket: 460 }, trend: 6.1, spark: [390, 395, 400, 405, 410, 412, 415] },
  { id: "10", name: "AK-47 | Fire Serpent", rarity: "Covert", wear: "Field-Tested", prices: { steam: 920, csfloat: 860, skinport: 840, buff163: 810, dmarket: 880 }, trend: 2.4, spark: [790, 795, 800, 805, 808, 810, 810] },
  { id: "11", name: "Sport Gloves | Pandora's Box", rarity: "Extraordinary", wear: "Field-Tested", prices: { steam: 5200, csfloat: 4900, skinport: 4750, buff163: 4600, dmarket: 5000 }, trend: 4.8, spark: [4400, 4420, 4450, 4500, 4550, 4580, 4600] },
  { id: "12", name: "USP-S | Kill Confirmed", rarity: "Covert", wear: "Factory New", prices: { steam: 88, csfloat: 81, skinport: 78.50, buff163: 74, dmarket: 83 }, trend: -1.2, spark: [75, 75.5, 74.5, 74, 74.2, 74, 74] },
  { id: "13", name: "AK-47 | Case Hardened", rarity: "Classified", wear: "Field-Tested", prices: { steam: 155, csfloat: 142, skinport: 138, buff163: 125, dmarket: 145 }, trend: 3.8, spark: [118, 120, 121, 122, 124, 125, 125] },
  { id: "14", name: "M9 Bayonet | Crimson Web", rarity: "Covert", wear: "Minimal Wear", prices: { steam: 2200, csfloat: 2050, skinport: 1980, buff163: 1850, dmarket: 2100 }, trend: 5.6, spark: [1750, 1770, 1790, 1810, 1830, 1845, 1850] },
  { id: "15", name: "AK-47 | Redline", rarity: "Classified", wear: "Field-Tested", prices: { steam: 18.50, csfloat: 15.80, skinport: 14.90, buff163: 13.50, dmarket: 16.20 }, trend: -0.5, spark: [13.6, 13.5, 13.4, 13.5, 13.6, 13.5, 13.5] },
  { id: "16", name: "AWP | Asiimov", rarity: "Covert", wear: "Field-Tested", prices: { steam: 35.50, csfloat: 32, skinport: 30.50, buff163: 28, dmarket: 33 }, trend: 1.8, spark: [27.5, 27.6, 27.8, 28, 28, 27.9, 28] },
  { id: "17", name: "AWP | Wildfire", rarity: "Covert", wear: "Factory New", prices: { steam: 92, csfloat: 85, skinport: 82, buff163: 78, dmarket: 87 }, trend: -2.3, spark: [80, 79, 79.5, 78.5, 78, 78, 78] },
  { id: "18", name: "M4A1-S | Printstream", rarity: "Covert", wear: "Minimal Wear", prices: { steam: 115, csfloat: 105, skinport: 102, buff163: 98, dmarket: 108 }, trend: -1.5, spark: [100, 99, 99, 98, 98.5, 98, 98] },
  { id: "19", name: "Karambit | Gamma Doppler", rarity: "Covert", wear: "Factory New", prices: { steam: 1680, csfloat: 1550, skinport: 1520, buff163: 1480, dmarket: 1580 }, trend: 2.9, spark: [1440, 1450, 1460, 1470, 1475, 1480, 1480] },
  { id: "20", name: "Butterfly Knife | Doppler", rarity: "Covert", wear: "Factory New", prices: { steam: 1850, csfloat: 1720, skinport: 1680, buff163: 1620, dmarket: 1750 }, trend: 4.1, spark: [1560, 1570, 1580, 1590, 1600, 1615, 1620] },
  { id: "21", name: "AWP | Lightning Strike", rarity: "Classified", wear: "Factory New", prices: { steam: 185, csfloat: 168, skinport: 162, buff163: 155, dmarket: 172 }, trend: 7.2, spark: [145, 147, 149, 150, 152, 154, 155] },
  { id: "22", name: "M4A4 | Temukau", rarity: "Classified", wear: "Factory New", prices: { steam: 32, csfloat: 28.50, skinport: 27, buff163: 25, dmarket: 29 }, trend: 0.8, spark: [25, 24.8, 25, 25.2, 25, 25, 25] },
  { id: "23", name: "AWP | Fade", rarity: "Covert", wear: "Factory New", prices: { steam: 1250, csfloat: 1150, skinport: 1120, buff163: 1080, dmarket: 1180 }, trend: 9.5, spark: [990, 1000, 1020, 1040, 1060, 1075, 1080] },
  { id: "24", name: "AK-47 | Vulcan", rarity: "Covert", wear: "Factory New", prices: { steam: 340, csfloat: 315, skinport: 305, buff163: 290, dmarket: 320 }, trend: 3.2, spark: [280, 282, 284, 286, 288, 289, 290] },
  { id: "25", name: "M4A1-S | Hot Rod", rarity: "Classified", wear: "Factory New", prices: { steam: 220, csfloat: 200, skinport: 195, buff163: 185, dmarket: 205 }, trend: 1.5, spark: [182, 183, 183, 184, 184, 185, 185] },
  { id: "26", name: "P250 | See Ya Later", rarity: "Covert", wear: "Factory New", prices: { steam: 52, csfloat: 46, skinport: 44, buff163: 41, dmarket: 48 }, trend: -4.2, spark: [43, 42.5, 42, 41.8, 41.5, 41.2, 41] },
  { id: "27", name: "Moto Gloves | Spearmint", rarity: "Extraordinary", wear: "Field-Tested", prices: { steam: 2800, csfloat: 2600, skinport: 2520, buff163: 2450, dmarket: 2680 }, trend: 3.4, spark: [2380, 2390, 2400, 2420, 2430, 2445, 2450] },
  { id: "28", name: "Butterfly Knife | Marble Fade", rarity: "Covert", wear: "Factory New", prices: { steam: 2650, csfloat: 2480, skinport: 2420, buff163: 2350, dmarket: 2520 }, trend: 5.8, spark: [2220, 2250, 2280, 2300, 2320, 2340, 2350] },
  { id: "29", name: "AWP | Containment Breach", rarity: "Covert", wear: "Factory New", prices: { steam: 62, csfloat: 55, skinport: 53, buff163: 50, dmarket: 57 }, trend: -1.8, spark: [51, 51, 50.5, 50.5, 50.2, 50, 50] },
  { id: "30", name: "AK-47 | Neon Rider", rarity: "Covert", wear: "Factory New", prices: { steam: 42, csfloat: 38, skinport: 36.50, buff163: 34, dmarket: 39 }, trend: 0.3, spark: [34, 34, 34.1, 34, 34, 34, 34] },
  { id: "31", name: "USP-S | Printstream", rarity: "Covert", wear: "Factory New", prices: { steam: 45, csfloat: 40, skinport: 38, buff163: 35.50, dmarket: 41 }, trend: -2.8, spark: [36.5, 36.2, 36, 35.8, 35.6, 35.5, 35.5] },
  { id: "32", name: "Specialist Gloves | Fade", rarity: "Extraordinary", wear: "Minimal Wear", prices: { steam: 3200, csfloat: 3000, skinport: 2920, buff163: 2800, dmarket: 3050 }, trend: 6.7, spark: [2620, 2650, 2680, 2720, 2750, 2780, 2800] },
  { id: "33", name: "AK-47 | Nightwish", rarity: "Covert", wear: "Factory New", prices: { steam: 48, csfloat: 43, skinport: 41, buff163: 38, dmarket: 44 }, trend: -3.1, spark: [39.5, 39.2, 39, 38.5, 38.2, 38, 38] },
  { id: "34", name: "AWP | Chromatic Aberration", rarity: "Covert", wear: "Factory New", prices: { steam: 38, csfloat: 34, skinport: 32, buff163: 30, dmarket: 35 }, trend: 1.2, spark: [29.5, 29.8, 30, 30, 30, 30, 30] },
  { id: "35", name: "M4A4 | The Emperor", rarity: "Covert", wear: "Factory New", prices: { steam: 105, csfloat: 95, skinport: 92, buff163: 88, dmarket: 97 }, trend: 2.1, spark: [86, 86.5, 87, 87.5, 87.8, 88, 88] },
  { id: "36", name: "Desert Eagle | Code Red", rarity: "Covert", wear: "Factory New", prices: { steam: 52, csfloat: 46, skinport: 44.50, buff163: 42, dmarket: 48 }, trend: 0.5, spark: [42, 42, 41.8, 42, 42, 42, 42] },
  { id: "37", name: "AK-47 | Head Shot", rarity: "Covert", wear: "Factory New", prices: { steam: 55, csfloat: 50, skinport: 48, buff163: 45, dmarket: 51 }, trend: -1.5, spark: [46, 45.5, 45.5, 45.2, 45, 45, 45] },
  { id: "38", name: "Talon Knife | Fade", rarity: "Covert", wear: "Factory New", prices: { steam: 1150, csfloat: 1060, skinport: 1030, buff163: 995, dmarket: 1080 }, trend: 4.3, spark: [960, 965, 970, 978, 985, 990, 995] },
];

const WEARS = ["All", "Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"] as const;

const MARKETPLACES = [
  { key: "steam" as const, name: "Steam", color: "#1b2838", fee: "15%", dealId: "steam" },
  { key: "csfloat" as const, name: "CSFloat", color: "#4f8df0", fee: "2%", dealId: "csfloat" },
  { key: "skinport" as const, name: "Skinport", color: "#eb4b98", fee: "5%", dealId: "skinport" },
  { key: "buff163" as const, name: "Buff163", color: "#ff6b35", fee: "2.5%", dealId: "buff163" },
  { key: "dmarket" as const, name: "DMarket", color: "#00c9a7", fee: "3%", dealId: "dmarket" },
];

type MarketKey = "steam" | "csfloat" | "skinport" | "buff163" | "dmarket";
type SortKey = "name" | "cheapest" | "trend";

const RARITY_COLORS: Record<string, string> = {
  Consumer: "#b0c3d9", Industrial: "#5e98d9", "Mil-Spec": "#4b69ff",
  Restricted: "#8847ff", Classified: "#d32ce6", Covert: "#eb4b4b",
  Contraband: "#e4ae39", Extraordinary: "#e4ae39",
};

/* ── Sparkline component ── */
function Sparkline({ data, trend }: { data: number[]; trend: number }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 60;
  const h = 20;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  const color = trend >= 0 ? "#10b981" : "#ef4444";
  return (
    <svg width={w} height={h} className="inline-block">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CS2PricesPage() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("cheapest");
  const [wearFilter, setWearFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    let results = SKINS.filter((s) => {
      const matchesQuery = s.name.toLowerCase().includes(query.toLowerCase());
      const matchesWear = wearFilter === "All" || s.wear === wearFilter;
      return matchesQuery && matchesWear;
    });

    results.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "trend") return b.trend - a.trend;
      const aMin = Math.min(...Object.values(a.prices));
      const bMin = Math.min(...Object.values(b.prices));
      return aMin - bMin;
    });

    return results;
  }, [query, sortBy, wearFilter]);

  const getCheapest = (prices: Record<MarketKey, number>): MarketKey => {
    let best: MarketKey = "steam";
    let min = Infinity;
    for (const [k, v] of Object.entries(prices)) {
      if (v < min) { min = v; best = k as MarketKey; }
    }
    return best;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 py-10">
        <div className="container-main">
          <Link href="/cs2" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ChevronLeft className="h-4 w-4" /> CS2 Skins Hub
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Skin Price Tracker</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Compare CS2 skin prices across all major marketplaces. {SKINS.length} skins tracked across {MARKETPLACES.length} platforms.
          </p>
        </div>
      </section>

      {/* Search + Sort + Wear Filter */}
      <section className="border-b border-gray-100 bg-white sticky top-16 z-30">
        <div className="container-main py-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search skins (e.g. AK-47 Asiimov, Butterfly Fade...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={wearFilter}
              onChange={(e) => setWearFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-brand-300 focus:outline-none"
            >
              {WEARS.map((w) => (
                <option key={w} value={w}>{w === "All" ? "All Wears" : w}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-brand-300 focus:outline-none"
            >
              <option value="cheapest">Cheapest First</option>
              <option value="name">Name A-Z</option>
              <option value="trend">Trending Up</option>
            </select>
          </div>
        </div>
      </section>

      {/* Marketplace legend */}
      <section className="border-b border-gray-50 bg-gray-50/50">
        <div className="container-main py-3 flex flex-wrap items-center gap-4">
          {MARKETPLACES.map((mp) => (
            <a
              key={mp.key}
              href={`/go/cs2/${mp.dealId}?from=prices-legend`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs hover:opacity-75 transition-opacity"
            >
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: mp.color }} />
              <span className="font-medium text-gray-700">{mp.name}</span>
              <span className="text-gray-400">(fee: {mp.fee})</span>
            </a>
          ))}
          <div className="flex items-center gap-1 text-[10px] text-gray-400 ml-auto">
            <Info className="h-3 w-3" />
            <span>Prices updated periodically</span>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-6">
        <div className="container-main">
          <p className="text-sm text-gray-500 mb-4">{filtered.length} skins found</p>

          <div className="space-y-3">
            {filtered.map((skin) => {
              const cheapestKey = getCheapest(skin.prices);
              const cheapestMarket = MARKETPLACES.find((m) => m.key === cheapestKey);
              const cheapestPrice = skin.prices[cheapestKey];
              const steamPrice = skin.prices.steam;
              const savings = steamPrice - cheapestPrice;

              return (
                <div
                  key={skin.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Skin info */}
                    <div className="flex items-center gap-4 lg:w-72 flex-shrink-0">
                      <div
                        className="h-14 w-14 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: RARITY_COLORS[skin.rarity] || "#666" }}
                      >
                        {skin.name.split(" | ")[0].charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{skin.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className="inline-block rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                            style={{ backgroundColor: RARITY_COLORS[skin.rarity] || "#666" }}
                          >
                            {skin.rarity}
                          </span>
                          <span className="text-xs text-gray-500">{skin.wear}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price comparison */}
                    <div className="flex-1 grid grid-cols-5 gap-2">
                      {MARKETPLACES.map((mp) => {
                        const price = skin.prices[mp.key];
                        const isCheapest = mp.key === cheapestKey;
                        return (
                          <a
                            key={mp.key}
                            href={`/go/cs2/${mp.dealId}?from=prices`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`rounded-lg px-3 py-2 text-center transition-colors ${
                              isCheapest
                                ? "bg-emerald-50 border border-emerald-200 hover:bg-emerald-100"
                                : "bg-gray-50 hover:bg-gray-100"
                            }`}
                          >
                            <p className="text-[10px] font-medium text-gray-500 mb-1 hidden sm:block">{mp.name}</p>
                            <p className={`text-sm font-bold ${isCheapest ? "text-emerald-700" : "text-gray-900"}`}>
                              ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            {isCheapest && (
                              <p className="text-[9px] font-semibold text-emerald-600 mt-0.5">BEST</p>
                            )}
                          </a>
                        );
                      })}
                    </div>

                    {/* Trend + Sparkline + CTA */}
                    <div className="flex items-center gap-3 lg:w-56 flex-shrink-0 justify-end">
                      <Sparkline data={skin.spark} trend={skin.trend} />
                      <div className={`flex items-center gap-1 text-sm font-semibold ${skin.trend >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {skin.trend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        {skin.trend >= 0 ? "+" : ""}{skin.trend}%
                      </div>
                      {savings > 0.01 && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 hidden sm:block">
                          Save ${savings.toFixed(2)}
                        </span>
                      )}
                      <a
                        href={`/go/cs2/${cheapestMarket?.dealId || "csfloat"}?from=prices-buy`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition-colors"
                      >
                        Buy <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
              <p className="text-gray-500">No skins match your search. Try a different name or wear condition.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="border-t border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50 py-10">
        <div className="container-main text-center">
          <Star className="h-8 w-8 text-orange-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900">Get Price Drop Alerts</h2>
          <p className="text-sm text-gray-600 mt-2 mb-6 max-w-md mx-auto">
            Sign up to get notified when your favorite skins hit their lowest price across all marketplaces.
          </p>
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            Sign Up Free
          </Link>
        </div>
      </section>

      {/* Affiliate disclosure */}
      <div className="border-t border-gray-100 bg-gray-50/70">
        <div className="container-main py-4">
          <p className="text-[11px] text-gray-400 leading-relaxed text-center">
            <span className="font-semibold text-gray-500">Affiliate Disclosure:</span>{" "}
            Some links on this page are affiliate links. LootBoxes.com may earn a commission
            if you make a purchase, at no extra cost to you. We only recommend marketplaces we trust.
          </p>
        </div>
      </div>
    </div>
  );
}
