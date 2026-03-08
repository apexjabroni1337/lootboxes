import Link from "next/link";
import {
  Eye,
  EyeOff,
  ChevronLeft,
  Shield,
  AlertTriangle,
  ArrowRight,
  Info,
  CheckCircle,
  XCircle,
  HelpCircle,
  BarChart3,
  Scale,
  Search,
} from "lucide-react";
import { createServerClient } from "@/lib/supabase";
import GameAvatar from "@/components/ui/GameAvatar";

export const revalidate = 3600;

interface LootboxContent {
  score_transparency: number;
}

interface Game {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  lootboxes_score: number;
  loot_system_type: string;
  lootbox_content: LootboxContent | LootboxContent[];
}

function getTransparencyScore(
  content: LootboxContent | LootboxContent[] | null
): number {
  if (!content) return 0;
  const arr = Array.isArray(content) ? content : [content];
  if (arr.length === 0) return 0;
  const sum = arr.reduce((acc, c) => acc + (c.score_transparency || 0), 0);
  return Math.round((sum / arr.length) * 10) / 10;
}

function getGrade(score: number): {
  grade: string;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
} {
  if (score >= 9)
    return {
      grade: "A",
      label: "Fully Transparent",
      description: "Publishes all drop rates, costs, and pity details",
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    };
  if (score >= 7)
    return {
      grade: "B",
      label: "Mostly Transparent",
      description: "Publishes drop rates with minor gaps",
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    };
  if (score >= 5)
    return {
      grade: "C",
      label: "Partially Transparent",
      description: "Some disclosure but key info missing",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    };
  if (score >= 3)
    return {
      grade: "D",
      label: "Mostly Opaque",
      description: "Minimal disclosure, community-sourced data",
      color: "text-orange-700",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    };
  return {
    grade: "F",
    label: "No Disclosure",
    description: "No official odds or cost information published",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  };
}

function systemLabel(type: string): { label: string; color: string } {
  const labels: Record<string, { label: string; color: string }> = {
    gacha: { label: "Gacha", color: "bg-purple-100 text-purple-800" },
    loot_box: { label: "Loot Box", color: "bg-red-100 text-red-800" },
    card_pack: { label: "Card Pack", color: "bg-blue-100 text-blue-800" },
    battle_pass: { label: "Battle Pass", color: "bg-amber-100 text-amber-800" },
    cosmetic_shop: {
      label: "Cosmetic Shop",
      color: "bg-emerald-100 text-emerald-800",
    },
  };
  return labels[type] || { label: type, color: "bg-gray-100 text-gray-800" };
}

export default async function TransparencyReportPage() {
  const supabase = createServerClient();

  const { data: games } = await supabase
    .from("games")
    .select(
      "id, title, slug, cover_image, lootboxes_score, loot_system_type, lootbox_content(score_transparency)"
    )
    .not("lootboxes_score", "is", null)
    .order("lootboxes_score", { ascending: false });

  const allGames = (games || []) as unknown as Game[];

  const graded = allGames
    .map((g) => ({
      game: g,
      transparencyScore: getTransparencyScore(g.lootbox_content),
    }))
    .sort((a, b) => b.transparencyScore - a.transparencyScore);

  const gradeCounts = {
    A: graded.filter((g) => g.transparencyScore >= 9).length,
    B: graded.filter(
      (g) => g.transparencyScore >= 7 && g.transparencyScore < 9
    ).length,
    C: graded.filter(
      (g) => g.transparencyScore >= 5 && g.transparencyScore < 7
    ).length,
    D: graded.filter(
      (g) => g.transparencyScore >= 3 && g.transparencyScore < 5
    ).length,
    F: graded.filter((g) => g.transparencyScore < 3).length,
  };

  const totalGames = graded.length;
  const transparentPct =
    totalGames > 0
      ? Math.round(((gradeCounts.A + gradeCounts.B) / totalGames) * 100)
      : 0;
  const opaquePct =
    totalGames > 0
      ? Math.round(((gradeCounts.D + gradeCounts.F) / totalGames) * 100)
      : 0;
  const avgScore =
    totalGames > 0
      ? (
          graded.reduce((sum, g) => sum + g.transparencyScore, 0) / totalGames
        ).toFixed(1)
      : "0";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 py-16">
        <div className="container-main">
          <Link
            href="/lootbox"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-200 mb-4"
          >
            <ChevronLeft className="h-4 w-4" /> Loot Boxes
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 backdrop-blur-sm">
              <Eye className="h-6 w-6 text-indigo-400" />
            </div>
            <div className="inline-flex rounded-full bg-indigo-500/20 backdrop-blur-sm px-4 py-1 text-sm font-semibold text-indigo-300">
              {totalGames} Games Graded
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Transparency Report
          </h1>
          <p className="mt-2 text-lg text-indigo-300 font-semibold">
            Which games publish their drop rates?
          </p>
          <p className="mt-4 max-w-2xl text-gray-300 leading-relaxed">
            We grade every analyzed game on how openly they disclose loot box
            odds, pricing structures, and pity system details. Full transparency
            earns an A; hiding everything earns an F. Players deserve to know
            the odds before they spend.
          </p>
        </div>
      </section>

      {/* Summary stats */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="container-main py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-4xl font-black text-gray-900">{totalGames}</p>
              <p className="text-sm text-gray-500">Games Graded</p>
            </div>
            <div>
              <p className="text-4xl font-black text-emerald-600">
                {transparentPct}%
              </p>
              <p className="text-sm text-gray-500">Grade B or Above</p>
            </div>
            <div>
              <p className="text-4xl font-black text-red-600">
                {opaquePct}%
              </p>
              <p className="text-sm text-gray-500">Grade D or Below</p>
            </div>
            <div>
              <p className="text-4xl font-black text-indigo-600">{avgScore}</p>
              <p className="text-sm text-gray-500">Average Score / 10</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grade distribution bar */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container-main py-6">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
            Grade Distribution
          </h2>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {(["A", "B", "C", "D", "F"] as const).map((grade) => {
              const info = getGrade(
                grade === "A"
                  ? 9
                  : grade === "B"
                  ? 7
                  : grade === "C"
                  ? 5
                  : grade === "D"
                  ? 3
                  : 1
              );
              return (
                <div
                  key={grade}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 ${info.borderColor} ${info.bgColor} flex-shrink-0`}
                >
                  <span className={`text-xl font-black ${info.color}`}>
                    {grade}
                  </span>
                  <div>
                    <p className={`text-xs font-semibold ${info.color}`}>
                      {info.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {gradeCounts[grade]} game
                      {gradeCounts[grade] !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual bar */}
          {totalGames > 0 && (
            <div className="mt-4 flex h-4 rounded-full overflow-hidden">
              {gradeCounts.A > 0 && (
                <div
                  className="bg-emerald-500"
                  style={{ width: `${(gradeCounts.A / totalGames) * 100}%` }}
                  title={`Grade A: ${gradeCounts.A}`}
                />
              )}
              {gradeCounts.B > 0 && (
                <div
                  className="bg-blue-500"
                  style={{ width: `${(gradeCounts.B / totalGames) * 100}%` }}
                  title={`Grade B: ${gradeCounts.B}`}
                />
              )}
              {gradeCounts.C > 0 && (
                <div
                  className="bg-amber-500"
                  style={{ width: `${(gradeCounts.C / totalGames) * 100}%` }}
                  title={`Grade C: ${gradeCounts.C}`}
                />
              )}
              {gradeCounts.D > 0 && (
                <div
                  className="bg-orange-500"
                  style={{ width: `${(gradeCounts.D / totalGames) * 100}%` }}
                  title={`Grade D: ${gradeCounts.D}`}
                />
              )}
              {gradeCounts.F > 0 && (
                <div
                  className="bg-red-500"
                  style={{ width: `${(gradeCounts.F / totalGames) * 100}%` }}
                  title={`Grade F: ${gradeCounts.F}`}
                />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Game list by grade */}
      <section className="py-8">
        <div className="container-main">
          {(["A", "B", "C", "D", "F"] as const).map((targetGrade) => {
            const minScore =
              targetGrade === "A"
                ? 9
                : targetGrade === "B"
                ? 7
                : targetGrade === "C"
                ? 5
                : targetGrade === "D"
                ? 3
                : 0;
            const maxScore =
              targetGrade === "A"
                ? 11
                : targetGrade === "B"
                ? 9
                : targetGrade === "C"
                ? 7
                : targetGrade === "D"
                ? 5
                : 3;

            const gamesInGrade = graded.filter(
              (g) =>
                g.transparencyScore >= minScore &&
                g.transparencyScore < maxScore
            );
            if (gamesInGrade.length === 0) return null;

            const info = getGrade(minScore);
            const isShame = targetGrade === "D" || targetGrade === "F";

            return (
              <div key={targetGrade} className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  {isShame ? (
                    <AlertTriangle className={`h-5 w-5 ${info.color}`} />
                  ) : targetGrade === "A" ? (
                    <CheckCircle className={`h-5 w-5 ${info.color}`} />
                  ) : (
                    <Shield className={`h-5 w-5 ${info.color}`} />
                  )}
                  <h2 className="text-xl font-bold text-gray-900">
                    Grade {targetGrade} — {info.label}
                  </h2>
                  <span className="text-sm text-gray-400">
                    ({gamesInGrade.length})
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4 ml-8">
                  {info.description}
                </p>

                {isShame && (
                  <div className="mb-4 ml-8 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50/50 px-4 py-3">
                    <EyeOff className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">
                      {targetGrade === "F"
                        ? "These games publish no official odds. Players are spending blindly."
                        : "These games provide minimal information. Most data comes from community research."}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  {gamesInGrade.map(({ game, transparencyScore }) => {
                    const g = getGrade(transparencyScore);
                    const sys = systemLabel(game.loot_system_type);
                    return (
                      <Link
                        key={game.id}
                        href={`/lootbox/${game.slug}`}
                        className={`flex items-center gap-4 rounded-xl border ${g.borderColor} ${g.bgColor} px-4 py-3 hover:shadow-md transition-all group`}
                      >
                        <div className="flex-shrink-0 w-10 h-10">
                          <GameAvatar
                            gameName={game.title}
                            size="sm"
                            aspectRatio="square"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate text-sm group-hover:text-blue-600 transition-colors">
                            {game.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${sys.color}`}
                            >
                              {sys.label}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              Overall: {game.lootboxes_score}/10
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`text-2xl font-black ${g.color}`}>
                            {g.grade}
                          </span>
                          <p className="text-[10px] text-gray-400">
                            {transparencyScore}/10
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {totalGames === 0 && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
              <Search className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                No games graded yet.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Check back soon — we&apos;re actively analyzing games.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Methodology */}
      <section className="border-t border-gray-100 bg-gray-50/50 py-12">
        <div className="container-main">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-indigo-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              How We Grade Transparency
            </h2>
          </div>

          <div className="max-w-3xl space-y-4 text-gray-700 leading-relaxed mb-8">
            <p>
              Our transparency score (1–10) measures how much a game&apos;s publisher
              voluntarily reveals about their monetization mechanics. We evaluate
              each game against a standardized checklist and assign points based
              on what they disclose.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-emerald-900">
                  What Earns Points
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-emerald-800">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">+</span>
                  Official drop rate publication
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">+</span>
                  Exact pity system thresholds disclosed
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">+</span>
                  Clear cost-per-pull pricing (no hidden currency layers)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">+</span>
                  Historical rate-change disclosure
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">+</span>
                  In-game display of odds before purchase
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="h-5 w-5 text-red-600" />
                <h3 className="font-bold text-red-900">What Loses Points</h3>
              </div>
              <ul className="space-y-2 text-sm text-red-800">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">−</span>
                  No official drop rates published
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">−</span>
                  Hidden pity or soft-pity mechanics
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">−</span>
                  Obfuscated pricing through premium currencies
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">−</span>
                  Silently changing odds without notice
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">−</span>
                  Requiring datamining to determine drop rates
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-blue-900">Data Sources</h3>
              </div>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  Official publisher disclosures and patch notes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  In-game UI screenshots and documentation
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  Community-verified rates from large sample sizes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  App store compliance documentation
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  Regulatory filings in disclosure-required regions
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 max-w-3xl">
            <Info className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 leading-relaxed">
              Transparency scores are updated whenever a game changes its
              disclosure practices. If a publisher begins (or stops) publishing
              drop rates, we re-evaluate their grade. Want to report a change?{" "}
              <Link
                href="/newsletter"
                className="text-indigo-600 hover:underline font-medium"
              >
                Let us know
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Why transparency matters */}
      <section className="border-t border-gray-100 bg-white py-12">
        <div className="container-main">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Why Transparency Matters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                  <Scale className="h-4 w-4 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900">Informed Spending</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                When you know the odds, you can calculate expected cost per item
                and decide whether a purchase is worth it. Without transparency,
                you&apos;re spending blindly.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900">
                  Holding Publishers Accountable
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Public transparency reports create market pressure. When players
                can compare games, publishers with poor practices face
                reputational consequences that encourage improvement.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
                <h3 className="font-bold text-gray-900">
                  Protecting Vulnerable Players
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Transparency is especially important for younger players and
                those susceptible to gambling-like mechanics. Knowing the odds
                helps players set realistic expectations and budgets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50 py-10">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <EyeOff className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-gray-900">
                  Think a game should be more transparent?
                </h2>
              </div>
              <p className="text-sm text-gray-600">
                Help us hold publishers accountable. Request a game analysis or
                report inaccurate data.
              </p>
            </div>
            <Link
              href="/newsletter"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 transition-colors whitespace-nowrap"
            >
              Get Updates <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm">
            <Link
              href="/lootbox/regulations"
              className="text-indigo-700 hover:text-indigo-900 hover:underline font-medium"
            >
              Regulations Tracker →
            </Link>
            <Link
              href="/lootbox/odds-comparison"
              className="text-indigo-700 hover:text-indigo-900 hover:underline font-medium"
            >
              Compare Odds →
            </Link>
            <Link
              href="/methodology"
              className="text-indigo-700 hover:text-indigo-900 hover:underline font-medium"
            >
              Full Methodology →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
