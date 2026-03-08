import Link from "next/link";
import {
  Wallet,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Box,
  Layers,
  ShoppingBag,
  Shield,
} from "lucide-react";
import { SPENDING_GUIDES } from "@/data/spending-guides";

const SYSTEM_ICONS: Record<string, typeof Sparkles> = {
  gacha: Sparkles,
  loot_box: Box,
  card_pack: Layers,
  cosmetic_shop: ShoppingBag,
  battle_pass: Shield,
};

const SYSTEM_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  gacha: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  loot_box: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  card_pack: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  cosmetic_shop: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  battle_pass: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

const SYSTEM_LABELS: Record<string, string> = {
  gacha: "Gacha",
  loot_box: "Loot Box",
  card_pack: "Card Pack",
  cosmetic_shop: "Cosmetic Shop",
  battle_pass: "Battle Pass",
};

export default function SpendingGuidesHub() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-slate-900 via-amber-900 to-slate-800 py-16">
        <div className="container-main">
          <Link
            href="/lootbox"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-200 mb-4"
          >
            <ChevronLeft className="h-4 w-4" /> Loot Boxes
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 backdrop-blur-sm">
              <Wallet className="h-6 w-6 text-amber-400" />
            </div>
            <div className="inline-flex rounded-full bg-amber-500/20 backdrop-blur-sm px-4 py-1 text-sm font-semibold text-amber-300">
              {SPENDING_GUIDES.length} Guides
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Spending Guides
          </h1>
          <p className="mt-2 text-lg text-amber-300 font-semibold">
            Smart budgets for every game
          </p>
          <p className="mt-4 max-w-2xl text-gray-300 leading-relaxed">
            Expert spending advice for the biggest free-to-play and loot box
            games. We break down what&apos;s worth buying at every budget level
            — from completely free to high-spender — so you get the most value
            for your money.
          </p>
        </div>
      </section>

      {/* Guide grid */}
      <section className="py-8">
        <div className="container-main">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SPENDING_GUIDES.map((guide) => {
              const colors = SYSTEM_COLORS[guide.systemType] || SYSTEM_COLORS.cosmetic_shop;
              const Icon = SYSTEM_ICONS[guide.systemType] || ShoppingBag;
              return (
                <Link
                  key={guide.gameSlug}
                  href={`/lootbox/spending-guides/${guide.gameSlug}`}
                  className="group rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all hover:border-amber-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                      {guide.gameName}
                    </h2>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-amber-500 transition-colors" />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${colors.bg} ${colors.text}`}
                    >
                      <Icon className="h-3 w-3" />
                      {SYSTEM_LABELS[guide.systemType] || guide.systemType}
                    </span>
                    <span className="text-xs text-gray-400">
                      F2P: {guide.freeToPlay.rating}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>
                      <span className="font-semibold text-gray-700">Low Spend:</span>{" "}
                      {guide.lowSpend.budget}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Moderate:</span>{" "}
                      {guide.moderate.budget}
                    </p>
                  </div>

                  <p className="mt-3 text-[11px] text-gray-400">
                    Updated {guide.updatedAt}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50 py-10">
        <div className="container-main text-center">
          <h2 className="text-xl font-bold text-gray-900">
            Want to check if a game is worth your money?
          </h2>
          <p className="text-sm text-gray-600 mt-2 mb-6 max-w-md mx-auto">
            Use our value calculator for a quick score-based verdict on any game
            in our database.
          </p>
          <Link
            href="/lootbox/value-calculator"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white hover:bg-amber-700 transition-colors"
          >
            Value Calculator <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
