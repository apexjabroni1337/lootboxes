import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
  const supabase = createServerClient();

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

  return NextResponse.json(
    { games },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
  } catch (err: any) {
    console.error("[API /lootbox/games] Error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
