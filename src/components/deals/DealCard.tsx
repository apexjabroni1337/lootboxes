import Link from "next/link";
import { formatPrice, formatDiscount } from "@/lib/utils";
import { Deal, STORES } from "@/lib/types";
import { ExternalLink, TrendingDown } from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";

interface DealCardProps {
  deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
  const store = STORES[deal.store] || { name: deal.store, color: "#666" };

  return (
    <div className="card group flex flex-col transition-shadow hover:shadow-lg">
      {/* Game cover */}
      <div className="relative mb-3 overflow-hidden rounded-lg">
        {deal.game?.cover_image ? (
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={deal.game.cover_image}
              alt={deal.game.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ) : (
          <GameAvatar
            gameName={deal.game?.title || "Unknown"}
            size="md"
            aspectRatio="portrait"
            className="transition-transform group-hover:scale-[1.02]"
          />
        )}

        {/* Discount badge */}
        <div className="absolute right-2 top-2">
          <span className="badge-discount text-sm">
            {formatDiscount(deal.discount_pct)}
          </span>
        </div>

        {/* Historic low badge */}
        {deal.is_historic_low && (
          <div className="absolute left-2 top-2">
            <span className="badge-historic-low flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              Historic Low
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <Link
          href={`/games/${deal.game?.slug || deal.game_id}`}
          className="text-sm font-semibold text-gray-900 hover:text-brand-600"
        >
          {deal.game?.title || "Unknown Game"}
        </Link>

        {/* Store badge */}
        <div className="mt-1">
          <span
            className="badge text-xs text-white"
            style={{ backgroundColor: store.color }}
          >
            {store.name}
          </span>
        </div>

        {/* Pricing */}
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(deal.original_price)}
            </span>
            <span className="ml-2 text-lg font-bold text-gray-900">
              {formatPrice(deal.price)}
            </span>
          </div>

          <a
            href={`/go/${deal.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-1 py-1.5 text-xs"
          >
            Get Deal
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
