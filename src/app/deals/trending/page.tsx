import Link from "next/link";
import { Flame, TrendingUp, ExternalLink, TrendingDown, ChevronRight } from "lucide-react";
import { createServerClient } from "@/lib/supabase";
import { formatPrice, formatDiscount } from "@/lib/utils";
import { isPromotableGame, deduplicateByBaseTitle } from "@/lib/game-quality";
import GameAvatar from "@/components/ui/GameAvatar";
import StoreIcon from "@/components/ui/StoreIcon";
import TrendingClient from "./TrendingClient";

export const metadata = {
  title: "Trending Games — What's Hot Right Now | LootBoxes",
  description:
    "See which games are trending right now. The hottest deals, biggest price drops, and most popular games across every store — updated hourly.",
  openGraph: {
    title: "Trending Games — What's Hot Right Now",
    description:
      "The hottest game deals and biggest price drops happening right now.",
    url: "https://lootboxes.com/deals/trending",
    type: "website",
  },
  alternates: {
    canonical: "https://lootboxes.com/deals/trending",
  },
};

export const revalidate = 300;

async function getTrendingDeals() {
  const supabase = createServerClient();

  // Step 1: Get the most popular games by hot_score (includes games WITHOUT deals)
  const { data: popularGames } = await supabase
    .from("games")
    .select("id, title, slug, cover_image, screenshot_image, hot_score, genres, metacritic, release_date, platforms")
    .not("cover_image", "is", null)
    .neq("cover_image", "")
    .order("hot_score", { ascending: false, nullsFirst: false })
    .limit(300);

  if (!popularGames?.length) return [];

  // Step 2: Get deals for popular games — batch the IN query for performance
  // Supabase/Postgres is faster with smaller IN lists run in parallel
  const gameIds = popularGames.map((g) => g.id);
  const BATCH = 100;
  const dealBatches = [];
  for (let i = 0; i < gameIds.length; i += BATCH) {
    dealBatches.push(
      supabase
        .from("deals")
        .select("game_id, id, store, store_url, price, original_price, discount_pct, currency, is_historic_low, expires_at, affiliate_url")
        .in("game_id", gameIds.slice(i, i + BATCH))
        .order("price", { ascending: true })
    );
  }
  const batchResults = await Promise.all(dealBatches);
  const allDeals = batchResults.flatMap((r) => r.data || []);

  // Build a map: game_id → best deal
  const bestDealByGame = new Map<string, any>();
  for (const deal of allDeals) {
    if (!bestDealByGame.has(deal.game_id)) {
      bestDealByGame.set(deal.game_id, deal);
    }
  }

  // Step 3: Filter out junk/NSFW/unpopular games
  const qualityGames = popularGames.filter((game) =>
    isPromotableGame({ title: game.title, cover_image: game.cover_image, hot_score: game.hot_score, genres: game.genres })
  );

  // Step 4: Combine games with their best deals (games without deals still show up)
  const combined = qualityGames.map((game) => {
    const deal = bestDealByGame.get(game.id);
    return {
      // Deal fields (may be null for games without deals)
      id: deal?.id || game.id,
      game_id: game.id,
      store: deal?.store || null,
      store_url: deal?.store_url || null,
      price: deal?.price || null,
      original_price: deal?.original_price || null,
      discount_pct: deal?.discount_pct || 0,
      currency: deal?.currency || "USD",
      is_historic_low: deal?.is_historic_low || false,
      expires_at: deal?.expires_at || null,
      affiliate_url: deal?.affiliate_url || null,
      // Game data (nested to match existing template expectations)
      games: game,
      hasDeal: !!deal,
    };
  });

  // Collapse DLC/edition variants so only one entry per base game shows
  const deduped = deduplicateByBaseTitle(combined);

  return deduped.slice(0, 150);
}

export default async function TrendingPage() {
  const deals = await getTrendingDeals();

  // Top 3 for the hero spotlight
  const spotlightDeals = deals.slice(0, 3);
  const gridDeals = deals.slice(3);

  return (
    <div className="pb-12">
      {/* ─── Hero ─── */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-orange-50 to-white py-8 sm:py-10">
        <div className="container-main">
          <div className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
              Trending Now
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            What&apos;s Hot Right Now
          </h1>
          <p className="text-gray-500 mt-2 max-w-lg text-sm">
            The most popular games and biggest deals happening right now, ranked by community activity and price drops.
          </p>
        </div>
      </section>

      {/* ─── Spotlight: Top 3 Trending ─── */}
      {spotlightDeals.length > 0 && (
        <section className="container-main mt-8">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-900">Hot Right Now</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {spotlightDeals.map((deal: any, idx: number) => {
              const game = deal.games;
              const bgImage = game?.screenshot_image || game?.cover_image;
              const hasDiscount = deal.discount_pct > 0;

              return (
                <div
                  key={deal.id}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all"
                >
                  {/* Background */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {bgImage ? (
                      <img
                        src={bgImage}
                        alt={game?.title || "Game"}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <GameAvatar gameName={game?.title || "Unknown"} size="md" aspectRatio="video" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Rank badge */}
                    <div className="absolute top-3 left-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white text-sm font-bold shadow-lg">
                        #{idx + 1}
                      </span>
                    </div>

                    {/* Discount badge */}
                    {hasDiscount && (
                      <div className="absolute top-3 right-3">
                        <span className="rounded-lg bg-success-600 px-2.5 py-1 text-sm font-bold text-white shadow-md">
                          {formatDiscount(deal.discount_pct)}
                        </span>
                      </div>
                    )}

                    {/* Historic low */}
                    {deal.is_historic_low && (
                      <div className="absolute bottom-14 left-3">
                        <span className="flex items-center gap-1 rounded-lg bg-brand-600 px-2 py-1 text-[10px] font-semibold text-white shadow-md">
                          <TrendingDown className="h-3 w-3" />
                          Historic Low
                        </span>
                      </div>
                    )}

                    {/* Bottom info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-bold text-white line-clamp-1">
                        {game?.title || "Unknown Game"}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        {deal.store ? (
                          <>
                            <div className="flex items-center gap-2">
                              <StoreIcon store={deal.store} size="sm" />
                              <div className="flex items-baseline gap-2">
                                {hasDiscount && (
                                  <span className="text-xs text-white/60 line-through">
                                    {formatPrice(deal.original_price, deal.currency)}
                                  </span>
                                )}
                                <span className="text-xl font-bold text-white">
                                  {formatPrice(deal.price, deal.currency)}
                                </span>
                              </div>
                            </div>
                            <a
                              href={`/go/${deal.id}`}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              className="flex items-center gap-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                            >
                              Get Deal
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              {game?.metacritic && (
                                <span className={`rounded-lg px-2.5 py-1 text-sm font-bold text-white shadow-md ${
                                  game.metacritic >= 75 ? "bg-success-600" : "bg-amber-500"
                                }`}>
                                  {game.metacritic}
                                </span>
                              )}
                              <span className="text-sm text-white/70">Popular on Steam</span>
                            </div>
                            <Link
                              href={`/games/${game?.slug}`}
                              className="flex items-center gap-1 rounded-lg bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/30"
                            >
                              View Game
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── Trending Grid with genre filters ─── */}
      <div className="container-main mt-10">
        <TrendingClient deals={gridDeals} />
      </div>

      {/* ─── CTA: Browse all deals ─── */}
      <div className="container-main mt-8">
        <Link
          href="/deals"
          className="group flex items-center justify-between rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border border-orange-200 px-6 md:px-8 py-5 hover:border-orange-300 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Browse All Deals</h2>
              <p className="text-sm text-gray-500">See every deal across every store, filtered your way</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}
