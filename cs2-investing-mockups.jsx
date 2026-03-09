import { useState } from "react";

// Simplified icons as SVG for mockups
const Icon = ({ type, className = "" }) => {
  const icons = {
    chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
    star: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    pkg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
    layers: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    flame: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>,
    warn: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    trend: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  };
  return icons[type] || null;
};

const categories = [
  { name: "Popular Play Skins", volatility: "Low", liquidity: "Very High", supply: "Ongoing", color: "emerald", icon: "star" },
  { name: "Discontinued Case Skins", volatility: "Medium", liquidity: "Medium", supply: "Fixed", color: "amber", icon: "pkg" },
  { name: "Stickers & Capsules", volatility: "High", liquidity: "Variable", supply: "Fixed", color: "blue", icon: "layers" },
  { name: "Rare Patterns", volatility: "Very High", liquidity: "Low", supply: "Extremely Limited", color: "red", icon: "flame" },
];

const mechanics = ["Case Drop System", "Trade-Up Contracts", "Sticker Application", "VAC Bans", "Float Values", "Operation Skins"];
const factors = ["Player Count", "Tournament Schedule", "Valve Updates", "Steam Fees", "3rd-Party Volume", "Seasonal Patterns"];
const risks = ["Valve Rule Changes", "Price Drops", "Scams", "Liquidity", "Taxes", "Platform Risk"];

// Color utility
const c = {
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-800", gradient: "from-emerald-500 to-teal-500", light: "bg-emerald-500/10" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-800", gradient: "from-amber-500 to-orange-500", light: "bg-amber-500/10" },
  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badge: "bg-blue-100 text-blue-800", gradient: "from-blue-500 to-cyan-500", light: "bg-blue-500/10" },
  red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100 text-red-800", gradient: "from-red-500 to-rose-500", light: "bg-red-500/10" },
};

// ─── DESIGN 1: Premium Editorial with Gradient Accents ───
function Design1() {
  return (
    <div className="bg-[#fafbfc] rounded-xl overflow-hidden">
      <p className="text-center text-xs text-gray-400 pt-3 font-bold">1. Premium Editorial + Gradient Accents</p>
      {/* Hero */}
      <div className="mx-4 mt-3 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0f766e 0%, #0e7490 50%, #0369a1 100%)" }}>
        <div className="p-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><Icon type="chart" className="w-4 h-4 text-white" /></div>
            <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">Market Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-2">CS2 Skin Market Data & Trends</h1>
          <p className="text-white/60 text-sm mt-2 max-w-lg">Educational overview using publicly available data. Not financial advice.</p>
        </div>
      </div>
      {/* Category cards */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Skin Categories</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className={`h-1 bg-gradient-to-r ${c[cat.color].gradient}`} />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-7 h-7 rounded-lg ${c[cat.color].light} flex items-center justify-center`}>
                    <Icon type={cat.icon} className={`w-3.5 h-3.5 ${c[cat.color].text}`} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{cat.name}</h3>
                </div>
                <div className="flex gap-2 mt-3">
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${c[cat.color].badge}`}>Vol: {cat.volatility}</span>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${c[cat.color].badge}`}>Liq: {cat.liquidity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Supply / factors - numbered list style */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Supply Mechanics</h2>
        <div className="grid grid-cols-3 gap-3">
          {mechanics.map((m, i) => (
            <div key={m} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-200 transition-all">
              <span className="text-2xl font-black text-blue-100">{String(i + 1).padStart(2, "0")}</span>
              <h4 className="text-sm font-bold text-gray-900 mt-1">{m}</h4>
            </div>
          ))}
        </div>
      </div>
      {/* Risks */}
      <div className="px-4 mt-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Risks</h2>
        <div className="grid grid-cols-3 gap-3">
          {risks.map((r) => (
            <div key={r} className="rounded-xl border border-red-100 bg-gradient-to-br from-red-50 to-white p-3 flex items-start gap-2">
              <Icon type="warn" className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs font-semibold text-gray-800">{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DESIGN 2: Card-Heavy with Icon Circles ───
function Design2() {
  return (
    <div className="bg-gray-50 rounded-xl overflow-hidden">
      <p className="text-center text-xs text-gray-400 pt-3 font-bold">2. Card-Heavy + Icon Circles</p>
      {/* Hero */}
      <div className="mx-4 mt-3 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
            <Icon type="chart" className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CS2 Skin Market Data & Trends</h1>
            <p className="text-gray-500 text-sm mt-1">Educational market overview — not financial advice</p>
          </div>
        </div>
      </div>
      {/* Category cards with large icons */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Skin Categories</h2>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div key={cat.name} className={`${c[cat.color].bg} border ${c[cat.color].border} rounded-2xl p-4 text-center`}>
              <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${c[cat.color].gradient} flex items-center justify-center shadow-md mb-3`}>
                <Icon type={cat.icon} className="w-5 h-5 text-white" />
              </div>
              <h3 className={`text-xs font-bold ${c[cat.color].text}`}>{cat.name}</h3>
              <div className="mt-2 space-y-1">
                <div className="text-[9px] text-gray-500">Volatility: <span className="font-bold text-gray-700">{cat.volatility}</span></div>
                <div className="text-[9px] text-gray-500">Liquidity: <span className="font-bold text-gray-700">{cat.liquidity}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Supply - icon + text rows */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Supply Mechanics</h2>
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          {mechanics.map((m, i) => (
            <div key={m} className="flex items-center gap-3 px-4 py-3">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>
              <span className="text-sm font-medium text-gray-900">{m}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Risks as alert strips */}
      <div className="px-4 mt-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Risks</h2>
        <div className="space-y-2">
          {risks.map((r) => (
            <div key={r} className="bg-white rounded-lg border border-red-100 px-4 py-2.5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-sm font-medium text-gray-800">{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DESIGN 3: Magazine Sections with Color Bars ───
function Design3() {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <p className="text-center text-xs text-gray-400 pt-3 font-bold">3. Magazine Sections + Color Bars</p>
      {/* Hero with side accent */}
      <div className="mx-4 mt-3 flex rounded-2xl overflow-hidden border border-gray-200 shadow-md">
        <div className="w-1.5 bg-gradient-to-b from-teal-500 via-blue-500 to-purple-500" />
        <div className="p-6 flex-1">
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Market Intelligence</span>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mt-1">CS2 Skin Market Data & Trends</h1>
          <p className="text-gray-500 text-sm mt-2">Educational overview using publicly available data.</p>
        </div>
      </div>
      {/* Categories with left bar */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-serif font-bold text-gray-900 mb-4">Skin Categories</h2>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat.name} className="flex rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm">
              <div className={`w-1.5 bg-gradient-to-b ${c[cat.color].gradient}`} />
              <div className="p-4 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon type={cat.icon} className={`w-4 h-4 ${c[cat.color].text}`} />
                  <h3 className="text-sm font-bold text-gray-900">{cat.name}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full ${c[cat.color].badge}`}>{cat.volatility} vol</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full ${c[cat.color].badge}`}>{cat.liquidity} liq</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600`}>{cat.supply}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Factors - magazine card grid */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-serif font-bold text-gray-900 mb-4">Key Market Factors</h2>
        <div className="grid grid-cols-3 gap-3">
          {factors.map((f, i) => {
            const colors = ["border-t-blue-400", "border-t-teal-400", "border-t-purple-400", "border-t-amber-400", "border-t-rose-400", "border-t-cyan-400"];
            return (
              <div key={f} className={`bg-[#fafbfc] rounded-xl p-4 border border-gray-100 border-t-[3px] ${colors[i]}`}>
                <h4 className="text-sm font-bold text-gray-900">{f}</h4>
              </div>
            );
          })}
        </div>
      </div>
      {/* Risks */}
      <div className="px-4 mt-6 mb-6">
        <h2 className="text-lg font-serif font-bold text-gray-900 mb-4">Risks</h2>
        <div className="grid grid-cols-2 gap-3">
          {risks.map((r) => (
            <div key={r} className="flex rounded-xl overflow-hidden border border-red-100">
              <div className="w-1 bg-red-400" />
              <div className="p-3 flex items-center gap-2">
                <Icon type="warn" className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-800">{r}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DESIGN 4: Bento Grid Layout ───
function Design4() {
  return (
    <div className="bg-gray-50 rounded-xl overflow-hidden">
      <p className="text-center text-xs text-gray-400 pt-3 font-bold">4. Bento Grid Layout</p>
      {/* Hero */}
      <div className="mx-4 mt-3 rounded-2xl p-8 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #14532d 0%, #065f46 50%, #0f766e 100%)" }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h1 className="text-2xl font-bold text-white">CS2 Skin Market Data & Trends</h1>
          <p className="text-emerald-200/70 text-sm mt-2">Educational market overview · Not financial advice</p>
        </div>
      </div>
      {/* Bento Categories */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Skin Categories</h2>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c[cat.color].gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon type={cat.icon} className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">{cat.name}</h3>
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">Volatility</span>
                  <span className={`font-bold ${c[cat.color].text}`}>{cat.volatility}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">Liquidity</span>
                  <span className={`font-bold ${c[cat.color].text}`}>{cat.liquidity}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">Supply</span>
                  <span className="font-bold text-gray-700">{cat.supply}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Mechanics bento */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Supply Mechanics</h2>
        <div className="grid grid-cols-3 gap-3">
          {mechanics.map((m, i) => (
            <div key={m} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 mb-2">{i + 1}</div>
              <h4 className="text-sm font-bold text-gray-900">{m}</h4>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 mt-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Risks</h2>
        <div className="grid grid-cols-3 gap-3">
          {risks.map((r) => (
            <div key={r} className="bg-red-50 rounded-2xl border border-red-100 p-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Icon type="warn" className="w-3 h-3 text-red-500" />
              </div>
              <span className="text-xs font-semibold text-gray-800">{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DESIGN 5: Clean Corporate with Stat Boxes ───
function Design5() {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <p className="text-center text-xs text-gray-400 pt-3 font-bold">5. Clean Corporate + Stat Boxes</p>
      {/* Hero */}
      <div className="mx-4 mt-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border border-gray-200 p-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-6 rounded-full bg-teal-500" />
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Educational Resource</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">CS2 Skin Market Data & Trends</h1>
        <p className="text-gray-500 text-sm mt-2 max-w-lg">Publicly available market data and documented game mechanics.</p>
        <div className="flex gap-4 mt-4">
          {[{ label: "Categories", val: "4" }, { label: "Supply Factors", val: "6" }, { label: "Market Factors", val: "6" }, { label: "Platforms", val: "6" }].map((s) => (
            <div key={s.label} className="bg-white rounded-lg border border-gray-200 px-4 py-2 shadow-sm">
              <p className="text-xl font-bold text-gray-900">{s.val}</p>
              <p className="text-[10px] text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Categories as horizontal cards */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Skin Categories</h2>
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-sm transition-all">
              <div className={`w-12 h-12 rounded-xl ${c[cat.color].bg} border ${c[cat.color].border} flex items-center justify-center flex-shrink-0`}>
                <Icon type={cat.icon} className={`w-6 h-6 ${c[cat.color].text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900">{cat.name}</h3>
              </div>
              <div className="flex gap-6 flex-shrink-0">
                <div className="text-center">
                  <p className="text-[9px] text-gray-400 uppercase">Volatility</p>
                  <p className={`text-xs font-bold ${c[cat.color].text}`}>{cat.volatility}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-gray-400 uppercase">Liquidity</p>
                  <p className={`text-xs font-bold ${c[cat.color].text}`}>{cat.liquidity}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-gray-400 uppercase">Supply</p>
                  <p className="text-xs font-bold text-gray-700">{cat.supply}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-6" />
    </div>
  );
}

// ─── DESIGN 6: Warm Cream + Serif Headings ───
function Design6() {
  return (
    <div className="bg-[#faf8f5] rounded-xl overflow-hidden">
      <p className="text-center text-xs text-gray-400 pt-3 font-bold">6. Warm Cream + Serif Headings</p>
      {/* Hero */}
      <div className="mx-4 mt-3 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md">
        <div className="h-2 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500" />
        <div className="p-8">
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Market Data</span>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mt-2">CS2 Skin Market Data & Trends</h1>
          <p className="text-gray-500 text-sm mt-2">An educational overview using publicly available data.</p>
        </div>
      </div>
      {/* Categories */}
      <div className="px-4 mt-6">
        <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">Skin Categories</h2>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className={`h-1.5 bg-gradient-to-r ${c[cat.color].gradient}`} />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg ${c[cat.color].bg} border ${c[cat.color].border} flex items-center justify-center`}>
                    <Icon type={cat.icon} className={`w-4 h-4 ${c[cat.color].text}`} />
                  </div>
                  <h3 className="font-serif font-bold text-gray-900">{cat.name}</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[["Volatility", cat.volatility], ["Liquidity", cat.liquidity], ["Supply", cat.supply]].map(([l, v]) => (
                    <div key={l} className="bg-[#faf8f5] rounded-lg p-2">
                      <p className="text-[9px] text-gray-400 font-semibold uppercase">{l}</p>
                      <p className="text-xs font-bold text-gray-900 mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Factors with bottom bars */}
      <div className="px-4 mt-6">
        <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">Key Market Factors</h2>
        <div className="grid grid-cols-3 gap-3">
          {factors.map((f, i) => {
            const bars = ["from-blue-400 to-cyan-400", "from-teal-400 to-emerald-400", "from-purple-400 to-violet-400", "from-amber-400 to-orange-400", "from-rose-400 to-pink-400", "from-indigo-400 to-blue-400"];
            return (
              <div key={f} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4">
                  <h4 className="text-sm font-serif font-bold text-gray-900">{f}</h4>
                </div>
                <div className={`h-1 bg-gradient-to-r ${bars[i]}`} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="h-6" />
    </div>
  );
}

// ─── DESIGN 7: Compact Dashboard Style ───
function Design7() {
  return (
    <div className="bg-gray-50 rounded-xl overflow-hidden">
      <p className="text-center text-xs text-gray-400 pt-3 font-bold">7. Compact Dashboard Style</p>
      {/* Hero */}
      <div className="mx-4 mt-3 bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center"><Icon type="chart" className="w-4 h-4 text-white" /></div>
            <h1 className="text-xl font-bold text-gray-900">CS2 Market Data & Trends</h1>
          </div>
          <p className="text-gray-500 text-xs mt-1 ml-10">Educational overview · Not financial advice</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg">Browse Prices</button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg">Compare</button>
        </div>
      </div>
      {/* Dashboard grid */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div key={cat.name} className={`rounded-xl p-4 ${c[cat.color].bg} border ${c[cat.color].border}`}>
              <Icon type={cat.icon} className={`w-5 h-5 ${c[cat.color].text} mb-2`} />
              <h3 className="text-xs font-bold text-gray-900">{cat.name}</h3>
              <div className="mt-2 grid grid-cols-1 gap-1">
                <div className="flex justify-between text-[9px]"><span className="text-gray-500">Vol</span><span className="font-bold">{cat.volatility}</span></div>
                <div className="flex justify-between text-[9px]"><span className="text-gray-500">Liq</span><span className="font-bold">{cat.liquidity}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Mechanics + Factors side by side */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-2">Supply Mechanics</h3>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-50">
            {mechanics.map((m, i) => (
              <div key={m} className="px-3 py-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-blue-50 text-blue-600 text-[9px] font-bold flex items-center justify-center">{i+1}</span>
                <span className="text-xs text-gray-700">{m}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-2">Market Factors</h3>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-50">
            {factors.map((f, i) => (
              <div key={f} className="px-3 py-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-teal-50 text-teal-600 text-[9px] font-bold flex items-center justify-center">{i+1}</span>
                <span className="text-xs text-gray-700">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-6" />
    </div>
  );
}

// ─── DESIGN 8: Gradient Glass Cards ───
function Design8() {
  return (
    <div className="bg-[#f0f4f8] rounded-xl overflow-hidden">
      <p className="text-center text-xs text-gray-400 pt-3 font-bold">8. Gradient Glass Cards</p>
      {/* Hero with gradient bg */}
      <div className="mx-4 mt-3 rounded-2xl p-8 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #6366f1 100%)" }}>
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-[10px] font-semibold text-white/90 backdrop-blur-sm mb-3">
            <Icon type="chart" className="w-3 h-3" /> Market Intelligence
          </div>
          <h1 className="text-2xl font-bold text-white">CS2 Skin Market Data & Trends</h1>
          <p className="text-white/60 text-sm mt-2">Educational overview using publicly available data.</p>
        </div>
      </div>
      {/* Glass category cards */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Skin Categories</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-5 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c[cat.color].gradient} flex items-center justify-center shadow-sm`}>
                  <Icon type={cat.icon} className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">{cat.name}</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[["Vol", cat.volatility], ["Liq", cat.liquidity], ["Supply", cat.supply]].map(([l, v]) => (
                  <div key={l} className="bg-gray-50/80 rounded-lg p-2 text-center">
                    <p className="text-[8px] text-gray-400 uppercase font-semibold">{l}</p>
                    <p className="text-[10px] font-bold text-gray-800">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Glass factor cards */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Key Market Factors</h2>
        <div className="grid grid-cols-3 gap-3">
          {factors.map((f) => (
            <div key={f} className="bg-white/80 backdrop-blur-sm rounded-xl border border-white shadow-sm p-4">
              <h4 className="text-sm font-bold text-gray-900">{f}</h4>
            </div>
          ))}
        </div>
      </div>
      <div className="h-6" />
    </div>
  );
}

// ─── DESIGN 9: Bold Headers + Pastel Sections ───
function Design9() {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <p className="text-center text-xs text-gray-400 pt-3 font-bold">9. Bold Headers + Pastel Sections</p>
      {/* Hero */}
      <div className="mx-4 mt-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center"><Icon type="chart" className="w-5 h-5 text-white" /></div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">CS2 Market Data & Trends</h1>
            <p className="text-teal-600 text-xs font-semibold">Educational Resource · Not Financial Advice</p>
          </div>
        </div>
      </div>
      {/* Category cards with pastel bg */}
      <div className="px-4 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
          <h2 className="text-lg font-black text-gray-900">Skin Categories</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <div key={cat.name} className={`${c[cat.color].bg} border ${c[cat.color].border} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon type={cat.icon} className={`w-4 h-4 ${c[cat.color].text}`} />
                <h3 className={`text-sm font-black ${c[cat.color].text}`}>{cat.name}</h3>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-[9px] font-bold text-gray-600 bg-white/60 px-2 py-0.5 rounded-full">Vol: {cat.volatility}</span>
                <span className="text-[9px] font-bold text-gray-600 bg-white/60 px-2 py-0.5 rounded-full">Liq: {cat.liquidity}</span>
                <span className="text-[9px] font-bold text-gray-600 bg-white/60 px-2 py-0.5 rounded-full">{cat.supply}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Sections with colored left bar headers */}
      <div className="px-4 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500" />
          <h2 className="text-lg font-black text-gray-900">Supply Mechanics</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {mechanics.map((m) => (
            <div key={m} className="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
              <h4 className="text-xs font-bold text-gray-900">{m}</h4>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 mt-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-red-400 to-rose-500" />
          <h2 className="text-lg font-black text-gray-900">Risks</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {risks.map((r) => (
            <div key={r} className="bg-red-50/50 border border-red-100 rounded-xl p-3 flex items-center gap-2">
              <Icon type="warn" className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <span className="text-xs font-bold text-gray-800">{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DESIGN 10: Modern Split + Floating Stats ───
function Design10() {
  return (
    <div className="bg-[#f8fafc] rounded-xl overflow-hidden">
      <p className="text-center text-xs text-gray-400 pt-3 font-bold">10. Modern Split + Floating Stats</p>
      {/* Hero with floating stat cards */}
      <div className="mx-4 mt-3 rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #134e4a 0%, #115e59 40%, #0f766e 100%)" }}>
        <div className="p-8 pb-16">
          <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-[10px] font-semibold text-teal-200 mb-3">
            <Icon type="shield" className="w-3 h-3" /> Educational Resource
          </div>
          <h1 className="text-2xl font-bold text-white">CS2 Skin Market Data & Trends</h1>
          <p className="text-teal-200/60 text-sm mt-2 max-w-lg">Publicly available market data and documented game mechanics.</p>
        </div>
        <div className="flex gap-3 px-8 -mb-8 relative z-10 pb-0">
          {categories.map((cat) => (
            <div key={cat.name} className="flex-1 bg-white rounded-xl border border-gray-200 p-3 shadow-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <div className={`w-5 h-5 rounded ${c[cat.color].bg} border ${c[cat.color].border} flex items-center justify-center`}>
                  <Icon type={cat.icon} className={`w-2.5 h-2.5 ${c[cat.color].text}`} />
                </div>
                <h3 className="text-[10px] font-bold text-gray-900">{cat.name}</h3>
              </div>
              <div className="flex gap-1 mt-1.5">
                <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded ${c[cat.color].badge}`}>{cat.volatility}</span>
                <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded ${c[cat.color].badge}`}>{cat.liquidity}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="h-8" />
      </div>
      {/* Content sections */}
      <div className="px-4 mt-12">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Supply Mechanics</h2>
        <div className="grid grid-cols-3 gap-3">
          {mechanics.map((m, i) => (
            <div key={m} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black text-teal-500">{String(i+1).padStart(2, "0")}</span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">{m}</h4>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Key Market Factors</h2>
        <div className="grid grid-cols-3 gap-3">
          {factors.map((f, i) => {
            const dots = ["bg-teal-400", "bg-blue-400", "bg-purple-400", "bg-amber-400", "bg-rose-400", "bg-cyan-400"];
            return (
              <div key={f} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-start gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${dots[i]} mt-0.5 flex-shrink-0`} />
                <h4 className="text-sm font-bold text-gray-900">{f}</h4>
              </div>
            );
          })}
        </div>
      </div>
      <div className="px-4 mt-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Risks & Considerations</h2>
        <div className="bg-red-50 rounded-2xl border border-red-100 p-4">
          <div className="grid grid-cols-3 gap-3">
            {risks.map((r) => (
              <div key={r} className="flex items-center gap-2 bg-white rounded-lg p-2.5 border border-red-100">
                <Icon type="warn" className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-800">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN: Tabbed Viewer ───
export default function CS2InvestingMockups() {
  const [active, setActive] = useState(0);
  const designs = [
    { name: "1. Editorial Gradient", component: <Design1 /> },
    { name: "2. Icon Circles", component: <Design2 /> },
    { name: "3. Magazine Bars", component: <Design3 /> },
    { name: "4. Bento Grid", component: <Design4 /> },
    { name: "5. Corporate Stats", component: <Design5 /> },
    { name: "6. Warm Serif", component: <Design6 /> },
    { name: "7. Dashboard", component: <Design7 /> },
    { name: "8. Glass Cards", component: <Design8 /> },
    { name: "9. Bold Pastel", component: <Design9 /> },
    { name: "10. Floating Stats", component: <Design10 /> },
  ];

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-gray-900 text-2xl font-bold text-center mb-1">CS2 Investing Page Mockups</h1>
      <p className="text-gray-500 text-sm text-center mb-6">All light themes! Click tabs to compare. Tell me your favorite number.</p>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {designs.map((d, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              active === i
                ? "bg-teal-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto">
        {designs[active].component}
      </div>
    </div>
  );
}
