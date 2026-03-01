import GamesGrid from "@/components/games/GamesGrid";
import { createServerClient } from "@/lib/supabase";

export const metadata = {
  title: "All Games — Browse Deals & Prices",
  description:
    "Browse our complete catalog of video game deals and price comparisons across every major store.",
};

export const revalidate = 300;

async function getGamesWithDeals() {
  const supabase = createServerClient();

  const { data: games, error } = await supabase
    .from("games")
    .select("id, title, slug, cover_image, genres, platforms, metacritic, release_date")
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

  return games.map((game: any) => ({
    ...game,
    bestPrice: dealStats.get(game.id)?.bestPrice ?? null,
    dealCount: dealStats.get(game.id)?.dealCount ?? 0,
  }));
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
