// ============================================================
// Lootboxes Score Methodology — v2.0
// The definitive rating system for game monetization practices
// ============================================================

export const METHODOLOGY_VERSION = "2.0";
export const METHODOLOGY_DATE = "2026-03-02";

// ─── Score Tier Definitions ──────────────────────────────────

export interface ScoreTier {
  range: [number, number];
  label: string;
  color: string;       // Tailwind bg class
  textColor: string;   // Tailwind text class
  barColor: string;    // Tailwind bg class for progress bars
  description: string;
}

export const SCORE_TIERS: ScoreTier[] = [
  {
    range: [9, 10],
    label: "Excellent",
    color: "bg-emerald-500",
    textColor: "text-emerald-700",
    barColor: "bg-emerald-500",
    description: "Industry-leading consumer practices",
  },
  {
    range: [7, 8.9],
    label: "Good",
    color: "bg-emerald-400",
    textColor: "text-emerald-600",
    barColor: "bg-emerald-400",
    description: "Above-average, mostly consumer-friendly",
  },
  {
    range: [4, 6.9],
    label: "Fair",
    color: "bg-amber-400",
    textColor: "text-amber-600",
    barColor: "bg-amber-400",
    description: "Mixed practices — room for improvement",
  },
  {
    range: [1, 3.9],
    label: "Poor",
    color: "bg-red-500",
    textColor: "text-red-600",
    barColor: "bg-red-500",
    description: "Predatory or exploitative monetization",
  },
];

export function getScoreTier(score: number): ScoreTier {
  return (
    SCORE_TIERS.find((t) => score >= t.range[0] && score <= t.range[1]) ??
    SCORE_TIERS[SCORE_TIERS.length - 1]
  );
}

export function getScoreBarColor(score: number): string {
  if (score >= 7) return "bg-emerald-500";
  if (score >= 5) return "bg-amber-400";
  if (score >= 3) return "bg-orange-500";
  return "bg-red-500";
}

// ─── Sub-Score Criteria ──────────────────────────────────────

export interface CriteriaLevel {
  range: [number, number];
  label: string;
  description: string;
}

export interface SubScoreDefinition {
  key: string;
  name: string;
  shortName: string;
  icon: string;        // lucide-react icon name
  iconColor: string;   // Tailwind text color
  description: string;
  criteria: CriteriaLevel[];
}

export interface ScoreCategory {
  id: string;
  name: string;
  shortName: string;
  weight: number;
  color: string;       // Tailwind accent color
  bgColor: string;     // Tailwind bg for cards
  borderColor: string; // Tailwind border color
  description: string;
  whyItMatters: string;
  subScores: SubScoreDefinition[];
}

// ─── The Three Scoring Categories ────────────────────────────

export const SCORE_CATEGORIES: ScoreCategory[] = [
  {
    id: "consumer_protection",
    name: "Consumer Protection",
    shortName: "Protection",
    weight: 0.4,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description:
      "Evaluates how well a game protects consumers through transparency, legal compliance, and responsible safeguards. This is the most heavily weighted category because informed consumers are the foundation of fair monetization.",
    whyItMatters:
      "When players know the exact odds, can verify compliance with disclosure laws, and have access to spending controls, they can make genuinely informed decisions about their money.",
    subScores: [
      {
        key: "score_transparency",
        name: "Transparency",
        shortName: "Transparency",
        icon: "Eye",
        iconColor: "text-blue-500",
        description:
          "Are drop rates and odds published? How easy are they to find? Are they accurate and complete?",
        criteria: [
          {
            range: [9, 10],
            label: "Excellent",
            description:
              "Rates clearly published in-game, in store listings, AND on the official website. Updated promptly when changed. Includes expected cost calculations.",
          },
          {
            range: [7, 8],
            label: "Good",
            description:
              "Rates published in-game as required by law (e.g., China/Japan disclosure). Easy to find within a few taps. Complete coverage of all item tiers.",
          },
          {
            range: [4, 6],
            label: "Fair",
            description:
              "Rates available but buried in settings menus, external websites, or legal documents. May be incomplete or use confusing terminology.",
          },
          {
            range: [1, 3],
            label: "Poor",
            description:
              "Drop rates not published or only available through community data-mining. Developer actively obscures odds or uses deceptive presentation.",
          },
        ],
      },
      {
        key: "score_compliance",
        name: "Regulatory Compliance",
        shortName: "Compliance",
        icon: "Shield",
        iconColor: "text-blue-500",
        description:
          "Does the game comply with loot box disclosure laws across all markets where it operates (China, Japan, EU, Belgium, Netherlands)?",
        criteria: [
          {
            range: [9, 10],
            label: "Excellent",
            description:
              "Full compliance in all markets. Proactively meets the strictest standards globally, even in regions without mandatory disclosure laws.",
          },
          {
            range: [7, 8],
            label: "Good",
            description:
              "Compliant in all markets with disclosure laws. Follows region-specific regulations (e.g., China's gacha disclosure rules, Apple/Google store requirements).",
          },
          {
            range: [4, 6],
            label: "Fair",
            description:
              "Compliant in most markets but may have gaps. Disables purchases in banned regions (Belgium) rather than adapting the system.",
          },
          {
            range: [1, 3],
            label: "Poor",
            description:
              "Has faced regulatory action, fines, or forced changes. Attempts to circumvent disclosure requirements through loopholes.",
          },
        ],
      },
      {
        key: "score_age_gating",
        name: "Age & Spending Safeguards",
        shortName: "Safeguards",
        icon: "ShieldCheck",
        iconColor: "text-blue-500",
        description:
          "Are there parental controls, spending limits, purchase confirmations, and cooldown periods to protect vulnerable players?",
        criteria: [
          {
            range: [9, 10],
            label: "Excellent",
            description:
              "Robust parental controls, configurable spending limits, purchase cooldowns, spending history tracking, and clear warnings before large purchases.",
          },
          {
            range: [7, 8],
            label: "Good",
            description:
              "Parental controls available through platform (PlayStation, Xbox, etc.). In-game spending limits or warnings for large purchases. Receipt notifications.",
          },
          {
            range: [4, 6],
            label: "Fair",
            description:
              "Basic age verification through platform. No in-game spending controls beyond what the platform requires. Standard purchase confirmation dialogs.",
          },
          {
            range: [1, 3],
            label: "Poor",
            description:
              "Minimal safeguards. Easy for minors to make purchases. No spending limits, cooldowns, or meaningful purchase friction. May target younger audiences.",
          },
        ],
      },
    ],
  },
  {
    id: "value_fairness",
    name: "Value & Fairness",
    shortName: "Value",
    weight: 0.35,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    description:
      "Measures whether players receive reasonable value for their money and whether the system includes fairness mechanics that prevent the worst spending outcomes.",
    whyItMatters:
      "A pity system that guarantees a reward after N pulls, duplicate protection that prevents worthless repeats, and reasonable cost-per-item ratios are the difference between fair monetization and a slot machine.",
    subScores: [
      {
        key: "score_value",
        name: "Value for Money",
        shortName: "Value",
        icon: "DollarSign",
        iconColor: "text-emerald-500",
        description:
          "What does your money actually get you? How does the expected cost of desirable items compare to the price of a full game?",
        criteria: [
          {
            range: [9, 10],
            label: "Excellent",
            description:
              "Most content earnable through gameplay. Premium purchases offer clear, fairly-priced value. A full-price game experience without spending extra.",
          },
          {
            range: [7, 8],
            label: "Good",
            description:
              "Reasonable pricing for cosmetics. Battle pass or subscription offers strong value. Expected cost for desirable items under $20-30.",
          },
          {
            range: [4, 6],
            label: "Fair",
            description:
              "Desirable items cost $30-100+. Some content locked behind randomized purchases. Free-to-play path exists but is significantly slower.",
          },
          {
            range: [1, 3],
            label: "Poor",
            description:
              "Top-tier items cost $100-500+. Annual resets destroy all purchased value. Expected cost far exceeds the price of a full AAA game.",
          },
        ],
      },
      {
        key: "score_fairness",
        name: "Fairness Mechanics",
        shortName: "Fairness",
        icon: "Scale",
        iconColor: "text-emerald-500",
        description:
          "Does the system include pity, duplicate protection, guaranteed floors, or other mechanics that protect against extreme bad luck?",
        criteria: [
          {
            range: [9, 10],
            label: "Excellent",
            description:
              "Strong pity system with reasonable ceiling. Full duplicate protection. Guaranteed progression toward desired items. No item/purchase depreciation.",
          },
          {
            range: [7, 8],
            label: "Good",
            description:
              "Pity system present with reasonable thresholds (under 100 pulls). Some duplicate protection or exchange system. Soft pity increases odds gradually.",
          },
          {
            range: [4, 6],
            label: "Fair",
            description:
              "Basic pity system with high thresholds (100+ pulls). Limited duplicate handling. 50/50 or similar mechanics that can double worst-case costs.",
          },
          {
            range: [1, 3],
            label: "Poor",
            description:
              "No pity system whatsoever. Every pull is independent with no safety net. Duplicates have no value or recycling mechanism.",
          },
        ],
      },
      {
        key: "score_p2w_impact",
        name: "Pay-to-Win Impact",
        shortName: "P2W Impact",
        icon: "Swords",
        iconColor: "text-emerald-500",
        description:
          "Does spending real money provide competitive gameplay advantages, or is monetization limited to cosmetics and convenience?",
        criteria: [
          {
            range: [9, 10],
            label: "Excellent",
            description:
              "Purely cosmetic monetization. Zero gameplay impact from purchases. Competitive integrity fully preserved. PvE content clearable with free options.",
          },
          {
            range: [7, 8],
            label: "Good",
            description:
              "Mostly cosmetic with minor convenience items (XP boosters, inventory expansion). No significant competitive advantage from spending.",
          },
          {
            range: [4, 6],
            label: "Fair",
            description:
              "Spending provides noticeable gameplay advantages but competitive play is possible without spending. Power gap exists but is manageable.",
          },
          {
            range: [1, 3],
            label: "Poor",
            description:
              "Spending provides direct competitive advantages. Pay-to-win items available through loot boxes. Free-to-play players at significant disadvantage in PvP.",
          },
        ],
      },
    ],
  },
  {
    id: "player_experience",
    name: "Player Experience",
    shortName: "Experience",
    weight: 0.25,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    description:
      "Assesses whether the monetization respects players' autonomy and time, or whether it relies on psychological manipulation to drive spending.",
    whyItMatters:
      "Even transparent, fairly-priced systems can be harmful if they exploit FOMO, dark patterns, or addictive design to override players' rational decision-making.",
    subScores: [
      {
        key: "score_player_control",
        name: "Player Control",
        shortName: "Control",
        icon: "Gamepad2",
        iconColor: "text-purple-500",
        description:
          "Can players choose exactly what they want to buy, or are they forced to gamble on random outcomes?",
        criteria: [
          {
            range: [9, 10],
            label: "Excellent",
            description:
              "All items available for direct purchase. Players choose exactly what they buy. No randomized purchases required for any content.",
          },
          {
            range: [7, 8],
            label: "Good",
            description:
              "Most items available directly. Some randomized elements exist but alternatives are available. Crafting or exchange systems for specific items.",
          },
          {
            range: [4, 6],
            label: "Fair",
            description:
              "Mix of direct purchase and randomized systems. Some desirable content only available through loot boxes/gacha. Trading or recycling provides partial control.",
          },
          {
            range: [1, 3],
            label: "Poor",
            description:
              "Nearly all desirable content locked behind randomized systems. No direct purchase option. Players must gamble to get what they want.",
          },
        ],
      },
      {
        key: "score_psych_design",
        name: "Psychological Design",
        shortName: "Psych Design",
        icon: "Brain",
        iconColor: "text-purple-500",
        description:
          "Does the system avoid manipulative tactics like artificial FOMO, countdown timers, dark patterns, near-miss mechanics, or social pressure?",
        criteria: [
          {
            range: [9, 10],
            label: "Excellent",
            description:
              "No FOMO tactics. Items return to the store regularly. No countdown pressure. No near-miss animations. Spending is presented clearly without psychological tricks.",
          },
          {
            range: [7, 8],
            label: "Good",
            description:
              "Minimal FOMO. Limited-time events are predictable and recurring. No near-miss mechanics. Moderate use of sale urgency but with fair notice periods.",
          },
          {
            range: [4, 6],
            label: "Fair",
            description:
              "Some FOMO through limited-time banners or seasonal exclusives. Flashy pull animations that emphasize near-misses. Daily login rewards create obligation.",
          },
          {
            range: [1, 3],
            label: "Poor",
            description:
              "Heavy FOMO through time-limited exclusive content. Aggressive push notifications. Near-miss animations designed to trigger additional spending. Social pressure mechanics.",
          },
        ],
      },
    ],
  },
];

// ─── Score Calculation ───────────────────────────────────────

export interface ScoreInputs {
  score_transparency: number | null;
  score_compliance: number | null;
  score_age_gating: number | null;
  score_value: number | null;
  score_fairness: number | null;
  score_p2w_impact: number | null;
  score_player_control: number | null;
  score_psych_design: number | null;
}

/**
 * Calculate the weighted overall score from all 8 sub-scores.
 * Categories: Consumer Protection (40%), Value & Fairness (35%), Player Experience (25%)
 * Within each category, sub-scores are equally weighted.
 */
export function calculateWeightedScore(scores: ScoreInputs): number | null {
  const cp = averageNonNull([
    scores.score_transparency,
    scores.score_compliance,
    scores.score_age_gating,
  ]);
  const vf = averageNonNull([
    scores.score_value,
    scores.score_fairness,
    scores.score_p2w_impact,
  ]);
  const pe = averageNonNull([
    scores.score_player_control,
    scores.score_psych_design,
  ]);

  const parts: { avg: number; weight: number }[] = [];
  if (cp !== null) parts.push({ avg: cp, weight: 0.4 });
  if (vf !== null) parts.push({ avg: vf, weight: 0.35 });
  if (pe !== null) parts.push({ avg: pe, weight: 0.25 });

  if (parts.length === 0) return null;

  // Normalize weights if not all categories present
  const totalWeight = parts.reduce((s, p) => s + p.weight, 0);
  const weighted = parts.reduce(
    (s, p) => s + p.avg * (p.weight / totalWeight),
    0
  );
  return Math.round(weighted * 10) / 10;
}

/**
 * Get the category average for a specific category
 */
export function getCategoryAverage(
  categoryId: string,
  scores: ScoreInputs
): number | null {
  const cat = SCORE_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return null;

  const vals = cat.subScores.map(
    (ss) => scores[ss.key as keyof ScoreInputs]
  );
  return averageNonNull(vals);
}

/**
 * Generate a one-sentence insight summarizing what the score means for this game.
 */
export function getScoreInsight(scores: ScoreInputs): string {
  const cp = averageNonNull([
    scores.score_transparency,
    scores.score_compliance,
    scores.score_age_gating,
  ]);
  const vf = averageNonNull([
    scores.score_value,
    scores.score_fairness,
    scores.score_p2w_impact,
  ]);
  const pe = averageNonNull([
    scores.score_player_control,
    scores.score_psych_design,
  ]);

  const parts: string[] = [];

  if (cp !== null) {
    if (cp >= 7) parts.push("strong consumer protections");
    else if (cp >= 5) parts.push("adequate consumer protections");
    else parts.push("weak consumer protections");
  }
  if (vf !== null) {
    if (vf >= 7) parts.push("good value for money");
    else if (vf >= 5) parts.push("mixed value proposition");
    else parts.push("poor value for money");
  }
  if (pe !== null) {
    if (pe >= 7) parts.push("respectful player experience");
    else if (pe >= 5) parts.push("some manipulative design elements");
    else parts.push("exploitative psychological design");
  }

  if (parts.length === 0) return "Insufficient data for analysis.";
  const sentence =
    parts[0].charAt(0).toUpperCase() +
    parts[0].slice(1) +
    (parts.length > 1 ? ", " + parts.slice(1).join(", and ") : "") +
    ".";
  return sentence;
}

/**
 * Get all sub-score keys as a flat array
 */
export function getAllSubScoreKeys(): string[] {
  return SCORE_CATEGORIES.flatMap((c) => c.subScores.map((s) => s.key));
}

/**
 * Find the sub-score definition by key
 */
export function getSubScoreDefinition(
  key: string
): SubScoreDefinition | undefined {
  for (const cat of SCORE_CATEGORIES) {
    const found = cat.subScores.find((s) => s.key === key);
    if (found) return found;
  }
  return undefined;
}

/**
 * Find which category a sub-score belongs to
 */
export function getCategoryForSubScore(key: string): ScoreCategory | undefined {
  return SCORE_CATEGORIES.find((c) =>
    c.subScores.some((s) => s.key === key)
  );
}

// ─── Internal Helpers ────────────────────────────────────────

function averageNonNull(values: (number | null)[]): number | null {
  const valid = values.filter((v): v is number => v !== null);
  if (valid.length === 0) return null;
  return valid.reduce((sum, v) => sum + v, 0) / valid.length;
}
