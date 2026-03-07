import { NextRequest, NextResponse } from "next/server";
import { getSkinPrices, searchSkins } from "@/lib/pricempire";

export const dynamic = "force-dynamic";

/**
 * GET /api/cs2/prices
 *
 * Returns CS2 skin prices from PriceEmpire (cached 15min).
 *
 * Query params:
 *   ?q=<search>     — Filter by skin name
 *   ?limit=<number> — Max results (default 100)
 *   ?wear=<wear>    — Filter by wear (Factory New, Minimal Wear, etc.)
 *   ?sort=<key>     — Sort by: cheapest, name, expensive (default: expensive)
 *   ?minPrice=<n>   — Minimum price filter (dollars)
 *
 * Returns { items: SkinPrice[], total: number, cached: boolean }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q") || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 500);
    const wear = searchParams.get("wear") || "";
    const sort = searchParams.get("sort") || "expensive";
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");

    let items = q ? await searchSkins(q, 500) : await getSkinPrices();

    // Filter by wear
    if (wear && wear !== "All") {
      items = items.filter((s) => s.wear === wear);
    }

    // Filter by min price (useful for hiding penny skins)
    if (minPrice > 0) {
      items = items.filter((s) => s.cheapestPrice >= minPrice);
    }

    // Sort
    if (sort === "cheapest") {
      items.sort((a, b) => a.cheapestPrice - b.cheapestPrice);
    } else if (sort === "name") {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: most expensive first (interesting skins first)
      items.sort((a, b) => b.cheapestPrice - a.cheapestPrice);
    }

    const total = items.length;
    items = items.slice(0, limit);

    return NextResponse.json(
      { items, total, cached: true },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        },
      }
    );
  } catch (error) {
    console.error("[API /cs2/prices] Error:", error);
    return NextResponse.json(
      { items: [], total: 0, cached: false, error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
