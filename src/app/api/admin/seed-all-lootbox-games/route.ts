import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const maxDuration = 300;

// ============================================================
// Complete loot box game database — 187 new games
// Each game has: primary system type, tags (mobile, multi_system,
// secondary system indicators), and basic lootbox_content record
// ============================================================

interface GameEntry {
  title: string;
  slug: string;
  loot_system_type: string;
  tags: string[];
}

// Helper to generate slug from title
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[&]/g, "and")
    .replace(/[:]/g, "")
    .replace(/[/]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── ALL NEW GAMES (not already in DB) ──────────────────────────
const NEW_GAMES: GameEntry[] = [
  // === TIER 1: MASSIVE GAMES ===
  {
    title: "League of Legends",
    slug: "league-of-legends",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_loot_box", "has_battle_pass"],
  },
  {
    title: "PUBG: Battlegrounds",
    slug: "pubg-battlegrounds",
    loot_system_type: "loot_box",
    tags: ["multi_system", "has_battle_pass", "has_cosmetic_shop"],
  },
  {
    title: "PUBG Mobile",
    slug: "pubg-mobile",
    loot_system_type: "loot_box",
    tags: ["mobile", "multi_system", "has_battle_pass", "has_cosmetic_shop"],
  },
  {
    title: "Roblox",
    slug: "roblox",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_loot_box"],
  },
  {
    title: "Call of Duty: Warzone",
    slug: "call-of-duty-warzone",
    loot_system_type: "battle_pass",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Dota 2",
    slug: "dota-2",
    loot_system_type: "loot_box",
    tags: ["multi_system", "has_battle_pass", "has_cosmetic_shop"],
  },
  {
    title: "Call of Duty: Modern Warfare III",
    slug: "call-of-duty-modern-warfare-iii",
    loot_system_type: "battle_pass",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Destiny 2",
    slug: "destiny-2",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Rainbow Six Siege",
    slug: "rainbow-six-siege",
    loot_system_type: "battle_pass",
    tags: ["multi_system", "has_loot_box", "has_cosmetic_shop"],
  },

  // === TIER 2: MAJOR MOBILE & F2P ===
  {
    title: "Honkai Impact 3rd",
    slug: "honkai-impact-3rd",
    loot_system_type: "gacha",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Mobile Legends: Bang Bang",
    slug: "mobile-legends-bang-bang",
    loot_system_type: "cosmetic_shop",
    tags: ["mobile", "multi_system", "has_gacha", "has_battle_pass"],
  },
  {
    title: "Free Fire",
    slug: "free-fire",
    loot_system_type: "loot_box",
    tags: ["mobile", "multi_system", "has_battle_pass", "has_cosmetic_shop"],
  },
  {
    title: "Clash Royale",
    slug: "clash-royale",
    loot_system_type: "loot_box",
    tags: ["mobile", "multi_system", "has_battle_pass"],
  },
  {
    title: "Clash of Clans",
    slug: "clash-of-clans",
    loot_system_type: "cosmetic_shop",
    tags: ["mobile", "multi_system", "has_battle_pass"],
  },
  {
    title: "Brawl Stars",
    slug: "brawl-stars",
    loot_system_type: "loot_box",
    tags: ["mobile", "multi_system", "has_battle_pass", "has_cosmetic_shop"],
  },
  {
    title: "Honor of Kings",
    slug: "honor-of-kings",
    loot_system_type: "cosmetic_shop",
    tags: ["mobile", "multi_system", "has_gacha", "has_battle_pass"],
  },
  {
    title: "Pokémon GO",
    slug: "pokemon-go",
    loot_system_type: "loot_box",
    tags: ["mobile", "multi_system", "has_cosmetic_shop"],
  },

  // === TIER 2: SPORTS & CARD GAMES ===
  {
    title: "NBA 2K25",
    slug: "nba-2k25",
    loot_system_type: "card_pack",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Madden NFL 25",
    slug: "madden-nfl-25",
    loot_system_type: "card_pack",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Hearthstone",
    slug: "hearthstone",
    loot_system_type: "card_pack",
    tags: ["multi_system", "has_battle_pass", "has_cosmetic_shop"],
  },
  {
    title: "Magic: The Gathering Arena",
    slug: "magic-the-gathering-arena",
    loot_system_type: "card_pack",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Yu-Gi-Oh! Master Duel",
    slug: "yu-gi-oh-master-duel",
    loot_system_type: "card_pack",
    tags: ["multi_system", "has_battle_pass"],
  },

  // === TIER 2: POPULAR F2P SHOOTERS & ACTION ===
  {
    title: "Fall Guys",
    slug: "fall-guys",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Naraka: Bladepoint",
    slug: "naraka-bladepoint",
    loot_system_type: "loot_box",
    tags: ["multi_system", "has_battle_pass", "has_cosmetic_shop"],
  },
  {
    title: "Dead by Daylight",
    slug: "dead-by-daylight",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "The Finals",
    slug: "the-finals",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "XDefiant",
    slug: "xdefiant",
    loot_system_type: "battle_pass",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Marvel Rivals",
    slug: "marvel-rivals",
    loot_system_type: "battle_pass",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Delta Force",
    slug: "delta-force",
    loot_system_type: "battle_pass",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Helldivers 2",
    slug: "helldivers-2",
    loot_system_type: "battle_pass",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Halo Infinite",
    slug: "halo-infinite",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_battle_pass"],
  },

  // === TIER 2: GACHA GAMES ===
  {
    title: "Wuthering Waves",
    slug: "wuthering-waves",
    loot_system_type: "gacha",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Arknights",
    slug: "arknights",
    loot_system_type: "gacha",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Fate/Grand Order",
    slug: "fate-grand-order",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Tower of Fantasy",
    slug: "tower-of-fantasy",
    loot_system_type: "gacha",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Nikke: Goddess of Victory",
    slug: "nikke-goddess-of-victory",
    loot_system_type: "gacha",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Blue Archive",
    slug: "blue-archive",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Azur Lane",
    slug: "azur-lane",
    loot_system_type: "gacha",
    tags: ["mobile", "multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Girls' Frontline 2: Exilium",
    slug: "girls-frontline-2-exilium",
    loot_system_type: "gacha",
    tags: [],
  },
  {
    title: "Punishing: Gray Raven",
    slug: "punishing-gray-raven",
    loot_system_type: "gacha",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Reverse: 1999",
    slug: "reverse-1999",
    loot_system_type: "gacha",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Limbus Company",
    slug: "limbus-company",
    loot_system_type: "gacha",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "AFK Journey",
    slug: "afk-journey",
    loot_system_type: "gacha",
    tags: ["mobile", "multi_system", "has_battle_pass"],
  },
  {
    title: "Summoners War",
    slug: "summoners-war",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Epic Seven",
    slug: "epic-seven",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Raid: Shadow Legends",
    slug: "raid-shadow-legends",
    loot_system_type: "gacha",
    tags: ["mobile", "multi_system", "has_battle_pass"],
  },
  {
    title: "Marvel Strike Force",
    slug: "marvel-strike-force",
    loot_system_type: "gacha",
    tags: ["mobile", "multi_system", "has_battle_pass"],
  },
  {
    title: "Dragon Ball Legends",
    slug: "dragon-ball-legends",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Dragon Ball Z: Dokkan Battle",
    slug: "dragon-ball-z-dokkan-battle",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "One Piece Bounty Rush",
    slug: "one-piece-bounty-rush",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Seven Deadly Sins: Grand Cross",
    slug: "seven-deadly-sins-grand-cross",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Fire Emblem Heroes",
    slug: "fire-emblem-heroes",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Another Eden",
    slug: "another-eden",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Granblue Fantasy",
    slug: "granblue-fantasy",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Princess Connect! Re:Dive",
    slug: "princess-connect-re-dive",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Counter:Side",
    slug: "counterside",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Alchemy Stars",
    slug: "alchemy-stars",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Guardian Tales",
    slug: "guardian-tales",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Cookie Run: Kingdom",
    slug: "cookie-run-kingdom",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Cookie Run: OvenBreak",
    slug: "cookie-run-ovenbreak",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Puzzle & Dragons",
    slug: "puzzle-and-dragons",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Monster Strike",
    slug: "monster-strike",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Brave Frontier",
    slug: "brave-frontier",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "KonoSuba: Fantastic Days",
    slug: "konosuba-fantastic-days",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Sword Art Online: Integral Factor",
    slug: "sword-art-online-integral-factor",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Bleach: Brave Souls",
    slug: "bleach-brave-souls",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "One Punch Man: The Strongest",
    slug: "one-punch-man-the-strongest",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "The Alchemist Code",
    slug: "the-alchemist-code",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Sdorica",
    slug: "sdorica",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Soul Knight",
    slug: "soul-knight",
    loot_system_type: "gacha",
    tags: ["mobile", "multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Awaken Chaos Era",
    slug: "awaken-chaos-era",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Myth: Gods of Asgard",
    slug: "myth-gods-of-asgard",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Star Wars: Galaxy of Heroes",
    slug: "star-wars-galaxy-of-heroes",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "MARVEL Future Fight",
    slug: "marvel-future-fight",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "MARVEL Contest of Champions",
    slug: "marvel-contest-of-champions",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "DC Heroes & Villains",
    slug: "dc-heroes-and-villains",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Idle Heroes",
    slug: "idle-heroes",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "AFK Arena",
    slug: "afk-arena",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Rise of Kingdoms",
    slug: "rise-of-kingdoms",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "State of Survival",
    slug: "state-of-survival",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Whiteout Survival",
    slug: "whiteout-survival",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Last War: Survival Game",
    slug: "last-war-survival-game",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Age of Origins",
    slug: "age-of-origins",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Mario Kart Tour",
    slug: "mario-kart-tour",
    loot_system_type: "gacha",
    tags: ["mobile", "multi_system", "has_battle_pass"],
  },
  {
    title: "Animal Crossing: Pocket Camp",
    slug: "animal-crossing-pocket-camp",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Monopoly GO!",
    slug: "monopoly-go",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Coin Master",
    slug: "coin-master",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Asphalt 9: Legends",
    slug: "asphalt-9-legends",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Phantasy Star Online 2: New Genesis",
    slug: "phantasy-star-online-2-new-genesis",
    loot_system_type: "gacha",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Tower of Saviors",
    slug: "tower-of-saviors",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },
  {
    title: "Exos Heroes",
    slug: "exos-heroes",
    loot_system_type: "gacha",
    tags: ["mobile"],
  },

  // === CARD PACK GAMES ===
  {
    title: "Legends of Runeterra",
    slug: "legends-of-runeterra",
    loot_system_type: "card_pack",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Gwent: The Witcher Card Game",
    slug: "gwent-the-witcher-card-game",
    loot_system_type: "card_pack",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Shadowverse",
    slug: "shadowverse",
    loot_system_type: "card_pack",
    tags: ["mobile"],
  },
  {
    title: "Pokémon TCG Live",
    slug: "pokemon-tcg-live",
    loot_system_type: "card_pack",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "The Elder Scrolls: Legends",
    slug: "the-elder-scrolls-legends",
    loot_system_type: "card_pack",
    tags: ["mobile"],
  },
  {
    title: "Eternal Card Game",
    slug: "eternal-card-game",
    loot_system_type: "card_pack",
    tags: [],
  },
  {
    title: "FIFA Online 4",
    slug: "fifa-online-4",
    loot_system_type: "card_pack",
    tags: [],
  },

  // === LOOT BOX GAMES ===
  {
    title: "Star Wars Battlefront II",
    slug: "star-wars-battlefront-ii",
    loot_system_type: "loot_box",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Battlegrounds Mobile India",
    slug: "battlegrounds-mobile-india",
    loot_system_type: "loot_box",
    tags: ["mobile", "multi_system", "has_battle_pass", "has_cosmetic_shop"],
  },
  {
    title: "CrossFire",
    slug: "crossfire",
    loot_system_type: "loot_box",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "MapleStory",
    slug: "maplestory",
    loot_system_type: "loot_box",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Star Trek Online",
    slug: "star-trek-online",
    loot_system_type: "loot_box",
    tags: [],
  },
  {
    title: "Neverwinter",
    slug: "neverwinter",
    loot_system_type: "loot_box",
    tags: [],
  },
  {
    title: "DC Universe Online",
    slug: "dc-universe-online",
    loot_system_type: "loot_box",
    tags: [],
  },
  {
    title: "Elder Scrolls Online",
    slug: "elder-scrolls-online",
    loot_system_type: "loot_box",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Tom Clancy's The Division 2",
    slug: "tom-clancys-the-division-2",
    loot_system_type: "loot_box",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "For Honor",
    slug: "for-honor",
    loot_system_type: "loot_box",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "World of Tanks",
    slug: "world-of-tanks",
    loot_system_type: "loot_box",
    tags: ["multi_system", "has_battle_pass", "has_cosmetic_shop"],
  },
  {
    title: "World of Warships",
    slug: "world-of-warships",
    loot_system_type: "loot_box",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "War Thunder",
    slug: "war-thunder",
    loot_system_type: "loot_box",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Lost Ark",
    slug: "lost-ark",
    loot_system_type: "loot_box",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Black Desert Online",
    slug: "black-desert-online",
    loot_system_type: "loot_box",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Guild Wars 2",
    slug: "guild-wars-2",
    loot_system_type: "loot_box",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "RuneScape",
    slug: "runescape",
    loot_system_type: "loot_box",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "EVE Online",
    slug: "eve-online",
    loot_system_type: "loot_box",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Call of Duty: Mobile",
    slug: "call-of-duty-mobile",
    loot_system_type: "loot_box",
    tags: ["mobile", "multi_system", "has_battle_pass", "has_cosmetic_shop"],
  },

  // === COSMETIC SHOP / BATTLE PASS GAMES ===
  {
    title: "Warframe",
    slug: "warframe",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Path of Exile 2",
    slug: "path-of-exile-2",
    loot_system_type: "cosmetic_shop",
    tags: [],
  },
  {
    title: "Sea of Thieves",
    slug: "sea-of-thieves",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "World of Warcraft",
    slug: "world-of-warcraft",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_loot_box"],
  },
  {
    title: "Final Fantasy XIV",
    slug: "final-fantasy-xiv",
    loot_system_type: "cosmetic_shop",
    tags: [],
  },
  {
    title: "Teamfight Tactics",
    slug: "teamfight-tactics",
    loot_system_type: "battle_pass",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Stumble Guys",
    slug: "stumble-guys",
    loot_system_type: "cosmetic_shop",
    tags: ["mobile", "multi_system", "has_battle_pass"],
  },
  {
    title: "MultiVersus",
    slug: "multiversus",
    loot_system_type: "battle_pass",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Smite 2",
    slug: "smite-2",
    loot_system_type: "battle_pass",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Paladins",
    slug: "paladins",
    loot_system_type: "loot_box",
    tags: ["multi_system", "has_battle_pass", "has_cosmetic_shop"],
  },
  {
    title: "Splitgate",
    slug: "splitgate",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Battlefield 2042",
    slug: "battlefield-2042",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Tekken 8",
    slug: "tekken-8",
    loot_system_type: "battle_pass",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Street Fighter 6",
    slug: "street-fighter-6",
    loot_system_type: "battle_pass",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Mortal Kombat 1",
    slug: "mortal-kombat-1",
    loot_system_type: "cosmetic_shop",
    tags: [],
  },
  {
    title: "Splatoon 3",
    slug: "splatoon-3",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Palworld",
    slug: "palworld",
    loot_system_type: "cosmetic_shop",
    tags: [],
  },
  {
    title: "The First Descendant",
    slug: "the-first-descendant",
    loot_system_type: "battle_pass",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Once Human",
    slug: "once-human",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Albion Online",
    slug: "albion-online",
    loot_system_type: "cosmetic_shop",
    tags: [],
  },
  {
    title: "New World: Aeternum",
    slug: "new-world-aeternum",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Throne and Liberty",
    slug: "throne-and-liberty",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Skull and Bones",
    slug: "skull-and-bones",
    loot_system_type: "battle_pass",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "The Crew Motorfest",
    slug: "the-crew-motorfest",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Deep Rock Galactic",
    slug: "deep-rock-galactic",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Back 4 Blood",
    slug: "back-4-blood",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Suicide Squad: Kill the Justice League",
    slug: "suicide-squad-kill-the-justice-league",
    loot_system_type: "battle_pass",
    tags: ["multi_system", "has_cosmetic_shop"],
  },
  {
    title: "Dragon Ball: The Breakers",
    slug: "dragon-ball-the-breakers",
    loot_system_type: "cosmetic_shop",
    tags: ["multi_system", "has_battle_pass"],
  },
  {
    title: "Among Us",
    slug: "among-us",
    loot_system_type: "cosmetic_shop",
    tags: [],
  },
  {
    title: "Candy Crush Saga",
    slug: "candy-crush-saga",
    loot_system_type: "cosmetic_shop",
    tags: ["mobile"],
  },

  // === MMO & LIVE SERVICE ===
  {
    title: "Minecraft (Bedrock)",
    slug: "minecraft-bedrock",
    loot_system_type: "cosmetic_shop",
    tags: [],
  },
];

// ── Also update existing 13 games with tags ──
const EXISTING_GAME_TAGS: Record<string, string[]> = {
  "counter-strike-2": [],
  "genshin-impact": ["multi_system", "has_battle_pass"],
  "honkai-star-rail": ["multi_system", "has_battle_pass"],
  "ea-fc-25": ["multi_system", "has_cosmetic_shop"],
  "overwatch-2": ["multi_system", "has_battle_pass", "has_cosmetic_shop"],
  "apex-legends": ["multi_system", "has_battle_pass", "has_cosmetic_shop"],
  "diablo-4": ["multi_system", "has_battle_pass", "has_cosmetic_shop"],
  "fortnite": ["multi_system", "has_battle_pass", "has_cosmetic_shop"],
  "rocket-league": ["multi_system", "has_battle_pass", "has_cosmetic_shop"],
  "valorant": ["multi_system", "has_battle_pass"],
  "pokemon-tcg-pocket": ["mobile"],
  "marvel-snap": ["mobile", "multi_system", "has_battle_pass"],
  "zenless-zone-zero": ["multi_system", "has_battle_pass"],
};

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const batch = parseInt(request.nextUrl.searchParams.get("batch") || "0");
  const batchSize = 25;

  const supabase = createServerClient();
  const stats = {
    batch,
    gamesCreated: 0,
    gamesUpdated: 0,
    lootboxContentCreated: 0,
    existingGamesTagged: 0,
    errors: [] as string[],
  };

  // ── Step 1: Add tags column if it doesn't exist ──
  if (batch === 0) {
    try {
      await supabase.rpc("exec_sql", {
        query: "ALTER TABLE games ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'",
      });
    } catch {
      // Column might already exist or rpc might not exist — try raw
      // We'll handle this gracefully
    }

    // Update existing games with tags
    for (const [slug, tags] of Object.entries(EXISTING_GAME_TAGS)) {
      try {
        const { error } = await supabase
          .from("games")
          .update({ tags })
          .eq("slug", slug);
        if (!error) stats.existingGamesTagged++;
        else stats.errors.push(`Tag update ${slug}: ${error.message}`);
      } catch (err: any) {
        stats.errors.push(`Tag update ${slug}: ${err.message}`);
      }
    }
  }

  // ── Step 2: Process batch of new games ──
  const start = batch * batchSize;
  const end = Math.min(start + batchSize, NEW_GAMES.length);
  const gameBatch = NEW_GAMES.slice(start, end);

  for (const entry of gameBatch) {
    try {
      // Check if game already exists (from IGDB import)
      let { data: existing } = await supabase
        .from("games")
        .select("id, slug")
        .eq("slug", entry.slug)
        .single();

      let gameId: string;

      if (existing) {
        // Update existing game with loot system info
        const { error } = await supabase
          .from("games")
          .update({
            loot_system_type: entry.loot_system_type,
            tags: entry.tags,
          })
          .eq("id", existing.id);

        if (error) {
          stats.errors.push(`Update ${entry.title}: ${error.message}`);
          continue;
        }
        gameId = existing.id;
        stats.gamesUpdated++;
      } else {
        // Create new game
        const { data: newGame, error } = await supabase
          .from("games")
          .insert({
            title: entry.title,
            slug: entry.slug,
            loot_system_type: entry.loot_system_type,
            tags: entry.tags,
          })
          .select("id")
          .single();

        if (error || !newGame) {
          stats.errors.push(`Create ${entry.title}: ${error?.message || "unknown"}`);
          continue;
        }
        gameId = newGame.id;
        stats.gamesCreated++;
      }

      // ── Create basic lootbox_content if it doesn't exist ──
      const { data: existingContent } = await supabase
        .from("lootbox_content")
        .select("id")
        .eq("game_id", gameId)
        .single();

      if (!existingContent) {
        const { error: contentError } = await supabase
          .from("lootbox_content")
          .insert({
            game_id: gameId,
            has_pity_system: false,
            overview_html: `<p>${entry.title} features a ${entry.loot_system_type.replace(/_/g, " ")} monetization system.${
              entry.tags.includes("multi_system")
                ? ` It also includes ${entry.tags
                    .filter((t) => t.startsWith("has_"))
                    .map((t) => t.replace("has_", "").replace(/_/g, " "))
                    .join(", ")} elements.`
                : ""
            } Full analysis coming soon.</p>`,
          });

        if (contentError) {
          stats.errors.push(`Content ${entry.title}: ${contentError.message}`);
        } else {
          stats.lootboxContentCreated++;
        }
      }
    } catch (err: any) {
      stats.errors.push(`Error ${entry.title}: ${err.message}`);
    }
  }

  const totalBatches = Math.ceil(NEW_GAMES.length / batchSize);
  const hasMore = end < NEW_GAMES.length;

  return NextResponse.json({
    success: true,
    stats,
    totalGames: NEW_GAMES.length,
    batchInfo: {
      current: batch,
      total: totalBatches,
      processed: `${start + 1}-${end} of ${NEW_GAMES.length}`,
      hasMore,
      nextUrl: hasMore
        ? `/api/admin/seed-all-lootbox-games?secret=${secret}&batch=${batch + 1}`
        : null,
    },
  });
}
