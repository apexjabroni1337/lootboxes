import Link from "next/link";
import { Rocket, Star, Calendar, TrendingDown } from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";
import StoreIcon from "@/components/ui/StoreIcon";
import { createServerClient } from "@/lib/supabase";
import { formatDate, formatPrice } from "@/lib/utils";
import { hasBadTitle, hasBadGenres, hasBadTags } from "@/lib/game-quality";
import NewReleasesClient from "./NewReleasesClient";
import SpotlightCard from "./SpotlightCard";

export const metadata = {
  title: "New Releases & Coming Soon — Latest Games | LootBoxes",
  description:
    "Browse games released in the last 90 days and upcoming titles. Track prices from day one across Steam, Epic, GOG, and more.",
  alternates: {
    canonical: "https://lootboxes.com/games/new-releases",
  },
};

export const revalidate = 300;

/**
 * Parse a release_date value (could be ISO "2026-03-08", Postgres DATE,
 * or Steam-style "Mar 5, 2026") into a Date object. Returns null if
 * the date is unparseable or clearly invalid.
 */
function parseReleaseDate(raw: string | null | undefined): Date | null {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;

  // Try native Date parsing — handles ISO dates and many Steam formats
  const d = new Date(trimmed);
  if (!isNaN(d.getTime()) && d.getFullYear() > 1990 && d.getFullYear() < 2100) {
    return d;
  }
  return null;
}

/**
 * Check if a game was released within the last `days` days.
 * Games with unparseable release dates return false (they're not "new").
 */
function isRecentRelease(releaseDate: string | null | undefined, days: number): boolean {
  const parsed = parseReleaseDate(releaseDate);
  if (!parsed) return false;
  const cutoff = Date.now() - days * 86_400_000;
  const now = Date.now();
  // Must be in the past (or today) AND within the window
  return parsed.getTime() <= now && parsed.getTime() >= cutoff;
}

const NEW_RELEASE_WINDOW_DAYS = 90;

/**
 * Lighter quality filter for new releases. Unlike isPromotableGame(),
 * this does NOT require a hot_score threshold — new games haven't had
 * time to build popularity yet. We only block junk titles, NSFW, and
 * games without cover art.
 */
function isQualityNewRelease(game: {
  title: string;
  cover_image?: string | null;
  genres?: string[] | null;
  tags?: string[] | null;
}): boolean {
  if (!game.cover_image || game.cover_image.trim().length === 0) return false;
  if (hasBadTitle(game.title)) return false;
  if (hasBadGenres(game.genres)) return false;
  if (hasBadTags(game.tags)) return false;
  return true;
}

async function getNewReleases() {
  const supabase = createServerClient();

  const today = new Date().toISOString().slice(0, 10);
  const cutoffDate = new Date(Date.now() - NEW_RELEASE_WINDOW_DAYS * 86_400_000)
    .toISOString()
    .slice(0, 10);

  // Primary query: games with release_date in last 90 days (DB-level filter)
  // The release_date column is DATE type in Postgres, so comparisons are reliable
  const { data: dateFiltered } = await supabase
    .from("games")
    .select("id, title, slug, cover_image, screenshot_image, release_date, genres, platforms, metacritic, hot_score, description")
    .lte("release_date", today)
    .gte("release_date", cutoffDate)
    .order("hot_score", { ascending: false, nullsFirst: false })
    .limit(1500);

  // Secondary query: recently imported games (created_at in last 30 days)
  // These ALSO get validated against release_date below — being "recently
  // imported" alone does NOT qualify a game as a new release
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000).toISOString();

  const { data: recentImports } = await supabase
    .from("games")
    .select("id, title, slug, cover_image, screenshot_image, release_date, genres, platforms, metacritic, hot_score, description")
    .gte("created_at", thirtyDaysAgo)
    .not("cover_image", "is", null)
    .order("hot_score", { ascending: false, nullsFirst: false })
    .limit(500);

  // Merge and deduplicate
  const seen = new Set<string>();
  const merged: any[] = [];

  for (const game of dateFiltered || []) {
    if (!seen.has(game.id)) {
      seen.add(game.id);
      merged.push(game);
    }
  }

  // Only add recent imports that ALSO have a recent release_date
  // This prevents old games that were recently re-imported from appearing
  for (const game of recentImports || []) {
    if (!seen.has(game.id) && isRecentRelease(game.release_date, NEW_RELEASE_WINDOW_DAYS)) {
      seen.add(game.id);
      merged.push(game);
    }
  }

  // Sort by hot_score descending so popular new releases appear first
  merged.sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0));

  // Filter out junk/NSFW games (but NOT by hot_score — new games haven't
  // built popularity yet, so requiring hot_score kills legitimate new releases)
  const quality = merged.filter((game) =>
    isQualityNewRelease({ title: game.title, cover_image: game.cover_image, genres: game.genres, tags: game.tags })
  );

  // Final safety net: double-check every game's release_date server-side
  // This catches edge cases where Postgres date comparison let something through
  const validated = quality.filter((game) =>
    isRecentRelease(game.release_date, NEW_RELEASE_WINDOW_DAYS)
  );

  return validated.slice(0, 1500);
}

async function getComingSoon() {
  const supabase = createServerClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from("games")
    .select("id, title, slug, cover_image, screenshot_image, release_date, genres, platforms, metacritic")
    .gt("release_date", today)
    .order("release_date", { ascending: true })
    .limit(250);

  return data || [];
}

/**
 * Fetch deals for recently active games — runs in parallel with game queries.
 * Uses price-ascending order so the first deal per game_id is the cheapest.
 */
async function getRecentDeals() {
  const supabase = createServerClient();

  const { data } = await supabase
    .from("deals")
    .select("game_id, price, store")
    .order("price", { ascending: true })
    .limit(2000);

  return data || [];
}

export default async function NewReleasesPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const params = await searchParams;

  // Fetch ALL three queries in parallel — no waterfall
  const [newReleases, comingSoon, recentDeals] = await Promise.all([
    getNewReleases(),
    getComingSoon(),
    getRecentDeals(),
  ]);

  // Match deals to games
  const allGameIds = new Set(newReleases.map((g: any) => g.id));
  const bestDeals = new Map<string, { price: number; store: string }>();
  for (const deal of recentDeals) {
    if (allGameIds.has(deal.game_id) && !bestDeals.has(deal.game_id)) {
      bestDeals.set(deal.game_id, { price: deal.price, store: deal.store });
    }
  }

  // Spotlight: top 3 newest releases
  const spotlightGames = newReleases.slice(0, 3);
  const remainingReleases = newReleases.slice(3);

  return (
    <div className="pb-12">
      {/* ─── Hero ─── */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-8 sm:py-10">
        <div className="container-main">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <Rocket className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              New Releases
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            New Releases &amp; Coming Soon
          </h1>
          <p className="text-gray-500 mt-2 max-w-lg text-sm">
            {newReleases.length} games released in the last 90 days, plus {comingSoon.length} upcoming titles. Prices tracked from day one.
          </p>
        </div>
      </section>

      {/* ─── "Just Dropped" Spotlight ─── */}
      {spotlightGames.length > 0 && (
        <section className="container-main mt-8">
          <div className="flex items-center gap-2 mb-5">
            <Star className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold text-gray-900">Just Dropped</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {spotlightGames.map((game: any) => (
              <SpotlightCard
                key={game.id}
                game={game}
                deal={bestDeals.get(game.id) || null}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── Client: Tabs + Genre Filter + Grid ─── */}
      <div className="container-main mt-10">
        <NewReleasesClient
          newReleases={remainingReleases}
          comingSoon={comingSoon}
          bestDeals={Object.fromEntries(bestDeals)}
          initialGenre={params.genre || null}
        />
      </div>
    </div>
  );
}
