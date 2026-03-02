import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * Trim the games database down to ~10,000 quality games.
 *
 * Strategy: Keep games that have ANY of:
 *  - A rating (total_rating from IGDB)
 *  - A Steam App ID (popular enough to be on Steam with cross-ref)
 *  - Genres assigned
 *  - A release date
 *
 * Delete the rest (obscure games with no metadata = not useful).
 *
 * Modes:
 *  ?mode=count  — Just count games, show what would be kept/deleted (default)
 *  ?mode=trim   — Actually delete low-quality games
 *  ?mode=aggressive — Keep only rated games + games with steam_app_id
 *
 * GET /api/cron/trim-games?secret=<CRON_SECRET>&mode=count
 */

export const maxDuration = 300;

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

  const mode = request.nextUrl.searchParams.get("mode") || "count";
  const supabase = createServerClient();

  try {
    // Get total count
    const { count: totalCount } = await supabase
      .from("games")
      .select("id", { count: "exact", head: true });

    // Count games WITH ratings
    const { count: withRating } = await supabase
      .from("games")
      .select("id", { count: "exact", head: true })
      .not("metacritic", "is", null);

    // Count games WITH steam_app_id
    const { count: withSteam } = await supabase
      .from("games")
      .select("id", { count: "exact", head: true })
      .not("steam_app_id", "is", null);

    // Count games WITH release_date
    const { count: withReleaseDate } = await supabase
      .from("games")
      .select("id", { count: "exact", head: true })
      .not("release_date", "is", null);

    // Count games WITH genres (non-empty array)
    const { count: withGenres } = await supabase
      .from("games")
      .select("id", { count: "exact", head: true })
      .not("genres", "eq", "{}");

    // Count games with cover_image
    const { count: withCover } = await supabase
      .from("games")
      .select("id", { count: "exact", head: true })
      .not("cover_image", "is", null);

    const stats = {
      totalCount,
      withRating,
      withSteam,
      withReleaseDate,
      withGenres,
      withCover,
      mode,
      deleted: 0,
      remaining: totalCount,
      errors: [] as string[],
    };

    if (mode === "count") {
      return NextResponse.json({ ok: true, ...stats, action: "dry run — no changes made" });
    }

    if (mode === "trim") {
      // Strategy: Delete games that have NO rating AND NO steam_app_id AND NO release_date
      // These are the most obscure entries with zero useful metadata
      let offset = 0;
      const BATCH = 1000;
      let totalDeleted = 0;

      while (true) {
        // Fetch games with zero quality signals
        const { data: lowQuality, error: fetchErr } = await supabase
          .from("games")
          .select("id")
          .is("metacritic", null)
          .is("steam_app_id", null)
          .is("release_date", null)
          .limit(BATCH);

        if (fetchErr) {
          stats.errors.push(`Fetch: ${fetchErr.message}`);
          break;
        }

        if (!lowQuality?.length) break;

        const ids = lowQuality.map((g) => g.id);

        // Delete related data first
        for (let c = 0; c < ids.length; c += 50) {
          const chunk = ids.slice(c, c + 50);
          await supabase.from("deals").delete().in("game_id", chunk as any);
          await supabase.from("lootbox_content").delete().in("game_id", chunk as any);
          await supabase.from("drop_rates").delete().in("game_id", chunk as any);
          const { error: delErr } = await supabase.from("games").delete().in("id", chunk as any);
          if (delErr) {
            stats.errors.push(`Delete: ${delErr.message}`);
          } else {
            totalDeleted += chunk.length;
          }
        }

        // Safety: don't loop forever
        if (totalDeleted > 100_000) break;
      }

      stats.deleted = totalDeleted;

      // Get new count
      const { count: newCount } = await supabase
        .from("games")
        .select("id", { count: "exact", head: true });
      stats.remaining = newCount;

      return NextResponse.json({ ok: true, ...stats });
    }

    if (mode === "aggressive") {
      // More aggressive: Keep only games that have a rating OR a steam_app_id
      // This should get us closer to 10K quality games
      let totalDeleted = 0;

      while (true) {
        const { data: toRemove, error: fetchErr } = await supabase
          .from("games")
          .select("id")
          .is("metacritic", null)
          .is("steam_app_id", null)
          .limit(1000);

        if (fetchErr) {
          stats.errors.push(`Fetch: ${fetchErr.message}`);
          break;
        }

        if (!toRemove?.length) break;

        const ids = toRemove.map((g) => g.id);

        for (let c = 0; c < ids.length; c += 50) {
          const chunk = ids.slice(c, c + 50);
          await supabase.from("deals").delete().in("game_id", chunk as any);
          await supabase.from("lootbox_content").delete().in("game_id", chunk as any);
          await supabase.from("drop_rates").delete().in("game_id", chunk as any);
          const { error: delErr } = await supabase.from("games").delete().in("id", chunk as any);
          if (delErr) {
            stats.errors.push(`Delete: ${delErr.message}`);
          } else {
            totalDeleted += chunk.length;
          }
        }

        if (totalDeleted > 100_000) break;
      }

      stats.deleted = totalDeleted;

      const { count: newCount } = await supabase
        .from("games")
        .select("id", { count: "exact", head: true });
      stats.remaining = newCount;

      return NextResponse.json({ ok: true, ...stats });
    }

    return NextResponse.json({ error: "Invalid mode. Use: count, trim, or aggressive" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
