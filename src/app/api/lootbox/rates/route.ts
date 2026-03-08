import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const gameId = request.nextUrl.searchParams.get("gameId");

  if (!gameId) {
    return NextResponse.json({ error: "gameId is required" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("drop_rates")
    .select("item_name, rarity, drop_rate_pct, source")
    .eq("game_id", gameId)
    .order("drop_rate_pct", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ rates: data || [] });
}
