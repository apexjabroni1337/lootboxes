export interface Regulation {
  country: string;
  flag: string;
  iso: string;
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
    flag: "\u{1F1E7}\u{1F1EA}",
    iso: "BE",
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
    flag: "\u{1F1F3}\u{1F1F1}",
    iso: "NL",
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
    flag: "\u{1F1E8}\u{1F1F3}",
    iso: "CN",
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
    flag: "\u{1F1EF}\u{1F1F5}",
    iso: "JP",
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
    flag: "\u{1F1F0}\u{1F1F7}",
    iso: "KR",
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
    flag: "\u{1F1E6}\u{1F1FA}",
    iso: "AU",
    region: "Asia-Pacific",
    status: "restricted",
    summary:
      "Australia classified loot boxes as 'psychologically akin to gambling' in 2018. Since September 2025, games with paid loot boxes receive a minimum M (15+) rating. States can individually restrict sale to minors.",
    requirements: [
      "Games with paid loot boxes receive minimum M (15+) age rating since September 2025",
      "Advisory labeling required for games with randomized purchase mechanics",
      "No federal ban but strict scrutiny under consumer law",
      "States can individually restrict sale to minors",
    ],
    keyEvents: [
      { date: "2018-09-17", description: "Senate inquiry declares loot boxes are 'psychologically akin to gambling'" },
      { date: "2023-08-01", description: "Updated National Classification Code requires loot box labeling" },
      { date: "2025-02-01", description: "Social media age verification law sparks renewed loot box debate" },
      { date: "2025-09-01", description: "Games with paid loot boxes now receive minimum M (15+) rating" },
    ],
    lastUpdated: "2026-03-01",
  },

  /* ── PENDING ── */
  {
    country: "United Kingdom",
    flag: "\u{1F1EC}\u{1F1E7}",
    iso: "GB",
    region: "Europe",
    status: "restricted",
    summary:
      "The UK Gambling Commission says loot boxes are not gambling under current law, but the ASA issued an enforcement notice in February 2026 requiring all mobile games with loot boxes to disclose them in app store listings. Enforcement begins May 2026.",
    requirements: [
      "ASA enforcement notice: app store listings must disclose loot box presence",
      "Disclosure must be prominent (e.g., 'contains loot boxes' or 'includes random-item purchases')",
      "Industry codes of conduct being developed alongside legislative options",
      "PEGI labeling for in-game purchases recommended",
      "Publishers given until May 26, 2026 to comply before active enforcement",
    ],
    keyEvents: [
      { date: "2019-07-24", description: "House of Lords calls for loot boxes to be regulated as gambling" },
      { date: "2020-09-22", description: "Gambling Commission says loot boxes are not gambling under current law" },
      { date: "2022-07-18", description: "Government white paper proposes non-legislative approach" },
      { date: "2025-11-01", description: "Industry code of conduct published, review pending" },
      { date: "2026-02-26", description: "ASA issues enforcement notice requiring loot box disclosure in app stores" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "United States (Federal)",
    flag: "\u{1F1FA}\u{1F1F8}",
    iso: "US",
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
    flag: "\u{1F1E9}\u{1F1EA}",
    iso: "DE",
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
    flag: "\u{1F1EB}\u{1F1F7}",
    iso: "FR",
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
    flag: "\u{1F1EA}\u{1F1F8}",
    iso: "ES",
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
    flag: "\u{1F1EE}\u{1F1F9}",
    iso: "IT",
    region: "Europe",
    status: "pending",
    summary:
      "Italy has no specific loot box regulation but launched twin investigations into Activision Blizzard over Diablo Immortal and Call of Duty Mobile monetization in 2026. Consumer protection authorities are actively scrutinizing practices.",
    requirements: [
      "No specific loot box legislation or classification",
      "Standard consumer protection laws apply",
      "AGCM (competition authority) actively investigating predatory monetization",
    ],
    keyEvents: [
      { date: "2018-10-01", description: "Consumer groups petition regulator to investigate loot boxes — no action taken" },
      { date: "2026-01-15", description: "AGCM launches twin investigations into Activision Blizzard over Diablo Immortal and CoD Mobile" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "Brazil",
    flag: "\u{1F1E7}\u{1F1F7}",
    iso: "BR",
    region: "Americas",
    status: "restricted",
    summary:
      "Brazil signed landmark child safety law Lei 15.211/2025 (ECA Digital) banning loot box sales to minors under 18, effective March 2026. Fines up to 10% of Brazilian revenue (capped at R$50m) per violation.",
    requirements: [
      "Loot boxes prohibited in games aimed at or accessible by children and adolescents",
      "Age rating compliance required for all games with randomized purchases",
      "Fines up to 10% of Brazilian revenue per violation, capped at R$50 million (~$8.2M USD)",
      "Enforced by Brazil's data protection authority (ANPD)",
    ],
    keyEvents: [
      { date: "2022-06-14", description: "Gaming regulation bill PL 2796/2021 advances to Senate" },
      { date: "2025-09-17", description: "President Lula signs ECA Digital (Lei 15.211/2025) banning loot boxes for minors" },
      { date: "2026-03-01", description: "Law takes effect — largest Latin American market to restrict loot box sales" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "India",
    flag: "\u{1F1EE}\u{1F1F3}",
    iso: "IN",
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
    flag: "\u{1F1E8}\u{1F1E6}",
    iso: "CA",
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

  /* ── NEW COUNTRIES ── */

  {
    country: "Austria",
    flag: "\u{1F1E6}\u{1F1F9}",
    iso: "AT",
    region: "Europe",
    status: "legal",
    summary:
      "Austria's Supreme Court ruled in December 2025 that FIFA loot boxes do not constitute gambling under Austrian law, overturning earlier lower court rulings that had classified them as unlawful gambling.",
    requirements: [
      "Supreme Court ruled loot boxes are not gambling when items have no real-world economic value",
      "Earlier lower court rulings (2023) that classified FIFA packs as gambling were overturned",
      "Standard consumer protection laws apply",
    ],
    keyEvents: [
      { date: "2023-02-01", description: "District Court of Hermagor rules FIFA loot boxes are gambling — orders Sony refund" },
      { date: "2023-09-01", description: "Vienna Regional Court classifies FIFA packs as unlawful gambling" },
      { date: "2024-09-30", description: "Higher Regional Court of Vienna overturns gambling classification on appeal" },
      { date: "2025-12-01", description: "Austrian Supreme Court definitively rules loot boxes are not gambling" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "Norway",
    flag: "\u{1F1F3}\u{1F1F4}",
    iso: "NO",
    region: "Europe",
    status: "pending",
    summary:
      "Norway's Consumer Council (Forbrukerr\u00e5det) led a major international campaign against loot boxes with its 2022 'Insert Coin' report. No specific legislation yet, but the government is actively studying regulation. Norway co-led 18 European countries calling for stricter rules.",
    requirements: [
      "No specific loot box legislation currently",
      "Consumer Council actively campaigning for regulation",
      "Existing gambling law may apply to loot boxes with real-world tradeable value",
      "Co-led 18-country European push for stricter loot box rules",
    ],
    keyEvents: [
      { date: "2022-05-31", description: "Consumer Council publishes 'Insert Coin' report — backed by 18 European countries" },
      { date: "2022-06-01", description: "20 consumer organizations from 18 countries call for loot box regulation" },
      { date: "2025-10-01", description: "Government includes loot boxes in broader digital consumer protection review" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "Sweden",
    flag: "\u{1F1F8}\u{1F1EA}",
    iso: "SE",
    region: "Europe",
    status: "pending",
    summary:
      "Sweden has no explicit loot box regulation. The Swedish Gambling Authority considers loot boxes as gambling only if items have real-world economic value and can be traded outside the game. A 2022 review found no additional legislation necessary.",
    requirements: [
      "Loot boxes with tradeable real-world value may fall under gambling law",
      "Cosmetic-only loot boxes without trade value are not regulated",
      "Swedish Gambling Authority monitors on case-by-case basis",
    ],
    keyEvents: [
      { date: "2019-03-01", description: "Swedish Gambling Authority begins assessing loot box mechanics" },
      { date: "2022-06-01", description: "Government review finds no additional legislation necessary at this time" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "Denmark",
    flag: "\u{1F1E9}\u{1F1F0}",
    iso: "DK",
    region: "Europe",
    status: "legal",
    summary:
      "Denmark's gambling authority has determined that loot boxes without real-world monetary value do not qualify as 'prizes' under Danish gambling law. Cosmetic loot boxes remain legal and unregulated.",
    requirements: [
      "Loot boxes without real-world value are not captured by gambling law",
      "Items must not be convertible to real money to remain exempt",
      "Standard consumer protection laws apply",
    ],
    keyEvents: [
      { date: "2018-11-01", description: "Danish Gambling Authority publishes guidance — loot boxes without real value are not gambling" },
      { date: "2022-06-01", description: "Denmark joins 18-country European call for stricter loot box oversight" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "Finland",
    flag: "\u{1F1EB}\u{1F1EE}",
    iso: "FI",
    region: "Europe",
    status: "pending",
    summary:
      "Finland has no specific loot box regulation. The Police Board's Lottery Administration states that loot boxes offering non-monetary prizes are not gambling. However, Finland is one of three European countries (alongside Austria and the Netherlands) where gambling law has been applied to loot boxes in specific cases.",
    requirements: [
      "Loot boxes offering non-monetary prizes are not considered gambling",
      "Gambling law may apply in cases where items have real monetary value",
      "Case-by-case enforcement approach",
    ],
    keyEvents: [
      { date: "2019-01-01", description: "Police Board publishes guidance on loot boxes and gambling classification" },
      { date: "2022-06-01", description: "Finland joins European consumer coalition calling for loot box regulation" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "Poland",
    flag: "\u{1F1F5}\u{1F1F1}",
    iso: "PL",
    region: "Europe",
    status: "legal",
    summary:
      "Poland's Ministry of Finance ruled in 2019 that loot boxes in video games are not 'games of chance' under applicable gambling law. No specific regulation exists.",
    requirements: [
      "Ministry of Finance determined loot boxes are not games of chance",
      "No specific loot box legislation",
      "Standard consumer protection laws apply",
    ],
    keyEvents: [
      { date: "2019-04-01", description: "Ministry of Finance publishes statement — loot boxes are not games of chance" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "Switzerland",
    flag: "\u{1F1E8}\u{1F1ED}",
    iso: "CH",
    region: "Europe",
    status: "pending",
    summary:
      "Switzerland has no specific loot box regulation but consumer groups have actively supported European campaigns for stricter rules. The Swiss gambling act could theoretically apply to loot boxes with tradeable real-world value.",
    requirements: [
      "No specific loot box legislation",
      "Swiss Gambling Act may apply if items have tradeable real-world value",
      "Consumer groups actively support regulation efforts",
    ],
    keyEvents: [
      { date: "2019-01-01", description: "New Swiss Gambling Act takes effect — no specific loot box provisions" },
      { date: "2022-06-01", description: "Swiss consumer groups join 18-country European campaign against loot boxes" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "European Union",
    flag: "\u{1F1EA}\u{1F1FA}",
    iso: "EU",
    region: "Europe",
    status: "pending",
    summary:
      "The European Parliament adopted a resolution in January 2023 calling for harmonized EU rules on loot boxes, including potential bans on paid loot boxes or mandatory opt-out. The EU cannot regulate gambling directly but can act through consumer protection law. No binding legislation yet.",
    requirements: [
      "2023 resolution calls for harmonized rules across member states",
      "European Commission assessing loot boxes under Digital Fairness Fitness Check",
      "Potential legislative proposal for EU-wide consumer protection framework",
      "Individual member states retain gambling regulation authority",
    ],
    keyEvents: [
      { date: "2023-01-18", description: "European Parliament adopts resolution calling for harmonized loot box rules" },
      { date: "2024-06-01", description: "European Commission includes loot boxes in Digital Fairness Fitness Check" },
      { date: "2025-09-01", description: "Fitness Check results expected to inform potential legislative action" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "New Zealand",
    flag: "\u{1F1F3}\u{1F1FF}",
    iso: "NZ",
    region: "Asia-Pacific",
    status: "pending",
    summary:
      "New Zealand's Department of Internal Affairs studied loot boxes and concluded they generally do not meet the legal definition of gambling. However, the Classification Office can restrict games with harmful content, and loot boxes remain under review.",
    requirements: [
      "Loot boxes generally not classified as gambling under current law",
      "Classification Office can restrict games with harmful mechanics",
      "Government review of gambling legislation includes loot box considerations",
    ],
    keyEvents: [
      { date: "2019-07-01", description: "Department of Internal Affairs studies loot boxes — concludes most are not gambling" },
      { date: "2023-03-01", description: "Government includes loot boxes in broader gambling legislation review" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "Singapore",
    flag: "\u{1F1F8}\u{1F1EC}",
    iso: "SG",
    region: "Asia-Pacific",
    status: "legal",
    summary:
      "Singapore updated its gambling laws in 2024 but did not specifically address loot boxes. Virtual items without real-world cash-out mechanisms are generally not considered gambling. The Gambling Regulatory Authority monitors developments.",
    requirements: [
      "No specific loot box regulation",
      "Updated Gambling Control Act (2024) does not address in-game purchases",
      "Virtual items without cash-out mechanisms are not classified as gambling",
    ],
    keyEvents: [
      { date: "2024-08-01", description: "Updated Gambling Control Act takes effect — no specific loot box provisions" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "Malaysia",
    flag: "\u{1F1F2}\u{1F1FE}",
    iso: "MY",
    region: "Asia-Pacific",
    status: "pending",
    summary:
      "Malaysia has no specific loot box legislation, but Islamic authorities have weighed in. In 2021, the Office of the Mufti for Federal Territories declared that PUBG loot boxes qualify as 'maisir' (gambling forbidden under Islamic law). No federal regulation has followed.",
    requirements: [
      "No specific loot box legislation at federal level",
      "Islamic authorities have classified some loot boxes as 'maisir' (forbidden gambling)",
      "Secular gambling laws have not been applied to loot boxes",
    ],
    keyEvents: [
      { date: "2021-10-01", description: "Office of the Mufti declares PUBG loot boxes qualify as maisir under Islamic law" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "Mexico",
    flag: "\u{1F1F2}\u{1F1FD}",
    iso: "MX",
    region: "Americas",
    status: "legal",
    summary:
      "Mexico has no specific loot box regulation. The Federal Gaming and Sweepstakes Law does not address virtual items in video games. Consumer protection authorities have not taken action on loot box mechanics.",
    requirements: [
      "No specific loot box legislation",
      "Federal Gaming and Sweepstakes Law does not cover virtual items",
      "Standard consumer protection laws apply",
    ],
    keyEvents: [
      { date: "2020-01-01", description: "No regulatory action taken despite growing loot box market in Mexico" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "Argentina",
    flag: "\u{1F1E6}\u{1F1F7}",
    iso: "AR",
    region: "Americas",
    status: "legal",
    summary:
      "Argentina has no federal loot box regulation. Provincial gambling authorities have not classified loot boxes as gambling. Consumer protection law provides general safeguards against deceptive commercial practices.",
    requirements: [
      "No federal or provincial loot box-specific laws",
      "General consumer protection law applies",
      "Provincial gambling authorities have not taken action",
    ],
    keyEvents: [
      { date: "2021-01-01", description: "No specific regulatory attention to loot box mechanics" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "Vietnam",
    flag: "\u{1F1FB}\u{1F1F3}",
    iso: "VN",
    region: "Asia-Pacific",
    status: "restricted",
    summary:
      "Vietnam imposes strict gaming regulations including time limits for minors, similar to China's approach. While loot boxes are not specifically banned, all games require government approval and monetization mechanics are reviewed during the licensing process.",
    requirements: [
      "All games require government license approval",
      "Monetization mechanics reviewed during licensing",
      "Playtime restrictions for minors",
      "Games must comply with content regulations",
    ],
    keyEvents: [
      { date: "2021-06-01", description: "Updated gaming regulations include stricter oversight of monetization mechanics" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "Thailand",
    flag: "\u{1F1F9}\u{1F1ED}",
    iso: "TH",
    region: "Asia-Pacific",
    status: "legal",
    summary:
      "Thailand has no specific loot box regulation. Legal analysis suggests loot boxes may technically fall under Thailand's Gambling Act if items can be cashed out, but no enforcement action has been taken. The market remains self-regulated.",
    requirements: [
      "No specific loot box legislation",
      "Gambling Act may theoretically apply to cash-out loot boxes",
      "No enforcement action taken to date",
    ],
    keyEvents: [
      { date: "2020-01-01", description: "Legal scholars note potential Gambling Act applicability but no government action" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "Indonesia",
    flag: "\u{1F1EE}\u{1F1E9}",
    iso: "ID",
    region: "Asia-Pacific",
    status: "legal",
    summary:
      "Indonesia has no specific loot box regulation. The Ministry of Communication and Information Technology (Kominfo) focuses on content regulation rather than monetization mechanics. Islamic gambling prohibitions exist but have not been applied to loot boxes.",
    requirements: [
      "No specific loot box legislation",
      "Content regulation by Kominfo does not address monetization",
      "General consumer protection laws apply",
    ],
    keyEvents: [
      { date: "2022-01-01", description: "Kominfo focuses on content moderation — loot boxes not addressed" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "Saudi Arabia",
    flag: "\u{1F1F8}\u{1F1E6}",
    iso: "SA",
    region: "Other",
    status: "legal",
    summary:
      "Saudi Arabia has no specific loot box regulation despite being one of the largest gaming markets in the Middle East. The General Entertainment Authority oversees gaming but has not addressed randomized purchase mechanics. Islamic gambling prohibitions exist but are not applied to virtual items.",
    requirements: [
      "No specific loot box regulation",
      "General Entertainment Authority oversees gaming content",
      "Islamic gambling prohibitions not applied to virtual loot boxes",
    ],
    keyEvents: [
      { date: "2023-09-01", description: "Saudi Esports Federation launches but does not address monetization regulation" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "South Africa",
    flag: "\u{1F1FF}\u{1F1E6}",
    iso: "ZA",
    region: "Other",
    status: "legal",
    summary:
      "South Africa has no specific loot box regulation. The National Gambling Board has not classified loot boxes as gambling. The Film and Publication Board rates games but does not address monetization mechanics.",
    requirements: [
      "No specific loot box legislation",
      "National Gambling Board has not classified loot boxes",
      "Film and Publication Board rates games for content only",
    ],
    keyEvents: [
      { date: "2021-01-01", description: "No regulatory action taken on loot box mechanics" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "Philippines",
    flag: "\u{1F1F5}\u{1F1ED}",
    iso: "PH",
    region: "Asia-Pacific",
    status: "legal",
    summary:
      "The Philippines has no specific loot box regulation. PAGCOR (Philippine Amusement and Gaming Corporation) regulates gambling but has not addressed in-game randomized purchases. The country is a major mobile gaming market with extensive gacha game adoption.",
    requirements: [
      "No specific loot box legislation",
      "PAGCOR gambling regulation does not cover virtual items",
      "Consumer protection law provides general safeguards",
    ],
    keyEvents: [
      { date: "2022-01-01", description: "Growing mobile gaming market but no regulatory attention to loot boxes" },
    ],
    lastUpdated: "2026-03-01",
  },
  {
    country: "Taiwan",
    flag: "\u{1F1F9}\u{1F1FC}",
    iso: "TW",
    region: "Asia-Pacific",
    status: "restricted",
    summary:
      "Taiwan requires game publishers to disclose gacha drop rates and has consumer protection rules for digital purchases. The Game Software Rating Regulations mandate transparency for randomized mechanics in rated games.",
    requirements: [
      "Drop rate disclosure required for gacha and loot box mechanics",
      "Consumer protection rules apply to digital purchases",
      "Game Software Rating Regulations mandate transparency",
    ],
    keyEvents: [
      { date: "2017-04-01", description: "Game rating regulations updated to require drop rate disclosure" },
      { date: "2023-06-01", description: "Strengthened consumer protection rules for digital game purchases" },
    ],
    lastUpdated: "2026-03-01",
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

export const REGION_LIST = ["All", "Europe", "Asia-Pacific", "Americas", "Other"] as const;
