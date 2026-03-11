import Link from "next/link";
import { Rocket, Star, Calendar, TrendingDown } from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";
import StoreIcon from "@/components/ui/StoreIcon";
import { createServerClient } from "@/lib/supabase";
import { formatDate, formatPrice } from "@/lib/utils";
import { hasBadTitle, hasBadGenres, hasBadTags, hasNonEnglishTitle } from "@/lib/game-quality";
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
  if (hasNonEnglishTitle(game.title)) return false;
  if (hasBadTitle(game.title)) return false;
  if (hasBadGenres(game.genres)) return false;
  if (hasBadTags(game.tags)) return false;
  return true;
}

/**
 * Fetch the most recent/popular games that currently have active deals.
 * Strategy: query deals → get unique game_ids → fetch those games → quality filter.
 * This ensures the page always has content regardless of release date window.
 */
async function getGamesWithDeals() {
  const supabase = createServerClient();

  // Step 1: Fetch deals sorted by price (cheapest first) to get game_ids
  const { data: deals } = await supabase
    .from("deals")
    .select("game_id, price, store")
    .order("price", { ascending: true })
    .limit(3000);

  if (!deals || deals.length === 0) return { games: [], dealMap: new Map() };

  // Build best-deal map (first occurrence per game_id = cheapest)
  const dealMap = new Map<string, { price: number; store: string }>();
  for (const deal of deals) {
    if (!dealMap.has(deal.game_id)) {
      dealMap.set(deal.game_id, { price: deal.price, store: deal.store });
    }
  }

  const gameIds = Array.from(dealMap.keys());

  // Step 2: Fetch game details for all games with deals (batched if needed)
  const BATCH = 200;
  const allGames: any[] = [];

  for (let i = 0; i < gameIds.length; i += BATCH) {
    const batch = gameIds.slice(i, i + BATCH);
    const { data } = await supabase
      .from("games")
      .select("id, title, slug, cover_image, screenshot_image, release_date, genres, platforms, metacritic, hot_score, description")
      .in("id", batch);

    if (data) allGames.push(...data);
  }

  // Step 3: Quality filter and sort by hot_score
  const quality = allGames.filter((game) =>
    isQualityNewRelease({ title: game.title, cover_image: game.cover_image, genres: game.genres, tags: game.tags })
  );

  quality.sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0));

  return { games: quality.slice(0, 200), dealMap };
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


export default async function NewReleasesPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const params = await searchParams;

  // Fetch games with deals + coming soon in parallel
  const [{ games: gamesWithDeals, dealMap: bestDeals }, comingSoon] = await Promise.all([
    getGamesWithDeals(),
    getComingSoon(),
  ]);

  // Spotlight: top 3 games with deals
  const spotlightGames = gamesWithDeals.slice(0, 3);
  const remainingReleases = gamesWithDeals.slice(3);

  return (
    <div className="pb-12">
      {/* ─── Hero ─── */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-950 py-8 sm:py-10">
        <div className="container-main">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 dark:from-indigo-950/30 to-violet-50 border border-indigo-200 dark:border-indigo-700/30 rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <Rocket className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              New Releases
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
            New Releases &amp; Coming Soon
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-lg text-sm">
            {gamesWithDeals.length} games with active deals, plus {comingSoon.length} upcoming titles. Prices tracked across Steam, Epic, GOG, and more.
          </p>
        </div>
      </section>

      {/* ─── "Just Dropped" Spotlight ─── */}
      {spotlightGames.length > 0 && (
        <section className="container-main mt-8">
          <div className="flex items-center gap-2 mb-5">
            <Star className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Just Dropped</h2>
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
