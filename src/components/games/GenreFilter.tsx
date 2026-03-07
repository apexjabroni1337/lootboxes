"use client";

import { useState, useMemo, ReactNode } from "react";
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

export function gameMatchesGenre(genres: string[] | null | undefined, genreId: string): boolean {
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

interface GenreFilterProps {
  games: any[];
  initialGenre?: string | null;
  renderGames: (filtered: any[]) => ReactNode;
}

export default function GenreFilter({ games, initialGenre = null, renderGames }: GenreFilterProps) {
  const [activeGenre, setActiveGenre] = useState<string | null>(initialGenre);

  const filtered = useMemo(() => {
    if (!activeGenre) return games;
    return games.filter((g) => gameMatchesGenre(g.genres, activeGenre));
  }, [games, activeGenre]);

  return (
    <>
      {/* Genre filter pills */}
      <div className="flex flex-wrap items-center gap-2">
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

      {/* Count */}
      {activeGenre && (
        <p className="mt-2 text-sm text-gray-500">
          {filtered.length} {filtered.length === 1 ? "game" : "games"} in{" "}
          <span className="font-medium text-brand-600">
            {GENRE_OPTIONS.find((g) => g.id === activeGenre)?.label}
          </span>
        </p>
      )}

      {/* Render filtered games */}
      {renderGames(filtered)}
    </>
  );
}
