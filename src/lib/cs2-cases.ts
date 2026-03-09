/**
 * CS2 Case & Item Database Access
 *
 * Queries cs2_crates and cs2_crate_items tables populated by the
 * seed-cs2-cases admin endpoint (sourced from ByMykel CSGO-API).
 */

import { createServerClient } from "@/lib/supabase";

// ── Types ──

export interface CS2Crate {
  id: string;
  bymykel_id: string;
  name: string;
  type: string;
  description: string | null;
  image: string | null;
  first_sale_date: string | null;
  item_count?: number;
}

export interface CS2CrateItem {
  id: string;
  crate_id: string;
  bymykel_id: string;
  name: string;
  rarity_name: string;
  rarity_color: string | null;
  image: string | null;
  is_rare_special: boolean;
}

// ── Rarity sorting order (highest tier first) ──

const RARITY_ORDER: Record<string, number> = {
  "Extraordinary": 0,
  "Covert": 1,
  "Classified": 2,
  "Restricted": 3,
  "Mil-Spec Grade": 4,
  "Mil-Spec": 4,
  "Industrial Grade": 5,
  "Consumer Grade": 6,
  "Base Grade": 7,
  "Distinguished": 1,
  "Exceptional": 2,
  "Superior": 3,
  "Master": 1,
  "High Grade": 3,
  "Remarkable": 2,
  "Exotic": 1,
};

function raritySort(a: CS2CrateItem, b: CS2CrateItem): number {
  const aOrder = RARITY_ORDER[a.rarity_name] ?? 99;
  const bOrder = RARITY_ORDER[b.rarity_name] ?? 99;
  if (aOrder !== bOrder) return aOrder - bOrder;
  return a.name.localeCompare(b.name);
}

// ── Queries ──

/**
 * Get all crates, optionally filtered by type.
 * Returns newest first (by first_sale_date).
 */
export async function getAllCrates(type?: string): Promise<CS2Crate[]> {
  const supabase = createServerClient();
  let query = supabase
    .from("cs2_crates")
    .select("*")
    .order("first_sale_date", { ascending: false, nullsFirst: false });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[cs2-cases] getAllCrates error:", error.message);
    return [];
  }
  return data || [];
}

/**
 * Get weapon cases only (for the simulator).
 */
export async function getWeaponCases(): Promise<CS2Crate[]> {
  return getAllCrates("Weapon Case");
}

/**
 * Get a single crate by its name (case-insensitive partial match).
 */
export async function getCrateByName(name: string): Promise<CS2Crate | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("cs2_crates")
    .select("*")
    .ilike("name", `%${name}%`)
    .limit(1)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Get a single crate by slug (derived from name).
 */
export async function getCrateBySlug(slug: string): Promise<CS2Crate | null> {
  const supabase = createServerClient();
  // Convert slug back to approximate name for matching
  const nameSearch = slug.replace(/-/g, " ");
  const { data, error } = await supabase
    .from("cs2_crates")
    .select("*")
    .ilike("name", `%${nameSearch}%`)
    .limit(1)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Get all items in a crate, sorted by rarity (rarest first).
 */
export async function getCrateItems(crateId: string): Promise<CS2CrateItem[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("cs2_crate_items")
    .select("*")
    .eq("crate_id", crateId);

  if (error) {
    console.error("[cs2-cases] getCrateItems error:", error.message);
    return [];
  }

  const items = data || [];
  items.sort(raritySort);
  return items;
}

/**
 * Get all weapon cases with their item counts.
 */
export async function getWeaponCasesWithCounts(): Promise<CS2Crate[]> {
  const supabase = createServerClient();

  // Get weapon cases
  const { data: cases, error } = await supabase
    .from("cs2_crates")
    .select("*")
    .eq("type", "Weapon Case")
    .order("first_sale_date", { ascending: false, nullsFirst: false });

  if (error || !cases) return [];

  // Get item counts per crate in a single query
  const caseIds = cases.map((c) => c.id);
  const { data: countData } = await supabase
    .from("cs2_crate_items")
    .select("crate_id")
    .in("crate_id", caseIds)
    .limit(50000);

  const counts: Record<string, number> = {};
  for (const row of countData || []) {
    counts[row.crate_id] = (counts[row.crate_id] || 0) + 1;
  }

  return cases.map((c) => ({
    ...c,
    item_count: counts[c.id] || 0,
  }));
}

/**
 * Get all crate types that exist in the database.
 */
export async function getCrateTypes(): Promise<string[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("cs2_crates")
    .select("type");

  if (!data) return [];

  const types = new Set<string>();
  for (const row of data) {
    types.add(row.type);
  }
  return Array.from(types).sort();
}

/**
 * Derive a URL slug from a crate name.
 */
export function crateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Map ByMykel rarity names to our standard rarity tiers for the simulator.
 * CS2 weapon cases use these specific rarity names.
 */
export function mapToSimulatorRarity(rarityName: string): string {
  const r = rarityName.toLowerCase();
  if (r.includes("covert")) return "Covert (Red)";
  if (r.includes("classified")) return "Classified (Pink)";
  if (r.includes("restricted")) return "Restricted (Purple)";
  if (r.includes("mil-spec") || r.includes("mil spec")) return "Mil-Spec (Blue)";
  if (r.includes("industrial")) return "Industrial (Light Blue)";
  if (r.includes("consumer")) return "Consumer (White)";
  if (r.includes("extraordinary") || r.includes("contraband")) return "Rare Special (Gold)";
  return rarityName;
}
