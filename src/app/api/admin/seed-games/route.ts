import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { searchGames } from "@/lib/itad";

/**
 * Admin endpoint: Seed initial games into the database.
 * Searches ITAD for each game title to get the ITAD UUID,
 * then inserts the game into Supabase with the mapping.
 *
 * Auth: requires CRON_SECRET (same auth as cron jobs).
 * Usage: GET /api/admin/seed-games?secret=YOUR_CRON_SECRET
 */

// Popular games to seed — covers our mock data + popular titles
const SEED_GAMES = [
  { title: "Elden Ring", slug: "elden-ring", platforms: ["PC", "PS5", "Xbox Series X"], genres: ["RPG", "Action", "Open World"], release_date: "2022-02-25", metacritic: 96 },
  { title: "Cyberpunk 2077", slug: "cyberpunk-2077", platforms: ["PC", "PS5", "Xbox Series X"], genres: ["RPG", "Open World"], release_date: "2020-12-10", metacritic: 86 },
  { title: "Baldur's Gate 3", slug: "baldurs-gate-3", platforms: ["PC", "PS5", "Mac"], genres: ["RPG", "Strategy"], release_date: "2023-08-03", metacritic: 96, lootboxes_score: 9.2 },
  { title: "Hades II", slug: "hades-ii", platforms: ["PC"], genres: ["Roguelike", "Action"], release_date: "2024-05-06", metacritic: null },
  { title: "Hogwarts Legacy", slug: "hogwarts-legacy", platforms: ["PC", "PS5", "Xbox Series X", "Switch"], genres: ["RPG", "Action"], release_date: "2023-02-10", metacritic: 84 },
  { title: "God of War Ragnarök", slug: "god-of-war-ragnarok", platforms: ["PC", "PS5"], genres: ["Action", "Adventure"], release_date: "2022-11-09", metacritic: 94 },
  { title: "Starfield", slug: "starfield", platforms: ["PC", "Xbox Series X"], genres: ["RPG", "Open World"], release_date: "2023-09-06", metacritic: 83 },
  { title: "Red Dead Redemption 2", slug: "red-dead-redemption-2", platforms: ["PC", "PS4", "Xbox One"], genres: ["Action", "Open World"], release_date: "2018-10-26", metacritic: 97 },
  { title: "Monster Hunter Wilds", slug: "monster-hunter-wilds", platforms: ["PC", "PS5", "Xbox Series X"], genres: ["Action", "RPG"], release_date: "2025-02-28", metacritic: null },
  { title: "Lies of P", slug: "lies-of-p", platforms: ["PC", "PS5", "Xbox Series X"], genres: ["RPG", "Action"], release_date: "2023-09-19", metacritic: 80 },
  { title: "Dark Souls III", slug: "dark-souls-iii", platforms: ["PC", "PS4", "Xbox One"], genres: ["RPG", "Action"], release_date: "2016-04-12", metacritic: 89 },
  { title: "Counter-Strike 2", slug: "counter-strike-2", platforms: ["PC"], genres: ["FPS", "Competitive"], release_date: "2023-09-27", metacritic: 83, lootboxes_score: 3.8 },
  { title: "Diablo IV", slug: "diablo-iv", platforms: ["PC", "PS5", "Xbox Series X"], genres: ["RPG", "Action"], release_date: "2023-06-06", metacritic: 86, lootboxes_score: 5.2 },
  { title: "Overwatch 2", slug: "overwatch-2", platforms: ["PC", "PS5", "Xbox Series X", "Switch"], genres: ["FPS", "Competitive"], release_date: "2022-10-04", metacritic: 79, lootboxes_score: 4.0 },
  { title: "Genshin Impact", slug: "genshin-impact", platforms: ["PC", "PS5", "Mobile"], genres: ["Action RPG", "Gacha"], release_date: "2020-09-28", metacritic: 84, lootboxes_score: 3.2 },
  { title: "FIFA 25", slug: "fifa-25", platforms: ["PC", "PS5", "Xbox Series X"], genres: ["Sports"], release_date: "2024-09-27", metacritic: 72, lootboxes_score: 2.1 },
  { title: "Fortnite", slug: "fortnite", platforms: ["PC", "PS5", "Xbox", "Switch", "Mobile"], genres: ["Battle Royale"], release_date: "2017-07-21", metacritic: null, lootboxes_score: 7.2 },
  { title: "Valorant", slug: "valorant", platforms: ["PC"], genres: ["FPS", "Competitive"], release_date: "2020-06-02", metacritic: 80, lootboxes_score: 5.5 },
  { title: "Sekiro: Shadows Die Twice", slug: "sekiro", platforms: ["PC", "PS4", "Xbox One"], genres: ["Action", "Adventure"], release_date: "2019-03-22", metacritic: 90 },
  { title: "The Witcher 3: Wild Hunt", slug: "the-witcher-3", platforms: ["PC", "PS5", "Xbox Series X", "Switch"], genres: ["RPG", "Open World"], release_date: "2015-05-19", metacritic: 93 },
  { title: "Hollow Knight", slug: "hollow-knight", platforms: ["PC", "PS4", "Xbox One", "Switch"], genres: ["Metroidvania", "Action"], release_date: "2017-02-24", metacritic: 87 },
  { title: "Stardew Valley", slug: "stardew-valley", platforms: ["PC", "PS4", "Xbox One", "Switch", "Mobile"], genres: ["Simulation", "RPG"], release_date: "2016-02-26", metacritic: 89 },
  { title: "Doom Eternal", slug: "doom-eternal", platforms: ["PC", "PS4", "Xbox One", "Switch"], genres: ["FPS", "Action"], release_date: "2020-03-20", metacritic: 88 },
  { title: "Resident Evil 4", slug: "resident-evil-4-remake", platforms: ["PC", "PS5", "Xbox Series X"], genres: ["Horror", "Action"], release_date: "2023-03-24", metacritic: 93 },
  { title: "Palworld", slug: "palworld", platforms: ["PC", "Xbox Series X"], genres: ["Survival", "Open World"], release_date: "2024-01-19", metacritic: null },
];

export async function GET(request: NextRequest) {
  try {
  // Auth check via query param or header
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
  const results: { title: string; status: string; itad_id?: string }[] = [];

  for (const game of SEED_GAMES) {
    try {
      // Check if game already exists
      const { data: existing } = await supabase
        .from("games")
        .select("id, itad_id")
        .eq("slug", game.slug)
        .single();

      if (existing) {
        // If it exists but has no ITAD ID, try to find one
        if (!existing.itad_id) {
          try {
            const itadResults = await searchGames(game.title, 1);
            if (itadResults?.length > 0) {
              const itadId = itadResults[0].id;
              await supabase
                .from("games")
                .update({ itad_id: itadId })
                .eq("id", existing.id);
              results.push({ title: game.title, status: "updated_itad_id", itad_id: itadId });
            } else {
              results.push({ title: game.title, status: "exists_no_itad_match" });
            }
          } catch {
            results.push({ title: game.title, status: "exists_itad_search_failed" });
          }
        } else {
          results.push({ title: game.title, status: "already_exists", itad_id: existing.itad_id });
        }
        continue;
      }

      // Search ITAD for the game ID
      let itadId: string | null = null;
      try {
        const itadResults = await searchGames(game.title, 1);
        if (itadResults?.length > 0) {
          itadId = itadResults[0].id;
        }
      } catch (err: any) {
        // ITAD search failed — still insert the game without ITAD ID
        results.push({ title: game.title, status: `itad_search_error: ${err.message}` });
      }

      // Insert game into Supabase
      const { error: insertErr } = await supabase.from("games").insert({
        title: game.title,
        slug: game.slug,
        platforms: game.platforms,
        genres: game.genres,
        release_date: game.release_date,
        metacritic: game.metacritic || null,
        lootboxes_score: (game as any).lootboxes_score || null,
        itad_id: itadId,
      });

      if (insertErr) {
        results.push({ title: game.title, status: `insert_error: ${insertErr.message}` });
      } else {
        results.push({ title: game.title, status: "seeded", itad_id: itadId || undefined });
      }

      // Small delay to be polite to ITAD
      await new Promise((r) => setTimeout(r, 300));
    } catch (err: any) {
      results.push({ title: game.title, status: `error: ${err.message}` });
    }
  }

  const seeded = results.filter((r) => r.status === "seeded").length;
  const updated = results.filter((r) => r.status === "updated_itad_id").length;
  const existing = results.filter((r) => r.status === "already_exists").length;

  return NextResponse.json({
    ok: true,
    summary: { seeded, updated, existing, total: SEED_GAMES.length },
    results,
  });
  } catch (err: any) {
    console.error("[admin/seed-games] Unhandled error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
