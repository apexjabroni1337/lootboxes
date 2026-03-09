"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calendar, Clock, Rocket, X, Swords, Gamepad2, Crosshair, Globe, Car, Puzzle, Users, Trophy } from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";
import { formatDate } from "@/lib/utils";

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

function GameCard({ game }: { game: any }) {
  const img = game.screenshot_image || game.cover_image;
  const genres = game.genres || [];

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {img ? (
          <img
            src={img}
            alt={game.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <GameAvatar gameName={game.title} size="sm" aspectRatio="video" />
        )}
        {game.metacritic && (
          <div className="absolute top-2 right-2 rounded-lg bg-black/70 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
            {game.metacritic}/100
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 line-clamp-1">
          {game.title}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          {game.release_date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(game.release_date)}
            </span>
          )}
        </div>
        {genres.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {genres.slice(0, 3).map((g: string) => (
              <span
                key={g}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

interface Props {
  newReleases: any[];
  comingSoon: any[];
  initialGenre: string | null;
}

export default function NewReleasesClient({ newReleases, comingSoon, initialGenre }: Props) {
  const [activeGenre, setActiveGenre] = useState<string | null>(initialGenre);

  const allGames = useMemo(() => [...newReleases, ...comingSoon], [newReleases, comingSoon]);
  const newReleaseIds = useMemo(() => new Set(newReleases.map((g: any) => g.id)), [newReleases]);

  const filtered = useMemo(() => {
    if (!activeGenre) return allGames;
    return allGames.filter((g) => gameMatchesGenre(g.genres, activeGenre));
  }, [allGames, activeGenre]);

  const filteredNew = filtered.filter((g: any) => newReleaseIds.has(g.id));
  const filteredComing = filtered.filter((g: any) => !newReleaseIds.has(g.id));

  return (
    <div className="mb-6">
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

      {activeGenre && (
        <p className="mt-2 text-sm text-gray-500">
          {filtered.length} {filtered.length === 1 ? "game" : "games"} in{" "}
          <span className="font-medium text-brand-600">
            {GENRE_OPTIONS.find((g) => g.id === activeGenre)?.label}
          </span>
        </p>
      )}

      {/* New Releases */}
      {filteredNew.length > 0 && (
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              New Releases
            </h2>
            <span className="text-sm text-gray-500">
              Last 90 days
            </span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredNew.map((game: any) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Coming Soon */}
      {filteredComing.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Coming Soon
            </h2>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              Upcoming titles
            </span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredComing.map((game: any) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {filteredNew.length === 0 && filteredComing.length === 0 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Rocket className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No releases found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Try removing the genre filter or check back soon!
          </p>
          <Link href="/deals" className="btn-primary mt-6 inline-flex">
            Browse Deals Instead
          </Link>
        </div>
      )}
    </div>
  );
}
