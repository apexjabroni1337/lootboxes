import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { searchGame, igdbImageUrl } from "@/lib/igdb";

/**
 * All-in-one games cleanup:
 *
 * Phase 1 — Delete non-English games (titles with non-Latin chars, soundtracks,
 *           DLC junk, season passes, artbooks, etc.)
 * Phase 2 — Fix broken/missing cover images via IGDB → Steam fallback
 *
 * GET /api/cron/cleanup-games?secret=<CRON_SECRET>
 */

export const maxDuration = 300; // 5 min for paid Vercel plans, 60s for hobby

const CONCURRENCY = 4;
const SAFETY_MS = 55_000;

/* ── Patterns for non-English / junk titles ── */

// Non-Latin character ranges (CJK, Cyrillic, Arabic, Thai, Korean, Japanese, etc.)
const NON_LATIN_RE = /[\u0400-\u04FF\u0500-\u052F\u2DE0-\u2DFF\uA640-\uA69F\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0E00-\u0E7F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uF900-\uFAFF\uAC00-\uD7AF\u1100-\u11FF]/;

// Junk title patterns (soundtracks, DLC, artbooks, wallpapers, etc.)
const JUNK_PATTERNS = [
  /\bsoundtrack\b/i,
  /\bOST\b/,
  /\bartbook\b/i,
  /\bwallpaper\b/i,
  /\bskin pack\b/i,
  /\bvoice pack\b/i,
  /\bcommentary\b/i,
  /\bmaking of\b/i,
  /\bdigital art\b/i,
  /\bmusic pack\b/i,
  /\bOST\s*[-\/&+]\s*Art/i,
  /\b(Demo|Trial|Beta|Playtest|Prologue)\s*$/i,
];

function shouldDelete(title: string): { delete: boolean; reason: string } {
  // Non-English characters
  if (NON_LATIN_RE.test(title)) {
    return { delete: true, reason: "non-English characters" };
  }

  // Junk patterns
  for (const pat of JUNK_PATTERNS) {
    if (pat.test(title)) {
      return { delete: true, reason: `matches junk pattern: ${pat.source}` };
    }
  }

  return { delete: false, reason: "" };
}

/* ── Steam search ── */

async function searchSteamAppId(title: string): Promise<string | null> {
  const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(title)}&l=english&cc=US`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "LootBoxes/1.0" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.items?.length) return null;
    const titleLower = title.toLowerCase();
    const exact = data.items.find((item: any) => item.name?.toLowerCase() === titleLower);
    return (exact || data.items[0])?.id ? String((exact || data.items[0]).id) : null;
  } catch {
    return null;
  }
}

/* ── Image URL validation ── */

async function isImageBroken(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return true;
    const ct = res.headers.get("content-type") || "";
    return !ct.startsWith("image/");
  } catch {
    return true;
  }
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

  const supabase = createServerClient();
  const stats = {
    phase1_deleted: 0,
    phase1_deletedTitles: [] as string[],
    phase2_checked: 0,
    phase2_broken: 0,
    phase2_missing: 0,
    phase2_fixed: 0,
    phase2_igdb: 0,
    phase2_steam: 0,
    phase2_unfixable: [] as string[],
    errors: [] as string[],
  };

  const startTime = Date.now();

  try {
    /* ═══════════════════════════════════════════
     * PHASE 1: Delete non-English & junk games
     * ═══════════════════════════════════════════ */

    const { data: allGames, error: allErr } = await supabase
      .from("games")
      .select("id, title")
      .order("title");

    if (allErr) throw new Error(`Fetch all games: ${allErr.message}`);

    const toDelete: string[] = [];
    for (const game of allGames || []) {
      const check = shouldDelete(game.title);
      if (check.delete) {
        toDelete.push(game.id);
        stats.phase1_deletedTitles.push(`${game.title} (${check.reason})`);
      }
    }

    if (toDelete.length > 0) {
      // Delete in chunks of 50 to avoid TS depth issues and query limits
      for (let c = 0; c < toDelete.length; c += 50) {
        const chunk = toDelete.slice(c, c + 50);

        // Delete related deals first (foreign key)
        await supabase.from("deals").delete().in("game_id", chunk as any);

        // Delete related lootbox_content
        await supabase.from("lootbox_content").delete().in("game_id", chunk as any);

        // Delete related drop_rates
        await supabase.from("drop_rates").delete().in("game_id", chunk as any);

        // Delete the games themselves
        const { error: gameDelErr } = await supabase
          .from("games")
          .delete()
          .in("id", chunk as any);

        if (gameDelErr) {
          stats.errors.push(`Game delete chunk: ${gameDelErr.message}`);
        } else {
          stats.phase1_deleted += chunk.length;
        }
      }
    }

    /* ═══════════════════════════════════════════
     * PHASE 2: Fix broken / missing images
     * ═══════════════════════════════════════════ */

    // Re-fetch remaining games
    const { data: remainingGames, error: remErr } = await supabase
      .from("games")
      .select("id, title, slug, cover_image, screenshot_image")
      .order("hot_score", { ascending: false, nullsFirst: false });

    if (remErr) throw new Error(`Fetch remaining: ${remErr.message}`);
    if (!remainingGames?.length) {
      return NextResponse.json({ ok: true, message: "No games left", ...stats });
    }

    // Check all images in parallel batches
    const needsFix: typeof remainingGames = [];

    for (let i = 0; i < remainingGames.length; i += CONCURRENCY * 3) {
      if (Date.now() - startTime > SAFETY_MS * 0.35) break;

      const batch = remainingGames.slice(i, i + CONCURRENCY * 3);
      const results = await Promise.allSettled(
        batch.map(async (game) => {
          stats.phase2_checked++;
          if (!game.cover_image) {
            stats.phase2_missing++;
            return { game, needsFix: true };
          }
          const broken = await isImageBroken(game.cover_image);
          if (broken) {
            stats.phase2_broken++;
            return { game, needsFix: true };
          }
          return { game, needsFix: false };
        })
      );

      for (const r of results) {
        if (r.status === "fulfilled" && r.value.needsFix) {
          needsFix.push(r.value.game);
        }
      }
    }

    // Fix images via IGDB → Steam
    for (let i = 0; i < needsFix.length; i += CONCURRENCY) {
      if (Date.now() - startTime > SAFETY_MS) {
        stats.errors.push(`Timeout at ${stats.phase2_fixed} fixes`);
        break;
      }

      const batch = needsFix.slice(i, i + CONCURRENCY);
      const fixResults = await Promise.allSettled(
        batch.map(async (game) => {
          const updates: Record<string, any> = {};

          // Strategy 1: IGDB
          try {
            const igdb = await searchGame(game.title);
            if (igdb?.cover?.image_id) {
              updates.cover_image = igdbImageUrl(igdb.cover.image_id, "cover_big");
              if (igdb.screenshots?.length) {
                updates.screenshot_image = igdbImageUrl(igdb.screenshots[0].image_id, "screenshot_big");
              }
              stats.phase2_igdb++;
              return { game, updates };
            }
          } catch { /* continue */ }

          // Strategy 2: Steam
          try {
            const steamId = await searchSteamAppId(game.title);
            if (steamId) {
              updates.cover_image = `https://cdn.akamai.steamstatic.com/steam/apps/${steamId}/library_600x900.jpg`;
              updates.screenshot_image = `https://cdn.akamai.steamstatic.com/steam/apps/${steamId}/header.jpg`;
              stats.phase2_steam++;
              return { game, updates };
            }
          } catch { /* continue */ }

          return { game, updates };
        })
      );

      for (const r of fixResults) {
        if (r.status === "fulfilled") {
          const { game, updates } = r.value;
          if (Object.keys(updates).length > 0) {
            const { error: updErr } = await supabase
              .from("games")
              .update(updates)
              .eq("id", game.id);
            if (updErr) {
              stats.errors.push(`Update ${game.title}: ${updErr.message}`);
            } else {
              stats.phase2_fixed++;
            }
          } else {
            stats.phase2_unfixable.push(game.title);
          }
        }
      }

      if (i + CONCURRENCY < needsFix.length) {
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    return NextResponse.json({
      ok: true,
      ...stats,
      totalRemaining: remainingGames.length - (stats.phase1_deleted || 0),
      needsFixCount: needsFix.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message, ...stats }, { status: 500 });
  }
}
