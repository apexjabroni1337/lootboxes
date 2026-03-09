"use client";

import Link from "next/link";
import type { GameRowData } from "@/lib/game-normalizer";
import { formatPrice, formatDate } from "@/lib/utils";
import StoreIcon from "@/components/ui/StoreIcon";
import GameAvatar from "@/components/ui/GameAvatar";
import SteamHoverPreview from "./SteamHoverPreview";
import { Monitor, Calendar, TrendingDown } from "lucide-react";

interface SteamGameRowProps {
  game: GameRowData;
  rank?: number;
}

export default function SteamGameRow({ game, rank }: SteamGameRowProps) {
  const image = game.cover_image || game.screenshot_image;
  const genres = game.genres?.slice(0, 4) || [];
  const hasDiscount = (game.discount_pct ?? 0) > 0;
  const price = game.price ?? game.bestPrice;
  const store = game.store ?? game.bestStore;

  return (
    <div className="group/row relative">
      <Link
        href={`/games/${game.slug}`}
        className="flex h-[45px] items-center rounded-sm bg-[#1b2838]/60 hover:bg-[#415a76] transition-colors duration-100 overflow-hidden"
      >
        {/* Left: Small capsule banner */}
        <div className="w-[120px] h-[45px] flex-shrink-0 overflow-hidden bg-[#1b2838]">
          {image ? (
            <img
              src={image}
              alt={game.title}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                // Hide broken image and show fallback
                const target = e.currentTarget;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="h-full w-full bg-gradient-to-br from-gray-700 to-gray-800 items-center justify-center"
            style={{ display: image ? "none" : "flex" }}
          >
            <GameAvatar gameName={game.title} size="sm" />
          </div>
        </div>

        {/* Middle: Title + tags inline */}
        <div className="flex flex-1 items-center gap-3 px-3 min-w-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              {rank != null && (
                <span className="flex-shrink-0 text-[9px] font-bold text-blue-300/50">#{rank}</span>
              )}
              <h3 className="text-[13px] text-[#c7d5e0] truncate">{game.title}</h3>
            </div>
            <div className="flex items-center gap-1 mt-px">
              <Monitor className="h-2.5 w-2.5 text-[#556772] flex-shrink-0" />
              {genres.length > 0 && (
                <span className="text-[10px] text-[#556772] truncate">
                  {genres.join(", ")}
                </span>
              )}
              {game.release_date && (
                <span className="flex-shrink-0 text-[10px] text-[#556772] ml-1">
                  {formatDate(game.release_date)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Price */}
        <div className="flex flex-shrink-0 items-center gap-1.5 pr-3 h-full">
          {game.isComingSoon ? (
            <span className="text-[11px] text-[#67C1F5]">Coming Soon</span>
          ) : price != null ? (
            <>
              {hasDiscount && (
                <span className="flex items-center justify-center bg-[#4c6b22] px-1.5 h-[28px] text-[13px] font-bold text-[#a4d007] leading-none rounded-sm">
                  -{Math.round(game.discount_pct!)}%
                </span>
              )}
              <div className="bg-[#0d1a26] px-2 h-[28px] flex flex-col justify-center rounded-sm">
                {hasDiscount && game.original_price != null && (
                  <span className="text-[9px] text-[#556772] line-through leading-none">
                    {formatPrice(game.original_price, game.currency)}
                  </span>
                )}
                <span className="text-[12px] text-[#acdbf5] leading-none">
                  {formatPrice(price, game.currency)}
                </span>
              </div>
              {store && <StoreIcon store={store} size="sm" />}
              {game.is_historic_low && <TrendingDown className="h-3 w-3 text-emerald-400" />}
            </>
          ) : game.dealCount && game.dealCount > 0 ? (
            <span className="text-[10px] text-[#556772]">{game.dealCount} deals</span>
          ) : (
            <span className="text-[10px] text-[#3b5162]">No deals</span>
          )}
        </div>
      </Link>

      {/* Hover preview */}
      <div className="absolute right-0 top-0 z-50 hidden group-hover/row:block pointer-events-none" style={{ transform: "translateX(calc(100% + 12px))" }}>
        <div className="pointer-events-auto">
          <SteamHoverPreview game={game} />
        </div>
      </div>
    </div>
  );
}

/**
 * Mobile-friendly compact card fallback (used below md: breakpoint)
 */
export function CompactGameCard({ game }: { game: GameRowData }) {
  const image = game.cover_image || game.screenshot_image;
  const genres = game.genres?.slice(0, 2) || [];
  const price = game.price ?? game.bestPrice;
  const hasDiscount = (game.discount_pct ?? 0) > 0;

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={game.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <GameAvatar gameName={game.title} size="sm" aspectRatio="video" />
        )}

        {hasDiscount && (
          <div className="absolute top-1.5 right-1.5">
            <span className="rounded bg-[#4c6b22] px-1 py-0.5 text-[10px] font-bold text-[#a4d007]">
              -{Math.round(game.discount_pct!)}%
            </span>
          </div>
        )}

        {game.metacritic && (
          <div className="absolute top-1.5 left-1.5">
            <span
              className={`rounded px-1 py-0.5 text-[9px] font-bold text-white ${
                game.metacritic >= 75
                  ? "bg-emerald-600"
                  : game.metacritic >= 50
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
            >
              {game.metacritic}
            </span>
          </div>
        )}
      </div>

      <div className="p-2">
        <h3 className="text-xs font-medium text-gray-900 line-clamp-1 group-hover:text-brand-600">
          {game.title}
        </h3>

        {genres.length > 0 && (
          <p className="mt-0.5 text-[10px] text-gray-400 truncate">
            {genres.join(", ")}
          </p>
        )}

        <div className="mt-1 flex items-center justify-between">
          {price != null ? (
            <div className="flex items-center gap-1">
              {(game.store ?? game.bestStore) && (
                <StoreIcon store={(game.store ?? game.bestStore)!} size="sm" />
              )}
              <span className="text-xs font-bold text-gray-900">
                {formatPrice(price, game.currency)}
              </span>
            </div>
          ) : game.isComingSoon ? (
            <span className="text-[10px] text-gray-500">Coming Soon</span>
          ) : (
            <span className="text-[10px] text-gray-400">No deals</span>
          )}
        </div>
      </div>
    </Link>
  );
}
