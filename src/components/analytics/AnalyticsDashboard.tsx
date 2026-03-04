'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Box,
  ShoppingBag,
  Trophy,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface AnalyticsDashboardProps {
  totalGamesAnalyzed: number;
  avgScore: number;
  bestGame: { title: string; slug: string; score: number } | null;
  worstGame: { title: string; slug: string; score: number } | null;
  systemBreakdown: { type: string; count: number; avgScore: number }[];
  scoreDistribution: { range: string; count: number; color: string }[];
  topGames: {
    title: string;
    slug: string;
    score: number;
    loot_system_type: string;
    cover_image: string | null;
  }[];
  bottomGames: {
    title: string;
    slug: string;
    score: number;
    loot_system_type: string;
    cover_image: string | null;
  }[];
  industryInsights: {
    label: string;
    value: string;
    description: string;
    icon: string;
  }[];
}

const getScoreColor = (score: number): string => {
  if (score >= 7) return 'emerald-500';
  if (score >= 5) return 'amber-500';
  if (score >= 3) return 'orange-500';
  return 'red-500';
};

const getScoreBgColor = (score: number): string => {
  if (score >= 7) return 'bg-emerald-100';
  if (score >= 5) return 'bg-amber-100';
  if (score >= 3) return 'bg-orange-100';
  return 'bg-red-100';
};

const SYSTEM_LABELS: Record<string, string> = {
  gacha: "Gacha",
  loot_box: "Loot Box",
  card_pack: "Card Pack",
  cosmetic_shop: "Cosmetic Shop",
  battle_pass: "Battle Pass",
};

const getSystemIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'gacha':
      return <Sparkles className="w-5 h-5" />;
    case 'loot_box':
      return <Box className="w-5 h-5" />;
    case 'cosmetic_shop':
      return <ShoppingBag className="w-5 h-5" />;
    case 'battle_pass':
      return <Trophy className="w-5 h-5" />;
    case 'card_pack':
      return <Layers className="w-5 h-5" />;
    default:
      return <Box className="w-5 h-5" />;
  }
};

const StatCard = ({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <p className="text-sm font-medium text-gray-600">{label}</p>
    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
  </div>
);

const ScoreBadge = ({ score }: { score: number }) => {
  const color = getScoreColor(score);
  const bgColor = getScoreBgColor(score);
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full ${bgColor} text-sm font-bold text-gray-900`}
    >
      {score.toFixed(1)}
    </div>
  );
};

export default function AnalyticsDashboard(props: AnalyticsDashboardProps) {
  const [insightsOpen, setInsightsOpen] = useState(false);

  const maxDistCount = Math.max(...props.scoreDistribution.map((d) => d.count));

  return (
    <div className="space-y-10">
      {/* Stats Hero Row */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Overview</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Games Analyzed"
            value={props.totalGamesAnalyzed}
          />
          <StatCard
            label="Average Score"
            value={props.avgScore.toFixed(2)}
            subtitle="out of 10"
          />
          <StatCard
            label="Consumer-Friendly"
            value={props.bestGame?.title || 'N/A'}
            subtitle={
              props.bestGame
                ? `Score: ${props.bestGame.score.toFixed(1)}`
                : 'No data'
            }
          />
          <StatCard
            label="Most Aggressive"
            value={props.worstGame?.title || 'N/A'}
            subtitle={
              props.worstGame
                ? `Score: ${props.worstGame.score.toFixed(1)}`
                : 'No data'
            }
          />
        </div>
      </section>

      {/* Score Distribution */}
      <section className="mt-10">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Score Distribution
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            {props.scoreDistribution.map((dist) => (
              <div key={dist.range}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {dist.range}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {dist.count} games
                  </span>
                </div>
                <div className="h-8 w-full overflow-hidden rounded-lg bg-gray-100">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${maxDistCount > 0 ? (dist.count / maxDistCount) * 100 : 0}%`,
                      backgroundColor: dist.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Type Breakdown */}
      <section className="mt-10">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Monetization System Breakdown
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {props.systemBreakdown.map((system) => (
            <div
              key={system.type}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 text-blue-600">
                {getSystemIcon(system.type)}
              </div>
              <h3 className="font-semibold text-gray-900">{SYSTEM_LABELS[system.type] || system.type}</h3>
              <p className="mt-2 text-sm text-gray-600">
                {system.count} game{system.count !== 1 ? 's' : ''}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-600">Avg Score</span>
                <ScoreBadge score={system.avgScore} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best & Worst Games */}
      <section className="mt-10">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Featured Games
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top Games */}
          <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-green-900">
              Consumer-Friendly
            </h3>
            <div className="space-y-4">
              {props.topGames.slice(0, 5).map((game) => (
                <div
                  key={game.slug}
                  className="flex items-center gap-4 rounded-lg border border-green-100 bg-white p-4"
                >
                  {game.cover_image && (
                    <img
                      src={game.cover_image}
                      alt={game.title}
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                  {!game.cover_image && (
                    <div className="h-10 w-10 rounded bg-gray-200" />
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/lootbox/${game.slug}`}
                      className="block font-semibold text-gray-900 hover:text-blue-600 truncate"
                    >
                      {game.title}
                    </Link>
                    <p className="text-xs text-gray-600">
                      {SYSTEM_LABELS[game.loot_system_type] || game.loot_system_type}
                    </p>
                  </div>
                  <ScoreBadge score={game.score} />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Games */}
          <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-red-900">
              Most Aggressive
            </h3>
            <div className="space-y-4">
              {props.bottomGames.slice(0, 5).map((game) => (
                <div
                  key={game.slug}
                  className="flex items-center gap-4 rounded-lg border border-red-100 bg-white p-4"
                >
                  {game.cover_image && (
                    <img
                      src={game.cover_image}
                      alt={game.title}
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                  {!game.cover_image && (
                    <div className="h-10 w-10 rounded bg-gray-200" />
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/lootbox/${game.slug}`}
                      className="block font-semibold text-gray-900 hover:text-blue-600 truncate"
                    >
                      {game.title}
                    </Link>
                    <p className="text-xs text-gray-600">
                      {SYSTEM_LABELS[game.loot_system_type] || game.loot_system_type}
                    </p>
                  </div>
                  <ScoreBadge score={game.score} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industry Insights */}
      <section className="mt-10">
        <button
          onClick={() => setInsightsOpen(!insightsOpen)}
          className="mb-6 flex w-full items-center gap-3 text-2xl font-bold text-gray-900 hover:text-blue-600"
        >
          Industry Insights
          <ChevronDown
            className={`w-6 h-6 transition-transform duration-300 ${
              insightsOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            maxHeight: insightsOpen ? '1000px' : '0px',
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {props.industryInsights.map((insight, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 text-2xl">{insight.icon}</div>
                <p className="text-sm text-gray-600">{insight.label}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {insight.value}
                </p>
                <p className="mt-2 text-sm text-gray-600">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-10">
        <div className="overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-white p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900">
            Explore the Full Database
          </h3>
          <p className="mt-2 text-gray-600">
            Dive deeper into monetization trends and analyze individual games
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/lootbox"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Browse Games
            </Link>
            <Link
              href="/lootbox/rankings"
              className="inline-flex items-center justify-center rounded-lg border border-blue-600 bg-white px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            >
              View Rankings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
