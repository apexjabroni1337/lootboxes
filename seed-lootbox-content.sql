-- Generated SQL INSERT statements for lootbox_content
-- Generated on 2026-03-02T00:50:32.561Z
-- Total records: 12

INSERT INTO lootbox_content (
  game_id,
  cost_per_pull,
  cost_to_pity,
  pulls_to_pity,
  has_pity_system,
  currency_name,
  currency_per_dollar,
  score_transparency,
  score_value,
  score_fairness,
  score_player_control,
  comparable_slugs,
  overview_html,
  pity_explanation_html,
  history_html,
  controversy_html,
  tips_html,
  editorial_html
)
SELECT
  g.id,
  2.5,
  225,
  90,
  true,
  'Primogems',
  64,
  7,
  2,
  3,
  3,
  ARRAY['honkai-star-rail', 'zenless-zone-zero', 'marvel-snap'],
  '<p>Genshin Impact uses a gacha system called "Wishes" that serves as the primary method for obtaining new characters and weapons. Players spend Primogems (the premium currency) or Intertwined/Acquaint Fates to make wishes on time-limited and permanent banners. Each wish costs 160 Primogems, equivalent to approximately $2.50 USD at the best Genesis Crystal exchange rate.</p>
<p>The system features multiple banner types: the Character Event Banner (featuring a limited 5-star character), the Weapon Event Banner, and the Standard Banner. Each has independent pity counters, meaning progress toward a guaranteed 5-star doesn''t carry between banner types.</p>
<p>HoYoverse (formerly miHoYo) publishes exact drop rates in-game as required by Chinese law, making this one of the more transparent gacha systems. However, the low base rates (0.6% for a 5-star) and the high cost to reach pity make it one of the more expensive systems in the market.</p>',
  '<p>Genshin Impact features both <strong>soft pity</strong> and <strong>hard pity</strong> mechanics:</p>
<p><strong>Soft Pity (Pull 74+):</strong> Starting at pull 74, the probability of receiving a 5-star item increases dramatically with each subsequent pull. Community research estimates the rate jumps to approximately 6% per pull at 74 and increases linearly, reaching roughly 33% by pull 89.</p>
<p><strong>Hard Pity (Pull 90):</strong> At exactly 90 pulls, you are guaranteed a 5-star item. This is the absolute ceiling — no player will ever go beyond 90 pulls without a 5-star.</p>
<p><strong>The 50/50 System:</strong> When you receive a 5-star on the Character Event Banner, there''s a 50% chance it''s the featured character and a 50% chance it''s a standard 5-star. If you lose the 50/50, your NEXT 5-star is guaranteed to be the featured character. This means the absolute worst case for a specific character is 180 pulls (~$450 USD).</p>
<p>In practice, the average pulls needed for a 5-star is approximately 62.5 due to soft pity, making the effective rate about 1.6%.</p>',
  '<p><strong>September 2020:</strong> Genshin Impact launches with the gacha system. Initial reception is polarized — praised for gameplay but criticized for aggressive monetization.</p>
<p><strong>2021:</strong> HoYoverse introduces the Epitomized Path system for the Weapon Banner, adding a pseudo-pity that guarantees the desired weapon after a maximum of 3 five-star pulls (240 wishes worst case).</p>
<p><strong>2022:</strong> Anniversary controversy erupts when players feel rewards are insufficient. HoYoverse eventually increases anniversary rewards after significant backlash.</p>
<p><strong>2023:</strong> Genshin introduces more generous free Primogem distribution and quality-of-life improvements to wish tracking. Monthly free pulls increase slightly.</p>
<p><strong>2024-2025:</strong> The system remains largely unchanged. Genshin continues to be one of the highest-grossing gacha games globally, earning billions in total revenue.</p>',
  '<p>Genshin Impact has faced sustained criticism for its gacha monetization despite being a free-to-play title. The primary complaint is the sheer cost required to obtain specific characters — potentially $450 USD in a worst-case scenario for a single character. For players who want multiple copies for "constellations" (character upgrades), costs can reach $2,000+ per character.</p>
<p>The 2021 anniversary controversy highlighted the tension between the game''s massive revenue and what players perceived as stingy reward distribution. The community organized review-bombing campaigns across app stores before HoYoverse improved anniversary rewards.</p>
<p>Consumer protection groups have raised concerns about the game''s appeal to younger audiences combined with gambling-like mechanics. Several countries have investigated or required additional disclosures. Despite this, the game''s generous free-to-play content and the fact that all content can be cleared without premium characters have also earned it defenders.</p>',
  '<p><strong>Save for characters you truly want.</strong> The worst mistake in Genshin is spending Primogems impulsively. Save for confirmed upcoming banners of characters you''re excited about.</p>
<p><strong>Understand the 50/50 system.</strong> If you lost your last 50/50, your next 5-star is guaranteed to be the featured character. This "guaranteed" status carries across banners, so plan accordingly.</p>
<p><strong>Never pull on the Standard Banner with Primogems.</strong> Use Primogems exclusively on limited banners. Standard Banner fates (Acquaint Fates) come free from leveling and other sources.</p>
<p><strong>Welkin Moon is the best value.</strong> The $4.99/month Welkin Moon blessing provides 3,000 Primogems over 30 days — roughly 19 pulls for $5, compared to the standard rate of about 2 pulls for $5.</p>
<p><strong>All content is clearable as free-to-play.</strong> Don''t feel pressured to pull for "meta" characters. Skill and team building matter far more than having the latest 5-star.</p>',
  '<p>Genshin Impact occupies a unique position in the loot box landscape. It''s a genuinely outstanding open-world RPG that happens to be monetized through one of the most expensive gacha systems in mainstream gaming. This duality — exceptional game, aggressive monetization — is at the heart of every discussion about Genshin''s business model.</p>
<p>The numbers tell a stark story. At $2.50 per pull and a 0.6% base rate for 5-star characters, the expected cost to obtain a specific featured character averages around $150-200 USD. Worst case with full pity and lost 50/50? That''s $450 for a single character. For context, most AAA games cost $60-70 for the complete experience. In Genshin, $450 gets you one character in a roster of over 80.</p>
<p>HoYoverse deserves credit for transparency — drop rates are clearly published in-game, and the pity system provides a hard ceiling on spending. The soft pity mechanic starting at pull 74 also means most players won''t actually hit the 90-pull hard pity, with the average landing around 62 pulls. These are genuine consumer-friendly features that many competitors lack.</p>
<p>Where the system falters is in value and player control. The constellation system — where pulling duplicate characters provides incremental power boosts — creates a whale trap where the true "complete" version of a character can cost upwards of $2,000. The weapon banner, despite improvements with Epitomized Path, remains widely regarded as a trap for all but the heaviest spenders.</p>
<p>We score Genshin Impact at 3.2 on our Lootboxes Scale. The transparency and pity system prevent a lower score, but the raw cost of participation, the constellation system, and the psychological pressure of limited-time banners (FOMO) drag it down significantly. The game itself is free-to-play friendly — all content can be completed with free characters — but the monetization clearly targets players who develop emotional attachments to specific characters and feel compelled to "complete" them.</p>
<p>Our advice? Enjoy Genshin as the remarkable free game it is. If you choose to spend, set a strict budget, buy Welkin Moon for the best value, and never chase constellations unless you''re comfortable treating it as a luxury entertainment expense.</p>'
FROM games g
WHERE g.slug = 'genshin-impact'
ON CONFLICT (game_id) DO NOTHING;

INSERT INTO lootbox_content (
  game_id,
  cost_per_pull,
  cost_to_pity,
  pulls_to_pity,
  has_pity_system,
  currency_name,
  currency_per_dollar,
  score_transparency,
  score_value,
  score_fairness,
  score_player_control,
  comparable_slugs,
  overview_html,
  pity_explanation_html,
  history_html,
  controversy_html,
  tips_html,
  editorial_html
)
SELECT
  g.id,
  2.5,
  225,
  90,
  true,
  'Stellar Jade',
  64,
  7,
  3,
  3,
  4,
  ARRAY['genshin-impact', 'zenless-zone-zero', 'marvel-snap'],
  '<p>Honkai: Star Rail employs the same gacha framework as its sister title Genshin Impact, with some notable improvements. Players use Stellar Jade to purchase Star Rail Passes or Special Passes for "Warps" on various banners. The cost per warp is equivalent to approximately $2.50 USD, with the same 0.6% base rate for 5-star characters.</p>
<p>The game features Character Event Warps, Light Cone (weapon) Warps, and a Standard Warp banner. Each maintains independent pity counters. HoYoverse has applied lessons learned from Genshin, offering slightly more generous free currency distribution and additional quality-of-life features for tracking pity progress.</p>
<p>As a turn-based RPG rather than an action game, Star Rail''s character diversity feels less critical to moment-to-moment gameplay, somewhat reducing the pressure to pull for every new character compared to Genshin Impact.</p>',
  '<p>Honkai: Star Rail uses an identical pity system to Genshin Impact:</p>
<p><strong>Soft Pity (Warp 74+):</strong> Drop rates increase significantly starting at warp 74, with community data suggesting rates climb to approximately 6% and increase linearly with each additional pull.</p>
<p><strong>Hard Pity (Warp 90):</strong> A 5-star character or Light Cone is guaranteed at exactly 90 warps.</p>
<p><strong>50/50 System:</strong> On the Character Event Warp, there''s a 50% chance of getting the featured character. Losing the 50/50 guarantees the featured character on your next 5-star pull. Maximum cost for a guaranteed featured character: 180 warps (~$450).</p>
<p>Average pulls to 5-star is approximately 62, making the effective rate roughly 1.6% — identical to Genshin Impact.</p>',
  '<p><strong>April 2023:</strong> Honkai: Star Rail launches globally with its gacha system largely mirroring Genshin Impact''s proven model.</p>
<p><strong>2023:</strong> The game earns over $1 billion in its first year, validating HoYoverse''s gacha approach. Free currency distribution is perceived as slightly more generous than Genshin''s early days.</p>
<p><strong>2024:</strong> Version 2.0 introduces new regions and characters, maintaining the same gacha structure. HoYoverse adds more ways to earn free pulls through events and achievements.</p>
<p><strong>2025:</strong> The system remains stable. Star Rail continues to be one of the top-grossing gacha games, consistently ranking in mobile revenue charts alongside Genshin.</p>',
  '<p>Honkai: Star Rail has largely avoided the major controversies that plagued Genshin Impact''s early days, partly because players already understood HoYoverse''s gacha model going in. However, criticism of the overall cost structure persists — the same $450 worst-case for a single character that defines all HoYoverse games.</p>
<p>The Light Cone (weapon) banner has drawn some criticism for being less valuable than character pulls, similar to Genshin''s weapon banner complaints. Some players feel that Eidolons (Star Rail''s equivalent of Genshin''s constellations) create too large a gap between free-to-play and spending players in endgame content.</p>
<p>Overall community sentiment is more positive than Genshin''s, largely due to HoYoverse applying lessons learned: better communication, more generous events, and a perceived respect for player time.</p>',
  '<p><strong>Prioritize characters over Light Cones.</strong> New characters add more gameplay variety than weapon upgrades. Light Cone banners are best reserved for heavy spenders.</p>
<p><strong>Take advantage of the Express Supply Pass.</strong> At $4.99/month, it''s the best value purchase — similar to Genshin''s Welkin Moon, providing roughly 19 warps worth of Stellar Jade over 30 days.</p>
<p><strong>Plan around version livestreams.</strong> HoYoverse announces upcoming banners during version preview streams. Use this information to plan your Stellar Jade savings.</p>
<p><strong>Don''t chase E6 (max Eidolons).</strong> Most characters are fully functional at E0. Eidolons provide diminishing returns relative to their enormous cost.</p>',
  '<p>Honkai: Star Rail represents an iterative improvement on HoYoverse''s gacha formula rather than a reinvention. The fundamental economics are identical to Genshin Impact — same 0.6% base rate, same pity system, same approximately $2.50 per pull. What''s different is the context and the quality-of-life improvements that come from a studio learning from its previous title.</p>
<p>The turn-based combat system actually works in the monetization''s favor from a consumer perspective. Because combat is strategic rather than action-based, individual character performance matters less than team composition and planning. Free-to-play players can compete with spenders more effectively than in Genshin, where character action mechanics can feel more impactful.</p>
<p>We score Honkai: Star Rail at 3.5 on our Lootboxes Scale — slightly better than Genshin''s 3.2. The higher score reflects the marginally more generous free currency, better communication from HoYoverse, and the game design that reduces the pressure to pull. The core economics remain the same, however, and the score reflects that $225-450 for a single character is still a steep ask.</p>
<p>The pattern is clear: HoYoverse has found a monetization formula that generates billions, and they''re refining the edges rather than changing the core. For players, the advice remains the same — enjoy the excellent free content, set a budget if you choose to spend, and never feel obligated to chase every new character.</p>'
FROM games g
WHERE g.slug = 'honkai-star-rail'
ON CONFLICT (game_id) DO NOTHING;

INSERT INTO lootbox_content (
  game_id,
  cost_per_pull,
  cost_to_pity,
  pulls_to_pity,
  has_pity_system,
  currency_name,
  currency_per_dollar,
  score_transparency,
  score_value,
  score_fairness,
  score_player_control,
  comparable_slugs,
  overview_html,
  pity_explanation_html,
  history_html,
  controversy_html,
  tips_html,
  editorial_html
)
SELECT
  g.id,
  1,
  NULL,
  NULL,
  false,
  'FC Points',
  100,
  4,
  1,
  2,
  2,
  ARRAY['pokemon-tcg-pocket', 'marvel-snap', 'counter-strike-2'],
  '<p>EA FC 25''s Ultimate Team mode features one of the most lucrative card pack systems in gaming history. Players purchase packs containing random player cards using either earned in-game coins or premium FC Points (purchased with real money). Pack prices range from 150 FC Points (~$1.50) for basic packs to 2,500+ FC Points for premium packs.</p>
<p>The system drives the entire Ultimate Team economy — players build squads by pulling cards from packs, trading on the transfer market, or completing Squad Building Challenges (SBCs). While the transfer market provides a direct purchase option, the most desirable cards often require either extraordinary luck from packs or millions of in-game coins.</p>
<p>EA was forced to disclose pack odds under EU regulations, revealing that the chances of pulling top-tier players are extraordinarily low. An Icon or Hero player has just a 0.04% chance — meaning on average, you''d need to open 2,500 packs to see one.</p>',
  '<p>EA FC 25 has <strong>no pity system</strong>. Every pack is an independent event with fixed probabilities. There is no mechanism that increases your chances after a streak of poor results, and no guaranteed reward threshold regardless of spending.</p>
<p>This makes EA FC''s pack system one of the most purely random (and potentially expensive) in mainstream gaming. The combination of no pity, low top-end rates, and annual game resets creates what critics call a "yearly money pit."</p>',
  '<p><strong>2009:</strong> FIFA Ultimate Team launches as a paid DLC add-on, introducing card packs to the FIFA franchise.</p>
<p><strong>2015-2018:</strong> FUT becomes FIFA''s primary revenue driver, with EA reporting billions in "live services" revenue largely from Ultimate Team pack sales across FIFA titles.</p>
<p><strong>2019:</strong> Belgium bans FIFA loot boxes, forcing EA to disable FC Point purchases in the country. The Netherlands follows with similar restrictions.</p>
<p><strong>2021:</strong> EA begins disclosing pack odds in compliance with regulations. The published rates confirm community suspicions about extremely low drop rates for elite players.</p>
<p><strong>2023:</strong> FIFA becomes EA FC following the end of the FIFA licensing deal. The Ultimate Team pack system continues unchanged under the new branding.</p>
<p><strong>2024-2025:</strong> EA FC 25 introduces Evolution system and updated SBCs but maintains the core pack economy. Regulatory scrutiny continues in multiple jurisdictions.</p>',
  '<p>EA''s Ultimate Team pack system is arguably the most controversial loot box system in all of gaming. It has been the subject of regulatory action, multiple lawsuits, and sustained public criticism. Belgium and the Netherlands have outright banned the purchase of FC Points, classifying packs as illegal gambling.</p>
<p>The annual reset is perhaps the most criticized aspect — every year when a new game launches, all cards and spending from the previous year become worthless. This creates a cycle where players spend hundreds or thousands annually, only to start from zero each September.</p>
<p>Class-action lawsuits in multiple countries have alleged that EA deliberately designs pack animations and reward structures to mimic gambling machines. Internal documents leaked during litigation revealed EA referring to players as "whales" and optimizing pack designs to maximize spending.</p>
<p>Despite all this, Ultimate Team continues to generate billions in annual revenue, making it one of the most financially successful monetization systems in entertainment history.</p>',
  '<p><strong>Never buy packs with FC Points.</strong> The expected value of pack purchases is consistently negative. The chances of pulling a player worth more than the pack cost are extremely low.</p>
<p><strong>Use the transfer market.</strong> If you want a specific player, buy them directly from the market using earned coins. It''s almost always cheaper than gambling on packs.</p>
<p><strong>Complete SBCs.</strong> Squad Building Challenges offer guaranteed rewards and are the most reliable way to obtain high-value cards without spending money.</p>
<p><strong>Remember the annual reset.</strong> Any money spent on FC Points becomes worthless when the next game launches. Budget accordingly and consider whether the temporary enjoyment justifies the cost.</p>',
  '<p>EA FC 25''s Ultimate Team represents what happens when loot box mechanics are optimized for maximum revenue extraction over decades of iteration. The system works because it taps into multiple psychological drives simultaneously: the collectible card urge, competitive gaming ambition, the gambling dopamine hit, and the social pressure of building impressive teams.</p>
<p>By every consumer-friendly metric, EA FC''s pack system fails. A 0.04% chance at the most desirable items with no pity system means the expected cost of a top-tier Icon player through packs alone is astronomically high. The annual reset compounds this — every dollar spent has a built-in expiration date, creating perpetual demand for new spending.</p>
<p>We score EA FC 25 at 2.1 on our Lootboxes Scale — one of the lowest scores in our database. The minimal transparency (odds are disclosed, but buried in menus), complete lack of pity, annual depreciation of all purchases, and the system''s documented psychological manipulation tactics all contribute to this score.</p>
<p>The saving grace — and the reason it doesn''t score even lower — is that the transfer market provides a genuine alternative. Players who never buy a single pack can still build competitive teams through smart trading, SBC completion, and Division Rivals rewards. The game doesn''t technically require spending, even if its entire design nudges you toward it.</p>
<p>Our strongest recommendation across our entire database: do not buy FC Points. The math is unambiguous, the annual reset is ruthless, and the psychological design is specifically engineered to override rational spending decisions. Play Ultimate Team for free, trade smartly, and enjoy the football. Your wallet will thank you.</p>'
FROM games g
WHERE g.slug = 'ea-fc-25'
ON CONFLICT (game_id) DO NOTHING;

INSERT INTO lootbox_content (
  game_id,
  cost_per_pull,
  cost_to_pity,
  pulls_to_pity,
  has_pity_system,
  currency_name,
  currency_per_dollar,
  score_transparency,
  score_value,
  score_fairness,
  score_player_control,
  comparable_slugs,
  overview_html,
  pity_explanation_html,
  history_html,
  controversy_html,
  tips_html,
  editorial_html
)
SELECT
  g.id,
  2,
  50,
  25,
  true,
  'Overwatch Coins',
  100,
  5,
  4,
  5,
  5,
  ARRAY['fortnite', 'apex-legends', 'valorant'],
  '<p>Overwatch 2''s monetization has undergone a dramatic transformation from its predecessor. The original Overwatch featured a loot box system where players earned boxes through gameplay and could purchase additional ones. Overwatch 2 largely replaced this with a Battle Pass system and a direct-purchase cosmetic shop, though limited loot box-like mechanics remain in certain events and promotions.</p>
<p>The current system revolves around seasonal Battle Passes ($9.99), a rotating cosmetic shop with direct purchases, and occasional event-based cosmetic crates. Overwatch Coins can be earned slowly through gameplay or purchased directly. Mythic skins — the rarest tier — are typically Battle Pass rewards rather than random drops.</p>
<p>The shift away from pure loot boxes was driven by regulatory pressure and changing industry norms, though the new system has its own criticisms regarding pricing and the slow rate of free coin earnings.</p>',
  '<p>Overwatch 2''s remaining loot box-like elements feature a <strong>pseudo-pity system</strong> where Legendary items are guaranteed within approximately 25 boxes/crates during events that still use the random reward model.</p>
<p>For the primary Battle Pass and shop systems, pity isn''t applicable — these are direct-purchase models where you know exactly what you''re getting before buying.</p>',
  '<p><strong>2016:</strong> Overwatch launches with a loot box system. Players earn boxes through leveling and can purchase additional ones. All cosmetics are available through this system.</p>
<p><strong>2018:</strong> Belgium and Netherlands restrictions force Blizzard to disable loot box purchases in those countries.</p>
<p><strong>2022:</strong> Overwatch 2 launches as free-to-play, replacing the original. The monetization shifts dramatically from loot boxes to Battle Pass and direct-purchase shop. Community backlash over skin pricing ($20+ for individual skins) is immediate and intense.</p>
<p><strong>2023-2024:</strong> Blizzard gradually adjusts pricing and increases free Overwatch Coin earnings in response to criticism. Mythic skins are added as premium Battle Pass rewards.</p>
<p><strong>2025:</strong> The system has stabilized with a mix of Battle Pass, shop, and occasional event crates. The pure loot box model is largely gone.</p>',
  '<p>The transition from Overwatch 1 to 2 was itself a major controversy. Players who had earned hundreds of loot boxes worth of cosmetics in the original game saw those items transfer, but the new system made earning comparable rewards dramatically slower without spending money.</p>
<p>Individual skin pricing in the shop (often $20+) was widely criticized as excessive, especially compared to the original game where all cosmetics could be earned through gameplay alone. The Battle Pass also drew criticism for offering mostly filler content with desirable items locked behind the premium track.</p>
<p>The slow rate of free Overwatch Coin earnings (approximately 8 weeks of challenges for a single $20 skin) has been a persistent complaint, effectively making the free-to-play economy feel punishing compared to the original game''s generosity.</p>',
  '<p><strong>The Battle Pass is the best value.</strong> At $9.99 per season, the Battle Pass provides the most cosmetics per dollar, including the exclusive Mythic skin at the end of the premium track.</p>
<p><strong>Complete weekly challenges.</strong> These are your primary source of free Overwatch Coins. Consistency over time adds up to meaningful purchasing power.</p>
<p><strong>Wait for returning skins.</strong> Shop items rotate back eventually, so there''s no need to impulse-buy during the first appearance of a skin you like.</p>
<p><strong>Avoid event crates unless you want everything in the pool.</strong> If you only want one specific item from an event crate, buying it directly from the shop (when available) is more cost-effective than gambling on random drops.</p>',
  '<p>Overwatch 2''s monetization story is really a tale of two systems. The original Overwatch''s loot boxes were considered among the fairest in gaming — generous earnings, cosmetic-only items, and a system where dedicated play could eventually unlock everything for free. Then the sequel abandoned that goodwill in favor of a more aggressive free-to-play model.</p>
<p>The irony is that Overwatch 2''s current system is actually more consumer-friendly than most of its competitors in terms of what you know you''re getting. Direct purchases from the shop mean no gambling on random outcomes. The Battle Pass has predictable rewards. The remaining random elements are limited to occasional event crates. In isolation, it''s a reasonable model.</p>
<p>The problem is context. Players remember how generous the original game was, and every $20 skin in the shop feels like a betrayal of that original promise. The slow drip of free coins also creates a frustrating experience for players who can''t or won''t spend money.</p>
<p>We score Overwatch 2 at 4.5 on our Lootboxes Scale. The move away from pure loot boxes, the transparency of direct purchases, and the Battle Pass value proposition all push the score up. But the aggressive shop pricing, slow free earnings, and the unfavorable comparison to its predecessor prevent a higher rating. It''s an average system in an above-average game.</p>'
FROM games g
WHERE g.slug = 'overwatch-2'
ON CONFLICT (game_id) DO NOTHING;

INSERT INTO lootbox_content (
  game_id,
  cost_per_pull,
  cost_to_pity,
  pulls_to_pity,
  has_pity_system,
  currency_name,
  currency_per_dollar,
  score_transparency,
  score_value,
  score_fairness,
  score_player_control,
  comparable_slugs,
  overview_html,
  pity_explanation_html,
  history_html,
  controversy_html,
  tips_html,
  editorial_html
)
SELECT
  g.id,
  1,
  500,
  500,
  true,
  'Apex Coins',
  100,
  5,
  2,
  3,
  3,
  ARRAY['overwatch-2', 'fortnite', 'counter-strike-2'],
  '<p>Apex Legends uses Apex Packs as its primary loot box mechanic — cosmetic crates containing three random items of varying rarity. Players earn a limited number of free packs through leveling (roughly 199 packs through level 500), with additional packs available for purchase at approximately $1.00 each when bought in bulk.</p>
<p>The crown jewel of the Apex Pack system is Heirloom Shards — an ultra-rare drop that allows players to craft a character-specific Heirloom weapon skin. With a 0.2% drop rate and a guarantee at 500 packs, Heirlooms represent one of the most expensive guaranteed cosmetics in gaming at approximately $500 USD.</p>
<p>Alongside the pack system, Apex features seasonal Battle Passes, a direct-purchase rotating shop, and Collection Events where all items from a themed collection must be obtained (usually through purchase) to unlock a new Heirloom.</p>',
  '<p>Apex Legends features two pity systems:</p>
<p><strong>Legendary Pity (30 packs):</strong> You are guaranteed at least one Legendary item within every 30 Apex Packs opened. This ensures regular "wow" moments during pack opening sessions.</p>
<p><strong>Heirloom Pity (500 packs):</strong> Heirloom Shards are guaranteed on your 500th pack if you haven''t received them earlier. At ~$1 per pack, this represents a $500 spending ceiling for the game''s most coveted cosmetic items. This is one of the highest pity ceilings in mainstream gaming.</p>
<p>Both pity counters persist across the lifetime of your account and are not reset between seasons.</p>',
  '<p><strong>February 2019:</strong> Apex Legends launches with the Apex Pack system. The game''s surprise release and polished gameplay quickly attract millions of players.</p>
<p><strong>August 2019:</strong> The Iron Crown Collection Event sparks massive backlash when players realize obtaining the new Heirloom requires spending over $150 on event packs. EA and Respawn apologize and adjust future event pricing.</p>
<p><strong>2020:</strong> EA discloses official drop rates as required by regulations. Heirloom Shards system replaces direct Heirloom drops, giving players choice in which character''s Heirloom to craft.</p>
<p><strong>2021-2024:</strong> Collection Events continue with a similar structure but with more ways to earn event packs through gameplay. The $500 Heirloom pity remains unchanged.</p>
<p><strong>2025:</strong> Apex continues to operate with the same fundamental pack economy, though the direct-purchase shop has become a larger portion of the monetization mix.</p>',
  '<p>The Iron Crown event of 2019 was a watershed moment for Apex''s monetization reputation. Players discovered that the event''s exclusive Bloodhound Heirloom could only be obtained by purchasing all 24 event-exclusive items ($7 each) — totaling $168 before the Heirloom was even unlockable. Respawn developers'' defensive responses on Reddit only inflamed the situation.</p>
<p>The $500 Heirloom pity ceiling remains a persistent criticism. While Heirlooms are purely cosmetic, they''ve become a status symbol within the community, and the price tag is difficult to justify by any consumer-friendly standard.</p>
<p>More recently, criticism has focused on the frequency and pricing of Collection Events, which effectively function as $168 paywalls for new Heirlooms. The rotating shop has also been criticized for inconsistent pricing and artificial scarcity tactics.</p>',
  '<p><strong>Never buy packs hoping for Heirloom Shards.</strong> At 0.2% odds, the expected cost is $500. If you want an Heirloom, accept that it''s a $500 commitment or wait for the free packs from leveling.</p>
<p><strong>Collection Events are the "cheapest" Heirloom path.</strong> At roughly $168 for all 24 items plus the Heirloom, Collection Events are actually cheaper than the 500-pack pity — and you get 24 other items along the way.</p>
<p><strong>The Battle Pass pays for itself.</strong> If you complete the Battle Pass, you earn enough Apex Coins to buy the next season''s pass, making it effectively a one-time $9.99 investment.</p>
<p><strong>Track your pack count.</strong> Third-party trackers can estimate how many packs you''ve opened lifetime, helping you gauge how close you are to Heirloom pity.</p>',
  '<p>Apex Legends sits in an interesting position in the loot box landscape. The core gameplay is among the best in the battle royale genre, and the game is entirely free-to-play with no pay-to-win elements whatsoever. Every match is decided by skill, not spending. But the cosmetic economy tells a different story — one of some of the most expensive individual items in gaming.</p>
<p>The $500 Heirloom pity is the elephant in the room. While it technically provides a guaranteed ceiling, that ceiling is set so high that it functions more as a psychological anchor than a genuine consumer protection. "At least it''s not random" rings hollow when "not random" costs as much as a new gaming console.</p>
<p>We rate Apex Legends at 3.0 on our Lootboxes Scale. The game earns points for having disclosed rates, persistent pity counters, and a zero pay-to-win policy. But the extreme cost of Heirlooms, the aggressive Collection Event pricing, and the manipulative rotation of the shop keep the score firmly in the "Poor Value" range.</p>
<p>Apex is a game best enjoyed with the mental model that Heirlooms simply don''t exist. Play the game for its exceptional gunplay and movement, enjoy the free cosmetics you earn, and treat any spending as a conscious luxury decision rather than a pursuit of specific items.</p>'
FROM games g
WHERE g.slug = 'apex-legends'
ON CONFLICT (game_id) DO NOTHING;

INSERT INTO lootbox_content (
  game_id,
  cost_per_pull,
  cost_to_pity,
  pulls_to_pity,
  has_pity_system,
  currency_name,
  currency_per_dollar,
  score_transparency,
  score_value,
  score_fairness,
  score_player_control,
  comparable_slugs,
  overview_html,
  pity_explanation_html,
  history_html,
  controversy_html,
  tips_html,
  editorial_html
)
SELECT
  g.id,
  NULL,
  NULL,
  NULL,
  false,
  'Platinum',
  100,
  6,
  6,
  7,
  7,
  ARRAY['fortnite', 'overwatch-2', 'rocket-league'],
  '<p>Diablo IV takes a different approach to monetization compared to traditional loot box games. The game uses a cosmetic shop and seasonal Battle Pass system rather than randomized paid loot boxes. The "loot" in Diablo IV refers to the in-game item drop system — the core gameplay loop of killing monsters and finding gear — which is entirely separate from the premium monetization.</p>
<p>Players spend Platinum (premium currency) in the cosmetic shop for character skins, mounts, and visual effects. The seasonal Battle Pass ($9.99 premium, or $24.99 accelerated) provides cosmetic rewards through gameplay progression. None of these purchases affect gameplay power.</p>
<p>The in-game loot system, however, features randomized drop rates for equipment that directly impacts gameplay. Mythic Unique items have an extremely low 0.02% drop rate, making them exceedingly rare finds that can take hundreds of hours to obtain.</p>',
  '<p>Diablo IV''s premium shop is <strong>direct-purchase only</strong> — no randomness, no pity needed. You see exactly what you''re buying.</p>
<p>The in-game loot system has <strong>no formal pity mechanic</strong> for item drops. Drop rates are fixed based on difficulty level and enemy type. There are systems that increase drop quality (such as Nightmare Dungeons and Helltides), but no guaranteed drops of specific items regardless of time invested.</p>
<p>The "bad luck protection" that exists is purely informal — higher World Tiers and endgame activities increase the overall drop rates, but a specific Mythic Unique is never guaranteed.</p>',
  '<p><strong>June 2023:</strong> Diablo IV launches as a premium $69.99 title with a cosmetic shop and seasonal Battle Pass. The initial monetization model is relatively restrained compared to free-to-play titles.</p>
<p><strong>2023:</strong> Season 1 launches with its first Battle Pass. Shop prices for premium bundles ($20-25 for cosmetic sets) draw some criticism but are generally accepted for a premium title.</p>
<p><strong>2024:</strong> Vessel of Hatred expansion launches at $39.99. The monetization model expands slightly with new cosmetic categories. In-game loot tables are adjusted multiple times to improve the endgame experience.</p>
<p><strong>2025:</strong> Drop rates for Mythic Uniques are adjusted upward slightly after community feedback about the extreme rarity. The cosmetic shop continues as the primary monetization outside of expansion sales.</p>',
  '<p>Diablo IV''s monetization is relatively mild compared to free-to-play titles, but it hasn''t been without criticism. The decision to include a cosmetic shop in a $70 premium game drew initial skepticism, though the separation of cosmetics from gameplay power has been largely respected.</p>
<p>The bigger controversy surrounds the in-game loot system. The 0.02% Mythic Unique drop rate means some players invest hundreds of hours without finding specific items, leading to frustration and debates about whether the loot system respects player time. Season 4''s loot rework was a direct response to these concerns.</p>
<p>Some criticism has been leveled at the Battle Pass for containing filler content and requiring significant play time to complete, but the overall sentiment is that Diablo IV''s monetization is among the more reasonable in modern gaming — a relatively low bar, but one it clears.</p>',
  '<p><strong>The Battle Pass is optional.</strong> All gameplay content is accessible without the Battle Pass. Only purchase it if you genuinely play enough to complete it and want the cosmetic rewards.</p>
<p><strong>Wait for sales on cosmetic bundles.</strong> Shop items occasionally go on sale or are bundled with better value during seasonal events.</p>
<p><strong>For loot: focus on efficient farming.</strong> Higher Nightmare Dungeon tiers and Helltide events significantly increase drop rates for rare items. Play smarter, not just longer.</p>
<p><strong>Don''t chase Mythic Uniques.</strong> At 0.02% drop rate, these items should be treated as pleasant surprises rather than goals. Build your character around what drops naturally.</p>',
  '<p>Diablo IV occupies a refreshingly moderate position in the modern monetization landscape. As a premium-priced game ($69.99 base), it doesn''t rely on aggressive loot box mechanics to drive revenue. The cosmetic shop exists and the Battle Pass is there, but neither feels predatory or essential. This alone puts it ahead of many competitors in our database.</p>
<p>Where Diablo IV intersects with loot box concerns is through its in-game drop rate system. While not a premium loot box — you don''t pay real money per "pull" — the Mythic Unique drop rates (0.02%) rival some of the most punishing gacha rates in the industry. The difference is that you''re investing time rather than money, and the journey of hunting for loot IS the game rather than a monetization overlay.</p>
<p>We score Diablo IV at 6.5 on our Lootboxes Scale — comfortably in the "Good Value" range. The direct-purchase cosmetic shop with no randomness, reasonable Battle Pass pricing, and the separation of premium currency from gameplay power all contribute positively. The score is moderated by the premium price tag plus ongoing monetization, and the extremely rare in-game drop rates that, while not paid, can still feel unrewarding.</p>
<p>Diablo IV demonstrates that a major live-service game can monetize responsibly. It''s not perfect, but it''s a model that more games should aspire to.</p>'
FROM games g
WHERE g.slug = 'diablo-4'
ON CONFLICT (game_id) DO NOTHING;

INSERT INTO lootbox_content (
  game_id,
  cost_per_pull,
  cost_to_pity,
  pulls_to_pity,
  has_pity_system,
  currency_name,
  currency_per_dollar,
  score_transparency,
  score_value,
  score_fairness,
  score_player_control,
  comparable_slugs,
  overview_html,
  pity_explanation_html,
  history_html,
  controversy_html,
  tips_html,
  editorial_html
)
SELECT
  g.id,
  NULL,
  NULL,
  NULL,
  false,
  'V-Bucks',
  100,
  7,
  6,
  6,
  7,
  ARRAY['overwatch-2', 'valorant', 'apex-legends'],
  '<p>Fortnite has evolved its monetization significantly since launch. The game originally featured randomized Loot Llamas in its Save the World mode, but the massively popular Battle Royale mode has moved almost entirely to direct-purchase cosmetics and a seasonal Battle Pass system.</p>
<p>The current monetization centers on V-Bucks, which can be used to purchase items from the rotating Item Shop or the seasonal Battle Pass ($9.50). The Item Shop offers skins, emotes, wraps, and other cosmetics at fixed prices, with no randomness involved in most purchases.</p>
<p>While the Save the World mode retains some loot box elements with X-Ray Llamas (which now show their contents before purchase), the Battle Royale experience is primarily a direct-purchase model. This makes Fortnite one of the more consumer-friendly free-to-play games in terms of monetization transparency.</p>',
  '<p>Fortnite''s Battle Royale mode is predominantly a <strong>direct-purchase system</strong> and does not have traditional pity mechanics. You buy exactly what you see in the Item Shop.</p>
<p>The Save the World mode features X-Ray Llamas that show their contents before purchase — effectively eliminating the "random" element that would necessitate a pity system. This was a significant consumer-friendly change made after regulatory scrutiny.</p>',
  '<p><strong>2017:</strong> Fortnite launches with Save the World mode featuring Loot Llamas — randomized loot boxes. The free Battle Royale mode launches later with the Item Shop.</p>
<p><strong>2018:</strong> The Battle Pass system is introduced for Season 2, revolutionizing gaming monetization. The $9.50 Battle Pass becomes the industry standard that dozens of games would copy.</p>
<p><strong>2019:</strong> X-Ray Llamas are introduced in Save the World, showing contents before purchase in response to loot box criticism. This effectively makes them a "see before you buy" system.</p>
<p><strong>2020-2023:</strong> The Item Shop expands with collaborations (Marvel, Star Wars, etc.) and increasingly premium pricing for branded skins ($15-20+). The Battle Pass remains at $9.50.</p>
<p><strong>2024-2025:</strong> Fortnite continues to refine its shop with more direct-purchase bundles and collaboration events. The monetization is firmly in the "cosmetic shop" category rather than loot boxes.</p>',
  '<p>Fortnite''s early loot box system in Save the World drew criticism, but Epic Games addressed it proactively with X-Ray Llamas. The bigger, ongoing controversy is around the game''s appeal to children combined with aggressive marketing of premium cosmetics.</p>
<p>The FTC investigated Epic Games over its marketing practices toward children, resulting in a $520 million settlement in 2022 covering both privacy violations and practices that led to unwanted charges for minors. Epic implemented additional purchase safeguards as a result.</p>
<p>Community criticism tends to focus on the high pricing of collaboration skins ($15-20 for a single skin) and the FOMO-driven rotating shop that creates pressure to buy items before they disappear — potentially for months.</p>',
  '<p><strong>The Battle Pass is excellent value.</strong> At $9.50 per season, it provides dozens of cosmetics and enough V-Bucks to buy the next season''s pass if you complete it. It''s effectively a one-time purchase.</p>
<p><strong>Wait for items to return.</strong> Almost every Item Shop skin eventually returns. Don''t impulse buy — if you still want it when it comes back, it''ll be there.</p>
<p><strong>Set spending limits for younger players.</strong> Fortnite''s design creates social pressure to own premium skins. Having a clear budget prevents overspending.</p>
<p><strong>Earn V-Bucks through Save the World.</strong> If you own Save the World, daily quests provide free V-Bucks that can be used in Battle Royale.</p>',
  '<p>Fortnite deserves credit for being one of the most proactive mainstream games in moving away from predatory loot box mechanics. The introduction of X-Ray Llamas in Save the World and the consistently direct-purchase model in Battle Royale set an industry example that other games have been slow to follow.</p>
<p>The Battle Pass model that Fortnite popularized is now the gold standard of gaming monetization — a fixed price for a known set of rewards, with gameplay progression as the unlocking mechanism. At $9.50 with enough V-Bucks to fund the next season, it''s genuinely one of the best value propositions in free-to-play gaming.</p>
<p>We score Fortnite at 6.0 on our Lootboxes Scale. The transparency of direct purchases, the excellent Battle Pass value, and the proactive addressing of loot box concerns all earn high marks. The score is pulled down by the premium pricing on individual shop items, the FOMO tactics of the rotating shop, and the ongoing concerns about marketing to children.</p>
<p>Fortnite shows that a game can be massively profitable without resorting to predatory loot box mechanics. It''s not perfect — the psychological pressure of rotating shops and collaboration FOMO is real — but it''s a model the industry should learn from.</p>'
FROM games g
WHERE g.slug = 'fortnite'
ON CONFLICT (game_id) DO NOTHING;

INSERT INTO lootbox_content (
  game_id,
  cost_per_pull,
  cost_to_pity,
  pulls_to_pity,
  has_pity_system,
  currency_name,
  currency_per_dollar,
  score_transparency,
  score_value,
  score_fairness,
  score_player_control,
  comparable_slugs,
  overview_html,
  pity_explanation_html,
  history_html,
  controversy_html,
  tips_html,
  editorial_html
)
SELECT
  g.id,
  0,
  NULL,
  NULL,
  false,
  'Credits',
  100,
  6,
  5,
  5,
  5,
  ARRAY['overwatch-2', 'fortnite', 'counter-strike-2'],
  '<p>Rocket League underwent a major monetization transformation in 2019 when Psyonix replaced the traditional loot crate/key system with Blueprints and a Credits-based economy. Previously, players bought keys ($1.49 each) to open random crates — a classic loot box model. The new system shows players what item a Blueprint contains before they decide whether to spend Credits to build it.</p>
<p>The current system revolves around Blueprints (which drop randomly after matches and show their contents), the Item Shop (rotating direct purchases), and the Rocket Pass (seasonal Battle Pass). Credits are the premium currency, purchasable at roughly 100 per dollar.</p>
<p>While the system is more transparent than the old crate model, Blueprint build costs have been criticized for being significantly higher than what items cost on the secondary market, making them poor value for most players.</p>',
  '<p>The current Blueprint system has <strong>no pity mechanic</strong>, but it also doesn''t need one in the traditional sense — Blueprints show their contents before you spend Credits, so you always know what you''re getting.</p>
<p>The old crate system (pre-2019) also had no pity, making it a pure random gamble with each key purchase.</p>
<p>Blueprint drop rates from post-match rewards follow the disclosed rates: Black Market 1%, Exotic 4%, Import 12%, Very Rare 28%, Rare 55%.</p>',
  '<p><strong>2015:</strong> Rocket League launches with a cosmetic crate and key system, similar to CS:GO''s model.</p>
<p><strong>2019:</strong> Under pressure from loot box regulations and following Epic Games'' acquisition of Psyonix, crates are replaced with Blueprints. Psyonix publishes official drop rates for the first time during this transition.</p>
<p><strong>2020:</strong> Rocket League goes free-to-play, adding the Item Shop and Rocket Pass as primary monetization. The Blueprint system continues alongside these.</p>
<p><strong>2021-2025:</strong> The system has remained largely stable, with periodic adjustments to shop pricing and Rocket Pass rewards. The player trading market continues to be active for moving items between players.</p>',
  '<p>The transition from crates to Blueprints was initially praised for removing randomness, but the celebration was short-lived when players discovered Blueprint build costs. Items that previously cost $1.49 in a random crate now cost $5-20 to build from a Blueprint — a massive price increase for known items.</p>
<p>The community argued that Psyonix had effectively replaced a gambling system with overpriced direct purchases, with the net result being worse value for players. The secondary trading market often offers the same items for a fraction of the Blueprint build cost.</p>
<p>Going free-to-play in 2020 also frustrated original purchasers who had paid $20 for the game, though Psyonix offered legacy status rewards as compensation.</p>',
  '<p><strong>Never build Blueprints.</strong> The build costs are almost universally higher than buying the same item from other players through trading. Use third-party trading sites to find better prices.</p>
<p><strong>The Rocket Pass is decent value.</strong> If you play regularly, the seasonal Rocket Pass provides cosmetics and enough Credits to offset the cost. Complete it and the next pass is essentially free.</p>
<p><strong>Trade up items.</strong> The trade-up system lets you combine 5 items of one rarity for 1 item of the next rarity. This can be a cost-effective way to obtain specific items.</p>
<p><strong>Check trading prices before buying from the shop.</strong> The Item Shop often charges premium prices for items that trade for much less between players.</p>',
  '<p>Rocket League''s monetization journey is instructive. The game went from loot boxes (crates) to a transparent Blueprint system, only for players to discover that transparency without competitive pricing is barely an improvement. When a known item costs more to build from a Blueprint than a random crate previously cost, the "improvement" feels hollow.</p>
<p>We score Rocket League at 5.0 on our Lootboxes Scale — squarely average. The Blueprint transparency and the removal of paid randomness are genuine positives. The player trading market provides an alternative economy. But the inflated Blueprint costs and the mismatch between shop prices and market values prevent a higher score.</p>
<p>Rocket League is a case study in how removing loot boxes isn''t automatically a win for consumers. The replacement system matters enormously. A direct-purchase model with reasonable pricing is great. A direct-purchase model with inflated pricing can feel like a different flavor of the same exploitation.</p>'
FROM games g
WHERE g.slug = 'rocket-league'
ON CONFLICT (game_id) DO NOTHING;

INSERT INTO lootbox_content (
  game_id,
  cost_per_pull,
  cost_to_pity,
  pulls_to_pity,
  has_pity_system,
  currency_name,
  currency_per_dollar,
  score_transparency,
  score_value,
  score_fairness,
  score_player_control,
  comparable_slugs,
  overview_html,
  pity_explanation_html,
  history_html,
  controversy_html,
  tips_html,
  editorial_html
)
SELECT
  g.id,
  NULL,
  NULL,
  NULL,
  false,
  'Valorant Points (VP)',
  100,
  8,
  6,
  8,
  8,
  ARRAY['fortnite', 'overwatch-2', 'counter-strike-2'],
  '<p>Valorant''s monetization is almost entirely based on direct purchases — a rarity in the competitive shooter space. Players buy weapon skins, gun buddies, and other cosmetics from the rotating daily shop or through premium skin bundles. There are no loot boxes in the traditional sense.</p>
<p>The closest thing to randomized content is the Night Market — a periodic event where players receive personalized discounts on a random selection of skins. The Night Market offers 6 random skins at discounted prices, but players see exactly what''s offered and can choose whether to purchase.</p>
<p>Valorant Points (VP) are purchased at roughly 100 per $1. Individual skin prices range from roughly $10 for Select Edition skins to $25+ for Premium and Exclusive Edition bundles. Complete bundle purchases (4-5 weapon skins plus extras) typically cost $50-100.</p>',
  '<p>Valorant has <strong>no pity system because there are no loot boxes</strong>. All purchases are direct — you see exactly what you''re buying before spending. The Night Market shows you the random selection of discounted skins upfront, with no hidden mechanics.</p>
<p>This is one of the most consumer-transparent systems in competitive gaming.</p>',
  '<p><strong>June 2020:</strong> Valorant launches with its direct-purchase cosmetic shop model. No loot boxes are included from day one — a conscious design choice by Riot Games.</p>
<p><strong>2020:</strong> The Night Market is introduced as a periodic event, offering randomized discounts on a personal selection of skins. Community reception is positive.</p>
<p><strong>2021-2023:</strong> Skin quality and pricing escalate with increasingly elaborate Premium and Exclusive Edition skins featuring custom animations, sounds, and finishers. Bundle prices frequently exceed $70.</p>
<p><strong>2024-2025:</strong> The Battle Pass remains at a stable price point while the shop continues to feature high-priced premium bundles. Riot maintains the no-loot-box stance consistently.</p>',
  '<p>Valorant''s primary criticism is price, not randomness. Individual Premium Edition skins at $17.50+ and Exclusive bundles at $70-100 are among the highest in the competitive shooter genre. Players frequently point out that a single skin bundle can cost more than many full-priced games.</p>
<p>The lack of a way to earn VP through gameplay means free-to-play players have extremely limited cosmetic options. The free Battle Pass track is widely considered to offer minimal value compared to the premium track and shop items.</p>
<p>However, the community generally acknowledges that Riot''s approach — high prices but no gambling — is preferable to randomized loot box systems. The controversy is about value rather than fairness.</p>',
  '<p><strong>Wait for the Night Market.</strong> Night Market discounts can be significant (up to 50% off), making it the best time to pick up skins you''ve been eyeing.</p>
<p><strong>Buy bundles, not individual skins.</strong> Purchasing a complete bundle is almost always cheaper per-skin than buying individual weapons separately.</p>
<p><strong>The Battle Pass is the best entry point.</strong> At roughly $10, it provides the most cosmetics per dollar and introduces you to different skin styles before committing to expensive shop purchases.</p>
<p><strong>Radianite Points are misleading.</strong> Some premium skins require Radianite Points to unlock upgrades (VFX, finishers). Factor this additional cost into your purchasing decisions — a "complete" skin may cost more than the listed price.</p>',
  '<p>Valorant stands as proof that a major competitive game can succeed financially without loot boxes. Riot Games made a deliberate choice to avoid randomized monetization from day one, and the result is a system that, while expensive, is fundamentally honest.</p>
<p>We score Valorant at 7.5 on our Lootboxes Scale — one of the highest in our database. The score reflects the complete absence of randomized paid content, full transparency in pricing, and the Night Market as a player-friendly discount mechanism. The score isn''t higher because the raw prices are steep, the free-to-play cosmetic options are limited, and the Radianite upgrade system adds hidden costs to premium purchases.</p>
<p>Valorant''s model proves an important principle: transparency and player control matter more than raw price. Players generally prefer paying $25 for a known skin they want over paying $2.50 for a random chance at it. Riot understands that trust builds long-term revenue better than exploitation, and their consistently growing revenue numbers support this thesis.</p>
<p>If every game adopted Valorant''s approach — direct purchases with clear pricing, no gambling mechanics, no pity systems needed because there''s nothing random — the gaming industry would be dramatically more consumer-friendly. The prices might still sting, but at least you''d always know what you''re getting.</p>'
FROM games g
WHERE g.slug = 'valorant'
ON CONFLICT (game_id) DO NOTHING;

INSERT INTO lootbox_content (
  game_id,
  cost_per_pull,
  cost_to_pity,
  pulls_to_pity,
  has_pity_system,
  currency_name,
  currency_per_dollar,
  score_transparency,
  score_value,
  score_fairness,
  score_player_control,
  comparable_slugs,
  overview_html,
  pity_explanation_html,
  history_html,
  controversy_html,
  tips_html,
  editorial_html
)
SELECT
  g.id,
  0.5,
  NULL,
  NULL,
  false,
  'Pack Hourglasses',
  6,
  6,
  3,
  4,
  4,
  ARRAY['ea-fc-25', 'marvel-snap', 'genshin-impact'],
  '<p>Pokemon TCG Pocket brings the iconic Pokemon Trading Card Game to mobile with a digital booster pack system. Players open packs containing 5 cards each, with rarity determined by the established Pokemon TCG rarity system (Common through Crown Rare). Free packs are earned through a timer system (one pack every 12 hours), with additional packs available through premium purchases.</p>
<p>The game uses Pack Hourglasses as its acceleration currency — spending hourglasses lets you open additional packs beyond the free timer. The Crown Rare cards (the most desirable "immersive" full-art cards) have an extremely low 0.04% drop rate, making them among the rarest pulls in any digital card game.</p>
<p>The Pokemon brand''s appeal to younger audiences makes the monetization model particularly scrutinized. While the free pack timer ensures some level of free access, the ultra-low rates for premium cards create significant spending pressure for collectors.</p>',
  '<p>Pokemon TCG Pocket has <strong>no formal pity system</strong>. Every pack is an independent random event with fixed rates. There is no guaranteed Crown Rare or Secret Rare after any number of packs.</p>
<p>The only "pseudo-pity" is the God Pack — an extremely rare special pack where all 5 cards are high rarity. These appear randomly at a very low rate and function as a bonus rather than a reliable mechanism.</p>
<p>The absence of pity combined with a 0.04% Crown Rare rate means the expected cost to pull a specific Crown Rare card is extremely high.</p>',
  '<p><strong>October 2024:</strong> Pokemon TCG Pocket launches globally, immediately becoming one of the top-grossing mobile games. The nostalgia factor and Pokemon brand drive massive initial downloads.</p>
<p><strong>Late 2024:</strong> Players begin documenting the extremely low Crown Rare rates. Community data collection confirms the official 0.04% figure, sparking discussions about value.</p>
<p><strong>2025:</strong> New card sets are released regularly, each expanding the pool of potential pulls and making specific cards harder to obtain. The game introduces trading features with significant restrictions (only cards of the same rarity can be traded).</p>',
  '<p>The primary concern with Pokemon TCG Pocket is the combination of an extremely child-friendly brand with some of the lowest premium drop rates in digital gaming. A 0.04% Crown Rare rate means a player could spend hundreds of dollars without seeing a single one.</p>
<p>The restricted trading system has also drawn criticism — players cannot freely trade cards of different rarities, limiting the ability of the community to self-correct the harsh drop rates through player-to-player exchange.</p>
<p>Parent advocacy groups have raised concerns about the game''s "just one more pack" timer mechanic and the way premium currency is marketed to a demographic that skews young. The Pokemon Company''s family-friendly reputation creates heightened expectations for responsible monetization.</p>',
  '<p><strong>Be patient with the free timer.</strong> Two free packs per day adds up quickly. In a month, that''s 60 free packs — enough to build a solid collection without spending.</p>
<p><strong>Focus on completing sets, not chasing Crown Rares.</strong> The odds are against you. Enjoy the collection journey with Common through Rare cards, and let Crown Rares be pleasant surprises.</p>
<p><strong>Use Wonder Pick wisely.</strong> The Wonder Pick feature lets you choose a card from another player''s recent pack. This is a strategic tool for targeting specific cards you need.</p>
<p><strong>Don''t spend Pack Hourglasses on chase cards.</strong> The math doesn''t support buying packs to hunt specific Crown Rares. Use free hourglasses earned through gameplay.</p>',
  '<p>Pokemon TCG Pocket is a beautifully designed digital card game that captures the joy of opening Pokemon card packs — with all the problematic economics that implies. The 0.04% Crown Rare rate translates to an expected 2,500 packs to see one, making these among the most elusive items in any game we track.</p>
<p>The Pokemon brand creates a unique tension. On one hand, the game''s appeal to children demands responsible monetization practices. On the other, the physical Pokemon TCG has always been about random packs and rare pulls — this is simply the digital version of a decades-old model. The counterargument is that digital goods have zero production cost, making the artificial scarcity harder to justify.</p>
<p>We score Pokemon TCG Pocket at 4.0 on our Lootboxes Scale. The free pack timer ensures baseline access, the disclosed rates provide transparency, and the game''s core experience is genuinely enjoyable without spending. But the extreme rarity of premium cards, the restrictions on trading, and the child-audience concern prevent a higher score.</p>
<p>For parents: set spending limits and have conversations about odds before letting children spend on additional packs. For collectors: accept that completing a full set including Crown Rares is designed to be extremely expensive, and enjoy the journey of building your collection gradually through free packs.</p>'
FROM games g
WHERE g.slug = 'pokemon-tcg-pocket'
ON CONFLICT (game_id) DO NOTHING;

INSERT INTO lootbox_content (
  game_id,
  cost_per_pull,
  cost_to_pity,
  pulls_to_pity,
  has_pity_system,
  currency_name,
  currency_per_dollar,
  score_transparency,
  score_value,
  score_fairness,
  score_player_control,
  comparable_slugs,
  overview_html,
  pity_explanation_html,
  history_html,
  controversy_html,
  tips_html,
  editorial_html
)
SELECT
  g.id,
  1.5,
  NULL,
  NULL,
  false,
  'Gold',
  100,
  4,
  5,
  5,
  6,
  ARRAY['pokemon-tcg-pocket', 'ea-fc-25', 'honkai-star-rail'],
  '<p>Marvel Snap uses a progression-based card acquisition system that blends collection mechanics with gacha-like randomness. Players advance along a Collection Level track by upgrading cards, earning random new cards from the pool at various milestones. The speed of this progression can be accelerated through spending.</p>
<p>The game categorizes cards into Series (Pool 1-5), with higher-series cards being harder to obtain. Series 4 and 5 cards are the most powerful and rarest, available through Collector''s Reserves (random drops from the collection track), Token Shop purchases, or Spotlight Caches.</p>
<p>Spotlight Caches are the closest thing to a traditional gacha — weekly featured cards with a curated pool of 4 possible outcomes. Players can earn keys through gameplay to open these caches, providing a somewhat predictable path to specific new cards.</p>',
  '<p>Marvel Snap has <strong>no traditional pity system</strong>. Collector''s Reserves and Spotlight Caches are independent random events.</p>
<p>However, the Spotlight Cache system provides a form of pseudo-pity: each cache has only 4 possible outcomes, and pulled items are removed from the pool. This means the 4th cache guarantees the remaining item — a natural pity-like mechanic, though you need 4 keys (earned through considerable gameplay or spending).</p>',
  '<p><strong>October 2022:</strong> Marvel Snap launches globally. The Collection Level system is praised for its innovative approach to card acquisition, but concerns emerge about the endgame grind for Series 5 cards.</p>
<p><strong>2023:</strong> The Token Shop and Spotlight Cache systems are introduced to address criticism about the randomness of high-series card acquisition. These provide more deterministic paths to specific cards.</p>
<p><strong>2024:</strong> Second Dinner adjusts the economy multiple times in response to player feedback. Season passes become a larger part of the monetization mix.</p>
<p><strong>2025:</strong> The game continues to evolve its economy, with ongoing tension between accessibility for new players and monetization depth for veterans.</p>',
  '<p>Marvel Snap''s primary controversy has been the "Series 5 problem" — the extreme difficulty of obtaining the newest, most powerful cards without significant spending or months of patient gameplay. This created a perceived pay-to-win dynamic in a competitive game, where players with new Series 5 cards had meaningful advantages.</p>
<p>The frequent economy changes have also frustrated players, with some feeling that the monetization goalposts keep shifting. Prices, earn rates, and card series assignments have all been adjusted multiple times, making it difficult for players to plan their resource spending.</p>
<p>Recent pricing decisions for bundles and cosmetic variants have drawn criticism for escalating costs, though the core card acquisition remains technically possible through free play.</p>',
  '<p><strong>Save Spotlight Keys.</strong> Spotlight Caches are the most efficient way to target specific new cards. Save keys for cards that genuinely interest you rather than spending on every new release.</p>
<p><strong>Upgrade cards strategically.</strong> Boosters and credits drive your Collection Level progress. Focus upgrades on cards you use frequently to maximize value.</p>
<p><strong>The Season Pass is good value.</strong> Each season''s pass provides a guaranteed card plus additional rewards for active players.</p>
<p><strong>Don''t rush Series 5 cards.</strong> Many competitive decks use primarily Series 3 cards. Build a strong collection foundation before chasing the rarest cards.</p>',
  '<p>Marvel Snap tried something genuinely different with its Collection Level system, and the results have been mixed. The concept — tying card acquisition to collection upgrading rather than pure pack opening — is clever and creates a satisfying progression loop. But the endgame reveals familiar problems: rare cards are extremely hard to obtain for free, and spending money significantly accelerates the process in a competitive game.</p>
<p>The Spotlight Cache system was a major improvement, providing a more deterministic path to new cards. With only 4 outcomes per cache and removal of pulled items, players can target specific cards with reasonable certainty — though the key economy means this isn''t free.</p>
<p>We score Marvel Snap at 5.5 on our Lootboxes Scale. The innovative progression system, Spotlight Caches, and the genuinely fun free-to-play experience earn positive marks. The score is held back by the opaque rarity rates in Collector''s Reserves, the evolving (sometimes worsening) economy, and the competitive advantage that spending provides.</p>
<p>Marvel Snap is at its best when treated as a casual card game rather than a competitive ladder climber. Play for the fun of building creative decks, and the monetization pressure fades significantly.</p>'
FROM games g
WHERE g.slug = 'marvel-snap'
ON CONFLICT (game_id) DO NOTHING;

INSERT INTO lootbox_content (
  game_id,
  cost_per_pull,
  cost_to_pity,
  pulls_to_pity,
  has_pity_system,
  currency_name,
  currency_per_dollar,
  score_transparency,
  score_value,
  score_fairness,
  score_player_control,
  comparable_slugs,
  overview_html,
  pity_explanation_html,
  history_html,
  controversy_html,
  tips_html,
  editorial_html
)
SELECT
  g.id,
  2.5,
  225,
  90,
  true,
  'Polychrome',
  64,
  7,
  3,
  3,
  4,
  ARRAY['genshin-impact', 'honkai-star-rail', 'marvel-snap'],
  '<p>Zenless Zone Zero, HoYoverse''s third major gacha title, uses the same fundamental Signal Search (gacha) system as Genshin Impact and Honkai: Star Rail. Players use Polychrome (premium currency) to purchase Master Tapes or Encrypted Master Tapes for pulls on various banners.</p>
<p>The system features the same banner types: Exclusive Agent banners (limited characters), W-Engine banners (weapons), and a Standard banner. The rates are identical to its sister titles — 0.6% base rate for S-Rank agents with soft pity starting around pull 74 and hard pity at 90.</p>
<p>What distinguishes ZZZ''s gacha is the game''s action combat system, which makes individual character kits feel more distinct and impactful than in turn-based Star Rail, creating stronger desire for specific pulls — similar to the Genshin dynamic.</p>',
  '<p>Zenless Zone Zero uses <strong>HoYoverse''s standard pity system</strong>:</p>
<p><strong>Soft Pity (~Pull 74+):</strong> S-Rank probability increases significantly starting around pull 74, with rates climbing sharply with each subsequent pull.</p>
<p><strong>Hard Pity (Pull 90):</strong> An S-Rank agent or W-Engine is guaranteed at exactly 90 pulls.</p>
<p><strong>50/50 System:</strong> Exclusive Agent banners feature a 50% chance of the featured agent. Losing the 50/50 guarantees the featured agent on your next S-Rank. Maximum cost for a specific agent: 180 pulls (~$450).</p>
<p>Average pulls to S-Rank is approximately 62 due to soft pity, making the effective rate about 1.6% — identical to Genshin and Star Rail.</p>',
  '<p><strong>July 2024:</strong> Zenless Zone Zero launches globally as HoYoverse''s third major title. The gacha system is immediately familiar to Genshin and Star Rail players.</p>
<p><strong>2024:</strong> Launch window is perceived as relatively generous with free Polychrome, a pattern HoYoverse has followed for each new game launch. Early banners feature compelling characters that drive initial spending.</p>
<p><strong>2025:</strong> The game settles into HoYoverse''s standard cadence of updates and banners. Free currency distribution is comparable to Honkai: Star Rail''s current state — slightly more generous than Genshin''s early days.</p>',
  '<p>As HoYoverse''s third gacha title, Zenless Zone Zero has faced the "gacha fatigue" criticism — some players argue that supporting three concurrent gacha games from the same publisher is unsustainable. The identical monetization across all three titles means players choosing to play multiple HoYoverse games face compounded spending pressure.</p>
<p>The game''s stylish action combat and character designs have been praised, but critics note that the gacha model remains unchanged from Genshin (2020), suggesting HoYoverse sees no reason to innovate on monetization while the formula continues to be highly profitable.</p>
<p>Community sentiment is generally positive toward the game itself while resigned about the monetization — a pattern familiar to HoYoverse veterans.</p>',
  '<p><strong>Apply lessons from Genshin/Star Rail.</strong> The system is identical. Save for characters you truly want, understand the 50/50, and buy the monthly pass for best value.</p>
<p><strong>Inter-Knot Membership (Welkin equivalent) is the best value.</strong> ~$4.99/month for significant Polychrome over 30 days.</p>
<p><strong>Don''t spread spending across all three HoYoverse games.</strong> If you play multiple HoYoverse titles, pick one to focus spending on and play the others free-to-play.</p>
<p><strong>All content is clearable at S0 (no duplicates).</strong> Never feel pressured to pull for Mindscape Cinema levels (constellations).</p>',
  '<p>Zenless Zone Zero is the clearest evidence of HoYoverse''s monetization philosophy: find what works and replicate it. The gacha system is essentially copy-pasted from Genshin Impact and Honkai: Star Rail — same 0.6% rates, same pity at 90, same 50/50 mechanic, same approximately $2.50 per pull. The only things that change are the names.</p>
<p>This isn''t necessarily a criticism of the game itself, which is excellent. The action combat is fluid, the aesthetic is unique, and the character designs are compelling. But it does raise questions about an industry where the most successful monetization template is simply reproduced across titles rather than improved.</p>
<p>We score Zenless Zone Zero at 3.5 on our Lootboxes Scale — identical to Honkai: Star Rail, because the system IS identical. The transparency and pity system prevent a lower score, but the fundamental cost structure ($225-450 per character) remains steep.</p>
<p>For HoYoverse veterans: you already know what you''re getting into. For newcomers: ZZZ is a great free game with an expensive gacha layer. Enjoy the game, set your budget, and don''t let the character collection compulsion override your financial judgment.</p>'
FROM games g
WHERE g.slug = 'zenless-zone-zero'
ON CONFLICT (game_id) DO NOTHING;

