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
  Zap,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
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

async function getDropRates(gameId: string) {
  const supabase = createServerClient();
  const { data: rates } = await supabase
    .from("drop_rates")
    .select("*")
    .eq("game_id", gameId)
    .order("drop_rate_pct", { ascending: true });
  return rates || [];
}

const DR_SOURCE_META: Record<string, { label: string; icon: any; color: string }> = {
  official: { label: "Official", icon: CheckCircle, color: "text-success-600" },
  community_verified: { label: "Community Verified", icon: HelpCircle, color: "text-brand-600" },
  user_reported: { label: "User Reported", icon: AlertTriangle, color: "text-warning-600" },
};

function getDrRarityColor(rarity: string): string {
  const lower = rarity.toLowerCase();
  if (lower.includes("heirloom") || lower.includes("mythic") || lower.includes("icon") || lower.includes("crown") || lower.includes("exceedingly") || lower.includes("black market"))
    return "bg-amber-100 text-amber-800";
  if (lower.includes("covert") || lower.includes("5-star") || lower.includes("s-rank") || lower.includes("legendary") || lower.includes("exotic") || lower.includes("secret") || lower.includes("series 5"))
    return "bg-red-100 text-red-800";
  if (lower.includes("classified") || lower.includes("4-star") || lower.includes("a-rank") || lower.includes("epic") || lower.includes("elite") || lower.includes("import") || lower.includes("full art") || lower.includes("series 4") || lower.includes("premium") || lower.includes("exclusive"))
    return "bg-purple-100 text-purple-800";
  if (lower.includes("restricted") || lower.includes("very rare") || lower.includes("rare") || lower.includes("star rare") || lower.includes("deluxe") || lower.includes("variant"))
    return "bg-blue-100 text-blue-800";
  if (lower.includes("mil-spec") || lower.includes("3-star") || lower.includes("b-rank") || lower.includes("common") || lower.includes("uncommon") || lower.includes("select"))
    return "bg-gray-100 text-gray-700";
  if (lower.includes("stattrak") || lower.includes("painted") || lower.includes("certified"))
    return "bg-orange-100 text-orange-800";
  if (lower.includes("pity")) return "bg-emerald-100 text-emerald-800";
  if (lower.includes("effective")) return "bg-rose-50 text-rose-700";
  return "bg-gray-100 text-gray-700";
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
  const description = game.description
    ? `${game.description.slice(0, 150)}${game.description.length > 150 ? "..." : ""} Compare prices across Steam, Epic, GOG & more.`
    : `Compare prices for ${game.title} across Steam, Epic, GOG, Humble Bundle, and more. Find the cheapest deal and see the full price history.`;
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

  const [deals, priceHistory, similarGames, dropRates] = await Promise.all([
    getDealsForGame(game.id),
    getPriceHistory(game.id),
    getSimilarGames(game.id),
    getDropRates(game.id),
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
    description: game.description || `Compare prices for ${game.title} across multiple stores.`,
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
              <Link href="/games" className="text-gray-500 hover:text-gray-700">Game Deals</Link>
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

      {/* Lootbox Analysis Banner — show if this game has loot system analysis */}
      {game.loot_system_type && (
        <div className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50 dark:border-purple-900/30 dark:from-purple-950/20 dark:to-blue-950/20">
          <div className="container-main flex flex-col items-center gap-3 py-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40">
                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Loot Box Analysis Available
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  View monetization scores, drop rates, and spending analysis for {game.title}
                </p>
              </div>
            </div>
            <Link
              href={`/lootbox/${game.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
            >
              <Zap className="h-4 w-4" />
              View Analysis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="container-main mt-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content (2 cols) */}
          <div className="lg:col-span-2">
            {/* Game description */}
            {game.description && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">About {game.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {game.description}
                </p>
              </section>
            )}

            {/* Best price callout */}
            {bestDeal && (
              <div className="flex flex-col gap-4 rounded-xl border border-success-200 bg-success-50 p-5 dark:border-success-800 dark:bg-success-950/30 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-medium text-success-700 dark:text-success-400">
                    Best Price Right Now
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
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
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
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
                  rel="noopener noreferrer nofollow"
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
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Price Comparison
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {deals.length} current deals across every store.
                </p>

                <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                  <table className="w-full">
                    <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Store</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Price</th>
                        <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500 sm:table-cell">Discount</th>
                        <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 sm:table-cell">Notes</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {deals.map((deal: any, i: number) => {
                        const store = STORES[deal.store] || { name: deal.store, color: "#666" };
                        return (
                          <tr key={deal.id} className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${i === 0 ? "bg-success-50/50 dark:bg-success-950/20" : ""}`}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <StoreIcon store={deal.store} size="sm" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{store.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-sm font-bold text-gray-900 dark:text-white">{formatPrice(deal.price, deal.currency)}</span>
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
                                rel="noopener noreferrer nofollow"
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
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Price History</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Track how the price has changed over time across stores.
                </p>
                <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                  <PriceChart data={priceHistory} />
                </div>
              </section>
            )}

            {/* Drop Rates section */}
            {dropRates.length > 0 && (
              <section className="mt-10">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-brand-600" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Loot Box Drop Rates</h2>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Verified probabilities for in-game items. Know your odds before you spend.
                </p>

                <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-gray-500">Item</th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-gray-500">Rarity</th>
                          <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase text-gray-500">Drop Rate</th>
                          <th className="hidden px-4 py-2.5 text-right text-xs font-semibold uppercase text-gray-500 sm:table-cell">~Avg. Opens</th>
                          <th className="hidden px-4 py-2.5 text-left text-xs font-semibold uppercase text-gray-500 md:table-cell">Source</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {dropRates.map((rate: any, i: number) => {
                          const SourceMeta = DR_SOURCE_META[rate.source] || DR_SOURCE_META.user_reported;
                          const isPity = rate.rarity.toLowerCase().includes("pity");
                          const avgOpens =
                            rate.drop_rate_pct > 0 && rate.drop_rate_pct < 100
                              ? Math.ceil(100 / rate.drop_rate_pct)
                              : "—";
                          return (
                            <tr key={i} className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${isPity ? "bg-emerald-50/30 dark:bg-emerald-950/20" : ""}`}>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{rate.item_name}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getDrRarityColor(rate.rarity)}`}>
                                  {rate.rarity}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                  {rate.drop_rate_pct >= 100
                                    ? "Guaranteed"
                                    : rate.drop_rate_pct < 1
                                      ? `${Number(rate.drop_rate_pct).toFixed(rate.drop_rate_pct < 0.1 ? 3 : 2)}%`
                                      : `${Number(rate.drop_rate_pct).toFixed(1)}%`}
                                </span>
                              </td>
                              <td className="hidden px-4 py-3 text-right text-sm text-gray-500 sm:table-cell">
                                {typeof avgOpens === "number" ? `~${avgOpens.toLocaleString()} opens` : avgOpens}
                              </td>
                              <td className="hidden px-4 py-3 md:table-cell">
                                <span className={`flex items-center gap-1 text-xs font-medium ${SourceMeta.color}`}>
                                  <SourceMeta.icon className="h-3.5 w-3.5" />
                                  {SourceMeta.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-3 text-right">
                  <Link href="/drop-rates" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                    View all drop rates →
                  </Link>
                </div>
              </section>
            )}

            {/* Analytics section */}
            {game.lootboxes_score && (
              <section className="mt-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Monetization Analysis</h2>
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
              <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Lootboxes Score</h3>
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
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Game Details</h3>
              <dl className="mt-3 space-y-3 text-sm">
                {game.release_date && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Release Date</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">{formatDate(game.release_date)}</dd>
                  </div>
                )}
                {game.metacritic && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Metacritic</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">{game.metacritic}/100</dd>
                  </div>
                )}
                {platforms.length > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Platforms</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">{platforms.join(", ")}</dd>
                  </div>
                )}
                {genres.length > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Genres</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">{genres.join(", ")}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-500">Deals Available</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{deals.length}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Similar Games */}
        {similarGames.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">More Games</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {similarGames.map((g: any) => {
                const img = g.screenshot_image || g.cover_image;
                return (
                  <Link
                    key={g.slug}
                    href={`/games/${g.slug}`}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
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
                      <h3 className="line-clamp-1 text-sm font-semibold text-gray-900 group-hover:text-brand-600 dark:text-white">
                        {g.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
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
