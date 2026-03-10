"use client";

import Link from "next/link";
import type { GameRowData } from "@/lib/game-normalizer";
import { formatDate, formatPrice } from "@/lib/utils";
import { ArrowRight, Calendar } from "lucide-react";
import StoreIcon from "@/components/ui/StoreIcon";

interface SteamHoverPreviewProps {
  game: GameRowData;
}

export default function SteamHoverPreview({ game }: SteamHoverPreviewProps) {
  const previewImage = game.screenshot_image || game.cover_image;
  const genres = game.genres?.slice(0, 6) || [];
  const price = game.price ?? game.bestPrice;
  const store = game.store ?? game.bestStore;
  const hasDiscount = (game.discount_pct ?? 0) > 0;

  return (
    <div className="w-[340px] rounded-lg bg-[#1b2838] shadow-2xl border border-[#3d6b99]/40 overflow-hidden">
      {/* Large screenshot */}
      {previewImage && (
        <div className="w-full overflow-hidden bg-[#0e1a26]">
          <img
            src={previewImage}
            alt={game.title}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-3">
        {/* Title */}
        <h4 className="text-sm font-semibold text-white leading-tight mb-2">
          {game.title}
        </h4>

        {/* Review / Metacritic line */}
        {game.metacritic && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] text-gray-400 dark:text-gray-500">Overall Reviews:</span>
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                game.metacritic >= 75
                  ? "bg-[#66C0F4]/20 text-[#66C0F4]"
                  : game.metacritic >= 50
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {game.metacritic >= 75
                ? "Very Positive"
                : game.metacritic >= 50
                ? "Mixed"
                : "Mostly Negative"}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">({game.metacritic})</span>
          </div>
        )}

        {/* Release date */}
        {game.release_date && (
          <div className="flex items-center gap-1.5 mb-2">
            <Calendar className="h-3 w-3 text-gray-500 dark:text-gray-400" />
            <span className="text-[11px] text-gray-400 dark:text-gray-500">Release Date:</span>
            <span className="text-[11px] text-[#8F98A0]">{formatDate(game.release_date)}</span>
          </div>
        )}

        {/* Genre tags — Steam dark style */}
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {genres.map((genre) => (
              <span
                key={genre}
                className="rounded bg-[#3d6b99]/30 px-2 py-0.5 text-[10px] font-medium text-[#67C1F5]"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Price bar at bottom */}
        {price != null && (
          <div className="flex items-center justify-between bg-black/20 rounded px-2 py-1.5 mb-2">
            <div className="flex items-center gap-1.5">
              {hasDiscount && (
                <span className="rounded bg-[#4c6b22] px-1.5 py-0.5 text-[12px] font-bold text-[#a4d007]">
                  -{Math.round(game.discount_pct!)}%
                </span>
              )}
              <div>
                {hasDiscount && game.original_price != null && (
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 line-through mr-1.5">
                    {formatPrice(game.original_price, game.currency)}
                  </span>
                )}
                <span className="text-[13px] font-medium text-white">
                  {formatPrice(price, game.currency)}
                </span>
              </div>
            </div>
            {store && <StoreIcon store={store} size="sm" />}
          </div>
        )}

        {/* View Game link */}
        <Link
          href={`/games/${game.slug}`}
          className="flex items-center justify-center gap-1 rounded bg-[#67C1F5]/20 hover:bg-[#67C1F5]/30 px-3 py-1.5 text-[11px] font-semibold text-[#67C1F5] transition-colors"
        >
          View Game
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
