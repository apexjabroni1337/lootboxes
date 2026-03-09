"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Rocket,
  X,
  Search,
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
import { formatDate, formatPrice } from "@/lib/utils";

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

const TABS = [
  { id: "releases", label: "New Releases", icon: Rocket },
  { id: "coming", label: "Coming Soon", icon: Clock },
] as const;

type TabId = (typeof TABS)[number]["id"];

function GameCard({ game, deal, isComingSoon }: { game: any; deal?: { price: number; store: string }; isComingSoon?: boolean }) {
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

        {/* Metacritic */}
        {game.metacritic && (
          <div className="absolute top-2 right-2">
            <span className={`rounded-lg px-2 py-1 text-xs font-bold text-white shadow-md ${
              game.metacritic >= 75 ? "bg-success-600" : game.metacritic >= 50 ? "bg-amber-500" : "bg-red-500"
            }`}>
              {game.metacritic}
            </span>
          </div>
        )}

        {/* Release date badge */}
        {game.release_date && (
          <div className="absolute bottom-2 left-2">
            <span className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold shadow-sm backdrop-blur-sm ${
              isComingSoon
                ? "bg-indigo-600/90 text-white"
                : "bg-white/90 text-gray-700"
            }`}>
              <Calendar className="h-3 w-3" />
              {formatDate(game.release_date)}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 line-clamp-1">
          {game.title}
        </h3>

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

        {/* Price or coming soon label */}
        <div className="mt-3">
          {isComingSoon ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600">
              <Clock className="h-3 w-3" />
              Coming Soon
            </span>
          ) : deal ? (
            <div className="flex items-center gap-2">
              <StoreIcon store={deal.store} size="sm" />
              <span className="text-sm font-bold text-gray-900">
                From {formatPrice(deal.price)}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">Price tracking soon</span>
          )}
        </div>
      </div>
    </Link>
  );
}

interface Props {
  newReleases: any[];
  comingSoon: any[];
  bestDeals: Record<string, { price: number; store: string }>;
  initialGenre: string | null;
}

export default function NewReleasesClient({ newReleases, comingSoon, bestDeals, initialGenre }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("releases");
  const [activeGenre, setActiveGenre] = useState<string | null>(initialGenre);
  const [search, setSearch] = useState("");

  const currentGames = activeTab === "releases" ? newReleases : comingSoon;

  const filtered = useMemo(() => {
    let result = currentGames;
    if (search.length >= 2) {
      const q = search.toLowerCase();
      result = result.filter((g: any) => g.title.toLowerCase().includes(q));
    }
    if (activeGenre) {
      result = result.filter((g: any) => gameMatchesGenre(g.genres, activeGenre));
    }
    return result;
  }, [currentGames, search, activeGenre]);

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 mb-4">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = tab.id === "releases" ? newReleases.length : comingSoon.length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? "text-brand-600" : ""}`} />
              {tab.label}
              <span className="text-xs text-gray-400">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search + Genre */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search games..."
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-9 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

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

      {/* Results count */}
      {(search.length >= 2 || activeGenre) && (
        <p className="mt-3 text-sm text-gray-500">
          {filtered.length} {filtered.length === 1 ? "game" : "games"}
          {search.length >= 2 && <> matching &ldquo;{search}&rdquo;</>}
          {activeGenre && (
            <span className="text-gray-400">
              {" "}in <span className="font-medium text-brand-600">{GENRE_OPTIONS.find(g => g.id === activeGenre)?.label}</span>
            </span>
          )}
        </p>
      )}

      {/* Game Grid */}
      {filtered.length > 0 ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((game: any) => (
            <GameCard
              key={game.id}
              game={game}
              deal={bestDeals[game.id]}
              isComingSoon={activeTab === "coming"}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Rocket className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No {activeTab === "releases" ? "releases" : "upcoming games"} found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Try removing filters or check back soon!
          </p>
          <Link href="/deals" className="btn-primary mt-6 inline-flex">
            Browse Deals Instead
          </Link>
        </div>
      )}
    </div>
  );
}
