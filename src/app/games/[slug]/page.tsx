import Link from "next/link";
import { formatPrice, formatDiscount, formatDate } from "@/lib/utils";
import { STORES, getScoreClass, getScoreLabel } from "@/lib/types";
import ScoreBadge from "@/components/analytics/ScoreBadge";
import PriceChart from "@/components/games/PriceChart";
import {
  ExternalLink,
  TrendingDown,
  Calendar,
  Star,
  Monitor,
  Tag,
  ArrowRight,
} from "lucide-react";

// TODO: Replace with Supabase queries
const MOCK_GAME = {
  id: "1",
  title: "Elden Ring",
  slug: "elden-ring",
  cover_image: null,
  platforms: ["PC", "PS5", "Xbox Series X"],
  genres: ["RPG", "Action", "Open World"],
  release_date: "2022-02-25",
  metacritic: 96,
  lootboxes_score: null,
};

const MOCK_DEALS = [
  { id: "d1", store: "steam", price: 29.99, original: 59.99, discount: 50, historicLow: true, affiliate: "#", expires: null },
  { id: "d2", store: "humble", price: 32.99, original: 59.99, discount: 45, historicLow: false, affiliate: "#", expires: null },
  { id: "d3", store: "fanatical", price: 33.49, original: 59.99, discount: 44, historicLow: false, affiliate: "#", expires: "2026-03-15" },
  { id: "d4", store: "gmg", price: 35.99, original: 59.99, discount: 40, historicLow: false, affiliate: "#", expires: null },
  { id: "d5", store: "gog", price: 39.99, original: 59.99, discount: 33, historicLow: false, affiliate: "#", expires: null },
  { id: "d6", store: "epic", price: 44.99, original: 59.99, discount: 25, historicLow: false, affiliate: "#", expires: null },
];

const MOCK_PRICE_HISTORY = [
  { date: "2025-08-01", steam: 59.99, humble: 59.99, gog: 59.99 },
  { date: "2025-09-01", steam: 47.99, humble: 49.99, gog: 53.99 },
  { date: "2025-10-01", steam: 39.99, humble: 41.99, gog: 44.99 },
  { date: "2025-11-01", steam: 29.99, humble: 34.99, gog: 39.99 },
  { date: "2025-12-01", steam: 35.99, humble: 39.99, gog: 44.99 },
  { date: "2026-01-01", steam: 44.99, humble: 47.99, gog: 49.99 },
  { date: "2026-02-01", steam: 29.99, humble: 32.99, gog: 39.99 },
];

const MOCK_SIMILAR = [
  { title: "Dark Souls III", slug: "dark-souls-3", bestPrice: 14.99 },
  { title: "Sekiro", slug: "sekiro", bestPrice: 24.99 },
  { title: "Baldur's Gate 3", slug: "baldurs-gate-3", bestPrice: 35.99 },
  { title: "Lies of P", slug: "lies-of-p", bestPrice: 29.99 },
];

export async function generateMetadata({ params }: { params: { slug: string } }) {
  // TODO: Fetch game from Supabase
  return {
    title: `${MOCK_GAME.title} — Best Price, Deals & Analysis`,
    description: `Compare prices for ${MOCK_GAME.title} across Steam, Epic, GOG, Humble Bundle, and more. Find the cheapest deal and see the full price history.`,
  };
}

export default function GamePage({ params }: { params: { slug: string } }) {
  const game = MOCK_GAME;
  const bestDeal = MOCK_DEALS[0];

  return (
    <div className="py-8">
      <div className="container-main">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/games" className="hover:text-gray-600">Games</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{game.title}</span>
        </nav>

        {/* Game header */}
        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Cover art */}
          <div className="h-48 w-full flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-56 sm:w-44">
            {game.cover_image ? (
              <img src={game.cover_image} alt={game.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl font-bold text-gray-300">
                {game.title[0]}
              </div>
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
              <span className="flex items-center gap-1">
                <Monitor className="h-4 w-4" />
                {game.platforms.join(", ")}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {game.genres.map((g) => (
                <span key={g} className="badge-type">{g}</span>
              ))}
            </div>

            {game.lootboxes_score && (
              <div className="mt-4">
                <ScoreBadge score={game.lootboxes_score} size="lg" showLabel />
              </div>
            )}

            {/* Best price callout */}
            <div className="mt-4 inline-flex items-center gap-4 rounded-xl border border-success-500/30 bg-success-50 px-5 py-3">
              <div>
                <div className="text-xs font-medium text-success-700">Best Price Right Now</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{formatPrice(bestDeal.price)}</span>
                  <span className="text-sm text-gray-400 line-through">{formatPrice(bestDeal.original)}</span>
                  <span className="badge-discount">{formatDiscount(bestDeal.discount)}</span>
                </div>
                <div className="mt-0.5 text-xs text-gray-500">
                  on {STORES[bestDeal.store]?.name}
                  {bestDeal.historicLow && (
                    <span className="ml-2 font-medium text-brand-600">
                      <TrendingDown className="mr-0.5 inline h-3 w-3" />
                      All-time low!
                    </span>
                  )}
                </div>
              </div>
              <a href={`/go/${bestDeal.id}`} className="btn-primary flex items-center gap-1">
                Get Deal <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Price comparison table */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">Price Comparison</h2>
          <p className="mt-1 text-sm text-gray-500">
            All current deals for {game.title} across every store.
          </p>

          <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
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
                {MOCK_DEALS.map((deal, i) => {
                  const store = STORES[deal.store] || { name: deal.store, color: "#666" };
                  return (
                    <tr key={deal.id} className={`transition-colors hover:bg-gray-50 ${i === 0 ? "bg-success-50/50" : ""}`}>
                      <td className="px-4 py-3">
                        <span className="badge text-xs text-white" style={{ backgroundColor: store.color }}>
                          {store.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-bold text-gray-900">{formatPrice(deal.price)}</span>
                      </td>
                      <td className="hidden px-4 py-3 text-right sm:table-cell">
                        <span className="badge-discount">{formatDiscount(deal.discount)}</span>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {deal.historicLow && (
                            <span className="badge-historic-low flex items-center gap-1">
                              <TrendingDown className="h-3 w-3" /> Historic Low
                            </span>
                          )}
                          {deal.expires && (
                            <span>Expires {formatDate(deal.expires)}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a href={`/go/${deal.id}`} className={`btn inline-flex items-center gap-1 py-1.5 text-xs ${i === 0 ? "bg-success-600 text-white hover:bg-success-700" : "btn-secondary"}`}>
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

        {/* Price History Chart */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">Price History</h2>
          <p className="mt-1 text-sm text-gray-500">
            Track how the price has changed over time across stores.
          </p>
          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
            <PriceChart data={MOCK_PRICE_HISTORY} />
          </div>
        </section>

        {/* Analytics section (if available) */}
        {game.lootboxes_score && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900">Monetization Analysis</h2>
            <div className="mt-4 card bg-brand-50 border-brand-200">
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
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">Similar Games</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MOCK_SIMILAR.map((g) => (
              <Link key={g.slug} href={`/games/${g.slug}`} className="card group flex items-center gap-3">
                <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gray-100" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-brand-600">{g.title}</h3>
                  <p className="text-xs text-gray-500">From {formatPrice(g.bestPrice)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
