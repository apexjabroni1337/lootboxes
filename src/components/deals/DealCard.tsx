import Link from "next/link";
import { formatPrice, formatDiscount } from "@/lib/utils";
import { Deal, STORES } from "@/lib/types";
import { ExternalLink, TrendingDown } from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";
import StoreIcon from "@/components/ui/StoreIcon";
import WishlistButton from "@/components/deals/WishlistButton";

interface DealCardProps {
  deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
  const store = STORES[deal.store] || { name: deal.store, color: "#666" };
  // Use screenshot (landscape) if available, then fall back to cover
  const bgImage = (deal.game as any)?.screenshot_image || deal.game?.cover_image;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      {/* ── Landscape game artwork ── */}
      <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
        {bgImage ? (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={bgImage}
              alt={deal.game?.title || "Game"}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ) : (
          <GameAvatar
            gameName={deal.game?.title || "Unknown"}
            size="md"
            aspectRatio="video"
            className="transition-transform group-hover:scale-[1.02]"
          />
        )}

        {/* Discount badge (top-right) */}
        <div className="absolute right-2 top-2">
          <span className="rounded-lg bg-success-600 px-2 py-1 text-sm font-bold text-white shadow-md">
            {formatDiscount(deal.discount_pct)}
          </span>
        </div>

        {/* Wishlist heart (top-left, above historic low if present) */}
        <div className="absolute left-2 top-2">
          <WishlistButton dealId={deal.id} />
        </div>

        {/* Historic low badge (bottom-left) */}
        {deal.is_historic_low && (
          <div className="absolute bottom-2 left-2">
            <span className="flex items-center gap-1 rounded-lg bg-brand-600 px-2 py-1 text-[10px] font-semibold text-white shadow-md">
              <TrendingDown className="h-3 w-3" />
              Historic Low
            </span>
          </div>
        )}
      </div>

      {/* ── Store badge bar ── */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2 dark:border-gray-800">
        <StoreIcon store={deal.store} size="sm" />
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{store.name}</span>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <Link
          href={`/games/${deal.game?.slug || deal.game_id}`}
          className="line-clamp-1 text-sm font-semibold text-gray-900 hover:text-brand-600 dark:text-white"
        >
          {deal.game?.title || "Unknown Game"}
        </Link>

        {/* Pricing row */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
            {formatPrice(deal.original_price)}
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatPrice(deal.price)}
          </span>
        </div>

        {/* Full-width CTA button */}
        <a
          href={`/go/${deal.id}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Get Deal
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
