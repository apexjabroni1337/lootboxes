import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getDeals, getPrices, mapShopId, type ITADDeal } from "@/lib/itad";

/**
 * Cron endpoint: Sync deals from ITAD → Supabase
 *
 * Called by Vercel Cron every 30 minutes (configured in vercel.json).
 * 1. Fetches top deals from ITAD deals feed
 * 2. For each game in our DB that has an itad_id, fetches live prices
 * 3. Upserts deals and snapshots price_history
 *
 * Auth: requires CRON_SECRET header to prevent public access.
 */
export async function GET(request: NextRequest) {
  // Verify cron secret (header or query param)
  const secret = request.nextUrl.searchParams.get("secret");
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (secret !== cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  const stats = { dealsUpserted: 0, priceSnapshots: 0, errors: [] as string[] };

  try {
    // ---- Step 1: Sync live prices for all tracked games ----
    const { data: games, error: gamesErr } = await supabase
      .from("games")
      .select("id, itad_id, slug")
      .not("itad_id", "is", null);

    if (gamesErr) throw new Error(`Supabase games query: ${gamesErr.message}`);

    // Process in batches of 5 (ITAD supports comma-separated IDs)
    const BATCH = 5;
    for (let i = 0; i < (games || []).length; i += BATCH) {
      const batch = games!.slice(i, i + BATCH);
      const itadIds = batch.map((g) => g.itad_id!);

      try {
        const pricesMap = await getPrices(itadIds);

        for (const game of batch) {
          const gamePrices = pricesMap[game.itad_id!];
          if (!gamePrices || !Array.isArray(gamePrices)) continue;

          // Find historic low for flagging
          const sortedPrices = [...gamePrices].sort(
            (a, b) => a.price.amount - b.price.amount
          );

          for (const deal of gamePrices) {
            const storeKey = mapShopId(deal.shop);
            const isHistoricLow = deal.flag === "H";

            // Upsert deal
            const { error: upsertErr } = await supabase.from("deals").upsert(
              {
                game_id: game.id,
                store: storeKey,
                store_url: deal.url,
                price: deal.price.amount,
                original_price: deal.regular.amount,
                discount_pct: deal.cut,
                currency: deal.price.currency,
                is_historic_low: isHistoricLow,
                affiliate_url: deal.url, // Will be replaced with our affiliate links
                expires_at: deal.expiry || null,
                scraped_at: new Date().toISOString(),
              },
              {
                onConflict: "game_id,store,price",
                ignoreDuplicates: false,
              }
            );

            if (upsertErr) {
              stats.errors.push(`Deal upsert ${game.slug}/${storeKey}: ${upsertErr.message}`);
            } else {
              stats.dealsUpserted++;
            }
          }

          // Snapshot best price per store for price_history
          const storesSeen = new Set<string>();
          for (const deal of sortedPrices) {
            const storeKey = mapShopId(deal.shop);
            if (storesSeen.has(storeKey)) continue;
            storesSeen.add(storeKey);

            const { error: histErr } = await supabase
              .from("price_history")
              .insert({
                game_id: game.id,
                store: storeKey,
                price: deal.price.amount,
                currency: deal.price.currency,
              });

            if (!histErr) stats.priceSnapshots++;
          }
        }
      } catch (batchErr: any) {
        stats.errors.push(`Batch ${i}: ${batchErr.message}`);
      }

      // Small delay between batches to be polite to ITAD API
      if (i + BATCH < (games || []).length) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    // ---- Step 2: Clean up expired deals ----
    const { error: cleanErr } = await supabase
      .from("deals")
      .delete()
      .lt("expires_at", new Date().toISOString())
      .not("expires_at", "is", null);

    if (cleanErr) stats.errors.push(`Cleanup: ${cleanErr.message}`);

    // ---- Step 3: Compute hot_score for all tracked games ----
    try {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

      for (const game of games || []) {
        try {
          // Get best deal stats for this game
          const { data: gameDeals } = await supabase
            .from("deals")
            .select("discount_pct, is_historic_low, scraped_at")
            .eq("game_id", game.id);

          if (!gameDeals?.length) continue;

          const maxDiscount = Math.max(...gameDeals.map((d) => d.discount_pct || 0));
          const hasHistoricLow = gameDeals.some((d) => d.is_historic_low);
          const isRecent = gameDeals.some((d) => d.scraped_at > dayAgo);

          // Count clicks in last 7 days
          const { count: clickCount } = await supabase
            .from("clicks")
            .select("id", { count: "exact", head: true })
            .in(
              "deal_id",
              gameDeals.map((d: any) => d.id).filter(Boolean)
            );

          // Get metacritic from games table
          const { data: gameInfo } = await supabase
            .from("games")
            .select("metacritic")
            .eq("id", game.id)
            .single();

          // Compute hot_score
          const hotScore =
            maxDiscount +
            (hasHistoricLow ? 15 : 0) +
            (isRecent ? 10 : 0) +
            ((clickCount || 0) * 0.5) +
            ((gameInfo?.metacritic || 0) / 10);

          await supabase
            .from("games")
            .update({ hot_score: Math.round(hotScore * 10) / 10 })
            .eq("id", game.id);
        } catch {
          // Skip individual game score errors silently
        }
      }
    } catch (scoreErr: any) {
      stats.errors.push(`Hot score computation: ${scoreErr.message}`);
    }

    return NextResponse.json({
      ok: true,
      ...stats,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message, ...stats },
      { status: 500 }
    );
  }
}
