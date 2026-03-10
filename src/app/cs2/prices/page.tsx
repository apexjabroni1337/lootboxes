import { getMultiMarketPrices, type MultiMarketPrice } from "@/lib/steamwebapi";
import { getSkinPrices } from "@/lib/pricempire";
import CS2PricesClient from "./CS2PricesClient";

// Revalidate every 10 minutes — keeps prices fresh without blocking page load
export const revalidate = 600;

/**
 * Server component: pre-fetches skin prices at build / revalidation time
 * so users see data instantly instead of waiting 5-10s for external APIs.
 */
export default async function CS2PricesPage() {
  let multiItems: MultiMarketPrice[] = [];
  let fallbackItems: any[] = [];

  try {
    const items = await getMultiMarketPrices();
    // Filter to skins worth ≥$1 and sort by most valuable
    multiItems = items
      .filter((i) => (i.lowestPrice ?? 0) >= 1)
      .sort((a, b) => (b.lowestPrice ?? 0) - (a.lowestPrice ?? 0))
      .slice(0, 500);
  } catch (e) {
    console.warn("[CS2 Prices] Multi-market prefetch failed, trying fallback");
  }

  // If multi-market failed, try Skinport fallback
  if (multiItems.length === 0) {
    try {
      const all = await getSkinPrices();
      fallbackItems = all
        .filter((s) => s.cheapestPrice >= 1)
        .sort((a, b) => b.cheapestPrice - a.cheapestPrice)
        .slice(0, 500);
    } catch {
      console.warn("[CS2 Prices] Fallback prefetch also failed");
    }
  }

  return (
    <CS2PricesClient
      initialMultiItems={multiItems}
      initialFallbackItems={fallbackItems}
      defaultMode="default"
    />
  );
}
