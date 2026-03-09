import Link from "next/link";
import { Rocket, Star, Calendar, TrendingDown } from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";
import StoreIcon from "@/components/ui/StoreIcon";
import { createServerClient } from "@/lib/supabase";
import { formatDate, formatPrice } from "@/lib/utils";
import NewReleasesClient from "./NewReleasesClient";

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
  const today = new Date().toISOString().slice(0, 10);
  const ninetyDaysAgo = new Date(Date.now() - 90 * 86_400_000)
    .toISOString()
    .slice(0, 10);

  const { data } = await supabase
    .from("games")
    .select("id, title, slug, cover_image, screenshot_image, release_date, genres, platforms, metacritic")
    .lte("release_date", today)
    .gte("release_date", ninetyDaysAgo)
    .not("cover_image", "is", null)
    .order("release_date", { ascending: false })
    .limit(50);

  return data || [];
}

async function getComingSoon() {
  const supabase = createServerClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from("games")
    .select("id, title, slug, cover_image, screenshot_image, release_date, genres, platforms")
    .gt("release_date", today)
    .not("cover_image", "is", null)
    .order("release_date", { ascending: true })
    .limit(30);

  return data || [];
}

async function getBestDeals(gameIds: string[]) {
  if (gameIds.length === 0) return new Map<string, { price: number; store: string }>();
  const supabase = createServerClient();

  const { data } = await supabase
    .from("deals")
    .select("game_id, price, store")
    .in("game_id", gameIds)
    .order("price", { ascending: true })
    .limit(500);

  const best = new Map<string, { price: number; store: string }>();
  for (const deal of data || []) {
    if (!best.has(deal.game_id)) {
      best.set(deal.game_id, { price: deal.price, store: deal.store });
    }
  }
  return best;
}

export default async function NewReleasesPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const params = await searchParams;
  const [newReleases, comingSoon] = await Promise.all([
    getNewReleases(),
    getComingSoon(),
  ]);

  // Get best deals for released games
  const allGameIds = newReleases.map((g: any) => g.id);
  const bestDeals = await getBestDeals(allGameIds);

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
            {spotlightGames.map((game: any) => {
              const bgImage = game.screenshot_image || game.cover_image;
              const deal = bestDeals.get(game.id);
              const genres = game.genres || [];

              return (
                <Link
                  key={game.id}
                  href={`/games/${game.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {bgImage ? (
                      <img
                        src={bgImage}
                        alt={game.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <GameAvatar gameName={game.title} size="md" aspectRatio="video" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Release date badge */}
                    {game.release_date && (
                      <div className="absolute top-3 left-3">
                        <span className="flex items-center gap-1 rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-gray-700 backdrop-blur-sm shadow-sm">
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
                          <span key={g} className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
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
              );
            })}
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
