"use client";

import Link from "next/link";
import {
  Eye,
  Shield,
  ShieldCheck,
  DollarSign,
  Scale,
  Swords,
  Gamepad2,
  Brain,
} from "lucide-react";
import {
  SCORE_CATEGORIES,
  getScoreTier,
  getScoreInsight,
  getScoreBarColor,
  getCategoryAverage,
  ScoreInputs,
} from "@/lib/scoring";

interface ScoreBreakdownProps {
  overall: number;
  transparency: number | null;
  compliance: number | null;
  ageGating: number | null;
  value: number | null;
  fairness: number | null;
  p2wImpact: number | null;
  playerControl: number | null;
  psychDesign: number | null;
  showMethodologyLink?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Eye,
  Shield,
  ShieldCheck,
  DollarSign,
  Scale,
  Swords,
  Gamepad2,
  Brain,
};

function SubScoreBar({
  score,
  name,
  icon: iconName,
  iconColor,
}: {
  score: number;
  name: string;
  icon: string;
  iconColor: string;
}) {
  const Icon = ICON_MAP[iconName];
  const pct = (score / 10) * 100;
  const barColor = getScoreBarColor(score);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${iconColor}`} />
          <span className="text-sm font-medium text-gray-700">{name}</span>
        </div>
        <span className="text-sm font-bold text-gray-900">{score}/10</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  subScoresData,
}: {
  category: (typeof SCORE_CATEGORIES)[0];
  subScoresData: Record<string, number | null>;
}) {
  const categoryAvg = getCategoryAverage(category.id, subScoresData as unknown as ScoreInputs);
  const weight = Math.round(category.weight * 100);

  return (
    <div
      className={`rounded-lg border-2 p-5 space-y-4 ${category.bgColor} ${category.borderColor}`}
    >
      {/* Header with category name and weight badge */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{category.name}</h3>
        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-200">
          {weight}%
        </span>
      </div>

      {/* Category average bar */}
      {categoryAvg !== null && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">
              Category Average
            </span>
            <span className="text-sm font-bold text-gray-900">
              {categoryAvg.toFixed(1)}/10
            </span>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(categoryAvg)}`}
              style={{ width: `${(categoryAvg / 10) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Sub-scores */}
      <div className="space-y-3 pt-2">
        {category.subScores.map((subScore) => {
          const score = subScoresData[subScore.key];
          if (score === null || score === undefined) return null;
          return (
            <SubScoreBar
              key={subScore.key}
              score={score}
              name={subScore.name}
              icon={subScore.icon}
              iconColor={subScore.iconColor}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function ScoreBreakdown({
  overall,
  transparency,
  compliance,
  ageGating,
  value,
  fairness,
  p2wImpact,
  playerControl,
  psychDesign,
  showMethodologyLink = true,
}: ScoreBreakdownProps) {
  const scoreTier = getScoreTier(overall);
  const scoreInsight = getScoreInsight({
    score_transparency: transparency,
    score_compliance: compliance,
    score_age_gating: ageGating,
    score_value: value,
    score_fairness: fairness,
    score_p2w_impact: p2wImpact,
    score_player_control: playerControl,
    score_psych_design: psychDesign,
  });

  const subScoresData = {
    score_transparency: transparency,
    score_compliance: compliance,
    score_age_gating: ageGating,
    score_value: value,
    score_fairness: fairness,
    score_p2w_impact: p2wImpact,
    score_player_control: playerControl,
    score_psych_design: psychDesign,
  };

  // Calculate average for database comparison
  const allScores = [
    transparency,
    compliance,
    ageGating,
    value,
    fairness,
    p2wImpact,
    playerControl,
    psychDesign,
  ].filter((s): s is number => s !== null);
  const subScoreAverage =
    allScores.length > 0
      ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Overall Score Badge */}
      <div className="flex items-start gap-4">
        <div
          className={`h-20 w-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0 ${scoreTier.color}`}
        >
          {overall.toFixed(1)}
        </div>
        <div className="flex-1 pt-1">
          <p className="font-semibold text-gray-900">{scoreTier.label}</p>
          <p className="text-sm text-gray-600 leading-snug">{scoreInsight}</p>
        </div>
      </div>

      {/* Category Cards */}
      <div className="space-y-4">
        {SCORE_CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            subScoresData={subScoresData}
          />
        ))}
      </div>

      {/* Methodology Link */}
      {showMethodologyLink && (
        <div className="text-center pt-2">
          <Link
            href="/methodology"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
          >
            How is this calculated?
          </Link>
        </div>
      )}

      {/* Database Comparison */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border border-gray-200">
        <div className="flex items-center justify-between">
          <span>Sub-score average:</span>
          <span className="font-semibold text-gray-900">
            {subScoreAverage.toFixed(1)}/10
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span>Database average:</span>
          <span className="font-semibold text-gray-900">4.6/10</span>
        </div>
      </div>
    </div>
  );
}
