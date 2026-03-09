#!/usr/bin/env node
/**
 * Local IGDB bulk import script — no Vercel timeout limits.
 *
 * Runs directly on your machine, talks to IGDB + Supabase.
 *
 * Usage:
 *   node import-igdb-local.js [startOffset]
 *
 * Example:
 *   node import-igdb-local.js 0
 *   node import-igdb-local.js 150000
 */

require("dotenv").config({ path: ".env.local" });

const IGDB_BASE = "https://api.igdb.com/v4";
const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const BATCH_SIZE = 500;
const SUPABASE_PAGE = 10000;

// ── Env checks ──
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}
if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
  console.error("Missing TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET in .env.local");
  process.exit(1);
}

// ── Twitch / IGDB auth ──
let cachedToken = null;

async function getTwitchToken() {
  if (cachedToken && Date.now() < cachedToken.expires_at - 300_000) {
    return cachedToken.access_token;
  }
  const res = await fetch(TWITCH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });
  if (!res.ok) throw new Error(`Twitch token failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  cachedToken = { access_token: data.access_token, expires_at: Date.now() + data.expires_in * 1000 };
  return cachedToken.access_token;
}

async function igdbQuery(endpoint, query) {
  const token = await getTwitchToken();
  const res = await fetch(`${IGDB_BASE}/${endpoint}`, {
    method: "POST",
    headers: {
      "Client-ID": TWITCH_CLIENT_ID,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
    body: query,
  });
  if (!res.ok) throw new Error(`IGDB ${endpoint} failed (${res.status}): ${await res.text()}`);
  return res.json();
}

async function bulkFetchGames(offset, limit = 500) {
  return igdbQuery(
    "games",
    `fields name, slug, summary, cover.image_id, screenshots.image_id,
            genres.name, platforms.abbreviation, platforms.name,
            total_rating, first_release_date,
            external_games.category, external_games.uid;
     where cover != null & themes != (42);
     sort id asc;
     limit ${Math.min(limit, 500)};
     offset ${offset};`
  );
}

// ── Supabase helpers (raw REST API — no SDK needed) ──

async function supabaseRequest(method, path, body = null, params = {}) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer: method === "POST" ? "return=minimal" : undefined,
  };
  // Remove undefined headers
  Object.keys(headers).forEach((k) => headers[k] === undefined && delete headers[k]);

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url.toString(), opts);
  const text = await res.text();
  if (!res.ok && res.status !== 409) {
    throw new Error(`Supabase ${method} ${path} (${res.status}): ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

async function loadExistingSlugs() {
  const slugs = new Set();
  let from = 0;
  while (true) {
    const data = await supabaseRequest("GET", "games", null, {
      select: "slug",
      offset: String(from),
      limit: String(SUPABASE_PAGE),
    });
    if (!data?.length) break;
    for (const g of data) slugs.add(g.slug);
    if (data.length < SUPABASE_PAGE) break;
    from += SUPABASE_PAGE;
    process.stdout.write(`  Loading slugs: ${slugs.size}...\r`);
  }
  return slugs;
}

async function insertGames(rows) {
  // Use upsert-like behavior: insert with on-conflict ignore
  const url = new URL(`${SUPABASE_URL}/rest/v1/games`);
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal,resolution=ignore-duplicates",
  };
  const res = await fetch(url.toString(), {
    method: "POST",
    headers,
    body: JSON.stringify(rows),
  });
  if (!res.ok && res.status !== 409) {
    const text = await res.text();
    throw new Error(`Insert failed (${res.status}): ${text}`);
  }
  return rows.length;
}

// ── Mapping helpers ──

const PLATFORM_MAP = {
  PC: "PC", PS4: "PS4", PS5: "PS5", XONE: "Xbox One",
  "Series X|S": "Xbox Series X|S", Switch: "Switch", Linux: "Linux",
  Mac: "Mac", PS3: "PS3", X360: "Xbox 360", Stadia: "Stadia",
  WiiU: "Wii U", Wii: "Wii", VITA: "PS Vita", "3DS": "3DS",
  PS2: "PS2", PS1: "PS1", DC: "Dreamcast", N64: "N64",
  Android: "Android", iOS: "iOS",
};

const GENRE_MAP = {
  "Role-playing (RPG)": "RPG", Shooter: "Shooter", Adventure: "Adventure",
  Platform: "Platformer", Puzzle: "Puzzle", Racing: "Racing",
  "Real Time Strategy (RTS)": "Strategy", Strategy: "Strategy",
  "Turn-based strategy (TBS)": "Strategy", Tactical: "Strategy",
  Sport: "Sports", Simulator: "Simulation", Fighting: "Fighting",
  "Hack and slash/Beat 'em up": "Action", Music: "Music", Indie: "Indie",
  Arcade: "Arcade", "Card & Board Game": "Card Game", MOBA: "MOBA",
  "Point-and-click": "Adventure", "Visual Novel": "Visual Novel",
  "Quiz/Trivia": "Puzzle", Pinball: "Arcade",
};

const JUNK_RE = /\b(soundtrack|ost|artbook|wallpaper|skin pack|voice pack|commentary|making of|digital art|music pack|demo|trial|beta|playtest|prologue|season\s*pass|add[\s-]?on)\b/i;
const SPAM_RE = /\b(hentai|sexy|waifu|anime girl|dating sim|erotic|adult only|nudity puzzle|strip poker)\b/i;

function shouldSkip(title) {
  if (JUNK_RE.test(title)) return true;
  if (SPAM_RE.test(title)) return true;
  if (title.length < 3) return true;
  return false;
}

function makeSlug(title) {
  return title.toLowerCase().replace(/['']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

function igdbImageUrl(imageId, size = "cover_big") {
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
}

function extractSteamAppId(externalGames) {
  if (!externalGames?.length) return null;
  const steam = externalGames.find((eg) => eg.category === 1);
  return steam?.uid || null;
}

function mapPlatforms(platforms) {
  if (!platforms?.length) return ["PC"];
  const set = new Set();
  for (const p of platforms) {
    set.add(PLATFORM_MAP[p.abbreviation] || PLATFORM_MAP[p.name] || p.name);
  }
  return Array.from(set);
}

function mapGenres(genres) {
  if (!genres?.length) return [];
  const set = new Set();
  for (const g of genres) set.add(GENRE_MAP[g.name] || g.name);
  return Array.from(set);
}

function formatDate(ts) {
  if (!ts) return null;
  return new Date(ts * 1000).toISOString().split("T")[0];
}

function buildGameRow(game) {
  const coverImage = game.cover?.image_id ? igdbImageUrl(game.cover.image_id, "cover_big") : null;
  const screenshotImage = game.screenshots?.[0]?.image_id ? igdbImageUrl(game.screenshots[0].image_id, "screenshot_big") : null;

  return {
    title: game.name,
    slug: makeSlug(game.name),
    description: game.summary || null,
    cover_image: coverImage,
    screenshot_image: screenshotImage,
    platforms: mapPlatforms(game.platforms),
    genres: mapGenres(game.genres),
    release_date: formatDate(game.first_release_date),
    metacritic: game.total_rating ? Math.round(game.total_rating) : null,
    steam_app_id: extractSteamAppId(game.external_games),
  };
}

// ── Main ──

async function main() {
  let offset = parseInt(process.argv[2] || "0");
  console.log(`\n🎮 IGDB Local Import — starting at offset ${offset}\n`);

  // Step 1: Load existing slugs
  console.log("📦 Loading existing slugs from Supabase...");
  const usedSlugs = await loadExistingSlugs();
  console.log(`  ✅ Loaded ${usedSlugs.size} existing slugs\n`);

  let totalImported = 0;
  let totalSkipped = 0;
  let totalDupes = 0;
  let batchNum = 0;

  // Step 2: Loop through IGDB
  while (true) {
    batchNum++;
    process.stdout.write(`📡 Batch ${batchNum} — IGDB offset ${offset}...`);

    let igdbGames;
    try {
      igdbGames = await bulkFetchGames(offset, BATCH_SIZE);
    } catch (err) {
      console.error(`\n  ❌ IGDB error: ${err.message}`);
      console.log("  Waiting 10s and retrying...");
      await sleep(10000);
      continue;
    }

    if (igdbGames.length === 0) {
      console.log("\n\n🏁 IGDB returned 0 games — import complete!");
      break;
    }

    // Build rows
    const gameRows = [];
    let batchSkipped = 0;
    let batchDupes = 0;

    for (const game of igdbGames) {
      if (shouldSkip(game.name)) { batchSkipped++; continue; }
      const row = buildGameRow(game);
      if (!row.cover_image) { batchSkipped++; continue; }

      if (usedSlugs.has(row.slug)) {
        const altSlug = `${row.slug}-${game.id}`;
        if (usedSlugs.has(altSlug)) { batchDupes++; continue; }
        row.slug = altSlug;
      }
      usedSlugs.add(row.slug);
      gameRows.push(row);
    }

    // Insert in chunks of 50
    let batchImported = 0;
    for (let i = 0; i < gameRows.length; i += 50) {
      const chunk = gameRows.slice(i, i + 50);
      try {
        await insertGames(chunk);
        batchImported += chunk.length;
      } catch (err) {
        // Try individual inserts
        for (const row of chunk) {
          try {
            await insertGames([row]);
            batchImported++;
          } catch (e) {
            if (e.message.includes("duplicate") || e.message.includes("23505")) {
              batchDupes++;
            } else {
              console.error(`\n  ⚠️ ${row.title}: ${e.message}`);
            }
          }
        }
      }
    }

    totalImported += batchImported;
    totalSkipped += batchSkipped;
    totalDupes += batchDupes;

    console.log(` +${batchImported} new | ${batchDupes} dupes | ${batchSkipped} skipped | total: ${totalImported} imported`);

    offset += BATCH_SIZE;

    if (igdbGames.length < BATCH_SIZE) {
      console.log("\n🏁 IGDB returned fewer than batch size — import complete!");
      break;
    }

    // Rate limit: IGDB allows 4 req/sec
    await sleep(300);
  }

  console.log(`\n✅ Done! Imported ${totalImported} new games, skipped ${totalSkipped}, ${totalDupes} duplicates.`);
  console.log(`Final IGDB offset: ${offset}\n`);
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
