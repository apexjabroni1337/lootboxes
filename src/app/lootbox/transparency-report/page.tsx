import Link from "next/link";
import {
  Eye,
  EyeOff,
  ChevronLeft,
  Shield,
  AlertTriangle,
  ArrowRight,
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

function getTransparencyScore(content: LootboxContent | LootboxContent[] | null): number {
  if (!content) return 0;
  const arr = Array.isArray(content) ? content : [content];
  if (arr.length === 0) return 0;
  const sum = arr.reduce((acc, c) => acc + (c.score_transparency || 0), 0);
  return Math.round((sum / arr.length) * 10) / 10;
}

function getGrade(score: number): {
  grade: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
} {
  if (score >= 9) return { grade: "A", label: "Fully Transparent", color: "text-emerald-700", bgColor: "bg-emerald-50", borderColor: "border-emerald-200" };
  if (score >= 7) return { grade: "B", label: "Mostly Transparent", color: "text-blue-700", bgColor: "bg-blue-50", borderColor: "border-blue-200" };
  if (score >= 5) return { grade: "C", label: "Partially Transparent", color: "text-amber-700", bgColor: "bg-amber-50", borderColor: "border-amber-200" };
  if (score >= 3) return { grade: "D", label: "Mostly Opaque", color: "text-orange-700", bgColor: "bg-orange-50", borderColor: "border-orange-200" };
  return { grade: "F", label: "No Disclosure", color: "text-red-700", bgColor: "bg-red-50", borderColor: "border-red-200" };
}

function systemLabel(type: string): { label: string; color: string } {
  const labels: Record<string, { label: string; color: string }> = {
    gacha: { label: "Gacha", color: "bg-purple-100 text-purple-800" },
    loot_box: { label: "Loot Box", color: "bg-red-100 text-red-800" },
    card_pack: { label: "Card Pack", color: "bg-blue-100 text-blue-800" },
    battle_pass: { label: "Battle Pass", color: "bg-amber-100 text-amber-800" },
    cosmetic_shop: { label: "Cosmetic Shop", color: "bg-emerald-100 text-emerald-800" },
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
    B: graded.filter((g) => g.transparencyScore >= 7 && g.transparencyScore < 9).length,
    C: graded.filter((g) => g.transparencyScore >= 5 && g.transparencyScore < 7).length,
    D: graded.filter((g) => g.transparencyScore >= 3 && g.transparencyScore < 5).length,
    F: graded.filter((g) => g.transparencyScore < 3).length,
  };

  const totalGames = graded.length;
  const transparentPct =
    totalGames > 0
      ? Math.round(((gradeCounts.A + gradeCounts.B) / totalGames) * 100)
      : 0;

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
              Transparency Grades
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Transparency Report
          </h1>
          <p className="mt-2 text-lg text-indigo-300 font-semibold">
            Which games publish their drop rates?
          </p>
          <p className="mt-4 max-w-2xl text-gray-300 leading-relaxed">
            We grade every analyzed game on how openly they disclose loot box odds,
            pricing structures, and pity system details. Full transparency earns an A;
            hiding everything earns an F.
          </p>
        </div>
      </section>

      {/* Summary stats */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="container-main py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-4xl font-black text-gray-900">{totalGames}</p>
              <p className="text-sm text-gray-500">Games Graded</p>
            </div>
            <div>
              <p className="text-4xl font-black text-emerald-600">{transparentPct}%</p>
              <p className="text-sm text-gray-500">Grade B or Above</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-4xl font-black text-red-600">{gradeCounts.D + gradeCounts.F}</p>
              <p className="text-sm text-gray-500">Games Hiding Odds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grade distribution */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container-main py-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {(["A", "B", "C", "D", "F"] as const).map((grade) => {
              const info = getGrade(
                grade === "A" ? 9 : grade === "B" ? 7 : grade === "C" ? 5 : grade === "D" ? 3 : 1
              );
              return (
                <div
                  key={grade}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 ${info.borderColor} ${info.bgColor} flex-shrink-0`}
                >
                  <span className={`text-xl font-black ${info.color}`}>{grade}</span>
                  <div>
                    <p className={`text-xs font-semibold ${info.color}`}>{info.label}</p>
                    <p className="text-xs text-gray-500">
                      {gradeCounts[grade]} game{gradeCounts[grade] !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Game list */}
      <section className="py-8">
        <div className="container-main">
          {(["A", "B", "C", "D", "F"] as const).map((targetGrade) => {
            const minScore =
              targetGrade === "A" ? 9 : targetGrade === "B" ? 7 : targetGrade === "C" ? 5 : targetGrade === "D" ? 3 : 0;
            const maxScore =
              targetGrade === "A" ? 11 : targetGrade === "B" ? 9 : targetGrade === "C" ? 7 : targetGrade === "D" ? 5 : 3;

            const gamesInGrade = graded.filter(
              (g) => g.transparencyScore >= minScore && g.transparencyScore < maxScore
            );
            if (gamesInGrade.length === 0) return null;

            const info = getGrade(minScore);
            const isShame = targetGrade === "D" || targetGrade === "F";

            return (
              <div key={targetGrade} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  {isShame ? (
                    <AlertTriangle className={`h-5 w-5 ${info.color}`} />
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
                          <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${sys.color}`}>
                            {sys.label}
                          </span>
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
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50 py-12">
        <div className="container-main text-center">
          <EyeOff className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900">Think a game should be more transparent?</h2>
          <p className="text-sm text-gray-600 mt-2 mb-6 max-w-md mx-auto">
            Help us hold publishers accountable. Request a game analysis or report inaccurate data.
          </p>
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Get Updates
          </Link>
        </div>
      </section>
    </div>
  );
}
