import Link from "next/link";
import DealCard from "@/components/deals/DealCard";
import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import ScoreBadge from "@/components/analytics/ScoreBadge";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import HowItWorks from "@/components/home/HowItWorks";
import TrustSignals from "@/components/home/TrustSignals";
import HeroCarousel from "@/components/home/HeroCarousel";
import PromoBanners from "@/components/home/PromoBanners";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Deal, AnalyticsMeta } from "@/lib/types";
import { createServerClient } from "@/lib/supabase";

export const revalidate = 300; // Revalidate every 5 minutes

async function getTopDeals(): Promise<Deal[]> {
  const supabase = createServerClient();

  // Get the best deals (highest discount, one per game)
  const { data: deals, error } = await supabase
    .from("deals")
    .select(`
      id,
      game_id,
      store,
      store_url,
      price,
      original_price,
      discount_pct,
      currency,
      is_historic_low,
      expires_at,
      affiliate_url,
      scraped_at,
      games!inner (
        id,
        title,
        slug,
        cover_image,
        screenshot_image
      )
    `)
    .gt("discount_pct", 0)
    .order("discount_pct", { ascending: false })
    .limit(30);

  if (error || !deals) return [];

  // Deduplicate: one deal per game (best discount)
  const seenGames = new Set<string>();
  const topDeals: Deal[] = [];
  for (const d of deals as any[]) {
    if (seenGames.has(d.game_id)) continue;
    seenGames.add(d.game_id);
    topDeals.push({
      ...d,
      game: d.games,
    });
    if (topDeals.length >= 12) break; // Get more so we can split carousel vs grid
  }

  return topDeals;
}

// Analytics section mock data (will be replaced when analytics content is added)
const MOCK_ANALYTICS: AnalyticsMeta[] = [
  { id: "a1", game_id: "3", slug: "fortnite-chapter-6-season-1-battle-pass", title: "Fortnite Chapter 6 Season 1 Battle Pass — Is It Worth It?", excerpt: "We break down every tier, calculate the V-Buck value, and compare it to direct cosmetic purchases.", type: "battlepass", lootboxes_score: 7.2, cover_image: null, published_at: "2026-02-20", updated_at: "2026-02-20" },
  { id: "a2", game_id: "4", slug: "genshin-impact-gacha-analysis-2026", title: "Genshin Impact Gacha System — Complete Drop Rate Analysis", excerpt: "Official drop rates, pity system breakdown, and expected spending to pull featured characters.", type: "lootbox", lootboxes_score: 4.8, cover_image: null, published_at: "2026-02-18", updated_at: "2026-02-18" },
  { id: "a3", game_id: "6", slug: "valorant-battle-pass-episode-10", title: "Valorant Episode 10 Battle Pass Review", excerpt: "New skins, gun buddies, and sprays — here's whether this pass delivers enough value for 1000 VP.", type: "battlepass", lootboxes_score: 5.5, cover_image: null, published_at: "2026-02-15", updated_at: "2026-02-15" },
];

const SCORE_LEADERBOARD = {
  best: [
    { game: "Deep Rock Galactic", score: 9.1, slug: "deep-rock-galactic" },
    { game: "Warframe", score: 8.5, slug: "warframe" },
    { game: "Fortnite", score: 7.2, slug: "fortnite" },
  ],
  worst: [
    { game: "Diablo Immortal", score: 2.1, slug: "diablo-immortal" },
    { game: "EA FC 25", score: 2.8, slug: "ea-fc-25" },
    { game: "Genshin Impact", score: 4.8, slug: "genshin-impact" },
  ],
};

export default async function HomePage() {
  const topDeals = await getTopDeals();

  // Split deals: first 5 for carousel, rest for grid
  const carouselDeals = topDeals.slice(0, 5).map((deal) => ({
    id: deal.id,
    store: deal.store,
    price: deal.price,
    original_price: deal.original_price,
    discount_pct: deal.discount_pct,
    game: {
      title: deal.game?.title || "Unknown Game",
      slug: deal.game?.slug || "",
      cover_image: deal.game?.cover_image || null,
      screenshot_image: (deal.game as any)?.screenshot_image || null,
    },
  }));

  const gridDeals = topDeals.slice(0, 8);

  return (
    <>
      {/* ─── Hero Carousel ─── */}
      <HeroCarousel deals={carouselDeals} />

      {/* ─── Promotional Banners ─── */}
      <PromoBanners />

      {/* ─── Today's Top Deals ─── */}
      <section className="py-12 sm:py-14">
        <div className="container-main">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Today&apos;s Top Deals
              </h2>
              <span className="badge-featured text-[10px]">
                <Sparkles className="mr-1 h-3 w-3" />
                Updated live
              </span>
            </div>
            <Link
              href="/deals"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              See all deals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {gridDeals.length > 0 ? (
            <div className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {gridDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-500">Deals are being synced. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <HowItWorks />

      {/* ─── Featured Analytics + Score Leaderboard ─── */}
      <section className="py-12 sm:py-14">
        <div className="container-main">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Latest Analysis
            </h2>
            <Link
              href="/analytics"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              All analytics
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Articles */}
            <div className="space-y-4 lg:col-span-2">
              {MOCK_ANALYTICS.map((article) => (
                <AnalyticsCard key={article.id} article={article} />
              ))}
            </div>

            {/* Lootboxes Score Leaderboard */}
            <div className="space-y-4">
              <div className="card">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-success-700">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-success-100 text-[10px]">
                    ▲
                  </span>
                  Best Value Monetization
                </h3>
                <p className="mt-1 text-[11px] text-gray-400">
                  Games with the fairest in-game spending
                </p>
                <ul className="mt-3 space-y-3">
                  {SCORE_LEADERBOARD.best.map((item) => (
                    <li key={item.slug} className="flex items-center gap-3">
                      <ScoreBadge score={item.score} size="sm" />
                      <Link
                        href={`/games/${item.slug}`}
                        className="text-sm text-gray-700 hover:text-brand-600"
                      >
                        {item.game}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/analytics?sort=score_desc"
                  className="mt-4 block text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  See full rankings →
                </Link>
              </div>

              <div className="card">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-danger-600">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-danger-100 text-[10px]">
                    ▼
                  </span>
                  Watch Out
                </h3>
                <p className="mt-1 text-[11px] text-gray-400">
                  Games with aggressive monetization
                </p>
                <ul className="mt-3 space-y-3">
                  {SCORE_LEADERBOARD.worst.map((item) => (
                    <li key={item.slug} className="flex items-center gap-3">
                      <ScoreBadge score={item.score} size="sm" />
                      <Link
                        href={`/games/${item.slug}`}
                        className="text-sm text-gray-700 hover:text-brand-600"
                      >
                        {item.game}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust Signals ─── */}
      <TrustSignals />

      {/* ─── Newsletter CTA ─── */}
      <section className="py-12 sm:py-14">
        <div className="container-main">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-10 text-center sm:px-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Never overpay for a game again
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-brand-100">
              Get weekly deal roundups, battle pass reviews, and loot box
              analysis delivered to your inbox.
            </p>

            <div className="mx-auto mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-brand-200">
              <span>✓ Best deals across 15+ stores</span>
              <span>✓ Monetization fairness scores</span>
              <span>✓ Unsubscribe anytime</span>
            </div>

            <NewsletterForm variant="inline" className="mx-auto mt-6 max-w-md" />
          </div>
        </div>
      </section>
    </>
  );
}
