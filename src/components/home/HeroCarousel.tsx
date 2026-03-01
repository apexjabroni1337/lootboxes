"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice, formatDiscount } from "@/lib/utils";
import { STORES } from "@/lib/types";

interface CarouselDeal {
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

interface HeroCarouselProps {
  deals: CarouselDeal[];
}

export default function HeroCarousel({ deals }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = deals.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next, total]);

  if (deals.length === 0) return null;

  const deal = deals[current];
  const store = STORES[deal.store] || { name: deal.store, color: "#666" };

  // Use screenshot for background, fall back to cover, fall back to gradient
  const bgImage = deal.game.screenshot_image || deal.game.cover_image;

  return (
    <section
      className="relative overflow-hidden bg-brand-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background image with overlay */}
      <div className="relative h-[340px] sm:h-[400px] lg:h-[460px]">
        {bgImage ? (
          <img
            key={current}
            src={bgImage}
            alt={deal.game.title}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900" />
        )}

        {/* Light overlay for readability (keeps things bright) */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/30" />

        {/* Content overlay */}
        <div className="container-main relative flex h-full items-center">
          <div className="max-w-lg">
            {/* Store badge */}
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: store.color }}
            >
              {store.name}
            </span>

            {/* Game title */}
            <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl drop-shadow-sm">
              {deal.game.title}
            </h2>

            {/* Pricing row */}
            <div className="mt-4 flex items-center gap-3">
              <span className="inline-flex items-center rounded-lg bg-success-600 px-3 py-1.5 text-lg font-bold text-white">
                {formatDiscount(deal.discount_pct)}
              </span>
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(deal.original_price)}
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(deal.price)}
              </span>
            </div>

            {/* CTA button */}
            <div className="mt-5 flex gap-3">
              <a
                href={`/go/${deal.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-6 py-2.5 text-base"
              >
                Get Deal
              </a>
              <Link
                href={`/games/${deal.game.slug}`}
                className="btn-secondary px-6 py-2.5 text-base"
              >
                View Game
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {total > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {deals.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === current
                    ? "w-8 bg-brand-600"
                    : "w-2.5 bg-gray-400/50 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
