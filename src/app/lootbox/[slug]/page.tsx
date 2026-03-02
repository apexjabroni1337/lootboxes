import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase";
import {
  Zap,
  ChevronRight,
  Clock,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  History,
  Users,
  ArrowRight,
  BookOpen,
  BarChart3,
  Scale,
} from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";
import DropRateBarChart from "@/components/lootbox/DropRateBarChart";
import CostCalculator from "@/components/lootbox/CostCalculator";
import ScoreBreakdown from "@/components/lootbox/ScoreBreakdown";
import ComparisonTable from "@/components/lootbox/ComparisonTable";

export const revalidate = 3600;

function systemLabel(type: string | null): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    gacha: { label: "Gacha", color: "bg-purple-100 text-purple-700" },
    loot_box: { label: "Loot Box", color: "bg-red-100 text-red-700" },
    card_pack: { label: "Card Pack", color: "bg-blue-100 text-blue-700" },
    cosmetic_shop: { label: "Cosmetic Shop", color: "bg-emerald-100 text-emerald-700" },
    battle_pass: { label: "Battle Pass", color: "bg-amber-100 text-amber-700" },
  };
  return type && map[type] ? map[type] : { label: type || "Unknown", color: "bg-gray-100 text-gray-600" };
}

function getRarityColor(rarity: string): string {
  const r = rarity.toLowerCase();
  if (r.includes("heirloom") || r.includes("mythic") || r.includes("icon") || r.includes("crown") || r.includes("exceedingly"))
    return "bg-amber-100 text-amber-800";
  if (r.includes("covert") || r.includes("legendary") || r.includes("5-star") || r.includes("s-rank") || r.includes("secret"))
    return "bg-red-100 text-red-800";
  if (r.includes("epic") || r.includes("classified") || r.includes("import") || r.includes("full art") || r.includes("premium") || r.includes("exotic") || r.includes("black market"))
    return "bg-purple-100 text-purple-800";
  if (r.includes("rare") || r.includes("restricted") || r.includes("4-star") || r.includes("a-rank") || r.includes("star rare") || r.includes("deluxe") || r.includes("very rare"))
    return "bg-blue-100 text-blue-800";
  if (r.includes("pity") || r.includes("effective"))
    return "bg-emerald-100 text-emerald-800";
  if (r.includes("stattrak") || r.includes("painted") || r.includes("certified"))
    return "bg-orange-100 text-orange-800";
  return "bg-gray-100 text-gray-700";
}

const SOURCE_META: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  official: { label: "Official", color: "text-emerald-600", icon: CheckCircle },
  community_verified: { label: "Community Verified", color: "text-blue-600", icon: HelpCircle },
  user_reported: { label: "User Reported", color: "text-orange-500", icon: AlertTriangle },
};

async function getGameData(slug: string) {
  const supabase = createServerClient();

  // Get game
  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!game) return null;

  // Get lootbox content
  const { data: content } = await supabase
    .from("lootbox_content")
    .select("*")
    .eq("game_id", game.id)
    .single();

  // Get drop rates
  const { data: dropRates } = await supabase
    .from("drop_rates")
    .select("*")
    .eq("game_id", game.id)
    .order("drop_rate_pct", { ascending: true });

  // Get comparison games
  let comparisons: any[] = [];
  if (content?.comparable_slugs && content.comparable_slugs.length > 0) {
    const { data: compGames } = await supabase
      .from("games")
      .select(
        `id, title, slug, lootboxes_score, loot_system_type,
         lootbox_content (cost_per_pull, has_pity_system, pulls_to_pity)`
      )
      .in("slug", content.comparable_slugs);

    if (compGames) {
      comparisons = compGames.map((g: any) => ({
        slug: g.slug,
        title: g.title,
        lootboxes_score: g.lootboxes_score,
        loot_system_type: g.loot_system_type,
        cost_per_pull: g.lootbox_content?.[0]?.cost_per_pull ?? null,
        has_pity_system: g.lootbox_content?.[0]?.has_pity_system ?? false,
        pulls_to_pity: g.lootbox_content?.[0]?.pulls_to_pity ?? null,
      }));
    }
  }

  return { game, content, dropRates: dropRates || [], comparisons };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await getGameData(params.slug);
  if (!data) return { title: "Not Found" };

  return {
    title: `${data.game.title} Loot Box Analysis — Drop Rates, Costs & Score`,
    description: `Complete analysis of ${data.game.title}'s monetization system. Drop rates, expected costs, pity mechanics, and our expert score of ${data.game.lootboxes_score}/10.`,
  };
}

export default async function LootboxGamePage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getGameData(params.slug);
  if (!data || !data.content) notFound();

  const { game, content, dropRates, comparisons } = data;
  const sys = systemLabel(game.loot_system_type);

  // Find the rarest non-pity item for cost calculator
  const rarestItem = dropRates.find(
    (d: any) =>
      !d.rarity.toLowerCase().includes("pity") &&
      !d.rarity.toLowerCase().includes("effective")
  );

  return (
    <div className="container-main py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/lootbox" className="hover:text-blue-600">
          Loot Box Database
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-medium">{game.title}</span>
      </nav>

      {/* ─── HERO ─── */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        {/* Image */}
        <div className="flex-shrink-0 w-full lg:w-48 h-48 lg:h-64 rounded-2xl overflow-hidden bg-gray-100">
          {game.cover_image ? (
            <img
              src={game.cover_image}
              alt={game.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <GameAvatar gameName={game.title} aspectRatio="portrait" size="lg" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${sys.color}`}>
              {sys.label}
            </span>
            {content.has_pity_system && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                Pity System
              </span>
            )}
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            {game.title} Loot Box Analysis
          </h1>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-3 mb-4">
            {game.lootboxes_score !== null && (
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                <div
                  className={`h-7 w-9 rounded text-xs font-bold text-white flex items-center justify-center ${
                    game.lootboxes_score >= 7
                      ? "bg-emerald-500"
                      : game.lootboxes_score >= 5
                      ? "bg-amber-500"
                      : game.lootboxes_score >= 3
                      ? "bg-orange-500"
                      : "bg-red-500"
                  }`}
                >
                  {game.lootboxes_score.toFixed(1)}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Lootboxes Score
                </span>
              </div>
            )}
            {content.cost_per_pull !== null && content.cost_per_pull > 0 && (
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 text-sm font-medium text-gray-700">
                ${content.cost_per_pull.toFixed(2)} per pull
              </div>
            )}
            {content.has_pity_system && content.pulls_to_pity && (
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 text-sm font-medium text-gray-700">
                Pity at {content.pulls_to_pity} pulls
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              Updated {new Date(content.updated_at).toLocaleDateString()}
            </div>
          </div>

          {/* Currency info */}
          {content.currency_name && (
            <p className="text-sm text-gray-500">
              Premium currency: <span className="font-medium text-gray-700">{content.currency_name}</span>
              {content.currency_per_dollar && (
                <> · {content.currency_per_dollar} per $1 USD</>
              )}
            </p>
          )}
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="space-y-10">
        {/* Section: Overview */}
        {content.overview_html && (
          <section>
            <SectionHeader icon={BookOpen} title="Monetization Overview" />
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: content.overview_html }}
            />
          </section>
        )}

        {/* Section: Drop Rate Visualization */}
        {dropRates.length > 0 && (
          <section>
            <SectionHeader icon={BarChart3} title="Drop Rate Breakdown" />
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
              <DropRateBarChart items={dropRates} />
            </div>

            {/* Drop rate table */}
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 uppercase text-xs tracking-wider">Item</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 uppercase text-xs tracking-wider">Rarity</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600 uppercase text-xs tracking-wider">Drop Rate</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600 uppercase text-xs tracking-wider">~Avg. Opens</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 uppercase text-xs tracking-wider">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {dropRates.map((rate: any) => {
                    const src = SOURCE_META[rate.source] || SOURCE_META.user_reported;
                    const SrcIcon = src.icon;
                    return (
                      <tr key={rate.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2.5 px-4 font-medium text-gray-900">{rate.item_name}</td>
                        <td className="py-2.5 px-4">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getRarityColor(rate.rarity)}`}>
                            {rate.rarity}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-bold text-gray-900">
                          {rate.drop_rate_pct < 1
                            ? `${rate.drop_rate_pct}%`
                            : `${Number(rate.drop_rate_pct).toFixed(1)}%`}
                        </td>
                        <td className="py-2.5 px-4 text-right text-gray-500">
                          {rate.drop_rate_pct > 0 && rate.drop_rate_pct < 100
                            ? `~${Math.ceil(100 / rate.drop_rate_pct)} opens`
                            : "—"}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className={`flex items-center gap-1 text-xs font-medium ${src.color}`}>
                            <SrcIcon className="w-3.5 h-3.5" />
                            {src.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Section: Cost Calculator */}
        {(content.cost_per_pull !== null || content.cost_to_pity !== null) && (
          <section>
            <SectionHeader icon={Zap} title="Expected Cost Analysis" />
            <CostCalculator
              costPerPull={content.cost_per_pull}
              costToPity={content.cost_to_pity}
              pullsToPity={content.pulls_to_pity}
              hasPity={content.has_pity_system}
              currencyName={content.currency_name}
              currencyPerDollar={content.currency_per_dollar}
              topRarityRate={rarestItem?.drop_rate_pct ?? 0}
              topRarityName={rarestItem?.rarity ?? "Rare"}
            />
          </section>
        )}

        {/* Section: Pity System */}
        {content.pity_explanation_html && (
          <section>
            <SectionHeader
              icon={content.has_pity_system ? CheckCircle : AlertTriangle}
              title={
                content.has_pity_system
                  ? "Pity System Explained"
                  : "No Pity System"
              }
            />
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: content.pity_explanation_html }}
            />
          </section>
        )}

        {/* Section: Score Breakdown */}
        {game.lootboxes_score !== null && (
          <section>
            <SectionHeader icon={Scale} title="Lootboxes Score Breakdown" />
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <ScoreBreakdown
                overall={game.lootboxes_score}
                transparency={content.score_transparency}
                value={content.score_value}
                fairness={content.score_fairness}
                playerControl={content.score_player_control}
              />
            </div>
          </section>
        )}

        {/* Section: Historical Changes */}
        {content.history_html && (
          <section>
            <SectionHeader icon={History} title="Historical Changes" />
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: content.history_html }}
            />
          </section>
        )}

        {/* Section: Comparison Table */}
        {comparisons.length > 0 && (
          <section>
            <SectionHeader icon={BarChart3} title="Compared to Similar Games" />
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <ComparisonTable
                current={{
                  slug: game.slug,
                  title: game.title,
                  lootboxes_score: game.lootboxes_score,
                  loot_system_type: game.loot_system_type,
                  cost_per_pull: content.cost_per_pull,
                  has_pity_system: content.has_pity_system,
                  pulls_to_pity: content.pulls_to_pity,
                }}
                comparisons={comparisons}
              />
            </div>
          </section>
        )}

        {/* Section: Community Sentiment */}
        {content.controversy_html && (
          <section>
            <SectionHeader
              icon={Users}
              title="Community Sentiment & Controversy"
            />
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: content.controversy_html }}
            />
          </section>
        )}

        {/* Section: Spending Tips */}
        {content.tips_html && (
          <section>
            <SectionHeader icon={Lightbulb} title="Spending Tips & Advice" />
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
              <div
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: content.tips_html }}
              />
            </div>
          </section>
        )}

        {/* Section: Editorial */}
        {content.editorial_html && (
          <section>
            <SectionHeader icon={BookOpen} title="Our Verdict" />
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 lg:p-8">
              <div
                className="prose prose-gray prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: content.editorial_html }}
              />
            </div>
          </section>
        )}

        {/* Related Links */}
        <section className="border-t border-gray-200 pt-8">
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/games/${game.slug}`}
              className="flex items-center gap-2 bg-blue-50 rounded-lg px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            >
              View Deals for {game.title}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/drop-rates"
              className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Drop Rate Database
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/lootbox"
              className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              All Loot Box Analyses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <Icon className="w-5 h-5 text-blue-600" />
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    </div>
  );
}
