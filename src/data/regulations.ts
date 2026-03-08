export interface Regulation {
  country: string;
  region: "Europe" | "Asia-Pacific" | "Americas" | "Other";
  status: "banned" | "restricted" | "pending" | "legal";
  summary: string;
  requirements: string[];
  keyEvents: { date: string; description: string }[];
  lastUpdated: string;
}

export const REGULATIONS: Regulation[] = [
  /* ── BANNED ── */
  {
    country: "Belgium",
    region: "Europe",
    status: "banned",
    summary:
      "Belgium declared paid loot boxes a form of gambling in 2018. Publishers must remove them or face criminal prosecution and fines up to €800,000.",
    requirements: [
      "Paid loot boxes classified as gambling under the Gaming and Betting Act",
      "Criminal penalties for publishers who include them",
      "Applies to all games sold in Belgium regardless of platform",
    ],
    keyEvents: [
      { date: "2018-04-25", description: "Belgian Gaming Commission declares loot boxes are gambling" },
      { date: "2018-09-10", description: "EA, Valve, and Blizzard ordered to remove loot boxes or face prosecution" },
      { date: "2019-01-29", description: "EA removes FIFA Points from sale in Belgium" },
    ],
    lastUpdated: "2025-12-01",
  },
  {
    country: "Netherlands",
    region: "Europe",
    status: "banned",
    summary:
      "The Netherlands Gaming Authority (KSA) ruled in 2018 that loot boxes with tradeable items violate the Betting and Gaming Act. Publishers face fines up to €5 million.",
    requirements: [
      "Loot boxes with tradeable/transferable items classified as gambling",
      "Non-tradeable loot boxes remain legal",
      "Publishers must obtain a gambling license or remove the mechanic",
    ],
    keyEvents: [
      { date: "2018-04-19", description: "KSA finds 4 of 10 investigated games violate gambling law" },
      { date: "2019-06-20", description: "EA fined €10 million for FIFA Ultimate Team packs" },
      { date: "2022-03-09", description: "Dutch court overturns EA fine on appeal — ruling narrowed" },
    ],
    lastUpdated: "2025-12-01",
  },

  /* ── RESTRICTED ── */
  {
    country: "China",
    region: "Asia-Pacific",
    status: "restricted",
    summary:
      "China requires publishers to disclose exact drop rates for all virtual items. Minors face strict playtime and spending limits. Direct purchase alternatives are often mandated.",
    requirements: [
      "All drop rates must be publicly disclosed",
      "No more than 3 hours of gaming per week for minors (under 18)",
      "Spending caps for minors based on age bracket",
      "Real-name verification required for all players",
      "Direct-purchase alternative often required alongside gacha mechanics",
    ],
    keyEvents: [
      { date: "2017-05-01", description: "MOCA requires publishers to disclose drop rates" },
      { date: "2021-08-30", description: "Strictest-ever limits on minors: 3 hours per week" },
      { date: "2023-12-22", description: "Draft rules proposed banning gacha mechanics entirely (later walked back)" },
      { date: "2024-04-15", description: "Final rules maintain disclosure but allow gacha to continue" },
    ],
    lastUpdated: "2025-12-01",
  },
  {
    country: "Japan",
    region: "Asia-Pacific",
    status: "restricted",
    summary:
      "Japan bans 'kompu gacha' (complete gacha requiring collecting full sets) but allows standard gacha. The JOGA industry body enforces voluntary disclosure guidelines.",
    requirements: [
      "Kompu gacha (complete-set gacha) banned since 2012",
      "Standard gacha mechanics permitted",
      "JOGA voluntary guidelines recommend drop rate disclosure",
      "Not all publishers comply with voluntary standards",
    ],
    keyEvents: [
      { date: "2012-05-18", description: "Consumer Affairs Agency bans kompu gacha under existing consumer law" },
      { date: "2016-04-01", description: "JOGA issues voluntary guidelines on gacha disclosure" },
      { date: "2024-06-01", description: "Updated JOGA guidelines expand recommended disclosures" },
    ],
    lastUpdated: "2025-12-01",
  },
  {
    country: "South Korea",
    region: "Asia-Pacific",
    status: "restricted",
    summary:
      "South Korea mandates drop rate disclosure for all paid randomized items. The Game Industry Promotion Act requires transparent probability display. Violators face fines.",
    requirements: [
      "Drop rates must be displayed before purchase",
      "Applies to all games with paid randomized mechanics",
      "Probability information must be easily accessible in-game",
      "Fines for non-compliance under the Game Industry Promotion Act",
    ],
    keyEvents: [
      { date: "2015-03-01", description: "Game Rating and Administration Committee begins requiring rate disclosure" },
      { date: "2018-04-18", description: "Nexon agrees to disclose all MapleStory drop rates after community backlash" },
      { date: "2024-03-20", description: "Strengthened enforcement rules take effect" },
    ],
    lastUpdated: "2025-12-01",
  },
  {
    country: "Australia",
    region: "Asia-Pacific",
    status: "restricted",
    summary:
      "Australia's Senate classified loot boxes as 'psychologically akin to gambling' in 2018. The National Classification Code was updated in 2023 to require special labeling for games with paid randomized mechanics.",
    requirements: [
      "Games with loot boxes must carry advisory labeling",
      "ESRB/PEGI-style in-game purchase warnings required",
      "No federal ban but strict scrutiny under consumer law",
      "States can individually restrict sale to minors",
    ],
    keyEvents: [
      { date: "2018-09-17", description: "Senate inquiry declares loot boxes are 'psychologically akin to gambling'" },
      { date: "2023-08-01", description: "Updated National Classification Code requires loot box labeling" },
      { date: "2025-02-01", description: "Social media age verification law sparks renewed loot box debate" },
    ],
    lastUpdated: "2025-12-01",
  },

  /* ── PENDING ── */
  {
    country: "United Kingdom",
    region: "Europe",
    status: "pending",
    summary:
      "The UK Gambling Commission concluded loot boxes are not gambling under current law, but the government is pursuing a 'non-legislative approach' with industry codes of conduct and potential future regulation.",
    requirements: [
      "Currently no legal restrictions specific to loot boxes",
      "Industry codes of conduct being developed",
      "PEGI labeling for in-game purchases recommended",
      "Age verification for high-spending considered",
    ],
    keyEvents: [
      { date: "2019-07-24", description: "House of Lords calls for loot boxes to be regulated as gambling" },
      { date: "2020-09-22", description: "Gambling Commission says loot boxes are not gambling under current law" },
      { date: "2022-07-18", description: "Government white paper proposes non-legislative approach" },
      { date: "2025-11-01", description: "Industry code of conduct published, review pending" },
    ],
    lastUpdated: "2025-12-01",
  },
  {
    country: "United States (Federal)",
    region: "Americas",
    status: "pending",
    summary:
      "No federal legislation specifically targeting loot boxes. Multiple bills have been introduced (e.g., the Protecting Children from Abusive Games Act) but none passed. FTC has taken enforcement action against individual publishers.",
    requirements: [
      "No federal loot box-specific regulation",
      "FTC can act under existing consumer protection law",
      "Individual state laws may apply (e.g., Hawaii, Minnesota proposals)",
      "ESRB 'In-Game Purchases' label is voluntary",
    ],
    keyEvents: [
      { date: "2019-05-08", description: "Senator Josh Hawley introduces 'Protecting Children from Abusive Games Act'" },
      { date: "2020-08-01", description: "FTC hosts public workshop on loot boxes" },
      { date: "2024-11-15", description: "Hawley re-introduces updated loot box bill in new Congress" },
      { date: "2026-02-25", description: "NY Attorney General sues Valve over CS2, Dota 2, and TF2 loot boxes" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "Germany",
    region: "Europe",
    status: "pending",
    summary:
      "Germany updated its Youth Protection Act in 2021 to require interaction risk labeling. Loot boxes are flagged as a 'purchase pressure' risk factor but are not banned.",
    requirements: [
      "Games with loot boxes may receive higher age ratings",
      "'Interaction risk' labeling for purchase pressure mechanics",
      "No outright ban on loot boxes",
      "BPjM (Federal Review Board) can restrict marketing of games with predatory mechanics to minors",
    ],
    keyEvents: [
      { date: "2021-05-01", description: "Updated Youth Protection Act takes effect with interaction risk labels" },
      { date: "2023-09-15", description: "USK begins applying new labeling standards consistently" },
    ],
    lastUpdated: "2025-12-01",
  },
  {
    country: "France",
    region: "Europe",
    status: "pending",
    summary:
      "France has not classified loot boxes as gambling. ARJEL (gambling regulator) studied the issue and concluded current gambling law does not apply, but consumer protection authorities monitor practices.",
    requirements: [
      "No specific loot box legislation",
      "Consumer protection law applies to deceptive practices",
      "PEGI labeling recommendations followed",
    ],
    keyEvents: [
      { date: "2018-06-28", description: "ARJEL report concludes loot boxes are not gambling under French law" },
      { date: "2024-01-15", description: "Consumer protection agency investigates Genshin Impact monetization" },
    ],
    lastUpdated: "2025-12-01",
  },
  {
    country: "Spain",
    region: "Europe",
    status: "pending",
    summary:
      "Spain's Ministry of Consumer Affairs drafted a royal decree in 2021 to regulate loot boxes, including age verification and spending limits. The decree has stalled but remains under consideration.",
    requirements: [
      "Proposed: age verification for loot box purchases",
      "Proposed: spending limits for minors",
      "Proposed: mandatory drop rate disclosure",
      "Not yet enacted",
    ],
    keyEvents: [
      { date: "2021-07-12", description: "Ministry of Consumer Affairs announces plan to regulate loot boxes" },
      { date: "2022-02-28", description: "Draft royal decree published for public comment" },
      { date: "2025-06-01", description: "Decree remains stalled pending government coalition negotiations" },
    ],
    lastUpdated: "2025-12-01",
  },
  {
    country: "Italy",
    region: "Europe",
    status: "legal",
    summary:
      "Italy has no specific loot box regulation. The Italian gambling regulator has not classified loot boxes as gambling, though consumer advocacy groups have pushed for action.",
    requirements: [
      "No specific loot box legislation or classification",
      "Standard consumer protection laws apply",
    ],
    keyEvents: [
      { date: "2018-10-01", description: "Consumer groups petition regulator to investigate loot boxes — no action taken" },
    ],
    lastUpdated: "2025-12-01",
  },
  {
    country: "Brazil",
    region: "Americas",
    status: "pending",
    summary:
      "Brazil's gaming regulation bill (PL 2796/2021) includes provisions requiring drop rate disclosure and age-appropriate warnings for games with randomized purchase mechanics.",
    requirements: [
      "Proposed: drop rate disclosure for paid random items",
      "Proposed: age-appropriate warnings and parental controls",
      "Not yet enacted — bill progressing through Congress",
    ],
    keyEvents: [
      { date: "2022-06-14", description: "Gaming regulation bill PL 2796/2021 advances to Senate" },
      { date: "2025-03-01", description: "Senate committee recommends passage with loot box provisions included" },
    ],
    lastUpdated: "2025-12-01",
  },
  {
    country: "India",
    region: "Asia-Pacific",
    status: "legal",
    summary:
      "India has no federal regulation of loot boxes. Some states regulate 'real-money gaming' but cosmetic loot boxes are generally unregulated. The IT Ministry has studied the issue without taking action.",
    requirements: [
      "No federal loot box regulation",
      "State-level gambling laws may apply to cash-out mechanics",
      "Self-regulation by industry bodies",
    ],
    keyEvents: [
      { date: "2023-04-01", description: "MeitY issues advisory on online gaming — does not address loot boxes specifically" },
    ],
    lastUpdated: "2025-12-01",
  },
  {
    country: "Canada",
    region: "Americas",
    status: "pending",
    summary:
      "Canada has no federal loot box legislation. Several provincial gambling commissions have studied the issue. British Columbia and Ontario have considered action but not enacted specific rules.",
    requirements: [
      "No federal or provincial loot box-specific laws",
      "Provincial gambling commissions can investigate on a case-by-case basis",
      "ESRB labeling is voluntary",
    ],
    keyEvents: [
      { date: "2019-11-20", description: "BC gambling regulator reviews loot box classification — no action taken" },
      { date: "2024-09-01", description: "Ontario parliamentary committee recommends studying loot box regulation" },
    ],
    lastUpdated: "2025-12-01",
  },
];

/* ── Helpers ── */

export const STATUS_META: Record<
  Regulation["status"],
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  banned: { label: "Banned", color: "text-red-700", bgColor: "bg-red-50", borderColor: "border-red-200" },
  restricted: { label: "Restricted", color: "text-amber-700", bgColor: "bg-amber-50", borderColor: "border-amber-200" },
  pending: { label: "Pending Legislation", color: "text-blue-700", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
  legal: { label: "No Restrictions", color: "text-gray-600", bgColor: "bg-gray-50", borderColor: "border-gray-200" },
};

export const REGION_LIST = ["All", "Europe", "Asia-Pacific", "Americas"] as const;
