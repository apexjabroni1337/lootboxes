"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrice, formatDiscount, timeAgo } from "@/lib/utils";
import { STORES } from "@/lib/types";
import {
  TrendingDown,
  ExternalLink,
  Clock,
  Sparkles,
  Flame,
  Tag,
  Star,
  DollarSign,
  X,
  Swords,
  Gamepad2,
  Crosshair,
  Globe,
  Car,
  Puzzle,
  Users,
  Trophy,
} from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";
import StoreIcon from "@/components/ui/StoreIcon";

/* ── Price / discount tabs ── */
const TABS = [
  { id: "top", label: "Top Picks", icon: Sparkles },
  { id: "historic", label: "Historic Lows", icon: TrendingDown },
  { id: "under10", label: "Under $10", icon: DollarSign },
  { id: "under20", label: "Under $20", icon: Tag },
  { id: "all", label: "All Deals", icon: Flame },
] as const;

type TabId = (typeof TABS)[number]["id"];

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

/* ── helpers to match genre strings loosely ── */
function normalise(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function gameMatchesGenre(genres: string[] | null | undefined, genreId: string): boolean {
  if (!genres || genres.length === 0) return false;
  const target = normalise(genreId);
  return genres.some((g) => {
    const n = normalise(g);
    // exact match or substring — e.g. "role-playing" matches "rpg" via alias
    if (n === target) return true;
    // common aliases
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

/* ── Derive initial tab from quick-filter URL params ── */
function deriveInitialTab(
  quickFilter: string | null,
  maxPrice: number | null,
  minDiscount: number | null,
): TabId {
  if (quickFilter === "historic") return "historic";
  if (maxPrice === 10) return "under10";
  if (maxPrice === 20) return "under20";
  if (minDiscount && minDiscount >= 50) return "top";
  return "top";
}

/* ── Component ── */

interface DealsFilterProps {
  deals: any[];
  initialGenre?: string | null;
  initialMaxPrice?: number | null;
  initialMinDiscount?: number | null;
  initialQuickFilter?: string | null;
}

export default function DealsFilter({
  deals,
  initialGenre = null,
  initialMaxPrice = null,
  initialMinDiscount = null,
  initialQuickFilter = null,
}: DealsFilterProps) {
  const [activeTab, setActiveTab] = useState<TabId>(
    deriveInitialTab(initialQuickFilter, initialMaxPrice, initialMinDiscount)
  );
  const [activeGenre, setActiveGenre] = useState<string | null>(initialGenre);

  const filtered = useMemo(() => {
    let result = deals;

    // Tab filter
    switch (activeTab) {
      case "top":
        result = result.filter((d: any) => d.discount_pct >= 40);
        break;
      case "historic":
        result = result.filter((d: any) => d.is_historic_low);
        break;
      case "under10":
        result = result.filter((d: any) => d.price <= 10);
        break;
      case "under20":
        result = result.filter((d: any) => d.price <= 20);
        break;
      case "all":
      default:
        break;
    }

    // Genre filter
    if (activeGenre) {
      result = result.filter((d: any) => gameMatchesGenre(d.games?.genres, activeGenre));
    }

    return result;
  }, [deals, activeTab, activeGenre]);

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1 scrollbar-hide">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
              onClick={() => setActiveGenre(isActive ? null : genre.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="h-3 w-3" />
              {genre.label}
              {isActive && <X className="h-3 w-3 ml-0.5" />}
            </button>
          );
        })}
        {activeGenre && (
          <button
            onClick={() => setActiveGenre(null)}
            className="text-xs text-gray-400 hover:text-gray-600 underline ml-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900 dark:text-white">{filtered.length}</span> deals
          {activeGenre && (
            <span className="text-gray-400">
              {" "}in <span className="font-medium text-brand-600">{GENRE_OPTIONS.find(g => g.id === activeGenre)?.label}</span>
            </span>
          )}
        </p>
      </div>

      {/* Deals grid */}
      {filtered.length === 0 ? (
        <div className="mt-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-12 text-center">
          <p className="text-gray-500">No deals match this filter.{activeGenre ? " Try removing the genre filter or switching tabs!" : " Try another tab!"}</p>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {filtered.map((deal: any) => {
            const game = deal.games;
            const storeInfo = STORES[deal.store] || { name: deal.store, color: "#666" };
            const hasDiscount = deal.discount_pct > 0;
            const screenshotImage = game?.screenshot_image;
            const coverImage = game?.cover_image;

            return (
              <div
                key={deal.id}
                className={`group flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 transition-all hover:shadow-md ${
                  deal.is_historic_low ? "ring-1 ring-brand-200" : ""
                }`}
              >
                {/* Game image */}
                <div className="hidden h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg sm:block">
                  {screenshotImage || coverImage ? (
                    <img
                      src={screenshotImage || coverImage}
                      alt={game?.title || "Game"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <GameAvatar
                      gameName={game?.title || "Unknown"}
                      size="sm"
                      aspectRatio="video"
                    />
                  )}
                </div>

                {/* Game info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/games/${game?.slug}`}
                      className="truncate text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand-600"
                    >
                      {game?.title || "Unknown Game"}
                    </Link>
                    {deal.is_historic_low && (
                      <span className="flex flex-shrink-0 items-center gap-0.5 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                        <TrendingDown className="h-2.5 w-2.5" />
                        Historic Low
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <StoreIcon store={deal.store} size="sm" />
                    <span>{storeInfo.name}</span>
                    {deal.expires_at && (
                      <>
                        <span className="text-gray-300">·</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-3 w-3" />
                          {timeAgo(deal.expires_at)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="flex flex-shrink-0 items-center gap-3">
                  <div className="text-right">
                    {hasDiscount && (
                      <span className="block text-xs text-gray-400 line-through">
                        {formatPrice(deal.original_price, deal.currency)}
                      </span>
                    )}
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatPrice(deal.price, deal.currency)}
                    </span>
                  </div>
                  {hasDiscount && (
                    <span className="rounded-lg bg-success-600 px-2 py-1 text-xs font-bold text-white">
                      {formatDiscount(deal.discount_pct)}
                    </span>
                  )}
                  <a
                    href={`/go/${deal.id}`}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex items-center gap-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    Get Deal
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
