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
import { filterPromotableDeals } from "@/lib/game-quality";
import DealsHubClient from "./DealsHubClient";

export const metadata = {
  title: "Game Deals — Compare Prices Across Every Store | LootBoxes",
  description:
    "Find the cheapest prices on PC and console games. Compare deals across Steam, Epic, GOG, Humble Bundle, and more. Updated every 30 minutes.",
  openGraph: {
    title: "Game Deals — Compare Prices Across Every Store",
    description:
      "Find the cheapest prices on PC and console games. Compare deals across Steam, Epic, GOG, Humble Bundle, and more.",
    url: "https://lootboxes.com/deals",
    type: "website",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Game Deals — Best Gaming Deals Today",
    description:
      "Compare prices across 15+ stores. Find the cheapest PC & console game deals. Updated every 30 minutes.",
  },
  alternates: {
    canonical: "https://lootboxes.com/deals",
  },
};

export const revalidate = 300;

const DEAL_SELECT = `
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
    metacritic,
    release_date,
    platforms
  )
`;

/**
 * Extract a "base title" from a game name to group DLC / edition variants.
 * "Pals Go Only Up - Knight Character"  → "pals go only up"
 * "My Sudoku - Classic 6x6 Medium 5"    → "my sudoku"
 * "XEL Save the World Edition"          → "xel save the world"
 * "Elden Ring"                           → "elden ring"
 */
function getBaseTitle(title: string): string {
  let base = title.toLowerCase().trim();

  // Strip everything after common DLC/edition separators
  // " - " is the most common: "Game - DLC Name"
  const dashIdx = base.indexOf(" - ");
  if (dashIdx > 3) base = base.substring(0, dashIdx);

  // Strip edition suffixes
  base = base
    .replace(/\s+(edition|pack|bundle|collection|dlc|character|upgrade|pass|season|chapter|episode|volume|vol)\b.*$/i, "")
    .replace(/\s+(goty|game\s*of\s*the\s*year|deluxe|gold|premium|ultimate|complete|enhanced|definitive|standard|special)\b.*$/i, "")
    .trim();

  return base;
}

/**
 * Collapse DLC/edition/character-pack variants so only one entry per
 * base game appears in the list. Keeps the deal with the highest
 * discount (or historic low if available).
 */
function deduplicateByBaseTitle(deals: any[]): any[] {
  const byBase = new Map<string, any>();
  for (const deal of deals) {
    const title = deal.games?.title || "";
    const base = getBaseTitle(title);
    const existing = byBase.get(base);
    if (!existing) {
      byBase.set(base, deal);
    } else {
      // Prefer: historic low > higher hot_score > bigger discount
      const existingHL = existing.is_historic_low;
      const newHL = deal.is_historic_low;
      if (newHL && !existingHL) {
        byBase.set(base, deal);
      } else if (!newHL && existingHL) {
        // keep existing
      } else {
        const existingScore = existing.games?.hot_score || 0;
        const newScore = deal.games?.hot_score || 0;
        if (newScore > existingScore) {
          byBase.set(base, deal);
        } else if (newScore === existingScore && (deal.discount_pct || 0) > (existing.discount_pct || 0)) {
          byBase.set(base, deal);
        }
      }
    }
  }
  return Array.from(byBase.values());
}

async function getDeals() {
  const supabase = createServerClient();

  // Fetch top deals by discount AND all historic lows in parallel
  const [discountResult, historicResult] = await Promise.all([
    supabase
      .from("deals")
      .select(DEAL_SELECT)
      .order("discount_pct", { ascending: false })
      .limit(500),
    supabase
      .from("deals")
      .select(DEAL_SELECT)
      .eq("is_historic_low", true)
      .limit(200),
  ]);

  if (discountResult.error) {
    console.error("Deals query error:", discountResult.error.message);
  }
  if (historicResult.error) {
    console.error("Historic lows query error:", historicResult.error.message);
  }

  // Merge both result sets, dedup by deal id
  const seenIds = new Set<string>();
  const allDeals: any[] = [];
  for (const deal of [...(discountResult.data || []), ...(historicResult.data || [])]) {
    if (!seenIds.has(deal.id)) {
      seenIds.add(deal.id);
      allDeals.push(deal);
    }
  }

  if (allDeals.length === 0) return [];

  // Deduplicate: keep best deal per game, preferring historic lows
  const bestByGame = new Map<string, any>();
  for (const deal of allDeals) {
    const gameId = (deal as any).game_id;
    const existing = bestByGame.get(gameId);
    if (!existing) {
      bestByGame.set(gameId, deal);
    } else {
      // Prefer historic low deals; otherwise pick cheapest
      const existingHL = existing.is_historic_low;
      const newHL = deal.is_historic_low;
      if (newHL && !existingHL) {
        bestByGame.set(gameId, deal);
      } else if (!newHL && existingHL) {
        // keep existing historic low
      } else if (deal.price < existing.price) {
        bestByGame.set(gameId, deal);
      }
    }
  }
  const unique = Array.from(bestByGame.values());

  // Filter out junk/NSFW/unpopular games
  const promoted = filterPromotableDeals(unique);

  // Collapse DLC / edition / character-pack variants into one entry per base game.
  // "Pals Go Only Up - Knight Character" and "Pals Go Only Up - Barbarian Character"
  // should only show the best deal, not flood the list.
  // Also collapses "My Sudoku - Classic 6x6 Medium 5" style variants.
  const deduped = deduplicateByBaseTitle(promoted);

  // Sort: images first, then hot_score, then discount
  deduped.sort((a: any, b: any) => {
    const aHasImg = a.games?.cover_image ? 1 : 0;
    const bHasImg = b.games?.cover_image ? 1 : 0;
    if (aHasImg !== bHasImg) return bHasImg - aHasImg;
    const aScore = a.games?.hot_score || 0;
    const bScore = b.games?.hot_score || 0;
    if (aScore !== bScore) return bScore - aScore;
    return (b.discount_pct || 0) - (a.discount_pct || 0);
  });

  return deduped.slice(0, 200);
}

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; filter?: string }>;
}) {
  const sp = await searchParams;
  const deals = await getDeals();
  const initialGenre = sp.genre || null;
  const initialFilter = sp.filter || null;

  // Stats
  const historicLowCount = deals.filter((d: any) => d.is_historic_low).length;
  const bigDiscountCount = deals.filter((d: any) => d.discount_pct >= 50).length;
  const uniqueStores = new Set(deals.map((d: any) => d.store));
  const under10Count = deals.filter((d: any) => d.price <= 10).length;

  return (
    <div className="pb-12">
      {/* ─── Hero ─── */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-8 sm:py-10">
        <div className="container-main">
          <div className="flex flex-col gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-full px-4 py-1.5 mb-4 shadow-sm">
                <Zap className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                  Game Deals
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                The Best Game Deals,
                <br className="hidden md:block" /> All in One Place
              </h1>
              <p className="text-gray-500 mt-2 max-w-xl text-sm">
                Prices compared across {uniqueStores.size}+ stores and updated every 30 minutes. Find the best price for every game — no guesswork needed.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-3">
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
                  <p className="text-[11px] text-gray-500">Stores</p>
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
        </div>
      </section>

      {/* ─── Filterable Deals Grid ─── */}
      <div className="container-main mt-8">
        <DealsHubClient
          deals={deals}
          initialGenre={initialGenre}
          initialFilter={initialFilter}
        />

        {/* Bottom CTA */}
        <div className="mt-10 rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-white p-6 sm:p-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Never miss a deal
              </h3>
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
