import Link from "next/link";
import { formatPrice, formatDiscount, timeAgo } from "@/lib/utils";
import { STORES } from "@/lib/types";
import { TrendingDown, ExternalLink, Filter, Tag, Sparkles, Clock } from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";
import { createServerClient } from "@/lib/supabase";

export const metadata = {
  title: "Best Gaming Deals Today — Compare Prices Across Every Store",
  description:
    "Find the cheapest prices on PC and console games. Compare deals across Steam, Epic, GOG, Humble Bundle, and more. Updated every 30 minutes.",
};

// Revalidate every 5 minutes so data stays fresh
export const revalidate = 300;

async function getDeals() {
  const supabase = createServerClient();

  const { data: deals, error } = await supabase
    .from("deals")
    .select(`
      id,
      game_id,
      store,
      store_url,
      price,
      original_price,
      discount_pct,
      currency,
      is_historic_low,
      expires_at,
      affiliate_url,
      scraped_at,
      games!inner (
        id,
        title,
        slug
      )
    `)
    .order("discount_pct", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Deals query error:", error.message);
    return [];
  }

  return deals || [];
}

export default async function DealsPage() {
  const deals = await getDeals();
  const historicLowCount = deals.filter((d: any) => d.is_historic_low).length;
  const bigDiscountCount = deals.filter((d: any) => d.discount_pct >= 50).length;

  // Get unique store count
  const uniqueStores = new Set(deals.map((d: any) => d.store));

  return (
    <div className="pb-12">
      {/* Page hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-8 sm:py-10">
        <div className="container-main">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                <Sparkles className="h-3 w-3" />
                Updated every 30 minutes
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Gaming Deals</h1>
              <p className="mt-1 text-sm text-gray-500">
                {deals.length} active deals across {uniqueStores.size} stores.{" "}
                <span className="font-medium text-brand-600">{historicLowCount} at historic low prices.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-main mt-6">
        {/* Quick stats */}
        <div className="flex flex-wrap gap-3">
          {historicLowCount > 0 && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-700">
              <TrendingDown className="h-3 w-3" />
              {historicLowCount} Historic Lows
            </div>
          )}
          {bigDiscountCount > 0 && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              <Tag className="h-3 w-3" />
              {bigDiscountCount} deals 50%+ off
            </div>
          )}
        </div>

        {/* Deals table */}
        {deals.length === 0 ? (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-500">No deals available right now. Check back soon!</p>
          </div>
        ) : (
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
                {deals.map((deal: any) => {
                  const game = deal.games;
                  const storeInfo = STORES[deal.store] || { name: deal.store, color: "#666" };
                  const hasDiscount = deal.discount_pct > 0;

                  return (
                    <tr
                      key={deal.id}
                      className={`transition-colors hover:bg-gray-50 ${deal.is_historic_low ? "bg-success-50/30" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                            <GameAvatar gameName={game.title} size="sm" aspectRatio="square" />
                          </div>
                          <div>
                            <Link
                              href={`/games/${game.slug}`}
                              className="text-sm font-semibold text-gray-900 hover:text-brand-600"
                            >
                              {game.title}
                            </Link>
                            {deal.is_historic_low && (
                              <div className="mt-0.5 flex items-center gap-1">
                                <TrendingDown className="h-3 w-3 text-brand-600" />
                                <span className="text-xs font-medium text-brand-600">Historic Low</span>
                              </div>
                            )}
                            {deal.expires_at && (
                              <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                                <Clock className="h-3 w-3" />
                                Expires {timeAgo(deal.expires_at)}
                              </div>
                            )}
                            <div className="mt-1 sm:hidden">
                              <span className="badge text-[10px] text-white" style={{ backgroundColor: storeInfo.color }}>
                                {storeInfo.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <span className="badge text-xs text-white" style={{ backgroundColor: storeInfo.color }}>
                          {storeInfo.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div>
                          {hasDiscount && (
                            <>
                              <span className="text-xs text-gray-400 line-through">{formatPrice(deal.original_price, deal.currency)}</span>
                              <br />
                            </>
                          )}
                          <span className="text-sm font-bold text-gray-900">{formatPrice(deal.price, deal.currency)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {hasDiscount ? (
                          <span className="badge-discount">{formatDiscount(deal.discount_pct)}</span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={deal.affiliate_url || deal.store_url}
                          target="_blank"
                          rel="noopener noreferrer"
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
        )}

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
