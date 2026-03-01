"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";
import StoreIcon from "@/components/ui/StoreIcon";

const TABS = [
  { id: "top", label: "Top Picks", icon: Sparkles },
  { id: "historic", label: "Historic Lows", icon: TrendingDown },
  { id: "under10", label: "Under $10", icon: DollarSign },
  { id: "under20", label: "Under $20", icon: Tag },
  { id: "all", label: "All Deals", icon: Flame },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface DealsFilterProps {
  deals: any[];
}

export default function DealsFilter({ deals }: DealsFilterProps) {
  const [activeTab, setActiveTab] = useState<TabId>("top");

  const filtered = deals.filter((deal: any) => {
    switch (activeTab) {
      case "top":
        return deal.discount_pct >= 40;
      case "historic":
        return deal.is_historic_low;
      case "under10":
        return deal.price <= 10;
      case "under20":
        return deal.price <= 20;
      case "all":
      default:
        return true;
    }
  });

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-1 scrollbar-hide">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

      {/* Results count */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">{filtered.length}</span> deals
        </p>
      </div>

      {/* Deals grid */}
      {filtered.length === 0 ? (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">No deals match this filter. Try another tab!</p>
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
                className={`group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:shadow-md ${
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
                      className="truncate text-sm font-semibold text-gray-900 group-hover:text-brand-600"
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
                    <span className="text-lg font-bold text-gray-900">
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
                    rel="noopener noreferrer"
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
