"use client";

import Link from "next/link";
import { Flame, ExternalLink } from "lucide-react";
import { formatPrice, formatDiscount } from "@/lib/utils";
import { STORES } from "@/lib/types";
import GameAvatar from "@/components/ui/GameAvatar";
import DealCarousel from "@/components/ui/DealCarousel";

interface HotDeal {
  id: string;
  store: string;
  price: number;
  original_price: number;
  discount_pct: number;
  game: {
    title: string;
    slug: string;
    cover_image: string | null;
    screenshot_image?: string | null;
  };
}

interface WhatsHotProps {
  deals: HotDeal[];
}

export default function WhatsHot({ deals }: WhatsHotProps) {
  if (deals.length === 0) return null;

  return (
    <section className="py-10">
      <div className="container-main">
        <DealCarousel
          title="What's Hot"
          subtitle="Trending deals and popular games right now"
          viewAllHref="/deals"
          viewAllLabel="See all"
        >
          {deals.map((deal) => {
            const store = STORES[deal.store] || { name: deal.store, color: "#666" };
            const bgImage = deal.game.screenshot_image || deal.game.cover_image;

            return (
              <div
                key={deal.id}
                className="group w-[260px] flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
              >
                {/* Landscape image */}
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
                      size="md"
                      aspectRatio="video"
                    />
                  )}
                  <div className="absolute right-2 top-2">
                    <span className="rounded bg-success-600 px-1.5 py-0.5 text-xs font-bold text-white">
                      {formatDiscount(deal.discount_pct)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <Link
                    href={`/games/${deal.game.slug}`}
                    className="line-clamp-1 text-sm font-semibold text-gray-900 hover:text-brand-600 dark:text-white"
                  >
                    {deal.game.title}
                  </Link>
                  <div className="mt-0.5">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-semibold text-white"
                      style={{ backgroundColor: store.color }}
                    >
                      {store.name}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(deal.original_price)}
                      </span>
                      <span className="ml-1 text-base font-bold text-gray-900 dark:text-white">
                        {formatPrice(deal.price)}
                      </span>
                    </div>
                    <a
                      href={`/go/${deal.id}`}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="rounded-lg bg-brand-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
                    >
                      Get Deal
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </DealCarousel>
      </div>
    </section>
  );
}
