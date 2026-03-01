import Link from "next/link";
import DealCard from "@/components/deals/DealCard";
import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import ScoreBadge from "@/components/analytics/ScoreBadge";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import HowItWorks from "@/components/home/HowItWorks";
import TrustSignals from "@/components/home/TrustSignals";
import HeroCarousel from "@/components/home/HeroCarousel";
import PromoBanners from "@/components/home/PromoBanners";
import FlashDeals from "@/components/home/FlashDeals";
import FeaturedDeals from "@/components/home/FeaturedDeals";
import WhatsHot from "@/components/home/WhatsHot";
import SaleBanners from "@/components/home/SaleBanners";
import {
  ArrowRight,
  Sparkles,
  Bell,
  Shield,
  Zap,
} from "lucide-react";
import { Deal, AnalyticsMeta } from "@/lib/types";
import { createServerClient } from "@/lib/supabase";

export const revalidate = 300; // Revalidate every 5 minutes

async function getAllDeals(): Promise<Deal[]> {
  const supabase = createServerClient();

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
    .limit(60);

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
    if (topDeals.length >= 20) break;
  }

  return topDeals;
}

// Analytics section mock data
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
  const allDeals = await getAllDeals();

  // Split deals into sections
  const carouselDeals = allDeals.slice(0, 5).map((deal) => ({
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

  // Flash deals: top 3 highest discount
  const flashDeals = allDeals.slice(0, 3).map((deal) => ({
    id: deal.id,
    store: deal.store,
    price: deal.price,
    original_price: deal.original_price,
    discount_pct: deal.discount_pct,
    is_historic_low: deal.is_historic_low,
    game: {
      title: deal.game?.title || "Unknown Game",
      slug: deal.game?.slug || "",
      cover_image: deal.game?.cover_image || null,
      screenshot_image: (deal.game as any)?.screenshot_image || null,
    },
  }));

  // Featured deals: next 3
  const featuredDeals = allDeals.slice(3, 6).map((deal) => ({
    id: deal.id,
    store: deal.store,
    price: deal.price,
    original_price: deal.original_price,
    discount_pct: deal.discount_pct,
    is_historic_low: deal.is_historic_low,
    game: {
      title: deal.game?.title || "Unknown Game",
      slug: deal.game?.slug || "",
      cover_image: deal.game?.cover_image || null,
      screenshot_image: (deal.game as any)?.screenshot_image || null,
    },
  }));

  // What's Hot: remaining deals for carousel
  const hotDeals = allDeals.slice(0, 15).map((deal) => ({
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

  // Grid deals (8 for the main grid)
  const gridDeals = allDeals.slice(0, 8);

  return (
    <>
      {/* ─── Hero Carousel ─── */}
      <HeroCarousel deals={carouselDeals} />

      {/* ─── Promotional Banners ─── */}
      <PromoBanners />

      {/* ─── Flash Deals with Countdown ─── */}
      <FlashDeals deals={flashDeals} />

      {/* ─── Featured Deals (landscape) ─── */}
      <FeaturedDeals deals={featuredDeals} />

      {/* ─── Category Sale Banners ─── */}
      <SaleBanners />

      {/* ─── What's Hot Carousel ─── */}
      <WhatsHot deals={hotDeals} />

      {/* ─── Today's Top Deals Grid ─── */}
      <section className="py-10">
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

      {/* ─── Newsletter CTA (restyled) ─── */}
      <section className="py-12 sm:py-14">
        <div className="container-main">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="grid items-center gap-0 lg:grid-cols-2">
              {/* Left: Content */}
              <div className="px-8 py-10 sm:px-12">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  <Bell className="h-3.5 w-3.5" />
                  Deal Alerts
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
                  Never miss a deal again
                </h2>
                <p className="mt-3 max-w-md text-gray-500">
                  Get weekly deal roundups, historic low alerts, and battle pass reviews delivered to your inbox.
                </p>

                <div className="mt-5 flex flex-col gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-brand-600" />
                    Best deals across 15+ stores
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-brand-600" />
                    No spam — unsubscribe anytime
                  </div>
                </div>

                <NewsletterForm variant="inline" className="mt-6 max-w-md" />
              </div>

              {/* Right: Visual accent */}
              <div className="hidden bg-gradient-to-br from-brand-500 to-brand-700 px-12 py-10 lg:flex lg:flex-col lg:items-center lg:justify-center">
                <div className="text-center text-white">
                  <p className="text-5xl font-extrabold">15+</p>
                  <p className="mt-1 text-lg font-medium text-brand-100">Stores compared</p>
                  <div className="mx-auto my-5 h-px w-20 bg-white/20" />
                  <p className="text-5xl font-extrabold">30min</p>
                  <p className="mt-1 text-lg font-medium text-brand-100">Update frequency</p>
                  <div className="mx-auto my-5 h-px w-20 bg-white/20" />
                  <p className="text-5xl font-extrabold">100%</p>
                  <p className="mt-1 text-lg font-medium text-brand-100">Free forever</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
