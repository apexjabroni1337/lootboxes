import { NextRequest, NextResponse } from "next/server";
import { getSkinPrices, SkinPrice } from "@/lib/pricempire";

/**
 * GET /api/cs2/skin-lookup
 *
 * Look up prices for specific skins by weapon + skin name.
 * Returns the cheapest price found across all wear conditions.
 *
 * Query params:
 *   ?names=AK-47|Asiimov,M4A1-S|Printstream,...
 *
 * Returns { results: Record<string, { minPrice: number, maxPrice: number, avgPrice: number, prices: SkinPrice[] }> }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const namesParam = searchParams.get("names") || "";

    if (!namesParam) {
      return NextResponse.json({ results: {} });
    }

    const lookups = namesParam.split(",").map((n) => {
      const parts = n.trim().split("|");
      return { weapon: parts[0]?.trim() || "", skin: parts[1]?.trim() || "" };
    });

    const allPrices = await getSkinPrices();

    const results: Record<
      string,
      {
        minPrice: number;
        maxPrice: number;
        avgPrice: number;
        wears: { wear: string; cheapestPrice: number; prices: SkinPrice["prices"] }[];
      }
    > = {};

    for (const lookup of lookups) {
      const key = `${lookup.weapon}|${lookup.skin}`;
      const matches = allPrices.filter(
        (s) =>
          s.weapon.toLowerCase() === lookup.weapon.toLowerCase() &&
          s.skin.toLowerCase() === lookup.skin.toLowerCase()
      );

      if (matches.length > 0) {
        const prices = matches.map((m) => m.cheapestPrice).filter((p) => p > 0);
        results[key] = {
          minPrice: Math.min(...prices),
          maxPrice: Math.max(...prices),
          avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
          wears: matches.map((m) => ({
            wear: m.wear,
            cheapestPrice: m.cheapestPrice,
            prices: m.prices,
          })),
        };
      }
    }

    return NextResponse.json(
      { results },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        },
      }
    );
  } catch (error) {
    console.error("[API /cs2/skin-lookup] Error:", error);
    return NextResponse.json({ results: {} }, { status: 500 });
  }
}
