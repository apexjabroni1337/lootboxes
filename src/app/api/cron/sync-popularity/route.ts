import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * Cron endpoint: Sync game popularity data from SteamSpy + Steam Charts
 *
 * Strategy:
 * 1. Fetch SteamSpy top100in2weeks (most-played games recently)
 * 2. Fetch SteamSpy top100forever (all-time popular games)
 * 3. Match Steam App IDs to our games DB
 * 4. Update hot_score with a popularity-weighted formula
 *
 * This ensures our "Trending" and "Browse All Games" pages show
 * genuinely popular titles — not just obscure games with big discounts.
 *
 * Runs every 12 hours via Vercel Cron.
 * SteamSpy rate limit: 1 request per second.
 */

export const maxDuration = 60;

interface SteamSpyGame {
  appid: number;
  name: string;
  developer: string;
  publisher: string;
  score_rank: string;
  owners: string;
  average_forever: number;
  average_2weeks: number;
  median_forever: number;
  median_2weeks: number;
  ccu: number;
  price: string;
}

type SteamSpyResponse = Record<string, SteamSpyGame>;

async function fetchSteamSpy(endpoint: string): Promise<SteamSpyResponse | null> {
  try {
    const res = await fetch(`https://steamspy.com/api.php?request=${endpoint}`, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  if (secret !== cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  const stats = {
    top100RecentFetched: 0,
    top100ForeverFetched: 0,
    gamesMatched: 0,
    gamesUpdated: 0,
    errors: [] as string[],
  };

  try {
    // ── Step 1: Fetch popularity data from SteamSpy ──
    const [recentData, foreverData] = await Promise.all([
      fetchSteamSpy("top100in2weeks"),
      // Small delay then fetch all-time
      new Promise<SteamSpyResponse | null>((resolve) =>
        setTimeout(async () => resolve(await fetchSteamSpy("top100forever")), 1200)
      ),
    ]);

    if (!recentData && !foreverData) {
      return NextResponse.json({
        ok: false,
        error: "Failed to fetch any data from SteamSpy",
        ...stats,
      }, { status: 502 });
    }

    // Build a popularity map: steam_app_id → { rank, ccu, players_2weeks_rank, alltime_rank }
    const popularityMap = new Map<number, {
      recentRank: number | null;  // 1 = most popular recently
      foreverRank: number | null; // 1 = most popular all-time
      ccu: number;
      average2weeks: number;
      name: string;
    }>();

    // Process top 100 by recent players (most important signal)
    if (recentData) {
      const entries = Object.values(recentData);
      // Sort by average_2weeks descending to get proper ranking
      entries.sort((a, b) => (b.average_2weeks || 0) - (a.average_2weeks || 0));
      stats.top100RecentFetched = entries.length;

      entries.forEach((game, index) => {
        popularityMap.set(game.appid, {
          recentRank: index + 1,
          foreverRank: null,
          ccu: game.ccu || 0,
          average2weeks: game.average_2weeks || 0,
          name: game.name,
        });
      });
    }

    // Process top 100 all-time (secondary signal)
    if (foreverData) {
      const entries = Object.values(foreverData);
      entries.sort((a, b) => (b.average_forever || 0) - (a.average_forever || 0));
      stats.top100ForeverFetched = entries.length;

      entries.forEach((game, index) => {
        const existing = popularityMap.get(game.appid);
        if (existing) {
          existing.foreverRank = index + 1;
        } else {
          popularityMap.set(game.appid, {
            recentRank: null,
            foreverRank: index + 1,
            ccu: game.ccu || 0,
            average2weeks: game.average_2weeks || 0,
            name: game.name,
          });
        }
      });
    }

    // ── Step 2: Match to our games DB by steam_app_id ──
    const steamAppIds = Array.from(popularityMap.keys());

    // Fetch all our games that have steam_app_ids matching popular games
    const { data: matchedGames, error: matchErr } = await supabase
      .from("games")
      .select("id, steam_app_id, metacritic, hot_score")
      .in("steam_app_id", steamAppIds.map(String));

    if (matchErr) {
      stats.errors.push(`Match query error: ${matchErr.message}`);
    }

    // Also try numeric match (steam_app_id might be stored as number)
    const { data: matchedGamesNum, error: matchErr2 } = await supabase
      .from("games")
      .select("id, steam_app_id, metacritic, hot_score")
      .in("steam_app_id", steamAppIds);

    if (matchErr2) {
      stats.errors.push(`Numeric match query error: ${matchErr2.message}`);
    }

    // Merge both result sets (dedupe by id)
    const allMatched = new Map<string, { id: string; steam_app_id: any; metacritic: number | null; hot_score: number | null }>();
    for (const game of [...(matchedGames || []), ...(matchedGamesNum || [])]) {
      allMatched.set(game.id, game);
    }

    stats.gamesMatched = allMatched.size;

    // ── Step 3: Compute new hot_score with popularity weighting ──
    // Also get deal data for these games to combine both signals
    const gameIds = Array.from(allMatched.values()).map((g) => g.id);

    let dealStats = new Map<string, { maxDiscount: number; hasHistoricLow: boolean; dealCount: number }>();
    if (gameIds.length > 0) {
      const { data: deals } = await supabase
        .from("deals")
        .select("game_id, discount_pct, is_historic_low")
        .in("game_id", gameIds);

      for (const deal of deals || []) {
        const existing = dealStats.get(deal.game_id);
        if (!existing) {
          dealStats.set(deal.game_id, {
            maxDiscount: deal.discount_pct || 0,
            hasHistoricLow: deal.is_historic_low || false,
            dealCount: 1,
          });
        } else {
          existing.dealCount++;
          if ((deal.discount_pct || 0) > existing.maxDiscount) {
            existing.maxDiscount = deal.discount_pct || 0;
          }
          if (deal.is_historic_low) existing.hasHistoricLow = true;
        }
      }
    }

    // ── Step 4: Update hot_score for popular games ──
    //
    // New formula:
    //   popularity_bonus: 0-200 (rank 1 = 200, rank 100 = 2)
    //   deal_bonus:       0-50  (max discount + historic low flag)
    //   quality_bonus:    0-20  (metacritic / 5)
    //
    // This ensures genuinely popular games always rank above obscure
    // games with big discounts. A top-10 Steam game with no deals
    // (score ~190) outranks an unknown game with 90% off (score ~90).

    const updates: { id: string; hot_score: number }[] = [];

    for (const game of Array.from(allMatched.values())) {
      const appId = parseInt(String(game.steam_app_id), 10);
      const pop = popularityMap.get(appId);
      if (!pop) continue;

      // Popularity bonus (0-200): heavily weights recent players
      let popularityBonus = 0;
      if (pop.recentRank) {
        // Recent rank: 1→200, 50→102, 100→2
        popularityBonus = Math.max(popularityBonus, (101 - pop.recentRank) * 2);
      }
      if (pop.foreverRank) {
        // All-time rank gives smaller bonus (0-100)
        const foreverBonus = (101 - pop.foreverRank);
        popularityBonus = Math.max(popularityBonus, foreverBonus);
      }

      // CCU bonus: extra points for games with very high concurrent users
      const ccuBonus = pop.ccu > 100000 ? 30 : pop.ccu > 50000 ? 20 : pop.ccu > 10000 ? 10 : pop.ccu > 1000 ? 5 : 0;

      // Deal bonus (0-50)
      const ds = dealStats.get(game.id);
      const dealBonus = ds
        ? Math.min(ds.maxDiscount * 0.4, 40) + (ds.hasHistoricLow ? 10 : 0)
        : 0;

      // Quality bonus (0-20)
      const qualityBonus = (game.metacritic || 0) / 5;

      const hotScore = popularityBonus + ccuBonus + dealBonus + qualityBonus;

      updates.push({
        id: game.id,
        hot_score: Math.round(hotScore * 10) / 10,
      });
    }

    // Batch update in chunks
    const CHUNK_SIZE = 50;
    for (let i = 0; i < updates.length; i += CHUNK_SIZE) {
      const chunk = updates.slice(i, i + CHUNK_SIZE);
      for (const update of chunk) {
        const { error } = await supabase
          .from("games")
          .update({ hot_score: update.hot_score })
          .eq("id", update.id);

        if (error) {
          stats.errors.push(`Update ${update.id}: ${error.message}`);
        } else {
          stats.gamesUpdated++;
        }
      }
    }

    // ── Step 5: Auto-import popular games missing from our DB ──
    // If a top Steam game isn't in our database, create it so it shows up
    // on our trending/browse pages. Uses Steam Store API for metadata.
    const matchedAppIds = new Set(
      Array.from(allMatched.values()).map((g) => parseInt(String(g.steam_app_id), 10))
    );
    const unmatchedPopular: string[] = [];
    const imported: string[] = [];

    for (const [appId, pop] of Array.from(popularityMap.entries())) {
      if (matchedAppIds.has(appId)) continue;
      if (!pop.recentRank || pop.recentRank > 50) continue; // Only auto-import top 50

      unmatchedPopular.push(`#${pop.recentRank}: ${pop.name} (appid: ${appId})`);

      // Try to import from Steam Store API
      try {
        const steamRes = await fetch(
          `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us`,
          { signal: AbortSignal.timeout(10000) }
        );
        if (!steamRes.ok) continue;
        const steamData = await steamRes.json();
        const appData = steamData?.[String(appId)]?.data;
        if (!appData || appData.type !== "game") continue;

        const slug = appData.name
          .toLowerCase()
          .replace(/['']/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 80);

        const genres = (appData.genres || []).map((g: any) => g.description).slice(0, 5);
        const platforms: string[] = [];
        if (appData.platforms?.windows) platforms.push("PC");
        if (appData.platforms?.mac) platforms.push("Mac");
        if (appData.platforms?.linux) platforms.push("Linux");

        const coverImage = appData.header_image || null;
        const screenshotImage = appData.screenshots?.[0]?.path_full || null;
        const metacritic = appData.metacritic?.score || null;
        const releaseDate = appData.release_date?.date || null;

        // Compute popularity hot_score for the new game
        let popularityBonus = pop.recentRank ? (101 - pop.recentRank) * 2 : 0;
        const ccuBonus = pop.ccu > 100000 ? 30 : pop.ccu > 50000 ? 20 : pop.ccu > 10000 ? 10 : pop.ccu > 1000 ? 5 : 0;
        const qualityBonus = (metacritic || 0) / 5;
        const hotScore = Math.round((popularityBonus + ccuBonus + qualityBonus) * 10) / 10;

        const { error: insertErr } = await supabase
          .from("games")
          .upsert({
            title: appData.name,
            slug,
            steam_app_id: String(appId),
            cover_image: coverImage,
            screenshot_image: screenshotImage,
            genres,
            platforms,
            metacritic,
            release_date: releaseDate,
            hot_score: hotScore,
            description: (appData.short_description || "").slice(0, 500),
          }, { onConflict: "slug", ignoreDuplicates: true });

        if (!insertErr) {
          imported.push(`${appData.name} (appid: ${appId})`);
        }

        // Respect Steam rate limits
        await new Promise((r) => setTimeout(r, 300));
      } catch {
        // Skip failed imports silently
      }
    }

    return NextResponse.json({
      ok: true,
      ...stats,
      unmatchedTop50: unmatchedPopular,
      autoImported: imported,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message, ...stats },
      { status: 500 }
    );
  }
}
