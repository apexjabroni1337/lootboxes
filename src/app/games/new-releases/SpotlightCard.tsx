"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Calendar, Star, Gamepad2, Monitor, Smartphone, Globe, TrendingUp } from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";
import StoreIcon from "@/components/ui/StoreIcon";
import { formatDate, formatPrice } from "@/lib/utils";

interface SpotlightGame {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  screenshot_image: string | null;
  release_date: string | null;
  genres: string[] | null;
  platforms: string[] | null;
  metacritic: number | null;
  hot_score: number | null;
  description: string | null;
}

interface Props {
  game: SpotlightGame;
  deal: { price: number; store: string } | null;
}

function PlatformIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  if (p.includes("pc") || p.includes("win") || p.includes("mac") || p.includes("linux"))
    return <Monitor className="h-3 w-3" />;
  if (p.includes("playstation") || p.includes("xbox") || p.includes("switch"))
    return <Gamepad2 className="h-3 w-3" />;
  if (p.includes("ios") || p.includes("android") || p.includes("mobile"))
    return <Smartphone className="h-3 w-3" />;
  return <Globe className="h-3 w-3" />;
}

export default function SpotlightCard({ game, deal }: Props) {
  const [hovered, setHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bgImage = game.screenshot_image || game.cover_image;
  const genres = game.genres || [];
  const platforms = game.platforms || [];

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setHovered(true), 200);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setHovered(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Main card ── */}
      <Link
        href={`/games/${game.slug}`}
        className="group relative block overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {bgImage ? (
            <img
              src={bgImage}
              alt={game.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <GameAvatar gameName={game.title} size="md" aspectRatio="video" src={game.cover_image || undefined} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Release date badge */}
          {game.release_date && (
            <div className="absolute top-3 left-3">
              <span className="flex items-center gap-1 rounded-lg bg-white dark:bg-gray-950/90 px-2.5 py-1 text-[11px] font-semibold text-gray-700 dark:text-gray-200 backdrop-blur-sm shadow-sm">
                <Calendar className="h-3 w-3" />
                {formatDate(game.release_date)}
              </span>
            </div>
          )}

          {/* Metacritic */}
          {game.metacritic && (
            <div className="absolute top-3 right-3">
              <span className={`rounded-lg px-2.5 py-1 text-sm font-bold text-white shadow-md ${
                game.metacritic >= 75 ? "bg-success-600" : game.metacritic >= 50 ? "bg-amber-500" : "bg-red-500"
              }`}>
                {game.metacritic}
              </span>
            </div>
          )}

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-white line-clamp-1">
              {game.title}
            </h3>
            <div className="mt-1 flex flex-wrap gap-1">
              {genres.slice(0, 3).map((g: string) => (
                <span key={g} className="rounded-full bg-white dark:bg-gray-950/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                  {g}
                </span>
              ))}
            </div>
            {deal && (
              <div className="mt-2 flex items-center gap-2">
                <StoreIcon store={deal.store} size="sm" />
                <span className="text-sm font-bold text-white">
                  From {formatPrice(deal.price)}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* ── Hover preview panel ── */}
      <div
        className={`absolute left-0 right-0 top-full z-40 transition-all duration-200 pointer-events-none ${
          hovered
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2"
        }`}
      >
        <Link
          href={`/games/${game.slug}`}
          className="block mt-1 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 shadow-2xl overflow-hidden"
        >
          {/* Two images side by side */}
          <div className="flex gap-px bg-gray-100 dark:bg-gray-800">
            {game.screenshot_image && game.cover_image ? (
              <>
                <div className="w-1/2 aspect-[16/10] overflow-hidden">
                  <img
                    src={game.screenshot_image}
                    alt={`${game.title} gameplay`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="w-1/2 aspect-[16/10] overflow-hidden">
                  <img
                    src={game.cover_image}
                    alt={`${game.title} cover`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </>
            ) : bgImage ? (
              <div className="w-full aspect-[21/9] overflow-hidden">
                <img
                  src={bgImage}
                  alt={game.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Title + badges row */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight line-clamp-1">
                  {game.title}
                </h4>
                {game.release_date && (
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                    Released {formatDate(game.release_date)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {game.metacritic && (
                  <span className={`rounded-md px-2 py-0.5 text-xs font-bold text-white ${
                    game.metacritic >= 75 ? "bg-success-600" : game.metacritic >= 50 ? "bg-amber-500" : "bg-red-500"
                  }`}>
                    {game.metacritic}
                  </span>
                )}
                {game.hot_score != null && game.hot_score > 0 && (
                  <span className="flex items-center gap-0.5 rounded-md bg-orange-50 dark:bg-orange-950/30 px-1.5 py-0.5 text-[10px] font-bold text-orange-600">
                    <TrendingUp className="h-2.5 w-2.5" />
                    {game.hot_score}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {game.description && (
              <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-3">
                {game.description}
              </p>
            )}

            {/* Genres + Platforms row */}
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1">
                {genres.slice(0, 4).map((g: string) => (
                  <span key={g} className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-300">
                    {g}
                  </span>
                ))}
              </div>
              {platforms.length > 0 && (
                <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                  {platforms.slice(0, 4).map((p: string) => (
                    <span key={p} title={p}>
                      <PlatformIcon platform={p} />
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price CTA */}
            {deal && (
              <div className="mt-3 flex items-center justify-between rounded-lg bg-gradient-to-r from-emerald-50 dark:from-emerald-950/30 to-teal-50 dark:to-teal-950/20 border border-emerald-100 dark:border-emerald-800/30 px-3 py-2">
                <div className="flex items-center gap-2">
                  <StoreIcon store={deal.store} size="sm" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Best price</span>
                </div>
                <span className="text-sm font-bold text-emerald-700">
                  {formatPrice(deal.price)}
                </span>
              </div>
            )}

            {/* View game link */}
            <div className="mt-2 text-center">
              <span className="text-[11px] font-semibold text-brand-600 hover:text-brand-700">
                View Full Details &rarr;
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
