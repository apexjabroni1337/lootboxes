import Link from "next/link";
import { Gamepad2, TrendingUp } from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";
import StoreIcon from "@/components/ui/StoreIcon";
import { createServerClient } from "@/lib/supabase";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { formatPrice } from "@/lib/utils";
import { isPromotableGame } from "@/lib/game-quality";
import GamesGrid from "@/components/games/GamesGrid";

export const metadata = {
  title: "Browse All Games — Compare Prices Across Every Store | LootBoxes",
  description:
    "Compare prices for thousands of games across 15+ stores. Find the best deals, track historic lows, and never overpay.",
  alternates: {
    canonical: "https://lootboxes.com/games",
  },
};

export const revalidate = 300;

async function getGamesWithDeals() {
  const supabase = createServerClient();

  // Get total count of all games in the database
  const { count: totalCount } = await supabase
    .from("games")
    .select("*", { count: "exact", head: true });

  // Fetch top 48 games by hot_score for initial fast render
  // The full library is searchable via /api/games/browse (infinite scroll + search)
  const { data: games, error } = await supabase
    .from("games")
    .select("id, title, slug, cover_image, screenshot_image, genres, platforms, metacritic, release_date, hot_score")
    .order("hot_score", { ascending: false, nullsFirst: false })
    .limit(120);

  if (error || !games) return { games: [], totalCount: totalCount || 0 };

  // Get best price and deal count for these games
  const gameIds = games.map((g: any) => g.id);
  const { data: deals } = await supabase
    .from("deals")
    .select("game_id, price, store")
    .in("game_id", gameIds)
    .gt("discount_pct", 0);

  const dealStats = new Map<string, { bestPrice: number; dealCount: number; store: string }>();
  for (const deal of deals || []) {
    const existing = dealStats.get(deal.game_id);
    if (!existing) {
      dealStats.set(deal.game_id, { bestPrice: deal.price, dealCount: 1, store: deal.store });
    } else {
      existing.dealCount++;
      if (deal.price < existing.bestPrice) {
        existing.bestPrice = deal.price;
        existing.store = deal.store;
      }
    }
  }

  const enriched = games.map((game: any) => ({
    ...game,
    bestPrice: dealStats.get(game.id)?.bestPrice ?? null,
    dealCount: dealStats.get(game.id)?.dealCount ?? 0,
    bestStore: dealStats.get(game.id)?.store ?? null,
  }));

  return { games: enriched, totalCount: totalCount || enriched.length };
}

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const params = await searchParams;
  const { games, totalCount } = await getGamesWithDeals();

  // Featured: top 4 games by hot_score that have screenshots (quality-filtered)
  const featured = games
    .filter((g: any) => g.screenshot_image && g.dealCount > 0 && isPromotableGame({ title: g.title, cover_image: g.cover_image, hot_score: g.hot_score, genres: g.genres }))
    .slice(0, 4);

  return (
    <div className="pb-12">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://lootboxes.com" },
          { name: "Games", url: "https://lootboxes.com/games" },
        ]}
      />
      {/* ─── Hero ─── */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-8 sm:py-10">
        <div className="container-main">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200 rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <Gamepad2 className="w-3.5 h-3.5 text-brand-600" />
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">
              Game Database
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Browse All Games
          </h1>
          <p className="text-gray-500 mt-2 max-w-lg text-sm">
            {totalCount.toLocaleString()} games tracked across 15+ stores. Compare prices, find deals, and never overpay.
          </p>
        </div>
      </section>

      {/* ─── Featured Games ─── */}
      {featured.length > 0 && (
        <section className="container-main mt-8">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-5 w-5 text-brand-600" />
            <h2 className="text-xl font-bold text-gray-900">Featured</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((game: any) => {
              const bgImage = game.screenshot_image || game.cover_image;
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

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

                    {/* Deal count */}
                    {game.dealCount > 0 && (
                      <div className="absolute top-2 left-2">
                        <span className="rounded-lg bg-black/60 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                          {game.dealCount} {game.dealCount === 1 ? "deal" : "deals"}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-sm font-bold text-white line-clamp-1">{game.title}</h3>
                      {game.bestPrice !== null && (
                        <div className="mt-1 flex items-center gap-1.5">
                          {game.bestStore && <StoreIcon store={game.bestStore} size="sm" />}
                          <span className="text-sm font-bold text-white">
                            From {formatPrice(game.bestPrice)}
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

      {/* ─── Filterable Game Grid ─── */}
      <div className="container-main mt-10">
        <GamesGrid games={games} totalCount={totalCount} initialGenre={params.genre || null} />
      </div>
    </div>
  );
}
