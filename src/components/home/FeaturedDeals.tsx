import Link from "next/link";
import { Star, ExternalLink, TrendingDown } from "lucide-react";
import { formatPrice, formatDiscount } from "@/lib/utils";
import { STORES } from "@/lib/types";
import GameAvatar from "@/components/ui/GameAvatar";

interface FeaturedDeal {
  id: string;
  store: string;
  price: number;
  original_price: number;
  discount_pct: number;
  is_historic_low: boolean;
  game: {
    title: string;
    slug: string;
    cover_image: string | null;
    screenshot_image?: string | null;
  };
}

interface FeaturedDealsProps {
  deals: FeaturedDeal[];
}

export default function FeaturedDeals({ deals }: FeaturedDealsProps) {
  if (deals.length === 0) return null;

  return (
    <section className="py-10">
      <div className="container-main">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50">
              <Star className="h-4 w-4 text-brand-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Deals</h2>
          </div>
          <Link
            href="/deals"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all →
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deals.slice(0, 3).map((deal) => {
            const store = STORES[deal.store] || { name: deal.store, color: "#666" };
            const bgImage = deal.game.screenshot_image || deal.game.cover_image;

            return (
              <div
                key={deal.id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
              >
                {/* Wide landscape image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  {bgImage ? (
                    <img
                      src={bgImage}
                      alt={deal.game.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <GameAvatar
                      gameName={deal.game.title}
                      size="lg"
                      aspectRatio="video"
                    />
                  )}

                  {/* Discount badge */}
                  <div className="absolute right-2 top-2">
                    <span className="rounded-lg bg-success-600 px-2 py-1 text-sm font-bold text-white shadow-md">
                      {formatDiscount(deal.discount_pct)}
                    </span>
                  </div>

                  {deal.is_historic_low && (
                    <div className="absolute left-2 top-2">
                      <span className="flex items-center gap-1 rounded-lg bg-brand-600 px-2 py-1 text-[10px] font-semibold text-white shadow-md">
                        <TrendingDown className="h-3 w-3" />
                        Historic Low
                      </span>
                    </div>
                  )}
                </div>

                {/* Store badge */}
                <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-2">
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white"
                    style={{ backgroundColor: store.color }}
                  >
                    {store.name}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <Link
                    href={`/games/${deal.game.slug}`}
                    className="text-base font-semibold text-gray-900 hover:text-brand-600"
                  >
                    {deal.game.title}
                  </Link>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(deal.original_price)}
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        {formatPrice(deal.price)}
                      </span>
                    </div>
                    <a
                      href={`/go/${deal.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center gap-1 py-2 text-sm"
                    >
                      Get Deal
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
