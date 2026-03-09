import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ISR: cache for 5 minutes, serve stale while revalidating in background.
// This eliminates cold-start 500s — stale cache is served instantly while
// the serverless function revalidates behind the scenes.
export const revalidate = 300;

// Module-level client persists across warm invocations (no per-request overhead)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
  const { data, error } = await supabase
    .from("games")
    .select(
      "id, title, slug, lootboxes_score, loot_system_type, lootbox_content(cost_per_pull, has_pity_system, score_transparency, score_value)"
    )
    .not("lootboxes_score", "is", null)
    .order("title")
    .limit(2000);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Flatten lootbox_content join into top-level fields
  const games = (data || []).map((g: Record<string, unknown>) => {
    const content = Array.isArray(g.lootbox_content)
      ? g.lootbox_content[0]
      : g.lootbox_content;
    return {
      id: g.id,
      title: g.title,
      slug: g.slug,
      lootboxes_score: g.lootboxes_score,
      loot_system_type: g.loot_system_type,
      cost_per_pull: content?.cost_per_pull ?? null,
      has_pity_system: content?.has_pity_system ?? false,
      score_transparency: content?.score_transparency ?? 0,
      score_value: content?.score_value ?? 0,
    };
  });

  return NextResponse.json({ games });
  } catch (err: any) {
    console.error("[API /lootbox/games] Error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
