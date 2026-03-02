import { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase";
import { Zap, Shield, BarChart3, CheckCircle } from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Loot Box Database — In-Depth Analysis of Every Game's Monetization",
  description:
    "The world's most comprehensive loot box database. Drop rates, cost analysis, pity systems, and expert reviews for every major game's monetization system.",
};

interface GameWithContent {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  lootboxes_score: number | null;
  loot_system_type: string | null;
  lootbox_content: {
    cost_per_pull: number | null;
    has_pity_system: boolean;
    overview_html: string | null;
  }[];
}

function systemLabel(type: string | null): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    gacha: { label: "Gacha", color: "bg-purple-100 text-purple-700" },
    loot_box: { label: "Loot Box", color: "bg-red-100 text-red-700" },
    card_pack: { label: "Card Pack", color: "bg-blue-100 text-blue-700" },
    cosmetic_shop: {
      label: "Cosmetic Shop",
      color: "bg-emerald-100 text-emerald-700",
    },
    battle_pass: {
      label: "Battle Pass",
      color: "bg-amber-100 text-amber-700",
    },
  };
  return type && map[type] ? map[type] : { label: type || "Unknown", color: "bg-gray-100 text-gray-600" };
}

function scoreColor(score: number | null): string {
  if (score === null) return "bg-gray-400";
  if (score >= 7) return "bg-emerald-500";
  if (score >= 5) return "bg-amber-500";
  if (score >= 3) return "bg-orange-500";
  return "bg-red-500";
}

function scoreVerdict(score: number | null): string {
  if (score === null) return "";
  if (score >= 7) return "Good value — fair monetization";
  if (score >= 5) return "Average — mixed practices";
  if (score >= 3) return "Below average — concerning practices";
  return "Poor value — predatory monetization";
}

async function getGamesWithLootboxContent(): Promise<GameWithContent[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("games")
    .select(
      `id, title, slug, cover_image, lootboxes_score, loot_system_type,
       lootbox_content (cost_per_pull, has_pity_system, overview_html)`
    )
    .not("loot_system_type", "is", null)
    .order("lootboxes_score", { ascending: true });

  if (error || !data) return [];
  // Only include games that have lootbox_content
  return (data as GameWithContent[]).filter(
    (g) => g.lootbox_content && g.lootbox_content.length > 0
  );
}

export default async function LootboxHubPage() {
  const games = await getGamesWithLootboxContent();
  const totalDropRates = games.length * 6; // approximate

  return (
    <div className="container-main py-8">
      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Loot Box Database
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl">
          In-depth analysis of every major game&apos;s monetization system. Drop
          rates, cost breakdowns, pity mechanics, and expert reviews — all in one
          place.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-4 py-2.5 border border-blue-100">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">
              {games.length} Games Analyzed
            </span>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 rounded-lg px-4 py-2.5 border border-purple-100">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-900">
              {totalDropRates}+ Drop Rates Tracked
            </span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-4 py-2.5 border border-emerald-100">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-900">
              Officially Verified Data
            </span>
          </div>
        </div>
      </div>

      {/* Rankings CTA */}
      <div className="mb-8 flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 px-6 py-4">
        <div>
          <h2 className="font-bold text-gray-900">Loot Box Rankings</h2>
          <p className="text-sm text-gray-600">See every game ranked by monetization fairness — best to worst.</p>
        </div>
        <Link
          href="/lootbox/rankings"
          className="flex-shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
        >
          View Rankings
        </Link>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-12">
        {games.map((game) => {
          const content = game.lootbox_content[0];
          const sys = systemLabel(game.loot_system_type);
          return (
            <Link
              key={game.slug}
              href={`/lootbox/${game.slug}`}
              className="group flex gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-lg hover:border-blue-200 transition-all"
            >
              {/* Image */}
              <div className="flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden bg-gray-100">
                {game.cover_image ? (
                  <img
                    src={game.cover_image}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <GameAvatar gameName={game.title} aspectRatio="portrait" size="md" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {game.title}
                  </h2>
                  {game.lootboxes_score !== null && (
                    <div
                      className={`flex-shrink-0 ${scoreColor(
                        game.lootboxes_score
                      )} text-white text-sm font-bold h-8 w-10 rounded-lg flex items-center justify-center`}
                    >
                      {game.lootboxes_score.toFixed(1)}
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-2">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${sys.color}`}
                  >
                    {sys.label}
                  </span>
                  {content?.has_pity_system && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      Has Pity System
                    </span>
                  )}
                  {content?.cost_per_pull !== null && content.cost_per_pull > 0 && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      ${content.cost_per_pull.toFixed(2)}/pull
                    </span>
                  )}
                </div>

                {/* Verdict */}
                <p className="text-sm text-gray-500 line-clamp-2">
                  {scoreVerdict(game.lootboxes_score)}
                </p>

                <span className="inline-block mt-2 text-sm font-medium text-blue-600 group-hover:underline">
                  View Full Analysis →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Methodology */}
      <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
        <div className="flex items-center gap-3 mb-5">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            How We Rate Games
          </h2>
        </div>
        <p className="text-sm text-gray-600 mb-6 max-w-2xl">
          Every game receives a Lootboxes Score from 1-10 based on 8 criteria
          across three weighted categories. Our methodology is transparent,
          criteria-based, and open to scrutiny.
        </p>

        {/* Category cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-blue-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-sm">
                Consumer Protection
              </h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                40%
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Transparency, regulatory compliance, and spending safeguards.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-emerald-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-sm">
                Value &amp; Fairness
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                35%
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Value for money, fairness mechanics, and pay-to-win impact.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-purple-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-sm">
                Player Experience
              </h3>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                25%
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Player control over purchases and psychological design integrity.
            </p>
          </div>
        </div>

        <Link
          href="/methodology"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
        >
          Read our full methodology →
        </Link>
      </div>

      {/* Quick links */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 mb-3">
          Looking for raw data?{" "}
          <Link
            href="/drop-rates"
            className="text-blue-600 font-medium hover:underline"
          >
            View the Drop Rate Database →
          </Link>
        </p>
      </div>
    </div>
  );
}
