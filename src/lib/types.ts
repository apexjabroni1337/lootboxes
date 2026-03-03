// ============================================================
// Core data types for Lootboxes.com
// ============================================================

export interface Game {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  screenshot_image?: string | null;
  platforms: string[];
  genres: string[];
  release_date: string | null;
  metacritic: number | null;
  lootboxes_score: number | null;
  description?: string | null;
  loot_system_type?: string | null;
  tags?: string[];
  hot_score?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  game_id: string;
  store: string;
  store_url: string;
  price: number;
  original_price: number;
  discount_pct: number;
  currency: string;
  is_historic_low: boolean;
  expires_at: string | null;
  affiliate_url: string | null;
  scraped_at: string;
  // Joined fields
  game?: Game;
}

export interface PriceHistory {
  id: string;
  game_id: string;
  store: string;
  price: number;
  currency: string;
  recorded_at: string;
}

export interface AnalyticsMeta {
  id: string;
  game_id: string | null;
  slug: string;
  title: string;
  excerpt: string;
  type: "battlepass" | "lootbox" | "economy" | "droprates";
  lootboxes_score: number | null;
  cover_image: string | null;
  published_at: string;
  updated_at: string;
  // Joined
  game?: Game;
}

export interface DropRate {
  id: string;
  game_id: string;
  item_name: string;
  rarity: string;
  drop_rate_pct: number;
  source: "official" | "community_verified" | "user_reported";
  verified: boolean;
  last_updated: string;
  // Joined
  game?: Game;
}

export interface LootboxContent {
  id: string;
  game_id: string;
  cost_per_pull: number | null;
  cost_to_pity: number | null;
  pulls_to_pity: number | null;
  has_pity_system: boolean;
  currency_name: string | null;
  currency_per_dollar: number | null;
  // Sub-scores (each 1-10)
  score_transparency: number | null;
  score_compliance: number | null;
  score_age_gating: number | null;
  score_value: number | null;
  score_fairness: number | null;
  score_p2w_impact: number | null;
  score_player_control: number | null;
  score_psych_design: number | null;
  overview_html: string | null;
  pity_explanation_html: string | null;
  history_html: string | null;
  controversy_html: string | null;
  tips_html: string | null;
  editorial_html: string | null;
  comparable_slugs: string[] | null;
  published_at: string;
  updated_at: string;
  // Joined
  game?: Game;
}

export interface Click {
  id: string;
  deal_id: string;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
}

// ============================================================
// Store metadata
// ============================================================

export const STORES: Record<
  string,
  { name: string; color: string; logo?: string }
> = {
  steam: { name: "Steam", color: "#1b2838" },
  epic: { name: "Epic Games", color: "#2a2a2a" },
  gog: { name: "GOG", color: "#86328a" },
  humble: { name: "Humble Bundle", color: "#cc2929" },
  fanatical: { name: "Fanatical", color: "#ff6600" },
  gmg: { name: "Green Man Gaming", color: "#01b84e" },
  greenmangaming: { name: "Green Man Gaming", color: "#01b84e" },
  gamebillet: { name: "GameBillet", color: "#e94545" },
  "2game": { name: "2Game", color: "#00b4d8" },
  gamesplanet: { name: "GamesPlanet", color: "#f39c12" },
  dlgamer: { name: "DLGamer", color: "#1a73e8" },
  wingamestore: { name: "WinGameStore", color: "#4a90d9" },
  gamesload: { name: "Gamesload", color: "#e67e22" },
  indiegala: { name: "IndieGala", color: "#d63384" },
  newegg: { name: "Newegg", color: "#e46e0a" },
  planetplay: { name: "PlanetPlay", color: "#6c5ce7" },
  gamersgate: { name: "GamersGate", color: "#c0392b" },
  playstation: { name: "PlayStation Store", color: "#003087" },
  xbox: { name: "Xbox Store", color: "#107c10" },
  nintendo: { name: "Nintendo eShop", color: "#e60012" },
};

// ============================================================
// Lootboxes Score helpers
// ============================================================

export function getScoreClass(score: number): string {
  if (score >= 8) return "score-great";
  if (score >= 6) return "score-good";
  if (score >= 4) return "score-average";
  return "score-poor";
}

export function getScoreLabel(score: number): string {
  if (score >= 8) return "Great Value";
  if (score >= 6) return "Good Value";
  if (score >= 4) return "Average";
  return "Poor Value";
}
