import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * POST /api/admin/seed-cs2-cases
 *
 * Accepts a small batch of crates (with their items) and upserts them.
 * The heavy fetch of crates.json happens client-side in the admin page,
 * so this endpoint only does fast DB writes.
 *
 * Body: { secret: string, crates: CratePayload[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, crates } = body;

    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!crates || !Array.isArray(crates) || crates.length === 0) {
      return NextResponse.json({ error: "No crates provided" }, { status: 400 });
    }

    const supabase = createServerClient();
    let cratesUpserted = 0;
    let itemsUpserted = 0;
    const errors: string[] = [];

    // Upsert crates in bulk first
    const crateRows = crates.map((c: any) => ({
      bymykel_id: c.bymykel_id,
      name: c.name,
      type: c.type,
      description: c.description || null,
      image: c.image || null,
      first_sale_date: c.first_sale_date || null,
    }));

    const { error: crateErr } = await supabase
      .from("cs2_crates")
      .upsert(crateRows, { onConflict: "bymykel_id" });

    if (crateErr) {
      return NextResponse.json({ error: `Crate upsert failed: ${crateErr.message}` }, { status: 500 });
    }
    cratesUpserted = crateRows.length;

    // Fetch back the IDs for these crates
    const bymykelIds = crateRows.map((c: any) => c.bymykel_id);
    const { data: idRows, error: idErr } = await supabase
      .from("cs2_crates")
      .select("id, bymykel_id")
      .in("bymykel_id", bymykelIds);

    if (idErr || !idRows) {
      return NextResponse.json({ error: `ID fetch failed: ${idErr?.message}` }, { status: 500 });
    }

    const idMap = new Map<string, number>();
    for (const row of idRows) {
      idMap.set(row.bymykel_id, row.id);
    }

    // Build and upsert all items
    const allItems: any[] = [];
    for (const crate of crates) {
      const crateId = idMap.get(crate.bymykel_id);
      if (!crateId) continue;

      for (const item of crate.items || []) {
        allItems.push({
          crate_id: crateId,
          bymykel_id: item.bymykel_id,
          name: item.name,
          rarity_name: item.rarity_name || "Unknown",
          rarity_color: item.rarity_color || null,
          image: item.image || null,
          is_rare_special: item.is_rare_special || false,
        });
      }
    }

    if (allItems.length > 0) {
      // Batch in groups of 500
      for (let i = 0; i < allItems.length; i += 500) {
        const batch = allItems.slice(i, i + 500);
        const { error: itemErr } = await supabase
          .from("cs2_crate_items")
          .upsert(batch, { onConflict: "crate_id,bymykel_id" });

        if (itemErr) {
          errors.push(`Item batch ${i}: ${itemErr.message}`);
        } else {
          itemsUpserted += batch.length;
        }
      }
    }

    return NextResponse.json({
      success: true,
      cratesUpserted,
      itemsUpserted,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err: any) {
    console.error("[seed-cs2-cases] Error:", err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}

/**
 * GET - kept for simple status check
 */
export async function GET(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get("secret");
    if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerClient();
    const { count: totalCrates } = await supabase
      .from("cs2_crates")
      .select("id", { count: "exact", head: true });
    const { count: totalItems } = await supabase
      .from("cs2_crate_items")
      .select("id", { count: "exact", head: true });

    return NextResponse.json({ totalCrates, totalItems });
  } catch (err: any) {
    console.error("[seed-cs2-cases GET] Error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
