"use client";

import { useState, useMemo } from "react";
import {
  TrendingDown,
  Sparkles,
  Flame,
  Tag,
  DollarSign,
  Search,
  X,
  Swords,
  Gamepad2,
  Crosshair,
  Globe,
  Car,
  Puzzle,
  Users,
  Trophy,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import SteamGameRow, { CompactGameCard } from "@/components/games/SteamGameRow";
import { normalizeDeal } from "@/lib/game-normalizer";

/* ── Price / discount tabs ── */
const TABS = [
  { id: "all", label: "All Deals", icon: Flame },
  { id: "historic", label: "Historic Lows", icon: TrendingDown },
  { id: "under10", label: "Under $10", icon: DollarSign },
  { id: "under20", label: "Under $20", icon: Tag },
  { id: "big", label: "50%+ Off", icon: Sparkles },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ── Sort options ── */
const SORT_OPTIONS = [
  { id: "discount", label: "Best Discount" },
  { id: "price_asc", label: "Price: Low → High" },
  { id: "price_desc", label: "Price: High → Low" },
  { id: "trending", label: "Trending" },
] as const;

type SortId = (typeof SORT_OPTIONS)[number]["id"];

/* ── Genre pills ── */
const GENRE_OPTIONS = [
  { id: "action", label: "Action", icon: Swords },
  { id: "rpg", label: "RPG", icon: Gamepad2 },
  { id: "fps", label: "FPS", icon: Crosshair },
  { id: "open-world", label: "Open World", icon: Globe },
  { id: "racing", label: "Racing", icon: Car },
  { id: "strategy", label: "Strategy", icon: Puzzle },
  { id: "multiplayer", label: "Multiplayer", icon: Users },
  { id: "sports", label: "Sports", icon: Trophy },
] as const;

/* ── helpers ── */
function normalise(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function gameMatchesGenre(genres: string[] | null | undefined, genreId: string): boolean {
  if (!genres || genres.length === 0) return false;
  const target = normalise(genreId);
  return genres.some((g) => {
    const n = normalise(g);
    if (n === target) return true;
    if (target === "rpg" && (n.includes("role") || n.includes("rpg"))) return true;
    if (target === "fps" && (n.includes("shooter") || n.includes("fps"))) return true;
    if (target === "openworld" && (n.includes("openworld") || n.includes("adventure") || n.includes("sandbox"))) return true;
    if (target === "action" && n.includes("action")) return true;
    if (target === "racing" && n.includes("racing")) return true;
    if (target === "strategy" && n.includes("strategy")) return true;
    if (target === "multiplayer" && (n.includes("multiplayer") || n.includes("mmo"))) return true;
    if (target === "sports" && n.includes("sport")) return true;
    return false;
  });
}

function deriveInitialTab(filter: string | null): TabId {
  if (filter === "historic") return "historic";
  if (filter === "under10") return "under10";
  if (filter === "under20") return "under20";
  if (filter === "big") return "big";
  return "all";
}

/* ── Component ── */

interface DealsHubClientProps {
  deals: any[];
  initialGenre: string | null;
  initialFilter: string | null;
}

export default function DealsHubClient({
  deals,
  initialGenre,
  initialFilter,
}: DealsHubClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>(deriveInitialTab(initialFilter));
  const [activeGenre, setActiveGenre] = useState<string | null>(initialGenre);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortId>("discount");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [visibleCount, setVisibleCount] = useState(40);

  const filtered = useMemo(() => {
    let result = deals;

    if (search.length >= 2) {
      const q = search.toLowerCase();
      result = result.filter((d: any) =>
        (d.games?.title || "").toLowerCase().includes(q)
      );
    }

    switch (activeTab) {
      case "historic":
        result = result.filter((d: any) => d.is_historic_low);
        break;
      case "under10":
        result = result.filter((d: any) => d.price <= 10);
        break;
      case "under20":
        result = result.filter((d: any) => d.price <= 20);
        break;
      case "big":
        result = result.filter((d: any) => d.discount_pct >= 50);
        break;
      case "all":
      default:
        break;
    }

    if (activeGenre) {
      result = result.filter((d: any) => gameMatchesGenre(d.games?.genres, activeGenre));
    }

    const sorted = [...result].sort((a: any, b: any) => {
      switch (sortBy) {
        case "price_asc":
          return (a.price || 0) - (b.price || 0);
        case "price_desc":
          return (b.price || 0) - (a.price || 0);
        case "trending":
          return (b.games?.hot_score || 0) - (a.games?.hot_score || 0);
        case "discount":
        default:
          return (b.discount_pct || 0) - (a.discount_pct || 0);
      }
    });

    return sorted;
  }, [deals, search, activeTab, activeGenre, sortBy]);

  const visibleDeals = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div>
      {/* Search + Sort row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setVisibleCount(40); }}
            placeholder="Search games..."
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-9 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
            {SORT_OPTIONS.find((s) => s.id === sortBy)?.label}
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>
          {showSortMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setSortBy(opt.id); setShowSortMenu(false); }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      sortBy === opt.id
                        ? "bg-brand-50 text-brand-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="mt-4 flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-1 scrollbar-hide">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setVisibleCount(40); }}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? "text-brand-600" : ""}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Genre filter pills */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mr-1">Genre:</span>
        {GENRE_OPTIONS.map((genre) => {
          const Icon = genre.icon;
          const isActive = activeGenre === genre.id;
          return (
            <button
              key={genre.id}
              onClick={() => { setActiveGenre(isActive ? null : genre.id); setVisibleCount(40); }}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Icon className="h-3 w-3" />
              {genre.label}
              {isActive && <X className="h-3 w-3 ml-0.5" />}
            </button>
          );
        })}
        {activeGenre && (
          <button onClick={() => setActiveGenre(null)} className="text-xs text-gray-400 hover:text-gray-600 underline ml-1">
            Clear
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">{Math.min(visibleCount, filtered.length)}</span> of{" "}
          <span className="font-medium text-gray-900">{filtered.length}</span> deals
          {activeGenre && (
            <span className="text-gray-400">
              {" "}in <span className="font-medium text-brand-600">{GENRE_OPTIONS.find(g => g.id === activeGenre)?.label}</span>
            </span>
          )}
        </p>
      </div>

      {/* Deals list */}
      {filtered.length === 0 ? (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">
            No deals match this filter.{activeGenre ? " Try removing the genre filter or switching tabs!" : " Try another tab!"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop: Steam-style rows */}
          <div className="mt-4 hidden md:flex md:flex-col gap-1.5">
            {visibleDeals.map((deal: any) => (
              <SteamGameRow key={deal.id} game={normalizeDeal(deal)} />
            ))}
          </div>

          {/* Mobile: compact card grid */}
          <div className="mt-4 grid gap-4 grid-cols-2 md:hidden">
            {visibleDeals.map((deal: any) => (
              <CompactGameCard key={deal.id} game={normalizeDeal(deal)} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 40)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all"
              >
                Load More Deals
                <span className="text-xs text-gray-400">({filtered.length - visibleCount} remaining)</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
