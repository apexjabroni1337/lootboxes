import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * GET /api/games/by-slugs?slugs=slug1,slug2,slug3
 *
 * Fetch basic game info for a list of slugs (used by wishlist page).
 */
export async function GET(request: NextRequest) {
  const slugsParam = request.nextUrl.searchParams.get("slugs");
  if (!slugsParam) {
    return NextResponse.json({ games: [] });
  }

  const slugs = slugsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 100); // cap at 100

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

  return NextResponse.json({ games: data || [] });
}
