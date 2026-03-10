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
  bestGame: { title: string; slug: string; score: number; cover_image?: string | null } | null;
  worstGame: { title: string; slug: string; score: number; cover_image?: string | null } | null;
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
  accent = "brand",
  bgImage,
  href,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
  accent?: "brand" | "emerald" | "amber" | "red";
  bgImage?: string | null;
  href?: string;
}) => {
  const accentBorder: Record<string, string> = {
    brand: "border-l-brand-500",
    emerald: "border-l-emerald-500",
    amber: "border-l-amber-500",
    red: "border-l-red-500",
  };
  const accentOverlay: Record<string, string> = {
    brand: "from-blue-900/85 via-blue-900/70 to-blue-800/60",
    emerald: "from-emerald-900/85 via-emerald-900/70 to-emerald-800/60",
    amber: "from-amber-900/80 via-amber-950/70 to-amber-900/60",
    red: "from-red-900/85 via-red-900/70 to-red-800/60",
  };
  const accentPlain: Record<string, string> = {
    brand: "bg-gradient-to-r from-brand-50/60 to-white",
    emerald: "bg-gradient-to-r from-emerald-50/60 to-white",
    amber: "bg-gradient-to-r from-amber-50/60 to-white",
    red: "bg-gradient-to-r from-red-50/60 to-white",
  };

  const Wrapper = href ? Link : "div";
  const wrapperProps = href ? { href } : {};

  if (bgImage) {
    return (
      <Wrapper
        {...(wrapperProps as any)}
        className={`group relative rounded-xl border border-gray-200 dark:border-gray-700 border-l-4 ${accentBorder[accent]} overflow-hidden shadow-sm hover:shadow-lg transition-all min-h-[120px] flex flex-col justify-end`}
      >
        <img
          src={bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${accentOverlay[accent]}`} />
        <div className="relative z-10 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/70">{label}</p>
          <p className="mt-1 text-2xl font-extrabold text-white leading-tight drop-shadow-sm">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-white/60 font-medium">{subtitle}</p>}
        </div>
      </Wrapper>
    );
  }

  return (
    <div className={`rounded-xl border border-gray-200 dark:border-gray-700 border-l-4 ${accentBorder[accent]} ${accentPlain[accent]} p-6 shadow-sm`}>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
    </div>
  );
};

const ScoreBadge = ({ score }: { score: number }) => {
  const color = getScoreColor(score);
  const bgColor = getScoreBgColor(score);
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full ${bgColor} text-sm font-bold text-gray-900 dark:text-white`}
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
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Overview</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Games Analyzed"
            value={props.totalGamesAnalyzed}
            accent="brand"
          />
          <StatCard
            label="Average Score"
            value={props.avgScore.toFixed(2)}
            subtitle="out of 10"
            accent="amber"
          />
          <StatCard
            label="Consumer-Friendly"
            value={props.bestGame?.title || 'N/A'}
            subtitle={
              props.bestGame
                ? `Score: ${props.bestGame.score.toFixed(1)}`
                : 'No data'
            }
            accent="emerald"
            bgImage={props.bestGame?.cover_image}
            href={props.bestGame ? `/lootbox/${props.bestGame.slug}` : undefined}
          />
          <StatCard
            label="Most Aggressive"
            value={props.worstGame?.title || 'N/A'}
            subtitle={
              props.worstGame
                ? `Score: ${props.worstGame.score.toFixed(1)}`
                : 'No data'
            }
            accent="red"
            bgImage={props.worstGame?.cover_image}
            href={props.worstGame ? `/lootbox/${props.worstGame.slug}` : undefined}
          />
        </div>
      </section>

      {/* Score Distribution */}
      <section className="mt-10">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Score Distribution
        </h2>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 dark:from-gray-900 to-white dark:to-gray-950 p-6 shadow-sm">
          <div className="space-y-5">
            {props.scoreDistribution.map((dist) => (
              <div key={dist.range} className="rounded-lg bg-white dark:bg-gray-950 p-4 border border-gray-100 dark:border-gray-800 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {dist.range}
                  </span>
                  <span className="text-sm font-bold tabular-nums" style={{ color: dist.color }}>
                    {dist.count} games
                  </span>
                </div>
                <div className="h-7 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${maxDistCount > 0 ? Math.max((dist.count / maxDistCount) * 100, 2) : 0}%`,
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
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Monetization System Breakdown
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {props.systemBreakdown.map((system) => (
            <div
              key={system.type}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-slate-50 to-white dark:to-gray-950 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/30 text-brand-600">
                {getSystemIcon(system.type)}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{SYSTEM_LABELS[system.type] || system.type}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {system.count} game{system.count !== 1 ? 's' : ''}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Avg Score</span>
                <ScoreBadge score={system.avgScore} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best & Worst Games */}
      <section className="mt-10">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Featured Games
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top Games */}
          <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 dark:from-green-950/30 to-white dark:to-gray-950 p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-green-900">
              Consumer-Friendly
            </h3>
            <div className="space-y-3">
              {props.topGames.slice(0, 5).map((game) => {
                const bgImg = game.cover_image;
                return (
                  <Link
                    key={game.slug}
                    href={`/lootbox/${game.slug}`}
                    className="group relative block rounded-xl overflow-hidden min-h-[72px] hover:shadow-md transition-all"
                  >
                    {bgImg ? (
                      <>
                        <img
                          src={bgImg}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          style={{ filter: "brightness(0.35)" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 via-emerald-900/30 to-transparent" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-800 to-emerald-700" />
                    )}
                    <div className="relative z-10 flex items-center gap-4 p-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm truncate group-hover:text-emerald-200 transition-colors">
                          {game.title}
                        </p>
                        <p className="text-[11px] text-white/50 font-medium mt-0.5">
                          {SYSTEM_LABELS[game.loot_system_type] || game.loot_system_type}
                        </p>
                      </div>
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/300 flex items-center justify-center text-white text-sm font-extrabold border-2 border-white/80 shadow-lg">
                        {game.score.toFixed(1)}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Games */}
          <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white dark:to-gray-950 p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-red-900">
              Most Aggressive
            </h3>
            <div className="space-y-3">
              {props.bottomGames.slice(0, 5).map((game) => {
                const bgImg = game.cover_image;
                return (
                  <Link
                    key={game.slug}
                    href={`/lootbox/${game.slug}`}
                    className="group relative block rounded-xl overflow-hidden min-h-[72px] hover:shadow-md transition-all"
                  >
                    {bgImg ? (
                      <>
                        <img
                          src={bgImg}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          style={{ filter: "brightness(0.35)" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-red-900/60 via-red-900/30 to-transparent" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-red-700" />
                    )}
                    <div className="relative z-10 flex items-center gap-4 p-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm truncate group-hover:text-red-200 transition-colors">
                          {game.title}
                        </p>
                        <p className="text-[11px] text-white/50 font-medium mt-0.5">
                          {SYSTEM_LABELS[game.loot_system_type] || game.loot_system_type}
                        </p>
                      </div>
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/300 flex items-center justify-center text-white text-sm font-extrabold border-2 border-white/80 shadow-lg">
                        {game.score.toFixed(1)}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Industry Insights */}
      <section className="mt-10">
        <button
          onClick={() => setInsightsOpen(!insightsOpen)}
          className="mb-6 flex w-full items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600"
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
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 dark:from-gray-900 to-white dark:to-gray-950 p-6 shadow-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-2xl">{insight.icon}</div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{insight.label}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {insight.value}
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-10">
        <div className="overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 dark:from-blue-950/30 to-white dark:to-gray-950 p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Explore the Full Database
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
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
              className="inline-flex items-center justify-center rounded-lg border border-blue-600 bg-white dark:bg-gray-950 px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            >
              View Rankings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
