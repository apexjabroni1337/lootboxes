"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";

// Types shared with server component
interface LootboxContent {
  cost_per_pull: number | null;
  has_pity_system: boolean;
  score_transparency: number;
  score_value: number;
  score_fairness: number;
  score_player_control: number;
  score_compliance: number;
  score_age_gating: number;
  score_p2w_impact: number;
  score_psych_design: number;
}

interface Game {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  screenshot_image: string | null;
  lootboxes_score: number;
  loot_system_type: string;
  lootbox_content: LootboxContent | LootboxContent[];
}

interface RankedRow {
  game: Game;
  score: number;
  rank: number;
  protectionScore: number;
  valueScore: number;
  p2wScore: number;
  hasPity: boolean;
  costPerPull: number | null;
}

interface TierInfo {
  label: string;
  emoji: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  scoreRange: string;
}

type SortKey = "rank" | "name" | "overall" | "protection" | "value" | "p2w" | "pity" | "cost";
type SortDir = "asc" | "desc";

function systemLabel(type: string) {
  const labels: Record<string, { label: string; color: string }> = {
    gacha: { label: "Gacha", color: "bg-purple-100 text-purple-800" },
    loot_box: { label: "Loot Box", color: "bg-red-100 text-red-800" },
    card_pack: { label: "Card Pack", color: "bg-blue-100 text-blue-800" },
    battle_pass: { label: "Battle Pass", color: "bg-amber-100 text-amber-800" },
    cosmetic_shop: { label: "Cosmetic Shop", color: "bg-emerald-100 text-emerald-800" },
  };
  return labels[type] || { label: type.charAt(0).toUpperCase() + type.slice(1), color: "bg-gray-100 text-gray-800" };
}

function scoreColor(score: number): string {
  if (score >= 7) return "bg-emerald-100 text-emerald-800";
  if (score >= 5) return "bg-blue-100 text-blue-800";
  if (score >= 3) return "bg-amber-100 text-amber-800";
  return "bg-rose-100 text-rose-800";
}

function getTier(score: number): TierInfo {
  if (score >= 8) return { label: "TIER S — Excellent", emoji: "\u{1F3C6}", bgClass: "bg-emerald-50 dark:bg-emerald-950/20", textClass: "text-emerald-700 dark:text-emerald-400", borderClass: "border-emerald-200 dark:border-emerald-800", scoreRange: "8.0+" };
  if (score >= 7) return { label: "TIER A — Good", emoji: "\u2B50", bgClass: "bg-emerald-50 dark:bg-emerald-950/20", textClass: "text-emerald-600 dark:text-emerald-400", borderClass: "border-emerald-200 dark:border-emerald-800", scoreRange: "7.0-7.9" };
  if (score >= 5) return { label: "TIER B — Average", emoji: "\u{1F3AF}", bgClass: "bg-amber-50 dark:bg-amber-950/20", textClass: "text-amber-700 dark:text-amber-400", borderClass: "border-amber-200 dark:border-amber-800", scoreRange: "5.0-6.9" };
  if (score >= 3) return { label: "TIER C — Below Average", emoji: "\u26A0\uFE0F", bgClass: "bg-orange-50 dark:bg-orange-950/20", textClass: "text-orange-700 dark:text-orange-400", borderClass: "border-orange-200 dark:border-orange-800", scoreRange: "3.0-4.9" };
  return { label: "TIER D — Poor", emoji: "\u{1F480}", bgClass: "bg-rose-50 dark:bg-rose-950/20", textClass: "text-rose-700 dark:text-rose-400", borderClass: "border-rose-200 dark:border-rose-800", scoreRange: "0-2.9" };
}

function getRankBadge(rank: number) {
  if (rank === 1) return { bgClass: "bg-yellow-100", textClass: "text-yellow-800" };
  if (rank === 2) return { bgClass: "bg-gray-200", textClass: "text-gray-800" };
  if (rank === 3) return { bgClass: "bg-orange-100", textClass: "text-orange-800" };
  return { bgClass: "bg-gray-100", textClass: "text-gray-700" };
}

function GameThumb({ game }: { game: Game }) {
  return (
    <div className="w-8 h-11 flex-shrink-0">
      <GameAvatar gameName={game.title} src={game.cover_image} aspectRatio="portrait" size="sm" />
    </div>
  );
}

function SortIcon({ columnKey, sortKey, sortDir }: { columnKey: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== columnKey) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
  return sortDir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
}

export default function RankingsTableClient({ rows }: { rows: RankedRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [collapsedTiers, setCollapsedTiers] = useState<Set<string>>(new Set());

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "rank" || key === "name" ? "asc" : "desc");
    }
  };

  const toggleTier = (tierLabel: string) => {
    setCollapsedTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tierLabel)) next.delete(tierLabel);
      else next.add(tierLabel);
      return next;
    });
  };

  const sorted = useMemo(() => {
    const arr = [...rows];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      switch (sortKey) {
        case "rank": return (a.rank - b.rank) * dir;
        case "name": return a.game.title.localeCompare(b.game.title) * dir;
        case "overall": return (a.score - b.score) * dir;
        case "protection": return (a.protectionScore - b.protectionScore) * dir;
        case "value": return (a.valueScore - b.valueScore) * dir;
        case "p2w": return (a.p2wScore - b.p2wScore) * dir;
        case "pity": return ((a.hasPity ? 1 : 0) - (b.hasPity ? 1 : 0)) * dir;
        case "cost": return ((a.costPerPull ?? 999) - (b.costPerPull ?? 999)) * dir;
        default: return 0;
      }
    });
    return arr;
  }, [rows, sortKey, sortDir]);

  // Group rows by tier
  const tieredRows = useMemo(() => {
    const groups: { tier: TierInfo; rows: RankedRow[] }[] = [];
    let currentTier: TierInfo | null = null;
    let currentGroup: RankedRow[] = [];

    for (const row of sorted) {
      const tier = getTier(row.score);
      if (!currentTier || tier.label !== currentTier.label) {
        if (currentTier && currentGroup.length > 0) {
          groups.push({ tier: currentTier, rows: currentGroup });
        }
        currentTier = tier;
        currentGroup = [row];
      } else {
        currentGroup.push(row);
      }
    }
    if (currentTier && currentGroup.length > 0) {
      groups.push({ tier: currentTier, rows: currentGroup });
    }
    return groups;
  }, [sorted]);

  const thBase = "px-4 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors";

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden overflow-x-auto dark:border-gray-700 dark:bg-gray-900">
      <table className="w-full min-w-full">
        <thead className="bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <tr>
            <th className={`${thBase} text-left sticky left-0 bg-gray-50 dark:bg-gray-800 w-8`} onClick={() => handleSort("rank")}>
              <span className="flex items-center gap-1"># <SortIcon columnKey="rank" sortKey={sortKey} sortDir={sortDir} /></span>
            </th>
            <th className={`${thBase} text-left sticky left-12 bg-gray-50 dark:bg-gray-800 w-48`} onClick={() => handleSort("name")}>
              <span className="flex items-center gap-1">Game <SortIcon columnKey="name" sortKey={sortKey} sortDir={sortDir} /></span>
            </th>
            <th className={`${thBase} text-left w-32`}>Type</th>
            <th className={`${thBase} text-center w-20`} onClick={() => handleSort("overall")}>
              <span className="flex items-center justify-center gap-1">Overall <SortIcon columnKey="overall" sortKey={sortKey} sortDir={sortDir} /></span>
            </th>
            <th className={`${thBase} text-center w-20`} onClick={() => handleSort("protection")}>
              <span className="flex items-center justify-center gap-1">Protection <SortIcon columnKey="protection" sortKey={sortKey} sortDir={sortDir} /></span>
            </th>
            <th className={`${thBase} text-center w-20`} onClick={() => handleSort("value")}>
              <span className="flex items-center justify-center gap-1">Value <SortIcon columnKey="value" sortKey={sortKey} sortDir={sortDir} /></span>
            </th>
            <th className={`${thBase} text-center w-20`} onClick={() => handleSort("p2w")}>
              <span className="flex items-center justify-center gap-1">P2W <SortIcon columnKey="p2w" sortKey={sortKey} sortDir={sortDir} /></span>
            </th>
            <th className={`${thBase} text-center w-16`} onClick={() => handleSort("pity")}>
              <span className="flex items-center justify-center gap-1">Pity <SortIcon columnKey="pity" sortKey={sortKey} sortDir={sortDir} /></span>
            </th>
            <th className={`${thBase} text-center w-20`} onClick={() => handleSort("cost")}>
              <span className="flex items-center justify-center gap-1">$/Pull <SortIcon columnKey="cost" sortKey={sortKey} sortDir={sortDir} /></span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tieredRows.map(({ tier, rows: tierRows }) => {
            const isCollapsed = collapsedTiers.has(tier.label);
            return (
              <React.Fragment key={tier.label}>
                <tr
                  className="cursor-pointer hover:brightness-95 transition-all"
                  onClick={() => toggleTier(tier.label)}
                >
                  <td colSpan={9} className={`px-4 py-2.5 ${tier.bgClass} border-y ${tier.borderClass}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold uppercase tracking-wider ${tier.textClass}`}>
                        {tier.emoji} {tier.label} ({tier.scoreRange})
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                          {tierRows.length} game{tierRows.length !== 1 ? "s" : ""}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCollapsed ? "-rotate-90" : ""}`} />
                      </div>
                    </div>
                  </td>
                </tr>
                {!isCollapsed &&
                  tierRows.map((item) => {
                    const rankBadge = getRankBadge(item.rank);
                    return (
                      <tr key={item.game.id} className="hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                        <td className={`px-4 py-3 text-sm font-medium sticky left-0 bg-white dark:bg-gray-900 ${rankBadge.bgClass}`}>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                            <span className={rankBadge.textClass}>{item.rank}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm sticky left-12 bg-white dark:bg-gray-900">
                          <Link
                            href={`/lootbox/${item.game.slug}`}
                            className="flex items-center gap-2 font-medium text-gray-900 dark:text-white hover:text-[#0074c5] transition-colors"
                          >
                            <GameThumb game={item.game} />
                            {item.game.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${systemLabel(item.game.loot_system_type).color}`}>
                            {systemLabel(item.game.loot_system_type).label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-base font-bold text-gray-900 dark:text-white">{item.score}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold inline-block ${scoreColor(item.protectionScore)}`}>
                            {item.protectionScore}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold inline-block ${scoreColor(item.valueScore)}`}>
                            {item.valueScore}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold inline-block ${scoreColor(item.p2wScore)}`}>
                            {item.p2wScore}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-sm">
                          <span className="text-gray-700 dark:text-gray-300">{item.hasPity ? "\u2713" : "\u2014"}</span>
                        </td>
                        <td className="px-4 py-3 text-center text-sm">
                          <span className="text-gray-700 dark:text-gray-300">
                            {item.costPerPull ? `$${item.costPerPull.toFixed(2)}` : "\u2014"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
