"use client";

import { useState } from "react";
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
} from "lucide-react";
import { REGULATIONS, STATUS_META, REGION_LIST, type Regulation } from "@/data/regulations";

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
          <h3 className="font-semibold text-gray-900 truncate">{reg.country}</h3>
          <StatusBadge status={reg.status} />
        </div>
        <span className="text-[10px] text-gray-400 flex-shrink-0 hidden sm:block">{reg.region}</span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-200/50">
          <p className="text-sm text-gray-700 mt-4 leading-relaxed">{reg.summary}</p>

          {reg.requirements.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                Key Requirements
              </h4>
              <ul className="space-y-1.5">
                {reg.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
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
              <div className="space-y-2">
                {reg.keyEvents.map((event, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="text-gray-400 font-mono text-xs whitespace-nowrap mt-0.5">
                      {event.date}
                    </span>
                    <span className="text-gray-700">{event.description}</span>
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

  const filtered = REGULATIONS.filter((r) => {
    if (regionFilter !== "All" && r.region !== regionFilter) return false;
    if (statusFilter !== "All" && r.status !== statusFilter) return false;
    return true;
  });

  const statusCounts = {
    banned: REGULATIONS.filter((r) => r.status === "banned").length,
    restricted: REGULATIONS.filter((r) => r.status === "restricted").length,
    pending: REGULATIONS.filter((r) => r.status === "pending").length,
    legal: REGULATIONS.filter((r) => r.status === "legal").length,
  };

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
              Global Tracker
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Loot Box Regulations
          </h1>
          <p className="mt-2 text-lg text-blue-300 font-semibold">
            Country-by-country legal status
          </p>
          <p className="mt-4 max-w-2xl text-gray-300 leading-relaxed">
            Track loot box legislation worldwide. From outright bans to pending bills,
            see how governments are responding to randomized purchase mechanics in video games.
          </p>
        </div>
      </section>

      {/* Status overview cards */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="container-main py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
              return (
                <button
                  key={item.key}
                  onClick={() =>
                    setStatusFilter(statusFilter === item.key ? "All" : item.key)
                  }
                  className={`rounded-xl border p-4 text-center transition-all hover:shadow-md ${
                    statusFilter === item.key
                      ? `${meta.borderColor} ${meta.bgColor} ring-2 ring-offset-1 ring-blue-300`
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 mx-auto mb-1.5 ${
                      statusFilter === item.key ? meta.color : "text-gray-400"
                    }`}
                  />
                  <p className="text-2xl font-black text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="border-b border-gray-100 bg-white sticky top-16 z-30">
        <div className="container-main py-3 flex items-center gap-3">
          <Globe className="h-4 w-4 text-gray-400" />
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
          {(regionFilter !== "All" || statusFilter !== "All") && (
            <button
              onClick={() => {
                setRegionFilter("All");
                setStatusFilter("All");
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          )}
          <span className="ml-auto text-sm text-gray-400">
            {filtered.length} of {REGULATIONS.length} countries
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
              <p className="text-gray-500">No countries match your filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Context section */}
      <section className="border-t border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
        <div className="container-main">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why This Matters</h2>
          <div className="max-w-3xl space-y-4 text-gray-700 leading-relaxed">
            <p>
              Loot boxes generate billions in annual revenue for game publishers, but growing evidence
              links them to problem gambling behaviors — especially among younger players. Governments
              worldwide are responding with legislation ranging from full bans to disclosure requirements.
            </p>
            <p>
              Apple and Google both require apps on their stores to disclose drop rates, which has pushed
              some transparency even in regions without legislation. However, enforcement is inconsistent
              and many games still obscure the true cost of their monetization systems.
            </p>
            <p>
              We maintain this tracker to help players, parents, and researchers stay informed about the
              evolving legal landscape. All information is sourced from official government publications,
              regulatory body reports, and verified news outlets.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="border-t border-gray-100 bg-gray-50/70">
        <div className="container-main py-4">
          <p className="text-[11px] text-gray-400 leading-relaxed text-center">
            <span className="font-semibold text-gray-500">Disclaimer:</span>{" "}
            This tracker is for informational purposes only and does not constitute legal advice.
            Regulations change frequently — always consult official sources for the latest information
            in your jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
}
