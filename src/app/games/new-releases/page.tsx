import Link from "next/link";
import { Rocket, Star, Calendar, TrendingDown } from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";
import StoreIcon from "@/components/ui/StoreIcon";
import { createServerClient } from "@/lib/supabase";
import { formatDate, formatPrice } from "@/lib/utils";
import { isPromotableGame } from "@/lib/game-quality";
import NewReleasesClient from "./NewReleasesClient";
import SpotlightCard from "./SpotlightCard";

export const metadata = {
  title: "New Releases & Coming Soon — Latest Games | LootBoxes",
  description:
    "Browse the latest game releases and upcoming titles. Track prices from day one across Steam, Epic, GOG, and more.",
  alternates: {
    canonical: "https://lootboxes.com/games/new-releases",
  },
};

export const revalidate = 300;

async function getNewReleases() {
  const supabase = createServerClient();

  // Strategy: fetch recently created games sorted by hot_score (popularity).
  // We use created_at or release_date, but release_date may be in various formats
  // (ISO "2026-03-08" or Steam-style "Mar 5, 2026"), so we cast a wider net
  // and rely on the "created recently" heuristic + hot_score sorting.

  // Approach 1: Games with ISO-formatted release dates in last 180 days
  const today = new Date().toISOString().slice(0, 10);
  const sixMonthsAgo = new Date(Date.now() - 180 * 86_400_000)
    .toISOString()
    .slice(0, 10);

  const { data: isoReleases } = await supabase
    .from("games")
    .select("id, title, slug, cover_image, screenshot_image, release_date, genres, platforms, metacritic, hot_score, description")
    .lte("release_date", today)
    .gte("release_date", sixMonthsAgo)
    .order("hot_score", { ascending: false, nullsFirst: false })
    .limit(100);

  // Approach 2: Recently added games (created_at in last 30 days) that have cover images
  // This catches games imported by sync-new-releases with non-ISO release dates
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000).toISOString();

  const { data: recentImports } = await supabase
    .from("games")
    .select("id, title, slug, cover_image, screenshot_image, release_date, genres, platforms, metacritic, hot_score, description")
    .gte("created_at", thirtyDaysAgo)
    .not("cover_image", "is", null)
    .order("hot_score", { ascending: false, nullsFirst: false })
    .limit(100);

  // Merge and deduplicate, prioritize by hot_score
  const seen = new Set<string>();
  const merged: any[] = [];

  // Add ISO releases first (they have proper dates)
  for (const game of isoReleases || []) {
    if (!seen.has(game.id)) {
      seen.add(game.id);
      merged.push(game);
    }
  }

  // Then add recent imports that weren't already included
  for (const game of recentImports || []) {
    if (!seen.has(game.id)) {
      seen.add(game.id);
      merged.push(game);
    }
  }

  // Sort by hot_score descending so popular new releases appear first
  merged.sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0));

  // Filter out junk/NSFW/unpopular games
  const quality = merged.filter((game) =>
    isPromotableGame({ title: game.title, cover_image: game.cover_image, hot_score: game.hot_score, genres: game.genres })
  );

  return quality.slice(0, 150);
}

async function getComingSoon() {
  const supabase = createServerClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from("games")
    .select("id, title, slug, cover_image, screenshot_image, release_date, genres, platforms, metacritic")
    .gt("release_date", today)
    .order("release_date", { ascending: true })
    .limit(50);

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
    .limit(500);

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
