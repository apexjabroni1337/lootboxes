import { NextRequest, NextResponse } from "next/server";
import {
  getMultiMarketPrices,
  searchMultiMarket,
  getBestDeals,
  getMostTraded,
  type MultiMarketPrice,
} from "@/lib/steamwebapi";

export const dynamic = "force-dynamic";

/**
 * GET /api/cs2/multi-prices
 *
 * Multi-marketplace CS2 skin prices powered by SteamWebAPI.
 *
 * Query params:
 *   q        — search query (skin name)
 *   limit    — max results (default 100, max 500)
 *   sort     — "expensive" | "cheapest" | "savings" | "volume" | "name"
 *   wear     — filter by condition
 *   mode     — "deals" (best savings) | "trending" (most traded) | default
 *   minPrice — minimum price filter (USD)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("q") || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "100", 10), 500);
    const sort = searchParams.get("sort") || "expensive";
    const wear = searchParams.get("wear") || "";
    const mode = searchParams.get("mode") || "";
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");

    let items: MultiMarketPrice[];

    // Mode-based fetching
    if (mode === "deals") {
      items = await getBestDeals(limit);
    } else if (mode === "trending") {
      items = await getMostTraded(limit);
    } else if (query) {
      items = await searchMultiMarket(query, limit);
    } else {
      items = await getMultiMarketPrices();
    }

    // Filter by wear
    if (wear) {
      items = items.filter(
        (i) => i.wear.toLowerCase() === wear.toLowerCase()
      );
    }

    // Filter by min price
    if (minPrice > 0) {
      items = items.filter((i) => (i.lowestPrice ?? 0) >= minPrice);
    }

    // Sort
    switch (sort) {
      case "cheapest":
        items.sort((a, b) => (a.lowestPrice ?? 0) - (b.lowestPrice ?? 0));
        break;
      case "savings":
        items.sort(
          (a, b) =>
            (b.bestSavingsVsSteam ?? 0) - (a.bestSavingsVsSteam ?? 0)
        );
        break;
      case "volume":
        items.sort((a, b) => b.sold24h - a.sold24h);
        break;
      case "name":
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "expensive":
      default:
        items.sort(
          (a, b) => (b.lowestPrice ?? 0) - (a.lowestPrice ?? 0)
        );
    }

    const total = items.length;
    items = items.slice(0, limit);

    return NextResponse.json(
      { items, total, source: "steamwebapi" },
      {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("[MultiPrices API] Error:", error);
    return NextResponse.json(
      {
        items: [],
        total: 0,
        error: "Failed to fetch multi-market prices",
        source: "steamwebapi",
      },
      { status: 500 }
    );
  }
}
