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
} from "lucide-react";

/* ── Types matching our API response ── */
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
type SortKey = "name" | "cheapest" | "expensive" | "savings";

const RARITY_COLORS: Record<string, string> = {
  Consumer: "#b0c3d9", Industrial: "#5e98d9", "Mil-Spec": "#4b69ff",
  Restricted: "#8847ff", Classified: "#d32ce6", Covert: "#eb4b4b",
  Contraband: "#e4ae39", Extraordinary: "#e4ae39",
};

const OTHER_MARKETPLACES = [
  { name: "CSFloat", dealId: "csfloat", color: "#4f8df0", fee: "2%" },
  { name: "Buff163", dealId: "buff163", color: "#ff6b35", fee: "2.5%" },
  { name: "DMarket", dealId: "dmarket", color: "#00c9a7", fee: "3%" },
  { name: "Steam", dealId: "steam", color: "#1b2838", fee: "15%" },
];

function formatPrice(price: number | null): string {
  if (price == null || price === 0) return "—";
  return "$" + price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function savingsPct(marketVal: number | null, skinportPrice: number | null): string {
  if (!marketVal || !skinportPrice || marketVal <= skinportPrice) return "";
  return `-${(((marketVal - skinportPrice) / marketVal) * 100).toFixed(0)}%`;
}

export default function CS2PricesPage() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("expensive");
  const [wearFilter, setWearFilter] = useState<string>("All");
  const [skins, setSkins] = useState<SkinPrice[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(50);

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "500",
        sort: sortBy === "savings" ? "expensive" : sortBy,
        minPrice: "1",
      });
      if (query) params.set("q", query);
      if (wearFilter !== "All") params.set("wear", wearFilter);

      const res = await fetch(`/api/cs2/prices?${params.toString()}`);
      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      let items: SkinPrice[] = data.items || [];

      // Client-side sort by savings if needed
      if (sortBy === "savings") {
        items.sort((a, b) => b.savings - a.savings);
      }

      setSkins(items);
      setTotalCount(data.total || 0);
      setIsLive(items.length > 0);
      setDisplayLimit(50);
    } catch {
      console.warn("Failed to fetch live prices");
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, [query, sortBy, wearFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchPrices(), query ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchPrices]);

  const displayed = useMemo(() => skins.slice(0, displayLimit), [skins, displayLimit]);

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
            Live CS2 skin prices from Skinport with market value comparison.
            {totalCount > 0 && ` Tracking ${totalCount.toLocaleString()} skins.`}
            {" "}Find deals and compare across marketplaces.
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
                <span className="text-gray-400 ml-1">from Skinport — updated every 15 min</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 text-gray-400" />
                <span className="text-gray-400">Loading prices...</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 ml-auto text-[11px] text-gray-400">
            <span>Also check prices on:</span>
            {OTHER_MARKETPLACES.map((mp) => (
              <a
                key={mp.dealId}
                href={`/go/cs2/${mp.dealId}?from=prices-bar`}
                target="_blank"
                rel="noopener noreferrer"
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
              <span className="ml-3 text-sm text-gray-500">Loading live prices...</span>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {skins.length === totalCount
                  ? `${totalCount.toLocaleString()} skins found`
                  : `Showing ${skins.length} of ${totalCount.toLocaleString()} skins`}
              </p>

              {/* Table header */}
              <div className="hidden lg:flex items-center gap-4 px-5 py-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-2">
                <div className="w-80">Skin</div>
                <div className="w-28 text-right">Skinport Price</div>
                <div className="w-28 text-right">Market Value</div>
                <div className="w-24 text-right">Savings</div>
                <div className="w-20 text-center">Listings</div>
                <div className="flex-1 text-right">Compare</div>
              </div>

              <div className="space-y-2">
                {displayed.map((skin) => {
                  const pct = savingsPct(skin.marketValue, skin.skinportPrice);
                  return (
                    <div
                      key={skin.name}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-3 sm:px-5 sm:py-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                        {/* Skin info */}
                        <div className="flex items-center gap-3 lg:w-80 flex-shrink-0">
                          <div
                            className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                            style={{ backgroundColor: RARITY_COLORS[skin.rarity] || "#666" }}
                          >
                            {skin.weapon.charAt(0)}
                          </div>
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

                        {/* Skinport Price */}
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

                        {/* Market Value */}
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

                        {/* Savings */}
                        <div className="lg:w-24 flex-shrink-0 flex lg:justify-end items-center gap-2 lg:gap-0">
                          <span className="text-[10px] text-gray-400 lg:hidden">Savings:</span>
                          {skin.savings > 0.5 ? (
                            <div className="text-right">
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                                {formatPrice(skin.savings)}
                              </span>
                              {pct && (
                                <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">{pct}</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </div>

                        {/* Quantity */}
                        <div className="lg:w-20 flex-shrink-0 flex lg:justify-center items-center gap-2 lg:gap-0">
                          <span className="text-[10px] text-gray-400 lg:hidden">Listings:</span>
                          <span className="text-xs text-gray-500">{skin.quantity > 0 ? skin.quantity : "—"}</span>
                        </div>

                        {/* Compare / Buy CTAs */}
                        <div className="flex-1 flex items-center gap-2 justify-end flex-wrap">
                          {skin.itemPage && (
                            <a
                              href={skin.itemPage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-white transition-colors"
                              style={{ backgroundColor: "#eb4b98" }}
                            >
                              <ShoppingCart className="h-3 w-3" /> Skinport
                            </a>
                          )}
                          {OTHER_MARKETPLACES.slice(0, 3).map((mp) => (
                            <a
                              key={mp.dealId}
                              href={`/go/cs2/${mp.dealId}?from=prices`}
                              target="_blank"
                              rel="noopener noreferrer"
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

              {/* Load more */}
              {displayLimit < skins.length && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setDisplayLimit((prev) => prev + 50)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Load More ({skins.length - displayLimit} remaining)
                  </button>
                </div>
              )}

              {skins.length === 0 && !loading && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
                  <p className="text-gray-500">No skins match your search. Try a different name or wear condition.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="border-t border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50 py-10">
        <div className="container-main text-center">
          <Star className="h-8 w-8 text-orange-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900">Get Price Drop Alerts</h2>
          <p className="text-sm text-gray-600 mt-2 mb-6 max-w-md mx-auto">
            Sign up to get notified when your favorite skins hit their lowest price.
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
            <a href="https://skinport.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Skinport</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
