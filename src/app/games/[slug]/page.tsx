import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, formatDiscount, formatDate, timeAgo } from "@/lib/utils";
import { STORES } from "@/lib/types";
import ScoreBadge from "@/components/analytics/ScoreBadge";
import PriceChart from "@/components/games/PriceChart";
import PriceAlertForm from "@/components/games/PriceAlertForm";
import GameAvatar from "@/components/ui/GameAvatar";
import StoreIcon from "@/components/ui/StoreIcon";
import { createServerClient } from "@/lib/supabase";
import {
  ExternalLink,
  TrendingDown,
  Calendar,
  Star,
  Monitor,
  ArrowRight,
  Clock,
  ChevronRight,
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

  const byDate = new Map<string, Record<string, number | string>>();
  for (const h of history) {
    const date = new Date(h.recorded_at).toISOString().slice(0, 10);
    if (!byDate.has(date)) byDate.set(date, { date });
    const entry = byDate.get(date)!;
    const existing = entry[h.store];
    if (!existing || (typeof existing === "number" && h.price < existing)) {
      entry[h.store] = h.price;
    }
  }
  return Array.from(byDate.values()) as { date: string; [store: string]: number | string }[];
}

async function getSimilarGames(gameId: string) {
  const supabase = createServerClient();
  const { data: games } = await supabase
    .from("games")
    .select("id, title, slug, cover_image, screenshot_image")
    .neq("id", gameId)
    .limit(4);

  if (!games || games.length === 0) return [];

  const result = [];
  for (const g of games) {
    const { data: bestDeal } = await supabase
      .from("deals")
      .select("price, discount_pct")
      .eq("game_id", g.id)
      .order("price", { ascending: true })
      .limit(1);

    result.push({
      ...g,
      bestPrice: bestDeal?.[0]?.price || null,
      discount: bestDeal?.[0]?.discount_pct || 0,
    });
  }
  return result.filter((g) => g.bestPrice !== null);
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const game = await getGame(params.slug);
  if (!game) return { title: "Game Not Found" };

  const title = `${game.title} — Best Price, Deals & Analysis`;
  const description = `Compare prices for ${game.title} across Steam, Epic, GOG, Humble Bundle, and more. Find the cheapest deal and see the full price history.`;
  const ogImage = game.screenshot_image || game.cover_image || undefined;
  const url = `https://lootboxes.com/games/${game.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage, width: 889, height: 500, alt: game.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    alternates: {
      canonical: url,
    },
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
  const heroImage = game.screenshot_image || game.cover_image;

  // JSON-LD structured data for Google rich results
  const jsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: game.title,
    description: `Compare prices for ${game.title} across multiple stores.`,
    url: `https://lootboxes.com/games/${game.slug}`,
    ...(heroImage ? { image: heroImage } : {}),
    ...(game.metacritic ? { aggregateRating: { "@type": "AggregateRating", ratingValue: game.metacritic, bestRating: 100, worstRating: 0, ratingCount: 1 } } : {}),
    ...(deals.length > 0
      ? {
          offers: {
            "@type": "AggregateOffer",
            lowPrice: deals[0].price,
            highPrice: deals[deals.length - 1].price,
            priceCurrency: deals[0].currency || "USD",
            offerCount: deals.length,
            offers: deals.slice(0, 5).map((d: any) => ({
              "@type": "Offer",
              price: d.price,
              priceCurrency: d.currency || "USD",
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: STORES[d.store]?.name || d.store,
              },
              url: d.affiliate_url || d.store_url,
            })),
          },
        }
      : {}),
  };

  return (
    <div className="pb-12">
      {/* JSON-LD for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Full-width screenshot hero ── */}
      <section className="relative overflow-hidden bg-gray-100">
        {heroImage ? (
          <>
            <div className="aspect-[21/9] max-h-[400px] w-full">
              <img
                src={heroImage}
                alt={game.title}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Light overlay from bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
          </>
        ) : (
          <div className="aspect-[21/9] max-h-[400px] w-full">
            <GameAvatar gameName={game.title} size="lg" aspectRatio="video" className="h-full w-full rounded-none" />
          </div>
        )}

        {/* Breadcrumb overlay */}
        <div className="absolute left-0 top-0 w-full">
          <div className="container-main py-4">
            <nav className="inline-flex items-center gap-1 rounded-lg bg-white/80 px-3 py-1.5 text-xs backdrop-blur-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <Link href="/deals" className="text-gray-500 hover:text-gray-700">Deals</Link>
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <span className="font-medium text-gray-700">{game.title}</span>
            </nav>
          </div>
        </div>

        {/* Game info overlaid at bottom */}
        <div className="absolute bottom-0 left-0 w-full">
          <div className="container-main pb-6">
            <h1 className="text-3xl font-bold text-gray-900 drop-shadow-sm sm:text-4xl">
              {game.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              {game.release_date && (
                <span className="flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 backdrop-blur-sm">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(game.release_date)}
                </span>
              )}
              {game.metacritic && (
                <span className="flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 backdrop-blur-sm">
                  <Star className="h-3.5 w-3.5 text-yellow-500" />
                  Metacritic: {game.metacritic}
                </span>
              )}
              {platforms.length > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 backdrop-blur-sm">
                  <Monitor className="h-3.5 w-3.5" />
                  {platforms.join(", ")}
                </span>
              )}
            </div>
            {genres.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {genres.map((g: string) => (
                  <span key={g} className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-gray-600 backdrop-blur-sm">
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container-main mt-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content (2 cols) */}
          <div className="lg:col-span-2">
            {/* Best price callout */}
            {bestDeal && (
              <div className="flex flex-col gap-4 rounded-xl border border-success-200 bg-success-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-medium text-success-700">
                    Best Price Right Now
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(bestDeal.price, bestDeal.currency)}
                    </span>
                    {bestDeal.discount_pct > 0 && (
                      <>
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(bestDeal.original_price, bestDeal.currency)}
                        </span>
                        <span className="rounded-lg bg-success-600 px-2 py-0.5 text-xs font-bold text-white">
                          {formatDiscount(bestDeal.discount_pct)}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                    <StoreIcon store={bestDeal.store} size="sm" />
                    <span>{STORES[bestDeal.store]?.name || bestDeal.store}</span>
                    {bestDeal.is_historic_low && (
                      <span className="ml-1 flex items-center gap-0.5 font-medium text-brand-600">
                        <TrendingDown className="h-3 w-3" />
                        All-time low!
                      </span>
                    )}
                  </div>
                </div>
                <a
                  href={`/go/${bestDeal.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-success-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-success-700"
                >
                  Get Best Deal
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}

            {/* Price comparison table */}
            {deals.length > 0 && (
              <section className="mt-8">
                <h2 className="text-xl font-bold text-gray-900">
                  Price Comparison
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {deals.length} current deals across every store.
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
                              <div className="flex items-center gap-2">
                                <StoreIcon store={deal.store} size="sm" />
                                <span className="text-sm font-medium text-gray-700">{store.name}</span>
                              </div>
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
                                href={`/go/${deal.id}`}
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

            {/* Analytics section */}
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
          </div>

          {/* Sidebar (1 col) */}
          <div className="space-y-6">
            {/* Lootboxes Score */}
            {game.lootboxes_score && (
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-gray-900">Lootboxes Score</h3>
                <div className="mt-3">
                  <ScoreBadge score={game.lootboxes_score} size="lg" showLabel />
                </div>
              </div>
            )}

            {/* Price Alert Form */}
            <PriceAlertForm
              gameTitle={game.title}
              gameSlug={game.slug}
              currentBestPrice={bestDeal?.price}
            />

            {/* Game info card */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-gray-900">Game Details</h3>
              <dl className="mt-3 space-y-3 text-sm">
                {game.release_date && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Release Date</dt>
                    <dd className="font-medium text-gray-900">{formatDate(game.release_date)}</dd>
                  </div>
                )}
                {game.metacritic && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Metacritic</dt>
                    <dd className="font-medium text-gray-900">{game.metacritic}/100</dd>
                  </div>
                )}
                {platforms.length > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Platforms</dt>
                    <dd className="font-medium text-gray-900">{platforms.join(", ")}</dd>
                  </div>
                )}
                {genres.length > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Genres</dt>
                    <dd className="font-medium text-gray-900">{genres.join(", ")}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-500">Deals Available</dt>
                  <dd className="font-medium text-gray-900">{deals.length}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Similar Games */}
        {similarGames.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900">More Games</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {similarGames.map((g: any) => {
                const img = g.screenshot_image || g.cover_image;
                return (
                  <Link
                    key={g.slug}
                    href={`/games/${g.slug}`}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      {img ? (
                        <img
                          src={img}
                          alt={g.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <GameAvatar gameName={g.title} size="sm" aspectRatio="video" />
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="line-clamp-1 text-sm font-semibold text-gray-900 group-hover:text-brand-600">
                        {g.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">
                          From {formatPrice(g.bestPrice)}
                        </span>
                        {g.discount > 0 && (
                          <span className="rounded bg-success-50 px-1.5 py-0.5 text-[10px] font-semibold text-success-700">
                            {formatDiscount(g.discount)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
