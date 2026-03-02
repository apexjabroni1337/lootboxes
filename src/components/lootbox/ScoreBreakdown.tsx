"use client";

import { Eye, DollarSign, Scale, Gamepad2 } from "lucide-react";

interface ScoreBreakdownProps {
  overall: number;
  transparency: number | null;
  value: number | null;
  fairness: number | null;
  playerControl: number | null;
}

function ScoreBar({ score, label, icon: Icon, color }: {
  score: number;
  label: string;
  icon: React.ElementType;
  color: string;
}) {
  const pct = (score / 10) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-sm font-bold text-gray-900">{score}/10</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            score >= 7
              ? "bg-emerald-500"
              : score >= 5
              ? "bg-amber-400"
              : score >= 3
              ? "bg-orange-500"
              : "bg-red-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ScoreBreakdown({
  overall,
  transparency,
  value,
  fairness,
  playerControl,
}: ScoreBreakdownProps) {
  const scores = [
    { score: transparency, label: "Transparency", icon: Eye, color: "text-blue-500" },
    { score: value, label: "Value for Money", icon: DollarSign, color: "text-emerald-500" },
    { score: fairness, label: "Fairness", icon: Scale, color: "text-purple-500" },
    { score: playerControl, label: "Player Control", icon: Gamepad2, color: "text-amber-500" },
  ].filter((s) => s.score !== null) as { score: number; label: string; icon: React.ElementType; color: string }[];

  const avg = scores.length > 0 ? scores.reduce((sum, s) => sum + s.score, 0) / scores.length : overall;

  return (
    <div className="space-y-5">
      {/* Overall score */}
      <div className="flex items-center gap-4">
        <div
          className={`h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white ${
            overall >= 7
              ? "bg-emerald-500"
              : overall >= 5
              ? "bg-amber-500"
              : overall >= 3
              ? "bg-orange-500"
              : "bg-red-500"
          }`}
        >
          {overall.toFixed(1)}
        </div>
        <div>
          <p className="font-semibold text-gray-900">
            Overall Lootboxes Score
          </p>
          <p className="text-sm text-gray-500">
            {overall >= 7
              ? "Good value — reasonable monetization"
              : overall >= 5
              ? "Average — mixed monetization practices"
              : overall >= 3
              ? "Below average — concerning practices"
              : "Poor value — highly predatory monetization"}
          </p>
        </div>
      </div>

      {/* Individual breakdowns */}
      <div className="space-y-3">
        {scores.map((s) => (
          <ScoreBar key={s.label} {...s} />
        ))}
      </div>

      {/* Category average comparison */}
      {scores.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
          Sub-score average: <span className="font-semibold text-gray-900">{avg.toFixed(1)}/10</span>
          {" · "}
          Database average: <span className="font-semibold text-gray-900">4.6/10</span>
        </div>
      )}
    </div>
  );
}
