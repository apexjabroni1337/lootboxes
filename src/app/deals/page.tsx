import Link from "next/link";
import { formatPrice, formatDiscount } from "@/lib/utils";
import { STORES } from "@/lib/types";
import { TrendingDown, ExternalLink, Filter, Tag, Sparkles } from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";

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
  { id: "d11", game: "Monster Hunter Wilds", slug: "monster-hunter-wilds", store: "steam", price: 44.99, original: 69.99, discount: 36, historicLow: true },
  { id: "d12", game: "Lies of P", slug: "lies-of-p", store: "humble", price: 19.99, original: 39.99, discount: 50, historicLow: false },
];

export const metadata = {
  title: "Best Gaming Deals Today — Compare Prices Across Every Store",
  description:
    "Find the cheapest prices on PC and console games. Compare deals across Steam, Epic, GOG, Humble Bundle, and more. Updated every hour.",
};

export default function DealsPage() {
  const historicLowCount = MOCK_DEALS.filter((d) => d.historicLow).length;

  return (
    <div className="pb-12">
      {/* Page hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-8 sm:py-10">
        <div className="container-main">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                <Sparkles className="h-3 w-3" />
                Updated every hour
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Gaming Deals</h1>
              <p className="mt-1 text-sm text-gray-500">
                {MOCK_DEALS.length} active deals across {Object.keys(STORES).length}+ stores.{" "}
                <span className="font-medium text-brand-600">{historicLowCount} at historic low prices.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-main mt-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <Filter className="h-4 w-4 text-gray-400" />

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

          <select className="input text-xs">
            <option>Best Discount</option>
            <option>Lowest Price</option>
            <option>Newest</option>
            <option>Ending Soon</option>
          </select>

          <select className="input text-xs">
            <option>Any Discount</option>
            <option>25%+ Off</option>
            <option>50%+ Off</option>
            <option>75%+ Off</option>
          </select>
        </div>

        {/* Quick stats */}
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-700">
            <TrendingDown className="h-3 w-3" />
            {historicLowCount} Historic Lows
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            <Tag className="h-3 w-3" />
            {MOCK_DEALS.filter((d) => d.discount >= 50).length} deals 50%+ off
          </div>
        </div>

        {/* Deals table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Game</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 sm:table-cell">Store</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Price</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Discount</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">&nbsp;</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_DEALS.map((deal) => {
                const store = STORES[deal.store] || { name: deal.store, color: "#666" };
                return (
                  <tr
                    key={deal.id}
                    className={`transition-colors hover:bg-gray-50 ${deal.historicLow ? "bg-success-50/30" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                          <GameAvatar gameName={deal.game} size="sm" aspectRatio="square" />
                        </div>
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
                              <span className="text-xs font-medium text-brand-600">Historic Low</span>
                            </div>
                          )}
                          <div className="mt-1 sm:hidden">
                            <span className="badge text-[10px] text-white" style={{ backgroundColor: store.color }}>
                              {store.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="badge text-xs text-white" style={{ backgroundColor: store.color }}>
                        {store.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div>
                        <span className="text-xs text-gray-400 line-through">{formatPrice(deal.original)}</span>
                        <br />
                        <span className="text-sm font-bold text-gray-900">{formatPrice(deal.price)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="badge-discount">{formatDiscount(deal.discount)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a href={`/go/${deal.id}`} className="btn-primary inline-flex items-center gap-1 py-1.5 text-xs">
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

        {/* Bottom CTA */}
        <div className="mt-8 rounded-xl border border-brand-200 bg-brand-50 p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900">Never miss a deal</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get the best deals delivered to your inbox every week. No spam.
          </p>
          <Link href="/newsletter" className="btn-primary mt-4 inline-flex">
            Get Deal Alerts
          </Link>
        </div>
      </div>
    </div>
  );
}
