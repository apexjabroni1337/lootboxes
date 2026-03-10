import { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase";
import GameAvatar from "@/components/ui/GameAvatar";

export const metadata: Metadata = {
  title: "Score Explorer — All Lootbox Game Scores",
  description:
    "Browse and compare monetization scores across all analyzed games. View detailed lootbox scoring for thousands of titles.",
};

export const revalidate = 300;

interface Game {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  screenshot_image: string | null;
  lootboxes_score: number;
  loot_system_type: string;
  genres: string[] | null;
  platforms: string[] | null;
  metacritic: number | null;
}

function scoreBg(score: number): string {
  if (score >= 7) return "bg-emerald-500";
  if (score >= 5) return "bg-amber-500";
  if (score >= 3) return "bg-orange-500";
  return "bg-red-500";
}

function scoreLabel(score: number): string {
  if (score >= 8) return "Great Value";
  if (score >= 6) return "Good Value";
  if (score >= 4) return "Average";
  return "Poor Value";
}

const SYSTEM_LABELS: Record<string, string> = {
  gacha: "Gacha",
  loot_box: "Loot Box",
  card_pack: "Card Pack",
  cosmetic_shop: "Cosmetic Shop",
  battle_pass: "Battle Pass",
};

export default async function ScoresPage() {
  const supabase = await createServerClient();

  const { data: games, error } = await supabase
    .from("games")
    .select(
      "id, title, slug, cover_image, screenshot_image, lootboxes_score, loot_system_type, genres, platforms, metacritic"
    )
    .not("lootboxes_score", "is", null)
    .not("loot_system_type", "is", null)
    .order("lootboxes_score", { ascending: true });

  if (error) {
    console.error("Error fetching games:", error);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg bg-white dark:bg-gray-950 p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Error Loading Scores</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Unable to fetch game scores. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const typedGames = (games || []) as Game[];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-950 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Score Explorer
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Browse and compare monetization scores across all analyzed games.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Games Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white w-12">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Game
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    System
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white w-20">
                    Score
                  </th>
                  <th className="hidden px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:table-cell w-24">
                    Metacritic
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Genres
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {typedGames.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400">No scored games found.</p>
                    </td>
                  </tr>
                ) : (
                  typedGames.map((game, index) => (
                    <tr
                      key={game.id}
                      className={index % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                            {game.cover_image || game.screenshot_image ? (
                              <img
                                src={(game.cover_image || game.screenshot_image)!}
                                alt={game.title}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <GameAvatar
                                gameName={game.title}
                                size="sm"
                                className="h-full w-full"
                              />
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/lootbox/${game.slug}`}
                              className="font-medium text-gray-900 dark:text-white hover:text-blue-600 transition-colors"
                            >
                              {game.title}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/30 px-3 py-1 text-xs font-medium text-blue-700">
                          {SYSTEM_LABELS[game.loot_system_type] ||
                            game.loot_system_type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-white font-bold text-sm ${scoreBg(
                              game.lootboxes_score
                            )}`}
                          >
                            {game.lootboxes_score.toFixed(1)}
                          </div>
                          <span className="hidden text-xs text-gray-500 dark:text-gray-400 sm:inline">
                            {scoreLabel(game.lootboxes_score)}
                          </span>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 text-sm text-gray-600 dark:text-gray-300 sm:table-cell">
                        {game.metacritic ? (
                          <span className="font-medium">{game.metacritic}</span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {game.genres && game.genres.length > 0
                            ? game.genres.slice(0, 2).map((genre, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs text-gray-700 dark:text-gray-200"
                                >
                                  {genre}
                                </span>
                              ))
                            : null}
                          {game.genres && game.genres.length > 2 && (
                            <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs text-gray-600 dark:text-gray-300">
                              +{game.genres.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Score Legend */}
        <div className="mt-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Score Legend</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600"></div>
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">8–10</p>
                <p className="text-gray-600 dark:text-gray-300">Great Value</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600"></div>
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">6–7.9</p>
                <p className="text-gray-600 dark:text-gray-300">Good Value</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-600"></div>
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">4–5.9</p>
                <p className="text-gray-600 dark:text-gray-300">Average</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600"></div>
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">0–3.9</p>
                <p className="text-gray-600 dark:text-gray-300">Poor Value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/analytics"
            className="inline-flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 px-6 py-3 font-medium text-gray-900 dark:text-white hover:bg-gray-200 transition-colors"
          >
            Back to Analytics
          </Link>
          <Link
            href="/methodology"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition-colors"
            style={{ backgroundColor: "#0074c5" }}
          >
            View Methodology
          </Link>
        </div>
      </div>
    </div>
  );
}
