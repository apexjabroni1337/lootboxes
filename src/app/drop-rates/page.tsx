import Link from "next/link";
import {
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Zap,
  Sparkles,
  Info,
  BarChart3,
} from "lucide-react";
import ScoreBadge from "@/components/analytics/ScoreBadge";
import GameAvatar from "@/components/ui/GameAvatar";
import { createServerClient } from "@/lib/supabase";
import DropRateGameSection from "./DropRateGameSection";

export const revalidate = 300;

export const metadata = {
  title: "Drop Rate Database — Verified Loot Box Probabilities",
  description:
    "The most comprehensive database of verified drop rates and loot box probabilities across all major games. Know your odds before you spend.",
};

const SOURCE_META = {
  official: { label: "Official", icon: "CheckCircle", color: "text-success-600", bg: "bg-emerald-50" },
  community_verified: { label: "Community Verified", icon: "HelpCircle", color: "text-brand-600", bg: "bg-blue-50" },
  user_reported: { label: "User Reported", icon: "AlertTriangle", color: "text-warning-600", bg: "bg-amber-50" },
};

function getSystemLabel(type: string | null): string {
  const map: Record<string, string> = {
    gacha: "Gacha System",
    loot_box: "Loot Box",
    card_pack: "Card Packs",
    battle_pass: "Battle Pass",
    cosmetic_shop: "Cosmetic Shop",
  };
  return type ? map[type] || type : "";
}

function getSystemColor(type: string | null): string {
  const map: Record<string, string> = {
    gacha: "bg-rose-100 text-rose-700",
    loot_box: "bg-amber-100 text-amber-700",
    card_pack: "bg-violet-100 text-violet-700",
    battle_pass: "bg-emerald-100 text-emerald-700",
    cosmetic_shop: "bg-sky-100 text-sky-700",
  };
  return type ? map[type] || "bg-gray-100 text-gray-700" : "bg-gray-100 text-gray-700";
}

function getSystemBarGradient(type: string | null): string {
  const map: Record<string, string> = {
    gacha: "from-rose-500 to-pink-500",
    loot_box: "from-amber-500 to-orange-500",
    card_pack: "from-violet-500 to-purple-500",
    battle_pass: "from-emerald-500 to-teal-500",
    cosmetic_shop: "from-sky-500 to-cyan-500",
  };
  return type ? map[type] || "from-gray-400 to-gray-500" : "from-gray-400 to-gray-500";
}

interface GameWithRates {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  lootboxes_score: number | null;
  loot_system_type: string | null;
  items: {
    item_name: string;
    rarity: string;
    drop_rate_pct: number;
    source: "official" | "community_verified" | "user_reported";
  }[];
}

async function getGamesWithDropRates(): Promise<GameWithRates[]> {
  const supabase = createServerClient();

  const { data: dropRates, error } = await supabase
    .from("drop_rates")
    .select(`
      item_name,
      rarity,
      drop_rate_pct,
      source,
      game_id,
      games!inner (
        id,
        title,
        slug,
        cover_image,
        lootboxes_score,
        loot_system_type
      )
    `)
    .order("drop_rate_pct", { ascending: true });

  if (error || !dropRates || dropRates.length === 0) return [];

  const gameMap = new Map<string, GameWithRates>();
  for (const dr of dropRates) {
    const game = (dr as any).games;
    if (!game) continue;

    if (!gameMap.has(game.id)) {
      gameMap.set(game.id, {
        id: game.id,
        title: game.title,
        slug: game.slug,
        cover_image: game.cover_image,
        lootboxes_score: game.lootboxes_score,
        loot_system_type: game.loot_system_type,
        items: [],
      });
    }
    gameMap.get(game.id)!.items.push({
      item_name: dr.item_name,
      rarity: dr.rarity,
      drop_rate_pct: dr.drop_rate_pct,
      source: dr.source as any,
    });
  }

  const games = Array.from(gameMap.values());
  games.sort((a, b) => (a.lootboxes_score || 10) - (b.lootboxes_score || 10));
  return games;
}

export default async function DropRatesPage() {
  const games = await getGamesWithDropRates();
  const totalGames = games.length;
  const totalRates = games.reduce((acc, g) => acc + g.items.length, 0);
  const officialCount = games.reduce(
    (acc, g) => acc + g.items.filter((i) => i.source === "official").length,
    0
  );

  return (
    <div className="min-h-screen bg-white pb-12">
      {/* ── Hero section with side accent bar ── */}
      <section className="border-b border-gray-100">
        <div className="container-main py-10">
          <div className="flex rounded-2xl overflow-hidden border border-gray-200 shadow-md">
            <div className="w-1.5 bg-gradient-to-b from-brand-500 via-purple-500 to-rose-500 flex-shrink-0" />
            <div className="p-8 flex-1 bg-gradient-to-r from-gray-50/50 to-white">
              <span className="text-[11px] font-bold text-brand-600 uppercase tracking-widest">
                Verified Data
              </span>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mt-2">
                Drop Rate Database
              </h1>
              <p className="text-gray-500 mt-3 max-w-2xl leading-relaxed">
                The most comprehensive database of verified drop rates and loot box
                probabilities across all major games. Know your odds before you spend.
              </p>

              {/* Stats row */}
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
                  <BarChart3 className="h-4 w-4 text-brand-500" />
                  <span className="text-xl font-bold text-gray-900">{totalGames}</span>
                  <span className="text-sm text-gray-500">Games</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <span className="text-xl font-bold text-gray-900">{totalRates}</span>
                  <span className="text-sm text-gray-500">Drop Rates</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-xl font-bold text-gray-900">{officialCount}</span>
                  <span className="text-sm text-gray-500">Officially Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-main mt-8">
        {/* ── Methodology callout with accent bar ── */}
        <div className="flex rounded-xl overflow-hidden border border-brand-200 shadow-sm">
          <div className="w-1.5 bg-gradient-to-b from-brand-400 to-blue-500 flex-shrink-0" />
          <div className="p-5 flex-1 bg-brand-50/50">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" />
              <div>
                <h3 className="text-sm font-serif font-bold text-brand-800">
                  How We Verify Drop Rates
                </h3>
                <p className="mt-1 text-sm text-brand-700 leading-relaxed">
                  We rank data in three tiers:{" "}
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <CheckCircle className="inline h-3.5 w-3.5 text-emerald-600" /> Official
                  </span>{" "}
                  (disclosed by the developer per legal requirements),{" "}
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <HelpCircle className="inline h-3.5 w-3.5 text-brand-600" /> Community Verified
                  </span>{" "}
                  (large-sample empirical testing), and{" "}
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <AlertTriangle className="inline h-3.5 w-3.5 text-amber-600" /> User Reported
                  </span>{" "}
                  (aggregated submissions). Source is shown with every rate.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Source legend ── */}
        <div className="mt-4 flex flex-wrap gap-3">
          {Object.entries(SOURCE_META).map(([key, meta]) => (
            <div
              key={key}
              className={`flex items-center gap-1.5 rounded-full ${meta.bg} px-3 py-1.5 text-xs font-medium ${meta.color}`}
            >
              {key === "official" && <CheckCircle className="h-3.5 w-3.5" />}
              {key === "community_verified" && <HelpCircle className="h-3.5 w-3.5" />}
              {key === "user_reported" && <AlertTriangle className="h-3.5 w-3.5" />}
              {meta.label}
            </div>
          ))}
        </div>

        {/* ── Game sections ── */}
        {games.length === 0 ? (
          <div className="mt-16 text-center">
            <Zap className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-gray-500">No drop rate data yet. Check back soon!</p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {games.map((game, idx) => (
              <DropRateGameSection
                key={game.slug}
                game={game}
                defaultOpen={idx < 2}
                systemLabel={getSystemLabel(game.loot_system_type)}
                systemColor={getSystemColor(game.loot_system_type)}
                barGradient={getSystemBarGradient(game.loot_system_type)}
              />
            ))}
          </div>
        )}

        {/* ── CTA ── */}
        <div className="mt-12 flex rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <div className="w-1.5 bg-gradient-to-b from-brand-500 to-purple-500 flex-shrink-0" />
          <div className="p-6 flex-1 bg-gradient-to-r from-gray-50 to-white text-center">
            <Sparkles className="mx-auto h-6 w-6 text-brand-600" />
            <h3 className="mt-2 text-lg font-serif font-bold text-gray-900">
              Know drop rates we&apos;re missing?
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Help us build the most accurate database by submitting your data.
            </p>
            <button className="btn-primary mt-4">Submit Drop Rates</button>
          </div>
        </div>
      </div>
    </div>
  );
}
