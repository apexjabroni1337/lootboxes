import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const maxDuration = 120; // ByMykel crates.json is large

const BYMYKEL_CRATES_URL =
  "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/crates.json";

// ── ByMykel Types ──

interface ByMykelRarity {
  id: string;
  name: string;
  color: string;
}

interface ByMykelCrateItem {
  id: string;
  name: string;
  rarity?: ByMykelRarity;
  image?: string;
}

interface ByMykelCrate {
  id: string;
  name: string;
  description?: string | null;
  type?: string;
  first_sale_date?: string;
  image?: string;
  contains?: ByMykelCrateItem[];
  contains_rare?: ByMykelCrateItem[];
}

/**
 * GET /api/admin/seed-cs2-cases?secret=CRON_SECRET
 *
 * Fetches ALL cases/capsules from ByMykel CSGO-API and upserts them into
 * cs2_crates + cs2_crate_items tables.
 *
 * Run via browser:
 * https://lootboxes-ruddy.vercel.app/api/admin/seed-cs2-cases?secret=lootboxes-cron-2026
 */
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Step 1: Fetch ByMykel crates data
    const res = await fetch(BYMYKEL_CRATES_URL, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { error: `ByMykel fetch failed: ${res.status}` },
        { status: 502 }
      );
    }

    const crates: ByMykelCrate[] = await res.json();
    console.log(`[seed-cs2-cases] Fetched ${crates.length} crates from ByMykel`);

    const supabase = createServerClient();

    let cratesUpserted = 0;
    let itemsUpserted = 0;
    let errors: string[] = [];

    // Step 2: Process each crate
    for (const crate of crates) {
      if (!crate.id || !crate.name) continue;

      // Determine crate type from ByMykel's type field or name
      const crateType = classifyCrateType(crate);

      // Upsert the crate
      const { data: crateRow, error: crateErr } = await supabase
        .from("cs2_crates")
        .upsert(
          {
            bymykel_id: crate.id,
            name: crate.name,
            type: crateType,
            description: crate.description || null,
            image: crate.image || null,
            first_sale_date: crate.first_sale_date || null,
          },
          { onConflict: "bymykel_id" }
        )
        .select("id")
        .single();

      if (crateErr || !crateRow) {
        errors.push(`Crate "${crate.name}": ${crateErr?.message}`);
        continue;
      }

      cratesUpserted++;
      const crateId = crateRow.id;

      // Step 3: Upsert items from contains[] (normal drops)
      const normalItems = (crate.contains || []).map((item) => ({
        crate_id: crateId,
        bymykel_id: item.id,
        name: item.name,
        rarity_name: item.rarity?.name || "Unknown",
        rarity_color: item.rarity?.color || null,
        image: item.image || null,
        is_rare_special: false,
      }));

      // Step 4: Upsert items from contains_rare[] (knives, gloves, etc.)
      const rareItems = (crate.contains_rare || []).map((item) => ({
        crate_id: crateId,
        bymykel_id: item.id,
        name: item.name,
        rarity_name: item.rarity?.name || "Extraordinary",
        rarity_color: item.rarity?.color || "#e4ae39",
        image: item.image || null,
        is_rare_special: true,
      }));

      const allItems = [...normalItems, ...rareItems];

      if (allItems.length > 0) {
        // Batch upsert items (Supabase handles up to 1000 per call)
        const BATCH = 500;
        for (let i = 0; i < allItems.length; i += BATCH) {
          const batch = allItems.slice(i, i + BATCH);
          const { error: itemErr } = await supabase
            .from("cs2_crate_items")
            .upsert(batch, {
              onConflict: "crate_id,bymykel_id",
            });

          if (itemErr) {
            errors.push(`Items for "${crate.name}" batch ${i}: ${itemErr.message}`);
          } else {
            itemsUpserted += batch.length;
          }
        }
      }
    }

    // Step 5: Get final counts
    const { count: totalCrates } = await supabase
      .from("cs2_crates")
      .select("id", { count: "exact", head: true });

    const { count: totalItems } = await supabase
      .from("cs2_crate_items")
      .select("id", { count: "exact", head: true });

    // Count by type
    const { data: typeCounts } = await supabase
      .from("cs2_crates")
      .select("type");

    const typeBreakdown: Record<string, number> = {};
    for (const row of typeCounts || []) {
      typeBreakdown[row.type] = (typeBreakdown[row.type] || 0) + 1;
    }

    return NextResponse.json({
      success: true,
      source: "ByMykel CSGO-API crates.json",
      fetched: crates.length,
      cratesUpserted,
      itemsUpserted,
      totalCrates,
      totalItems,
      typeBreakdown,
      errors: errors.length > 0 ? errors.slice(0, 20) : undefined,
    });
  } catch (err: any) {
    console.error("[seed-cs2-cases] Error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * Classify a crate into our type taxonomy based on ByMykel's type field and name.
 */
function classifyCrateType(crate: ByMykelCrate): string {
  const name = crate.name.toLowerCase();
  const type = (crate.type || "").toLowerCase();

  // Weapon cases
  if (type.includes("case") || name.includes("case")) return "Weapon Case";
  // Souvenir packages
  if (type.includes("souvenir") || name.includes("souvenir")) return "Souvenir Package";
  // Sticker capsules
  if (name.includes("sticker") && (name.includes("capsule") || name.includes("collection")))
    return "Sticker Capsule";
  // Patch packs
  if (name.includes("patch") && (name.includes("pack") || name.includes("collection")))
    return "Patch Pack";
  // Graffiti boxes
  if (name.includes("graffiti")) return "Graffiti Box";
  // Music kit boxes
  if (name.includes("music kit")) return "Music Kit Box";
  // Pin capsules
  if (name.includes("pin") && name.includes("capsule")) return "Pin Capsule";
  // Agent capsules
  if (name.includes("agent")) return "Agent";
  // Capsules (generic)
  if (name.includes("capsule") || name.includes("collection")) return "Capsule";

  return "Other";
}
