"use client";

import { useState } from "react";
import { DollarSign, Target, Zap, TrendingDown } from "lucide-react";

interface CostCalculatorProps {
  costPerPull: number | null;
  costToPity: number | null;
  pullsToPity: number | null;
  hasPity: boolean;
  currencyName: string | null;
  currencyPerDollar: number | null;
  topRarityRate: number; // best drop rate % for the rarest tier
  topRarityName: string;
}

export default function CostCalculator({
  costPerPull,
  costToPity,
  pullsToPity,
  hasPity,
  currencyName,
  currencyPerDollar,
  topRarityRate,
  topRarityName,
}: CostCalculatorProps) {
  const [pulls, setPulls] = useState(10);

  const avgOpensNeeded = topRarityRate > 0 ? Math.ceil(100 / topRarityRate) : null;
  const expectedCostForRare =
    costPerPull && avgOpensNeeded ? costPerPull * avgOpensNeeded : null;
  const totalCostForPulls = costPerPull ? costPerPull * pulls : null;
  const chanceInPulls =
    topRarityRate > 0
      ? (1 - Math.pow(1 - topRarityRate / 100, pulls)) * 100
      : null;

  return (
    <div className="space-y-4">
      {/* Key stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {costPerPull !== null && (
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                Cost Per Pull
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${costPerPull.toFixed(2)}
            </p>
            {currencyName && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Using {currencyName}
              </p>
            )}
          </div>
        )}

        {hasPity && costToPity !== null && (
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border border-amber-100">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                Cost to Pity
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${costToPity.toFixed(0)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Guaranteed at {pullsToPity} pulls
            </p>
          </div>
        )}

        {expectedCostForRare !== null && (
          <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-4 border border-red-100">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-red-600 uppercase tracking-wide">
                Expected Cost
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ~${expectedCostForRare.toFixed(0)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              For one {topRarityName}
            </p>
          </div>
        )}

        {avgOpensNeeded !== null && (
          <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                Avg Opens Needed
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ~{avgOpensNeeded.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              For {topRarityName} ({topRarityRate}%)
            </p>
          </div>
        )}
      </div>

      {/* Interactive calculator */}
      {costPerPull !== null && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Spending Calculator
          </h4>
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
              Number of pulls:
            </label>
            <input
              type="range"
              min={1}
              max={200}
              value={pulls}
              onChange={(e) => setPulls(Number(e.target.value))}
              className="flex-1 accent-blue-600"
            />
            <input
              type="number"
              min={1}
              max={999}
              value={pulls}
              onChange={(e) =>
                setPulls(Math.max(1, Math.min(999, Number(e.target.value))))
              }
              className="w-20 rounded-lg border border-gray-300 dark:border-gray-600 px-2 py-1 text-center text-sm font-semibold"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Total Cost
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${totalCostForPulls?.toFixed(2)}
              </p>
            </div>
            {chanceInPulls !== null && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Chance of {topRarityName}
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {chanceInPulls.toFixed(1)}%
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
