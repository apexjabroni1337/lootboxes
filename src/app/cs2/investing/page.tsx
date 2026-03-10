import type { Metadata } from "next";
import Link from "next/link";
import {
  LineChart,
  ChevronLeft,
  ArrowRight,
  TrendingUp,
  Shield,
  AlertTriangle,
  ExternalLink,
  Info,
  Clock,
  BarChart3,
  Search,
  Scale,
  Layers,
  Flame,
  Package,
  Star,
} from "lucide-react";
import AffiliateDisclosure from "@/components/cs2/AffiliateDisclosure";
import CS2NewsletterCTA from "@/components/cs2/CS2NewsletterCTA";

export const metadata: Metadata = {
  title: "CS2 Skin Market Data & Historical Trends — Lootboxes.com",
  description:
    "Publicly available CS2 skin market data, historical price trends, supply mechanics, and category breakdowns. Educational resource — not financial advice.",
};

/* ── Skin category data (publicly available market information) ── */

const SKIN_CATEGORIES = [
  {
    name: "Popular Play Skins",
    icon: Star,
    color: "emerald" as const,
    volatility: "Low",
    liquidity: "Very High",
    supply: "Ongoing (actively unboxed)",
    examples: [
      "AK-47 | Redline (Field-Tested)",
      "AWP | Asiimov (Field-Tested)",
      "M4A4 | Desolate Space (Factory New)",
      "USP-S | Kill Confirmed (Minimal Wear)",
      "Glock-18 | Fade (Factory New)",
    ],
    notes:
      "These skins have consistent trade volume because they are widely used by players. Supply is replenished through active case openings, which may limit long-term price movement. Demand tends to follow the game's active player count.",
  },
  {
    name: "Discontinued Case Skins",
    icon: Package,
    color: "amber" as const,
    volatility: "Medium",
    liquidity: "Medium",
    supply: "Fixed (cases no longer drop)",
    examples: [
      "Skins from Bravo Case",
      "Skins from Weapon Case 1, 2, 3",
      "Skins from Operation Hydra Case",
      "Skins from CS:GO Weapon Case",
      "Skins from Shattered Web Case",
    ],
    notes:
      "When a case is removed from the active drop pool, the supply of its skins becomes fixed. No new copies enter circulation through drops, though existing owners can still sell. This supply constraint is publicly documented in CS2 patch notes.",
  },
  {
    name: "Stickers & Capsules",
    icon: Layers,
    color: "blue" as const,
    volatility: "High",
    liquidity: "Variable",
    supply: "Fixed (time-limited sales)",
    examples: [
      "Major tournament stickers (sold during event only)",
      "Katowice 2014 stickers (earliest tournament stickers)",
      "Team-specific holos and foils",
      "Operation pass stickers and patches",
      "Autograph capsules from pro players",
    ],
    notes:
      "Tournament stickers and capsules are only sold during their respective Major events, creating a fixed supply after the sale period ends. Some stickers from early Majors (2014-2015) have extremely limited remaining supply on the market. Stickers are consumed when applied to weapons, permanently reducing circulating supply.",
  },
  {
    name: "Rare Patterns & Collectibles",
    icon: Flame,
    color: "red" as const,
    volatility: "Very High",
    liquidity: "Low",
    supply: "Extremely limited",
    examples: [
      "Case Hardened 'Blue Gem' patterns (Pattern #661, #387, etc.)",
      "Souvenir AWP | Dragon Lore (from Cobblestone packages)",
      "StatTrak knives with rare floats (0.000x or 0.999x)",
      "Craft skins with applied Katowice 2014 holos",
      "Contraband items (M4A4 | Howl)",
    ],
    notes:
      "These items derive value from extreme scarcity and collector demand rather than gameplay utility. Prices are often set by individual negotiation rather than market listing. The buyer pool for high-value collectibles is very small, meaning these items can be difficult to liquidate quickly. Price history for individual patterns is often inconsistent or unreliable.",
  },
];

/* ── Color config for magazine bar style ── */

const COLOR_CONFIG = {
  emerald: {
    bar: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-800",
    iconBg: "bg-emerald-500/10",
  },
  amber: {
    bar: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-800",
    iconBg: "bg-amber-500/10",
  },
  blue: {
    bar: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-800",
    iconBg: "bg-blue-500/10",
  },
  red: {
    bar: "from-red-500 to-rose-500",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    badge: "bg-red-100 text-red-800",
    iconBg: "bg-red-500/10",
  },
};

/* ── Supply mechanics (publicly documented game mechanics) ── */

const SUPPLY_MECHANICS = [
  {
    title: "Case Drop System",
    desc: "CS2 randomly drops cases to players at the end of matches. Valve periodically rotates which cases are in the active drop pool. When a case is removed, its supply becomes fixed — existing cases can still be opened or traded, but no new ones enter circulation.",
  },
  {
    title: "Trade-Up Contracts",
    desc: "Players can sacrifice 10 skins of one rarity to receive 1 skin of the next rarity tier from the same collection. This permanently destroys the input skins, reducing supply. Popular trade-up recipes can create sustained demand for specific lower-rarity skins.",
  },
  {
    title: "Sticker Application",
    desc: "When a sticker is applied to a weapon, it is consumed from the market. Scraping or removing stickers destroys them. This creates a one-way supply drain — applied stickers cannot be recovered and resold.",
  },
  {
    title: "VAC Bans & Lost Accounts",
    desc: "Skins on VAC-banned accounts become permanently trade-locked. Abandoned accounts with skins in their inventories effectively remove those items from the tradeable market over time.",
  },
  {
    title: "Float Value Degradation",
    desc: "Each skin has a permanent float value (0.00–1.00) that determines its wear. Float values are set at unboxing and cannot change. The rarest floats (perfect 0.000x or max 0.999x) are extremely uncommon and cannot be replicated.",
  },
  {
    title: "Operation & Event Skins",
    desc: "Operation passes give access to exclusive skin collections during a limited time window. Once the operation ends, no new skins from those collections can be obtained, though existing ones continue to circulate.",
  },
];

/* ── Key market factors ── */

const MARKET_FACTORS = [
  {
    title: "Player Count Trends",
    icon: BarChart3,
    accentTop: "border-t-blue-400",
    desc: "CS2's monthly active player count directly influences skin demand. Steam Charts and SteamDB publish daily concurrent player data. Higher player counts generally correlate with increased skin transaction volume.",
  },
  {
    title: "Major Tournament Schedule",
    icon: Clock,
    accentTop: "border-t-teal-400",
    desc: "Valve Majors occur 1-2 times per year. They generate new sticker capsules, souvenir packages, and viewer engagement. Historical pattern: sticker prices tend to be lowest during the sale window and may shift after the event concludes.",
  },
  {
    title: "Valve Updates & Patches",
    icon: Info,
    accentTop: "border-t-purple-400",
    desc: "Valve can introduce new cases, discontinue old ones, or change game mechanics at any time. The addition of CS2 brought visual changes that affected some skin appearances. Patch notes are publicly available on the CS2 blog.",
  },
  {
    title: "Steam Market Fees",
    icon: Scale,
    accentTop: "border-t-amber-400",
    desc: "The Steam Community Market charges a 15% combined fee (5% Steam + 10% CS2 game fee) on every sale. Third-party marketplaces charge 2-7% depending on platform. These transaction costs are an important factor in any buying/selling decision.",
  },
  {
    title: "Third-Party Market Volume",
    icon: TrendingUp,
    accentTop: "border-t-rose-400",
    desc: "Buff163 processes more CS2 skin transactions than any other platform. DMarket, Skinport, and other third-party sites offer different fee structures and cash-out options. Price differences between platforms are publicly visible.",
  },
  {
    title: "Seasonal Patterns",
    icon: Search,
    accentTop: "border-t-cyan-400",
    desc: "Publicly available price history data shows that transaction volume and prices have historically fluctuated during Steam Summer/Winter sales, new case releases, and Major tournaments. Past patterns do not guarantee future behavior.",
  },
];

/* ── Risks ── */

const RISKS = [
  {
    title: "Valve Can Change Rules at Any Time",
    desc: "Valve has full control over the CS2 economy. They can introduce new cases, add trade restrictions, change drop rates, or modify the Steam Market at any time without notice. The 2018 trade hold changes and 2023 CS2 transition both had significant market effects.",
  },
  {
    title: "Prices Can Go Down",
    desc: "Skin prices are not guaranteed to increase. Market crashes, new supply from case openings, declining player counts, or shifts in player taste can cause prices to drop significantly. Many skins have lost value over time.",
  },
  {
    title: "Scam & Fraud Risk",
    desc: "The CS2 skin trading ecosystem has a significant scam problem. Phishing sites, fake trade bots, impersonation, and fraudulent marketplaces are common. Always verify you are on legitimate platforms and never share your Steam credentials.",
  },
  {
    title: "Liquidity Is Not Guaranteed",
    desc: "High-value or niche items can take days, weeks, or months to sell. Unlike stocks or crypto, there is no instant market order system. You may need to discount significantly to sell quickly.",
  },
  {
    title: "Tax Implications",
    desc: "In many jurisdictions, profits from digital asset sales may be subject to capital gains tax or income tax. Tax treatment of virtual items varies by country. Consult a tax professional about your specific obligations.",
  },
  {
    title: "Platform Risk",
    desc: "Third-party marketplaces can shut down, get hacked, or freeze withdrawals. The OPSkins shutdown in 2018 demonstrated this risk. Only use established platforms and avoid keeping large balances on any single site.",
  },
];

export default function CS2InvestingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* ── DISCLAIMER BANNER ── */}
      <div className="bg-red-50 dark:bg-red-950/30 border-b border-red-200">
        <div className="container-main py-3 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-800">
              Important Disclaimer — Please Read
            </p>
            <p className="text-xs text-red-700 leading-relaxed mt-1">
              This page is for <strong>educational and informational purposes only</strong>. Nothing
              on this page constitutes financial advice, investment advice, or a recommendation to
              buy or sell any digital item. We are not financial advisors, licensed brokers, or
              investment professionals. All information presented reflects publicly available market
              data and documented game mechanics. <strong>CS2 skin trading involves real money and
              carries significant risk of financial loss.</strong> Past price trends do not indicate
              or guarantee future results. If you are considering any financial decision, please
              consult with a qualified financial professional. We do not condone gambling in any
              form.
            </p>
          </div>
        </div>
      </div>

      {/* ── Hero with side accent bar ── */}
      <section className="border-b border-gray-100 dark:border-gray-800">
        <div className="container-main py-10">
          <Link
            href="/cs2"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:text-gray-300 transition-colors mb-6"
          >
            <ChevronLeft className="h-4 w-4" /> CS2 Skins Hub
          </Link>

          <div className="flex rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
            <div className="w-1.5 bg-gradient-to-b from-teal-500 via-blue-500 to-purple-500 flex-shrink-0" />
            <div className="p-8 flex-1">
              <span className="text-[11px] font-bold text-teal-600 uppercase tracking-widest">
                Market Intelligence
              </span>
              <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mt-2">
                CS2 Skin Market Data &amp; Trends
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl leading-relaxed">
                An educational overview of the CS2 skin economy using publicly available data.
                Explore skin categories, supply mechanics, and market factors documented across
                Steam, SteamDB, and third-party platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How the CS2 skin economy works ── */}
      <section className="py-10 border-b border-gray-100 dark:border-gray-800">
        <div className="container-main">
          <div className="flex rounded-2xl overflow-hidden border border-brand-200 dark:border-brand-700/30 shadow-sm">
            <div className="w-1.5 bg-gradient-to-b from-brand-400 to-blue-500 flex-shrink-0" />
            <div className="p-6 flex-1 bg-gradient-to-r from-brand-50 dark:from-brand-950/20 to-white dark:to-gray-950">
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3">
                How the CS2 Skin Economy Works
              </h2>
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed mb-3">
                Unlike cosmetics in most other games, CS2 skins are tradeable digital items that can
                be bought, sold, and exchanged between players on the Steam Community Market and
                third-party platforms. The Steam Community Market processes billions in transactions
                annually. Skins have different rarities, wear conditions (float values), and visual
                patterns — all of which are publicly inspectable and influence market pricing.
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                Skin prices are determined entirely by supply and demand on open marketplaces. Valve
                does not set or control individual skin prices. Some skins have fixed supply (from
                discontinued cases or past operations), while others continue to enter circulation
                through active case drops. This publicly observable supply dynamic is a key factor in
                how the market functions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Skin categories ── */}
      <section className="py-12">
        <div className="container-main">
          <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
            Skin Categories by Market Characteristics
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Based on publicly available marketplace data. Volatility and liquidity assessments
            reflect observed market behavior, not predictions.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {SKIN_CATEGORIES.map((cat) => {
              const colors = COLOR_CONFIG[cat.color];
              return (
                <div
                  key={cat.name}
                  className="flex rounded-xl overflow-hidden bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Left color bar */}
                  <div className={`w-1.5 bg-gradient-to-b ${colors.bar} flex-shrink-0`} />
                  <div className="p-6 flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className={`h-8 w-8 rounded-lg ${colors.iconBg} flex items-center justify-center`}>
                        <cat.icon className={`h-4 w-4 ${colors.text}`} />
                      </div>
                      <h3 className={`text-lg font-serif font-bold ${colors.text}`}>
                        {cat.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{cat.notes}</p>

                    {/* Market characteristic badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors.badge}`}>
                        {cat.volatility} volatility
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors.badge}`}>
                        {cat.liquidity} liquidity
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                        {cat.supply.split(" (")[0]}
                      </span>
                    </div>

                    {/* Examples */}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                        Notable Examples
                      </p>
                      <ul className="space-y-1.5">
                        {cat.examples.map((ex) => (
                          <li
                            key={ex}
                            className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2"
                          >
                            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${colors.text.replace("text-", "bg-")} flex-shrink-0`} />
                            {ex}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Supply mechanics ── */}
      <section className="py-12 border-t border-gray-100 dark:border-gray-800 bg-[#fafbfc]">
        <div className="container-main">
          <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
            Supply Mechanics
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            How skin supply works in CS2 — documented game mechanics that affect the number
            of tradeable items in circulation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SUPPLY_MECHANICS.map((item, i) => (
              <div
                key={item.title}
                className="flex rounded-xl overflow-hidden bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-1 bg-gradient-to-b from-blue-400 to-cyan-400 flex-shrink-0" />
                <div className="p-5 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-black text-blue-100">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Market factors ── */}
      <section className="py-12 border-t border-gray-100 dark:border-gray-800">
        <div className="container-main">
          <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
            Key Market Factors
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Publicly observable factors that influence CS2 skin market activity. These are
            informational observations, not predictive indicators.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MARKET_FACTORS.map((factor) => (
              <div
                key={factor.title}
                className={`rounded-xl border border-gray-100 dark:border-gray-800 bg-[#fafbfc] border-t-[3px] ${factor.accentTop} p-5 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700">
                    <factor.icon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  <h3 className="font-serif font-bold text-gray-900 dark:text-white">{factor.title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {factor.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marketplace comparison ── */}
      <section className="py-12 border-t border-gray-100 dark:border-gray-800 bg-[#fafbfc]">
        <div className="container-main">
          <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-2">
            Marketplace Fee Comparison
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Publicly listed fee structures across major CS2 skin trading platforms.
            Transaction costs vary and should be considered when buying or selling.
          </p>
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-5 py-3.5 text-left font-semibold text-gray-600 dark:text-gray-300">Platform</th>
                  <th className="px-5 py-3.5 text-left font-semibold text-gray-600 dark:text-gray-300">Seller Fee</th>
                  <th className="px-5 py-3.5 text-left font-semibold text-gray-600 dark:text-gray-300">Buyer Fee</th>
                  <th className="px-5 py-3.5 text-left font-semibold text-gray-600 dark:text-gray-300 hidden sm:table-cell">Cash Out</th>
                  <th className="px-5 py-3.5 text-left font-semibold text-gray-600 dark:text-gray-300 hidden sm:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  { name: "Steam Market", seller: "15% (combined)", buyer: "0%", cash: "Steam Wallet only", notes: "Cannot withdraw to real money" },
                  { name: "Buff163", seller: "2.5%", buyer: "0%", cash: "Alipay / bank transfer (China)", notes: "Highest volume globally" },
                  { name: "DMarket", seller: "3%", buyer: "0%", cash: "Crypto, PayPal, bank", notes: "Instant trade system" },
                  { name: "Skinport", seller: "5%", buyer: "0%", cash: "Bank transfer, PayPal", notes: "EU-based, SEPA transfers" },
                  { name: "Tradeit.gg", seller: "0% (trade)", buyer: "Spread varies", cash: "Crypto, gift cards", notes: "Instant skin-to-skin trading" },
                  { name: "Mannco.store", seller: "0% (trade)", buyer: "Spread varies", cash: "Crypto, PayPal", notes: "TF2 + CS2 items" },
                ].map((row, i) => (
                  <tr key={row.name} className={i % 2 === 1 ? "bg-gray-50 dark:bg-gray-900/50" : ""}>
                    <td className="px-5 py-3 font-semibold text-gray-900 dark:text-white">{row.name}</td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-200">{row.seller}</td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-200">{row.buyer}</td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 hidden sm:table-cell">{row.cash}</td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 hidden sm:table-cell">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Fee information sourced from each platform&apos;s public documentation as of March 2026.
            Fees are subject to change. Always verify current rates directly on each platform.
          </p>
        </div>
      </section>

      {/* ── Risks section ── */}
      <section className="py-12 border-t border-gray-100 dark:border-gray-800">
        <div className="container-main">
          <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
            Risks &amp; Important Considerations
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Anyone participating in the CS2 skin market should understand these risks.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {RISKS.map((risk) => (
              <div
                key={risk.title}
                className="flex rounded-xl overflow-hidden border border-red-100 hover:shadow-sm transition-shadow"
              >
                <div className="w-1 bg-red-400 flex-shrink-0" />
                <div className="p-5 flex-1 bg-red-50 dark:bg-red-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                    <h3 className="font-serif font-bold text-gray-900 dark:text-white">{risk.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {risk.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Data sources ── */}
      <section className="py-10 border-t border-gray-100 dark:border-gray-800 bg-[#fafbfc]">
        <div className="container-main">
          <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-white mb-4">
            Where This Data Comes From
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            All information on this page is compiled from publicly available sources. We aggregate
            and present this data for educational purposes — we do not generate proprietary
            predictions or recommendations.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              "Steam Community Market",
              "SteamDB",
              "CS2 Patch Notes (Valve)",
              "Buff163 Public Listings",
              "DMarket Public API",
              "Skinport Public Listings",
              "CS2 Wiki / Liquipedia",
            ].map((source) => (
              <span
                key={source}
                className="rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 shadow-sm"
              >
                {source}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools CTA ── */}
      <section className="py-12 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="container-main text-center">
          <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3">
            Explore CS2 Market Data
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Use our free tools to browse publicly available price data across multiple marketplaces.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/cs2/prices"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700 transition-colors shadow-sm"
            >
              Browse Prices <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/cs2/compare"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-6 py-3 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Compare Marketplaces
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bottom disclaimer ── */}
      <section className="border-t border-gray-200 dark:border-gray-700 bg-[#fafbfc] py-8">
        <div className="container-main">
          <div className="flex rounded-xl overflow-hidden border border-amber-200 shadow-sm">
            <div className="w-1.5 bg-gradient-to-b from-amber-400 to-orange-400 flex-shrink-0" />
            <div className="p-5 flex-1 bg-amber-50 dark:bg-amber-950/30">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-serif font-bold text-amber-900 mb-2">
                    Full Disclosure &amp; Legal Notice
                  </p>
                  <ul className="space-y-1.5 text-xs text-amber-800 leading-relaxed">
                    <li>
                      <strong>Not financial advice.</strong> Nothing on this page is intended as
                      financial advice, investment advice, or a recommendation to buy, sell, or hold
                      any digital item. We are not financial advisors, licensed brokers, or investment
                      professionals.
                    </li>
                    <li>
                      <strong>Consult a professional.</strong> If you are considering financial
                      decisions involving digital assets, please consult with a qualified financial
                      advisor who can assess your individual circumstances.
                    </li>
                    <li>
                      <strong>No gambling endorsement.</strong> Lootboxes.com does not condone,
                      promote, or facilitate gambling in any form. Case opening is a form of
                      randomized purchasing with negative expected value and should not be treated as
                      an investment strategy.
                    </li>
                    <li>
                      <strong>Risk of loss.</strong> Digital item trading involves significant risk.
                      Prices can decrease, platforms can change terms, and Valve can modify the CS2
                      economy at any time. You may lose some or all of your money.
                    </li>
                    <li>
                      <strong>Affiliate links.</strong> Some marketplace links on this site are
                      affiliate links. This means we may earn a commission if you make a purchase.
                      This does not influence our data reporting or the information presented.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-10 border-t border-gray-100 dark:border-gray-800">
        <div className="container-main">
          <CS2NewsletterCTA />
        </div>
      </section>

      {/* Affiliate disclosure */}
      <AffiliateDisclosure />
    </div>
  );
}
