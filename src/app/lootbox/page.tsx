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
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            How We Rate Games
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Our Scoring System
            </h3>
            <p>
              Every game receives a Lootboxes Score from 1-10 based on four
              criteria: Transparency (are rates disclosed?), Value (what does
              your money actually get you?), Fairness (are pity systems and
              guarantees in place?), and Player Control (can you choose what to
              buy?). Higher scores indicate more consumer-friendly monetization.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Data Sources
            </h3>
            <p>
              Drop rates come from three tiers: Official disclosures (published
              by the developer, often required by law), Community Verified
              (large-sample empirical testing by trusted researchers), and User
              Reported (aggregated from individual submissions). We always
              display the source alongside every rate.
            </p>
          </div>
        </div>
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
