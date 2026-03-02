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

// Mojibake / broken UTF-8 encoding patterns
const MOJIBAKE_RE = /Ã[©¶¼¤³±®ˆ°¥§¨]|â€[™œ]|Â[²³¹°]|ï¼|ã€|äm|ä¸|è¡|æ[°±]|ç[§¤]|å[®¯°]|Ã¶|Ã¼|Ã¤|Ã©|Ã¨|Ã§|Ã±|Ã¡|Ã³|Ã…|ChaosÃ|SalzwÃ|grÃ¤|Ã¶hlen/;

// German word patterns
const GERMAN_RE = /\b(und|oder|mit|für|der|die|das|ein|eine|des|dem|den|von|auf|aus|bei|ist|nach|über|unter|nicht|aber|auch|noch|wie|nur|kann|wird|wenn|sind|hat|haben|sein|mehr|zur|zum|bis|seit|dann|denn|durch|gegen|weil|schon|hier|ohne|immer)\b/gi;

// French word patterns
const FRENCH_RE = /\b(les|des|une|dans|avec|pour|sur|par|qui|est|sont|mais|ses|leur|cette|tout|entre|aussi|chez|nous|vous|très|comme|d'un|d'une|l'|qu'|c'est|n'est|l'invasion)\b/gi;

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
  /\bSeason\s*Pass\b/i,
  /\bLifetime Pass\b/i,
  /\bPaper\s*Editions?\b/i,
  /\bRetro\s*Pack\b/i,
  /\bWeapon\s*Skins?\b/i,
  /\bDamage\s*Cars?\s*Pack\b/i,
  /\bWingsuit\s*Pack\b/i,
  /\bAdd[\s-]?on\b/i,
  /\bGroundhouse\s*Pack\b/i,
  /\bGrindhouse\b/i,
  /\bLeaders?\s*Pack\b/i,
  /\bContributor\s*Pack\b/i,
  /\bDouble\s*Pack\b/i,
  /\bdemo\s*disc\b/i,
  /\bSolitaire\s*Pack\b/i,
];

// Spam / shovelware series that flood the database
const SPAM_TITLE_PATTERNS = [
  /\bDream Office\b/i,
  /\bPool Cleaning\b/i,
  /\bServiceIT\b/i,
  /\bFarmer'?s?\s*(Father|Life|Farm)/i,
  /\bGardener\s+and\s+(Creatura|ServiceIT)/i,
  /\bVoid Miner\b/i,
  /\bFactory Planner\b/i,
  /\bGas Station\b.*\b(demo|Cooking|Simulator)/i,
  /\bLiquor Store\b/i,
  /\bRentlord\b/i,
  /\bPixelMouse\b/i,
  /\bSCUM\s*(Man|Weapon)\b/i,
  /\bfor\s+ServiceIT\b/i,
  /\bVillage Tale\b/i,
  /\bLesson abo/i,
  /\bReality Break\b/i,
  /\bOverDrift Festival\b/i,
  /\bPizza Possum\b.*Sheepherds/i,
  /\bStar Crafter\b/i,
  /\bOld Market Simulator\b/i,
  /\bMedieval Machines\b/i,
  /\bPrimitive Tribe\b/i,
  /\bColor Breakers\b/i,
  /\bPlanets & P/i,
  /\bDU&I\b/,
  /\bMonsters and Me\b/i,
  /\bMorning Call\b.*\bAll Ages\b/i,
  /\bsummoned eldritch\b/i,
  /\bStation Goblin\b/i,
  /\bSokpop\b/i,
  /\bBRundle\b/i,
  /\bPurrrifiers\b/i,
  /\bHelio s/i,
  /\bARROW Patterns\b/i,
  /\bTiny Aquarium\b/i,
  /\bPlane Accident\b/i,
  /\bGoat of Duty\b/i,
  /\bSuchArt\b/i,
  /\bSquad 44\b/i,
  /\bHeroes of Hellas\b/i,
  /\bDreamland Solitaire\b/i,
  /\bWildlife Creative\b/i,
  /\bCrown Northern\b/i,
  /\bOffroad Mechanic\b/i,
  /\bGO\(L\)D\b/,
  /\bMannschaftsbus\b/i,
  /\bYoutubers Life\b/i,
  /\bCooking Simulator\b.*\bCookie/i,
  /\bShin chan\b/i,
  /\bFalling Daggers\b/i,
  /\bUrbek City\b/i,
  /\bFolly Of The Wizards\b/i,
  /\bStand Survivors\b/i,
  // Round 2 catches from output
  /\bSchlümpfe\b/i,
  /\bSchlÃ/i,
  /\bPatrizier\b/i,
  /\bAutobahnpolizei\b/i,
  /\bPolizeihubschrauber\b/i,
  /\bFernbus\b/i,
  /\bFußball\b/i,
  /\bFuÃ.ball\b/i,
  /\bWeihnachtspaket\b/i,
  /\bFirst Class Trouble\b/i,
  /\bZom Mega Price\b/i,
  /\bSyberia Pack\b/i,
  /\bViaCAD\b/i,
  /\bPowerPack LT\b/i,
  /\bHorde Slaying Duo\b/i,
  /\bGrabitoons\b/i,
  /\bPrimal Planet\b/i,
  /\bSiegeturtle\b/i,
  /\bVruumba\b/i,
  /\bBackrooms Happy\b/i,
  /\bZapling BioGun\b/i,
  /\bCooking in the Skies\b/i,
  /\bS2ENGINE\b/i,
  /\bOMSI\s*2\b/i,
  /\bRescue Team\b/i,
  /\bNatural Creatura\b/i,
  /\bSCUM\s*(Car|Dances|Weapon)\b/i,
  /\bHydroponics Farm\b/i,
  /\bAquatic Store\b/i,
  /\bInterdimensional Builders\b/i,
  /\bNew Yankee\b/i,
  /\bSeasons With Furry\b/i,
  /\bFolklore Fanatic\b/i,
  /\bPolyZ Supporter\b/i,
  /\bTrainspot\b/i,
  /\bVertical Kingdom\b/i,
  /\bDogfight 1942\b/i,
  /\bRussia Under Seige\b/i,
  /\bIndie Selection\b/i,
  /\bRings of Powder\b/i,
  /\bweird world of elves\b/i,
  /\bUndefeated\s*[-–]\s*Deluxe\b/i,
  /\bTouhou\b/i,
  /\bFairy Fencer\b/i,
  /\bLars a\b/i,
  /\bFoxer\b/i,
  /\bSupporter\s*(Edition|Pack)\b/i,
  /\bComplete\s*Set\b/i,
  /\bDigital Supporter\b/i,
  /\bSurvive the Fall\b/i,
  /\bAtlantis 4\b/i,
  /\bPro Simulator\b/i,
  /\bBecoming Saint\b/i,
  /\bZombie Graveyard\b/i,
  /\bArena Renovation\b/i,
  /\bSavara\b/i,
  /\bSecond Chances\b/i,
  /\bTwilight Memoria\b/i,
  /\bSpeed & Strategy\b/i,
  /\bRisk & Reward\b/i,
  /\bPro Basketball Manager\b/i,
  /\bIndustry Tycoon Duo\b/i,
  /\bAfterpla?ce\b/i,
  /\bTERRACOTTA\b/i,
  /\bPaddle to Hell\b/i,
  /\bDoctor Who Infinity\b/i,
  /\bPersia and Egypt\b/i,
  /\bJoy of Grilling\b/i,
  /\bRose Riddle\b/i,
  /\bRed Johnson\b/i,
  /\bAura of Worlds\b/i,
  /\bNew Haven Chronicles\b/i,
  /\bAccident and Creatura\b/i,
  /\bWorld of Kaamos\b/i,
  /\bGolden Rails\b/i,
  /\bMineral Of Mirac/i,
  /\bKaif.Paket\b/i,
  /\bPunch!\b/i,
  /\bHeart of Crown\b/i,
  /\bBuy\s+Touhou\b/i,
  /\bSpell Cards\b/i,
  /\bContents\s*\(contains\b/i,
  /\bGuide\+Goodies\b/i,
  /\bCar Skins\b/i,
  /\bFanatic Pack\b/i,
  /\bCharms\s*1\b/i,
  /\bCalendar\b/i,
  /\bAmissaire\b/i,
  /\bChemin\b/i,
  /\bDueDao\b/i,
  /\bNewHero\b/i,
  /\bBuildings Maker\b/i,
  /\bBee Simulator\b/i,
  /\bCooking Simulator\b/i,
  /\bYet Another Zombie\b/i,
  /\bTower of Time\b/i,
  /\bOne More Island\b/i,
  /\bPer Aspera\b/i,
  /\bDescynced\b/i,
  /\bRescue Team pack\b/i,
  /\bAI people\b/i,
  /\bVillage Party\b/i,
  /\bSupporteur\b/i,
  /\bDownloadpack\b/i,
  /\bÃ©pong/i,
  /\bmaré/i,
  /\bGhostly Digital\b/i,
  /\bMission Blattpest\b/i,
  /\bMission Blatttpest\b/i,
  /\bBlattpes/i,
];

function shouldDelete(title: string): { delete: boolean; reason: string } {
  // Non-Latin characters (CJK, Cyrillic, Arabic, etc.)
  if (NON_LATIN_RE.test(title)) {
    return { delete: true, reason: "non-Latin characters" };
  }

  // Broken encoding / mojibake
  if (MOJIBAKE_RE.test(title)) {
    return { delete: true, reason: "mojibake/broken encoding" };
  }

  // German titles (3+ German words = almost certainly German)
  const germanMatches = title.match(GERMAN_RE);
  if (germanMatches && germanMatches.length >= 2) {
    return { delete: true, reason: "German title" };
  }

  // French titles
  const frenchMatches = title.match(FRENCH_RE);
  if (frenchMatches && frenchMatches.length >= 2) {
    return { delete: true, reason: "French title" };
  }

  // Tilde in title (common in German/Japanese localized titles like ~Die endlose~)
  if (/~.*~/.test(title) || title.includes("endlose")) {
    return { delete: true, reason: "localized title markers" };
  }

  // Junk patterns (DLC, soundtracks, etc.)
  for (const pat of JUNK_PATTERNS) {
    if (pat.test(title)) {
      return { delete: true, reason: `junk: ${pat.source}` };
    }
  }

  // Spam / shovelware
  for (const pat of SPAM_TITLE_PATTERNS) {
    if (pat.test(title)) {
      return { delete: true, reason: `spam/shovelware: ${pat.source}` };
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
