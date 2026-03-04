import Link from "next/link";
import { AnalyticsMeta } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import ScoreBadge from "./ScoreBadge";
import GameAvatar from "@/components/ui/GameAvatar";
import { ArrowRight } from "lucide-react";

interface AnalyticsCardProps {
  article: AnalyticsMeta;
}

const TYPE_LABELS: Record<string, string> = {
  battlepass: "Battle Pass",
  lootbox: "Loot Box",
  economy: "Economy",
  droprates: "Drop Rates",
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  battlepass: { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-300" },
  lootbox: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-300" },
  economy: { bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-300" },
  droprates: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-300" },
};

export default function AnalyticsCard({ article }: AnalyticsCardProps) {
  const typeColor = TYPE_COLORS[article.type] || { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300" };

  return (
    <Link
      href={`/analytics/${article.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900"
    >
      {/* Image container - top of card */}
      <div className="relative h-40 sm:h-44 overflow-hidden bg-gray-100 dark:bg-gray-800">
        {article.cover_image ? (
          <img
            src={article.cover_image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <GameAvatar
            gameName={article.game?.title || article.title}
            size="lg"
            aspectRatio="video"
            className="h-full w-full rounded-none"
          />
        )}

        {/* Dark gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Score badge - overlaid on image, bottom-left */}
        {article.lootboxes_score && (
          <div className="absolute bottom-4 left-4">
            <ScoreBadge score={article.lootboxes_score} size="sm" />
          </div>
        )}

        {/* Type badge - top-right on image */}
        <div className={`absolute top-4 right-4 inline-flex rounded-xl px-3 py-1.5 text-xs font-semibold ${typeColor.bg} ${typeColor.text}`}>
          {TYPE_LABELS[article.type] || article.type}
        </div>
      </div>

      {/* Content - bottom of card */}
      <div className="flex flex-1 flex-col px-5 py-5">
        <div className="text-[11px] text-gray-500 dark:text-gray-400">
          {formatDate(article.published_at)}
        </div>

        <h3 className="mt-3 text-lg font-bold text-gray-900 transition-colors group-hover:text-brand-600 dark:text-white line-clamp-3">
          {article.title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-2 flex-1">
          {article.excerpt}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 transition-all group-hover:gap-3">
          Read Analysis
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
