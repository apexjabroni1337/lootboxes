export interface LootboxContent {
  cost_per_pull: number | null;
  cost_to_pity: number | null;
  pulls_to_pity: number | null;
  has_pity_system: boolean;
  currency_name: string | null;
  currency_per_dollar: number | null;
  score_transparency: number;
  score_value: number;
  score_fairness: number;
  score_player_control: number;
  comparable_slugs: string[];
  overview_html: string;
  pity_explanation_html: string;
  history_html: string;
  controversy_html: string;
  tips_html: string;
  editorial_html: string;
}
