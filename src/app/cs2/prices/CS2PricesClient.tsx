"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
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

interface Props {
  initialMultiItems: MultiMarketPrice[];
  initialFallbackItems: SkinPrice[];
  defaultMode?: ViewMode;
  pageTitle?: string;
  pageDescription?: string;
}

const MODE_ROUTES: Record<ViewMode, string> = {
  default: "/cs2/prices",
  deals: "/cs2/prices/best-deals",
  trending: "/cs2/prices/trending",
};

const DEFAULT_SORT_FOR_MODE: Record<ViewMode, SortKey> = {
  default: "expensive",
  deals: "savings",
  trending: "volume",
};

export default function CS2PricesClient({
  initialMultiItems,
  initialFallbackItems,
  defaultMode = "default",
  pageTitle,
  pageDescription,
}: Props) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>(DEFAULT_SORT_FOR_MODE[defaultMode]);
  const [wearFilter, setWearFilter] = useState<string>("All");
  const viewMode = defaultMode;
  const [displayLimit, setDisplayLimit] = useState(50);

  /* Multi-market data (SteamWebAPI) */
  const [multiItems, setMultiItems] = useState<MultiMarketPrice[]>(initialMultiItems);
  const [multiTotal, setMultiTotal] = useState(initialMultiItems.length);
  const [multiLoading, setMultiLoading] = useState(false);
  const hasMultiData = multiItems.length > 0;

  /* Fallback data (Skinport) */
  const [fallbackItems, setFallbackItems] = useState<SkinPrice[]>(initialFallbackItems);
  const [fallbackTotal, setFallbackTotal] = useState(initialFallbackItems.length);
  const [fallbackLoading, setFallbackLoading] = useState(false);

  // Show loading state if we have no data yet (client-side fetch pending)
  const noDataYet = initialMultiItems.length === 0 && initialFallbackItems.length === 0;
  const loading = multiLoading || fallbackLoading || (noDataYet && !hasMultiData && fallbackItems.length === 0);
  const isLive = hasMultiData || fallbackItems.length > 0;

  /* ── Fetch multi-market prices (only on filter/sort/search changes) ── */
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

  /* ── Fetch on mount if no server-side data was provided ── */
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    if (hasMounted) return;
    // If server already gave us data, skip the initial fetch
    if (initialMultiItems.length > 0 || initialFallbackItems.length > 0) {
      setHasMounted(true);
      return;
    }
    setHasMounted(true);

    (async () => {
      const gotMulti = await fetchMultiPrices();
      if (!gotMulti) {
        await fetchFallbackPrices();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Re-fetch when user changes filters ── */
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (!hasInteracted) return;

    const timer = setTimeout(async () => {
      const gotMulti = await fetchMultiPrices();
      if (!gotMulti) {
        await fetchFallbackPrices();
      }
    }, query ? 300 : 0);
    return () => clearTimeout(timer);
  }, [hasInteracted, fetchMultiPrices, fetchFallbackPrices, query]);

  // Mark as interacted when user changes any filter
  const handleQueryChange = (v: string) => { setQuery(v); setHasInteracted(true); };
  const handleSortChange = (v: SortKey) => { setSortBy(v); setHasInteracted(true); };
  const handleWearChange = (v: string) => { setWearFilter(v); setHasInteracted(true); };
  const displayedMulti = useMemo(() => multiItems.slice(0, displayLimit), [multiItems, displayLimit]);
  const displayedFallback = useMemo(() => fallbackItems.slice(0, displayLimit), [fallbackItems, displayLimit]);

  const totalItems = hasMultiData ? multiTotal : fallbackTotal;
  const shownItems = hasMultiData ? multiItems : fallbackItems;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative border-b border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-orange-950 to-amber-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(251,146,60,0.3),transparent)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative container-main py-10">
          <Link href="/cs2" className="inline-flex items-center gap-1 text-sm text-orange-300/70 hover:text-orange-200 transition-colors mb-4">
            <ChevronLeft className="h-4 w-4" /> CS2 Skins Hub
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/25">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                {pageTitle || "Skin Price Tracker"}
              </h1>
            </div>
          </div>
          <p className="text-orange-200/70 max-w-2xl leading-relaxed">
            {pageDescription || (
              <>
                {hasMultiData
                  ? `Live CS2 skin prices across ${Object.keys(MARKETPLACE_INFO).length} marketplaces.`
                  : "Live CS2 skin prices from Skinport with market value comparison."
                }
                {totalItems > 0 && ` Tracking ${totalItems.toLocaleString()} skins.`}
                {" "}Find the cheapest prices and compare across marketplaces.
              </>
            )}
          </p>

          {/* Live stats row */}
          {totalItems > 0 && (
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 border border-white/10">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-white/80">{totalItems.toLocaleString()} skins tracked</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 border border-white/10">
                <BarChart3 className="h-3 w-3 text-orange-400" />
                <span className="text-xs font-semibold text-white/80">{Object.keys(MARKETPLACE_INFO).length} marketplaces</span>
              </div>
            </div>
          )}

          {/* View mode tabs */}
          <div className="flex items-center gap-2 mt-5">
            <Link
              href={MODE_ROUTES.default}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                viewMode === "default"
                  ? "bg-white text-gray-900 shadow-lg"
                  : "bg-white/10 border border-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              <DollarSign className="h-3.5 w-3.5" /> All Skins
            </Link>
            <Link
              href={MODE_ROUTES.deals}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                viewMode === "deals"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                  : "bg-white/10 border border-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              <Tag className="h-3.5 w-3.5" /> Best Deals
            </Link>
            <Link
              href={MODE_ROUTES.trending}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                viewMode === "trending"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "bg-white/10 border border-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              <Flame className="h-3.5 w-3.5" /> Trending
            </Link>
          </div>
        </div>
      </section>

      {/* Search + Sort + Wear Filter */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-16 z-30">
        <div className="container-main py-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search skins (e.g. AK-47, Dragon Lore, Butterfly Fade...)"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-brand-300 focus:bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <select
              value={wearFilter}
              onChange={(e) => handleWearChange(e.target.value)}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2.5 text-sm focus:border-brand-300 focus:outline-none"
            >
              {WEARS.map((w) => (
                <option key={w} value={w}>{w === "All" ? "All Wears" : w}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortKey)}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2.5 text-sm focus:border-brand-300 focus:outline-none"
            >
              <option value="expensive">Most Valuable</option>
              <option value="cheapest">Cheapest First</option>
              <option value="savings">Biggest Savings</option>
              <option value="volume">Most Traded</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* Live status bar */}
      <section className="border-b border-gray-50 bg-gray-50 dark:bg-gray-900/50">
        <div className="container-main py-3 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 text-[11px]">
            {isLive ? (
              <>
                <Wifi className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-600 font-semibold">LIVE PRICES</span>
                {hasMultiData ? (
                  <span className="text-gray-400 dark:text-gray-500 ml-1">
                    from {Object.keys(MARKETPLACE_INFO).length} marketplaces — updated every 10 min
                  </span>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500 ml-1">from Skinport — updated every 15 min</span>
                )}
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-400 dark:text-gray-500">Loading prices...</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 ml-auto text-[11px] text-gray-400 dark:text-gray-500">
            <span>Buy on:</span>
            {Object.values(MARKETPLACE_INFO)
              .filter((mp) => mp.dealId !== "steam")
              .map((mp) => (
                <a
                  key={mp.dealId}
                  href={`/go/cs2/${mp.dealId}?from=prices-bar`}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex items-center gap-1 hover:text-gray-600 dark:text-gray-300 transition-colors"
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
              <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">Loading live prices from multiple marketplaces...</span>
            </div>
          ) : hasMultiData ? (
            /* ── Multi-marketplace view ── */
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
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
              <div className="hidden xl:grid xl:grid-cols-[256px_88px_88px_88px_88px_88px_96px_72px_1fr] items-center px-5 py-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
                <button onClick={() => handleSortChange("name")} className={`text-left hover:text-gray-600 dark:hover:text-gray-300 transition-colors ${sortBy === "name" ? "text-gray-700 dark:text-gray-200" : ""}`}>
                  Skin {sortBy === "name" && "▲"}
                </button>
                <div className="text-right">Steam</div>
                <div className="text-right text-pink-500">Skinport</div>
                <div className="text-right" style={{ color: "#ff6b35" }}>Buff163</div>
                <div className="text-right" style={{ color: "#00c9a7" }}>DMarket</div>
                <div className="text-right" style={{ color: "#7c3aed" }}>Waxpeer</div>
                <button onClick={() => handleSortChange(sortBy === "cheapest" ? "expensive" : "cheapest")} className={`text-right hover:text-gray-600 dark:hover:text-gray-300 transition-colors ${sortBy === "expensive" || sortBy === "cheapest" ? "text-gray-700 dark:text-gray-200" : ""}`}>
                  Best Price {sortBy === "expensive" ? "▼" : sortBy === "cheapest" ? "▲" : ""}
                </button>
                <button onClick={() => handleSortChange("volume")} className={`text-center hover:text-gray-600 dark:hover:text-gray-300 transition-colors ${sortBy === "volume" ? "text-gray-700 dark:text-gray-200" : ""}`}>
                  Volume {sortBy === "volume" && "▼"}
                </button>
                <div className="text-right">Buy</div>
              </div>

              <div className="space-y-2">
                {displayedMulti.map((item) => {
                  const savings = savingsPct(item.steamPrice, item.lowestPrice);
                  const bestMp = item.bestMarket ? MARKETPLACE_INFO[item.bestMarket] : null;

                  return (
                    <div
                      key={item.name}
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 sm:px-5 sm:py-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col xl:grid xl:grid-cols-[256px_88px_88px_88px_88px_88px_96px_72px_1fr] xl:items-center gap-3 xl:gap-0">
                        {/* Skin info */}
                        <div className="flex items-center gap-3">
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
                            <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">{item.weapon} | {item.skin}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {item.rarity && (
                                <span
                                  className="inline-block rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                                  style={{ backgroundColor: item.borderColor || "#666" }}
                                >
                                  {item.rarity}
                                </span>
                              )}
                              <span className="text-xs text-gray-500 dark:text-gray-400">{item.wear}</span>
                            </div>
                          </div>
                        </div>

                        {/* Steam */}
                        <div className="xl:text-right">
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 xl:hidden">Steam</span>
                          <p className="text-sm font-medium text-gray-400 dark:text-gray-500">{formatPrice(item.steamPrice)}</p>
                        </div>

                        {/* Skinport */}
                        <div className="xl:text-right">
                          <span className="text-[10px] xl:hidden" style={{ color: "#eb4b98" }}>Skinport</span>
                          <p className={`text-sm font-semibold ${
                            item.bestMarket === "skinport" ? "text-emerald-600" : "text-gray-700"
                          }`}>
                            {formatPrice(item.skinportPrice)}
                          </p>
                        </div>

                        {/* Buff163 */}
                        <div className="xl:text-right">
                          <span className="text-[10px] xl:hidden" style={{ color: "#ff6b35" }}>Buff163</span>
                          <p className={`text-sm font-semibold ${
                            item.bestMarket === "buff163" ? "text-emerald-600" : "text-gray-700"
                          }`}>
                            {formatPrice(item.buff163Price)}
                          </p>
                        </div>

                        {/* DMarket */}
                        <div className="xl:text-right">
                          <span className="text-[10px] xl:hidden" style={{ color: "#00c9a7" }}>DMarket</span>
                          <p className={`text-sm font-semibold ${
                            item.bestMarket === "dmarket" ? "text-emerald-600" : "text-gray-700"
                          }`}>
                            {formatPrice(item.dmarketPrice)}
                          </p>
                        </div>

                        {/* Waxpeer */}
                        <div className="xl:text-right">
                          <span className="text-[10px] xl:hidden" style={{ color: "#7c3aed" }}>Waxpeer</span>
                          <p className={`text-sm font-semibold ${
                            item.bestMarket === "waxpeer" ? "text-emerald-600" : "text-gray-700"
                          }`}>
                            {formatPrice(item.waxpeerPrice)}
                          </p>
                        </div>

                        {/* Best price badge */}
                        <div className="flex xl:justify-end items-center">
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
                        <div className="xl:text-center">
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 xl:hidden">Vol:</span>
                          {item.sold24h > 0 || item.sold7d > 0 || item.sold30d > 0 ? (
                            <div className="flex flex-col items-center">
                              {item.sold24h > 0 && <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">{item.sold24h.toLocaleString()}</span>}
                              {item.sold24h === 0 && item.sold7d > 0 && <span className="text-[10px] text-gray-400 dark:text-gray-500">{item.sold7d.toLocaleString()}/7d</span>}
                              {item.sold24h === 0 && item.sold7d === 0 && item.sold30d > 0 && <span className="text-[10px] text-gray-400 dark:text-gray-500">{item.sold30d.toLocaleString()}/30d</span>}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </div>

                        {/* Buy CTA */}
                        <div className="flex items-center gap-2 justify-end flex-wrap">
                          {(() => {
                            const available: { dealId: string; name: string; color: string; price: number | null }[] = [];
                            if (item.skinportPrice) available.push({ dealId: "skinport", name: "Skinport", color: "#eb4b98", price: item.skinportPrice });
                            if (item.buff163Price) available.push({ dealId: "buff163", name: "Buff163", color: "#ff6b35", price: item.buff163Price });
                            if (item.dmarketPrice) available.push({ dealId: "dmarket", name: "DMarket", color: "#00c9a7", price: item.dmarketPrice });
                            if (item.waxpeerPrice) available.push({ dealId: "waxpeer", name: "Waxpeer", color: "#7c3aed", price: item.waxpeerPrice });
                            available.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

                            return available.map((mp, i) => (
                              <a
                                key={mp.dealId}
                                href={`/go/cs2/${mp.dealId}?from=prices&item=${encodeURIComponent(item.name)}`}
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
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-6 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Load More ({multiItems.length - displayLimit} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            /* ── Fallback: Skinport-only view ── */
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {fallbackItems.length === fallbackTotal
                  ? `${fallbackTotal.toLocaleString()} skins found`
                  : `Showing ${fallbackItems.length} of ${fallbackTotal.toLocaleString()} skins`}
              </p>

              <div className="hidden lg:flex items-center gap-4 px-5 py-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
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
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 sm:px-5 sm:py-4 shadow-sm hover:shadow-md transition-shadow"
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
                            <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">{skin.weapon} | {skin.skin}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {skin.rarity && (
                                <span
                                  className="inline-block rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                                  style={{ backgroundColor: RARITY_COLORS[skin.rarity] || "#666" }}
                                >
                                  {skin.rarity}
                                </span>
                              )}
                              <span className="text-xs text-gray-500 dark:text-gray-400">{skin.wear}</span>
                            </div>
                          </div>
                        </div>

                        <div className="lg:w-28 flex-shrink-0 flex lg:justify-end items-center gap-2 lg:gap-0">
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 lg:hidden">Skinport:</span>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{formatPrice(skin.skinportPrice)}</p>
                            <div className="flex items-center gap-1 justify-end">
                              <Tag className="h-2.5 w-2.5 text-pink-400" />
                              <span className="text-[10px] text-pink-500 font-medium">Skinport</span>
                            </div>
                          </div>
                        </div>

                        <div className="lg:w-28 flex-shrink-0 flex lg:justify-end items-center gap-2 lg:gap-0">
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 lg:hidden">Market Value:</span>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{formatPrice(skin.marketValue)}</p>
                            <div className="flex items-center gap-1 justify-end">
                              <BarChart3 className="h-2.5 w-2.5 text-gray-300" />
                              <span className="text-[10px] text-gray-400 dark:text-gray-500">Suggested</span>
                            </div>
                          </div>
                        </div>

                        <div className="lg:w-24 flex-shrink-0 flex lg:justify-end items-center gap-2 lg:gap-0">
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 lg:hidden">Savings:</span>
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
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 lg:hidden">Listings:</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{skin.quantity > 0 ? skin.quantity : "—"}</span>
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
                              href={`/go/cs2/${mp.dealId}?from=prices&item=${encodeURIComponent(skin.name)}`}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 text-[10px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900 transition-colors"
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
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-6 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Load More ({fallbackItems.length - displayLimit} remaining)
                  </button>
                </div>
              )}
            </>
          )}

          {shownItems.length === 0 && !loading && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">No skins match your search. Try a different name or wear condition.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="border-t border-gray-100 dark:border-gray-800 bg-gradient-to-r from-orange-50 dark:from-orange-950/30 to-amber-50 dark:to-amber-950/20 py-10">
        <div className="container-main text-center">
          <Star className="h-8 w-8 text-orange-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Get Price Drop Alerts</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-6 max-w-md mx-auto">
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
      <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/70">
        <div className="container-main py-4">
          <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed text-center">
            <span className="font-semibold text-gray-500 dark:text-gray-400">Affiliate Disclosure:</span>{" "}
            Some links on this page are affiliate links. LootBoxes.com may earn a commission
            if you make a purchase, at no extra cost to you. Prices powered by{" "}
            {hasMultiData ? (
              <a href="https://www.steamwebapi.com" target="_blank" rel="noopener noreferrer nofollow" className="underline hover:text-gray-600 dark:text-gray-300">SteamWebAPI</a>
            ) : (
              <a href="https://skinport.com" target="_blank" rel="noopener noreferrer nofollow" className="underline hover:text-gray-600 dark:text-gray-300">Skinport</a>
            )}
            .
          </p>
        </div>
      </div>
    </div>
  );
}
