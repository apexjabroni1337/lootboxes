import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import {
  bulkFetchGames,
  igdbImageUrl,
  extractSteamAppId,
  type IGDBBulkGame,
} from "@/lib/igdb";

/**
 * Bulk import games from IGDB.
 *
 * Fetches 500 games per call with full metadata: covers, screenshots,
 * genres, platforms, release dates, ratings, and Steam App IDs.
 *
 * Designed to be called in a loop from PowerShell:
 *   for ($i=0; $i -lt 9000; $i+=500) {
 *     Invoke-RestMethod ".../import-igdb?secret=...&offset=$i"
 *   }
 *
 * GET /api/cron/import-igdb?secret=<CRON_SECRET>&offset=0&limit=500
 */

export const maxDuration = 300;

/* ── Platform mapping: IGDB abbreviation → our format ── */

const PLATFORM_MAP: Record<string, string> = {
  PC: "PC",
  PS4: "PS4",
  PS5: "PS5",
  XONE: "Xbox One",
  "Series X|S": "Xbox Series X|S",
  Switch: "Switch",
  Linux: "Linux",
  Mac: "Mac",
  PS3: "PS3",
  X360: "Xbox 360",
  "Stadia": "Stadia",
  WiiU: "Wii U",
  Wii: "Wii",
  VITA: "PS Vita",
  "3DS": "3DS",
  PS2: "PS2",
  PS1: "PS1",
  DC: "Dreamcast",
  N64: "N64",
  Android: "Android",
  iOS: "iOS",
};

/* ── Genre mapping: IGDB → our standardized format ── */

const GENRE_MAP: Record<string, string> = {
  "Role-playing (RPG)": "RPG",
  Shooter: "Shooter",
  Adventure: "Adventure",
  "Platform": "Platformer",
  "Puzzle": "Puzzle",
  "Racing": "Racing",
  "Real Time Strategy (RTS)": "Strategy",
  Strategy: "Strategy",
  "Turn-based strategy (TBS)": "Strategy",
  "Tactical": "Strategy",
  "Sport": "Sports",
  Simulator: "Simulation",
  "Fighting": "Fighting",
  "Hack and slash/Beat 'em up": "Action",
  "Music": "Music",
  "Indie": "Indie",
  "Arcade": "Arcade",
  "Card & Board Game": "Card Game",
  "MOBA": "MOBA",
  "Point-and-click": "Adventure",
  "Visual Novel": "Visual Novel",
  "Quiz/Trivia": "Puzzle",
  "Pinball": "Arcade",
};

/* ── Junk title filter (reuse patterns from cleanup) ── */

const JUNK_RE =
  /\b(soundtrack|ost|artbook|wallpaper|skin pack|voice pack|commentary|making of|digital art|music pack|demo|trial|beta|playtest|prologue|season\s*pass|add[\s-]?on)\b/i;

const SPAM_RE =
  /\b(hentai|sexy|waifu|anime girl|dating sim|erotic|adult only|nudity puzzle|strip poker)\b/i;

function shouldSkip(title: string): boolean {
  if (JUNK_RE.test(title)) return true;
  if (SPAM_RE.test(title)) return true;
  // Skip titles that are just numbers or very short
  if (title.length < 3) return true;
  return false;
}

/* ── Slug generator ── */

function makeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/* ── Extract data from IGDB game ── */

function mapPlatforms(platforms?: { abbreviation: string; name: string }[]): string[] {
  if (!platforms?.length) return ["PC"];
  const set = new Set<string>();
  for (const p of platforms) {
    const mapped = PLATFORM_MAP[p.abbreviation] || PLATFORM_MAP[p.name] || p.name;
    set.add(mapped);
  }
  return Array.from(set);
}

function mapGenres(genres?: { name: string }[]): string[] {
  if (!genres?.length) return [];
  const set = new Set<string>();
  for (const g of genres) {
    const mapped = GENRE_MAP[g.name] || g.name;
    set.add(mapped);
  }
  return Array.from(set);
}

function formatDate(unixTimestamp?: number): string | null {
  if (!unixTimestamp) return null;
  const d = new Date(unixTimestamp * 1000);
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
}

function buildGameRow(game: IGDBBulkGame) {
  const slug = makeSlug(game.name);
  const coverImage = game.cover?.image_id
    ? igdbImageUrl(game.cover.image_id, "cover_big")
    : null;
  const screenshotImage = game.screenshots?.[0]?.image_id
    ? igdbImageUrl(game.screenshots[0].image_id, "screenshot_big")
    : null;
  const steamAppId = extractSteamAppId(game.external_games);

  return {
    title: game.name,
    slug,
    cover_image: coverImage,
    screenshot_image: screenshotImage,
    platforms: mapPlatforms(game.platforms),
    genres: mapGenres(game.genres),
    release_date: formatDate(game.first_release_date),
    metacritic: game.total_rating ? Math.round(game.total_rating) : null,
    steam_app_id: steamAppId,
  };
}

/* ── Main handler ── */

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

  // Debug mode: test IGDB connection with a simple query
  const testMode = request.nextUrl.searchParams.get("test") === "true";
  if (testMode) {
    try {
      const { getTwitchToken } = await import("@/lib/igdb");
      const token = await getTwitchToken();
      const clientId = process.env.TWITCH_CLIENT_ID!;

      // Test 1: Simplest possible query
      const res1 = await fetch("https://api.igdb.com/v4/games", {
        method: "POST",
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain",
        },
        body: `fields name; limit 3;`,
      });
      const text1 = await res1.text();

      // Test 2: With platform filter
      const res2 = await fetch("https://api.igdb.com/v4/games", {
        method: "POST",
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain",
        },
        body: `fields name, cover.image_id, platforms.abbreviation;
               where category = 0 & cover != null & platforms = (6);
               sort id asc;
               limit 3;`,
      });
      const text2 = await res2.text();

      // Test 3: Full query
      const res3 = await fetch("https://api.igdb.com/v4/games", {
        method: "POST",
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain",
        },
        body: `fields name, slug, cover.image_id, platforms.abbreviation, external_games.category, external_games.uid;
               where category = 0 & cover != null & platforms = (6,48,49,130,167,169);
               sort id asc;
               limit 3;
               offset 0;`,
      });
      const text3 = await res3.text();

      return NextResponse.json({
        ok: true,
        test: true,
        tokenOk: !!token,
        test1: { status: res1.status, body: text1.slice(0, 500) },
        test2: { status: res2.status, body: text2.slice(0, 500) },
        test3: { status: res3.status, body: text3.slice(0, 500) },
      });
    } catch (err: any) {
      return NextResponse.json({ ok: false, test: true, error: err.message }, { status: 500 });
    }
  }

  const offset = parseInt(request.nextUrl.searchParams.get("offset") || "0");
  const limit = Math.min(
    parseInt(request.nextUrl.searchParams.get("limit") || "500"),
    500
  );

  const supabase = createServerClient();
  const stats = {
    offset,
    limit,
    fetched: 0,
    imported: 0,
    skipped: 0,
    duplicates: 0,
    errors: [] as string[],
    nextOffset: offset + limit,
    done: false,
  };

  try {
    // Step 1: Fetch games from IGDB
    let igdbGames: IGDBBulkGame[];
    try {
      igdbGames = await bulkFetchGames(offset, limit);
    } catch (fetchErr: any) {
      return NextResponse.json(
        { ok: false, error: `IGDB fetch failed: ${fetchErr.message}`, ...stats },
        { status: 500 }
      );
    }
    stats.fetched = igdbGames.length;

    if (igdbGames.length === 0) {
      stats.done = true;
      return NextResponse.json({ ok: true, ...stats, debug: "IGDB returned 0 games for this offset" });
    }

    // Step 2: Get existing slugs to detect duplicates
    const { data: existingSlugs } = await supabase
      .from("games")
      .select("slug");
    const usedSlugs = new Set((existingSlugs || []).map((g) => g.slug));

    // Step 3: Build game rows
    const gameRows: Record<string, any>[] = [];

    for (const game of igdbGames) {
      // Skip junk titles
      if (shouldSkip(game.name)) {
        stats.skipped++;
        continue;
      }

      const row = buildGameRow(game);

      // Skip if no cover (shouldn't happen with our IGDB filter, but safety)
      if (!row.cover_image) {
        stats.skipped++;
        continue;
      }

      // Handle slug collisions
      if (usedSlugs.has(row.slug)) {
        // Try with IGDB ID suffix
        const altSlug = `${row.slug}-${game.id}`;
        if (usedSlugs.has(altSlug)) {
          stats.duplicates++;
          continue;
        }
        row.slug = altSlug;
      }
      usedSlugs.add(row.slug);
      gameRows.push(row);
    }

    // Step 4: Batch insert (chunks of 50)
    const CHUNK_SIZE = 50;
    for (let i = 0; i < gameRows.length; i += CHUNK_SIZE) {
      const chunk = gameRows.slice(i, i + CHUNK_SIZE);
      const { error } = await supabase.from("games").insert(chunk as any);

      if (error) {
        // Batch failed — try individual inserts
        for (const row of chunk) {
          const { error: singleErr } = await supabase
            .from("games")
            .insert(row as any);
          if (singleErr) {
            // Could be duplicate slug race condition — try upsert
            if (singleErr.message?.includes("duplicate") || singleErr.code === "23505") {
              stats.duplicates++;
            } else {
              stats.errors.push(`${row.title}: ${singleErr.message}`);
            }
          } else {
            stats.imported++;
          }
        }
      } else {
        stats.imported += chunk.length;
      }
    }

    // If IGDB returned fewer than `limit`, we've reached the end
    if (igdbGames.length < limit) {
      stats.done = true;
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
