"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import ScoreBadge from "@/components/analytics/ScoreBadge";
import GameAvatar from "@/components/ui/GameAvatar";

/* ── Rarity color mapping ── */

function getRarityColor(rarity: string): string {
  const lower = rarity.toLowerCase();
  // Gold / ultra-rare tier
  if (
    lower.includes("heirloom") || lower.includes("mythic") || lower.includes("icon") ||
    lower.includes("crown") || lower.includes("exceedingly") || lower.includes("black market") ||
    lower.includes("dark matter") || lower.includes("golden ticket") || lower.includes("champion") ||
    lower.includes("ultra") || lower.includes("ultimate")
  )
    return "bg-amber-100 text-amber-800 border border-amber-200";
  // Red / rare tier
  if (
    lower.includes("covert") || lower.includes("5-star") || lower.includes("s-rank") ||
    lower.includes("legendary") || lower.includes("exotic") || lower.includes("secret") ||
    lower.includes("series 5") || lower.includes("ssr") || lower.includes("galaxy opal") ||
    lower.includes("golden legendary")
  )
    return "bg-red-100 text-red-800 border border-red-200";
  // Purple / epic tier
  if (
    lower.includes("classified") || lower.includes("4-star") || lower.includes("a-rank") ||
    lower.includes("epic") || lower.includes("elite") || lower.includes("import") ||
    lower.includes("full art") || lower.includes("series 4") || lower.includes("premium") ||
    lower.includes("exclusive") || lower.includes("pink diamond") || lower.includes("diamond") ||
    lower.includes("sr") || lower.includes("star power")
  )
    return "bg-purple-100 text-purple-800 border border-purple-200";
  // Blue / uncommon tier
  if (
    lower.includes("restricted") || lower.includes("very rare") || lower.includes("rare") ||
    lower.includes("star rare") || lower.includes("deluxe") || lower.includes("variant") ||
    lower.includes("amethyst") || lower.includes("super rare") || lower.includes("gadget")
  )
    return "bg-blue-100 text-blue-800 border border-blue-200";
  // Green / common tier
  if (
    lower.includes("mil-spec") || lower.includes("3-star") || lower.includes("b-rank") ||
    lower.includes("common") || lower.includes("uncommon") || lower.includes("select") ||
    lower.includes("r ")
  )
    return "bg-gray-100 text-gray-700 border border-gray-200";
  // Special
  if (lower.includes("stattrak") || lower.includes("painted") || lower.includes("certified"))
    return "bg-orange-100 text-orange-800 border border-orange-200";
  if (lower.includes("pity"))
    return "bg-emerald-100 text-emerald-800 border border-emerald-200";
  if (lower.includes("effective"))
    return "bg-rose-50 text-rose-700 border border-rose-200";
  return "bg-gray-100 text-gray-700 border border-gray-200";
}

const SOURCE_ICONS = {
  official: { Icon: CheckCircle, label: "Official", color: "text-emerald-600" },
  community_verified: { Icon: HelpCircle, label: "Community", color: "text-brand-600" },
  user_reported: { Icon: AlertTriangle, label: "User Reported", color: "text-amber-600" },
};

/* ── Drop rate visual bar ── */
function RateBar({ pct }: { pct: number }) {
  // Log scale for visual representation (low rates still visible)
  const width = pct >= 100 ? 100 : Math.max(2, Math.min(100, Math.log10(pct + 1) * 50));
  const color =
    pct >= 50 ? "bg-emerald-400" :
    pct >= 10 ? "bg-blue-400" :
    pct >= 1 ? "bg-purple-400" :
    pct >= 0.1 ? "bg-amber-400" :
    "bg-red-400";

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
      </div>
      <span className="text-sm font-bold text-gray-900 tabular-nums">
        {pct >= 100
          ? "Guaranteed"
          : pct < 0.01
            ? `${pct.toFixed(4)}%`
            : pct < 0.1
              ? `${pct.toFixed(3)}%`
              : pct < 1
                ? `${pct.toFixed(2)}%`
                : `${pct.toFixed(1)}%`}
      </span>
    </div>
  );
}

interface DropRateGameSectionProps {
  game: {
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
  };
  defaultOpen: boolean;
  systemLabel: string;
  systemColor: string;
  barGradient: string;
}

export default function DropRateGameSection({
  game,
  defaultOpen,
  systemLabel,
  systemColor,
  barGradient,
}: DropRateGameSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Compute summary stats for the collapsed view
  const lowestRate = Math.min(...game.items.filter(i => !i.rarity.toLowerCase().includes("pity") && !i.rarity.toLowerCase().includes("effective")).map(i => i.drop_rate_pct));
  const highestRate = Math.max(...game.items.filter(i => !i.rarity.toLowerCase().includes("pity") && !i.rarity.toLowerCase().includes("effective")).map(i => i.drop_rate_pct));
  const hasPity = game.items.some(i => i.rarity.toLowerCase().includes("pity"));
  const sourceType = game.items[0]?.source || "user_reported";
  const sourceMeta = SOURCE_ICONS[sourceType] || SOURCE_ICONS.user_reported;

  return (
    <div className="flex rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
      {/* Left color bar */}
      <div className={`w-1.5 bg-gradient-to-b ${barGradient} flex-shrink-0`} />

      <div className="flex-1">
        {/* ── Clickable header ── */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-5 py-4 bg-gray-50/50 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Game image */}
            <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
              {game.cover_image ? (
                <img
                  src={game.cover_image}
                  alt={game.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <GameAvatar gameName={game.title} size="sm" aspectRatio="square" />
              )}
            </div>

            {/* Title + badges */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-gray-900 truncate">
                  {game.title}
                </h2>
                {game.lootboxes_score && (
                  <ScoreBadge score={game.lootboxes_score} size="sm" />
                )}
                {systemLabel && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${systemColor}`}>
                    {systemLabel}
                  </span>
                )}
              </div>
              {/* Collapsed summary line */}
              {!isOpen && (
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                  <span>
                    {game.items.length} rates
                  </span>
                  <span className="text-gray-300">•</span>
                  <span>
                    Rarest: <span className="font-semibold text-gray-700">
                      {lowestRate < 0.01 ? `${lowestRate.toFixed(4)}%` : lowestRate < 1 ? `${lowestRate.toFixed(2)}%` : `${lowestRate.toFixed(1)}%`}
                    </span>
                  </span>
                  {hasPity && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-emerald-600 font-medium">Has Pity</span>
                    </>
                  )}
                  <span className="text-gray-300">•</span>
                  <span className={`flex items-center gap-0.5 ${sourceMeta.color}`}>
                    <sourceMeta.Icon className="h-3 w-3" />
                    {sourceMeta.label}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 ml-3">
            <Link
              href={`/games/${game.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="hidden sm:flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg"
            >
              View game <ChevronRight className="h-3 w-3" />
            </Link>
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {/* ── Collapsible content ── */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-gray-100">
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/30">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Item
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Rarity
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Drop Rate
                    </th>
                    <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      ~Avg. Opens
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {game.items.map((item, i) => {
                    const src = SOURCE_ICONS[item.source] || SOURCE_ICONS.user_reported;
                    const isPity = item.rarity.toLowerCase().includes("pity");
                    const isEffective = item.rarity.toLowerCase().includes("effective");
                    const avgOpens =
                      item.drop_rate_pct > 0 && item.drop_rate_pct < 100
                        ? Math.ceil(100 / item.drop_rate_pct)
                        : null;

                    return (
                      <tr
                        key={i}
                        className={`transition-colors hover:bg-gray-50/70 ${
                          isPity ? "bg-emerald-50/30" : ""
                        } ${isEffective ? "bg-rose-50/20" : ""}`}
                      >
                        <td className="px-5 py-3 text-sm font-medium text-gray-900">
                          {item.item_name}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getRarityColor(item.rarity)}`}
                          >
                            {item.rarity}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <RateBar pct={item.drop_rate_pct} />
                        </td>
                        <td className="px-5 py-3 text-right text-sm text-gray-500 tabular-nums">
                          {avgOpens ? (
                            <span>~{avgOpens.toLocaleString()}</span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`flex items-center gap-1 text-xs font-medium ${src.color}`}>
                            <src.Icon className="h-3.5 w-3.5" />
                            {src.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card layout */}
            <div className="sm:hidden divide-y divide-gray-100">
              {game.items.map((item, i) => {
                const src = SOURCE_ICONS[item.source] || SOURCE_ICONS.user_reported;
                const isPity = item.rarity.toLowerCase().includes("pity");
                const avgOpens =
                  item.drop_rate_pct > 0 && item.drop_rate_pct < 100
                    ? Math.ceil(100 / item.drop_rate_pct)
                    : null;

                return (
                  <div
                    key={i}
                    className={`px-4 py-3 ${isPity ? "bg-emerald-50/30" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.item_name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${getRarityColor(item.rarity)}`}
                          >
                            {item.rarity}
                          </span>
                          <span className={`flex items-center gap-0.5 text-[10px] ${src.color}`}>
                            <src.Icon className="h-3 w-3" />
                            {src.label}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-900 tabular-nums">
                          {item.drop_rate_pct >= 100
                            ? "Guaranteed"
                            : item.drop_rate_pct < 0.1
                              ? `${item.drop_rate_pct.toFixed(3)}%`
                              : item.drop_rate_pct < 1
                                ? `${item.drop_rate_pct.toFixed(2)}%`
                                : `${item.drop_rate_pct.toFixed(1)}%`}
                        </p>
                        {avgOpens && (
                          <p className="text-[10px] text-gray-400">
                            ~{avgOpens.toLocaleString()} opens
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
