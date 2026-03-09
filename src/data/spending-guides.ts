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
  {
    gameSlug: "honkai-star-rail",
    gameName: "Honkai: Star Rail",
    systemType: "gacha",
    freeToPlay: {
      tips: [
        "Save all Stellar Jades for limited 5-star banners you truly want",
        "Daily missions, events, and Simulated Universe provide steady jade income",
        "4-star characters like Tingyun and Pela are strong enough for all content",
        "Standard banner gives free pulls via Undying Starlight — never spend jades on it",
      ],
      rating: "Very Viable",
    },
    lowSpend: {
      budget: "$5–15/month",
      tips: [
        "Express Supply Pass ($5/month) is the best jade-per-dollar value in the game",
        "Nameless Honor Battle Pass ($10) adds pulls, credits, and a Light Cone",
        "At this budget, you can soft-pity a limited 5-star roughly every 2–3 patches",
      ],
    },
    moderate: {
      budget: "$30–60/month",
      tips: [
        "Express Pass + Battle Pass + occasional top-up for must-have characters",
        "First-time top-up bonuses are doubled — use the higher tiers once",
        "Target specific characters rather than pulling on every banner",
      ],
    },
    bigSpend: {
      tips: [
        "E6 (max Eidolons) on a limited character costs roughly $1,000–1,500+",
        "S5 signature Light Cones add another $500+ on top of character pulls",
      ],
      warnings: [
        "E1 or E2 is the sweet spot for most characters — E6 is overkill for all content",
        "Light Cone banner has same pity as character banner but is less impactful",
      ],
    },
    bestValue: [
      "Express Supply Pass ($5/month) — best jade/dollar ratio",
      "Nameless Honor ($10/month) — structured rewards + Light Cone",
      "First-time Oneiric Shard top-up (doubled)",
    ],
    avoid: [
      "Never use Stellar Jades for stamina refills unless you're a whale",
      "Don't pull on the standard Departure Warp with premium currency",
      "Avoid pulling just because you're close to pity — pull intentionally",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "marvel-snap",
    gameName: "Marvel Snap",
    systemType: "card_pack",
    freeToPlay: {
      tips: [
        "Season Pass free track gives gold, credits, and boosters every month",
        "Complete daily and weekly missions for steady gold income",
        "Collection Level determines which cards you unlock — play consistently to progress",
        "Many top-tier decks use Pool 1 and Pool 2 cards that unlock early",
      ],
      rating: "Very Viable",
    },
    lowSpend: {
      budget: "$10/month",
      tips: [
        "Gold Season Pass ($10) is the single best purchase — includes a variant, gold, credits, and boosters",
        "Gold earned from the pass helps you buy cards from the Token Shop when they appear",
        "Completing the pass gives enough value to sustain month-over-month progress",
      ],
    },
    moderate: {
      budget: "$20–40/month",
      tips: [
        "Season Pass + occasional bundle with a must-have card variant or gold",
        "Save gold for cards in the Token Shop rather than buying random bundles",
        "Spotlight Caches give targeted card access — focus your keys here",
      ],
    },
    bigSpend: {
      tips: [
        "Buying gold in bulk to fast-track Series 4/5 cards through the Token Shop",
        "Variant collecting is the main whale activity — purely cosmetic",
      ],
      warnings: [
        "Spotlight Cache odds can be brutal without enough keys saved up",
        "Card acquisition through random means is inefficient — always target-buy from the Token Shop",
      ],
    },
    bestValue: [
      "Gold Season Pass ($10/month) — best value by far",
      "Token Shop purchases for specific cards you need",
      "Spotlight Caches when you have 4 keys saved for a guaranteed pull",
    ],
    avoid: [
      "Random gold bundles when you don't have a specific card to buy",
      "Chasing variants purely for cosmetic reasons",
      "Buying credits directly — they're earned faster through gameplay",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "pokemon-go",
    gameName: "Pokémon GO",
    systemType: "gacha",
    freeToPlay: {
      tips: [
        "Community Days give guaranteed shinies and rare spawns for free",
        "Daily free raid pass lets you do one raid per day at no cost",
        "Walking and catching is the core loop — spending is optional for collection",
        "Research tasks give free encounters with rare and legendary Pokémon",
      ],
      rating: "Very Viable",
    },
    lowSpend: {
      budget: "$5–15/month",
      tips: [
        "Buy Remote Raid Passes when they're on sale — usually 3 for ~$3",
        "Community Day tickets ($1–2) give bonus research and extra shinies",
        "Incubators during events with boosted egg pools are decent value",
      ],
    },
    moderate: {
      budget: "$15–40/month",
      tips: [
        "Remote raids for every 5-star legendary you want to collect",
        "Event tickets during major events (GO Fest, Safari Zone) are worth it",
        "Lucky Eggs and Star Pieces during double-XP events maximize returns",
      ],
    },
    bigSpend: {
      tips: [
        "Shiny hunting through raids can cost $50+ per shiny legendary at bad luck",
        "GO Fest live events are $25–35 per ticket but offer exclusive Pokémon",
      ],
      warnings: [
        "Egg hatching is the closest thing to loot boxes — incubator purchases are low-value gambling",
        "Remote Raid Pass price increases have made raiding significantly more expensive",
      ],
    },
    bestValue: [
      "Community Day tickets ($1–2) — huge value for shiny hunters",
      "Remote Raid Passes on sale (3-pack)",
      "GO Battle League rewards (free legendary encounters)",
    ],
    avoid: [
      "Buying incubators in bulk — egg hatching is essentially gambling",
      "Paying full price for single Remote Raid Passes",
      "PokeCoins for cosmetic avatar items — they don't affect gameplay",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "destiny-2",
    gameName: "Destiny 2",
    systemType: "cosmetic_shop",
    freeToPlay: {
      tips: [
        "Core playlists (Strikes, Crucible, Gambit) are free with random legendary drops",
        "Seasonal events give free cosmetics through gameplay challenges",
        "Xur sells exotic gear each weekend for in-game currency",
        "Free-to-play has access to a meaningful amount of content",
      ],
      rating: "Viable with Limits",
    },
    lowSpend: {
      budget: "$10–15/season",
      tips: [
        "Season Pass ($10) gives the seasonal story content and an exotic weapon",
        "Annual expansion + Season Pass bundle is the best per-dollar value",
        "Bright Dust (free earned currency) can buy most Eververse items on rotation",
      ],
    },
    moderate: {
      budget: "$20–40/season",
      tips: [
        "Season Pass + 1–2 Eververse ornament sets you really want",
        "Dungeon keys ($10 each) give access to 2-person endgame content with exclusive loot",
        "Buy Silver during bonus Silver promotions for better value",
      ],
    },
    bigSpend: {
      tips: [
        "Eververse store has $10–15 ornament sets that make your Guardian look unique",
        "Full expansion + all seasons + dungeon bundle costs ~$100/year",
      ],
      warnings: [
        "Destiny 2 has vaulted paid content before — your purchases may not last forever",
        "Eververse pricing is high for what amounts to reskins in many cases",
      ],
    },
    bestValue: [
      "Annual expansion + Season Pass bundle at launch",
      "Bright Dust weekly purchases from Eververse",
      "Season Pass ($10) for seasonal exotic + story",
    ],
    avoid: [
      "Buying Silver just for Eververse cosmetics — earn Bright Dust instead",
      "Purchasing old seasons/expansions at full price (wait for sales)",
      "Transmog currency purchases when you can earn it for free",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "clash-royale",
    gameName: "Clash Royale",
    systemType: "card_pack",
    freeToPlay: {
      tips: [
        "Ladder progression earns chests with cards and gold automatically",
        "Clan Wars 2 provides free rewards for participating",
        "Magic Items earned from challenges can upgrade specific cards for free",
        "Challenges (especially Global Tournaments) are the best F2P progression source",
      ],
      rating: "Viable with Patience",
    },
    lowSpend: {
      budget: "$5–10/month",
      tips: [
        "Pass Royale ($5/month) is the best purchase in the game by far",
        "Includes unlimited challenge retries, a tower skin, and bonus rewards",
        "The gold and Magic Items from the pass dramatically speed up card progression",
      ],
    },
    moderate: {
      budget: "$10–30/month",
      tips: [
        "Pass Royale + occasional emote offers or special challenge entries",
        "Save gems for Grand Challenges — 12-win payouts are the best value",
        "Special offers during new card releases sometimes include good deals",
      ],
    },
    bigSpend: {
      tips: [
        "Maxing all cards takes years of play or thousands of dollars",
        "Tournament-standard gameplay (capped levels) is where competitive play lives",
      ],
      warnings: [
        "Card level advantages in ladder are massive — spending doesn't buy skill",
        "The game frequently releases new cards, constantly moving the upgrade goalpost",
      ],
    },
    bestValue: [
      "Pass Royale ($5/month) — unlocks the best rewards track",
      "Grand Challenges (100 gems) at 12 wins",
      "Magic Items for targeted card upgrades",
    ],
    avoid: [
      "Buying chests from the shop — terrible value per card",
      "Spending gems on anything other than challenges",
      "Gold purchases at shop prices — earn it through gameplay",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "path-of-exile-2",
    gameName: "Path of Exile 2",
    systemType: "cosmetic_shop",
    freeToPlay: {
      tips: [
        "The entire game is free — all endgame content accessible without spending",
        "No pay-to-win mechanics whatsoever; all purchases are cosmetic",
        "Stash tabs are the one semi-essential purchase for serious players",
        "Challenge leagues give free cosmetic rewards for playing",
      ],
      rating: "Fully Viable",
    },
    lowSpend: {
      budget: "$20–30 one-time",
      tips: [
        "First Supporter Pack includes points + cosmetics — best initial purchase",
        "Use points for a Currency Tab, Map Tab, and a Premium Tab bundle",
        "These 3 purchases cover all essential QoL needs for a long time",
      ],
    },
    moderate: {
      budget: "$60–120/year",
      tips: [
        "One Supporter Pack per league (~$30–60) gives points + league-exclusive armor set",
        "Use points for additional specialty tabs and one big MTX set you love",
        "Mystery Boxes during events are gambling — avoid unless you're okay with random results",
      ],
    },
    bigSpend: {
      tips: [
        "High-tier Supporter Packs ($240+) come with exclusive cloaks and weapon effects",
        "Full MTX sets (armor + weapon + portal + hideout) run $40–80 each",
      ],
      warnings: [
        "Mystery Boxes are actual loot boxes with bad duplicate rates",
        "Individual MTX pieces are very expensive compared to supporter pack points",
      ],
    },
    bestValue: [
      "Core Supporter Pack — cosmetics + points for stash tabs",
      "Currency Tab + Map Tab + Premium Tab bundle (essential QoL)",
      "Challenge league cosmetics (free from gameplay)",
    ],
    avoid: [
      "Mystery Boxes — random results with duplicate risk",
      "Buying individual MTX pieces at full price without points",
      "Extra stash tabs beyond what you actually need",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "wuthering-waves",
    gameName: "Wuthering Waves",
    systemType: "gacha",
    freeToPlay: {
      tips: [
        "Generous launch rewards give enough pulls for an early 5-star character",
        "Exploration rewards (Astrite from chests, puzzles, quests) are abundant",
        "Standard banner has a beginner guarantee within 50 pulls",
        "4-star characters are competitively viable for all content",
      ],
      rating: "Very Viable",
    },
    lowSpend: {
      budget: "$5–15/month",
      tips: [
        "Monthly Lunite Subscription is the highest Astrite-per-dollar purchase",
        "Battle Pass adds pulls, upgrade materials, and a 4-star weapon",
        "Combined monthly + pass gives roughly one 5-star every 2–3 patches",
      ],
    },
    moderate: {
      budget: "$30–60/month",
      tips: [
        "Monthly sub + Battle Pass + occasional crystal top-up for must-have resonators",
        "First-time top-up gives double crystals — use the bigger tiers once",
        "Target limited resonators that fill a gap in your team comp",
      ],
    },
    bigSpend: {
      tips: [
        "Full sequence (S6) on a limited resonator costs roughly $800–1,200+",
        "Signature 5-star weapons add $200–400 on top of character investment",
      ],
      warnings: [
        "S1 is the most impactful constellation for most resonators — diminishing returns after",
        "Weapon banner pity does not carry over between weapon banners",
      ],
    },
    bestValue: [
      "Monthly Lunite Subscription — best Astrite per dollar",
      "Battle Pass for pulls + materials",
      "First-time crystal top-up bonus (doubled)",
    ],
    avoid: [
      "Pulling on the weapon banner without enough for a guaranteed weapon",
      "Using Astrite for stamina refreshes — time-gated naturally",
      "Chasing high sequences on characters who don't benefit much from them",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "zenless-zone-zero",
    gameName: "Zenless Zone Zero",
    systemType: "gacha",
    freeToPlay: {
      tips: [
        "Inter-Knot exploration and events give steady Polychrome income",
        "HIA challenges provide free pulls through earned currency",
        "A-rank agents are strong and easier to build than S-ranks",
        "TV mode events give free materials and occasional limited rewards",
      ],
      rating: "Very Viable",
    },
    lowSpend: {
      budget: "$5–15/month",
      tips: [
        "Inter-Knot Membership ($5/month) is the best Polychrome value",
        "Growth Fund (one-time) pays out over time as you level — great early purchase",
        "At this budget, target one S-rank per 2–3 patches",
      ],
    },
    moderate: {
      budget: "$30–60/month",
      tips: [
        "Membership + Battle Pass + occasional top-up for favorite characters",
        "First top-up gives doubled Monochrome — save for a character you want",
        "W-Engine (weapon) banner shares pity type but has its own counter",
      ],
    },
    bigSpend: {
      tips: [
        "Cinema-level (max) dupes on an S-rank agent costs roughly $1,000+",
        "Signature W-Engines are important for max damage but expensive to guarantee",
      ],
      warnings: [
        "M1 (first dupe) is usually the biggest power spike — M6 is overkill",
        "The game is PvE only — you never need max investment to clear content",
      ],
    },
    bestValue: [
      "Inter-Knot Membership ($5/month) — best Polychrome per dollar",
      "Growth Fund (one-time purchase, long-term value)",
      "First-time top-up bonus (doubled Monochrome)",
    ],
    avoid: [
      "Stamina (Battery) refreshes with premium currency",
      "Pulling on W-Engine banner without guaranteed path planned",
      "Chasing high Mindscape levels on characters that don't need them",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "fifa-mobile",
    gameName: "EA Sports FC Mobile",
    systemType: "card_pack",
    freeToPlay: {
      tips: [
        "Daily activities and league matches give free player packs",
        "Season campaigns provide free high-rated players through gameplay",
        "VSA and H2H seasons reward free players at tier milestones",
        "Events always have a free path with solid rewards — play consistently",
      ],
      rating: "Viable with Grind",
    },
    lowSpend: {
      budget: "$5–15/month",
      tips: [
        "Star Pass ($10/month) is the single best purchase — premium track rewards are massive",
        "Event passes during major promos (TOTY, TOTS) give extra event currency",
        "Save FIFA Points for guaranteed player packs rather than random ones",
      ],
    },
    moderate: {
      budget: "$20–50/month",
      tips: [
        "Star Pass + event passes during major promos for accelerated progression",
        "Bundle purchases during major events offer better value than direct pack buys",
        "Focus on building a cohesive team chemistry rather than chasing individual cards",
      ],
    },
    bigSpend: {
      tips: [
        "Maxing a squad with all event-exclusive cards requires $100+ per major event",
        "Season resets mean your investment depreciates annually",
      ],
      warnings: [
        "Pack odds on mobile are even worse than console — lower hit rates for top cards",
        "Annual reset makes all spending essentially temporary",
        "Pay-to-win is significant in competitive PvP modes",
      ],
    },
    bestValue: [
      "Star Pass ($10/month) — best rewards-per-dollar",
      "Free event paths (always complete these first)",
      "Event passes during TOTY/TOTS promos",
    ],
    avoid: [
      "Random player packs — terrible odds for targeting specific players",
      "Buying FIFA Points outside of promotions",
      "Spending heavily early in the season when cards will be outclassed quickly",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "roblox",
    gameName: "Roblox",
    systemType: "cosmetic_shop",
    freeToPlay: {
      tips: [
        "Thousands of games are completely free to play",
        "Many games give free items, pets, and cosmetics through gameplay",
        "Daily login rewards in popular games give free in-game currency",
        "UGC (user-generated content) avatar items include many free options",
      ],
      rating: "Fully Viable",
    },
    lowSpend: {
      budget: "$5–10/month",
      tips: [
        "Roblox Premium ($5–10/month) gives monthly Robux allowance + marketplace fee discounts",
        "Premium also includes exclusive items and early access to features",
        "Buy Robux during bonus events for extra value",
      ],
    },
    moderate: {
      budget: "$10–25/month",
      tips: [
        "Premium + occasional game-specific passes for your favorite games",
        "Game Passes are one-time purchases that permanently unlock features",
        "Avatar items from the UGC catalog are usually cheaper than official items",
      ],
    },
    bigSpend: {
      tips: [
        "Limited items can cost hundreds or thousands of Robux",
        "Some games have extremely expensive VIP servers and game passes ($50+)",
      ],
      warnings: [
        "Many Roblox games target young players with manipulative spending mechanics",
        "Limited items are speculative — values fluctuate wildly",
        "Individual game currencies are not transferable between games",
      ],
    },
    bestValue: [
      "Roblox Premium ($5/month tier) — monthly Robux + perks",
      "Permanent Game Passes for your most-played games",
      "Free UGC avatar items from the catalog",
    ],
    avoid: [
      "Buying Robux without Premium (worse exchange rate)",
      "Limited item speculation — prices are volatile and unpredictable",
      "In-game gambling mechanics (pet hatching, crate opening) in individual games",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "marvel-rivals",
    gameName: "Marvel Rivals",
    systemType: "cosmetic_shop",
    freeToPlay: {
      tips: [
        "All heroes are free to play — no unlocking required",
        "Free Battle Pass track includes sprays, nameplates, and basic cosmetics",
        "Gameplay is fully skill-based with zero pay-to-win elements",
        "Events give free limited-time cosmetics through challenges",
      ],
      rating: "Fully Viable",
    },
    lowSpend: {
      budget: "$10/season",
      tips: [
        "Luxury Battle Pass ($10) includes premium skins, emotes, and bonus Units",
        "Complete the pass to earn back enough Units for future passes",
        "Season-themed skins are exclusive to their pass and may not return",
      ],
    },
    moderate: {
      budget: "$20–40/season",
      tips: [
        "Battle Pass + one featured skin bundle from the rotating store",
        "Gallery skins for your main heroes are the best targeted purchases",
        "Wait for sales and bundle deals rather than buying individual items",
      ],
    },
    bigSpend: {
      tips: [
        "Legendary and Mythic skins range from $15–25 each with unique VFX",
        "Full hero skin collections require $100+ across multiple seasons",
      ],
      warnings: [
        "Store rotation means FOMO pressure — most skins return eventually",
        "Individual skin prices are on the higher end for a hero shooter",
      ],
    },
    bestValue: [
      "Luxury Battle Pass ($10/season) — self-sustaining if completed",
      "Free event cosmetics from seasonal challenges",
      "Bundle deals over individual skin purchases",
    ],
    avoid: [
      "Buying Units just to skip Battle Pass tiers — play to earn them",
      "FOMO-purchasing every store rotation skin",
      "Spending on sprays and nameplates when skins are better value",
    ],
    updatedAt: "2026-02-01",
  },
  {
    gameSlug: "honkai-impact-3rd",
    gameName: "Honkai Impact 3rd",
    systemType: "gacha",
    freeToPlay: {
      tips: [
        "Story mode is fully completable with free Valkyries and gear",
        "Events are the biggest source of free Crystals — never miss them",
        "Foundry and G3 Stigmata provide viable free gear alternatives for most content",
        "Elysian Realm and Memorial Arena give weekly Crystal income",
      ],
      rating: "Viable with Grind",
    },
    lowSpend: {
      budget: "$5–15/month",
      tips: [
        "Monthly Crystal Pass ($5) is the best Crystal-per-dollar value",
        "Battle Pass ($10) adds Stigmata, weapons, and Crystal income",
        "At this budget, target one S-rank per 2–3 major updates",
      ],
    },
    moderate: {
      budget: "$30–60/month",
      tips: [
        "Monthly Pass + BP + occasional top-up for limited-time Valkyries",
        "First-time top-ups are doubled — use higher tiers once",
        "Focus on Herrscher-tier units that define team compositions",
      ],
    },
    bigSpend: {
      tips: [
        "SSS-rank Valkyries with full signature gear costs $500–1,000+ per character",
        "Competitive Memorial Arena and Abyss rankings require near-max investment",
      ],
      warnings: [
        "Power creep is significant — top meta units rotate every few patches",
        "Stigmata gacha has separate pity from Valkyrie gacha, doubling costs",
      ],
    },
    bestValue: [
      "Monthly Crystal Pass ($5/month) — best Crystal/dollar ratio",
      "Battle Pass Knight ($10) — gear + Crystals + materials",
      "First-time Crystal top-up (doubled)",
    ],
    avoid: [
      "Pulling on Equipment Supply without enough for guarantee",
      "Building niche Valkyries that only work with signature gear",
      "Spending on dorm gacha — cosmetic-only with poor rates",
    ],
    updatedAt: "2026-03-01",
  },
  {
    gameSlug: "tower-of-fantasy",
    gameName: "Tower of Fantasy",
    systemType: "gacha",
    freeToPlay: {
      tips: [
        "Exploration gives massive amounts of Dark Crystals in the early game",
        "Standard banner pity carries over and uses free Black Gold currency",
        "Bygone Phantasm and Void Rifts provide weekly pull currency",
        "SR weapons from standard banner are viable for most PvE content",
      ],
      rating: "Viable with Grind",
    },
    lowSpend: {
      budget: "$5–15/month",
      tips: [
        "Monthly Pass ($5) gives the best Dark Crystal value per dollar",
        "Battle Pass ($10) adds pulls, matrices, and upgrade materials",
        "Save all premium currency for limited-banner characters you need",
      ],
    },
    moderate: {
      budget: "$30–80/month",
      tips: [
        "Monthly Pass + BP + selective top-ups for must-have limited Simulacra",
        "A1 (first star) is the most important upgrade for limited characters",
        "Matrices are as important as characters — budget for both",
      ],
    },
    bigSpend: {
      tips: [
        "A6 limited Simulacra costs roughly $1,000–2,000 depending on luck",
        "Full matrix sets for one character can cost $300–600+",
      ],
      warnings: [
        "PvP balance is heavily influenced by spending — expect pay-to-win at high ranks",
        "Older limited characters get powercrept quickly by newer releases",
      ],
    },
    bestValue: [
      "Monthly Pass ($5) — best Dark Crystal per dollar",
      "Battle Pass for matrices and materials",
      "First top-up bonus (doubled crystals)",
    ],
    avoid: [
      "A3+ on limited characters unless you're a whale — A1 is sufficient",
      "Pulling matrices without guarantee pity saved up",
      "Standard banner pulls with premium currency — use free Black Gold only",
    ],
    updatedAt: "2026-03-01",
  },
  {
    gameSlug: "the-finals",
    gameName: "THE FINALS",
    systemType: "cosmetic_shop",
    freeToPlay: {
      tips: [
        "All weapons, gadgets, and gameplay content are free for everyone",
        "Free Battle Pass track includes some cosmetic items each season",
        "Tournament winnings and leveling give free cosmetic rewards",
        "No gameplay advantage from any purchase — purely cosmetic monetization",
      ],
      rating: "Fully Viable",
    },
    lowSpend: {
      budget: "$10/season",
      tips: [
        "Battle Pass ($10) gives themed skins, emotes, and enough Multibucks for future passes",
        "Self-sustaining if you complete the pass each season",
        "Seasonal skins are exclusive and don't return — decide carefully",
      ],
    },
    moderate: {
      budget: "$20–40/season",
      tips: [
        "Battle Pass + 1–2 store bundles for your favorite build",
        "Store items rotate regularly — wait for skins that match your playstyle",
        "Body type-specific skins mean you only need to buy for your preferred build",
      ],
    },
    bigSpend: {
      tips: [
        "Store bundles range from $10–20 each with unique character skins",
        "Full cosmetic collection requires buying most store rotations — $100+/season",
      ],
      warnings: [
        "The game is newer so cosmetic library is still growing",
        "No trading system — once bought, items are account-bound",
      ],
    },
    bestValue: [
      "Battle Pass ($10/season) — self-sustaining with Multibucks",
      "Free tournament rewards and level-up drops",
      "Targeted store bundles for your main build only",
    ],
    avoid: [
      "Buying Multibucks to tier-skip the Battle Pass",
      "Collecting skins for builds you don't play",
      "Impulse buying every store rotation",
    ],
    updatedAt: "2026-03-01",
  },
  {
    gameSlug: "dead-by-daylight",
    gameName: "Dead by Daylight",
    systemType: "cosmetic_shop",
    freeToPlay: {
      tips: [
        "Base game includes several Killers and Survivors with unique perks",
        "Iridescent Shards (free currency) can unlock characters and cosmetics over time",
        "Shrine of Secrets rotates perks weekly — get premium perks without buying characters",
        "Rift free track gives some cosmetics each season",
      ],
      rating: "Viable with Patience",
    },
    lowSpend: {
      budget: "$5–10/season",
      tips: [
        "Rift Premium Pass (~$10) gives exclusive cosmetics and enough Auric Cells for value",
        "Wait for sales on character DLC bundles — they go 50% off regularly",
        "Buy characters whose perks you need rather than collecting all of them",
      ],
    },
    moderate: {
      budget: "$15–30/season",
      tips: [
        "Rift Pass + 1–2 DLC chapters per season when on sale",
        "Licensed characters (Myers, Alien, etc.) can only be bought with real money, not Shards",
        "Outfit bundles are slightly cheaper than buying pieces individually",
      ],
    },
    bigSpend: {
      tips: [
        "All characters and perks costs $200+ if buying at full price",
        "Ultra-rare outfits cost $10–15 each and are purely cosmetic",
      ],
      warnings: [
        "New chapters release every 3 months — ongoing cost to stay current",
        "Licensed DLC never goes free — plan purchases around sales",
      ],
    },
    bestValue: [
      "Rift Premium Pass (~$10) — seasonal cosmetics + progression",
      "DLC chapters on sale (50% off during events)",
      "Shrine of Secrets for premium perks with free Shards",
    ],
    avoid: [
      "Full-price character DLC when sales happen every few months",
      "Individual cosmetic pieces — buy outfits as bundles",
      "Auric Cells for characters available with free Iridescent Shards",
    ],
    updatedAt: "2026-03-01",
  },
  {
    gameSlug: "raid-shadow-legends",
    gameName: "Raid: Shadow Legends",
    systemType: "gacha",
    freeToPlay: {
      tips: [
        "Campaign and Clan Boss give free shards daily",
        "Rare champions like Kael and Warmaiden carry through early and mid-game content",
        "Save all Ancient/Void/Sacred Shards for 2x events to maximize shard value",
        "Forge and Faction Wars provide free gear and champion progression",
      ],
      rating: "Challenging",
    },
    lowSpend: {
      budget: "$10–25/month",
      tips: [
        "Raid Card (~$10/month) gives multi-battle, auto-sell, and QoL features — near essential",
        "Monthly Gem Pack provides gems for Masteries without grinding Minotaur",
        "Daily Gem Pack is decent value for energy refills over time",
      ],
    },
    moderate: {
      budget: "$30–80/month",
      tips: [
        "Raid Card + shard packs during guaranteed champion events",
        "Warrior Circle packs offer champions at better rates than standard shard pulls",
        "Focus spending on events where you can guarantee a specific legendary",
      ],
    },
    bigSpend: {
      tips: [
        "Building a top Arena team and completing Faction Wars requires dozens of legendaries",
        "Whale-tier spending ($500+/month) is common among top clan members",
      ],
      warnings: [
        "Legendary drop rates are extremely low (0.5% per Ancient Shard)",
        "The game is designed to create enormous spending pressure through limited-time events",
        "Power creep is constant — today's meta champions get outclassed regularly",
      ],
    },
    bestValue: [
      "Raid Card (~$10/month) — essential QoL improvements",
      "Monthly Gem Pack — gems for Masteries",
      "Shard packs during guaranteed 2x or mercy events",
    ],
    avoid: [
      "Pulling shards outside of 2x events — halves your legendary chances",
      "Buying random offers from the in-game shop pop-ups",
      "Energy refills with gems early on — save gems for Masteries first",
    ],
    updatedAt: "2026-03-01",
  },
  {
    gameSlug: "rocket-league",
    gameName: "Rocket League",
    systemType: "cosmetic_shop",
    freeToPlay: {
      tips: [
        "All cars have identical hitboxes per body type — no competitive advantage from purchases",
        "Free drops after matches give random cosmetic items",
        "Rocket Pass free track includes decals, boosts, and goal explosions",
        "Trading with other players lets you get specific items without spending",
      ],
      rating: "Fully Viable",
    },
    lowSpend: {
      budget: "$10/season",
      tips: [
        "Rocket Pass Premium ($10) gives 70+ tiers of items including a new car",
        "Completing the pass earns back 1,000 Credits — making it self-sustaining",
        "Painted items from the premium track can be traded for high value",
      ],
    },
    moderate: {
      budget: "$20–40/season",
      tips: [
        "Rocket Pass + 1–2 Item Shop bundles per season",
        "Esports Shop items support pro teams and have unique designs",
        "Blueprint reveals are free — only craft blueprints for items you truly want",
      ],
    },
    bigSpend: {
      tips: [
        "Titanium White Octane and other rare traded items cost $50–100+ in Credits",
        "Black Market Decals and Goal Explosions are the most sought-after items",
      ],
      warnings: [
        "Blueprint crafting is almost always more expensive than buying items from the trading market",
        "Item Shop prices are often above market value for tradeable alternatives",
      ],
    },
    bestValue: [
      "Rocket Pass Premium ($10) — self-sustaining with Credit refunds",
      "Trading with other players for specific items",
      "Free match drops and free Rocket Pass tiers",
    ],
    avoid: [
      "Crafting Blueprints — almost always overpriced vs. trading",
      "Item Shop purchases without checking trade prices first",
      "Opening old crates/blueprints for random items",
    ],
    updatedAt: "2026-03-01",
  },
  {
    gameSlug: "star-wars-galaxy-of-heroes",
    gameName: "Star Wars: Galaxy of Heroes",
    systemType: "gacha",
    freeToPlay: {
      tips: [
        "Hard node farming gives guaranteed character shards daily (though slowly)",
        "Fleet Arena and Squad Arena give daily Crystal income based on rank",
        "Galactic Challenges and Conquest give free gear and character shards",
        "Focus on one faction at a time — Phoenix for early game, then Padme or Empire",
      ],
      rating: "Viable with Patience",
    },
    lowSpend: {
      budget: "$10–20/month",
      tips: [
        "Hyperdrive Bundle (one-time ~$30) is the best purchase for new players — skips months of grind",
        "Crystal subscriptions give daily Crystals for energy refreshes",
        "Use Crystals for energy refreshes (50-cost only) rather than pack purchases",
      ],
    },
    moderate: {
      budget: "$20–50/month",
      tips: [
        "Crystal subs + occasional marquee packs for must-have new characters",
        "Conquest Pass gives extra gear and Conquest currency each month",
        "Save all hoarded resources for Galactic Legend unlock events",
      ],
    },
    bigSpend: {
      tips: [
        "Unlocking a new Galactic Legend on day one costs $300–500+ in packs and refreshes",
        "Relic 9 materials are extremely scarce and expensive to accelerate",
      ],
      warnings: [
        "This game is one of the grindiest gachas — even whales wait months for Galactic Legends",
        "Grand Arena Championships matchmaking means spending more just matches you against other spenders",
      ],
    },
    bestValue: [
      "Hyperdrive Bundle (one-time) — months of progress instantly",
      "Crystal subscriptions for daily energy refreshes",
      "50-Crystal energy refreshes (3 per day max)",
    ],
    avoid: [
      "Character shard packs — terrible Crystal-per-shard value",
      "100+ Crystal energy refreshes — diminishing returns",
      "Chasing every new marquee character on release",
    ],
    updatedAt: "2026-03-01",
  },
  {
    gameSlug: "brawl-stars",
    gameName: "Brawl Stars",
    systemType: "loot_box",
    freeToPlay: {
      tips: [
        "Brawl Boxes from trophy road and daily tokens give free Brawlers over time",
        "Brawl Pass free track includes a new Brawler every season",
        "Star Points from Power League give free skins and boxes",
        "All Brawlers are competitively viable at Power Level 9 — no need to max every one",
      ],
      rating: "Very Viable",
    },
    lowSpend: {
      budget: "$10/season",
      tips: [
        "Brawl Pass ($10) is the single best purchase — includes a Brawler, boxes, pins, and skin",
        "Saving pass gems can eventually buy a future pass for free",
        "Complete all pass tiers for maximum box and Power Point value",
      ],
    },
    moderate: {
      budget: "$20–40/season",
      tips: [
        "Brawl Pass + occasional offers for specific Brawler skins you want",
        "Token Doublers extend your free box income significantly",
        "Special event skins are limited-time — decide if you want them before they leave",
      ],
    },
    bigSpend: {
      tips: [
        "Maxing all Brawlers to Power 11 with full Gears is extremely expensive",
        "True Gold and True Silver skins cost 25K–50K Coins each",
      ],
      warnings: [
        "Hypercharge upgrades add another layer of progression cost",
        "New Brawlers release monthly — the upgrade treadmill never ends",
      ],
    },
    bestValue: [
      "Brawl Pass ($10/season) — best value purchase in the game",
      "Free Star Points skins from Power League",
      "Token Doublers when on sale",
    ],
    avoid: [
      "Buying boxes directly with gems — Brawl Pass gives far more boxes",
      "Spending gems on skins when you haven't bought the pass",
      "Maxing every Brawler — focus on your favorites",
    ],
    updatedAt: "2026-03-01",
  },
  {
    gameSlug: "naraka-bladepoint",
    gameName: "Naraka: Bladepoint",
    systemType: "cosmetic_shop",
    freeToPlay: {
      tips: [
        "All heroes and weapons are available to everyone — no gameplay locked behind paywalls",
        "Hero trials let you test any hero before purchasing with free currency",
        "Free Battle Pass track includes basic cosmetics and Tae each season",
        "Gameplay skill matters far more than cosmetics in ranked play",
      ],
      rating: "Fully Viable",
    },
    lowSpend: {
      budget: "$10/season",
      tips: [
        "Gold Battle Pass (~$10) gives premium skins, emotes, and Gold currency",
        "Completing the pass returns enough Gold for the next season's pass",
        "Seasonal outfits are exclusive to the pass and themed around the update",
      ],
    },
    moderate: {
      budget: "$20–50/season",
      tips: [
        "Battle Pass + one premium outfit bundle from the rotating store",
        "Limited-time collaboration skins (anime, movies) are the most sought-after",
        "Store discounts appear during major events — wait for deals",
      ],
    },
    bigSpend: {
      tips: [
        "Legendary and Mythic outfits cost $20–40 each with unique effects",
        "Some limited skins appreciate in perceived value since they don't return",
      ],
      warnings: [
        "Gacha-style costume lotteries have poor rates for featured items",
        "Outfit pieces sometimes need all parts to look right — partial sets look incomplete",
      ],
    },
    bestValue: [
      "Gold Battle Pass ($10/season) — self-sustaining if completed",
      "Free hero trials before committing currency to unlock",
      "Event-discounted store bundles",
    ],
    avoid: [
      "Costume lotteries/gacha — random results with bad odds",
      "Buying individual outfit pieces at full price",
      "Gold currency on hero unlocks when free currency suffices",
    ],
    updatedAt: "2026-03-01",
  },
  {
    gameSlug: "mobile-legends-bang-bang",
    gameName: "Mobile Legends: Bang Bang",
    systemType: "cosmetic_shop",
    freeToPlay: {
      tips: [
        "Daily login rewards and events give free heroes and hero fragments",
        "Ticket draws give free skins (Normal and Elite quality) regularly",
        "All heroes can be earned with Battle Points from playing matches",
        "Fragment Shop lets you redeem free Elite and Epic skins over time",
      ],
      rating: "Very Viable",
    },
    lowSpend: {
      budget: "$5–15/month",
      tips: [
        "Starlight Membership ($10/month) gives an exclusive skin, weekly diamonds, and bonus rewards",
        "First recharge bonuses give extra diamonds — use the small top-up once",
        "Lucky Spin events occasionally give Epic skins at discounted diamond costs",
      ],
    },
    moderate: {
      budget: "$20–50/month",
      tips: [
        "Starlight + occasional limited Epic skin from events",
        "KOF, Star Wars, and other collab skins are limited-time and highly collectible",
        "Magic Wheel and Zodiac events have pity at 200 spins — plan if you want the Legend skin",
      ],
    },
    bigSpend: {
      tips: [
        "Legend and Collector skins cost $100–200+ through event gacha mechanics",
        "Magic Crystal skins (from Magic Wheel pity) are the rarest in the game",
      ],
      warnings: [
        "Legend skin gacha is expensive with no shortcut — expect to hit pity",
        "Collector skins release frequently, creating constant spending pressure",
      ],
    },
    bestValue: [
      "Starlight Membership ($10/month) — exclusive skin + diamonds + rewards",
      "First recharge bonus diamonds",
      "Fragment Shop redemptions for free Epic skins",
    ],
    avoid: [
      "Magic Wheel spins without enough diamonds to hit pity (200 spins)",
      "Buying heroes with Diamonds — use Battle Points instead",
      "Random skin boxes with low rates for featured items",
    ],
    updatedAt: "2026-03-01",
  },
];

export function getGuideBySlug(slug: string): SpendingGuide | undefined {
  return SPENDING_GUIDES.find((g) => g.gameSlug === slug);
}
