import Link from "next/link";
import { formatPrice, formatDiscount } from "@/lib/utils";
import { STORES } from "@/lib/types";
import { TrendingDown, ExternalLink, Filter, Grid3X3, List } from "lucide-react";

// TODO: Replace with Supabase query
const MOCK_DEALS = [
  { id: "d1", game: "Elden Ring", slug: "elden-ring", store: "steam", price: 29.99, original: 59.99, discount: 50, historicLow: true },
  { id: "d2", game: "Cyberpunk 2077", slug: "cyberpunk-2077", store: "epic", price: 19.99, original: 59.99, discount: 67, historicLow: true },
  { id: "d3", game: "Baldur's Gate 3", slug: "baldurs-gate-3", store: "gog", price: 35.99, original: 59.99, discount: 40, historicLow: false },
  { id: "d4", game: "Elden Ring", slug: "elden-ring", store: "humble", price: 32.99, original: 59.99, discount: 45, historicLow: false },
  { id: "d5", game: "Hades II", slug: "hades-ii", store: "steam", price: 17.49, original: 24.99, discount: 30, historicLow: true },
  { id: "d6", game: "Cyberpunk 2077", slug: "cyberpunk-2077", store: "fanatical", price: 22.49, original: 59.99, discount: 63, historicLow: false },
  { id: "d7", game: "Hogwarts Legacy", slug: "hogwarts-legacy", store: "gmg", price: 19.99, original: 59.99, discount: 67, historicLow: true },
  { id: "d8", game: "God of War Ragnarök", slug: "god-of-war-ragnarok", store: "steam", price: 29.99, original: 59.99, discount: 50, historicLow: false },
  { id: "d9", game: "Starfield", slug: "starfield", store: "xbox", price: 34.99, original: 69.99, discount: 50, historicLow: true },
  { id: "d10", game: "Red Dead Redemption 2", slug: "rdr2", store: "steam", price: 14.99, original: 59.99, discount: 75, historicLow: false },
];

export const metadata = {
  title: "Best Gaming Deals Today — Compare Prices Across Every Store",
  description:
    "Find the cheapest prices on PC and console games. Compare deals across Steam, Epic, GOG, Humble Bundle, and more. Updated every hour.",
};

export default function DealsPage() {
  return (
    <div className="py-8">
      <div className="container-main">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gaming Deals</h1>
            <p className="mt-1 text-sm text-gray-500">
              Compare prices across every major store. Updated hourly.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <Filter className="h-4 w-4 text-gray-400" />

          {/* Store filter */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(STORES).map(([key, store]) => (
              <button
                key={key}
                className="badge border border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                {store.name}
              </button>
            ))}
          </div>

          <div className="hidden h-6 w-px bg-gray-200 sm:block" />

          {/* Sort */}
          <select className="input text-xs">
            <option>Best Discount</option>
            <option>Lowest Price</option>
            <option>Newest</option>
            <option>Ending Soon</option>
          </select>

          {/* Min discount */}
          <select className="input text-xs">
            <option>Any Discount</option>
            <option>25%+ Off</option>
            <option>50%+ Off</option>
            <option>75%+ Off</option>
          </select>
        </div>

        {/* Deals table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Game
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 sm:table-cell">
                  Store
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                  Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                  Discount
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                  &nbsp;
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_DEALS.map((deal) => {
                const store = STORES[deal.store] || {
                  name: deal.store,
                  color: "#666",
                };
                return (
                  <tr
                    key={deal.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-100" />
                        <div>
                          <Link
                            href={`/games/${deal.slug}`}
                            className="text-sm font-semibold text-gray-900 hover:text-brand-600"
                          >
                            {deal.game}
                          </Link>
                          {deal.historicLow && (
                            <div className="mt-0.5 flex items-center gap-1">
                              <TrendingDown className="h-3 w-3 text-brand-600" />
                              <span className="text-xs font-medium text-brand-600">
                                Historic Low
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span
                        className="badge text-xs text-white"
                        style={{ backgroundColor: store.color }}
                      >
                        {store.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div>
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(deal.original)}
                        </span>
                        <br />
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(deal.price)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="badge-discount">
                        {formatDiscount(deal.discount)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={`/go/${deal.id}`}
                        className="btn-primary inline-flex items-center gap-1 py-1.5 text-xs"
                      >
                        Get Deal
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
