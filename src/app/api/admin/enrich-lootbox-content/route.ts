import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { ALL_GAME_CONTENT, type LootboxContent } from "@/lib/lootbox-content";

export const maxDuration = 300;

// ============================================================
// ENDPOINT HANDLER
//
// Enriches all games that have a loot_system_type with detailed
// game-specific analysis content from our content library.
//
// Previously: 13 games had specific content, ~150 got generic
// templates. Now: ~170+ games have unique, game-specific analysis.
// ============================================================

export async function GET(request: NextRequest) {
  // Auth check
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

  const supabase = createServerClient();
  const batchSize = parseInt(request.nextUrl.searchParams.get("batch") || "20");
  const offset = parseInt(request.nextUrl.searchParams.get("offset") || "0");
  const forceAll = request.nextUrl.searchParams.get("force") === "true";

  try {
    // Fetch games needing content enrichment
    const { data: games, error: gamesError } = await supabase
      .from("games")
      .select("id, slug, title, loot_system_type, tags")
      .not("loot_system_type", "is", null)
      .range(offset, offset + batchSize - 1);

    if (gamesError) {
      throw gamesError;
    }

    if (!games || games.length === 0) {
      return NextResponse.json({
        status: "completed",
        message: "No games found needing enrichment",
        processed: 0,
      });
    }

    const results: Array<{
      slug: string;
      status: "created" | "updated" | "skipped" | "error";
      source?: string;
      error?: string;
    }> = [];

    for (const game of games) {
      try {
        // Check if content already exists
        const { data: existingContent } = await supabase
          .from("lootbox_content")
          .select("id, overview_html")
          .eq("game_id", game.id)
          .single();

        // Skip if content already exists and is substantial (unless force mode)
        if (!forceAll && existingContent?.overview_html && existingContent.overview_html.length > 500) {
          results.push({ slug: game.slug, status: "skipped" });
          continue;
        }

        // Look up game-specific content from our content library
        const content = ALL_GAME_CONTENT[game.slug];

        if (!content) {
          results.push({
            slug: game.slug,
            status: "skipped",
            source: "no-content-entry",
          });
          continue;
        }

        // Calculate lootboxes_score from the 4 scoring dimensions
        const lootboxesScore = (
          (content.score_transparency || 5) +
          (content.score_value || 5) +
          (content.score_fairness || 5) +
          (content.score_player_control || 5)
        ) / 4;

        // Upsert into lootbox_content
        const { error: upsertError } = await supabase.from("lootbox_content").upsert(
          {
            game_id: game.id,
            ...content,
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "game_id" }
        );

        if (upsertError) {
          throw upsertError;
        }

        // Update games table with lootboxes_score
        const { error: gameUpdateError } = await supabase
          .from("games")
          .update({ lootboxes_score: parseFloat(lootboxesScore.toFixed(1)) })
          .eq("id", game.id);

        if (gameUpdateError) {
          throw gameUpdateError;
        }

        results.push({
          slug: game.slug,
          status: existingContent ? "updated" : "created",
          source: "content-library",
        });
      } catch (err: any) {
        results.push({
          slug: game.slug,
          status: "error",
          error: err.message,
        });
      }
    }

    const successCount = results.filter(
      (r) => r.status === "created" || r.status === "updated"
    ).length;

    return NextResponse.json({
      status: "completed",
      batch: { offset, size: batchSize },
      processed: games.length,
      successful: successCount,
      contentLibrarySize: Object.keys(ALL_GAME_CONTENT).length,
      results,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Enrichment failed" },
      { status: 500 }
    );
  }
}
