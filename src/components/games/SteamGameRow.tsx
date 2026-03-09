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
        className="flex items-stretch rounded-md border border-gray-200 bg-gradient-to-r from-[#1b2838] to-[#2a475e] hover:from-[#1e3045] hover:to-[#305878] transition-all duration-200 hover:shadow-lg overflow-hidden"
      >
        {/* Left: Capsule image */}
        <div className="w-[230px] flex-shrink-0 overflow-hidden bg-[#1b2838]">
          {image ? (
            <img
              src={image}
              alt={game.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover/row:scale-105"
              loading="lazy"
            />
          ) : (
            <GameAvatar gameName={game.title} size="md" aspectRatio="video" />
          )}
        </div>

        {/* Middle: Game info */}
        <div className="flex flex-1 flex-col justify-center gap-1.5 px-4 py-3 min-w-0">
          <div className="flex items-center gap-2">
            {rank && (
              <span className="flex-shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-200">
                #{rank}
              </span>
            )}
            <h3 className="text-sm font-semibold text-white truncate">
              {game.title}
            </h3>
          </div>

          {/* Platform icons */}
          <div className="flex items-center gap-3">
            <Monitor className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
            {game.metacritic && (
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${
                  game.metacritic >= 75
                    ? "bg-emerald-500"
                    : game.metacritic >= 50
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
              >
                {game.metacritic}
              </span>
            )}
          </div>

          {/* Genre tags */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-blue-200/80"
                >
                  {genre}
                </span>
              ))}
              {game.release_date && (
                <span className="flex items-center gap-0.5 text-[10px] text-gray-400 ml-1">
                  <Calendar className="h-2.5 w-2.5" />
                  {formatDate(game.release_date)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Price section */}
        <div className="flex flex-shrink-0 items-center gap-2 px-4">
          {game.isComingSoon ? (
            <span className="text-xs font-medium text-blue-200">
              Coming Soon
            </span>
          ) : price != null ? (
            <>
              {/* Discount badge */}
              {hasDiscount && (
                <span className="rounded bg-emerald-500 px-2 py-1.5 text-sm font-bold text-white">
                  -{Math.round(game.discount_pct!)}%
                </span>
              )}

              <div className="text-right">
                {hasDiscount && game.original_price != null && (
                  <p className="text-[11px] text-gray-400 line-through">
                    {formatPrice(game.original_price, game.currency)}
                  </p>
                )}
                <p className="text-sm font-semibold text-white">
                  {formatPrice(price, game.currency)}
                </p>
              </div>

              {/* Store icon */}
              {store && (
                <div className="ml-1">
                  <StoreIcon store={store} size="sm" />
                </div>
              )}

              {/* Historic low badge */}
              {game.is_historic_low && (
                <TrendingDown className="h-3.5 w-3.5 text-emerald-400 ml-0.5" />
              )}
            </>
          ) : game.dealCount && game.dealCount > 0 ? (
            <span className="text-xs text-blue-200">
              {game.dealCount} {game.dealCount === 1 ? "deal" : "deals"}
            </span>
          ) : (
            <span className="text-[11px] text-gray-500">
              No deals
            </span>
          )}
        </div>
      </Link>

      {/* Hover preview — appears to the right, positioned absolutely */}
      <div className="absolute left-[calc(100%+8px)] top-0 z-50 hidden group-hover/row:block pointer-events-none">
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
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={game.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <GameAvatar gameName={game.title} size="md" aspectRatio="video" />
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-2 right-2">
            <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
              -{Math.round(game.discount_pct!)}%
            </span>
          </div>
        )}

        {/* Metacritic */}
        {game.metacritic && (
          <div className="absolute top-2 left-2">
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm ${
                game.metacritic >= 75
                  ? "bg-emerald-500"
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

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-brand-600">
          {game.title}
        </h3>

        {genres.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {genres.map((g) => (
              <span
                key={g}
                className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Price row */}
        <div className="mt-2 flex items-center justify-between">
          {price != null ? (
            <div className="flex items-center gap-1.5">
              {game.store ?? game.bestStore ? (
                <StoreIcon store={(game.store ?? game.bestStore)!} size="sm" />
              ) : null}
              <span className="text-sm font-bold text-gray-900">
                {formatPrice(price, game.currency)}
              </span>
            </div>
          ) : game.isComingSoon ? (
            <span className="text-xs text-gray-500">Coming Soon</span>
          ) : (
            <span className="text-xs text-gray-400">No deals</span>
          )}
        </div>
      </div>
    </Link>
  );
}
