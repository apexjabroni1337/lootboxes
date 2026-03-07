import Link from "next/link";
import { Search, ChevronLeft, Info } from "lucide-react";

const WEAR_TIERS = [
  { name: "Factory New", range: "0.00 – 0.07", color: "#4b69ff", width: "7%" },
  { name: "Minimal Wear", range: "0.07 – 0.15", color: "#8847ff", width: "8%" },
  { name: "Field-Tested", range: "0.15 – 0.38", color: "#d32ce6", width: "23%" },
  { name: "Well-Worn", range: "0.38 – 0.45", color: "#eb4b4b", width: "7%" },
  { name: "Battle-Scarred", range: "0.45 – 1.00", color: "#e4ae39", width: "55%" },
];

export default function FloatCheckerPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 py-10">
        <div className="container-main">
          <Link href="/cs2" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ChevronLeft className="h-4 w-4" /> CS2 Skins Hub
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white">
              <Search className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Float Value Checker</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Look up exact float values, paint seeds, and wear ratings for any CS2 skin. Find rare patterns and low-float gems.
          </p>
        </div>
      </section>

      <div className="container-main py-10">
        {/* Input */}
        <div className="max-w-2xl mx-auto">
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Paste a Steam Inspect Link or Market URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="steam://rungame/730/76561202255233023/+csgo_econ_action_preview..."
              className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            <button className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600 transition-colors">
              Check
            </button>
          </div>

          <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Coming Soon — Live Float Inspection</p>
                <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                  We&apos;re integrating with the Steam API to provide real-time float value lookups. In the meantime, check out CSFloat or the Steam Inventory Helper extension for instant float checks.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wear tier reference */}
        <div className="max-w-2xl mx-auto mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Wear Tier Reference</h2>
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            {/* Visual spectrum */}
            <div className="flex h-6">
              {WEAR_TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className="h-full"
                  style={{ width: tier.width, backgroundColor: tier.color }}
                  title={`${tier.name}: ${tier.range}`}
                />
              ))}
            </div>
            {/* Table */}
            <div className="divide-y divide-gray-100">
              {WEAR_TIERS.map((tier) => (
                <div key={tier.name} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: tier.color }} />
                    <span className="text-sm font-medium text-gray-900">{tier.name}</span>
                  </div>
                  <span className="text-sm text-gray-500 font-mono">{tier.range}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-500 leading-relaxed">
            Float values determine the visual wear on a skin. Lower float = less wear = more valuable. Some skins have restricted float ranges — for example, the AWP Asiimov can only drop in Field-Tested, Well-Worn, and Battle-Scarred conditions.
          </p>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <Link href="/cs2/prices" className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800 transition-colors">
            Browse Skin Prices
          </Link>
        </div>
      </div>
    </div>
  );
}
