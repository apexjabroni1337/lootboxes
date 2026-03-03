import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import {
  bulkFetchGames,
  igdbImageUrl,
  extractSteamAppId,
  type IGDBBulkGame,
} from "@/lib/igdb";

/**
 * Bulk import games from IGDB — AUTO-LOOPING version.
 *
 * Continuously fetches batches of 500 from IGDB and inserts them into
 * Supabase until either:
 *  - IGDB returns 0 games (reached the end)
 *  - We approach the Vercel timeout (270s safety margin)
 *
 * Call it with an offset and it'll keep going from there:
 *   /api/cron/import-igdb?secret=...&offset=64500
 *
 * When it returns, check `nextOffset` and `done`:
 *  - done=true → full catalog imported
 *  - done=false → call again with offset=nextOffset
 *
 * GET /api/cron/import-igdb?secret=<CRON_SECRET>&offset=0
 */

export const maxDuration = 300;

const BATCH_SIZE = 500;
const SAFETY_MS = 270_000; // Stop 30s before Vercel kills us

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
  Stadia: "Stadia",
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
  Platform: "Platformer",
  Puzzle: "Puzzle",
  Racing: "Racing",
  "Real Time Strategy (RTS)": "Strategy",
  Strategy: "Strategy",
  "Turn-based strategy (TBS)": "Strategy",
  Tactical: "Strategy",
  Sport: "Sports",
  Simulator: "Simulation",
  Fighting: "Fighting",
  "Hack and slash/Beat 'em up": "Action",
  Music: "Music",
  Indie: "Indie",
  Arcade: "Arcade",
  "Card & Board Game": "Card Game",
  MOBA: "MOBA",
  "Point-and-click": "Adventure",
  "Visual Novel": "Visual Novel",
  "Quiz/Trivia": "Puzzle",
  Pinball: "Arcade",
};

/* ── Junk title filter ── */

const JUNK_RE =
  /\b(soundtrack|ost|artbook|wallpaper|skin pack|voice pack|commentary|making of|digital art|music pack|demo|trial|beta|playtest|prologue|season\s*pass|add[\s-]?on)\b/i;

const SPAM_RE =
  /\b(hentai|sexy|waifu|anime girl|dating sim|erotic|adult only|nudity puzzle|strip poker)\b/i;

function shouldSkip(title: string): boolean {
  if (JUNK_RE.test(title)) return true;
  if (SPAM_RE.test(title)) return true;
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

function mapPlatforms(
  platforms?: { abbreviation: string; name: string }[]
): string[] {
  if (!platforms?.length) return ["PC"];
  const set = new Set<string>();
  for (const p of platforms) {
    const mapped =
      PLATFORM_MAP[p.abbreviation] || PLATFORM_MAP[p.name] || p.name;
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
  return d.toISOString().split("T")[0];
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
    description: game.summary || null,
    cover_image: coverImage,
    screenshot_image: screenshotImage,
    platforms: mapPlatforms(game.platforms),
    genres: mapGenres(game.genres),
    release_date: formatDate(game.first_release_date),
    metacritic: game.total_rating ? Math.round(game.total_rating) : null,
    steam_app_id: steamAppId,
  };
}

/* ── Check if slug exists (single fast query) ── */

async function slugExists(supabase: any, slug: string): Promise<boolean> {
  const { count } = await supabase
    .from("games")
    .select("id", { count: "exact", head: true })
    .eq("slug", slug);
  return (count || 0) > 0;
}

/* ── Main handler ── */

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 500 }
    );
  }
  if (secret !== cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Debug test mode
  const testMode = request.nextUrl.searchParams.get("test") === "true";
  if (testMode) {
    try {
      const { getTwitchToken } = await import("@/lib/igdb");
      const token = await getTwitchToken();
      const clientId = process.env.TWITCH_CLIENT_ID!;

      const hdrs = {
        "Client-ID": clientId,
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      };

      const res1 = await fetch("https://api.igdb.com/v4/games", {
        method: "POST",
        headers: hdrs,
        body: "fields name; limit 3;",
      });
      const text1 = await res1.text();

      return NextResponse.json({
        ok: true,
        test: true,
        tokenOk: !!token,
        test1: { status: res1.status, body: text1.slice(0, 500) },
      });
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, test: true, error: err.message },
        { status: 500 }
      );
    }
  }

  let currentOffset = parseInt(
    request.nextUrl.searchParams.get("offset") || "0"
  );

  const supabase = createServerClient();
  const startTime = Date.now();

  const stats = {
    startOffset: currentOffset,
    currentOffset,
    batchesProcessed: 0,
    totalFetched: 0,
    totalImported: 0,
    totalSkipped: 0,
    totalDuplicates: 0,
    errors: [] as string[],
    nextOffset: currentOffset,
    done: false,
  };

  try {
    // No more loading all slugs upfront — we check per-game only on collision

    // Auto-loop through batches until timeout or done
    while (Date.now() - startTime < SAFETY_MS) {
      // Fetch batch from IGDB
      let igdbGames: IGDBBulkGame[];
      try {
        igdbGames = await bulkFetchGames(currentOffset, BATCH_SIZE);
      } catch (fetchErr: any) {
        stats.errors.push(
          `IGDB fetch at offset ${currentOffset}: ${fetchErr.message}`
        );
        // If IGDB errors, stop but don't mark as done (retry later)
        break;
      }

      stats.totalFetched += igdbGames.length;

      // If IGDB returned 0 games, we've reached the end!
      if (igdbGames.length === 0) {
        stats.done = true;
        break;
      }

      // Build game rows for this batch
      const gameRows: Record<string, any>[] = [];
      const batchSlugs = new Set<string>();

      for (const game of igdbGames) {
        if (shouldSkip(game.name)) {
          stats.totalSkipped++;
          continue;
        }

        const row = buildGameRow(game);

        if (!row.cover_image) {
          stats.totalSkipped++;
          continue;
        }

        // Handle in-batch slug collisions
        if (batchSlugs.has(row.slug)) {
          row.slug = `${row.slug}-${game.id}`;
        }
        batchSlugs.add(row.slug);
        gameRows.push(row);
      }

      // Batch upsert (chunks of 50) — let DB handle duplicates via ON CONFLICT
      for (let i = 0; i < gameRows.length; i += 50) {
        const chunk = gameRows.slice(i, i + 50);
        const { error } = await supabase.from("games").upsert(chunk as any, {
          onConflict: "slug",
          ignoreDuplicates: true,
        });

        if (error) {
          // Batch failed — try individual inserts
          for (const row of chunk) {
            const { error: singleErr } = await supabase
              .from("games")
              .upsert(row as any, { onConflict: "slug", ignoreDuplicates: true });
            if (singleErr) {
              if (
                singleErr.message?.includes("duplicate") ||
                singleErr.code === "23505"
              ) {
                stats.totalDuplicates++;
              } else {
                stats.errors.push(`${row.title}: ${singleErr.message}`);
              }
            } else {
              stats.totalImported++;
            }
          }
        } else {
          stats.totalImported += chunk.length;
        }
      }

      // Advance offset
      currentOffset += BATCH_SIZE;
      stats.currentOffset = currentOffset;
      stats.nextOffset = currentOffset;
      stats.batchesProcessed++;

      // If IGDB returned fewer than batch size, we're done
      if (igdbGames.length < BATCH_SIZE) {
        stats.done = true;
        break;
      }

      // Brief pause to be nice to IGDB rate limits (4 req/sec)
      await new Promise((r) => setTimeout(r, 300));
    }

    const elapsed = Math.round((Date.now() - startTime) / 1000);

    return NextResponse.json({
      ok: true,
      ...stats,
      elapsedSeconds: elapsed,
      message: stats.done
        ? "Import complete! Full IGDB catalog has been imported."
        : `Processed ${stats.batchesProcessed} batches in ${elapsed}s. Call again with offset=${stats.nextOffset} to continue.`,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message, ...stats },
      { status: 500 }
    );
  }
}
