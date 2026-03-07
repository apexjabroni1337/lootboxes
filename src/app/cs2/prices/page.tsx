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
} from "lucide-react";

/* ── Mock skin data (would come from PriceEmpire API in production) ── */
const SKINS = [
  { id: "1", name: "AK-47 | Asiimov", collection: "Operation Phoenix", rarity: "Covert", image: null, wear: "Field-Tested", prices: { steam: 82.50, csfloat: 76.20, skinport: 74.99, buff163: 71.50, dmarket: 77.30 }, trend: 5.2 },
  { id: "2", name: "AWP | Dragon Lore", collection: "Cobblestone Collection", rarity: "Covert", image: null, wear: "Field-Tested", prices: { steam: 4250.00, csfloat: 3980.00, skinport: 3850.00, buff163: 3720.00, dmarket: 4100.00 }, trend: -2.1 },
  { id: "3", name: "M4A4 | Howl", collection: "Huntsman Collection", rarity: "Contraband", image: null, wear: "Field-Tested", prices: { steam: 6800.00, csfloat: 6500.00, skinport: 6350.00, buff163: 6100.00, dmarket: 6700.00 }, trend: 8.4 },
  { id: "4", name: "Butterfly Knife | Fade", collection: "Operation Breakout", rarity: "Covert", image: null, wear: "Factory New", prices: { steam: 2100.00, csfloat: 1950.00, skinport: 1920.00, buff163: 1850.00, dmarket: 1980.00 }, trend: 3.7 },
  { id: "5", name: "Karambit | Doppler (Phase 2)", collection: "Chroma Collection", rarity: "Covert", image: null, wear: "Factory New", prices: { steam: 1450.00, csfloat: 1340.00, skinport: 1310.00, buff163: 1280.00, dmarket: 1370.00 }, trend: 1.2 },
  { id: "6", name: "Glock-18 | Fade", collection: "Assault Collection", rarity: "Restricted", image: null, wear: "Factory New", prices: { steam: 1350.00, csfloat: 1280.00, skinport: 1250.00, buff163: 1190.00, dmarket: 1300.00 }, trend: -0.8 },
  { id: "7", name: "AWP | Gungnir", collection: "Norse Collection", rarity: "Covert", image: null, wear: "Factory New", prices: { steam: 8500.00, csfloat: 8100.00, skinport: 7900.00, buff163: 7600.00, dmarket: 8200.00 }, trend: 12.3 },
  { id: "8", name: "M4A1-S | Printstream", collection: "Recoil Collection", rarity: "Covert", image: null, wear: "Factory New", prices: { steam: 155.00, csfloat: 142.00, skinport: 138.00, buff163: 132.00, dmarket: 145.00 }, trend: -3.5 },
  { id: "9", name: "Desert Eagle | Blaze", collection: "Dust Collection", rarity: "Restricted", image: null, wear: "Factory New", prices: { steam: 480.00, csfloat: 445.00, skinport: 435.00, buff163: 415.00, dmarket: 460.00 }, trend: 6.1 },
  { id: "10", name: "AK-47 | Fire Serpent", collection: "Operation Bravo", rarity: "Covert", image: null, wear: "Field-Tested", prices: { steam: 920.00, csfloat: 860.00, skinport: 840.00, buff163: 810.00, dmarket: 880.00 }, trend: 2.4 },
  { id: "11", name: "Sport Gloves | Pandora's Box", collection: "Glove Case", rarity: "Extraordinary", image: null, wear: "Field-Tested", prices: { steam: 5200.00, csfloat: 4900.00, skinport: 4750.00, buff163: 4600.00, dmarket: 5000.00 }, trend: 4.8 },
  { id: "12", name: "USP-S | Kill Confirmed", collection: "Shadow Collection", rarity: "Covert", image: null, wear: "Factory New", prices: { steam: 88.00, csfloat: 81.00, skinport: 78.50, buff163: 74.00, dmarket: 83.00 }, trend: -1.2 },
];

/* ── Marketplace key → affiliate deal ID mapping ── */
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
  Consumer: "#b0c3d9",
  Industrial: "#5e98d9",
  "Mil-Spec": "#4b69ff",
  Restricted: "#8847ff",
  Classified: "#d32ce6",
  Covert: "#eb4b4b",
  Contraband: "#e4ae39",
  Extraordinary: "#e4ae39",
};

export default function CS2PricesPage() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("cheapest");

  const filtered = useMemo(() => {
    let results = SKINS.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );

    results.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "trend") return b.trend - a.trend;
      const aMin = Math.min(...Object.values(a.prices));
      const bMin = Math.min(...Object.values(b.prices));
      return aMin - bMin;
    });

    return results;
  }, [query, sortBy]);

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
            Compare CS2 skin prices across all major marketplaces in real time. Find the best deal before you buy.
          </p>
        </div>
      </section>

      {/* Search + Sort */}
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
                              ${price.toFixed(2)}
                            </p>
                            {isCheapest && (
                              <p className="text-[9px] font-semibold text-emerald-600 mt-0.5">BEST</p>
                            )}
                          </a>
                        );
                      })}
                    </div>

                    {/* Trend + CTA */}
                    <div className="flex items-center gap-4 lg:w-48 flex-shrink-0 justify-end">
                      <div className={`flex items-center gap-1 text-sm font-semibold ${skin.trend >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {skin.trend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        {skin.trend >= 0 ? "+" : ""}{skin.trend}%
                      </div>
                      {savings > 0.01 && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
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
              <p className="text-gray-500">No skins match your search. Try a different name.</p>
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
