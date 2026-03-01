import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, formatDiscount, formatDate, timeAgo } from "@/lib/utils";
import { STORES } from "@/lib/types";
import ScoreBadge from "@/components/analytics/ScoreBadge";
import PriceChart from "@/components/games/PriceChart";
import GameAvatar from "@/components/ui/GameAvatar";
import { createServerClient } from "@/lib/supabase";
import {
  ExternalLink,
  TrendingDown,
  Calendar,
  Star,
  Monitor,
  ArrowRight,
  Clock,
} from "lucide-react";

export const revalidate = 300;

async function getGame(slug: string) {
  const supabase = createServerClient();

  const { data: game, error } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !game) return null;
  return game;
}

async function getDealsForGame(gameId: string) {
  const supabase = createServerClient();

  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .eq("game_id", gameId)
    .order("price", { ascending: true });

  return deals || [];
}

async function getPriceHistory(gameId: string) {
  const supabase = createServerClient();

  const { data: history } = await supabase
    .from("price_history")
    .select("*")
    .eq("game_id", gameId)
    .order("recorded_at", { ascending: true })
    .limit(200);

  if (!history || history.length === 0) return [];

  // Group by date (day) and pivot by store for the chart
  const byDate = new Map<string, Record<string, number | string>>();
  for (const h of history) {
    const date = new Date(h.recorded_at).toISOString().slice(0, 10);
    if (!byDate.has(date)) byDate.set(date, { date });
    const entry = byDate.get(date)!;
    // Keep lowest price per store per day
    const existing = entry[h.store];
    if (!existing || (typeof existing === "number" && h.price < existing)) {
      entry[h.store] = h.price;
    }
  }

  return Array.from(byDate.values()) as { date: string; [store: string]: number | string }[];
}

async function getSimilarGames(gameId: string) {
  const supabase = createServerClient();

  // Get games that have deals, excluding current game
  const { data: games } = await supabase
    .from("games")
    .select("id, title, slug")
    .neq("id", gameId)
    .limit(4);

  if (!games || games.length === 0) return [];

  // Get best price for each similar game
  const result = [];
  for (const g of games) {
    const { data: bestDeal } = await supabase
      .from("deals")
      .select("price")
      .eq("game_id", g.id)
      .order("price", { ascending: true })
      .limit(1);

    result.push({
      ...g,
      bestPrice: bestDeal?.[0]?.price || null,
    });
  }

  return result.filter((g) => g.bestPrice !== null);
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const game = await getGame(params.slug);
  if (!game) return { title: "Game Not Found" };

  return {
    title: `${game.title} — Best Price, Deals & Analysis`,
    description: `Compare prices for ${game.title} across Steam, Epic, GOG, Humble Bundle, and more. Find the cheapest deal and see the full price history.`,
  };
}

export default async function GamePage({ params }: { params: { slug: string } }) {
  const game = await getGame(params.slug);
  if (!game) notFound();

  const [deals, priceHistory, similarGames] = await Promise.all([
    getDealsForGame(game.id),
    getPriceHistory(game.id),
    getSimilarGames(game.id),
  ]);

  const bestDeal = deals[0] || null;
  const platforms = game.platforms || [];
  const genres = game.genres || [];

  return (
    <div className="pb-12">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="container-main py-3">
          <nav className="text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/deals" className="hover:text-gray-600">Deals</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-600">{game.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-main mt-8">
        {/* Game header */}
        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Cover art */}
          <div className="h-48 w-full flex-shrink-0 overflow-hidden rounded-xl sm:h-56 sm:w-44">
            {game.cover_image ? (
              <img src={game.cover_image} alt={game.title} className="h-full w-full object-cover" />
            ) : (
              <GameAvatar gameName={game.title} size="lg" aspectRatio="portrait" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{game.title}</h1>

            <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
              {game.release_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(game.release_date)}
                </span>
              )}
              {game.metacritic && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Metacritic: {game.metacritic}
                </span>
              )}
              {platforms.length > 0 && (
                <span className="flex items-center gap-1">
                  <Monitor className="h-4 w-4" />
                  {platforms.join(", ")}
                </span>
              )}
            </div>

            {genres.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {genres.map((g: string) => (
                  <span key={g} className="badge-type">{g}</span>
                ))}
              </div>
            )}

            {game.lootboxes_score && (
              <div className="mt-4">
                <ScoreBadge score={game.lootboxes_score} size="lg" showLabel />
              </div>
            )}

            {/* Best price callout */}
            {bestDeal && (
              <div className="mt-4 inline-flex items-center gap-4 rounded-xl border border-success-500/30 bg-success-50 px-5 py-3">
                <div>
                  <div className="text-xs font-medium text-success-700">Best Price Right Now</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">{formatPrice(bestDeal.price, bestDeal.currency)}</span>
                    {bestDeal.discount_pct > 0 && (
                      <>
                        <span className="text-sm text-gray-400 line-through">{formatPrice(bestDeal.original_price, bestDeal.currency)}</span>
                        <span className="badge-discount">{formatDiscount(bestDeal.discount_pct)}</span>
                      </>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-gray-500">
                    on {STORES[bestDeal.store]?.name || bestDeal.store}
                    {bestDeal.is_historic_low && (
                      <span className="ml-2 font-medium text-brand-600">
                        <TrendingDown className="mr-0.5 inline h-3 w-3" />
                        All-time low!
                      </span>
                    )}
                  </div>
                </div>
                <a
                  href={bestDeal.affiliate_url || bestDeal.store_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center gap-1"
                >
                  Get Deal <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Price comparison table */}
        {deals.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900">Price Comparison</h2>
            <p className="mt-1 text-sm text-gray-500">
              {deals.length} current deals for {game.title} across every store.
            </p>

            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Store</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Price</th>
                    <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500 sm:table-cell">Discount</th>
                    <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 sm:table-cell">Notes</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">&nbsp;</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {deals.map((deal: any, i: number) => {
                    const store = STORES[deal.store] || { name: deal.store, color: "#666" };
                    return (
                      <tr key={deal.id} className={`transition-colors hover:bg-gray-50 ${i === 0 ? "bg-success-50/50" : ""}`}>
                        <td className="px-4 py-3">
                          <span className="badge text-xs text-white" style={{ backgroundColor: store.color }}>
                            {store.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm font-bold text-gray-900">{formatPrice(deal.price, deal.currency)}</span>
                        </td>
                        <td className="hidden px-4 py-3 text-right sm:table-cell">
                          {deal.discount_pct > 0 ? (
                            <span className="badge-discount">{formatDiscount(deal.discount_pct)}</span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="hidden px-4 py-3 sm:table-cell">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {deal.is_historic_low && (
                              <span className="badge-historic-low flex items-center gap-1">
                                <TrendingDown className="h-3 w-3" /> Historic Low
                              </span>
                            )}
                            {deal.expires_at && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Expires {timeAgo(deal.expires_at)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <a
                            href={deal.affiliate_url || deal.store_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`btn inline-flex items-center gap-1 py-1.5 text-xs ${i === 0 ? "bg-success-600 text-white hover:bg-success-700" : "btn-secondary"}`}
                          >
                            {i === 0 ? "Best Deal" : "Get Deal"}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Price History Chart */}
        {priceHistory.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900">Price History</h2>
            <p className="mt-1 text-sm text-gray-500">
              Track how the price has changed over time across stores.
            </p>
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
              <PriceChart data={priceHistory} />
            </div>
          </section>
        )}

        {/* Analytics section (if available) */}
        {game.lootboxes_score && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900">Monetization Analysis</h2>
            <div className="mt-4 card border-brand-200 bg-brand-50">
              <div className="flex items-center gap-4">
                <ScoreBadge score={game.lootboxes_score} size="lg" showLabel />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    We&apos;ve analyzed this game&apos;s in-game monetization system.
                    Read our full breakdown with drop rates, value calculations, and spending recommendations.
                  </p>
                </div>
                <Link href={`/analytics/${game.slug}-analysis`} className="btn-primary flex items-center gap-1">
                  Read Analysis <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Similar Games */}
        {similarGames.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900">More Games</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {similarGames.map((g: any) => (
                <Link key={g.slug} href={`/games/${g.slug}`} className="card group flex items-center gap-3">
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                    <GameAvatar gameName={g.title} size="sm" aspectRatio="square" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-brand-600">{g.title}</h3>
                    <p className="text-xs text-gray-500">From {formatPrice(g.bestPrice)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
