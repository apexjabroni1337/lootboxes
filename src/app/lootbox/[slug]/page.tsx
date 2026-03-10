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

function systemLabel(type: string | null): { label: string; color: string; tagBg: string } {
  const map: Record<string, { label: string; color: string; tagBg: string }> = {
    gacha: { label: "Gacha", color: "bg-purple-100 text-purple-700", tagBg: "bg-purple-600" },
    loot_box: { label: "Loot Box", color: "bg-red-100 text-red-700", tagBg: "bg-red-500" },
    card_pack: { label: "Card Pack", color: "bg-blue-100 text-blue-700", tagBg: "bg-blue-600" },
    cosmetic_shop: { label: "Cosmetic Shop", color: "bg-emerald-100 text-emerald-700", tagBg: "bg-emerald-600" },
    battle_pass: { label: "Battle Pass", color: "bg-amber-100 text-amber-700", tagBg: "bg-amber-600" },
  };
  return type && map[type] ? map[type] : { label: type || "Unknown", color: "bg-gray-100 text-gray-600", tagBg: "bg-gray-600" };
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

  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!game) return null;

  const { data: content } = await supabase
    .from("lootbox_content")
    .select("*")
    .eq("game_id", game.id)
    .single();

  const { data: dropRates } = await supabase
    .from("drop_rates")
    .select("*")
    .eq("game_id", game.id)
    .order("drop_rate_pct", { ascending: true });

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

  const rarestItem = dropRates.find(
    (d: any) =>
      !d.rarity.toLowerCase().includes("pity") &&
      !d.rarity.toLowerCase().includes("effective")
  );

  const scoreLabel =
    game.lootboxes_score !== null
      ? game.lootboxes_score >= 7
        ? "Great"
        : game.lootboxes_score >= 5
        ? "Average"
        : game.lootboxes_score >= 3
        ? "Below average"
        : "Poor"
      : "";

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* ─── BREADCRUMB ─── */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
        <nav className="container-main flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 py-3">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/lootbox" className="hover:text-brand-600 transition-colors">
            Loot Box Database
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 dark:text-white font-semibold">{game.title}</span>
        </nav>
      </div>

      {/* ─── COMPACT HERO ─── */}
      <section className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700">
        <div className="container-main py-6">
          <div className="flex items-center gap-6">
            {/* Cover image — compact */}
            <div className="flex-shrink-0 w-[140px] h-[180px] rounded-xl overflow-hidden shadow-lg">
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

            {/* Text info */}
            <div className="flex-1">
              {/* Badges row */}
              <div className="flex items-center gap-3 mb-2">
                {game.lootboxes_score !== null && (
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-600 text-white text-xl font-extrabold shadow-md">
                    {game.lootboxes_score.toFixed(1)}
                  </div>
                )}
                <span className={`text-xs font-bold px-3 py-1.5 rounded-md text-white uppercase tracking-wide ${sys.tagBg}`}>
                  {sys.label}
                </span>
                {content.has_pity_system && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-md bg-emerald-600 text-white uppercase tracking-wide">
                    Pity System
                  </span>
                )}
                {game.tags?.includes("mobile") && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-md bg-cyan-600 text-white uppercase tracking-wide">
                    Mobile
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-black uppercase text-gray-900 dark:text-white tracking-tight leading-tight">
                {game.title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Full monetization analysis and consumer protection review.
              </p>

              {/* Meta row */}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
                {content.currency_name && (
                  <span>
                    Currency: <span className="text-gray-700 dark:text-gray-200 font-semibold">{content.currency_name}</span>
                    {content.currency_per_dollar && (
                      <span className="text-gray-400 dark:text-gray-500"> · {content.currency_per_dollar} per $1</span>
                    )}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Updated {new Date(content.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── QUICK STATS ROW ─── */}
      <div className="container-main -mt-5 relative z-10 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {content.cost_per_pull !== null && content.cost_per_pull > 0 && (
            <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">Cost Per Pull</span>
              <div className="text-2xl font-extrabold text-brand-600">${content.cost_per_pull.toFixed(2)}</div>
              {content.currency_name && (
                <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Per {content.currency_name}</div>
              )}
            </div>
          )}
          {content.has_pity_system && content.pulls_to_pity && (
            <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">Pulls to Pity</span>
              <div className="text-2xl font-extrabold text-emerald-600">{content.pulls_to_pity}</div>
              <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Guaranteed reward</div>
            </div>
          )}
          {content.cost_to_pity !== null && content.cost_to_pity > 0 && (
            <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">Cost to Pity</span>
              <div className="text-2xl font-extrabold text-amber-500">${content.cost_to_pity.toFixed(0)}</div>
              <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Worst case spend</div>
            </div>
          )}
          {game.lootboxes_score !== null && (
            <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">Lootboxes Score</span>
              <div className="text-2xl font-extrabold text-brand-600">
                {game.lootboxes_score.toFixed(1)}<span className="text-base text-gray-400 dark:text-gray-500 font-semibold">/10</span>
              </div>
              <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{scoreLabel}</div>
            </div>
          )}
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="container-main pb-16">
        <div className="space-y-12">
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
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-4 shadow-sm">
                <DropRateBarChart items={dropRates} />
              </div>

              {/* Drop rate table */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-bold text-gray-400 dark:text-gray-500 uppercase text-[11px] tracking-wider">Item</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-400 dark:text-gray-500 uppercase text-[11px] tracking-wider">Rarity</th>
                      <th className="text-right py-3 px-4 font-bold text-gray-400 dark:text-gray-500 uppercase text-[11px] tracking-wider">Drop Rate</th>
                      <th className="text-right py-3 px-4 font-bold text-gray-400 dark:text-gray-500 uppercase text-[11px] tracking-wider">~Avg. Opens</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-400 dark:text-gray-500 uppercase text-[11px] tracking-wider">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dropRates.map((rate: any) => {
                      const src = SOURCE_META[rate.source] || SOURCE_META.user_reported;
                      const SrcIcon = src.icon;
                      return (
                        <tr key={rate.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900 transition-colors">
                          <td className="py-2.5 px-4 font-medium text-gray-900 dark:text-white">{rate.item_name}</td>
                          <td className="py-2.5 px-4">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getRarityColor(rate.rarity)}`}>
                              {rate.rarity}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right font-bold text-gray-900 dark:text-white">
                            {rate.drop_rate_pct < 1
                              ? `${rate.drop_rate_pct}%`
                              : `${Number(rate.drop_rate_pct).toFixed(1)}%`}
                          </td>
                          <td className="py-2.5 px-4 text-right text-gray-500 dark:text-gray-400">
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
              <SectionHeader icon={Scale} title="Score Breakdown" />
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <ScoreBreakdown
                  overall={game.lootboxes_score}
                  transparency={content.score_transparency}
                  compliance={content.score_compliance}
                  ageGating={content.score_age_gating}
                  value={content.score_value}
                  fairness={content.score_fairness}
                  p2wImpact={content.score_p2w_impact}
                  playerControl={content.score_player_control}
                  psychDesign={content.score_psych_design}
                />
              </div>
            </section>
          )}

          {/* Section: Historical Changes */}
          {content.history_html && (
            <section>
              <SectionHeader icon={History} title="Historical Changes" />
              <div className="relative pl-6">
                {/* Timeline line */}
                <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-gray-200" />
                <div
                  className="prose prose-gray max-w-none [&_p]:relative [&_p]:pl-4 [&_p]:before:content-[''] [&_p]:before:absolute [&_p]:before:-left-[5px] [&_p]:before:top-[10px] [&_p]:before:w-2.5 [&_p]:before:h-2.5 [&_p]:before:bg-brand-600 [&_p]:before:rounded-full [&_p]:before:border-2 [&_p]:before:border-white [&_p]:before:shadow-[0_0_0_2px_theme(colors.blue.200)] [&_strong]:text-brand-700"
                  dangerouslySetInnerHTML={{ __html: content.history_html }}
                />
              </div>
            </section>
          )}

          {/* Section: Comparison Table */}
          {comparisons.length > 0 && (
            <section>
              <SectionHeader icon={BarChart3} title="Compared to Similar Games" />
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
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
              <SectionHeader icon={Users} title="Community Sentiment & Controversy" />
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
              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 p-6">
                <div
                  className="prose max-w-none [&_p]:text-amber-800 [&_strong]:text-amber-900"
                  dangerouslySetInnerHTML={{ __html: content.tips_html }}
                />
              </div>
            </section>
          )}

          {/* Section: Editorial / Verdict */}
          {content.editorial_html && (
            <section>
              <SectionHeader icon={BookOpen} title="Our Verdict" />
              <div
                className="prose prose-gray prose-lg max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: content.editorial_html }}
              />

              {/* Verdict summary box */}
              {game.lootboxes_score !== null && (
                <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-8 text-center shadow-lg">
                  <div className="text-xs text-white/60 uppercase tracking-[3px] font-semibold mb-2">
                    Lootboxes Score
                  </div>
                  <div className="text-5xl font-black text-white mb-4">
                    {game.lootboxes_score.toFixed(1)}/10
                  </div>
                  <p className="text-sm text-white/80 max-w-lg mx-auto leading-relaxed">
                    {game.lootboxes_score >= 7
                      ? `${game.title} demonstrates strong consumer-friendly practices with good transparency and fair value for players.`
                      : game.lootboxes_score >= 5
                      ? `${game.title} offers a mixed monetization experience — some consumer-friendly elements alongside areas for improvement.`
                      : game.lootboxes_score >= 3
                      ? `${game.title} falls below average in consumer protection. Players should exercise caution and set spending limits.`
                      : `${game.title} scores poorly on consumer protection metrics. We recommend extreme caution with this monetization system.`}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Related Links */}
          <section className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/games/${game.slug}`}
                className="flex items-center gap-2 bg-brand-50 dark:bg-brand-950/30 rounded-lg px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
              >
                View Deals for {game.title}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/drop-rates"
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 transition-colors"
              >
                Drop Rate Database
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/lootbox"
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 transition-colors"
              >
                All Loot Box Analyses
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </div>
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
    <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
      <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center">
        <Icon className="w-4 h-4 text-brand-600" />
      </div>
      <h2 className="text-xl font-extrabold uppercase tracking-tight text-gray-900 dark:text-white">{title}</h2>
    </div>
  );
}
