"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { STORES } from "@/lib/types";

interface PricePoint {
  date: string;
  [store: string]: number | string;
}

interface PriceChartProps {
  data: PricePoint[];
}

const STORE_COLORS: Record<string, string> = {
  steam: "#1b2838",
  humble: "#cc2929",
  gog: "#86328a",
  epic: "#2a2a2a",
  fanatical: "#ff6600",
  gmg: "#97d700",
  itch: "#fa5c5c",
};

function formatMonth(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
      <p className="mb-1.5 text-xs font-medium text-gray-500">
        {new Date(label).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </p>
      {payload
        .sort((a: any, b: any) => a.value - b.value)
        .map((entry: any) => (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {STORES[entry.dataKey]?.name || entry.dataKey}
            </span>
            <span className="font-semibold text-gray-900">
              ${entry.value.toFixed(2)}
            </span>
          </div>
        ))}
    </div>
  );
}

export default function PriceChart({ data }: PriceChartProps) {
  // Detect which stores are present in the data
  const stores = Object.keys(data[0] || {}).filter((k) => k !== "date");

  const [visibleStores, setVisibleStores] = useState<Set<string>>(
    new Set(stores)
  );

  const toggleStore = (store: string) => {
    setVisibleStores((prev) => {
      const next = new Set(prev);
      if (next.has(store)) {
        if (next.size > 1) next.delete(store); // Keep at least one
      } else {
        next.add(store);
      }
      return next;
    });
  };

  // Calculate price range for Y axis
  const allPrices = data.flatMap((d) =>
    stores
      .filter((s) => visibleStores.has(s))
      .map((s) => d[s] as number)
      .filter(Boolean)
  );
  const minPrice = Math.floor(Math.min(...allPrices) / 5) * 5;
  const maxPrice = Math.ceil(Math.max(...allPrices) / 5) * 5 + 5;

  return (
    <div>
      {/* Store toggles */}
      <div className="mb-4 flex flex-wrap gap-2">
        {stores.map((store) => {
          const active = visibleStores.has(store);
          const color = STORE_COLORS[store] || "#888";
          return (
            <button
              key={store}
              onClick={() => toggleStore(store)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                active
                  ? "border-transparent text-white"
                  : "border-gray-200 bg-white text-gray-400"
              }`}
              style={active ? { backgroundColor: color } : {}}
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  backgroundColor: color,
                  opacity: active ? 1 : 0.3,
                }}
              />
              {STORES[store]?.name || store}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tickFormatter={formatMonth}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
          />
          <YAxis
            domain={[minPrice, maxPrice]}
            tickFormatter={(v) => `$${v}`}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          {stores.map((store) =>
            visibleStores.has(store) ? (
              <Line
                key={store}
                type="monotone"
                dataKey={store}
                stroke={STORE_COLORS[store] || "#888"}
                strokeWidth={2}
                dot={{ r: 3, fill: STORE_COLORS[store] || "#888" }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            ) : null
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
