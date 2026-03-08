export interface SpendingGuide {
  gameSlug: string;
  gameName: string;
  systemType: string;
  freeToPlay: { tips: string[]; rating: string };
  lowSpend: { budget: string; tips: string[] };
  moderate: { budget: string; tips: string[] };
  bigSpend: { tips: string[]; warnings: string[] };
  bestValue: string[];
  avoid: string[];
  updatedAt: string;
}

export const SPENDING_GUIDES: SpendingGuide[] = [
  {
    gameSlug: "genshin-impact",
    gameName: "Genshin Impact",
    systemType: "gacha",
    freeToPlay: {
      tips: [
        "Save all Primogems for limited 5-star banners you actually want",
        "Never spend Primogems on the Standard Banner — use free Acquaint Fates only",
        "Complete daily commissions, events, and Spiral Abyss for steady Primogem income",
        "4-star characters are viable for all content; you don't need 5-stars to clear endgame",
      ],
      rating: "Very Viable",
    },
    lowSpend: {
      budget: "$5–15/month",
      tips: [
        "Buy the Welkin Moon ($5/month) — it's the highest Primogem-per-dollar value in the game",
        "Consider the Battle Pass ($10) for extra wishes, resources, and a solid 4-star weapon",
        "At ~$15/month, you can soft-pity a limited 5-star roughly every 2–3 patches",
      ],
    },
    moderate: {
      budget: "$30–60/month",
      tips: [
        "Welkin + Battle Pass + occasional top-up for a must-have character",
        "First-time top-up bonuses are doubled — use the $30 or $50 tier once",
        "You can guarantee a limited 5-star character roughly every other patch",
      ],
    },
    bigSpend: {
      tips: [
        "You can get C6 5-star characters and R5 weapons but expect to spend $1,000+ per banner",
        "Consider whether constellations actually improve your account vs. pulling new characters",
      ],
      warnings: [
        "Weapon Banner has a different pity system — you can lose the 75/25 twice before guarantee",
        "C6 is rarely necessary; C0 or C2 is the sweet spot for most characters",
      ],
    },
    bestValue: [
      "Welkin Moon ($5/month) — best Primogem/dollar ratio",
      "Battle Pass ($10/month) — resources + weapon + wishes",
      "First-time Genesis Crystal top-up (doubled)",
    ],
    avoid: [
      "Never refresh Resin with Primogems unless you're a whale",
      "Don't pull on the weapon banner unless you're prepared to hit 3 pities",
      "Avoid pulling just to 'build pity' — every pull should be intentional",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "fortnite",
    gameName: "Fortnite",
    systemType: "cosmetic_shop",
    freeToPlay: {
      tips: [
        "Free Battle Pass tiers give V-Bucks — save them for future passes",
        "Limited-time events often give free cosmetics and rewards",
        "Gameplay is fully fair; skins are purely cosmetic with zero competitive advantage",
      ],
      rating: "Fully Viable",
    },
    lowSpend: {
      budget: "$8–15/season",
      tips: [
        "Buy the Battle Pass once ($8) — if you complete it, you earn enough V-Bucks for the next pass",
        "This makes it a one-time investment that sustains itself indefinitely",
        "You'll get 7+ skins per season plus emotes, wraps, and gliders",
      ],
    },
    moderate: {
      budget: "$20–40/season",
      tips: [
        "Battle Pass + 1–2 Item Shop skins you really want",
        "Wait for skins to rotate back rather than buying immediately",
        "Starter Packs ($4–5) give a skin + V-Bucks and are great value",
      ],
    },
    bigSpend: {
      tips: [
        "Crew subscription ($12/month) includes the Battle Pass + exclusive skin + 1,000 V-Bucks",
        "Collecting everything in the shop requires $100+/month — it's designed to create FOMO",
      ],
      warnings: [
        "Most Item Shop skins rotate back eventually — don't panic buy",
        "Collaboration skins sometimes never return — research before buying",
      ],
    },
    bestValue: [
      "Battle Pass ($8) — self-sustaining if you complete it each season",
      "Starter Packs ($4–5) — skin + V-Bucks at the lowest price point",
      "Fortnite Crew ($12/month) — if you play every month",
    ],
    avoid: [
      "Don't buy V-Bucks to tier-skip the Battle Pass — just play and earn them",
      "Avoid buying skins purely out of FOMO; most rotate back",
      "Don't purchase Loot Llamas in Save the World mode — poor value",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "valorant",
    gameName: "Valorant",
    systemType: "cosmetic_shop",
    freeToPlay: {
      tips: [
        "All agents can be unlocked for free through gameplay contracts",
        "Free Battle Pass tiers include gun buddies, sprays, and player cards",
        "Gameplay is fully fair — skins have zero impact on performance",
      ],
      rating: "Fully Viable",
    },
    lowSpend: {
      budget: "$10–25/season",
      tips: [
        "Buy the Battle Pass ($10) for a set of themed skins and cosmetics",
        "Wait for specific skin bundles you love rather than buying everything",
        "Night Market offers discounted skins — wait for deals there",
      ],
    },
    moderate: {
      budget: "$30–80/season",
      tips: [
        "Battle Pass + 1 Premium skin bundle per act",
        "Premium bundles are $40–80 but include 4 weapon skins + extras",
        "Buying individual skins from bundles costs more per skin than the full bundle",
      ],
    },
    bigSpend: {
      tips: [
        "Ultra Edition skins ($25+ each) have the best animations and effects",
        "Knife skins range from $35–50 and are the most visible flex",
      ],
      warnings: [
        "Valorant skins are among the most expensive in gaming — set strict budgets",
        "Skin upgrades (Radianite) require additional currency that's scarce for free players",
      ],
    },
    bestValue: [
      "Battle Pass ($10/act) — best cosmetics-per-dollar",
      "Night Market — random discounted skins, up to 50% off",
      "Full bundles rather than individual skins",
    ],
    avoid: [
      "Don't buy Radianite Points unless you have skins that need upgrading",
      "Don't buy individual skins when the bundle is available at better per-skin value",
      "Avoid impulse buying — skins never rotate away once purchased",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "counter-strike-2",
    gameName: "Counter-Strike 2",
    systemType: "loot_box",
    freeToPlay: {
      tips: [
        "Random skin drops happen after matches — rare but free",
        "You can buy specific skins from the Steam Market instead of opening cases",
        "The game itself is completely free and competitive — no pay-to-win",
      ],
      rating: "Fully Viable",
    },
    lowSpend: {
      budget: "$5–20/month",
      tips: [
        "Buy specific skins you want directly from the Steam Market or Skinport",
        "Battle-Scarred and Well-Worn conditions are dramatically cheaper for similar looks",
        "Operation passes (when available) give structured missions and exclusive drops",
      ],
    },
    moderate: {
      budget: "$20–100/month",
      tips: [
        "Buy mid-tier skins ($10–50) that hold value well",
        "Consider buying skins as digital collectibles — many appreciate in value over time",
        "Use third-party price checkers to find undervalued skins",
      ],
    },
    bigSpend: {
      tips: [
        "Case opening is heavily negative-EV — expect to lose ~60% of your investment on average",
        "Rare pattern knives and gloves can cost $1,000–$100,000+",
      ],
      warnings: [
        "Case opening is essentially gambling with terrible odds",
        "StatTrak and rare float values create a secondary market with extreme prices",
        "The house always wins on case openings — buy skins directly instead",
      ],
    },
    bestValue: [
      "Buy skins directly from Steam Market or trusted third-party sites",
      "Operation passes when available (~$15, structured rewards)",
      "Lower-wear skins for 50–80% cost savings with minimal visual difference",
    ],
    avoid: [
      "Opening cases — the expected value is deeply negative",
      "Third-party gambling/jackpot sites — unregulated and often rigged",
      "Buying keys/cases in bulk hoping for a lucky unbox",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "apex-legends",
    gameName: "Apex Legends",
    systemType: "loot_box",
    freeToPlay: {
      tips: [
        "You get Apex Packs every few levels (slows down after level 100)",
        "Crafting Metals let you craft specific legendaries for free over time",
        "All Legends can be unlocked with earned Legend Tokens — no spending required",
      ],
      rating: "Very Viable",
    },
    lowSpend: {
      budget: "$10–20/season",
      tips: [
        "Battle Pass ($10) gives enough Apex Coins to buy the next one if you complete it",
        "This creates a self-sustaining loop similar to Fortnite",
        "Look for Starter Bundles and limited-time discounted packs",
      ],
    },
    moderate: {
      budget: "$20–50/season",
      tips: [
        "Battle Pass + saving Crafting Metals for specific event skins",
        "Collection Events let you craft event legendaries at 2x cost (2,400 Crafting Metals)",
        "Wait for Thematic Events — items eventually rotate to the standard Crafting pool",
      ],
    },
    bigSpend: {
      tips: [
        "Heirloom shards are guaranteed at 500 packs (~$500) — or win them from events",
        "Collection Events cost $150–170 to complete and guarantee the event Heirloom",
      ],
      warnings: [
        "Apex Packs have very low legendary drop rates (7.4%)",
        "Heirlooms are the most expensive cosmetics in gaming relative to gameplay impact",
      ],
    },
    bestValue: [
      "Battle Pass ($10) — self-sustaining with Apex Coins earned",
      "Crafting Metals for specific legendaries you want",
      "Starter Bundles for new players",
    ],
    avoid: [
      "Buying Apex Packs in bulk for random loot — terrible odds",
      "Spending real money to rush the Heirloom at 500 packs",
      "Recolor skins you won't use just because they're limited-time",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "diablo-immortal",
    gameName: "Diablo Immortal",
    systemType: "gacha",
    freeToPlay: {
      tips: [
        "Story content and most PvE is completable without spending",
        "Join a Warband/Clan for shared loot benefits",
        "Farm Elder Rifts and Challenge Rifts for free legendary drops",
      ],
      rating: "Challenging",
    },
    lowSpend: {
      budget: "$5–15/month",
      tips: [
        "Boon of Plenty ($5/month) gives daily login rewards and bonus drops",
        "Prodigy's Path ($15) gives Legendary Crests over the pass duration",
        "Even small spending on Legendary Crests dramatically improves rift drops",
      ],
    },
    moderate: {
      budget: "$30–100/month",
      tips: [
        "Monthly battle pass + Legendary Crest bundles for guaranteed gem drops",
        "Focus on Legendary Gems that have the biggest impact on your build",
        "The gap between low-spend and moderate-spend is significant in this game",
      ],
    },
    bigSpend: {
      tips: [
        "Maxing a character with 5-star gems is estimated at $50,000–100,000+",
        "Resonance score is directly tied to spending and gates competitive PvP",
      ],
      warnings: [
        "This is widely considered one of the most expensive games to whale in",
        "PvP is essentially pay-to-win at competitive ranks",
        "Legendary Gem upgrade costs scale exponentially",
      ],
    },
    bestValue: [
      "Boon of Plenty ($5/month) — best daily-value subscription",
      "Prodigy's Path ($15) — Legendary Crests at below pack prices",
      "Play for PvE only if you're budget-conscious",
    ],
    avoid: [
      "Competing in high-rank PvP without spending thousands",
      "Buying normal Rare Crests — always save for Legendary Crests",
      "Expecting to max 5-star gems without massive spending",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "ea-fc-25",
    gameName: "EA FC 25",
    systemType: "card_pack",
    freeToPlay: {
      tips: [
        "Squad Building Challenges (SBCs) give excellent free packs",
        "Division Rivals and FUT Champions give weekly rewards without spending",
        "Use the transfer market to trade your way to better players",
        "Objective players are free and often better than pack-pulled alternatives",
      ],
      rating: "Viable with Grind",
    },
    lowSpend: {
      budget: "$10–30/month",
      tips: [
        "Buy FC Points only during promos (TOTY, TOTS) when pack odds are slightly better",
        "Focus spending on guaranteed packs rather than standard gold packs",
        "Trade with the coins you earn rather than relying on pack luck",
      ],
    },
    moderate: {
      budget: "$30–100/month",
      tips: [
        "Promo packs during major events offer the best odds",
        "Lightning rounds sell out fast but have improved pack weight",
        "Consider the web app for managing your club and sniping deals",
      ],
    },
    bigSpend: {
      tips: [
        "Packing a specific TOTY/TOTS card has astronomically low odds even at high spend",
        "Content creators opening $10,000+ in packs routinely demonstrate negative EV",
      ],
      warnings: [
        "EA FC has some of the worst pack odds in gaming",
        "Card values crash rapidly throughout the cycle — your team depreciates fast",
        "The game resets annually — all spending is essentially temporary",
      ],
    },
    bestValue: [
      "SBCs — free packs with guaranteed rewards",
      "Division Rivals/Champions weekly rewards — free packs from gameplay",
      "Promo event guaranteed packs rather than standard packs",
    ],
    avoid: [
      "Standard Gold Packs — terrible expected value",
      "Spending early in the cycle when all cards will crash later",
      "Chasing specific players through random packs",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "overwatch-2",
    gameName: "Overwatch 2",
    systemType: "cosmetic_shop",
    freeToPlay: {
      tips: [
        "All heroes are unlockable through gameplay (play them in Quick Play to unlock)",
        "Free Battle Pass tiers include a new hero and basic cosmetics",
        "Weekly challenges give free cosmetic rewards",
      ],
      rating: "Fully Viable",
    },
    lowSpend: {
      budget: "$10/season",
      tips: [
        "Premium Battle Pass ($10) gives a Mythic skin, Legendary skins, and 5 Mythic Prisms",
        "Unlike some games, OW2 Battle Pass does NOT give enough coins for the next pass",
        "Shop skins rotate weekly — wait for ones you genuinely want",
      ],
    },
    moderate: {
      budget: "$20–50/season",
      tips: [
        "Battle Pass + 1–2 shop bundles per season",
        "Legacy coins (from OW1) can still buy classic skins at original prices",
        "Collaboration skins tend to be limited-time and never return",
      ],
    },
    bigSpend: {
      tips: [
        "Mythic skins are earned through the Battle Pass — you can't directly buy them",
        "The shop rotates frequently with $20 Legendary bundles",
      ],
      warnings: [
        "Overwatch 2 monetization was widely criticized at launch for high prices",
        "Individual Legendary skins cost $20 — same price as entire Battle Pass",
      ],
    },
    bestValue: [
      "Premium Battle Pass ($10) — Mythic skin + Legendaries",
      "Free weekly challenge rewards",
      "Using legacy OW1 coins if you have them",
    ],
    avoid: [
      "Individual shop Legendary skins at $20 — Battle Pass is better value",
      "Buying coins just to skip Battle Pass tiers",
      "FOMO-buying every collab skin that appears",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "league-of-legends",
    gameName: "League of Legends",
    systemType: "cosmetic_shop",
    freeToPlay: {
      tips: [
        "All champions can be unlocked with Blue Essence earned from playing",
        "Hextech Crafting gives free skin shards from chests earned in-game",
        "Gameplay is fully fair — skins are cosmetic only",
      ],
      rating: "Fully Viable",
    },
    lowSpend: {
      budget: "$10–20/event",
      tips: [
        "Event passes (~$15) give massive value with missions and token shops",
        "Buy RP during bonus RP promotions (usually 2–3 times per year)",
        "Starter bundles for new players include champion + skin bundles at deep discount",
      ],
    },
    moderate: {
      budget: "$20–50/month",
      tips: [
        "Event pass + 1–2 skins per month for your main champions",
        "Your Shop (personalized discounts) appears periodically with up to 60% off",
        "Prestige skins require Event Pass completion — plan which ones you want",
      ],
    },
    bigSpend: {
      tips: [
        "Ultimate and Legendary skins ($20–30) have the most new animations and VFX",
        "Hextech/Mythic skins require Mythic Essence — earned slowly over time",
      ],
      warnings: [
        "Gacha-style Hextech Chest opening is negative EV for targeting specific skins",
        "Prestige skins eventually return but at higher Mythic Essence cost",
      ],
    },
    bestValue: [
      "Event Passes (~$15) — highest value per dollar in the game",
      "Your Shop personalized discounts (up to 60% off)",
      "Bonus RP promotions (2–3x per year)",
    ],
    avoid: [
      "Buying Hextech Chests hoping for specific skins — just buy the skin directly",
      "Full-price skins when Your Shop or sales are coming soon",
      "RP-to-champion conversions — earn Blue Essence instead",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "call-of-duty-warzone",
    gameName: "Call of Duty: Warzone",
    systemType: "cosmetic_shop",
    freeToPlay: {
      tips: [
        "Warzone is fully free-to-play with all weapons earnable through gameplay",
        "Free Battle Pass tiers include some weapon blueprints and operators",
        "Complete daily and weekly challenges for bonus XP and cosmetics",
      ],
      rating: "Fully Viable",
    },
    lowSpend: {
      budget: "$10/season",
      tips: [
        "Battle Pass ($10) earns enough COD Points to buy the next season's pass",
        "This creates a self-sustaining system — one purchase covers every future season",
        "You get 100 tiers of cosmetics including Legendary and Mythic items",
      ],
    },
    moderate: {
      budget: "$20–40/season",
      tips: [
        "Battle Pass + 1 operator bundle from the shop",
        "Tracer packs and anime bundles tend to be popular community favorites",
        "Wait for bundles to hit the 'Just For You' section at potential discounts",
      ],
    },
    bigSpend: {
      tips: [
        "Store bundles range from $10–25 each with skins, blueprints, and finishers",
        "Vault Edition of each new game (~$100) includes operator skins and Battle Pass",
      ],
      warnings: [
        "Some weapon blueprints have different iron sights that offer slight visual advantages",
        "New CoD titles release annually — cosmetics don't always carry over fully",
      ],
    },
    bestValue: [
      "Battle Pass ($10) — self-sustaining with COD Points earned",
      "Free-tier Battle Pass rewards",
      "Vault Edition at launch if you buy the full game anyway",
    ],
    avoid: [
      "Tier-skipping the Battle Pass with COD Points",
      "Buying bundles just for a single weapon blueprint",
      "Store bundles with purely cosmetic calling cards and emblems",
    ],
    updatedAt: "2026-02-01",
  },
];

export function getGuideBySlug(slug: string): SpendingGuide | undefined {
  return SPENDING_GUIDES.find((g) => g.gameSlug === slug);
}
