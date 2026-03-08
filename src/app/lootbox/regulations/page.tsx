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
  MapPin,
  Search,
  Calendar,
  ArrowRight,
  Info,
  TrendingUp,
  Users,
  Gavel,
} from "lucide-react";
import {
  REGULATIONS,
  STATUS_META,
  REGION_LIST,
  type Regulation,
} from "@/data/regulations";

/* ── helpers ── */
const ALL_EVENTS = REGULATIONS.flatMap((r) =>
  r.keyEvents.map((e) => ({ ...e, country: r.country, status: r.status }))
)
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 12);

function StatusBadge({ status }: { status: Regulation["status"] }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${meta.color} ${meta.bgColor}`}
    >
      {status === "banned" && <AlertTriangle className="h-3 w-3" />}
      {status === "restricted" && <Shield className="h-3 w-3" />}
      {status === "pending" && <Clock className="h-3 w-3" />}
      {status === "legal" && <CheckCircle className="h-3 w-3" />}
      {meta.label}
    </span>
  );
}

function RegulationCard({ reg }: { reg: Regulation }) {
  const [expanded, setExpanded] = useState(false);
  const meta = STATUS_META[reg.status];

  return (
    <div
      className={`rounded-xl border ${meta.borderColor} ${meta.bgColor} overflow-hidden transition-all`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-white/40 transition-colors"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <h3 className="font-semibold text-gray-900 truncate">
            {reg.country}
          </h3>
          <StatusBadge status={reg.status} />
        </div>
        <span className="text-[10px] text-gray-400 flex-shrink-0 hidden sm:block">
          {reg.region}
        </span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-200/50">
          <p className="text-sm text-gray-700 mt-4 leading-relaxed">
            {reg.summary}
          </p>

          {reg.requirements.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                Key Requirements
              </h4>
              <ul className="space-y-1.5">
                {reg.requirements.map((req, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="text-gray-400 mt-0.5">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {reg.keyEvents.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                Timeline
              </h4>
              <div className="relative ml-2 border-l-2 border-gray-200 pl-4 space-y-3">
                {reg.keyEvents.map((event, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-gray-300 border-2 border-white" />
                    <p className="text-xs text-gray-400 font-mono">
                      {event.date}
                    </p>
                    <p className="text-sm text-gray-700">{event.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="mt-4 text-[10px] text-gray-400">
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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-16">
        <div className="container-main">
          <Link
            href="/lootbox"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-200 mb-4"
          >
            <ChevronLeft className="h-4 w-4" /> Loot Boxes
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 backdrop-blur-sm">
              <Scale className="h-6 w-6 text-blue-400" />
            </div>
            <div className="inline-flex rounded-full bg-blue-500/20 backdrop-blur-sm px-4 py-1 text-sm font-semibold text-blue-300">
              {totalCountries} Countries Tracked
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
        </div>
      </section>

      {/* Global summary cards */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="container-main py-6">
          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {(
              [
                { key: "banned", icon: AlertTriangle, label: "Banned" },
                { key: "restricted", icon: Shield, label: "Restricted" },
                { key: "pending", icon: Clock, label: "Pending" },
                { key: "legal", icon: CheckCircle, label: "No Restrictions" },
              ] as const
            ).map((item) => {
              const meta = STATUS_META[item.key];
              const count = statusCounts[item.key];
              const isActive = statusFilter === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() =>
                    setStatusFilter(isActive ? "All" : item.key)
                  }
                  className={`rounded-xl border p-4 text-center transition-all hover:shadow-md ${
                    isActive
                      ? `${meta.borderColor} ${meta.bgColor} ring-2 ring-offset-1 ring-blue-300`
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 mx-auto mb-1.5 ${
                      isActive ? meta.color : "text-gray-400"
                    }`}
                  />
                  <p className="text-2xl font-black text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500 font-medium">
                    {item.label}
                  </p>
                </button>
              );
            })}
          </div>

          {/* World overview prose */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                <p>
                  <span className="font-bold text-gray-900">
                    The global picture:
                  </span>{" "}
                  Of the {totalCountries} jurisdictions we track,{" "}
                  <span className="font-semibold text-red-700">
                    {statusCounts.banned} have banned
                  </span>{" "}
                  loot boxes outright,{" "}
                  <span className="font-semibold text-amber-700">
                    {statusCounts.restricted} enforce restrictions
                  </span>{" "}
                  like mandatory disclosure,{" "}
                  <span className="font-semibold text-blue-700">
                    {statusCounts.pending} have pending legislation
                  </span>
                  , and{" "}
                  <span className="font-semibold text-gray-600">
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
      <section className="border-b border-gray-100 bg-white sticky top-16 z-30">
        <div className="container-main py-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search countries..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-200"
            />
          </div>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-blue-300 focus:outline-none"
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
              className="text-xs text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          )}

          <span className="ml-auto text-sm text-gray-400">
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
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
              <Search className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                No countries match your search.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Try a different search term or clear filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Recent regulatory events timeline */}
      <section className="border-t border-gray-100 bg-gray-50/50 py-12">
        <div className="container-main">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-5 w-5 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Regulatory Events
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-6 max-w-2xl">
            A timeline of the most significant loot box regulatory actions
            worldwide, from the latest developments going back through the
            history of this evolving legal landscape.
          </p>

          <div className="relative ml-4 border-l-2 border-blue-200 pl-6 space-y-6">
            {ALL_EVENTS.map((event, i) => {
              const statusColor =
                event.status === "banned"
                  ? "bg-red-500"
                  : event.status === "restricted"
                  ? "bg-amber-500"
                  : event.status === "pending"
                  ? "bg-blue-500"
                  : "bg-gray-400";
              return (
                <div key={i} className="relative">
                  <div
                    className={`absolute -left-[29px] top-1 h-3 w-3 rounded-full ${statusColor} border-2 border-white`}
                  />
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-xs font-mono text-gray-400">
                      {event.date}
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      {event.country}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5">
                    {event.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key takeaways */}
      <section className="border-t border-gray-100 bg-white py-12">
        <div className="container-main">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Key Takeaways for Players
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                  <Info className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900">Know Your Rights</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                If you live in a country with disclosure requirements, publishers
                must show you the odds before you buy. If they don&apos;t, you may
                be able to report them to your consumer protection agency.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900">
                  Trend Toward Regulation
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                The overall trend is toward more regulation, not less.
                {statusCounts.pending} countries currently have pending
                legislation. Players should expect more transparency and consumer
                protections in the coming years.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                  <Users className="h-4 w-4 text-amber-600" />
                </div>
                <h3 className="font-bold text-gray-900">
                  Protecting Young Players
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Most regulatory efforts focus on protecting minors. China&apos;s
                strict 3-hour weekly limit for under-18s is the most extreme
                example, but age verification and spending caps are being
                discussed worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO prose — why this matters */}
      <section className="border-t border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
        <div className="container-main">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Loot Box Regulation Matters
          </h2>
          <div className="max-w-3xl space-y-4 text-gray-700 leading-relaxed">
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
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-white py-10">
        <div className="container-main flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Gavel className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-bold text-gray-900">
                Want to see how transparent your game is?
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              Check our transparency report to see how your games stack up.
            </p>
          </div>
          <Link
            href="/lootbox/transparency-report"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Transparency Report <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="border-t border-gray-100 bg-gray-50/70">
        <div className="container-main py-4">
          <p className="text-[11px] text-gray-400 leading-relaxed text-center">
            <span className="font-semibold text-gray-500">Disclaimer:</span>{" "}
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
