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

export default function AnalyticsCard({ article }: AnalyticsCardProps) {
  return (
    <Link
      href={`/analytics/${article.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex gap-0">
        {/* Large thumbnail */}
        <div className="relative w-44 flex-shrink-0 overflow-hidden sm:w-52">
          {article.cover_image ? (
            <img
              src={article.cover_image}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <GameAvatar
              gameName={article.game?.title || article.title}
              size="md"
              aspectRatio="square"
              className="h-full w-full rounded-none"
            />
          )}
          {/* Gradient fade on right edge */}
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent dark:from-gray-900" />
          {/* Score overlay */}
          {article.lootboxes_score && (
            <div className="absolute bottom-3 left-3">
              <ScoreBadge score={article.lootboxes_score} size="sm" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center px-5 py-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {TYPE_LABELS[article.type] || article.type}
            </span>
            <span className="text-[11px] text-gray-400">
              {formatDate(article.published_at)}
            </span>
          </div>

          <h3 className="mt-2 text-base font-bold text-gray-900 transition-colors group-hover:text-brand-600 sm:text-lg dark:text-white">
            {article.title}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-3 dark:text-gray-400">
            {article.excerpt}
          </p>

          <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-all group-hover:gap-2">
            Read Analysis
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
