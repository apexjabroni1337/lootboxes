/**
 * Master index of all game-specific lootbox analysis content.
 *
 * Each file covers one monetization category with detailed,
 * game-specific analysis for every game in our database.
 */

import type { LootboxContent } from "./types";
import GACHA_PART1 from "./gacha-part1";
import GACHA_PART2 from "./gacha-part2";
import GACHA_PART3 from "./gacha-part3";
import LOOT_BOX_GAMES from "./loot-box-games";
import CARD_PACK_GAMES from "./card-pack-games";
import BATTLE_PASS_GAMES from "./battle-pass-games";
import COSMETIC_SHOP_PART1 from "./cosmetic-shop-part1";
import COSMETIC_SHOP_PART2 from "./cosmetic-shop-part2";
import COSMETIC_SHOP_PART3 from "./cosmetic-shop-part3";

export type { LootboxContent } from "./types";

/**
 * All game-specific content entries merged into a single lookup.
 * ~165 games with unique, hand-written analysis.
 */
export const ALL_GAME_CONTENT: Record<string, Partial<LootboxContent>> = {
  ...GACHA_PART1,
  ...GACHA_PART2,
  ...GACHA_PART3,
  ...LOOT_BOX_GAMES,
  ...CARD_PACK_GAMES,
  ...BATTLE_PASS_GAMES,
  ...COSMETIC_SHOP_PART1,
  ...COSMETIC_SHOP_PART2,
  ...COSMETIC_SHOP_PART3,
};
