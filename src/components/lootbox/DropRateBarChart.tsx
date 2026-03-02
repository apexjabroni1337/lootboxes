"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DropRateItem {
  item_name: string;
  rarity: string;
  drop_rate_pct: number;
  source: string;
}

function getRarityColor(rarity: string): string {
  const r = rarity.toLowerCase();
  if (
    r.includes("heirloom") ||
    r.includes("mythic") ||
    r.includes("icon") ||
    r.includes("crown") ||
    r.includes("exceedingly")
  )
    return "#f59e0b";
  if (
    r.includes("covert") ||
    r.includes("legendary") ||
    r.includes("5-star") ||
    r.includes("s-rank") ||
    r.includes("secret")
  )
    return "#ef4444";
  if (
    r.includes("epic") ||
    r.includes("classified") ||
    r.includes("import") ||
    r.includes("full art") ||
    r.includes("premium") ||
    r.includes("exotic") ||
    r.includes("black market")
  )
    return "#a855f7";
  if (
    r.includes("rare") ||
    r.includes("restricted") ||
    r.includes("4-star") ||
    r.includes("a-rank") ||
    r.includes("star rare") ||
    r.includes("deluxe") ||
    r.includes("very rare")
  )
    return "#3b82f6";
  if (r.includes("pity") || r.includes("effective")) return "#10b981";
  if (r.includes("stattrak") || r.includes("painted") || r.includes("certified"))
    return "#f97316";
  return "#6b7280";
}

export default function DropRateBarChart({ items }: { items: DropRateItem[] }) {
  // Filter out pity/effective items for the chart — they skew the scale
  const chartItems = items
    .filter(
      (i) =>
        !i.rarity.toLowerCase().includes("pity") &&
        !i.rarity.toLowerCase().includes("effective")
    )
    .sort((a, b) => a.drop_rate_pct - b.drop_rate_pct);

  if (chartItems.length === 0) return null;

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartItems}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            type="number"
            domain={[0, "auto"]}
            tickFormatter={(v: number) => `${v}%`}
            fontSize={12}
          />
          <YAxis
            type="category"
            dataKey="rarity"
            width={140}
            fontSize={12}
            tick={{ fill: "#374151" }}
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Drop Rate"]}
            labelFormatter={(label: string) => label}
            contentStyle={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          />
          <Bar dataKey="drop_rate_pct" radius={[0, 4, 4, 0]} maxBarSize={28}>
            {chartItems.map((item, index) => (
              <Cell key={index} fill={getRarityColor(item.rarity)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
