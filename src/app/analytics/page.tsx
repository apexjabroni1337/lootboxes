import Link from "next/link";
import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import ScoreExplorerPreview from "@/components/analytics/ScoreExplorerPreview";
import { AnalyticsMeta, Game } from "@/lib/types";
import { BarChart3, Sparkles, ArrowRight, Zap } from "lucide-react";
import { createServerClient } from "@/lib/supabase";

export const revalidate = 300;

/* ── Fetch all scored games for analytics ── */
async function getAnalyticsData() {
  const supabase = createServerClient();

  const { data: scoredGames } = await supabase
    .from("games")
    .select("id, title, slug, cover_image, screenshot_image, lootboxes_score, loot_system_type, genres, platforms, metacritic")
    .not("lootboxes_score", "is", null)
    .not("loot_system_type", "is", null)
    .order("lootboxes_score", { ascending: false });

  const games = (scoredGames as any[]) || [];

  const totalGamesAnalyzed = games.length;
  const avgScore = games.length > 0
    ? games.reduce((sum: number, g: any) => sum + (g.lootboxes_score || 0), 0) / games.length
    : 0;

  const bestGame = games.length > 0
    ? { title: games[0].title, slug: games[0].slug, score: games[0].lootboxes_score }
    : null;

  const worstGame = games.length > 0
    ? { title: games[games.length - 1].title, slug: games[games.length - 1].slug, score: games[games.length - 1].lootboxes_score }
    : null;

  // System breakdown
  const systemMap = new Map<string, { count: number; totalScore: number }>();
  for (const g of games) {
    const type = g.loot_system_type || "unknown";
    const existing = systemMap.get(type) || { count: 0, totalScore: 0 };
    existing.count++;
    existing.totalScore += g.lootboxes_score || 0;
    systemMap.set(type, existing);
  }
  const systemBreakdown = Array.from(systemMap.entries()).map(([type, data]) => ({
    type,
    count: data.count,
    avgScore: data.totalScore / data.count,
  })).sort((a, b) => b.count - a.count);

  // Score distribution — "Great" tier is dynamic: top 7 games max, ensuring
  // at least 2 loot_box type games qualify. We find the cutoff score from the
  // sorted list, then build the remaining tiers around it.
  const MAX_GREAT = 7;
  const sorted = [...games].sort((a: any, b: any) => b.lootboxes_score - a.lootboxes_score);
  // Walk down the sorted list: include up to MAX_GREAT, but keep going if
  // we haven't yet captured 2 loot_box games (up to a reasonable limit).
  let greatCutoff = 10.1; // default if no games
  if (sorted.length > 0) {
    let lootboxCount = 0;
    let idx = 0;
    for (; idx < Math.min(sorted.length, 12); idx++) {
      const g = sorted[idx] as any;
      if (g.loot_system_type === "loot_box") lootboxCount++;
      if (idx >= MAX_GREAT - 1 && lootboxCount >= 2) break;
    }
    // Cutoff is the score of the last included game (floored to 1 decimal)
    greatCutoff = Math.floor(sorted[idx].lootboxes_score * 10) / 10;
  }
  const greatMin = greatCutoff;
  // Build tiers: spread remaining range evenly into 3 buckets
  const tierSize = greatMin / 3;
  const goodMin = Math.round((greatMin - tierSize) * 10) / 10;
  const avgMin = Math.round((greatMin - tierSize * 2) * 10) / 10;

  const ranges = [
    { range: `${greatMin.toFixed(1)} — 10.0 (Great)`, min: greatMin, max: 10.1, color: "#10b981" },
    { range: `${goodMin.toFixed(1)} — ${(greatMin - 0.1).toFixed(1)} (Good)`, min: goodMin, max: greatMin, color: "#f59e0b" },
    { range: `${avgMin.toFixed(1)} — ${(goodMin - 0.1).toFixed(1)} (Average)`, min: avgMin, max: goodMin, color: "#f97316" },
    { range: `0 — ${(avgMin - 0.1).toFixed(1)} (Poor)`, min: 0, max: avgMin, color: "#ef4444" },
  ];
  const scoreDistribution = ranges.map(r => ({
    range: r.range,
    count: games.filter((g: any) => g.lootboxes_score >= r.min && g.lootboxes_score < r.max).length,
    color: r.color,
  }));

  // Top and bottom games
  const topGames = games.slice(0, 5).map((g: any) => ({
    title: g.title,
    slug: g.slug,
    score: g.lootboxes_score,
    loot_system_type: g.loot_system_type,
    cover_image: g.screenshot_image || g.cover_image,
  }));
  const bottomGames = [...games].reverse().slice(0, 5).map((g: any) => ({
    title: g.title,
    slug: g.slug,
    score: g.lootboxes_score,
    loot_system_type: g.loot_system_type,
    cover_image: g.screenshot_image || g.cover_image,
  }));

  // All games for explorer
  const allGamesForExplorer = games.map((g: any) => ({
    title: g.title,
    slug: g.slug,
    score: g.lootboxes_score,
    loot_system_type: g.loot_system_type,
    cover_image: g.screenshot_image || g.cover_image,
  }));

  // Industry insights (computed from real data)
  const gachaGames = games.filter((g: any) => g.loot_system_type === "gacha");
  const avgGachaScore = gachaGames.length > 0
    ? (gachaGames.reduce((s: number, g: any) => s + g.lootboxes_score, 0) / gachaGames.length).toFixed(1)
    : "N/A";
  const fairGames = games.filter((g: any) => g.lootboxes_score >= 7);
  const aggressiveGames = games.filter((g: any) => g.lootboxes_score < 4);
  const battlePassGames = games.filter((g: any) => g.loot_system_type === "battle_pass");
  const avgBPScore = battlePassGames.length > 0
    ? (battlePassGames.reduce((s: number, g: any) => s + g.lootboxes_score, 0) / battlePassGames.length).toFixed(1)
    : "N/A";

  const industryInsights = [
    {
      label: "Gacha Average Score",
      value: avgGachaScore.toString(),
      description: `Gacha systems across ${gachaGames.length} analyzed games tend to score lower due to randomized spending.`,
      icon: "🎰",
    },
    {
      label: "Consumer-Friendly Games",
      value: `${fairGames.length}`,
      description: `${fairGames.length} out of ${totalGamesAnalyzed} games scored 7.0 or above, indicating fair monetization.`,
      icon: "🛡️",
    },
    {
      label: "Aggressive Monetization",
      value: `${aggressiveGames.length}`,
      description: `${aggressiveGames.length} games scored below 4.0, signaling predatory or poor-value systems.`,
      icon: "⚠️",
    },
    {
      label: "Battle Pass Avg Score",
      value: avgBPScore.toString(),
      description: `Battle pass systems across ${battlePassGames.length} games — generally offer more transparent value.`,
      icon: "🏆",
    },
    {
      label: "Total Systems Tracked",
      value: `${systemBreakdown.length}`,
      description: `We track ${systemBreakdown.length} distinct monetization system types across the gaming industry.`,
      icon: "📊",
    },
    {
      label: "Industry Average",
      value: avgScore.toFixed(1),
      description: `The average LootBoxes Score across all ${totalGamesAnalyzed} analyzed games. Above 6 indicates fair value.`,
      icon: "📈",
    },
  ];

  return {
    totalGamesAnalyzed,
    avgScore,
    bestGame,
    worstGame,
    systemBreakdown,
    scoreDistribution,
    topGames,
    bottomGames,
    allGamesForExplorer,
    industryInsights,
  };
}

/* ── Fetch cover images from DB for articles ── */
async function getGameCovers(): Promise<Record<string, string | null>> {
  const supabase = createServerClient();
  const slugs = ["fortnite", "genshin-impact", "valorant", "overwatch-2", "diablo-iv", "ea-fc-25", "honkai-star-rail", "apex-legends", "call-of-duty-warzone", "league-of-legends", "destiny-2", "marvel-rivals", "counter-strike-2", "rocket-league", "pokemon-tcg-pocket", "path-of-exile-2", "the-finals", "rainbow-six-siege", "wuthering-waves", "dead-by-daylight", "zenless-zone-zero"];
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
    warzone: { id: "12", title: "Call of Duty: Warzone", slug: "call-of-duty-warzone", cover_image: covers["call-of-duty-warzone"] || null, platforms: ["PC", "PS5", "Xbox"], genres: ["FPS", "Battle Royale"], release_date: "2020-03-10", metacritic: 80, lootboxes_score: 4.2, created_at: "", updated_at: "" },
    lol: { id: "13", title: "League of Legends", slug: "league-of-legends", cover_image: covers["league-of-legends"] || null, platforms: ["PC"], genres: ["MOBA"], release_date: "2009-10-27", metacritic: 75, lootboxes_score: 6.5, created_at: "", updated_at: "" },
    destiny: { id: "14", title: "Destiny 2", slug: "destiny-2", cover_image: covers["destiny-2"] || null, platforms: ["PC", "PS5", "Xbox"], genres: ["FPS", "MMO"], release_date: "2017-09-06", metacritic: 78, lootboxes_score: 4.0, created_at: "", updated_at: "" },
    rivals: { id: "15", title: "Marvel Rivals", slug: "marvel-rivals", cover_image: covers["marvel-rivals"] || null, platforms: ["PC", "PS5", "Xbox"], genres: ["Hero Shooter"], release_date: "2025-12-06", metacritic: 82, lootboxes_score: 7.8, created_at: "", updated_at: "" },
    cs2: { id: "16", title: "Counter-Strike 2", slug: "counter-strike-2", cover_image: covers["counter-strike-2"] || null, platforms: ["PC"], genres: ["FPS", "Competitive"], release_date: "2023-09-01", metacritic: 88, lootboxes_score: 8.5, created_at: "", updated_at: "" },
    rl: { id: "17", title: "Rocket League", slug: "rocket-league", cover_image: covers["rocket-league"] || null, platforms: ["PC", "PS5", "Xbox", "Switch"], genres: ["Sports"], release_date: "2015-07-09", metacritic: 86, lootboxes_score: 6.0, created_at: "", updated_at: "" },
    ptcgp: { id: "18", title: "Pokémon TCG Pocket", slug: "pokemon-tcg-pocket", cover_image: covers["pokemon-tcg-pocket"] || null, platforms: ["Mobile", "PC"], genres: ["Card Game"], release_date: "2024-10-30", metacritic: 78, lootboxes_score: 5.2, created_at: "", updated_at: "" },
    poe2: { id: "19", title: "Path of Exile 2", slug: "path-of-exile-2", cover_image: covers["path-of-exile-2"] || null, platforms: ["PC", "PS5", "Xbox"], genres: ["Action RPG"], release_date: "2024-12-06", metacritic: 85, lootboxes_score: 5.0, created_at: "", updated_at: "" },
    finals: { id: "20", title: "THE FINALS", slug: "the-finals", cover_image: covers["the-finals"] || null, platforms: ["PC", "PS5", "Xbox"], genres: ["FPS"], release_date: "2023-12-08", metacritic: 80, lootboxes_score: 6.8, created_at: "", updated_at: "" },
    r6: { id: "21", title: "Rainbow Six Siege", slug: "rainbow-six-siege", cover_image: covers["rainbow-six-siege"] || null, platforms: ["PC", "PS5", "Xbox"], genres: ["FPS"], release_date: "2015-12-01", metacritic: 79, lootboxes_score: 4.8, created_at: "", updated_at: "" },
    ww: { id: "22", title: "Wuthering Waves", slug: "wuthering-waves", cover_image: covers["wuthering-waves"] || null, platforms: ["PC", "PS5", "Mobile"], genres: ["Action RPG", "Gacha"], release_date: "2024-05-22", metacritic: 72, lootboxes_score: 6.2, created_at: "", updated_at: "" },
    dbd: { id: "23", title: "Dead by Daylight", slug: "dead-by-daylight", cover_image: covers["dead-by-daylight"] || null, platforms: ["PC", "PS5", "Xbox", "Switch"], genres: ["Horror", "Survival"], release_date: "2016-06-14", metacritic: 71, lootboxes_score: 4.5, created_at: "", updated_at: "" },
    zzz: { id: "24", title: "Zenless Zone Zero", slug: "zenless-zone-zero", cover_image: covers["zenless-zone-zero"] || null, platforms: ["PC", "PS5", "Mobile"], genres: ["Action RPG", "Gacha"], release_date: "2024-07-04", metacritic: 75, lootboxes_score: 5.5, created_at: "", updated_at: "" },
  };

  return [
    { id: "a12", game_id: "15", slug: "marvel-rivals-battle-pass-season-2", title: "Marvel Rivals Season 2 Battle Pass — A Refreshingly Fair Monetization Model", excerpt: "We analyzed the hero unlock system, cosmetic earnings rates, and pricing.", type: "battlepass", lootboxes_score: 7.8, cover_image: covers["marvel-rivals"] || null, published_at: "2026-02-25", updated_at: "2026-02-25", game: MOCK_GAMES.rivals },
    { id: "a15", game_id: "18", slug: "pokemon-tcg-pocket-pack-odds", title: "Pokémon TCG Pocket Pack Odds — Crown Rarity Drop Rates Analyzed", excerpt: "We analyzed 5,000+ digital card packs to calculate true crown rarity odds.", type: "droprates", lootboxes_score: 5.2, cover_image: covers["pokemon-tcg-pocket"] || null, published_at: "2026-02-28", updated_at: "2026-02-28", game: MOCK_GAMES.ptcgp },
    { id: "a1", game_id: "3", slug: "fortnite-chapter-6-season-1-battle-pass", title: "Fortnite Chapter 6 Season 1 Battle Pass — Is It Worth It?", excerpt: "We break down every tier, calculate the V-Buck value, and compare it to direct cosmetic purchases.", type: "battlepass", lootboxes_score: 7.2, cover_image: covers["fortnite"] || null, published_at: "2026-02-20", updated_at: "2026-02-20", game: MOCK_GAMES.fortnite },
    { id: "a2", game_id: "4", slug: "genshin-impact-gacha-analysis-2026", title: "Genshin Impact Gacha System — Complete Drop Rate Analysis", excerpt: "Official drop rates, pity system breakdown, and expected spending to pull featured characters.", type: "lootbox", lootboxes_score: 4.8, cover_image: covers["genshin-impact"] || null, published_at: "2026-02-18", updated_at: "2026-02-18", game: MOCK_GAMES.genshin },
    { id: "a3", game_id: "6", slug: "valorant-battle-pass-episode-10", title: "Valorant Episode 10 Battle Pass Review", excerpt: "New skins, gun buddies, and sprays — here's whether this pass delivers enough value for 1000 VP.", type: "battlepass", lootboxes_score: 5.5, cover_image: covers["valorant"] || null, published_at: "2026-02-15", updated_at: "2026-02-15", game: MOCK_GAMES.valorant },
    { id: "a17", game_id: "20", slug: "the-finals-battle-pass-season-5", title: "THE FINALS Battle Pass Season 5 — A Fair Monetization Model", excerpt: "THE FINALS demonstrates that competitive shooters can monetize fairly.", type: "battlepass", lootboxes_score: 6.8, cover_image: covers["the-finals"] || null, published_at: "2026-02-15", updated_at: "2026-02-15", game: MOCK_GAMES.finals },
    { id: "a4", game_id: "7", slug: "overwatch-2-shop-analysis", title: "Overwatch 2 Shop & Battle Pass: A Monetization Deep-Dive", excerpt: "From the old loot box system to the new shop model — we analyze player value.", type: "lootbox", lootboxes_score: 3.9, cover_image: covers["overwatch-2"] || null, published_at: "2026-02-12", updated_at: "2026-02-12", game: MOCK_GAMES.ow2 },
    { id: "a18", game_id: "21", slug: "rainbow-six-siege-alpha-pack-odds", title: "Rainbow Six Siege Alpha Pack Odds — 2% Base Rate Deconstructed", excerpt: "We analyzed 10,000 Siege matches tracking Alpha Pack drops.", type: "droprates", lootboxes_score: 4.8, cover_image: covers["rainbow-six-siege"] || null, published_at: "2026-02-10", updated_at: "2026-02-10", game: MOCK_GAMES.r6 },
    { id: "a5", game_id: "8", slug: "diablo-iv-shop-economy-breakdown", title: "Diablo IV Shop Economy — Are Cosmetics Fairly Priced?", excerpt: "We analyze Platinum pricing, bundle values, and how Diablo IV's economy compares to other ARPGs.", type: "economy", lootboxes_score: 7.5, cover_image: covers["diablo-iv"] || null, published_at: "2026-02-08", updated_at: "2026-02-08", game: MOCK_GAMES.diablo },
    { id: "a6", game_id: "9", slug: "ea-fc-25-pack-drop-rates", title: "EA FC 25 Pack Drop Rates — What Are Your Real Odds?", excerpt: "We opened 1,000 packs and tracked every card. Here are the actual drop rates.", type: "droprates", lootboxes_score: 3.2, cover_image: covers["ea-fc-25"] || null, published_at: "2026-02-05", updated_at: "2026-02-05", game: MOCK_GAMES.eafc },
    { id: "a19", game_id: "22", slug: "wuthering-waves-gacha-analysis", title: "Wuthering Waves Gacha Analysis — Astrite Income Comparison", excerpt: "Wuthering Waves' Convene system vs. HoYoverse peers.", type: "lootbox", lootboxes_score: 6.2, cover_image: covers["wuthering-waves"] || null, published_at: "2026-02-05", updated_at: "2026-02-05", game: MOCK_GAMES.ww },
    { id: "a16", game_id: "19", slug: "path-of-exile-2-cosmetic-pricing", title: "Path of Exile 2 Cosmetic Pricing — $30-65 Armor Sets", excerpt: "PoE2's cosmetic shop creates an expensive monetization model.", type: "economy", lootboxes_score: 5.0, cover_image: covers["path-of-exile-2"] || null, published_at: "2026-02-22", updated_at: "2026-02-22", game: MOCK_GAMES.poe2 },
    { id: "a7", game_id: "10", slug: "honkai-star-rail-warp-economy", title: "Honkai: Star Rail — Warp Economy & Pity Analysis", excerpt: "Stellar Jade income, banner pity, and the true cost of guaranteed 5-stars.", type: "economy", lootboxes_score: 5.8, cover_image: covers["honkai-star-rail"] || null, published_at: "2026-01-30", updated_at: "2026-01-30", game: MOCK_GAMES.honkai },
    { id: "a20", game_id: "23", slug: "dead-by-daylight-store-economy", title: "Dead by Daylight Store Economy — $10 Skins in a Paid Game", excerpt: "Premium cosmetic prices in a $20 purchase game.", type: "economy", lootboxes_score: 4.5, cover_image: covers["dead-by-daylight"] || null, published_at: "2026-01-28", updated_at: "2026-01-28", game: MOCK_GAMES.dbd },
    { id: "a8", game_id: "11", slug: "apex-legends-pack-drop-rates-heirloom", title: "Apex Legends Pack Odds — How Many Packs Until an Heirloom?", excerpt: "Heirloom shard drop rates and expected cost to unlock one.", type: "droprates", lootboxes_score: 4.5, cover_image: covers["apex-legends"] || null, published_at: "2026-01-25", updated_at: "2026-01-25", game: MOCK_GAMES.apex },
    { id: "a21", game_id: "24", slug: "zenless-zone-zero-signal-search", title: "Zenless Zone Zero Signal Search System — HoYoverse Gacha Optimized", excerpt: "ZZZ's signal search rates, pity mechanics, and Polychrome income.", type: "lootbox", lootboxes_score: 5.5, cover_image: covers["zenless-zone-zero"] || null, published_at: "2026-01-22", updated_at: "2026-01-22", game: MOCK_GAMES.zzz },
    { id: "a9", game_id: "12", slug: "call-of-duty-warzone-store-economy", title: "Call of Duty: Warzone Store Economy — Premium Pricing Analysis", excerpt: "CoD Points pricing, bundle costs, and operator skin markups.", type: "economy", lootboxes_score: 4.2, cover_image: covers["call-of-duty-warzone"] || null, published_at: "2026-01-20", updated_at: "2026-01-20", game: MOCK_GAMES.warzone },
    { id: "a10", game_id: "13", slug: "league-of-legends-skin-economy-2026", title: "League of Legends Skin Pricing & Hextech Economy", excerpt: "RP pricing, skin tier costs, and gacha mechanics analysis.", type: "economy", lootboxes_score: 6.5, cover_image: covers["league-of-legends"] || null, published_at: "2026-01-18", updated_at: "2026-01-18", game: MOCK_GAMES.lol },
    { id: "a11", game_id: "14", slug: "destiny-2-eververse-monetization", title: "Destiny 2 Eververse Store — How Bungie's Cosmetics Stack Up", excerpt: "Silver pricing, eververse rotations, and season pass value.", type: "lootbox", lootboxes_score: 4.0, cover_image: covers["destiny-2"] || null, published_at: "2026-01-15", updated_at: "2026-01-15", game: MOCK_GAMES.destiny },
    { id: "a13", game_id: "16", slug: "counter-strike-2-case-drop-rates", title: "Counter-Strike 2 Skin Economy — Why Tradeable Skins Score 8.5/10", excerpt: "Tradeable skins, transparent odds, and a thriving marketplace make CS2 the gold standard for fair monetization.", type: "droprates", lootboxes_score: 8.5, cover_image: covers["counter-strike-2"] || null, published_at: "2026-01-10", updated_at: "2026-01-10", game: MOCK_GAMES.cs2 },
    { id: "a14", game_id: "17", slug: "rocket-league-item-shop-analysis", title: "Rocket League Item Shop & Rocket Pass — Pricing Data Analyzed", excerpt: "200+ item rotations tracked and Rocket Pass value analyzed.", type: "economy", lootboxes_score: 6.0, cover_image: covers["rocket-league"] || null, published_at: "2026-01-05", updated_at: "2026-01-05", game: MOCK_GAMES.rl },
  ];
}

const TYPES = [
  { label: "All", value: "all" },
  { label: "Battle Pass Reviews", value: "battlepass" },
  { label: "Loot Box Analysis", value: "lootbox" },
  { label: "Economy Deep-Dives", value: "economy" },
  { label: "Drop Rate Reports", value: "droprates" },
];

export const metadata = {
  title: "Loot Box Analytics Hub — Scores, Trends & Deep Dives | LootBoxes",
  description:
    "Data-driven analytics on loot boxes, battle passes, gacha systems, and in-game economies. Interactive charts, score distributions, and the proprietary LootBoxes Score.",
  openGraph: {
    title: "Loot Box Analytics Hub — Scores, Trends & Deep Dives",
    description: "Interactive analytics on gaming monetization. Score breakdowns, system comparisons, and in-depth reviews.",
    url: "https://lootboxes.com/analytics",
    type: "website",
  },
  alternates: {
    canonical: "https://lootboxes.com/analytics",
  },
};

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const sp = await searchParams;
  const [analyticsData, covers] = await Promise.all([
    getAnalyticsData(),
    getGameCovers(),
  ]);
  const ARTICLES = buildArticles(covers);

  const activeType = sp.type || "all";
  const filteredArticles =
    activeType === "all"
      ? ARTICLES
      : ARTICLES.filter((a) => a.type === activeType);

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 py-14 sm:py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-brand-400/10 blur-3xl" />
        </div>

        <div className="container-main relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="inline-flex rounded-full bg-white/20 backdrop-blur-sm px-4 py-1 text-sm font-semibold text-white">
              Data-Driven Analysis
            </div>
          </div>

          <h1 className="mt-4 text-4xl sm:text-5xl font-black text-white tracking-tight">
            Analytics Hub
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-blue-100 leading-relaxed">
            Interactive analytics on gaming monetization. Explore score distributions, compare monetization systems, and dive into our in-depth reviews — all powered by the proprietary LootBoxes Score.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
            <div className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-5 py-4 transition-all hover:bg-white/20 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400/20 mb-2">
                  <Zap className="h-4.5 w-4.5 text-yellow-300" />
                </div>
                <p className="text-2xl font-black text-white tracking-tight">{analyticsData.totalGamesAnalyzed}</p>
                <p className="text-xs font-medium text-blue-200 uppercase tracking-wider mt-0.5">Games Analyzed</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-5 py-4 transition-all hover:bg-white/20 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/20 mb-2">
                  <BarChart3 className="h-4.5 w-4.5 text-cyan-300" />
                </div>
                <p className="text-2xl font-black text-white tracking-tight">{analyticsData.systemBreakdown.length}</p>
                <p className="text-xs font-medium text-blue-200 uppercase tracking-wider mt-0.5">System Types</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-5 py-4 transition-all hover:bg-white/20 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-400/20 mb-2">
                  <Sparkles className="h-4.5 w-4.5 text-purple-300" />
                </div>
                <p className="text-2xl font-black text-white tracking-tight">{ARTICLES.length}</p>
                <p className="text-xs font-medium text-blue-200 uppercase tracking-wider mt-0.5">Deep Analyses</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Analytics Dashboard ─── */}
      <section className="py-10">
        <div className="container-main">
          <AnalyticsDashboard
            totalGamesAnalyzed={analyticsData.totalGamesAnalyzed}
            avgScore={analyticsData.avgScore}
            bestGame={analyticsData.bestGame}
            worstGame={analyticsData.worstGame}
            systemBreakdown={analyticsData.systemBreakdown}
            scoreDistribution={analyticsData.scoreDistribution}
            topGames={analyticsData.topGames}
            bottomGames={analyticsData.bottomGames}
            industryInsights={analyticsData.industryInsights}
          />
        </div>
      </section>

      {/* ─── Score Explorer + Articles ─── */}
      <section className="border-t border-gray-100 bg-gray-50 py-10">
        <div className="container-main">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main: Articles */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">In-Depth Reviews & Analyses</h2>

              <div className="mb-6 flex flex-wrap gap-2">
                {TYPES.map((type) => (
                  <Link
                    key={type.value}
                    href={type.value === "all" ? "/analytics" : `/analytics?type=${type.value}`}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                      activeType === type.value
                        ? "bg-brand-600 text-white shadow-sm"
                        : "border border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-brand-50"
                    }`}
                  >
                    {type.label}
                  </Link>
                ))}
              </div>

              {filteredArticles.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                  {filteredArticles.map((article) => (
                    <AnalyticsCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                  <p className="text-gray-500">No articles in this category yet.</p>
                  <Link href="/analytics" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600">
                    View all articles
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <ScoreExplorerPreview games={analyticsData.allGamesForExplorer} />

              <div className="rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">How We Score</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Our LootBoxes Score rates monetization on value, transparency, fairness, and consumer practices on a 1-10 scale.
                </p>
                <Link
                  href="/methodology"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Read methodology
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">Full Score Database</h3>
                <p className="text-sm text-gray-600 mb-4">
                  See every game we've analyzed with detailed scores, system types, and rankings.
                </p>
                <Link
                  href="/analytics/scores"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Open Score Explorer
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
