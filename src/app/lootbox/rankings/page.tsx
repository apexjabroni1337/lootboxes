import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Trophy, Shield, DollarSign, Swords, AlertTriangle, TrendingUp } from 'lucide-react';
import { createServerClient } from '@/lib/supabase';
import GameAvatar from '@/components/ui/GameAvatar';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Loot Box Rankings — Every Game Ranked by Monetization Fairness',
  description:
    'Browse comprehensive loot box rankings for 41+ games. Compare transparency, fairness, and player protection scores across different monetization systems.',
};

// Types
interface LootboxContent {
  cost_per_pull: number | null;
  has_pity_system: boolean;
  score_transparency: number;
  score_value: number;
  score_fairness: number;
  score_player_control: number;
  score_compliance: number;
  score_age_gating: number;
  score_p2w_impact: number;
  score_psych_design: number;
}

interface Game {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  screenshot_image: string | null;
  lootboxes_score: number;
  loot_system_type: string;
  lootbox_content: LootboxContent | LootboxContent[];
}

interface RankedGame {
  game: Game;
  score: number;
  rank: number;
}

interface SystemTypeInfo {
  label: string;
  color: string;
}

// Helper Functions at Module Level

function systemLabel(type: string): SystemTypeInfo {
  const labels: Record<string, SystemTypeInfo> = {
    gacha: { label: 'Gacha', color: 'bg-purple-100 text-purple-800' },
    loot_box: { label: 'Loot Box', color: 'bg-red-100 text-red-800' },
    card_pack: { label: 'Card Pack', color: 'bg-blue-100 text-blue-800' },
    battle_pass: { label: 'Battle Pass', color: 'bg-amber-100 text-amber-800' },
    cosmetic_shop: { label: 'Cosmetic Shop', color: 'bg-emerald-100 text-emerald-800' },
  };
  return labels[type] || { label: type.charAt(0).toUpperCase() + type.slice(1), color: 'bg-gray-100 text-gray-800' };
}

function scoreColor(score: number): string {
  if (score >= 7) return 'bg-emerald-100 text-emerald-800';
  if (score >= 5) return 'bg-blue-100 text-blue-800';
  if (score >= 3) return 'bg-amber-100 text-amber-800';
  return 'bg-rose-100 text-rose-800';
}

function toArray(content: LootboxContent | LootboxContent[] | null): LootboxContent[] {
  if (!content) return [];
  return Array.isArray(content) ? content : [content];
}

function avgScores(content: LootboxContent | LootboxContent[] | null, keys: (keyof LootboxContent)[]): number {
  if (!content) return 0;
  const arr = Array.isArray(content) ? content : [content];
  if (arr.length === 0) return 0;
  const sum = arr.reduce((acc, item) => {
    const scoreSum = keys.reduce((keyAcc, key) => {
      const val = item[key];
      return keyAcc + (typeof val === 'number' ? val : 0);
    }, 0);
    return acc + scoreSum;
  }, 0);
  return parseFloat((sum / (arr.length * keys.length)).toFixed(1));
}

function getTier(score: number): { label: string; emoji: string; bgClass: string; textClass: string; borderClass: string; scoreRange: string } {
  if (score >= 8) return { label: 'TIER S — Excellent', emoji: '🏆', bgClass: 'bg-emerald-50', textClass: 'text-emerald-700', borderClass: 'border-emerald-200', scoreRange: '8.0+' };
  if (score >= 7) return { label: 'TIER A — Good', emoji: '⭐', bgClass: 'bg-emerald-50', textClass: 'text-emerald-600', borderClass: 'border-emerald-200', scoreRange: '7.0-7.9' };
  if (score >= 5) return { label: 'TIER B — Average', emoji: '🎯', bgClass: 'bg-amber-50', textClass: 'text-amber-700', borderClass: 'border-amber-200', scoreRange: '5.0-6.9' };
  if (score >= 3) return { label: 'TIER C — Below Average', emoji: '⚠️', bgClass: 'bg-orange-50', textClass: 'text-orange-700', borderClass: 'border-orange-200', scoreRange: '3.0-4.9' };
  return { label: 'TIER D — Poor', emoji: '💀', bgClass: 'bg-rose-50', textClass: 'text-rose-700', borderClass: 'border-rose-200', scoreRange: '0-2.9' };
}

function getRankBadge(rank: number): { bgClass: string; textClass: string; metalColor: string } {
  if (rank === 1) return { bgClass: 'bg-yellow-100', textClass: 'text-yellow-800', metalColor: 'gold' };
  if (rank === 2) return { bgClass: 'bg-gray-200', textClass: 'text-gray-800', metalColor: 'silver' };
  if (rank === 3) return { bgClass: 'bg-orange-100', textClass: 'text-orange-800', metalColor: 'bronze' };
  return { bgClass: 'bg-gray-100', textClass: 'text-gray-700', metalColor: 'plain' };
}

function GameThumb({ game }: { game: Game }) {
  return game.cover_image ? (
    <img src={game.cover_image} alt={game.title} className="w-8 h-11 rounded object-cover flex-shrink-0" loading="lazy" />
  ) : (
    <div className="w-8 h-11 flex-shrink-0">
      <GameAvatar gameName={game.title} aspectRatio="portrait" size="sm" />
    </div>
  );
}

function RankedGameRow({
  game,
  rank,
  score,
  rankColor = "text-gray-400",
}: {
  game: Game;
  rank: number | string;
  score: number;
  rankColor?: string;
}) {
  const bgImg = game.cover_image || game.screenshot_image;
  return (
    <li className="group">
      <Link
        href={`/lootbox/${game.slug}`}
        className="relative flex items-center gap-3 rounded-lg overflow-hidden min-h-[52px] transition-all hover:shadow-md"
      >
        {bgImg ? (
          <>
            <img
              src={bgImg}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              style={{ filter: "brightness(0.3)" }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-700" />
        )}
        <div className="relative z-10 flex items-center gap-3 w-full px-4 py-3">
          <span className={`font-extrabold w-6 text-right text-sm ${bgImg ? "text-white/60" : rankColor}`}>{rank}</span>
          <div className="flex-1 min-w-0">
            <span className="font-semibold text-white text-sm group-hover:text-blue-200 transition-colors truncate block">
              {game.title}
            </span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white/70 backdrop-blur-sm flex-shrink-0">
            {systemLabel(game.loot_system_type).label}
          </span>
          <span className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-extrabold border-2 border-white/70 shadow-lg ${
            score >= 7 ? "bg-emerald-500" : score >= 5 ? "bg-amber-500" : score >= 3 ? "bg-orange-500" : "bg-red-500"
          }`}>
            {score}
          </span>
        </div>
      </Link>
    </li>
  );
}

// Main Component
export default async function RankingsPage() {
  const supabase = createServerClient();

  const { data } = await supabase
    .from('games')
    .select(`
      id, title, slug, cover_image, screenshot_image, lootboxes_score, loot_system_type,
      lootbox_content (
        cost_per_pull, has_pity_system,
        score_transparency, score_value, score_fairness, score_player_control,
        score_compliance, score_age_gating, score_p2w_impact, score_psych_design
      )
    `)
    .not('loot_system_type', 'is', null)
    .order('lootboxes_score', { ascending: false });

  const games: Game[] = (data || []) as Game[];

  // Calculate rankings
  const overallRanked = games.map((game, idx) => ({
    game,
    score: game.lootboxes_score,
    rank: idx + 1,
  }));

  const protectionRanked = games
    .map((game) => ({
      game,
      score: avgScores(game.lootbox_content, ['score_transparency', 'score_compliance', 'score_age_gating']),
      rank: 0,
    }))
    .sort((a, b) => b.score - a.score)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

  const valueRanked = games
    .map((game) => ({
      game,
      score: avgScores(game.lootbox_content, ['score_value', 'score_fairness', 'score_p2w_impact']),
      rank: 0,
    }))
    .sort((a, b) => b.score - a.score)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

  const p2wRanked = games
    .map((game) => ({
      game,
      score: avgScores(game.lootbox_content, ['score_p2w_impact']),
      rank: 0,
    }))
    .sort((a, b) => b.score - a.score)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

  const worstOffenders = overallRanked.slice(-5).reverse();

  // Calculate stats
  const avgScore = parseFloat((overallRanked.reduce((sum, item) => sum + item.score, 0) / overallRanked.length).toFixed(1));
  const pityPercentage = Math.round(
    (games.filter((g) => toArray(g.lootbox_content).some((c) => c.has_pity_system)).length / games.length) * 100
  );

  const systemTypeDistribution = games.reduce(
    (acc, game) => {
      acc[game.loot_system_type] = (acc[game.loot_system_type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const avgBySystemType = Object.entries(systemTypeDistribution).map(([type, count]) => ({
    type,
    count,
    avg: parseFloat((
      games
        .filter((g) => g.loot_system_type === type)
        .reduce((sum, g) => sum + g.lootboxes_score, 0) / count
    ).toFixed(1)),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* SEO Metadata in getMetadata function (handled separately) */}

      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="container-main py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-[#0074c5]" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Loot Box Rankings</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl">
            Every game ranked by monetization fairness — from the most consumer-friendly to the most predatory.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/30 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300">{games.length} Games Analyzed</p>
            </div>
            <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/30 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Average Score: {avgScore}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Rank — Intro */}
      <section className="container-main py-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How We Rank Games</h2>
        <div className="prose prose-gray max-w-none">
          <p>
            Every game in our database is evaluated across <strong>eight scoring dimensions</strong> grouped into
            three weighted categories: <strong>Consumer Protection</strong> (40&nbsp;%), which covers transparency, regulatory
            compliance, and age gating; <strong>Value &amp; Fairness</strong> (35&nbsp;%), which measures whether players get
            reasonable value for their money; and <strong>Player Experience</strong> (25&nbsp;%), which evaluates pay-to-win
            impact, player control, and the use of psychological pressure tactics.
          </p>
          <p>
            The final <strong>LootBoxes Score</strong> is a weighted composite of all eight sub-scores on a 1–10 scale. A
            score of 7 or above indicates a monetization system we consider consumer-friendly, while anything below 4
            signals significant concerns about fairness or predatory design. We research official disclosures, community
            data, and in-game testing to compile each analysis.
          </p>
          <p>
            The rankings below are split into category leaderboards so you can see which games lead in specific areas,
            followed by the full tier-grouped table with every score dimension visible. For a deeper dive into how each
            dimension is calculated, see our{' '}
            <Link href="/methodology" className="text-[#0074c5] hover:text-[#005a9e] font-medium no-underline">
              full methodology breakdown
            </Link>.
          </p>
        </div>
      </section>

      {/* Category Leaderboards */}
      <section className="container-main py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Category Leaderboards</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Best Overall */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden dark:border-gray-700 dark:bg-gray-900">
            <div className="h-1 bg-[#0074c5]" />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-[#0074c5]" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Best Overall</h3>
              </div>
              <ol className="space-y-2">
                {overallRanked.slice(0, 10).map((item, idx) => (
                  <RankedGameRow key={item.game.id} game={item.game} rank={idx + 1} score={item.score} />
                ))}
              </ol>
            </div>
          </div>

          {/* Least Predatory */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden dark:border-gray-700 dark:bg-gray-900">
            <div className="h-1 bg-[#0074c5]" />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-[#0074c5]" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Least Predatory</h3>
              </div>
              <ol className="space-y-2">
                {protectionRanked.slice(0, 10).map((item, idx) => (
                  <RankedGameRow key={item.game.id} game={item.game} rank={idx + 1} score={item.score} />
                ))}
              </ol>
            </div>
          </div>

          {/* Most Rewarding */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden dark:border-gray-700 dark:bg-gray-900">
            <div className="h-1 bg-emerald-500" />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Most Rewarding</h3>
              </div>
              <ol className="space-y-2">
                {valueRanked.slice(0, 10).map((item, idx) => (
                  <RankedGameRow key={item.game.id} game={item.game} rank={idx + 1} score={item.score} />
                ))}
              </ol>
            </div>
          </div>

          {/* Non-Game-Breaking */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden dark:border-gray-700 dark:bg-gray-900">
            <div className="h-1 bg-purple-500" />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Swords className="w-5 h-5 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Non-Game-Breaking</h3>
              </div>
              <ol className="space-y-2">
                {p2wRanked.slice(0, 10).map((item, idx) => (
                  <RankedGameRow key={item.game.id} game={item.game} rank={idx + 1} score={item.score} />
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Worst Offenders */}
      <section className="container-main py-8">
        <div className="rounded-xl border border-rose-200 bg-rose-50 shadow-sm overflow-hidden dark:border-rose-800 dark:bg-rose-950/20">
          <div className="h-1 bg-rose-500" />
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Worst Offenders</h3>
            </div>
            <ol className="space-y-2">
              {worstOffenders.map((item) => (
                <RankedGameRow key={item.game.id} game={item.game} rank={games.length - item.rank + 1} score={item.score} rankColor="text-rose-600" />
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Full Rankings Table */}
      <section className="container-main py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Full Rankings</h2>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden overflow-x-auto dark:border-gray-700 dark:bg-gray-900">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 sticky left-0 bg-gray-50 w-8">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 sticky left-12 bg-gray-50 w-48">Game</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 w-32">Type</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 w-20">Overall</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 w-20">Protection</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 w-20">Value</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 w-20">P2W</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 w-16">Pity</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 w-20">$/Pull</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                let lastTier = '';
                return overallRanked.map((item, idx) => {
                  const tier = getTier(item.score);
                  const showTierHeader = tier.label !== lastTier;
                  lastTier = tier.label;

                  const protectionScore = avgScores(item.game.lootbox_content, ['score_transparency', 'score_compliance', 'score_age_gating']);
                  const valueScore = avgScores(item.game.lootbox_content, ['score_value', 'score_fairness', 'score_p2w_impact']);
                  const p2wScore = avgScores(item.game.lootbox_content, ['score_p2w_impact']);
                  const hasPity = toArray(item.game.lootbox_content).some((c) => c.has_pity_system);
                  const costPerPull = toArray(item.game.lootbox_content)[0]?.cost_per_pull;
                  const rankBadge = getRankBadge(idx + 1);

                  return (
                    <React.Fragment key={item.game.id}>
                      {showTierHeader && (
                        <tr>
                          <td colSpan={9} className={`px-4 py-2 ${tier.bgClass} border-y ${tier.borderClass}`}>
                            <span className={`text-xs font-bold uppercase tracking-wider ${tier.textClass}`}>
                              {tier.emoji} {tier.label} ({tier.scoreRange})
                            </span>
                          </td>
                        </tr>
                      )}
                      <tr className="hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors">
                        <td className={`px-4 py-3 text-sm font-medium sticky left-0 bg-inherit ${rankBadge.bgClass}`}>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: rankBadge.bgClass }}>
                            <span className={rankBadge.textClass}>{idx + 1}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm sticky left-12 bg-inherit hover:bg-blue-50/50">
                          <Link href={`/lootbox/${item.game.slug}`} className="flex items-center gap-2 font-medium text-gray-900 dark:text-white hover:text-[#0074c5] transition-colors">
                            <GameThumb game={item.game} />
                            {item.game.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${systemLabel(item.game.loot_system_type).color}`}>
                            {systemLabel(item.game.loot_system_type).label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-base font-bold text-gray-900 dark:text-white">{item.score}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold inline-block ${scoreColor(protectionScore)}`}>{protectionScore}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold inline-block ${scoreColor(valueScore)}`}>{valueScore}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold inline-block ${scoreColor(p2wScore)}`}>{p2wScore}</span>
                        </td>
                        <td className="px-4 py-3 text-center text-sm">
                          <span className="text-gray-700 dark:text-gray-300">{hasPity ? '✓' : '—'}</span>
                        </td>
                        <td className="px-4 py-3 text-center text-sm">
                          <span className="text-gray-700 dark:text-gray-300">{costPerPull ? `$${costPerPull.toFixed(2)}` : '—'}</span>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </section>

      {/* Stats Summary */}
      <section className="container-main py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Average Score</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{avgScore}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Pity System Rate</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{pityPercentage}%</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Games</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{games.length}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">System Types</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{Object.keys(systemTypeDistribution).length}</p>
          </div>
        </div>

        {/* System Type Breakdown */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm p-6 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">By System Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {avgBySystemType.map((item) => (
              <div key={item.type} className="p-4 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{systemLabel(item.type).label}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{item.avg}</span>
                  <span className="text-xs text-gray-500">avg ({item.count} games)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container-main py-12 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/lootbox" className="p-6 rounded-xl border border-[#0074c5] bg-blue-50 hover:bg-blue-100 transition-colors dark:bg-blue-950/40 dark:hover:bg-blue-950/60">
            <TrendingUp className="w-6 h-6 text-[#0074c5] mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Browse All Games</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Explore detailed loot box analyses for each game.</p>
          </Link>
          <Link href="/methodology" className="p-6 rounded-xl border border-gray-200 bg-white hover:border-[#0074c5] transition-colors dark:border-gray-700 dark:bg-gray-900 dark:hover:border-[#0074c5]">
            <Shield className="w-6 h-6 text-[#0074c5] mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Our Methodology</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Learn how we score and analyze loot box systems.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
