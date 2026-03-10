"use client";

import { useState, useMemo } from "react";
import {
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
import SteamGameRow, { CompactGameCard } from "@/components/games/SteamGameRow";
import { normalizeDeal } from "@/lib/game-normalizer";

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
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">More Trending Deals</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} games</p>
      </div>

      {/* Genre filter pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-1">Genre:</span>
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
            className="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-300 underline ml-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Game list */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No trending deals in this genre. Try another genre or check back later!</p>
        </div>
      ) : (
        <>
          {/* Desktop: Steam-style rows */}
          <div className="hidden md:flex md:flex-col gap-1.5">
            {visible.map((deal: any, idx: number) => (
              <SteamGameRow key={deal.id} game={normalizeDeal(deal)} rank={idx + 4} />
            ))}
          </div>

          {/* Mobile: compact card grid */}
          <div className="grid gap-4 grid-cols-2 md:hidden">
            {visible.map((deal: any) => (
              <CompactGameCard key={deal.id} game={normalizeDeal(deal)} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 24)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-8 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md transition-all"
              >
                Load More
                <span className="text-xs text-gray-400 dark:text-gray-500">({filtered.length - visibleCount} remaining)</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
