"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Clock, ExternalLink, TrendingDown } from "lucide-react";
import { formatPrice, formatDiscount } from "@/lib/utils";
import { STORES } from "@/lib/types";
import GameAvatar from "@/components/ui/GameAvatar";

interface FlashDeal {
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

interface FlashDealsProps {
  deals: FlashDeal[];
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const getEndOfDay = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      return end;
    };

    const update = () => {
      const now = new Date();
      const end = getEndOfDay();
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-1">
      <Clock className="mr-1 h-4 w-4 text-amber-500" />
      <span className="text-xs font-medium text-gray-500">Ends in</span>
      {[
        { value: timeLeft.hours, label: "h" },
        { value: timeLeft.minutes, label: "m" },
        { value: timeLeft.seconds, label: "s" },
      ].map((unit, i) => (
        <span key={i} className="flex items-center">
          <span className="rounded bg-gray-900 px-1.5 py-0.5 text-xs font-bold tabular-nums text-white">
            {pad(unit.value)}
          </span>
          <span className="ml-0.5 text-[10px] text-gray-400">{unit.label}</span>
        </span>
      ))}
    </div>
  );
}

export default function FlashDeals({ deals }: FlashDealsProps) {
  if (deals.length === 0) return null;

  return (
    <section className="py-10">
      <div className="container-main">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                <Zap className="h-4 w-4 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Flash Deals</h2>
            </div>
            <CountdownTimer />
          </div>
          <Link
            href="/deals"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            See all deals →
          </Link>
        </div>

        {/* Flash deal cards — 3 across, landscape style */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deals.slice(0, 3).map((deal) => {
            const store = STORES[deal.store] || { name: deal.store, color: "#666" };
            const bgImage = deal.game.screenshot_image || deal.game.cover_image;

            return (
              <div
                key={deal.id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
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

                  {/* Historic low */}
                  {deal.is_historic_low && (
                    <div className="absolute left-2 top-2">
                      <span className="flex items-center gap-1 rounded-lg bg-brand-600 px-2 py-1 text-[10px] font-semibold text-white shadow-md">
                        <TrendingDown className="h-3 w-3" />
                        Historic Low
                      </span>
                    </div>
                  )}
                </div>

                {/* Store badge bar */}
                <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-2 dark:border-gray-800">
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white"
                    style={{ backgroundColor: store.color }}
                  >
                    {store.name}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <Link
                    href={`/games/${deal.game.slug}`}
                    className="text-base font-semibold text-gray-900 hover:text-brand-600 dark:text-white"
                  >
                    {deal.game.title}
                  </Link>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(deal.original_price)}
                      </span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
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
