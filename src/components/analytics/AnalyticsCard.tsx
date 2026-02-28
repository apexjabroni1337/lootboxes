import Link from "next/link";
import { AnalyticsMeta } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import ScoreBadge from "./ScoreBadge";

interface AnalyticsCardProps {
  article: AnalyticsMeta;
}

const TYPE_LABELS: Record<string, string> = {
  battlepass: "Battle Pass",
  lootbox: "Loot Box",
  economy: "Economy",
  droprates: "Drop Rates",
};

export default function AnalyticsCard({ article }: AnalyticsCardProps) {
  return (
    <Link href={`/analytics/${article.slug}`} className="card group flex gap-4">
      {/* Thumbnail */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-28 sm:w-28">
        {article.cover_image ? (
          <img
            src={article.cover_image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <span className="badge-type">
            {TYPE_LABELS[article.type] || article.type}
          </span>
          {article.game && (
            <span className="text-xs text-gray-400">{article.game.title}</span>
          )}
        </div>

        <h3 className="mt-1 text-sm font-semibold text-gray-900 group-hover:text-brand-600 sm:text-base">
          {article.title}
        </h3>

        <p className="mt-1 line-clamp-2 text-xs text-gray-500">
          {article.excerpt}
        </p>

        <div className="mt-auto flex items-center gap-3 pt-2">
          {article.lootboxes_score && (
            <ScoreBadge score={article.lootboxes_score} size="sm" />
          )}
          <span className="text-xs text-gray-400">
            {formatDate(article.published_at)}
          </span>
        </div>
      </div>
    </Link>
  );
}
