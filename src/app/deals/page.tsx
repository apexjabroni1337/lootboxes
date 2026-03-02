import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { STORES } from "@/lib/types";
import {
  TrendingDown,
  Sparkles,
  ShoppingBag,
  Store,
  Zap,
} from "lucide-react";
import { createServerClient } from "@/lib/supabase";
import DealsFilter from "@/components/deals/DealsFilter";
import HeroCarousel from "@/components/home/HeroCarousel";
import FlashDeals from "@/components/home/FlashDeals";
import FeaturedDeals from "@/components/home/FeaturedDeals";
import SaleBanners from "@/components/home/SaleBanners";
import WhatsHot from "@/components/home/WhatsHot";

export const metadata = {
  title: "Hot Deals — Compare Game Prices Across Every Store | LootBoxes",
  description:
    "Find the cheapest prices on PC and console games. Compare deals across Steam, Epic, GOG, Humble Bundle, and more. Updated every 30 minutes.",
  openGraph: {
    title: "Hot Deals — Compare Game Prices Across Every Store",
    description:
      "Find the cheapest prices on PC and console games. Compare deals across Steam, Epic, GOG, Humble Bundle, and more.",
    url: "https://lootboxes.com/deals",
    type: "website",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Hot Deals — Best Gaming Deals Today",
    description:
      "Compare prices across 15+ stores. Find the cheapest PC & console game deals. Updated every 30 minutes.",
  },
  alternates: {
    canonical: "https://lootboxes.com/deals",
  },
};

export const revalidate = 300;

async function getDeals() {
  const supabase = createServerClient();

  // First, get top games ranked by hot_score
  const { data: topGames } = await supabase
    .from("games")
    .select("id")
    .order("hot_score", { ascending: false, nullsFirst: false })
    .limit(30);

  const topGameIds = (topGames || []).map((g) => g.id);

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
        screenshot_image,
        hot_score
      )
    `)
    .order("discount_pct", { ascending: false })
    .limit(500);

  if (error) {
    console.error("Deals query error:", error.message);
    return [];
  }

  if (!deals) return [];

  // Deduplicate: keep only the best deal per game
  const bestByGame = new Map<string, any>();
  for (const deal of deals) {
    const gameId = (deal as any).game_id;
    const existing = bestByGame.get(gameId);
    if (!existing || deal.price < existing.price) {
      bestByGame.set(gameId, deal);
    }
  }
  const unique = Array.from(bestByGame.values());

  // Sort: prioritize games with images + high discounts + hot_score
  const sorted = unique.sort((a: any, b: any) => {
    const aHasImg = a.games?.cover_image ? 1 : 0;
    const bHasImg = b.games?.cover_image ? 1 : 0;
    if (aHasImg !== bHasImg) return bHasImg - aHasImg;
    const aScore = a.games?.hot_score || 0;
    const bScore = b.games?.hot_score || 0;
    if (aScore !== bScore) return bScore - aScore;
    return (b.discount_pct || 0) - (a.discount_pct || 0);
  });

  return sorted.slice(0, 100);
}

export default async function DealsPage() {
  const deals = await getDeals();
  const historicLowCount = deals.filter((d: any) => d.is_historic_low).length;
  const bigDiscountCount = deals.filter(
    (d: any) => d.discount_pct >= 50
  ).length;
  const uniqueStores = new Set(deals.map((d: any) => d.store));
  const under10Count = deals.filter((d: any) => d.price <= 10).length;

  // Prepare data for the deal components
  const carouselDeals = deals.slice(0, 5).map((deal: any) => ({
    id: deal.id,
    store: deal.store,
    price: deal.price,
    original_price: deal.original_price,
    discount_pct: deal.discount_pct,
    game: {
      title: deal.games?.title || "Unknown Game",
      slug: deal.games?.slug || "",
      cover_image: deal.games?.cover_image || null,
      screenshot_image: deal.games?.screenshot_image || null,
    },
  }));

  const flashDeals = deals.slice(0, 3).map((deal: any) => ({
    id: deal.id,
    store: deal.store,
    price: deal.price,
    original_price: deal.original_price,
    discount_pct: deal.discount_pct,
    is_historic_low: deal.is_historic_low,
    game: {
      title: deal.games?.title || "Unknown Game",
      slug: deal.games?.slug || "",
      cover_image: deal.games?.cover_image || null,
      screenshot_image: deal.games?.screenshot_image || null,
    },
  }));

  const featuredDeals = deals.slice(3, 6).map((deal: any) => ({
    id: deal.id,
    store: deal.store,
    price: deal.price,
    original_price: deal.original_price,
    discount_pct: deal.discount_pct,
    is_historic_low: deal.is_historic_low,
    game: {
      title: deal.games?.title || "Unknown Game",
      slug: deal.games?.slug || "",
      cover_image: deal.games?.cover_image || null,
      screenshot_image: deal.games?.screenshot_image || null,
    },
  }));

  const hotDeals = deals.slice(0, 15).map((deal: any) => ({
    id: deal.id,
    store: deal.store,
    price: deal.price,
    original_price: deal.original_price,
    discount_pct: deal.discount_pct,
    game: {
      title: deal.games?.title || "Unknown Game",
      slug: deal.games?.slug || "",
      cover_image: deal.games?.cover_image || null,
      screenshot_image: deal.games?.screenshot_image || null,
    },
  }));

  return (
    <div className="pb-12">
      {/* ─── Hero Carousel ─── */}
      <HeroCarousel deals={carouselDeals} />

      {/* ─── Stats Strip ─── */}
      <section className="border-b border-gray-100 bg-gradient-to-r from-brand-50 via-white to-gray-50 py-6">
        <div className="container-main">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hot Deals</h1>
                <p className="text-sm text-gray-500">
                  Best prices across {uniqueStores.size}+ stores — updated every
                  30 minutes
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
                <Zap className="h-4 w-4 text-brand-600" />
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {deals.length}
                  </p>
                  <p className="text-[11px] text-gray-500">Active deals</p>
                </div>
              </div>
              {historicLowCount > 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
                  <TrendingDown className="h-4 w-4 text-brand-600" />
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {historicLowCount}
                    </p>
                    <p className="text-[11px] text-gray-500">Historic lows</p>
                  </div>
                </div>
              )}
              {bigDiscountCount > 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {bigDiscountCount}
                    </p>
                    <p className="text-[11px] text-gray-500">50%+ off</p>
                  </div>
                </div>
              )}
              {under10Count > 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
                  <Store className="h-4 w-4 text-success-600" />
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {under10Count}
                    </p>
                    <p className="text-[11px] text-gray-500">Under $10</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Flash Deals with Countdown ─── */}
      <FlashDeals deals={flashDeals} />

      {/* ─── Featured Deals ─── */}
      <FeaturedDeals deals={featuredDeals} />

      {/* ─── Browse by Category ─── */}
      <SaleBanners />

      {/* ─── What's Hot Carousel ─── */}
      <WhatsHot deals={hotDeals} />

      {/* ─── Full Deals List (tabbed & filterable) ─── */}
      <section className="py-10">
        <div className="container-main">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            All Deals
          </h2>
          <DealsFilter deals={deals} />

          {/* Bottom CTA */}
          <div className="mt-10 rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-white p-6 sm:p-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Never miss a deal
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get the best deals delivered to your inbox every week. No
                  spam, ever.
                </p>
              </div>
              <Link
                href="/newsletter"
                className="btn-primary flex-shrink-0"
              >
                Get Deal Alerts
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
