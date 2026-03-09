import { getWeaponCasesWithItems } from "@/lib/cs2-cases";
import TradeUpClient from "./TradeUpClient";
import type { TradeUpCase, TradeUpItem } from "./TradeUpClient";

export const revalidate = 86400; // ISR: revalidate daily

export default async function TradeUpPage() {
  const casesWithItems = await getWeaponCasesWithItems();

  // Serialize into the shape the client expects
  const cases: TradeUpCase[] = casesWithItems.map((c) => ({
    id: c.id,
    name: c.name,
    image: c.image,
    first_sale_date: c.first_sale_date,
  }));

  const itemsByCase: Record<string, TradeUpItem[]> = {};
  for (const c of casesWithItems) {
    itemsByCase[c.id] = c.items.map((item) => ({
      id: item.id,
      crate_id: item.crate_id,
      name: item.name,
      rarity_name: item.rarity_name,
      rarity_color: item.rarity_color,
      image: item.image,
      is_rare_special: item.is_rare_special,
    }));
  }

  return <TradeUpClient cases={cases} itemsByCase={itemsByCase} />;
}
