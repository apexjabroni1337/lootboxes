import Link from "next/link";
import { Search, ChevronRight, AlertTriangle, CheckCircle, HelpCircle, Zap, Sparkles } from "lucide-react";
import ScoreBadge from "@/components/analytics/ScoreBadge";
import GameAvatar from "@/components/ui/GameAvatar";

// TODO: Replace with Supabase queries
const MOCK_GAMES_WITH_RATES = [
  {
    title: "Counter-Strike 2",
    slug: "counter-strike-2",
    lootboxes_score: 3.8,
    items: [
      { name: "Covert Knife (Any)", rarity: "Covert", drop_rate: 0.26, source: "community_verified" as const },
      { name: "Covert Rifle Skin", rarity: "Covert", drop_rate: 0.64, source: "community_verified" as const },
      { name: "Classified Skin", rarity: "Classified", drop_rate: 3.2, source: "community_verified" as const },
      { name: "Restricted Skin", rarity: "Restricted", drop_rate: 15.98, source: "community_verified" as const },
      { name: "Mil-Spec Skin", rarity: "Mil-Spec", drop_rate: 79.92, source: "community_verified" as const },
    ],
  },
  {
    title: "Genshin Impact",
    slug: "genshin-impact",
    lootboxes_score: 3.2,
    items: [
      { name: "5-Star Character (Featured)", rarity: "5-Star", drop_rate: 0.6, source: "official" as const },
      { name: "5-Star Weapon (Featured)", rarity: "5-Star", drop_rate: 0.7, source: "official" as const },
      { name: "4-Star Character", rarity: "4-Star", drop_rate: 5.1, source: "official" as const },
      { name: "4-Star Weapon", rarity: "4-Star", drop_rate: 6.0, source: "official" as const },
      { name: "3-Star Weapon", rarity: "3-Star", drop_rate: 87.6, source: "official" as const },
    ],
  },
  {
    title: "FIFA 25 (Ultimate Team)",
    slug: "fifa-25",
    lootboxes_score: 2.1,
    items: [
      { name: "Icon/Hero Player", rarity: "Icon", drop_rate: 0.04, source: "user_reported" as const },
      { name: "90+ OVR Player", rarity: "Elite", drop_rate: 0.8, source: "user_reported" as const },
      { name: "85-89 OVR Player", rarity: "Rare", drop_rate: 8.5, source: "user_reported" as const },
      { name: "80-84 OVR Player", rarity: "Common", drop_rate: 35.0, source: "user_reported" as const },
      { name: "75-79 OVR Player", rarity: "Common", drop_rate: 55.66, source: "user_reported" as const },
    ],
  },
  {
    title: "Overwatch 2",
    slug: "overwatch-2",
    lootboxes_score: 4.0,
    items: [
      { name: "Mythic Skin", rarity: "Mythic", drop_rate: 0.5, source: "community_verified" as const },
      { name: "Legendary Skin", rarity: "Legendary", drop_rate: 3.5, source: "community_verified" as const },
      { name: "Epic Skin", rarity: "Epic", drop_rate: 12.0, source: "community_verified" as const },
      { name: "Rare Item", rarity: "Rare", drop_rate: 34.0, source: "community_verified" as const },
      { name: "Common Item", rarity: "Common", drop_rate: 50.0, source: "community_verified" as const },
    ],
  },
  {
    title: "Diablo IV",
    slug: "diablo-4",
    lootboxes_score: 5.2,
    items: [
      { name: "Unique Item", rarity: "Unique", drop_rate: 0.2, source: "community_verified" as const },
      { name: "Legendary Item", rarity: "Legendary", drop_rate: 4.5, source: "community_verified" as const },
      { name: "Rare Item", rarity: "Rare", drop_rate: 25.0, source: "community_verified" as const },
      { name: "Magic Item", rarity: "Magic", drop_rate: 45.0, source: "community_verified" as const },
      { name: "Common Item", rarity: "Common", drop_rate: 25.3, source: "community_verified" as const },
    ],
  },
];

const SOURCE_META = {
  official: { label: "Official", icon: CheckCircle, color: "text-success-600" },
  community_verified: { label: "Community Verified", icon: HelpCircle, color: "text-brand-600" },
  user_reported: { label: "User Reported", icon: AlertTriangle, color: "text-warning-600" },
};

function getRarityColor(rarity: string): string {
  const map: Record<string, string> = {
    "Covert": "bg-red-100 text-red-800",
    "Classified": "bg-purple-100 text-purple-800",
    "Restricted": "bg-violet-100 text-violet-800",
    "Mil-Spec": "bg-blue-100 text-blue-800",
    "5-Star": "bg-amber-100 text-amber-800",
    "4-Star": "bg-purple-100 text-purple-800",
    "3-Star": "bg-blue-100 text-blue-800",
    "Icon": "bg-amber-100 text-amber-800",
    "Elite": "bg-purple-100 text-purple-800",
    "Mythic": "bg-amber-100 text-amber-800",
    "Legendary": "bg-orange-100 text-orange-800",
    "Epic": "bg-purple-100 text-purple-800",
    "Rare": "bg-blue-100 text-blue-800",
    "Unique": "bg-amber-100 text-amber-800",
    "Magic": "bg-blue-100 text-blue-800",
    "Common": "bg-gray-100 text-gray-700",
  };
  return map[rarity] || "bg-gray-100 text-gray-700";
}

export const metadata = {
  title: "Drop Rate Database — Verified Loot Box Probabilities",
  description:
    "The most comprehensive database of verified drop rates and loot box probabilities across all major games. Know your odds before you spend.",
};

export default function DropRatesPage() {
  return (
    <div className="pb-12">
      {/* Page hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-8 sm:py-10">
        <div className="container-main">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-brand-600" />
            <h1 className="text-3xl font-bold text-gray-900">Drop Rate Database</h1>
          </div>
          <p className="mt-2 max-w-2xl text-gray-500">
            Verified drop rates and loot box probabilities for every major game.
            Know your odds before you spend. All rates sourced from official disclosures,
            community research, and user reports.
          </p>
        </div>
      </section>

      <div className="container-main mt-6">
        {/* Search + Filter */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search games or items..."
              className="input w-full pl-9 text-sm"
            />
          </div>
          <div className="flex gap-2">
            {["All Sources", "Official", "Community", "User Reported"].map((f, i) => (
              <button
                key={f}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  i === 0
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-brand-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Methodology callout */}
        <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50 p-4">
          <h3 className="text-sm font-semibold text-brand-800">How We Verify Drop Rates</h3>
          <p className="mt-1 text-sm text-brand-700">
            We rank data sources in three tiers: <strong>Official</strong> (disclosed by
            the developer), <strong>Community Verified</strong> (large-sample empirical
            testing by trusted researchers), and <strong>User Reported</strong> (aggregated
            from individual submissions — treat with caution). We always display the source
            alongside every rate.
          </p>
        </div>

        {/* Game sections */}
        <div className="mt-8 space-y-8">
          {MOCK_GAMES_WITH_RATES.map((game) => (
            <section key={game.slug} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              {/* Game header */}
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg">
                    <GameAvatar gameName={game.title} size="sm" aspectRatio="square" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{game.title}</h2>
                  {game.lootboxes_score && (
                    <ScoreBadge score={game.lootboxes_score} size="sm" />
                  )}
                </div>
                <Link
                  href={`/games/${game.slug}`}
                  className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  View deals <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Drop rate table */}
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase text-gray-500">Item</th>
                    <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase text-gray-500">Rarity</th>
                    <th className="px-5 py-2.5 text-right text-xs font-semibold uppercase text-gray-500">Drop Rate</th>
                    <th className="hidden px-5 py-2.5 text-right text-xs font-semibold uppercase text-gray-500 sm:table-cell">
                      ~Avg. Opens
                    </th>
                    <th className="hidden px-5 py-2.5 text-left text-xs font-semibold uppercase text-gray-500 md:table-cell">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {game.items.map((item, i) => {
                    const SourceMeta = SOURCE_META[item.source];
                    const avgOpens =
                      item.drop_rate > 0
                        ? Math.ceil(100 / item.drop_rate)
                        : "—";
                    return (
                      <tr key={i} className="transition-colors hover:bg-gray-50">
                        <td className="px-5 py-3 text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getRarityColor(item.rarity)}`}>
                            {item.rarity}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className="text-sm font-bold text-gray-900">
                            {item.drop_rate < 1
                              ? `${item.drop_rate.toFixed(2)}%`
                              : `${item.drop_rate.toFixed(1)}%`}
                          </span>
                        </td>
                        <td className="hidden px-5 py-3 text-right text-sm text-gray-500 sm:table-cell">
                          ~{avgOpens} {typeof avgOpens === "number" ? "opens" : ""}
                        </td>
                        <td className="hidden px-5 py-3 md:table-cell">
                          <span className={`flex items-center gap-1 text-xs font-medium ${SourceMeta.color}`}>
                            <SourceMeta.icon className="h-3.5 w-3.5" />
                            {SourceMeta.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-brand-600" />
          <h3 className="mt-2 text-lg font-bold text-gray-900">Know drop rates we&apos;re missing?</h3>
          <p className="mt-1 text-sm text-gray-500">
            Help us build the most accurate database by submitting your data.
          </p>
          <button className="btn-primary mt-4">Submit Drop Rates</button>
        </div>
      </div>
    </div>
  );
}
