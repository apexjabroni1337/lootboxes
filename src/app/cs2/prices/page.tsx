"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
// Using native <img> for external Steam CDN images
import {
  Search,
  TrendingUp,
  ExternalLink,
  Star,
  ArrowUpDown,
  ChevronLeft,
  Filter,
  Loader2,
  Wifi,
  WifiOff,
  ShoppingCart,
  Tag,
  BarChart3,
  Flame,
  ArrowDown,
  DollarSign,
} from "lucide-react";

/* ── Types ── */
interface MultiMarketPrice {
  name: string;
  weapon: string;
  skin: string;
  wear: string;
  image: string | null;
  rarity: string;
  borderColor: string;
  steamPrice: number | null;
  skinportPrice: number | null;
  buff163Price: number | null;
  dmarketPrice: number | null;
  waxpeerPrice: number | null;
  marketLinks: Record<string, string>;
  lowestPrice: number | null;
  highestPrice: number | null;
  averagePrice: number | null;
  medianPrice: number | null;
  bestMarket: string | null;
  bestSavingsVsSteam: number | null;
  sold24h: number;
  sold7d: number;
  sold30d: number;
  buyOrderPrice: number | null;
}

/* Also keep the old SkinPrice for fallback */
interface SkinPrice {
  name: string;
  weapon: string;
  skin: string;
  wear: string;
  rarity: string;
  image: string | null;
  skinportPrice: number | null;
  marketValue: number | null;
  medianPrice: number | null;
  meanPrice: number | null;
  quantity: number;
  itemPage: string | null;
  cheapestPrice: number;
  savings: number;
  updatedAt: string | null;
}

const WEARS = ["All", "Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"] as const;
type SortKey = "name" | "cheapest" | "expensive" | "savings" | "volume";
type ViewMode = "default" | "deals" | "trending";

const RARITY_COLORS: Record<string, string> = {
  Consumer: "#b0c3d9", Industrial: "#5e98d9", "Mil-Spec": "#4b69ff",
  Restricted: "#8847ff", Classified: "#d32ce6", Covert: "#eb4b4b",
  Contraband: "#e4ae39", Extraordinary: "#e4ae39",
};

const MARKETPLACE_INFO: Record<string, { name: string; color: string; dealId: string }> = {
  steam: { name: "Steam", color: "#1b2838", dealId: "steam" },
  skinport: { name: "Skinport", color: "#eb4b98", dealId: "skinport" },
  buff163: { name: "Buff163", color: "#ff6b35", dealId: "buff163" },
  dmarket: { name: "DMarket", color: "#00c9a7", dealId: "dmarket" },
  waxpeer: { name: "Waxpeer", color: "#7c3aed", dealId: "waxpeer" },
};

function formatPrice(price: number | null | undefined): string {
  if (price == null || price === 0) return "—";
  return "$" + price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function savingsPct(high: number | null, low: number | null): string {
  if (!high || !low || high <= low) return "";
  return `-${(((high - low) / high) * 100).toFixed(0)}%`;
}

export default function CS2PricesPage() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("expensive");
  const [wearFilter, setWearFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("default");
  const [displayLimit, setDisplayLimit] = useState(50);

  /* Multi-market data (SteamWebAPI) */
  const [multiItems, setMultiItems] = useState<MultiMarketPrice[]>([]);
  const [multiTotal, setMultiTotal] = useState(0);
  const [multiLoading, setMultiLoading] = useState(true);
  const [hasMultiData, setHasMultiData] = useState(false);

  /* Fallback data (Skinport) */
  const [fallbackItems, setFallbackItems] = useState<SkinPrice[]>([]);
  const [fallbackTotal, setFallbackTotal] = useState(0);
  const [fallbackLoading, setFallbackLoading] = useState(false);

  const loading = multiLoading || fallbackLoading;
  const isLive = hasMultiData || fallbackItems.length > 0;

  /* ── Fetch multi-market prices ── */
  const fetchMultiPrices = useCallback(async () => {
    setMultiLoading(true);
    try {
      const params = new URLSearchParams({ limit: "500", sort: sortBy });
      if (query) params.set("q", query);
      if (wearFilter !== "All") params.set("wear", wearFilter);
      if (viewMode !== "default") params.set("mode", viewMode);
      params.set("minPrice", "1");

      const res = await fetch(`/api/cs2/multi-prices?${params.toString()}`);
      if (!res.ok) throw new Error("Multi-prices API error");

      const data = await res.json();
      const items: MultiMarketPrice[] = data.items || [];

      if (items.length > 0) {
        setMultiItems(items);
        setMultiTotal(data.total || 0);
        setHasMultiData(true);
        setDisplayLimit(50);
        return true;
      }
      return false;
    } catch {
      console.warn("[Prices] Multi-market fetch failed, trying fallback");
      return false;
    } finally {
      setMultiLoading(false);
    }
  }, [query, sortBy, wearFilter, viewMode]);

  /* ── Fallback to Skinport-only API ── */
  const fetchFallbackPrices = useCallback(async () => {
    setFallbackLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "500",
        sort: sortBy === "volume" ? "expensive" : (sortBy === "savings" ? "expensive" : sortBy),
        minPrice: "1",
      });
      if (query) params.set("q", query);
      if (wearFilter !== "All") params.set("wear", wearFilter);

      const res = await fetch(`/api/cs2/prices?${params.toString()}`);
      if (!res.ok) throw new Error("Fallback API error");

      const data = await res.json();
      let items: SkinPrice[] = data.items || [];

      if (sortBy === "savings") items.sort((a, b) => b.savings - a.savings);

      setFallbackItems(items);
      setFallbackTotal(data.total || 0);
      setDisplayLimit(50);
    } catch {
      console.warn("[Prices] Fallback fetch also failed");
    } finally {
      setFallbackLoading(false);
    }
  }, [query, sortBy, wearFilter]);

  /* ── Fetch on mount / filter change ── */
  useEffect(() => {
    const timer = setTimeout(async () => {
      const gotMulti = await fetchMultiPrices();
      if (!gotMulti) {
        await fetchFallbackPrices();
      }
    }, query ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchMultiPrices, fetchFallbackPrices]);

  const displayedMulti = useMemo(() => multiItems.slice(0, displayLimit), [multiItems, displayLimit]);
  const displayedFallback = useMemo(() => fallbackItems.slice(0, displayLimit), [fallbackItems, displayLimit]);

  const totalItems = hasMultiData ? multiTotal : fallbackTotal;
  const shownItems = hasMultiData ? multiItems : fallbackItems;

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
            {hasMultiData
              ? `Live CS2 skin prices across ${Object.keys(MARKETPLACE_INFO).length} marketplaces.`
              : "Live CS2 skin prices from Skinport with market value comparison."
            }
            {totalItems > 0 && ` Tracking ${totalItems.toLocaleString()} skins.`}
            {" "}Find the cheapest prices and compare across marketplaces.
          </p>

          {/* View mode tabs */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setViewMode("default")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                viewMode === "default"
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <DollarSign className="h-3.5 w-3.5" /> All Skins
            </button>
            <button
              onClick={() => setViewMode("deals")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                viewMode === "deals"
                  ? "bg-emerald-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Tag className="h-3.5 w-3.5" /> Best Deals
            </button>
            <button
              onClick={() => setViewMode("trending")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                viewMode === "trending"
                  ? "bg-orange-500 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Flame className="h-3.5 w-3.5" /> Trending
            </button>
          </div>
        </div>
      </section>

      {/* Search + Sort + Wear Filter */}
      <section className="border-b border-gray-100 bg-white sticky top-16 z-30">
        <div className="container-main py-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search skins (e.g. AK-47, Dragon Lore, Butterfly Fade...)"
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
              <option value="expensive">Most Valuable</option>
              <option value="cheapest">Cheapest First</option>
              <option value="savings">Biggest Savings</option>
              {hasMultiData && <option value="volume">Most Traded</option>}
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* Live status bar */}
      <section className="border-b border-gray-50 bg-gray-50/50">
        <div className="container-main py-3 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 text-[11px]">
            {isLive ? (
              <>
                <Wifi className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-600 font-semibold">LIVE PRICES</span>
                {hasMultiData ? (
                  <span className="text-gray-400 ml-1">
                    from {Object.keys(MARKETPLACE_INFO).length} marketplaces — updated every 10 min
                  </span>
                ) : (
                  <span className="text-gray-400 ml-1">from Skinport — updated every 15 min</span>
                )}
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 text-gray-400" />
                <span className="text-gray-400">Loading prices...</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 ml-auto text-[11px] text-gray-400">
            <span>Buy on:</span>
            {Object.values(MARKETPLACE_INFO)
              .filter((mp) => mp.dealId !== "steam")
              .map((mp) => (
                <a
                  key={mp.dealId}
                  href={`/go/cs2/${mp.dealId}?from=prices-bar`}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex items-center gap-1 hover:text-gray-600 transition-colors"
                >
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: mp.color }} />
                  <span className="font-medium">{mp.name}</span>
                </a>
              ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-6">
        <div className="container-main">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
              <span className="ml-3 text-sm text-gray-500">Loading live prices from multiple marketplaces...</span>
            </div>
          ) : hasMultiData ? (
            /* ── Multi-marketplace view ── */
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  {multiItems.length === multiTotal
                    ? `${multiTotal.toLocaleString()} skins found`
                    : `Showing ${multiItems.length} of ${multiTotal.toLocaleString()} skins`}
                </p>
                {viewMode === "deals" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <ArrowDown className="h-3 w-3" /> Sorted by biggest savings vs Steam
                  </span>
                )}
                {viewMode === "trending" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                    <Flame className="h-3 w-3" /> Sorted by 24h trade volume
                  </span>
                )}
              </div>

              {/* Table header */}
              <div className="hidden xl:flex items-center gap-3 px-5 py-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-2">
                <div className="w-64">Skin</div>
                <div className="w-20 text-right">Steam</div>
                <div className="w-20 text-right">
                  <span className="text-pink-500">Skinport</span>
                </div>
                <div className="w-20 text-right">
                  <span style={{ color: "#ff6b35" }}>Buff163</span>
                </div>
                <div className="w-20 text-right">
                  <span style={{ color: "#00c9a7" }}>DMarket</span>
                </div>
                <div className="w-20 text-right">
                  <span style={{ color: "#7c3aed" }}>Waxpeer</span>
                </div>
                <div className="w-24 text-right">Best Price</div>
                <div className="w-20 text-center">Volume</div>
                <div className="flex-1 text-right">Buy</div>
              </div>

              <div className="space-y-2">
                {displayedMulti.map((item) => {
                  const savings = savingsPct(item.steamPrice, item.lowestPrice);
                  const bestMp = item.bestMarket ? MARKETPLACE_INFO[item.bestMarket] : null;

                  return (
                    <div
                      key={item.name}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-3 sm:px-5 sm:py-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col xl:flex-row xl:items-center gap-3">
                        {/* Skin info */}
                        <div className="flex items-center gap-3 xl:w-64 flex-shrink-0">
                          {item.image ? (
                            <div
                              className="h-12 w-12 rounded-lg flex-shrink-0 overflow-hidden border-2 bg-gradient-to-br from-gray-100 to-gray-50"
                              style={{ borderColor: item.borderColor || "#ddd" }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.image}
                                alt={`${item.weapon} | ${item.skin}`}
                                className="h-full w-full object-contain"
                                loading="lazy"
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0 bg-gray-400">
                              {item.weapon.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate text-sm">{item.weapon} | {item.skin}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {item.rarity && (
                                <span
                                  className="inline-block rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                                  style={{ backgroundColor: item.borderColor || "#666" }}
                                >
                                  {item.rarity}
                                </span>
                              )}
                              <span className="text-xs text-gray-500">{item.wear}</span>
                            </div>
                          </div>
                        </div>

                        {/* Marketplace prices — row on desktop, grid on mobile */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:flex gap-2 xl:gap-0 flex-1">
                          {/* Steam */}
                          <div className="xl:w-20 flex-shrink-0 xl:text-right">
                            <span className="text-[10px] text-gray-400 xl:hidden">Steam</span>
                            <p className="text-sm font-medium text-gray-400">{formatPrice(item.steamPrice)}</p>
                          </div>

                          {/* Skinport */}
                          <div className="xl:w-20 flex-shrink-0 xl:text-right">
                            <span className="text-[10px] xl:hidden" style={{ color: "#eb4b98" }}>Skinport</span>
                            <p className={`text-sm font-semibold ${
                              item.bestMarket === "skinport" ? "text-emerald-600" : "text-gray-700"
                            }`}>
                              {formatPrice(item.skinportPrice)}
                            </p>
                          </div>

                          {/* Buff163 */}
                          <div className="xl:w-20 flex-shrink-0 xl:text-right">
                            <span className="text-[10px] xl:hidden" style={{ color: "#ff6b35" }}>Buff163</span>
                            <p className={`text-sm font-semibold ${
                              item.bestMarket === "buff163" ? "text-emerald-600" : "text-gray-700"
                            }`}>
                              {formatPrice(item.buff163Price)}
                            </p>
                          </div>

                          {/* DMarket */}
                          <div className="xl:w-20 flex-shrink-0 xl:text-right">
                            <span className="text-[10px] xl:hidden" style={{ color: "#00c9a7" }}>DMarket</span>
                            <p className={`text-sm font-semibold ${
                              item.bestMarket === "dmarket" ? "text-emerald-600" : "text-gray-700"
                            }`}>
                              {formatPrice(item.dmarketPrice)}
                            </p>
                          </div>

                          {/* Waxpeer */}
                          <div className="xl:w-20 flex-shrink-0 xl:text-right">
                            <span className="text-[10px] xl:hidden" style={{ color: "#7c3aed" }}>Waxpeer</span>
                            <p className={`text-sm font-semibold ${
                              item.bestMarket === "waxpeer" ? "text-emerald-600" : "text-gray-700"
                            }`}>
                              {formatPrice(item.waxpeerPrice)}
                            </p>
                          </div>
                        </div>

                        {/* Best price badge */}
                        <div className="xl:w-24 flex-shrink-0 flex xl:justify-end items-center gap-2">
                          {item.lowestPrice && item.lowestPrice > 0 ? (
                            <div className="text-right">
                              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                {formatPrice(item.lowestPrice)}
                              </span>
                              {savings && (
                                <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">{savings} vs Steam</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </div>

                        {/* Volume */}
                        <div className="xl:w-20 flex-shrink-0 flex xl:justify-center items-center gap-2">
                          <span className="text-[10px] text-gray-400 xl:hidden">24h:</span>
                          {item.sold24h > 0 ? (
                            <span className="text-xs text-gray-500">{item.sold24h.toLocaleString()}</span>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </div>

                        {/* Buy CTA — show ALL marketplaces that have a price for this item */}
                        <div className="flex-1 flex items-center gap-2 justify-end flex-wrap">
                          {(() => {
                            // Build list of marketplaces with actual data for this item
                            const available: { dealId: string; name: string; color: string; price: number | null }[] = [];
                            if (item.skinportPrice) available.push({ dealId: "skinport", name: "Skinport", color: "#eb4b98", price: item.skinportPrice });
                            if (item.buff163Price) available.push({ dealId: "buff163", name: "Buff163", color: "#ff6b35", price: item.buff163Price });
                            if (item.dmarketPrice) available.push({ dealId: "dmarket", name: "DMarket", color: "#00c9a7", price: item.dmarketPrice });
                            if (item.waxpeerPrice) available.push({ dealId: "waxpeer", name: "Waxpeer", color: "#7c3aed", price: item.waxpeerPrice });
                            // Sort so cheapest is first
                            available.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

                            return available.map((mp, i) => (
                              <a
                                key={mp.dealId}
                                href={`/go/cs2/${mp.dealId}?from=prices`}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition-colors ${
                                  i === 0
                                    ? "text-white"
                                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                                style={i === 0 ? { backgroundColor: mp.color } : undefined}
                              >
                                {i === 0 && <ShoppingCart className="h-3 w-3" />}
                                {i > 0 && <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: mp.color }} />}
                                {mp.name} <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {displayLimit < multiItems.length && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setDisplayLimit((prev) => prev + 50)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Load More ({multiItems.length - displayLimit} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            /* ── Fallback: Skinport-only view ── */
            <>
              <p className="text-sm text-gray-500 mb-4">
                {fallbackItems.length === fallbackTotal
                  ? `${fallbackTotal.toLocaleString()} skins found`
                  : `Showing ${fallbackItems.length} of ${fallbackTotal.toLocaleString()} skins`}
              </p>

              <div className="hidden lg:flex items-center gap-4 px-5 py-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-2">
                <div className="w-80">Skin</div>
                <div className="w-28 text-right">Skinport Price</div>
                <div className="w-28 text-right">Market Value</div>
                <div className="w-24 text-right">Savings</div>
                <div className="w-20 text-center">Listings</div>
                <div className="flex-1 text-right">Compare</div>
              </div>

              <div className="space-y-2">
                {displayedFallback.map((skin) => {
                  const pct = savingsPct(skin.marketValue, skin.skinportPrice);
                  return (
                    <div
                      key={skin.name}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-3 sm:px-5 sm:py-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                        <div className="flex items-center gap-3 lg:w-80 flex-shrink-0">
                          {skin.image ? (
                            <div
                              className="h-12 w-12 rounded-lg flex-shrink-0 overflow-hidden border"
                              style={{ borderColor: RARITY_COLORS[skin.rarity] || "#ddd" }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={skin.image}
                                alt={`${skin.weapon} | ${skin.skin}`}
                                className="h-full w-full object-contain"
                                loading="lazy"
                              />
                            </div>
                          ) : (
                            <div
                              className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                              style={{ backgroundColor: RARITY_COLORS[skin.rarity] || "#666" }}
                            >
                              {skin.weapon.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate text-sm">{skin.weapon} | {skin.skin}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {skin.rarity && (
                                <span
                                  className="inline-block rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                                  style={{ backgroundColor: RARITY_COLORS[skin.rarity] || "#666" }}
                                >
                                  {skin.rarity}
                                </span>
                              )}
                              <span className="text-xs text-gray-500">{skin.wear}</span>
                            </div>
                          </div>
                        </div>

                        <div className="lg:w-28 flex-shrink-0 flex lg:justify-end items-center gap-2 lg:gap-0">
                          <span className="text-[10px] text-gray-400 lg:hidden">Skinport:</span>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">{formatPrice(skin.skinportPrice)}</p>
                            <div className="flex items-center gap-1 justify-end">
                              <Tag className="h-2.5 w-2.5 text-pink-400" />
                              <span className="text-[10px] text-pink-500 font-medium">Skinport</span>
                            </div>
                          </div>
                        </div>

                        <div className="lg:w-28 flex-shrink-0 flex lg:justify-end items-center gap-2 lg:gap-0">
                          <span className="text-[10px] text-gray-400 lg:hidden">Market Value:</span>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-500">{formatPrice(skin.marketValue)}</p>
                            <div className="flex items-center gap-1 justify-end">
                              <BarChart3 className="h-2.5 w-2.5 text-gray-300" />
                              <span className="text-[10px] text-gray-400">Suggested</span>
                            </div>
                          </div>
                        </div>

                        <div className="lg:w-24 flex-shrink-0 flex lg:justify-end items-center gap-2 lg:gap-0">
                          <span className="text-[10px] text-gray-400 lg:hidden">Savings:</span>
                          {skin.savings > 0.5 ? (
                            <div className="text-right">
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                                {formatPrice(skin.savings)}
                              </span>
                              {pct && <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">{pct}</p>}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </div>

                        <div className="lg:w-20 flex-shrink-0 flex lg:justify-center items-center gap-2 lg:gap-0">
                          <span className="text-[10px] text-gray-400 lg:hidden">Listings:</span>
                          <span className="text-xs text-gray-500">{skin.quantity > 0 ? skin.quantity : "—"}</span>
                        </div>

                        <div className="flex-1 flex items-center gap-2 justify-end flex-wrap">
                          {skin.itemPage && (
                            <a
                              href={skin.itemPage}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-white transition-colors"
                              style={{ backgroundColor: "#eb4b98" }}
                            >
                              <ShoppingCart className="h-3 w-3" /> Skinport
                            </a>
                          )}
                          {[
                            { name: "Buff163", dealId: "buff163", color: "#ff6b35" },
                            { name: "DMarket", dealId: "dmarket", color: "#00c9a7" },
                            { name: "Waxpeer", dealId: "waxpeer", color: "#7c3aed" },
                          ].map((mp) => (
                            <a
                              key={mp.dealId}
                              href={`/go/cs2/${mp.dealId}?from=prices`}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[10px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                              <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: mp.color }} />
                              {mp.name} <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {displayLimit < fallbackItems.length && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setDisplayLimit((prev) => prev + 50)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Load More ({fallbackItems.length - displayLimit} remaining)
                  </button>
                </div>
              )}
            </>
          )}

          {shownItems.length === 0 && !loading && (
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
            if you make a purchase, at no extra cost to you. Prices powered by{" "}
            {hasMultiData ? (
              <a href="https://www.steamwebapi.com" target="_blank" rel="noopener noreferrer nofollow" className="underline hover:text-gray-600">SteamWebAPI</a>
            ) : (
              <a href="https://skinport.com" target="_blank" rel="noopener noreferrer nofollow" className="underline hover:text-gray-600">Skinport</a>
            )}
            .
          </p>
        </div>
      </div>
    </div>
  );
}
