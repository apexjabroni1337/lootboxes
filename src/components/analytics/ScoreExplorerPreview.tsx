'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';

interface ScoreExplorerPreviewProps {
  games: {
    title: string;
    slug: string;
    score: number;
    loot_system_type: string;
    cover_image: string | null;
  }[];
}

const getScoreBgColor = (score: number): string => {
  if (score >= 7) return 'bg-emerald-100';
  if (score >= 5) return 'bg-amber-100';
  if (score >= 3) return 'bg-orange-100';
  return 'bg-red-100';
};

const ScoreBadge = ({ score }: { score: number }) => {
  const bgColor = getScoreBgColor(score);
  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full ${bgColor} text-xs font-bold text-gray-900`}
    >
      {score.toFixed(1)}
    </div>
  );
};

export default function ScoreExplorerPreview(
  props: ScoreExplorerPreviewProps
) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = useMemo(() => {
    return props.games
      .filter((game) =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 10);
  }, [props.games, searchQuery]);

  const totalGames = props.games.length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-6">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Explore Games
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by game name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filteredGames.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredGames.map((game) => (
              <div
                key={game.slug}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                {game.cover_image && (
                  <img
                    src={game.cover_image}
                    alt={game.title}
                    className="h-10 w-10 rounded object-cover flex-shrink-0"
                  />
                )}
                {!game.cover_image && (
                  <div className="h-10 w-10 rounded bg-gray-200 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {game.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    {game.loot_system_type}
                  </p>
                </div>
                <ScoreBadge score={game.score} />
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-gray-600">
              {searchQuery
                ? 'No games found matching your search'
                : 'No games available'}
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
        <Link
          href="/lootbox"
          className="flex items-center justify-center gap-2 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View all {totalGames} games
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
