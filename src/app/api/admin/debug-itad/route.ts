import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * Debug endpoint: Shows raw ITAD API response to help fix data mapping.
 * Usage: GET /api/admin/debug-itad?secret=YOUR_CRON_SECRET
 */
export async function GET(request: NextRequest) {
  try {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ITAD_KEY = process.env.ITAD_API_KEY;
  if (!ITAD_KEY) {
    return NextResponse.json({ error: "Missing ITAD_API_KEY env var" }, { status: 500 });
  }

  const supabase = createServerClient();
  const ITAD_BASE = "https://api.isthereanydeal.com";

  // Get first 2 games with ITAD IDs
  const { data: games } = await supabase
    .from("games")
    .select("id, title, slug, itad_id")
    .not("itad_id", "is", null)
    .limit(2);

  if (!games?.length) {
    return NextResponse.json({ error: "No games with ITAD IDs found" });
  }

  const itadIds = games.map((g) => g.itad_id!);

  // Call ITAD prices endpoint and capture raw response
  const pricesUrl = new URL(`${ITAD_BASE}/games/prices/v2`);
  pricesUrl.searchParams.set("key", ITAD_KEY);
  pricesUrl.searchParams.set("country", "US");
  pricesUrl.searchParams.set("nondeals", "true");

  const pricesRes = await fetch(pricesUrl.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itadIds),
  });

  const pricesRaw = await pricesRes.text();
  let pricesJson: any = null;
  try {
    pricesJson = JSON.parse(pricesRaw);
  } catch {
    // keep raw text
  }

  return NextResponse.json({
    games: games.map((g) => ({ title: g.title, itad_id: g.itad_id })),
    itadIds,
    pricesStatus: pricesRes.status,
    pricesHeaders: Object.fromEntries(pricesRes.headers.entries()),
    pricesRaw: pricesJson || pricesRaw,
    // Show structure hints
    pricesType: typeof pricesJson,
    pricesIsArray: Array.isArray(pricesJson),
    pricesKeys: pricesJson && typeof pricesJson === "object" ? Object.keys(pricesJson).slice(0, 5) : null,
  });
  } catch (err: any) {
    console.error("[admin/debug-itad] Unhandled error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
