import Link from "next/link";

interface ComparisonGame {
  slug: string;
  title: string;
  lootboxes_score: number | null;
  loot_system_type: string | null;
  cost_per_pull: number | null;
  has_pity_system: boolean;
  pulls_to_pity: number | null;
}

function systemLabel(type: string | null): string {
  if (!type) return "—";
  const map: Record<string, string> = {
    gacha: "Gacha",
    loot_box: "Loot Box",
    card_pack: "Card Pack",
    cosmetic_shop: "Cosmetic Shop",
    battle_pass: "Battle Pass",
  };
  return map[type] || type;
}

export default function ComparisonTable({
  current,
  comparisons,
}: {
  current: ComparisonGame;
  comparisons: ComparisonGame[];
}) {
  const allGames = [current, ...comparisons];

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">
              Game
            </th>
            <th className="text-center py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">
              Score
            </th>
            <th className="text-center py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">
              System
            </th>
            <th className="text-center py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">
              Cost/Pull
            </th>
            <th className="text-center py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">
              Pity
            </th>
          </tr>
        </thead>
        <tbody>
          {allGames.map((game, idx) => {
            const isCurrent = idx === 0;
            return (
              <tr
                key={game.slug}
                className={`border-b border-gray-100 dark:border-gray-800 ${
                  isCurrent ? "bg-blue-50 dark:bg-blue-950/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <td className="py-3 px-4">
                  {isCurrent ? (
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {game.title}{" "}
                      <span className="text-xs text-blue-600">(this game)</span>
                    </span>
                  ) : (
                    <Link
                      href={`/lootbox/${game.slug}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {game.title}
                    </Link>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {game.lootboxes_score !== null ? (
                    <span
                      className={`inline-flex items-center justify-center h-7 w-9 rounded text-xs font-bold text-white ${
                        game.lootboxes_score >= 7
                          ? "bg-emerald-500"
                          : game.lootboxes_score >= 5
                          ? "bg-amber-500"
                          : game.lootboxes_score >= 3
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                    >
                      {game.lootboxes_score.toFixed(1)}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                  {systemLabel(game.loot_system_type)}
                </td>
                <td className="py-3 px-4 text-center font-medium">
                  {game.cost_per_pull !== null
                    ? `$${game.cost_per_pull.toFixed(2)}`
                    : "N/A"}
                </td>
                <td className="py-3 px-4 text-center">
                  {game.has_pity_system ? (
                    <span className="text-emerald-600 font-medium">
                      {game.pulls_to_pity ? `${game.pulls_to_pity} pulls` : "Yes"}
                    </span>
                  ) : (
                    <span className="text-red-500 font-medium">None</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
