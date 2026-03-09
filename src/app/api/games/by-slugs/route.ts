import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET /api/games/by-slugs?slugs=slug1,slug2,slug3
 *
 * Fetch basic game info for a list of slugs (used by wishlist page).
 */
export async function GET(request: NextRequest) {
  try {
    const slugsParam = request.nextUrl.searchParams.get("slugs");
    if (!slugsParam) {
      return NextResponse.json({ games: [] });
    }

    // Validate: slugs should only contain alphanumeric, hyphens, and underscores
    const slugRegex = /^[a-z0-9_-]+$/i;
    const slugs = slugsParam
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && slugRegex.test(s))
      .slice(0, 100);

    if (slugs.length === 0) {
      return NextResponse.json({ games: [] });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("games")
      .select("slug, title, cover_image, screenshot_image, release_date, genres")
      .in("slug", slugs);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { games: data || [] },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch (err: any) {
    console.error("[API /games/by-slugs] Error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
