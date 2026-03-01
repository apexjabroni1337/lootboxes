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

export const metadata = {
  title: "Best Gaming Deals Today — Compare Prices Across Every Store",
  description:
    "Find the cheapest prices on PC and console games. Compare deals across Steam, Epic, GOG, Humble Bundle, and more. Updated every 30 minutes.",
  openGraph: {
    title: "Best Gaming Deals Today — Compare Prices Across Every Store",
    description:
      "Find the cheapest prices on PC and console games. Compare deals across Steam, Epic, GOG, Humble Bundle, and more.",
    url: "https://lootboxes.com/deals",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Gaming Deals Today",
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

  // Deduplicate: keep only the cheapest deal per game
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
  const bigDiscountCount = deals.filter((d: any) => d.discount_pct >= 50).length;
  const uniqueStores = new Set(deals.map((d: any) => d.store));
  const under10Count = deals.filter((d: any) => d.price <= 10).length;

  return (
    <div className="pb-12">
      {/* Hero section */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-brand-50 via-white to-gray-50 py-10 sm:py-14">
        <div className="container-main">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700">
              <Sparkles className="h-3 w-3" />
              Updated every 30 minutes
            </div>
          </div>

          <h1 className="mt-4 text-4xl font-bold text-gray-900">
            Gaming Deals
          </h1>
          <p className="mt-2 max-w-xl text-gray-500">
            Compare prices across {uniqueStores.size} stores to find the absolute
            cheapest deals on PC and console games.
          </p>

          {/* Stats row */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
              <Zap className="h-4 w-4 text-brand-600" />
              <div>
                <p className="text-lg font-bold text-gray-900">{deals.length}</p>
                <p className="text-[11px] text-gray-500">Active deals</p>
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

      {/* Tabbed deals section */}
      <div className="container-main mt-8">
        <DealsFilter deals={deals} />

        {/* Bottom CTA */}
        <div className="mt-10 rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-white p-6 sm:p-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Never miss a deal</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get the best deals delivered to your inbox every week. No spam, ever.
              </p>
            </div>
            <Link href="/newsletter" className="btn-primary flex-shrink-0">
              Get Deal Alerts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
