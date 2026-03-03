import GamesGrid from "@/components/games/GamesGrid";
import { createServerClient } from "@/lib/supabase";

export const metadata = {
  title: "Game Deals — Browse All Games & Compare Prices",
  description:
    "Compare prices for thousands of games across 13+ stores. Find the best deals, track historic lows, and never overpay.",
};

export const revalidate = 300;

async function getGamesWithDeals() {
  const supabase = createServerClient();

  const { data: games, error } = await supabase
    .from("games")
    .select("id, title, slug, cover_image, genres, platforms, metacritic, release_date, hot_score")
    .order("title", { ascending: true });

  if (error || !games) return [];

  // Get best price and deal count per game
  const { data: deals } = await supabase
    .from("deals")
    .select("game_id, price")
    .gt("discount_pct", 0);

  const dealStats = new Map<string, { bestPrice: number; dealCount: number }>();
  for (const deal of deals || []) {
    const existing = dealStats.get(deal.game_id);
    if (!existing) {
      dealStats.set(deal.game_id, { bestPrice: deal.price, dealCount: 1 });
    } else {
      existing.dealCount++;
      if (deal.price < existing.bestPrice) existing.bestPrice = deal.price;
    }
  }

  const enriched = games.map((game: any) => ({
    ...game,
    bestPrice: dealStats.get(game.id)?.bestPrice ?? null,
    dealCount: dealStats.get(game.id)?.dealCount ?? 0,
  }));

  // Sort: games with images first, then by hot_score, then by deal count
  enriched.sort((a: any, b: any) => {
    const aHasImg = a.cover_image ? 1 : 0;
    const bHasImg = b.cover_image ? 1 : 0;
    if (aHasImg !== bHasImg) return bHasImg - aHasImg;
    const aScore = a.hot_score || 0;
    const bScore = b.hot_score || 0;
    if (aScore !== bScore) return bScore - aScore;
    if (a.dealCount !== b.dealCount) return b.dealCount - a.dealCount;
    return a.title.localeCompare(b.title);
  });

  return enriched;
}

export default async function GamesPage() {
  const games = await getGamesWithDeals();

  return (
    <div className="py-8">
      <div className="container-main">
        <GamesGrid games={games} />
      </div>
    </div>
  );
}
