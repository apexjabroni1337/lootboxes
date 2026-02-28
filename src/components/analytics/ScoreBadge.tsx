import { getScoreClass, getScoreLabel } from "@/lib/types";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function ScoreBadge({
  score,
  size = "md",
  showLabel = false,
}: ScoreBadgeProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-xl",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${getScoreClass(score)} ${sizeClasses[size]} inline-flex items-center justify-center rounded-lg font-bold text-white`}
      >
        {score.toFixed(1)}
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-900">
            Lootboxes Score
          </span>
          <span className="text-xs text-gray-500">{getScoreLabel(score)}</span>
        </div>
      )}
    </div>
  );
}
