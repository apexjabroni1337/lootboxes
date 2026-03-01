import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { STORES } from "@/lib/types";
import GameAvatar from "@/components/ui/GameAvatar";
import { Search } from "lucide-react";
import { createServerClient } from "@/lib/supabase";

export const metadata = {
  title: "All Games — Browse Deals & Prices",
  description:
    "Browse our complete catalog of video game deals and price comparisons across every major store.",
};

export const revalidate = 300;

async function getGamesWithDeals() {
  const supabase = createServerClient();

  // Get all games that have at least one deal
  const { data: games, error } = await supabase
    .from("games")
    .select(`
      id,
      title,
      slug,
      cover_image,
      genres,
      platforms,
      metacritic,
      release_date
    `)
    .order("title", { ascending: true });

  if (error || !games) return [];

  // Get best price and deal count per game
  const { data: deals } = await supabase
    .from("deals")
    .select("game_id, price")
    .gt("discount_pct", 0);

  const dealStats = new Map<string, { bestPrice: number; dealCount: number }>();
  for (const deal of deals || []) {
    const existing = dealStats.get(deal.game_id);
    if (!existing) {
      dealStats.set(deal.game_id, { bestPrice: deal.price, dealCount: 1 });
    } else {
      existing.dealCount++;
      if (deal.price < existing.bestPrice) existing.bestPrice = deal.price;
    }
  }

  return games.map((game: any) => ({
    ...game,
    bestPrice: dealStats.get(game.id)?.bestPrice ?? null,
    dealCount: dealStats.get(game.id)?.dealCount ?? 0,
  }));
}

export default async function GamesPage() {
  const games = await getGamesWithDeals();

  return (
    <div className="py-8">
      <div className="container-main">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Games</h1>
            <p className="mt-1 text-gray-500">
              Browse our catalog of {games.length} tracked games with live prices.
            </p>
          </div>
        </div>

        {/* Games grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game: any) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="card group flex gap-4 transition-shadow hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                {game.cover_image ? (
                  <img
                    src={game.cover_image}
                    alt={game.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <GameAvatar
                    gameName={game.title}
                    size="sm"
                    aspectRatio="portrait"
                    className="h-full w-full"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand-600">
                    {game.title}
                  </h3>
                  {game.genres && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(Array.isArray(game.genres) ? game.genres : []).slice(0, 3).map((g: string) => (
                        <span key={g} className="badge-type text-[10px]">
                          {g}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {game.dealCount > 0 ? (
                      <>
                        <span className="text-sm font-bold text-gray-900">
                          From {formatPrice(game.bestPrice)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {game.dealCount} {game.dealCount === 1 ? "deal" : "deals"}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">No deals yet</span>
                    )}
                  </div>

                  {game.metacritic && (
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-600">
                      {game.metacritic}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
