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

async function getDeals(options?: { hasLootbox?: boolean; sort?: string }) {
  const supabase = createServerClient();

  // First, get top games ranked by hot_score
  const { data: topGames } = await supabase
    .from("games")
    .select("id")
    .order("hot_score", { ascending: false, nullsFirst: false })
    .limit(30);

  const topGameIds = (topGames || []).map((g) => g.id);

  let query = supabase
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
        hot_score,
        genres,
        loot_system_type
      )
    `)
    .order("discount_pct", { ascending: false })
    .limit(500);

  // Filter to only lootbox games if requested
  if (options?.hasLootbox) {
    query = query.not("games.loot_system_type", "is", null);
  }

  const { data: deals, error } = await query;

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

  // Sort based on requested sort mode
  const sorted = unique.sort((a: any, b: any) => {
    if (options?.sort === "trending") {
      // Trending: sort by hot_score first, then discount
      const aScore = a.games?.hot_score || 0;
      const bScore = b.games?.hot_score || 0;
      if (aScore !== bScore) return bScore - aScore;
      return (b.discount_pct || 0) - (a.discount_pct || 0);
    }
    // Default: prioritize games with images + high discounts + hot_score
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

export default async function DealsPage({
  searchParams,
}: {
  searchParams: { genre?: string; max?: string; min_discount?: string; filter?: string; has_lootbox?: string; sort?: string };
}) {
  const hasLootbox = searchParams.has_lootbox === "true";
  const sortMode = searchParams.sort || null;
  const deals = await getDeals({ hasLootbox, sort: sortMode || undefined });
  const activeGenre = searchParams.genre || null;
  const maxPrice = searchParams.max ? Number(searchParams.max) : null;
  const minDiscount = searchParams.min_discount ? Number(searchParams.min_discount) : null;
  const quickFilter = searchParams.filter || null;
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
      {/* ─── Intro Hero ─── */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-10 sm:py-14">
        <div className="container-main">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {hasLootbox ? "Lootbox Game Deals" : sortMode === "trending" ? "Trending Deals" : "The Best Game Deals, All in One Place"}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500 sm:text-lg">
              {hasLootbox
                ? "We compare prices across every major storefront to find you the lowest prices on games with loot box systems. Stop overpaying — see every deal, every store, every discount."
                : "We scan prices across Steam, Epic Games, GOG, Humble Bundle, Fanatical, Green Man Gaming, and dozens more stores so you never overpay for a game again. Every deal is verified, updated every 30 minutes, and compared side-by-side."}
            </p>
          </div>

          {/* Stats row */}
          <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
              <Zap className="h-4 w-4 text-brand-600" />
              <div>
                <p className="text-lg font-bold text-gray-900">{deals.length}</p>
                <p className="text-[11px] text-gray-500">Active deals</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
              <ShoppingBag className="h-4 w-4 text-brand-600" />
              <div>
                <p className="text-lg font-bold text-gray-900">{uniqueStores.size}+</p>
                <p className="text-[11px] text-gray-500">Stores compared</p>
              </div>
            </div>
            {historicLowCount > 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
                <TrendingDown className="h-4 w-4 text-brand-600" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{historicLowCount}</p>
                  <p className="text-[11px] text-gray-500">Historic lows</p>
                </div>
              </div>
            )}
            {bigDiscountCount > 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{bigDiscountCount}</p>
                  <p className="text-[11px] text-gray-500">50%+ off</p>
                </div>
              </div>
            )}
            {under10Count > 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
                <Store className="h-4 w-4 text-success-600" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{under10Count}</p>
                  <p className="text-[11px] text-gray-500">Under $10</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Featured Deals Carousel ─── */}
      <HeroCarousel deals={carouselDeals} />

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
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            All Deals
          </h2>
          <DealsFilter
            deals={deals}
            initialGenre={activeGenre}
            initialMaxPrice={maxPrice}
            initialMinDiscount={minDiscount}
            initialQuickFilter={quickFilter}
          />

          {/* Bottom CTA */}
          <div className="mt-10 rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-white p-6 sm:p-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
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
