import Link from "next/link";
import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import ScoreBadge from "@/components/analytics/ScoreBadge";
import GameAvatar from "@/components/ui/GameAvatar";
import { AnalyticsMeta, Game } from "@/lib/types";
import { BarChart3, Sparkles, ArrowRight } from "lucide-react";
import { createServerClient } from "@/lib/supabase";

export const revalidate = 300;

/* ── Fetch cover images from DB for analyzed games ── */
async function getGameCovers(): Promise<Record<string, string | null>> {
  const supabase = createServerClient();
  const slugs = ["fortnite", "genshin-impact", "valorant", "overwatch-2", "diablo-iv", "ea-fc-25", "honkai-star-rail", "apex-legends"];
  const { data } = await supabase
    .from("games")
    .select("slug, cover_image, screenshot_image")
    .in("slug", slugs);

  const map: Record<string, string | null> = {};
  for (const g of data || []) {
    map[g.slug] = g.screenshot_image || g.cover_image;
  }
  return map;
}

/* ── Fetch recently scored lootbox games dynamically ── */
async function getRecentScores() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("games")
    .select(
      "id, title, slug, cover_image, screenshot_image, lootboxes_score, loot_system_type, updated_at"
    )
    .not("lootboxes_score", "is", null)
    .not("loot_system_type", "is", null)
    .order("updated_at", { ascending: false })
    .limit(8);

  return (data as any[]) || [];
}

// Game data with cover images populated from DB
function buildArticles(covers: Record<string, string | null>): AnalyticsMeta[] {
  const MOCK_GAMES: Record<string, Game> = {
    fortnite: { id: "3", title: "Fortnite", slug: "fortnite", cover_image: covers["fortnite"] || null, platforms: ["PC", "PS5", "Xbox", "Switch"], genres: ["Battle Royale"], release_date: "2017-07-21", metacritic: null, lootboxes_score: 7.2, created_at: "", updated_at: "" },
    genshin: { id: "4", title: "Genshin Impact", slug: "genshin-impact", cover_image: covers["genshin-impact"] || null, platforms: ["PC", "PS5", "Mobile"], genres: ["Action RPG", "Gacha"], release_date: "2020-09-28", metacritic: 84, lootboxes_score: 4.8, created_at: "", updated_at: "" },
    valorant: { id: "6", title: "Valorant", slug: "valorant", cover_image: covers["valorant"] || null, platforms: ["PC"], genres: ["FPS"], release_date: "2020-06-02", metacritic: 80, lootboxes_score: 5.5, created_at: "", updated_at: "" },
    ow2: { id: "7", title: "Overwatch 2", slug: "overwatch-2", cover_image: covers["overwatch-2"] || null, platforms: ["PC", "PS5", "Xbox"], genres: ["FPS"], release_date: "2022-10-04", metacritic: 79, lootboxes_score: 3.9, created_at: "", updated_at: "" },
    diablo: { id: "8", title: "Diablo IV", slug: "diablo-iv", cover_image: covers["diablo-iv"] || null, platforms: ["PC", "PS5", "Xbox"], genres: ["Action RPG"], release_date: "2023-06-06", metacritic: 86, lootboxes_score: 7.5, created_at: "", updated_at: "" },
    eafc: { id: "9", title: "EA FC 25", slug: "ea-fc-25", cover_image: covers["ea-fc-25"] || null, platforms: ["PC", "PS5", "Xbox"], genres: ["Sports"], release_date: "2024-09-27", metacritic: 75, lootboxes_score: 3.2, created_at: "", updated_at: "" },
    honkai: { id: "10", title: "Honkai: Star Rail", slug: "honkai-star-rail", cover_image: covers["honkai-star-rail"] || null, platforms: ["PC", "PS5", "Mobile"], genres: ["RPG", "Gacha"], release_date: "2023-04-26", metacritic: 81, lootboxes_score: 5.8, created_at: "", updated_at: "" },
    apex: { id: "11", title: "Apex Legends", slug: "apex-legends", cover_image: covers["apex-legends"] || null, platforms: ["PC", "PS5", "Xbox"], genres: ["Battle Royale"], release_date: "2019-02-04", metacritic: 89, lootboxes_score: 4.5, created_at: "", updated_at: "" },
  };

  return [
    { id: "a1", game_id: "3", slug: "fortnite-chapter-6-season-1-battle-pass", title: "Fortnite Chapter 6 Season 1 Battle Pass — Is It Worth It?", excerpt: "We break down every tier, calculate the V-Buck value, and compare it to direct cosmetic purchases. This season's pass offers solid value for regular players.", type: "battlepass", lootboxes_score: 7.2, cover_image: covers["fortnite"] || null, published_at: "2026-02-20", updated_at: "2026-02-20", game: MOCK_GAMES.fortnite },
    { id: "a2", game_id: "4", slug: "genshin-impact-gacha-analysis-2026", title: "Genshin Impact Gacha System — Complete Drop Rate Analysis", excerpt: "Official drop rates, pity system breakdown, and expected spending to pull featured characters. We calculated the average cost per 5-star.", type: "lootbox", lootboxes_score: 4.8, cover_image: covers["genshin-impact"] || null, published_at: "2026-02-18", updated_at: "2026-02-18", game: MOCK_GAMES.genshin },
    { id: "a3", game_id: "6", slug: "valorant-battle-pass-episode-10", title: "Valorant Episode 10 Battle Pass Review", excerpt: "New skins, gun buddies, and sprays — here's whether this pass delivers enough value for 1000 VP.", type: "battlepass", lootboxes_score: 5.5, cover_image: covers["valorant"] || null, published_at: "2026-02-15", updated_at: "2026-02-15", game: MOCK_GAMES.valorant },
    { id: "a4", game_id: "7", slug: "overwatch-2-shop-analysis", title: "Overwatch 2 Shop & Battle Pass: A Monetization Deep-Dive", excerpt: "From the old loot box system to the new shop model — we analyze whether players are getting better or worse value.", type: "lootbox", lootboxes_score: 3.9, cover_image: covers["overwatch-2"] || null, published_at: "2026-02-12", updated_at: "2026-02-12", game: MOCK_GAMES.ow2 },
    { id: "a5", game_id: "8", slug: "diablo-iv-shop-economy-breakdown", title: "Diablo IV Shop Economy — Are Cosmetics Fairly Priced?", excerpt: "We analyze Platinum pricing, bundle values, and how Diablo IV's cosmetic economy compares to other live-service ARPGs. The numbers tell an interesting story.", type: "economy", lootboxes_score: 7.5, cover_image: covers["diablo-iv"] || null, published_at: "2026-02-08", updated_at: "2026-02-08", game: MOCK_GAMES.diablo },
    { id: "a6", game_id: "9", slug: "ea-fc-25-pack-drop-rates", title: "EA FC 25 Pack Drop Rates — What Are Your Real Odds?", excerpt: "We opened 1,000 packs and tracked every card. Here are the actual drop rates for Icons, TOTWs, and promo cards compared to EA's published odds.", type: "droprates", lootboxes_score: 3.2, cover_image: covers["ea-fc-25"] || null, published_at: "2026-02-05", updated_at: "2026-02-05", game: MOCK_GAMES.eafc },
    { id: "a7", game_id: "10", slug: "honkai-star-rail-warp-economy", title: "Honkai: Star Rail — Warp Economy & Pity Analysis", excerpt: "How HoYoverse's second gacha game compares to Genshin Impact. We break down Stellar Jade income, banner pity, and the true cost of guaranteed 5-stars.", type: "economy", lootboxes_score: 5.8, cover_image: covers["honkai-star-rail"] || null, published_at: "2026-01-30", updated_at: "2026-01-30", game: MOCK_GAMES.honkai },
    { id: "a8", game_id: "11", slug: "apex-legends-pack-drop-rates-heirloom", title: "Apex Legends Pack Odds — How Many Packs Until an Heirloom?", excerpt: "We crunched the numbers on Apex pack probabilities, tracked Heirloom shard drop rates, and calculated the expected cost to unlock one. Spoiler: it's not cheap.", type: "droprates", lootboxes_score: 4.5, cover_image: covers["apex-legends"] || null, published_at: "2026-01-25", updated_at: "2026-01-25", game: MOCK_GAMES.apex },
  ];
}

const TYPES = [
  { label: "All", value: "all" },
  { label: "Battle Pass Reviews", value: "battlepass" },
  { label: "Loot Box Analysis", value: "lootbox" },
  { label: "Economy Deep-Dives", value: "economy" },
  { label: "Drop Rate Reports", value: "droprates" },
];

const SYSTEM_LABELS: Record<string, string> = {
  gacha: "Gacha",
  loot_box: "Loot Box",
  card_pack: "Card Pack",
  cosmetic_shop: "Cosmetic Shop",
  battle_pass: "Battle Pass",
};

function scoreColor(score: number): string {
  if (score >= 7) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 5) return "text-amber-600 dark:text-amber-400";
  if (score >= 3) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

function scoreBg(score: number): string {
  if (score >= 7) return "bg-emerald-500";
  if (score >= 5) return "bg-amber-500";
  if (score >= 3) return "bg-orange-500";
  return "bg-red-500";
}

export const metadata = {
  title: "Loot Box Analytics & Battle Pass Reviews",
  description:
    "Data-driven analysis of loot boxes, battle passes, gacha systems, and in-game economies. Our LootBoxes Score rates every game's monetization.",
};

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const [covers, recentScores] = await Promise.all([
    getGameCovers(),
    getRecentScores(),
  ]);
  const ARTICLES = buildArticles(covers);

  const activeType = searchParams.type || "all";
  const filteredArticles =
    activeType === "all"
      ? ARTICLES
      : ARTICLES.filter((a) => a.type === activeType);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-12">
      {/* Page hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-8 sm:py-10 dark:border-gray-800 dark:from-gray-900 dark:to-gray-950">
        <div className="container-main">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-brand-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Data-driven analysis of loot boxes, battle passes, and in-game
            economies. Rated with our proprietary Lootboxes Score.
          </p>
        </div>
      </section>

      <div className="container-main mt-6">
        {/* Type filter tabs */}
        <div className="flex flex-wrap gap-2">
          {TYPES.map((type) => (
            <Link
              key={type.value}
              href={type.value === "all" ? "/analytics" : `/analytics?type=${type.value}`}
              className={`badge border transition-all ${
                activeType === type.value
                  ? "border-gray-900 bg-gray-900 text-white shadow-md dark:border-brand-300 dark:bg-brand-50 dark:text-brand-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-brand-300 dark:hover:bg-brand-50 dark:hover:text-brand-700"
              }`}
            >
              {type.label}
            </Link>
          ))}
        </div>

        {/* Articles grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <AnalyticsCard key={article.id} article={article} />
              ))
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">No articles in this category yet. Check back soon!</p>
                <Link href="/analytics" className="mt-3 inline-block text-sm font-medium text-brand-600 hover:text-brand-700">
                  View all articles →
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Methodology link */}
            <div className="overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-blue-50 dark:border-brand-900 dark:from-brand-950 dark:to-blue-950">
              <div className="px-5 py-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-brand-900 dark:text-brand-300">
                    How We Score Games
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-brand-700 dark:text-brand-400">
                  Our LootBoxes Score rates monetization on value, transparency,
                  fairness, and consumer practices.
                </p>
                <Link
                  href="/methodology"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Read our methodology
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Recent scores — dynamic from DB */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <div className="border-b border-gray-100 bg-gray-50 px-5 py-3 dark:border-gray-800 dark:bg-gray-800/50">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Recent Scores
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Latest games rated by our team
                </p>
              </div>
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentScores.map((game: any) => {
                  const thumb =
                    game.cover_image || game.screenshot_image;
                  const sysLabel =
                    SYSTEM_LABELS[game.loot_system_type] ||
                    game.loot_system_type;
                  return (
                    <li key={game.slug}>
                      <Link
                        href={`/lootbox/${game.slug}`}
                        className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        {/* Game thumbnail */}
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg shadow-sm">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={game.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <GameAvatar
                              gameName={game.title}
                              size="sm"
                              aspectRatio="square"
                              className="h-full w-full"
                            />
                          )}
                        </div>

                        {/* Game info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {game.title}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {sysLabel}
                          </p>
                        </div>

                        {/* Score */}
                        <div
                          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${scoreBg(
                            game.lootboxes_score
                          )} text-xs font-bold text-white shadow-sm`}
                        >
                          {game.lootboxes_score.toFixed(1)}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-gray-100 px-5 py-3 dark:border-gray-800">
                <Link
                  href="/lootbox/rankings"
                  className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  See full rankings
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
