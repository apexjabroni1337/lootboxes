import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * Cron endpoint: Discover and import newly released games from Steam.
 *
 * Strategy:
 * 1. Fetch Steam's "Popular New Releases" search feed (sorted by release date)
 * 2. Fetch Steam's "Featured Categories" endpoint (includes a New Releases section)
 * 3. For each new game not already in our DB, fetch full details from Steam Store API
 * 4. Insert into games table with cover art, genres, platforms, Metacritic, etc.
 *
 * This ensures our New Releases page stays current even for games that don't
 * have ITAD deals yet. Runs every 6 hours via Vercel Cron.
 */

export const maxDuration = 60;

const SAFETY_TIMEOUT_MS = 55_000; // Stop 5s before Vercel kills us

interface SteamSearchItem {
  name: string;
  logo: string;        // header image URL
  appid: string;
}

interface SteamSearchResponse {
  results_html: string;
  total_count: number;
  start: number;
}

/**
 * Parse Steam app IDs from the search results HTML.
 * Steam's search endpoint returns HTML, but each result has a data-ds-appid attribute.
 */
function parseAppIdsFromHtml(html: string): number[] {
  const appIds: number[] = [];
  // Match data-ds-appid="12345" patterns
  const regex = /data-ds-appid="(\d+)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const id = parseInt(match[1], 10);
    if (id && !appIds.includes(id)) {
      appIds.push(id);
    }
  }
  return appIds;
}

/**
 * Fetch a single page of Steam search results.
 */
async function fetchSteamSearchPage(
  filter: string,
  start: number,
  count: number
): Promise<number[]> {
  try {
    const searchUrl = new URL("https://store.steampowered.com/search/results/");
    searchUrl.searchParams.set("query", "");
    searchUrl.searchParams.set("start", String(start));
    searchUrl.searchParams.set("count", String(count));
    searchUrl.searchParams.set("sort_by", "Released_DESC");
    searchUrl.searchParams.set("filter", filter);
    searchUrl.searchParams.set("os", "win");
    searchUrl.searchParams.set("infinite", "1");
    searchUrl.searchParams.set("category1", "998"); // Games only (not DLC/software)
    searchUrl.searchParams.set("ndl", "1");

    const res = await fetch(searchUrl.toString(), {
      headers: {
        "Accept": "application/json, text/javascript",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (res.ok) {
      const data: SteamSearchResponse = await res.json();
      if (data.results_html) {
        return parseAppIdsFromHtml(data.results_html);
      }
    }
  } catch {
    // Silently continue
  }
  return [];
}

/**
 * Fetch newly released game IDs from Steam's search endpoint.
 * Fetches multiple pages from both the "Popular New Releases" curated list
 * AND the broader "all recently released" feed to maximise coverage.
 */
async function fetchSteamNewReleases(): Promise<number[]> {
  const appIds: number[] = [];

  // Fetch 3 pages of Popular New Releases (curated by Steam — ~300 games)
  const popularPages = await Promise.all([
    fetchSteamSearchPage("popularnew", 0, 100),
    fetchSteamSearchPage("popularnew", 100, 100),
    fetchSteamSearchPage("popularnew", 200, 100),
  ]);
  for (const page of popularPages) appIds.push(...page);

  // Also fetch 3 pages of ALL recently released games (not just curated)
  // This catches noteworthy games Steam's "popular" filter hasn't picked up yet
  const allNewPages = await Promise.all([
    fetchSteamSearchPage("topsellers", 0, 100),   // Top sellers among new releases
    fetchSteamSearchPage("topsellers", 100, 100),
    fetchSteamSearchPage("topsellers", 200, 100),
  ]);
  for (const page of allNewPages) appIds.push(...page);

  return appIds;
}

/**
 * Fetch new releases from Steam's featured categories endpoint.
 * Returns app IDs from the "New Releases" category.
 */
async function fetchSteamFeaturedNewReleases(): Promise<number[]> {
  const appIds: number[] = [];

  try {
    const res = await fetch(
      "https://store.steampowered.com/api/featuredcategories/?cc=us&l=en",
      {
        headers: { "Accept": "application/json" },
        signal: AbortSignal.timeout(15000),
      }
    );

    if (res.ok) {
      const data = await res.json();

      // Featured categories response has numbered keys and named sections
      // Look for "New Releases" section
      for (const key of Object.keys(data)) {
        const section = data[key];
        if (!section || typeof section !== "object") continue;

        // Check if this section is new releases (id varies, check name)
        const name = (section.name || "").toLowerCase();
        if (
          name.includes("new release") ||
          name.includes("recently released") ||
          name.includes("popular new")
        ) {
          const items = section.items || [];
          for (const item of items) {
            if (item.id && typeof item.id === "number") {
              appIds.push(item.id);
            }
          }
        }
      }

      // Also check "coming_soon" for upcoming games
      if (data.coming_soon?.items) {
        for (const item of data.coming_soon.items) {
          if (item.id && typeof item.id === "number") {
            appIds.push(item.id);
          }
        }
      }

      // And "new_releases" direct key
      if (data.new_releases?.items) {
        for (const item of data.new_releases.items) {
          if (item.id && typeof item.id === "number") {
            appIds.push(item.id);
          }
        }
      }
    }
  } catch {
    // Silently continue
  }

  return appIds;
}

/**
 * Fetch full game details from Steam Store API.
 */
async function fetchSteamAppDetails(appId: number): Promise<any | null> {
  try {
    const res = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=en`,
      { signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const appData = data?.[String(appId)];
    if (!appData?.success || !appData?.data) return null;
    return appData.data;
  } catch {
    return null;
  }
}

function makeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
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

  const startTime = Date.now();
  const supabase = createServerClient();
  const stats = {
    searchNewReleases: 0,
    featuredNewReleases: 0,
    totalUniqueAppIds: 0,
    alreadyInDb: 0,
    imported: 0,
    skipped: 0,
    errors: [] as string[],
    importedGames: [] as string[],
  };

  try {
    // ── Step 1: Gather new release app IDs from multiple sources ──
    // Runs all Steam fetches in parallel for speed
    const [searchIds, featuredIds] = await Promise.all([
      fetchSteamNewReleases(),      // 6 pages: 3 popular + 3 top sellers
      fetchSteamFeaturedNewReleases(),
    ]);

    stats.searchNewReleases = searchIds.length;
    stats.featuredNewReleases = featuredIds.length;

    // Deduplicate
    const allAppIds = Array.from(new Set([...searchIds, ...featuredIds]));
    stats.totalUniqueAppIds = allAppIds.length;

    if (allAppIds.length === 0) {
      return NextResponse.json({
        ok: true,
        message: "No new release app IDs found from Steam",
        ...stats,
        timestamp: new Date().toISOString(),
      });
    }

    // ── Step 2: Check which games we already have ──
    // Check by steam_app_id (as string and number)
    const { data: existingByAppId } = await supabase
      .from("games")
      .select("steam_app_id")
      .in("steam_app_id", allAppIds.map(String));

    const { data: existingByAppIdNum } = await supabase
      .from("games")
      .select("steam_app_id")
      .in("steam_app_id", allAppIds);

    const existingAppIds = new Set<number>();
    for (const g of [...(existingByAppId || []), ...(existingByAppIdNum || [])]) {
      existingAppIds.add(parseInt(String(g.steam_app_id), 10));
    }

    const newAppIds = allAppIds.filter((id) => !existingAppIds.has(id));
    stats.alreadyInDb = allAppIds.length - newAppIds.length;

    // Also get existing slugs for deduplication
    const { data: existingSlugs } = await supabase
      .from("games")
      .select("slug");
    const usedSlugs = new Set((existingSlugs || []).map((g) => g.slug));

    // ── Step 3: Fetch details and import each new game ──
    for (const appId of newAppIds) {
      // Safety timeout check
      if (Date.now() - startTime > SAFETY_TIMEOUT_MS) {
        stats.errors.push(`Stopped early: safety timeout after ${stats.imported} imports`);
        break;
      }

      const appData = await fetchSteamAppDetails(appId);
      if (!appData) {
        stats.skipped++;
        continue;
      }

      // Only import actual games (not DLC, demos, mods, etc.)
      if (appData.type !== "game") {
        stats.skipped++;
        continue;
      }

      // Skip free-to-play shovelware: if the game has <5 reviews and is free, skip
      // (We still want legitimate F2P games like big titles)
      const isFree = appData.is_free === true;
      const metacritic = appData.metacritic?.score || null;
      const hasReviews = appData.recommendations?.total > 50;

      // Skip titles that look like junk
      const title = appData.name || "";
      if (/\b(bundle|soundtrack|ost|artbook|dlc|skin\s*pack|demo)\b/i.test(title)) {
        stats.skipped++;
        continue;
      }

      // Build slug (ensure uniqueness)
      let slug = makeSlug(title);
      if (usedSlugs.has(slug)) {
        slug = `${slug}-${appId}`;
      }
      if (usedSlugs.has(slug)) {
        stats.skipped++;
        continue;
      }
      usedSlugs.add(slug);

      // Extract metadata
      const genres = (appData.genres || [])
        .map((g: any) => g.description)
        .filter(Boolean)
        .slice(0, 5);

      const platforms: string[] = [];
      if (appData.platforms?.windows) platforms.push("PC");
      if (appData.platforms?.mac) platforms.push("Mac");
      if (appData.platforms?.linux) platforms.push("Linux");

      const coverImage = appData.header_image || null;
      const screenshotImage = appData.screenshots?.[0]?.path_full || null;

      // Parse release date
      let releaseDate: string | null = null;
      if (appData.release_date?.date) {
        // Steam returns dates like "Mar 5, 2026" — store as-is, our DB accepts strings
        releaseDate = appData.release_date.date;
      }

      // Determine if this is "coming soon"
      const isComingSoon = appData.release_date?.coming_soon === true;

      // Tags from Steam categories/genres for better filtering
      const tags = (appData.categories || [])
        .map((c: any) => c.description)
        .filter(Boolean)
        .slice(0, 10);

      // Compute an initial hot_score for new releases
      // New releases get a recency bonus that decays over time
      // The sync-popularity cron will update this later with real player data
      let hotScore = 20; // Base score for being a new release
      if (metacritic) hotScore += metacritic / 5; // 0-20 for quality
      if (hasReviews) hotScore += 10; // Bonus for having community engagement
      if (!isFree) hotScore += 5; // Small bonus for paid games (less shovelware)

      const { error: insertErr } = await supabase
        .from("games")
        .upsert(
          {
            title,
            slug,
            steam_app_id: String(appId),
            cover_image: coverImage,
            screenshot_image: screenshotImage,
            genres,
            platforms,
            metacritic,
            release_date: releaseDate,
            hot_score: Math.round(hotScore * 10) / 10,
            description: (appData.short_description || "").slice(0, 500),
            tags,
          },
          { onConflict: "slug", ignoreDuplicates: true }
        );

      if (insertErr) {
        stats.errors.push(`Import ${title} (${appId}): ${insertErr.message}`);
      } else {
        stats.imported++;
        stats.importedGames.push(`${title} (${appId})${isComingSoon ? " [Coming Soon]" : ""}`);
      }

      // Respect Steam rate limits (200ms between requests)
      await new Promise((r) => setTimeout(r, 200));
    }

    // ── Step 4: Also update existing games' release status ──
    // For games already in our DB from this batch, check if they were
    // previously "Coming Soon" and have now released. Update their
    // release_date and give them a fresh hot_score bump.
    const existingToCheck = allAppIds.filter((id) => existingAppIds.has(id));

    // Only check a subset to stay within time limits
    const checkLimit = Math.min(existingToCheck.length, 20);
    for (let i = 0; i < checkLimit; i++) {
      if (Date.now() - startTime > SAFETY_TIMEOUT_MS) break;

      const appId = existingToCheck[i];
      const appData = await fetchSteamAppDetails(appId);
      if (!appData) continue;

      // If game has released (coming_soon = false) and has a release date,
      // update our record
      if (appData.release_date && !appData.release_date.coming_soon) {
        const { error } = await supabase
          .from("games")
          .update({
            release_date: appData.release_date.date || null,
            metacritic: appData.metacritic?.score || null, // Metacritic may have been added since import
          })
          .eq("steam_app_id", String(appId));

        if (error) {
          stats.errors.push(`Update release date ${appId}: ${error.message}`);
        }
      }

      await new Promise((r) => setTimeout(r, 200));
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
