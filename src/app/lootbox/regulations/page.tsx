"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Scale,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Shield,
  AlertTriangle,
  Clock,
  CheckCircle,
  Globe,
  Search,
  Calendar,
  ArrowRight,
  Info,
  TrendingUp,
  Users,
  Gavel,
  ExternalLink,
} from "lucide-react";
import {
  REGULATIONS,
  STATUS_META,
  REGION_LIST,
  type Regulation,
} from "@/data/regulations";

/* ── Flag image helper — uses flagcdn.com for crisp SVG flags ── */
function FlagImg({ iso, size = 24 }: { iso: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w80/${iso.toLowerCase()}.png`}
      alt={iso}
      width={size * 1.5}
      height={size}
      className="rounded-sm object-cover shadow-sm"
      style={{ width: size * 1.5, height: size }}
      loading="lazy"
    />
  );
}

/* ── helpers ── */
const ALL_EVENTS = REGULATIONS.flatMap((r) =>
  r.keyEvents.map((e) => ({ ...e, country: r.country, flag: r.flag, iso: r.iso, status: r.status }))
)
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 12);

function StatusBadge({ status, size = "sm" }: { status: Regulation["status"]; size?: "sm" | "lg" }) {
  const meta = STATUS_META[status];
  const sizeClass = size === "lg" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold ${sizeClass} ${meta.color} ${meta.bgColor}`}
    >
      {status === "banned" && <AlertTriangle className={size === "lg" ? "h-4 w-4" : "h-3 w-3"} />}
      {status === "restricted" && <Shield className={size === "lg" ? "h-4 w-4" : "h-3 w-3"} />}
      {status === "pending" && <Clock className={size === "lg" ? "h-4 w-4" : "h-3 w-3"} />}
      {status === "legal" && <CheckCircle className={size === "lg" ? "h-4 w-4" : "h-3 w-3"} />}
      {meta.label}
    </span>
  );
}

/* ── Status color for left border accent ── */
function statusAccentColor(status: Regulation["status"]) {
  switch (status) {
    case "banned": return "#dc2626";
    case "restricted": return "#d97706";
    case "pending": return "#2563eb";
    case "legal": return "#6b7280";
  }
}

function RegulationCard({ reg }: { reg: Regulation }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 overflow-hidden transition-all hover:shadow-lg group"
      style={{ borderLeftWidth: 4, borderLeftColor: statusAccentColor(reg.status) }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900/50 transition-colors"
      >
        {/* Flag */}
        <div className="flex-shrink-0">
          <FlagImg iso={reg.iso} size={28} />
        </div>

        {/* Country name + status */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white truncate text-base">
            {reg.country}
          </h3>
          <StatusBadge status={reg.status} />
        </div>

        {/* Region chip */}
        <span className="hidden sm:inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-[11px] font-medium text-gray-500 dark:text-gray-400">
          {reg.region}
        </span>

        {/* Expand icon */}
        <div className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${expanded ? "bg-blue-100" : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200"}`}>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-blue-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800">
          {/* Summary */}
          <p className="text-sm text-gray-700 dark:text-gray-200 mt-4 leading-relaxed">
            {reg.summary}
          </p>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Requirements */}
            {reg.requirements.length > 0 && (
              <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" /> Key Requirements
                </h4>
                <ul className="space-y-2">
                  {reg.requirements.map((req, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusAccentColor(reg.status) }} />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timeline */}
            {reg.keyEvents.length > 0 && (
              <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Timeline
                </h4>
                <div className="relative ml-2 border-l-2 pl-4 space-y-3" style={{ borderColor: statusAccentColor(reg.status) + "40" }}>
                  {reg.keyEvents.map((event, i) => (
                    <div key={i} className="relative">
                      <div
                        className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white"
                        style={{ backgroundColor: statusAccentColor(reg.status) }}
                      />
                      <p className="text-[11px] font-mono text-gray-400 dark:text-gray-500">
                        {event.date}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-200">{event.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="mt-4 text-[10px] text-gray-400 dark:text-gray-500">
            Last updated: {reg.lastUpdated}
          </p>
        </div>
      )}
    </div>
  );
}

export default function RegulationsPage() {
  const [regionFilter, setRegionFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return REGULATIONS.filter((r) => {
      if (regionFilter !== "All" && r.region !== regionFilter) return false;
      if (statusFilter !== "All" && r.status !== statusFilter) return false;
      if (q && !r.country.toLowerCase().includes(q) && !r.summary.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [regionFilter, statusFilter, searchQuery]);

  const statusCounts = useMemo(
    () => ({
      banned: REGULATIONS.filter((r) => r.status === "banned").length,
      restricted: REGULATIONS.filter((r) => r.status === "restricted").length,
      pending: REGULATIONS.filter((r) => r.status === "pending").length,
      legal: REGULATIONS.filter((r) => r.status === "legal").length,
    }),
    []
  );

  const totalCountries = REGULATIONS.length;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-16 overflow-hidden">
        {/* Decorative grid dots */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />

        {/* Floating flag decorations */}
        <div className="absolute top-8 right-8 flex gap-3 opacity-20 hidden lg:flex">
          {REGULATIONS.slice(0, 8).map((r) => (
            <div key={r.iso} className="rounded-md overflow-hidden shadow-lg">
              <FlagImg iso={r.iso} size={32} />
            </div>
          ))}
        </div>

        <div className="container-main relative z-10">
          <Link
            href="/lootbox"
            className="inline-flex items-center gap-1 text-sm text-blue-300 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Loot Boxes
          </Link>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 backdrop-blur-sm border border-blue-400/20">
              <Scale className="h-7 w-7 text-blue-400" />
            </div>
            <div>
              <div className="inline-flex rounded-full bg-blue-500/20 backdrop-blur-sm px-4 py-1.5 text-sm font-bold text-blue-300 border border-blue-400/20">
                <Globe className="h-4 w-4 mr-1.5" />
                {totalCountries} Countries Tracked
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Loot Box Regulations
          </h1>
          <p className="mt-2 text-lg text-blue-300 font-semibold">
            Global legislation tracker — updated March 2026
          </p>
          <p className="mt-4 max-w-2xl text-gray-300 leading-relaxed">
            Track loot box legislation worldwide. From outright bans in Belgium
            to pending bills in the U.S. and Brazil, see how governments are
            responding to randomized purchase mechanics in video games.
          </p>

          {/* Hero flag row — horizontal scroll of all tracked countries */}
          <div className="mt-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {REGULATIONS.map((r) => {
              const accent = statusAccentColor(r.status);
              return (
                <div
                  key={r.iso}
                  className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 flex-shrink-0 border border-white/10"
                >
                  <FlagImg iso={r.iso} size={16} />
                  <span className="text-xs font-semibold text-white/80">{r.country.replace(" (Federal)", "")}</span>
                  <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global summary — status cards */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="container-main py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {(
              [
                { key: "banned", icon: AlertTriangle, label: "Banned", gradient: "from-red-500 to-rose-600" },
                { key: "restricted", icon: Shield, label: "Restricted", gradient: "from-amber-500 to-orange-600" },
                { key: "pending", icon: Clock, label: "Pending", gradient: "from-blue-500 to-indigo-600" },
                { key: "legal", icon: CheckCircle, label: "No Restrictions", gradient: "from-gray-400 to-gray-500" },
              ] as const
            ).map((item) => {
              const count = statusCounts[item.key];
              const isActive = statusFilter === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() =>
                    setStatusFilter(isActive ? "All" : item.key)
                  }
                  className={`relative rounded-2xl p-5 text-center transition-all hover:shadow-lg overflow-hidden ${
                    isActive
                      ? "ring-2 ring-blue-400 ring-offset-2 shadow-lg"
                      : "hover:-translate-y-0.5"
                  }`}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-${isActive ? "15" : "8"} transition-opacity`} />
                  <div className="absolute inset-0 bg-white dark:bg-gray-950/90" />

                  <div className="relative z-10">
                    <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient}`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{count}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
                      {item.label}
                    </p>

                    {/* Country flags under each stat */}
                    <div className="flex justify-center gap-1.5 mt-3">
                      {REGULATIONS.filter((r) => r.status === item.key).map((r) => (
                        <FlagImg key={r.iso} iso={r.iso} size={14} />
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* World overview prose */}
          <div className="rounded-2xl border border-blue-100 dark:border-blue-800/30 bg-gradient-to-r from-blue-50 dark:from-blue-950/30 to-indigo-50 dark:to-indigo-950/30 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 flex-shrink-0 mt-0.5">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed space-y-2">
                <p>
                  <span className="font-bold text-gray-900 dark:text-white">
                    The global picture:
                  </span>{" "}
                  Of the {totalCountries} jurisdictions we track,{" "}
                  <span className="font-bold text-red-700">
                    {statusCounts.banned} have banned
                  </span>{" "}
                  loot boxes outright,{" "}
                  <span className="font-bold text-amber-700">
                    {statusCounts.restricted} enforce restrictions
                  </span>{" "}
                  like mandatory disclosure,{" "}
                  <span className="font-bold text-blue-700">
                    {statusCounts.pending} have pending legislation
                  </span>
                  , and{" "}
                  <span className="font-bold text-gray-600 dark:text-gray-300">
                    {statusCounts.legal} have no specific rules
                  </span>
                  .
                </p>
                <p>
                  Asia-Pacific leads in disclosure requirements — China, South Korea, and
                  Japan all mandate or strongly recommend that publishers reveal drop rates.
                  Europe leads in outright bans, with Belgium and the Netherlands taking the
                  hardest line. The Americas are still largely in the &quot;studying the issue&quot;
                  phase, though the 2026 New York AG lawsuit against Valve signals a
                  potential shift.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search + Filter bar */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-16 z-30 shadow-sm">
        <div className="container-main py-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search countries..."
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 pl-9 pr-3 py-2 text-sm placeholder:text-gray-400 dark:text-gray-500 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-300 focus:outline-none"
          >
            {REGION_LIST.map((r) => (
              <option key={r} value={r}>
                {r === "All" ? "All Regions" : r}
              </option>
            ))}
          </select>

          {(regionFilter !== "All" ||
            statusFilter !== "All" ||
            searchQuery) && (
            <button
              onClick={() => {
                setRegionFilter("All");
                setStatusFilter("All");
                setSearchQuery("");
              }}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Clear filters
            </button>
          )}

          <span className="ml-auto text-sm text-gray-400 dark:text-gray-500 font-medium">
            {filtered.length} of {totalCountries} countries
          </span>
        </div>
      </section>

      {/* Country list */}
      <section className="py-8">
        <div className="container-main space-y-3">
          {filtered.map((reg) => (
            <RegulationCard key={reg.country} reg={reg} />
          ))}

          {filtered.length === 0 && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-12 text-center">
              <Search className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No countries match your search.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Try a different search term or clear filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Recent regulatory events timeline */}
      <section className="border-t border-gray-100 dark:border-gray-800 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-950 py-12">
        <div className="container-main">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 dark:from-blue-950 to-indigo-600">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recent Regulatory Events
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-8 max-w-2xl ml-[52px]">
            The most significant loot box regulatory actions worldwide — from the
            latest developments going back through the history of this evolving
            legal landscape.
          </p>

          <div className="relative ml-6 border-l-2 border-blue-200 pl-8 space-y-8">
            {ALL_EVENTS.map((event, i) => {
              const accent = statusAccentColor(event.status);
              return (
                <div key={i} className="relative group">
                  {/* Timeline dot */}
                  <div
                    className="absolute -left-[37px] top-1 h-4 w-4 rounded-full border-[3px] border-white shadow-sm"
                    style={{ backgroundColor: accent }}
                  />

                  <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 shadow-sm group-hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <FlagImg iso={event.iso} size={18} />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {event.country}
                      </span>
                      <span className="text-xs font-mono text-gray-400 dark:text-gray-500 ml-auto">
                        {event.date}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key takeaways — collapsible */}
      <section className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 py-12">
        <div className="container-main">
          <details open className="group">
            <summary className="flex items-center justify-between cursor-pointer select-none mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Key Takeaways for Players
              </h2>
              <ChevronDown className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" />
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Info,
                  gradient: "from-blue-500 to-indigo-600",
                  title: "Know Your Rights",
                  text: "If you live in a country with disclosure requirements, publishers must show you the odds before you buy. If they don\u2019t, you may be able to report them to your consumer protection agency.",
                },
                {
                  icon: TrendingUp,
                  gradient: "from-emerald-500 to-teal-600",
                  title: "Trend Toward Regulation",
                  text: `The overall trend is toward more regulation, not less. ${statusCounts.pending} countries currently have pending legislation. Players should expect more transparency and consumer protections in the coming years.`,
                },
                {
                  icon: Users,
                  gradient: "from-amber-500 to-orange-600",
                  title: "Protecting Young Players",
                  text: "Most regulatory efforts focus on protecting minors. China\u2019s strict 3-hour weekly limit for under-18s is the most extreme example, but age verification and spending caps are being discussed worldwide.",
                },
              ].map((card) => (
                <div key={card.title} className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow group/card">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} mb-4 group-hover/card:scale-110 transition-transform`}>
                    <card.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* SEO prose — why this matters — collapsible */}
      <section className="border-t border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 dark:from-blue-950/30 to-indigo-50 py-12">
        <div className="container-main">
          <details open className="group">
            <summary className="flex items-center justify-between cursor-pointer select-none mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Why Loot Box Regulation Matters
              </h2>
              <ChevronDown className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" />
            </summary>
            <div className="max-w-3xl space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed">
              <p>
                Loot boxes generate billions in annual revenue for game publishers,
                but growing evidence links them to problem gambling behaviors —
                especially among younger players. A 2021 meta-analysis found a
                consistent relationship between loot box spending and gambling
                severity, prompting health organizations to call for stronger
                protections.
              </p>
              <p>
                Apple and Google both require apps on their stores to disclose drop
                rates, which has pushed some transparency even in regions without
                legislation. However, enforcement is inconsistent and many games
                still obscure the true cost of their monetization systems through
                premium currencies, bundle-only purchasing, and opaque pity
                mechanics.
              </p>
              <p>
                The most significant recent development is the February 2026 New York
                Attorney General lawsuit against Valve, alleging that CS2, Dota 2,
                and TF2 loot boxes constitute illegal gambling under state law. This
                case could set a precedent that reshapes how loot boxes are treated
                across the entire United States.
              </p>
              <p>
                We maintain this tracker to help players, parents, and researchers
                stay informed about the evolving legal landscape. All information is
                sourced from official government publications, regulatory body
                reports, and verified news outlets.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 py-10">
        <div className="container-main flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Gavel className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Want to see how transparent your game is?
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Check our transparency report to see how your games stack up.
            </p>
          </div>
          <Link
            href="/lootbox/transparency-report"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
          >
            Transparency Report <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/70">
        <div className="container-main py-4">
          <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed text-center">
            <span className="font-semibold text-gray-500 dark:text-gray-400">Disclaimer:</span>{" "}
            This tracker is for informational purposes only and does not
            constitute legal advice. Regulations change frequently — always
            consult official sources for the latest information in your
            jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
}
