"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { matchesSearch } from "@/lib/search-aliases";
import {
  Search,
  ChevronRight,
  Crosshair,
  Swords,
  Globe2,
  Trophy,
  Car,
  Brain,
  Users,
  Dribbble,
  X,
} from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";

/* ── Types ── */
interface LootboxContentRow {
  cost_per_pull: number | null;
  has_pity_system: boolean;
  overview_html: string | null;
}

export interface GameWithContent {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  screenshot_image: string | null;
  lootboxes_score: number | null;
  loot_system_type: string | null;
  tags: string[] | null;
  genres: string[] | null;
  lootbox_content: LootboxContentRow | LootboxContentRow[] | null;
}

/* ── Genre definitions ── */
const GENRES = [
  { key: "action", label: "Action", icon: Swords, aliases: ["action", "action-adventure", "hack and slash"] },
  { key: "rpg", label: "RPG", icon: Globe2, aliases: ["rpg", "role-playing", "jrpg", "mmorpg", "action rpg", "role playing"] },
  { key: "fps", label: "FPS / Shooter", icon: Crosshair, aliases: ["fps", "shooter", "first-person", "third-person shooter", "tps", "battle royale"] },
  { key: "strategy", label: "Strategy", icon: Brain, aliases: ["strategy", "rts", "tower defense", "turn-based", "tactical", "tactics", "4x"] },
  { key: "sports", label: "Sports / Racing", icon: Dribbble, aliases: ["sports", "racing", "football", "soccer", "basketball", "driving"] },
  { key: "multiplayer", label: "Multiplayer", icon: Users, aliases: ["multiplayer", "mmo", "co-op", "pvp", "online", "moba"] },
];

function matchesGenre(gameGenres: string[] | null, genreKey: string): boolean {
  if (!gameGenres || gameGenres.length === 0) return false;
  const genre = GENRES.find((g) => g.key === genreKey);
  if (!genre) return false;
  return gameGenres.some((gg) => {
    const lower = gg.toLowerCase();
    return genre.aliases.some((alias) => lower.includes(alias) || alias.includes(lower));
  });
}

/* ── Helpers ── */
function toContentArray(
  content: LootboxContentRow | LootboxContentRow[] | null
): LootboxContentRow[] {
  if (!content) return [];
  return Array.isArray(content) ? content : [content];
}

function scoreColor(score: number | null): string {
  if (score === null) return "bg-gray-400";
  if (score >= 7) return "bg-emerald-500";
  if (score >= 5) return "bg-amber-500";
  if (score >= 3) return "bg-orange-500";
  return "bg-red-500";
}

function scoreVerdict(score: number | null): string {
  if (score === null) return "";
  if (score >= 7) return "Good value — fair monetization";
  if (score >= 5) return "Average — mixed practices";
  if (score >= 3) return "Below average — concerning practices";
  return "Poor value — predatory monetization";
}

function systemLabel(type: string | null): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    gacha: { label: "Gacha", color: "bg-purple-100 text-purple-700" },
    loot_box: { label: "Loot Box", color: "bg-red-100 text-red-700" },
    card_pack: { label: "Card Pack", color: "bg-blue-100 text-blue-700" },
    cosmetic_shop: { label: "Cosmetic Shop", color: "bg-emerald-100 text-emerald-700" },
    battle_pass: { label: "Battle Pass", color: "bg-amber-100 text-amber-700" },
  };
  return type && map[type] ? map[type] : { label: type || "Unknown", color: "bg-gray-100 text-gray-600" };
}

/* ── Bento Game Card ── */
function BentoGameCard({
  game,
  featured = false,
}: {
  game: GameWithContent;
  featured?: boolean;
}) {
  const content = toContentArray(game.lootbox_content)[0];
  const sys = systemLabel(game.loot_system_type);
  const tags = game.tags || [];
  const bannerImage = game.screenshot_image || game.cover_image;

  return (
    <Link
      href={`/lootbox/${game.slug}`}
      className={`group relative block rounded-2xl overflow-hidden ${
        featured ? "h-full" : "h-full min-h-[200px]"
      }`}
    >
      {bannerImage ? (
        <img
          src={bannerImage}
          alt={game.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          style={{ filter: featured ? "brightness(0.6)" : "brightness(0.55)" }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {game.lootboxes_score !== null && (
        <div
          className={`absolute top-3 right-3 ${
            featured ? "w-14 h-14 text-lg" : "w-10 h-10 text-sm"
          } ${scoreColor(
            game.lootboxes_score
          )} rounded-full flex items-center justify-center text-white font-extrabold border-2 border-white/90 shadow-lg shadow-black/30`}
        >
          {game.lootboxes_score.toFixed(1)}
        </div>
      )}

      <div className={`absolute bottom-0 left-0 right-0 ${featured ? "p-6" : "p-4"}`}>
        {featured && (
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-3 py-1 mb-3">
            Top Rated
          </span>
        )}

        <h3
          className={`font-extrabold text-white leading-tight ${
            featured ? "text-2xl md:text-3xl" : "text-sm md:text-base"
          }`}
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
        >
          {game.title}
        </h3>

        <div className={`flex items-center gap-1.5 flex-wrap ${featured ? "mt-3" : "mt-2"}`}>
          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white dark:bg-gray-950/15 text-white/80 backdrop-blur-sm">
            {sys.label}
          </span>
          {tags.includes("mobile") && (
            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 backdrop-blur-sm">
              Mobile
            </span>
          )}
          {tags.includes("multi_system") && (
            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 backdrop-blur-sm">
              Multi-System
            </span>
          )}
          {featured && content?.has_pity_system && (
            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 backdrop-blur-sm">
              Pity System
            </span>
          )}
          {featured && (
            <span className="text-xs text-white/50 ml-auto group-hover:text-white/70 transition-colors">
              View Analysis <ChevronRight className="w-3 h-3 inline" />
            </span>
          )}
        </div>

        {featured && (
          <p className="text-sm text-white/50 mt-2 line-clamp-2">
            {scoreVerdict(game.lootboxes_score)}
            {content?.cost_per_pull ? ` • $${content.cost_per_pull.toFixed(2)}/pull` : ""}
          </p>
        )}
      </div>
    </Link>
  );
}

/* ── Main Client Component ── */
export default function LootboxDatabaseClient({
  games,
  allGamesCount,
}: {
  games: GameWithContent[];
  allGamesCount: number;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  /* Filter games by search + genre */
  const filteredGames = useMemo(() => {
    let result = games;

    if (searchQuery.trim()) {
      result = result.filter((g) => matchesSearch(g.title, searchQuery));
    }

    if (activeGenre) {
      result = result.filter((g) => matchesGenre(g.genres, activeGenre));
    }

    return result;
  }, [games, searchQuery, activeGenre]);

  /* Count genres for the current game set */
  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const genre of GENRES) {
      counts[genre.key] = games.filter((g) => matchesGenre(g.genres, genre.key)).length;
    }
    return counts;
  }, [games]);

  /* Stats for current filtered set */
  const totalDropRates = filteredGames.length * 6;
  const avgScore =
    filteredGames.length > 0
      ? (
          filteredGames.reduce((s, g) => s + (g.lootboxes_score || 0), 0) /
          filteredGames.length
        ).toFixed(1)
      : "—";

  /* Layout splits */
  const featuredGame = filteredGames[0];
  const topRowGames = filteredGames.slice(1, 5);
  const statsRowGames = filteredGames.slice(5, 7);
  const remainingGames = filteredGames.slice(7);

  const isFiltering = searchQuery.trim() !== "" || activeGenre !== null;

  return (
    <>
      {/* ── Search & Genre Filters ── */}
      <div className="container-main pb-4">
        <div className="flex flex-col gap-3">
          {/* Search Box */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games on this page..."
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700 dark:text-gray-200 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Genre Pills */}
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => {
              const count = genreCounts[genre.key] || 0;
              if (count === 0) return null;
              const isActive = activeGenre === genre.key;
              const Icon = genre.icon;
              return (
                <button
                  key={genre.key}
                  onClick={() => setActiveGenre(isActive ? null : genre.key)}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg border transition-all ${
                    isActive
                      ? "bg-blue-600 border-blue-600 text-white shadow-md"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{genre.label}</span>
                  <span
                    className={`text-[10px] font-medium ${
                      isActive ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
            {activeGenre && (
              <button
                onClick={() => setActiveGenre(null)}
                className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-200 px-2 py-2 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear genre
              </button>
            )}
          </div>
        </div>

        {/* Filtering result count */}
        {isFiltering && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Showing {filteredGames.length} of {games.length} games
            {searchQuery.trim() && (
              <span>
                {" "}
                matching &ldquo;{searchQuery.trim()}&rdquo;
              </span>
            )}
            {activeGenre && (
              <span>
                {" "}
                in {GENRES.find((g) => g.key === activeGenre)?.label}
              </span>
            )}
          </p>
        )}
      </div>

      {/* ── Empty State ── */}
      {filteredGames.length === 0 && (
        <div className="container-main text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 mb-3 text-sm">
            No games match your filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveGenre(null);
            }}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* ── Bento Grid ── */}
      {featuredGame && (
        <div className="container-main pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="col-span-2 row-span-2 min-h-[340px] md:min-h-[416px]">
              <BentoGameCard game={featuredGame} featured />
            </div>
            {topRowGames.map((game) => (
              <div key={game.slug} className="min-h-[200px]">
                <BentoGameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Stats Row + 2 more game cards ── */}
      {filteredGames.length > 5 && (
        <div className="container-main pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-6 md:p-8 flex items-center">
              {/* Decorative elements */}
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />
              <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl" />
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 w-full">
                <div className="text-center md:text-left">
                  <p className="text-3xl md:text-4xl font-extrabold text-white">
                    {filteredGames.length}
                  </p>
                  <p className="text-xs text-indigo-300/70 font-medium mt-1">Games Analyzed</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-3xl md:text-4xl font-extrabold text-white">
                    {totalDropRates}+
                  </p>
                  <p className="text-xs text-indigo-300/70 font-medium mt-1">Drop Rates</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-3xl md:text-4xl font-extrabold text-white">{avgScore}</p>
                  <p className="text-xs text-indigo-300/70 font-medium mt-1">Avg Score</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-3xl md:text-4xl font-extrabold text-white">8</p>
                  <p className="text-xs text-indigo-300/70 font-medium mt-1">Dimensions</p>
                </div>
              </div>
            </div>
            {statsRowGames.map((game) => (
              <div key={game.slug} className="min-h-[200px]">
                <BentoGameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Remaining games — 4-col grid ── */}
      {remainingGames.length > 0 && (
        <div className="container-main pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {remainingGames.map((game) => (
              <div key={game.slug} className="min-h-[200px]">
                <BentoGameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
