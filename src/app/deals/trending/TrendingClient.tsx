"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatPrice, formatDiscount, timeAgo } from "@/lib/utils";
import { STORES } from "@/lib/types";
import {
  TrendingDown,
  ExternalLink,
  Clock,
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
import WishlistButton from "@/components/deals/WishlistButton";

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

interface Props {
  deals: any[];
}

export default function TrendingClient({ deals }: Props) {
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(24);

  const filtered = useMemo(() => {
    if (!activeGenre) return deals;
    return deals.filter((d: any) => gameMatchesGenre(d.games?.genres, activeGenre));
  }, [deals, activeGenre]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">More Trending Deals</h2>
        <p className="text-sm text-gray-500">{filtered.length} games</p>
      </div>

      {/* Genre filter pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mr-1">Genre:</span>
        {GENRE_OPTIONS.map((genre) => {
          const Icon = genre.icon;
          const isActive = activeGenre === genre.id;
          return (
            <button
              key={genre.id}
              onClick={() => { setActiveGenre(isActive ? null : genre.id); setVisibleCount(24); }}
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
          <button
            onClick={() => setActiveGenre(null)}
            className="text-xs text-gray-400 hover:text-gray-600 underline ml-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">No trending deals in this genre. Try another genre or check back later!</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((deal: any, idx: number) => {
              const game = deal.games;
              const hasDeal = deal.hasDeal !== false && deal.store;
              const storeInfo = hasDeal ? (STORES[deal.store] || { name: deal.store, color: "#666" }) : null;
              const bgImage = game?.screenshot_image || game?.cover_image;
              const hasDiscount = hasDeal && deal.discount_pct > 0;

              return (
                <div
                  key={deal.id}
                  className={`group flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-lg ${
                    deal.is_historic_low ? "border-brand-200 ring-1 ring-brand-100" : "border-gray-200"
                  }`}
                >
                  {/* Game artwork */}
                  <div className="relative overflow-hidden bg-gray-100">
                    {bgImage ? (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={bgImage}
                          alt={game?.title || "Game"}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <GameAvatar gameName={game?.title || "Unknown"} size="md" aspectRatio="video" />
                    )}

                    {/* Rank */}
                    <div className="absolute top-2 left-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-sm">
                        #{idx + 4}
                      </span>
                    </div>

                    {hasDiscount && (
                      <div className="absolute right-2 top-2">
                        <span className="rounded-lg bg-success-600 px-2 py-1 text-sm font-bold text-white shadow-md">
                          {formatDiscount(deal.discount_pct)}
                        </span>
                      </div>
                    )}

                    {deal.is_historic_low && (
                      <div className="absolute bottom-2 left-2">
                        <span className="flex items-center gap-1 rounded-lg bg-brand-600 px-2 py-1 text-[10px] font-semibold text-white shadow-md">
                          <TrendingDown className="h-3 w-3" />
                          Historic Low
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Store bar — only show if game has a deal */}
                  {hasDeal && storeInfo ? (
                    <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
                      <StoreIcon store={deal.store} size="sm" />
                      <span className="text-xs font-medium text-gray-600">{storeInfo.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
                      <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Trending</span>
                      {game?.metacritic && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          game.metacritic >= 75 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                        }`}>
                          Metacritic {game.metacritic}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
                    <Link
                      href={`/games/${game?.slug || deal.game_id}`}
                      className="line-clamp-1 text-sm font-semibold text-gray-900 hover:text-brand-600"
                    >
                      {game?.title || "Unknown Game"}
                    </Link>

                    {hasDeal ? (
                      <>
                        <div className="mt-2 flex items-baseline gap-2">
                          {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(deal.original_price, deal.currency)}
                            </span>
                          )}
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(deal.price, deal.currency)}
                          </span>
                        </div>

                        <a
                          href={`/go/${deal.id}`}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                        >
                          Get Deal
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </>
                    ) : (
                      <>
                        <p className="mt-1 text-xs text-gray-400">No active deals</p>
                        <Link
                          href={`/games/${game?.slug}`}
                          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                        >
                          View Game
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 24)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all"
              >
                Load More
                <span className="text-xs text-gray-400">({filtered.length - visibleCount} remaining)</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
