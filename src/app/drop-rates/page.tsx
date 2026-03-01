import Link from "next/link";
import { Search, ChevronRight, AlertTriangle, CheckCircle, HelpCircle, Zap, Sparkles, Info } from "lucide-react";
import ScoreBadge from "@/components/analytics/ScoreBadge";
import GameAvatar from "@/components/ui/GameAvatar";
import { createServerClient } from "@/lib/supabase";

export const revalidate = 300;

export const metadata = {
  title: "Drop Rate Database — Verified Loot Box Probabilities",
  description:
    "The most comprehensive database of verified drop rates and loot box probabilities across all major games. Know your odds before you spend.",
};

const SOURCE_META = {
  official: { label: "Official", icon: CheckCircle, color: "text-success-600" },
  community_verified: { label: "Community Verified", icon: HelpCircle, color: "text-brand-600" },
  user_reported: { label: "User Reported", icon: AlertTriangle, color: "text-warning-600" },
};

function getRarityColor(rarity: string): string {
  const lower = rarity.toLowerCase();
  // Gold / ultra-rare tier
  if (lower.includes("heirloom") || lower.includes("mythic") || lower.includes("icon") || lower.includes("crown") || lower.includes("exceedingly") || lower.includes("black market"))
    return "bg-amber-100 text-amber-800";
  // Red / rare tier
  if (lower.includes("covert") || lower.includes("5-star") || lower.includes("s-rank") || lower.includes("legendary") || lower.includes("exotic") || lower.includes("secret") || lower.includes("series 5"))
    return "bg-red-100 text-red-800";
  // Purple / epic tier
  if (lower.includes("classified") || lower.includes("4-star") || lower.includes("a-rank") || lower.includes("epic") || lower.includes("elite") || lower.includes("import") || lower.includes("full art") || lower.includes("series 4") || lower.includes("premium") || lower.includes("exclusive"))
    return "bg-purple-100 text-purple-800";
  // Blue / uncommon tier
  if (lower.includes("restricted") || lower.includes("very rare") || lower.includes("rare") || lower.includes("star rare") || lower.includes("deluxe") || lower.includes("variant"))
    return "bg-blue-100 text-blue-800";
  // Green / common tier
  if (lower.includes("mil-spec") || lower.includes("3-star") || lower.includes("b-rank") || lower.includes("common") || lower.includes("uncommon") || lower.includes("select"))
    return "bg-gray-100 text-gray-700";
  // Special
  if (lower.includes("stattrak") || lower.includes("painted") || lower.includes("certified"))
    return "bg-orange-100 text-orange-800";
  if (lower.includes("pity"))
    return "bg-emerald-100 text-emerald-800";
  if (lower.includes("effective"))
    return "bg-rose-50 text-rose-700";
  return "bg-gray-100 text-gray-700";
}

function getSystemLabel(type: string | null): string {
  const map: Record<string, string> = {
    gacha: "Gacha System",
    loot_box: "Loot Box",
    card_pack: "Card Packs",
    battle_pass: "Battle Pass",
    cosmetic_shop: "Cosmetic Shop",
  };
  return type ? map[type] || type : "";
}

function getSystemColor(type: string | null): string {
  const map: Record<string, string> = {
    gacha: "bg-rose-100 text-rose-700",
    loot_box: "bg-amber-100 text-amber-700",
    card_pack: "bg-violet-100 text-violet-700",
    battle_pass: "bg-emerald-100 text-emerald-700",
    cosmetic_shop: "bg-sky-100 text-sky-700",
  };
  return type ? map[type] || "bg-gray-100 text-gray-700" : "bg-gray-100 text-gray-700";
}

interface GameWithRates {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  lootboxes_score: number | null;
  loot_system_type: string | null;
  items: {
    item_name: string;
    rarity: string;
    drop_rate_pct: number;
    source: "official" | "community_verified" | "user_reported";
  }[];
}

async function getGamesWithDropRates(): Promise<GameWithRates[]> {
  const supabase = createServerClient();

  // Get all drop rates with game info
  const { data: dropRates, error } = await supabase
    .from("drop_rates")
    .select(`
      item_name,
      rarity,
      drop_rate_pct,
      source,
      game_id,
      games!inner (
        id,
        title,
        slug,
        cover_image,
        lootboxes_score,
        loot_system_type
      )
    `)
    .order("drop_rate_pct", { ascending: true });

  if (error || !dropRates || dropRates.length === 0) return [];

  // Group by game
  const gameMap = new Map<string, GameWithRates>();
  for (const dr of dropRates) {
    const game = (dr as any).games;
    if (!game) continue;

    if (!gameMap.has(game.id)) {
      gameMap.set(game.id, {
        id: game.id,
        title: game.title,
        slug: game.slug,
        cover_image: game.cover_image,
        lootboxes_score: game.lootboxes_score,
        loot_system_type: game.loot_system_type,
        items: [],
      });
    }
    gameMap.get(game.id)!.items.push({
      item_name: dr.item_name,
      rarity: dr.rarity,
      drop_rate_pct: dr.drop_rate_pct,
      source: dr.source as any,
    });
  }

  // Sort games by score (lowest score = most predatory = most interesting)
  const games = Array.from(gameMap.values());
  games.sort((a, b) => (a.lootboxes_score || 10) - (b.lootboxes_score || 10));
  return games;
}

export default async function DropRatesPage() {
  const games = await getGamesWithDropRates();
  const totalGames = games.length;
  const totalRates = games.reduce((acc, g) => acc + g.items.length, 0);
  const officialCount = games.reduce(
    (acc, g) => acc + g.items.filter((i) => i.source === "official").length,
    0
  );

  return (
    <div className="pb-12">
      {/* Page hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-8 sm:py-10">
        <div className="container-main">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-brand-600" />
            <h1 className="text-3xl font-bold text-gray-900">Drop Rate Database</h1>
          </div>
          <p className="mt-2 max-w-2xl text-gray-500">
            Verified drop rates and loot box probabilities for every major game.
            Know your odds before you spend. All rates sourced from official disclosures,
            community research, and user reports.
          </p>

          {/* Stats bar */}
          <div className="mt-5 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2">
              <span className="text-lg font-bold text-gray-900">{totalGames}</span>
              <span className="text-sm text-gray-500">Games Tracked</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2">
              <span className="text-lg font-bold text-gray-900">{totalRates}</span>
              <span className="text-sm text-gray-500">Drop Rates</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2">
              <CheckCircle className="h-4 w-4 text-success-600" />
              <span className="text-lg font-bold text-gray-900">{officialCount}</span>
              <span className="text-sm text-gray-500">Officially Verified</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-main mt-6">
        {/* Methodology callout */}
        <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" />
            <div>
              <h3 className="text-sm font-semibold text-brand-800">How We Verify Drop Rates</h3>
              <p className="mt-1 text-sm text-brand-700">
                We rank data sources in three tiers: <strong>Official</strong> (disclosed by
                the developer per legal requirements), <strong>Community Verified</strong> (large-sample empirical
                testing by trusted researchers), and <strong>User Reported</strong> (aggregated
                from individual submissions). We always display the source alongside every rate.
              </p>
            </div>
          </div>
        </div>

        {/* Game sections */}
        {games.length === 0 ? (
          <div className="mt-12 text-center">
            <Zap className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-gray-500">No drop rate data yet. Check back soon!</p>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {games.map((game) => (
              <section key={game.slug} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {/* Game header */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                      {game.cover_image ? (
                        <img src={game.cover_image} alt={game.title} className="h-full w-full object-cover" />
                      ) : (
                        <GameAvatar gameName={game.title} size="sm" aspectRatio="square" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-gray-900">{game.title}</h2>
                        {game.lootboxes_score && (
                          <ScoreBadge score={game.lootboxes_score} size="sm" />
                        )}
                      </div>
                      {game.loot_system_type && (
                        <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${getSystemColor(game.loot_system_type)}`}>
                          {getSystemLabel(game.loot_system_type)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/games/${game.slug}`}
                    className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    View game <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Drop rate table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase text-gray-500">Item</th>
                        <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase text-gray-500">Rarity</th>
                        <th className="px-5 py-2.5 text-right text-xs font-semibold uppercase text-gray-500">Drop Rate</th>
                        <th className="hidden px-5 py-2.5 text-right text-xs font-semibold uppercase text-gray-500 sm:table-cell">
                          ~Avg. Opens
                        </th>
                        <th className="hidden px-5 py-2.5 text-left text-xs font-semibold uppercase text-gray-500 md:table-cell">Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {game.items.map((item, i) => {
                        const SourceMeta = SOURCE_META[item.source] || SOURCE_META.user_reported;
                        const isPity = item.rarity.toLowerCase().includes("pity");
                        const isEffective = item.rarity.toLowerCase().includes("effective");
                        const avgOpens =
                          item.drop_rate_pct > 0 && item.drop_rate_pct < 100
                            ? Math.ceil(100 / item.drop_rate_pct)
                            : "—";
                        return (
                          <tr
                            key={i}
                            className={`transition-colors hover:bg-gray-50 ${isPity ? "bg-emerald-50/30" : ""} ${isEffective ? "bg-rose-50/20" : ""}`}
                          >
                            <td className="px-5 py-3 text-sm font-medium text-gray-900">
                              {item.item_name}
                            </td>
                            <td className="px-5 py-3">
                              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getRarityColor(item.rarity)}`}>
                                {item.rarity}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <span className="text-sm font-bold text-gray-900">
                                {item.drop_rate_pct >= 100
                                  ? "Guaranteed"
                                  : item.drop_rate_pct < 1
                                    ? `${item.drop_rate_pct.toFixed(item.drop_rate_pct < 0.1 ? 3 : 2)}%`
                                    : `${item.drop_rate_pct.toFixed(1)}%`}
                              </span>
                            </td>
                            <td className="hidden px-5 py-3 text-right text-sm text-gray-500 sm:table-cell">
                              {typeof avgOpens === "number" ? (
                                <span>~{avgOpens.toLocaleString()} opens</span>
                              ) : (
                                <span>{avgOpens}</span>
                              )}
                            </td>
                            <td className="hidden px-5 py-3 md:table-cell">
                              <span className={`flex items-center gap-1 text-xs font-medium ${SourceMeta.color}`}>
                                <SourceMeta.icon className="h-3.5 w-3.5" />
                                {SourceMeta.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-brand-600" />
          <h3 className="mt-2 text-lg font-bold text-gray-900">Know drop rates we&apos;re missing?</h3>
          <p className="mt-1 text-sm text-gray-500">
            Help us build the most accurate database by submitting your data.
          </p>
          <button className="btn-primary mt-4">Submit Drop Rates</button>
        </div>
      </div>
    </div>
  );
}
