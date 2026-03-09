"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Tag,
  TrendingDown,
  Flame,
  ArrowDown,
  ExternalLink,
  ShoppingCart,
  Loader2,
  Wifi,
  WifiOff,
  Clock,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";

/* ── Types ── */
interface MultiMarketPrice {
  name: string;
  weapon: string;
  skin: string;
  wear: string;
  image: string | null;
  steamPrice: number | null;
  skinportPrice: number | null;
  csfloatPrice: number | null;
  buff163Price: number | null;
  dmarketPrice: number | null;
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

type DealTab = "savings" | "trending" | "undervalued";

const MARKETPLACE_INFO: Record<string, { name: string; color: string }> = {
  steam: { name: "Steam", color: "#1b2838" },
  skinport: { name: "Skinport", color: "#eb4b98" },
  csfloat: { name: "CSFloat", color: "#4f8df0" },
  buff163: { name: "Buff163", color: "#ff6b35" },
  dmarket: { name: "DMarket", color: "#00c9a7" },
};

function formatPrice(price: number | null | undefined): string {
  if (price == null || price === 0) return "—";
  return "$" + price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function savingsPct(high: number | null, low: number | null): number {
  if (!high || !low || high <= low) return 0;
  return Math.round(((high - low) / high) * 100);
}

export default function DealsPage() {
  const [tab, setTab] = useState<DealTab>("savings");
  const [query, setQuery] = useState("");
  const [wearFilter, setWearFilter] = useState("All");
  const [items, setItems] = useState<MultiMarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(50);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const WEARS = ["All", "Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"];

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "200",
        sort: tab === "trending" ? "volume" : "savings",
        minPrice: "1",
      });
      if (tab === "savings" || tab === "undervalued") params.set("mode", "deals");
      if (tab === "trending") params.set("mode", "trending");
      if (query) params.set("q", query);
      if (wearFilter !== "All") params.set("wear", wearFilter);

      const res = await fetch(`/api/cs2/multi-prices?${params.toString()}`);
      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      let fetched: MultiMarketPrice[] = data.items || [];

      // "Undervalued" = skins where buy order is close to lowest price (within 15%)
      if (tab === "undervalued") {
        fetched = fetched.filter((item) => {
          if (!item.buyOrderPrice || !item.lowestPrice) return false;
          const ratio = item.buyOrderPrice / item.lowestPrice;
          return ratio > 0.85;
        });
      }

      setItems(fetched);
      setIsLive(fetched.length > 0);
      setDisplayLimit(50);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      console.warn("[Deals] Failed to fetch");
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, [tab, query, wearFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchDeals(), query ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchDeals]);

  const displayed = useMemo(() => items.slice(0, displayLimit), [items, displayLimit]);

  /* Stats */
  const avgSavings = useMemo(() => {
    const valid = items.filter((i) => (i.bestSavingsVsSteam ?? 0) > 0);
    if (valid.length === 0) return 0;
    return Math.round(valid.reduce((sum, i) => sum + (i.bestSavingsVsSteam ?? 0), 0) / valid.length * 100) / 100;
  }, [items]);

  const topSavingsPct = useMemo(() => {
    if (items.length === 0) return 0;
    return savingsPct(items[0]?.steamPrice, items[0]?.lowestPrice);
  }, [items]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 py-10">
        <div className="container-main">
          <Link href="/cs2" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ChevronLeft className="h-4 w-4" /> CS2 Skins Hub
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <Tag className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Best Deals</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Real-time skin deals across every major CS2 marketplace. We compare prices from CSFloat, Skinport, Buff163,
            DMarket and Steam Market to find you the biggest savings — updated every 10 minutes.
          </p>

          {/* Stat cards */}
          {isLive && (
            <div className="grid grid-cols-3 gap-4 mt-6 max-w-lg">
              <div className="rounded-xl bg-white/80 border border-emerald-100 p-3 text-center">
                <p className="text-2xl font-bold text-emerald-600">{items.length}</p>
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Deals Found</p>
              </div>
              <div className="rounded-xl bg-white/80 border border-emerald-100 p-3 text-center">
                <p className="text-2xl font-bold text-emerald-600">{topSavingsPct}%</p>
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Top Savings</p>
              </div>
              <div className="rounded-xl bg-white/80 border border-emerald-100 p-3 text-center">
                <p className="text-2xl font-bold text-emerald-600">{formatPrice(avgSavings)}</p>
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Avg Savings</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tab bar */}
      <section className="border-b border-gray-100 bg-white sticky top-16 z-30">
        <div className="container-main py-3 flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab("savings")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                tab === "savings"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <TrendingDown className="h-3.5 w-3.5" /> Biggest Savings
            </button>
            <button
              onClick={() => setTab("trending")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                tab === "trending"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Flame className="h-3.5 w-3.5" /> Most Traded
            </button>
            <button
              onClick={() => setTab("undervalued")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                tab === "undervalued"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <ArrowDown className="h-3.5 w-3.5" /> Undervalued
            </button>
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm focus:border-brand-300 focus:bg-white focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={wearFilter}
                onChange={(e) => setWearFilter(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-sm"
              >
                {WEARS.map((w) => (
                  <option key={w} value={w}>{w === "All" ? "All Wears" : w}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Live status */}
      <section className="border-b border-gray-50 bg-gray-50/50">
        <div className="container-main py-2 flex items-center gap-3 text-[11px]">
          {isLive ? (
            <>
              <Wifi className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-600 font-semibold">LIVE DEALS</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 text-gray-400" />
              <span className="text-gray-400">Loading...</span>
            </>
          )}
          {lastUpdated && (
            <span className="text-gray-400 flex items-center gap-1 ml-auto">
              <Clock className="h-3 w-3" /> Updated {lastUpdated}
              <button onClick={() => fetchDeals()} className="ml-1 text-gray-400 hover:text-gray-600">
                <RefreshCw className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-6">
        <div className="container-main">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
              <span className="ml-3 text-sm text-gray-500">Finding the best deals...</span>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">{items.length} deals found</p>

              <div className="space-y-2">
                {displayed.map((item, idx) => {
                  const pct = savingsPct(item.steamPrice, item.lowestPrice);
                  const bestMp = item.bestMarket ? MARKETPLACE_INFO[item.bestMarket] : null;

                  return (
                    <div
                      key={item.name}
                      className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Rank + skin info */}
                        <div className="flex items-center gap-3 lg:w-72 flex-shrink-0">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500 flex-shrink-0">
                            {idx + 1}
                          </span>
                          {item.image ? (
                            <div className="h-12 w-12 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="h-full w-full object-contain"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-gray-300 text-white font-bold flex-shrink-0">
                              {item.weapon.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate text-sm">{item.weapon} | {item.skin}</p>
                            <span className="text-xs text-gray-500">{item.wear}</span>
                          </div>
                        </div>

                        {/* Prices comparison */}
                        <div className="flex items-center gap-4 flex-1">
                          {/* Steam price (crossed out if savings) */}
                          <div className="text-center">
                            <p className="text-[10px] text-gray-400 uppercase font-semibold">Steam</p>
                            <p className={`text-sm font-medium ${pct > 0 ? "text-gray-400 line-through" : "text-gray-700"}`}>
                              {formatPrice(item.steamPrice)}
                            </p>
                          </div>

                          {/* Arrow */}
                          {pct > 0 && (
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-emerald-600 font-bold">-{pct}%</span>
                              <ArrowDown className="h-3 w-3 text-emerald-500" />
                            </div>
                          )}

                          {/* Best price */}
                          <div className="text-center">
                            <p className="text-[10px] uppercase font-semibold" style={{ color: bestMp?.color ?? "#666" }}>
                              {bestMp?.name ?? "Best"}
                            </p>
                            <p className="text-sm font-bold text-emerald-600">{formatPrice(item.lowestPrice)}</p>
                          </div>

                          {/* Savings amount */}
                          {(item.bestSavingsVsSteam ?? 0) > 0.5 && (
                            <div className="rounded-full bg-emerald-100 px-3 py-1">
                              <p className="text-xs font-bold text-emerald-700">
                                Save {formatPrice(item.bestSavingsVsSteam)}
                              </p>
                            </div>
                          )}

                          {/* Volume badge for trending tab */}
                          {tab === "trending" && item.sold24h > 0 && (
                            <div className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1">
                              <Flame className="h-3 w-3 text-orange-500" />
                              <span className="text-xs font-bold text-orange-700">{item.sold24h.toLocaleString()} sold/24h</span>
                            </div>
                          )}
                        </div>

                        {/* Buy CTA */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {bestMp && (
                            <a
                              href={`/go/cs2/${item.bestMarket}?from=deals`}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              className="flex items-center gap-1 rounded-lg px-4 py-2.5 text-xs font-semibold text-white transition-colors"
                              style={{ backgroundColor: bestMp.color }}
                            >
                              <ShoppingCart className="h-3.5 w-3.5" /> Buy on {bestMp.name}
                            </a>
                          )}
                          <Link
                            href={`/cs2/prices?q=${encodeURIComponent(item.weapon + " " + item.skin)}`}
                            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                          >
                            Compare <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {displayLimit < items.length && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setDisplayLimit((prev) => prev + 50)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Load More ({items.length - displayLimit} remaining)
                  </button>
                </div>
              )}

              {items.length === 0 && !loading && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
                  <p className="text-gray-500">
                    {tab === "undervalued"
                      ? "No undervalued skins found right now. Check back soon!"
                      : "No deals match your search. Try a different query."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* SEO prose */}
      <section className="border-t border-gray-100 bg-gray-50 py-10">
        <div className="container-main max-w-3xl">
          <h2 className="text-xl font-bold text-gray-900 mb-4">How We Find CS2 Skin Deals</h2>
          <div className="prose prose-gray prose-sm max-w-none">
            <p>
              Our deals engine compares real-time prices across every major CS2 skin marketplace including CSFloat,
              Skinport, Buff163, DMarket, and the Steam Community Market. We refresh prices every 10 minutes
              to catch price drops as they happen.
            </p>
            <p>
              The &ldquo;Biggest Savings&rdquo; tab shows skins where the cheapest third-party marketplace price is
              significantly lower than the Steam Market price — so you can see exactly how much you save by
              shopping off-Steam. The &ldquo;Most Traded&rdquo; tab highlights the most liquid skins, and
              &ldquo;Undervalued&rdquo; surfaces skins where buy orders are within 15% of the lowest listing
              price — a potential indicator of rising demand.
            </p>
            <p>
              All &ldquo;Buy&rdquo; links go through our affiliate tracking. We may earn a small commission
              at no extra cost to you. This is how we keep LootBoxes.com free.
            </p>
          </div>
        </div>
      </section>

      {/* Affiliate disclosure */}
      <div className="border-t border-gray-100 bg-gray-50/70">
        <div className="container-main py-4">
          <p className="text-[11px] text-gray-400 leading-relaxed text-center">
            <span className="font-semibold text-gray-500">Affiliate Disclosure:</span>{" "}
            Some links on this page are affiliate links. LootBoxes.com may earn a commission
            if you make a purchase, at no extra cost to you.
          </p>
        </div>
      </div>
    </div>
  );
}
