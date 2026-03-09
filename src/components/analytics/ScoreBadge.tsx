import { getScoreClass, getScoreLabel } from "@/lib/types";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

function getScoreColor(score: number) {
  if (score >= 8) return { bg: "bg-emerald-500", ring: "ring-emerald-200", text: "text-emerald-700", light: "bg-emerald-50", bar: "bg-emerald-500" };
  if (score >= 6) return { bg: "bg-blue-500", ring: "ring-blue-200", text: "text-blue-700", light: "bg-blue-50", bar: "bg-blue-500" };
  if (score >= 4) return { bg: "bg-amber-500", ring: "ring-amber-200", text: "text-amber-700", light: "bg-amber-50", bar: "bg-amber-500" };
  return { bg: "bg-red-500", ring: "ring-red-200", text: "text-red-700", light: "bg-red-50", bar: "bg-red-500" };
}

export default function ScoreBadge({
  score,
  size = "md",
  showLabel = false,
}: ScoreBadgeProps) {
  const colors = getScoreColor(score);

  if (size === "sm") {
    return (
      <div className="flex items-center gap-1.5">
        <div className={`${getScoreClass(score)} h-7 w-7 text-[11px] rounded-lg`}>
          {score.toFixed(1)}
        </div>
        {showLabel && (
          <span className="text-[10px] font-medium text-gray-500">{getScoreLabel(score)}</span>
        )}
      </div>
    );
  }

  if (size === "md") {
    return (
      <div className="flex items-center gap-2">
        <div className={`${getScoreClass(score)} h-9 w-9 text-sm rounded-lg`}>
          {score.toFixed(1)}
        </div>
        {showLabel && (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-900">Lootboxes Score</span>
            <span className="text-xs text-gray-500">{getScoreLabel(score)}</span>
          </div>
        )}
      </div>
    );
  }

  // Large size — full visual gauge card
  const pct = (score / 10) * 100;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Circular-style score display */}
      <div className={`relative h-20 w-20 rounded-2xl ${colors.bg} ring-4 ${colors.ring} flex items-center justify-center shadow-lg`}>
        <span className="text-2xl font-black text-white leading-none">
          {score.toFixed(1)}
        </span>
        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold shadow-sm border border-gray-100 whitespace-nowrap"
          style={{ color: `var(--tw-ring-color, currentColor)` }}
        >
          <span className={colors.text}>{getScoreLabel(score)}</span>
        </span>
      </div>

      {showLabel && (
        <div className="w-full mt-1">
          {/* Score bar */}
          <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
            <span>0</span>
            <span className="font-medium text-gray-500">Lootboxes Score</span>
            <span>10</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${colors.bar} transition-all duration-500`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {/* Scale labels */}
          <div className="flex justify-between mt-1.5 text-[9px] text-gray-400">
            <span>Poor</span>
            <span>Average</span>
            <span>Good</span>
            <span>Great</span>
          </div>
        </div>
      )}
    </div>
  );
}
