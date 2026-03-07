"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronDown,
  ExternalLink,
  Sparkles,
  Target,
  Star,
} from "lucide-react";
import AffiliateDisclosure from "@/components/cs2/AffiliateDisclosure";

/* ── Wear tier constants ── */
const WEAR_TIERS = [
  { name: "Factory New", abbr: "FN", min: 0, max: 0.07, color: "#4b69ff", width: "7%" },
  { name: "Minimal Wear", abbr: "MW", min: 0.07, max: 0.15, color: "#8847ff", width: "8%" },
  { name: "Field-Tested", abbr: "FT", min: 0.15, max: 0.38, color: "#d32ce6", width: "23%" },
  { name: "Well-Worn", abbr: "WW", min: 0.38, max: 0.45, color: "#eb4b4b", width: "7%" },
  { name: "Battle-Scarred", abbr: "BS", min: 0.45, max: 1.0, color: "#e4ae39", width: "55%" },
];

function getWearTier(f: number) {
  return WEAR_TIERS.find((t) => f >= t.min && f < t.max) || WEAR_TIERS[4];
}

/* ── Rarity colors ── */
const RARITY_COLORS: Record<string, string> = {
  Consumer: "#b0c3d9",
  Industrial: "#5e98d9",
  "Mil-Spec": "#4b69ff",
  Restricted: "#8847ff",
  Classified: "#d32ce6",
  Covert: "#eb4b4b",
  Contraband: "#e4ae39",
  Extraordinary: "#e4ae39",
};

/* ── Mock skin listings database ── */
interface SkinListing {
  id: string;
  weapon: string;
  skin: string;
  rarity: string;
  float: number;
  patternIndex: number;
  price: number;
  marketplace: string;
  dealId: string;
}

const LISTINGS: SkinListing[] = [
  // AK-47 Asiimov
  { id: "1", weapon: "AK-47", skin: "Asiimov", rarity: "Covert", float: 0.1847, patternIndex: 523, price: 78.50, marketplace: "CSFloat", dealId: "csfloat" },
  { id: "2", weapon: "AK-47", skin: "Asiimov", rarity: "Covert", float: 0.2134, patternIndex: 891, price: 72.30, marketplace: "Skinport", dealId: "skinport" },
  { id: "3", weapon: "AK-47", skin: "Asiimov", rarity: "Covert", float: 0.3801, patternIndex: 44, price: 65.00, marketplace: "Buff163", dealId: "buff163" },
  // AWP Dragon Lore
  { id: "4", weapon: "AWP", skin: "Dragon Lore", rarity: "Covert", float: 0.0124, patternIndex: 661, price: 12500.00, marketplace: "CSFloat", dealId: "csfloat" },
  { id: "5", weapon: "AWP", skin: "Dragon Lore", rarity: "Covert", float: 0.0698, patternIndex: 102, price: 8200.00, marketplace: "DMarket", dealId: "dmarket" },
  { id: "6", weapon: "AWP", skin: "Dragon Lore", rarity: "Covert", float: 0.2541, patternIndex: 417, price: 3950.00, marketplace: "Buff163", dealId: "buff163" },
  { id: "7", weapon: "AWP", skin: "Dragon Lore", rarity: "Covert", float: 0.4512, patternIndex: 733, price: 2800.00, marketplace: "CSFloat", dealId: "csfloat" },
  // M4A4 Howl
  { id: "8", weapon: "M4A4", skin: "Howl", rarity: "Contraband", float: 0.0312, patternIndex: 155, price: 9800.00, marketplace: "CSFloat", dealId: "csfloat" },
  { id: "9", weapon: "M4A4", skin: "Howl", rarity: "Contraband", float: 0.1523, patternIndex: 802, price: 6500.00, marketplace: "Skinport", dealId: "skinport" },
  { id: "10", weapon: "M4A4", skin: "Howl", rarity: "Contraband", float: 0.3867, patternIndex: 210, price: 5200.00, marketplace: "Buff163", dealId: "buff163" },
  // Butterfly Knife Fade
  { id: "11", weapon: "Butterfly Knife", skin: "Fade", rarity: "Covert", float: 0.0089, patternIndex: 146, price: 2450.00, marketplace: "CSFloat", dealId: "csfloat" },
  { id: "12", weapon: "Butterfly Knife", skin: "Fade", rarity: "Covert", float: 0.0234, patternIndex: 412, price: 2100.00, marketplace: "DMarket", dealId: "dmarket" },
  { id: "13", weapon: "Butterfly Knife", skin: "Fade", rarity: "Covert", float: 0.0601, patternIndex: 998, price: 1920.00, marketplace: "Skinport", dealId: "skinport" },
  // Karambit Doppler Phase 2
  { id: "14", weapon: "Karambit", skin: "Doppler (Phase 2)", rarity: "Covert", float: 0.0087, patternIndex: 509, price: 1580.00, marketplace: "CSFloat", dealId: "csfloat" },
  { id: "15", weapon: "Karambit", skin: "Doppler (Phase 2)", rarity: "Covert", float: 0.0321, patternIndex: 274, price: 1340.00, marketplace: "Buff163", dealId: "buff163" },
  { id: "16", weapon: "Karambit", skin: "Doppler (Phase 2)", rarity: "Covert", float: 0.0654, patternIndex: 831, price: 1280.00, marketplace: "Skinport", dealId: "skinport" },
  // M4A1-S Printstream
  { id: "17", weapon: "M4A1-S", skin: "Printstream", rarity: "Covert", float: 0.0045, patternIndex: 77, price: 218.00, marketplace: "CSFloat", dealId: "csfloat" },
  { id: "18", weapon: "M4A1-S", skin: "Printstream", rarity: "Covert", float: 0.0712, patternIndex: 543, price: 145.00, marketplace: "DMarket", dealId: "dmarket" },
  { id: "19", weapon: "M4A1-S", skin: "Printstream", rarity: "Covert", float: 0.2341, patternIndex: 126, price: 118.00, marketplace: "Buff163", dealId: "buff163" },
  // Desert Eagle Blaze
  { id: "20", weapon: "Desert Eagle", skin: "Blaze", rarity: "Restricted", float: 0.0012, patternIndex: 362, price: 680.00, marketplace: "CSFloat", dealId: "csfloat" },
  { id: "21", weapon: "Desert Eagle", skin: "Blaze", rarity: "Restricted", float: 0.0089, patternIndex: 811, price: 520.00, marketplace: "Skinport", dealId: "skinport" },
  { id: "22", weapon: "Desert Eagle", skin: "Blaze", rarity: "Restricted", float: 0.0456, patternIndex: 190, price: 445.00, marketplace: "Buff163", dealId: "buff163" },
  // AWP Asiimov
  { id: "23", weapon: "AWP", skin: "Asiimov", rarity: "Covert", float: 0.1812, patternIndex: 645, price: 32.00, marketplace: "CSFloat", dealId: "csfloat" },
  { id: "24", weapon: "AWP", skin: "Asiimov", rarity: "Covert", float: 0.2567, patternIndex: 223, price: 28.50, marketplace: "Buff163", dealId: "buff163" },
  { id: "25", weapon: "AWP", skin: "Asiimov", rarity: "Covert", float: 0.9234, patternIndex: 900, price: 22.00, marketplace: "DMarket", dealId: "dmarket" },
  // Glock-18 Fade
  { id: "26", weapon: "Glock-18", skin: "Fade", rarity: "Restricted", float: 0.0012, patternIndex: 38, price: 1650.00, marketplace: "CSFloat", dealId: "csfloat" },
  { id: "27", weapon: "Glock-18", skin: "Fade", rarity: "Restricted", float: 0.0234, patternIndex: 514, price: 1320.00, marketplace: "Skinport", dealId: "skinport" },
  { id: "28", weapon: "Glock-18", skin: "Fade", rarity: "Restricted", float: 0.0589, patternIndex: 743, price: 1190.00, marketplace: "Buff163", dealId: "buff163" },
  // AK-47 Fire Serpent
  { id: "29", weapon: "AK-47", skin: "Fire Serpent", rarity: "Covert", float: 0.0801, patternIndex: 281, price: 1250.00, marketplace: "CSFloat", dealId: "csfloat" },
  { id: "30", weapon: "AK-47", skin: "Fire Serpent", rarity: "Covert", float: 0.1623, patternIndex: 409, price: 860.00, marketplace: "DMarket", dealId: "dmarket" },
  { id: "31", weapon: "AK-47", skin: "Fire Serpent", rarity: "Covert", float: 0.3721, patternIndex: 67, price: 720.00, marketplace: "Buff163", dealId: "buff163" },
  // Sport Gloves Pandora's Box
  { id: "32", weapon: "Sport Gloves", skin: "Pandora's Box", rarity: "Extraordinary", float: 0.1501, patternIndex: 0, price: 5200.00, marketplace: "CSFloat", dealId: "csfloat" },
  { id: "33", weapon: "Sport Gloves", skin: "Pandora's Box", rarity: "Extraordinary", float: 0.2874, patternIndex: 0, price: 4100.00, marketplace: "Skinport", dealId: "skinport" },
  { id: "34", weapon: "Sport Gloves", skin: "Pandora's Box", rarity: "Extraordinary", float: 0.3912, patternIndex: 0, price: 3600.00, marketplace: "Buff163", dealId: "buff163" },
  // USP-S Kill Confirmed
  { id: "35", weapon: "USP-S", skin: "Kill Confirmed", rarity: "Covert", float: 0.0034, patternIndex: 555, price: 142.00, marketplace: "CSFloat", dealId: "csfloat" },
  { id: "36", weapon: "USP-S", skin: "Kill Confirmed", rarity: "Covert", float: 0.0712, patternIndex: 834, price: 88.00, marketplace: "DMarket", dealId: "dmarket" },
  { id: "37", weapon: "USP-S", skin: "Kill Confirmed", rarity: "Covert", float: 0.2145, patternIndex: 112, price: 72.00, marketplace: "Buff163", dealId: "buff163" },
  // AWP Gungnir
  { id: "38", weapon: "AWP", skin: "Gungnir", rarity: "Covert", float: 0.0023, patternIndex: 991, price: 14500.00, marketplace: "CSFloat", dealId: "csfloat" },
  { id: "39", weapon: "AWP", skin: "Gungnir", rarity: "Covert", float: 0.0412, patternIndex: 200, price: 8900.00, marketplace: "Skinport", dealId: "skinport" },
  { id: "40", weapon: "AWP", skin: "Gungnir", rarity: "Covert", float: 0.0698, patternIndex: 567, price: 7800.00, marketplace: "Buff163", dealId: "buff163" },
  // AK-47 Case Hardened
  { id: "41", weapon: "AK-47", skin: "Case Hardened", rarity: "Classified", float: 0.0312, patternIndex: 661, price: 4500.00, marketplace: "CSFloat", dealId: "csfloat" },
  { id: "42", weapon: "AK-47", skin: "Case Hardened", rarity: "Classified", float: 0.1567, patternIndex: 387, price: 125.00, marketplace: "Buff163", dealId: "buff163" },
  { id: "43", weapon: "AK-47", skin: "Case Hardened", rarity: "Classified", float: 0.5421, patternIndex: 321, price: 68.00, marketplace: "DMarket", dealId: "dmarket" },
  // M9 Bayonet Crimson Web
  { id: "44", weapon: "M9 Bayonet", skin: "Crimson Web", rarity: "Covert", float: 0.0712, patternIndex: 448, price: 3200.00, marketplace: "CSFloat", dealId: "csfloat" },
  { id: "45", weapon: "M9 Bayonet", skin: "Crimson Web", rarity: "Covert", float: 0.1523, patternIndex: 110, price: 1850.00, marketplace: "Skinport", dealId: "skinport" },
  { id: "46", weapon: "M9 Bayonet", skin: "Crimson Web", rarity: "Covert", float: 0.3678, patternIndex: 755, price: 920.00, marketplace: "Buff163", dealId: "buff163" },
  // AK-47 Redline
  { id: "47", weapon: "AK-47", skin: "Redline", rarity: "Classified", float: 0.1512, patternIndex: 203, price: 18.50, marketplace: "CSFloat", dealId: "csfloat" },
  { id: "48", weapon: "AK-47", skin: "Redline", rarity: "Classified", float: 0.2234, patternIndex: 677, price: 14.00, marketplace: "Buff163", dealId: "buff163" },
  { id: "49", weapon: "AK-47", skin: "Redline", rarity: "Classified", float: 0.3512, patternIndex: 489, price: 12.50, marketplace: "DMarket", dealId: "dmarket" },
  // AWP Wildfire
  { id: "50", weapon: "AWP", skin: "Wildfire", rarity: "Covert", float: 0.0089, patternIndex: 311, price: 82.00, marketplace: "CSFloat", dealId: "csfloat" },
  { id: "51", weapon: "AWP", skin: "Wildfire", rarity: "Covert", float: 0.0712, patternIndex: 124, price: 54.00, marketplace: "Skinport", dealId: "skinport" },
  { id: "52", weapon: "AWP", skin: "Wildfire", rarity: "Covert", float: 0.1834, patternIndex: 856, price: 38.00, marketplace: "Buff163", dealId: "buff163" },
];

/* Get unique skin names for search suggestions */
const UNIQUE_SKINS = Array.from(
  new Set(LISTINGS.map((l) => `${l.weapon} | ${l.skin}`))
);

export default function FloatCheckerPage() {
  const [query, setQuery] = useState("");
  const [selectedSkin, setSelectedSkin] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showWearRef, setShowWearRef] = useState(false);

  const suggestions = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return UNIQUE_SKINS.filter((s) => s.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  const results = useMemo(() => {
    if (!selectedSkin) return [];
    return LISTINGS.filter(
      (l) => `${l.weapon} | ${l.skin}` === selectedSkin
    ).sort((a, b) => a.float - b.float);
  }, [selectedSkin]);

  const handleSelect = (skinName: string) => {
    setSelectedSkin(skinName);
    setQuery(skinName);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    const match = UNIQUE_SKINS.find((s) =>
      s.toLowerCase().includes(query.toLowerCase())
    );
    if (match) {
      setSelectedSkin(match);
      setQuery(match);
    }
    setShowSuggestions(false);
  };

  const lowestFloat = results.length > 0 ? results[0] : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
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
            Look up float values, wear tiers, and pattern indices for any CS2 skin. Find low-float gems across all major marketplaces.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="border-b border-gray-100 bg-white py-8">
        <div className="container-main max-w-3xl mx-auto">
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Search by Skin Name
          </label>
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. AK-47 Asiimov, AWP Dragon Lore, Butterfly Fade..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                    if (!e.target.value) setSelectedSkin(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSelect(s)}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600 transition-colors"
              >
                Check
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              {UNIQUE_SKINS.length} skins in database — prices from CSFloat, Skinport, Buff163 & DMarket
            </p>
          </div>
        </div>
      </section>

      {/* Results */}
      {selectedSkin && results.length > 0 && (
        <section className="py-8">
          <div className="container-main max-w-4xl mx-auto">
            {/* Skin header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="h-14 w-14 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                style={{ backgroundColor: RARITY_COLORS[results[0].rarity] || "#666" }}
              >
                {results[0].weapon.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedSkin}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="inline-block rounded px-2 py-0.5 text-[10px] font-bold text-white"
                    style={{ backgroundColor: RARITY_COLORS[results[0].rarity] || "#666" }}
                  >
                    {results[0].rarity}
                  </span>
                  <span className="text-sm text-gray-500">{results.length} listings found</span>
                </div>
              </div>
            </div>

            {/* Lowest float highlight */}
            {lowestFloat && (
              <div className="mb-6 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-bold text-blue-900">Lowest Float Found</span>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <p className="text-3xl font-black text-gray-900 font-mono">{lowestFloat.float.toFixed(10)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getWearTier(lowestFloat.float).name} — Pattern #{lowestFloat.patternIndex}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">${lowestFloat.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">on {lowestFloat.marketplace}</p>
                    </div>
                    <a
                      href={`/go/cs2/${lowestFloat.dealId}?from=float-checker`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      View on {lowestFloat.marketplace} <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {/* Float spectrum bar */}
                <div className="mt-4">
                  <div className="relative h-6 rounded-full overflow-hidden flex">
                    {WEAR_TIERS.map((tier) => (
                      <div
                        key={tier.name}
                        className="h-full"
                        style={{ width: tier.width, backgroundColor: tier.color, opacity: 0.7 }}
                      />
                    ))}
                    {/* Marker */}
                    <div
                      className="absolute top-0 h-full w-0.5 bg-gray-900"
                      style={{ left: `${lowestFloat.float * 100}%` }}
                    >
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded bg-gray-900 px-1.5 py-0.5 text-[9px] font-bold text-white whitespace-nowrap">
                        {lowestFloat.float.toFixed(4)}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-1 text-[9px] text-gray-400 font-mono">
                    <span>0.00</span>
                    <span>0.07</span>
                    <span>0.15</span>
                    <span>0.38</span>
                    <span>0.45</span>
                    <span>1.00</span>
                  </div>
                </div>
              </div>
            )}

            {/* All listings */}
            <h3 className="text-lg font-bold text-gray-900 mb-4">All Listings</h3>
            <div className="space-y-3">
              {results.map((listing, idx) => {
                const tier = getWearTier(listing.float);
                const isLowest = idx === 0;
                return (
                  <div
                    key={listing.id}
                    className={`rounded-xl border p-4 transition-shadow hover:shadow-md ${
                      isLowest ? "border-blue-200 bg-blue-50/30" : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Float + tier */}
                      <div className="sm:w-52 flex-shrink-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg font-bold font-mono text-gray-900">
                            {listing.float.toFixed(10)}
                          </span>
                          {isLowest && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                            style={{ backgroundColor: tier.color }}
                          >
                            {tier.name}
                          </span>
                        </div>
                      </div>

                      {/* Pattern + spectrum */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Target className="h-3.5 w-3.5" />
                            Pattern #{listing.patternIndex}
                          </div>
                        </div>
                        {/* Mini spectrum */}
                        <div className="relative h-3 rounded-full overflow-hidden flex">
                          {WEAR_TIERS.map((t) => (
                            <div key={t.name} className="h-full" style={{ width: t.width, backgroundColor: t.color, opacity: 0.5 }} />
                          ))}
                          <div
                            className="absolute top-0 h-full w-1 bg-gray-900 rounded-full"
                            style={{ left: `${listing.float * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Price + CTA */}
                      <div className="flex items-center gap-4 sm:w-56 flex-shrink-0 justify-end">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">${listing.price.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{listing.marketplace}</p>
                        </div>
                        <a
                          href={`/go/cs2/${listing.dealId}?from=float-checker`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition-colors"
                        >
                          Buy <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA after results */}
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link href="/cs2/prices" className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors">
                Compare All Prices
              </Link>
              <Link href="/cs2/compare" className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Compare Marketplaces
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {!selectedSkin && (
        <section className="py-12">
          <div className="container-main max-w-3xl mx-auto text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 mx-auto mb-4">
              <Search className="h-7 w-7 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Search for a skin to check its float</h2>
            <p className="text-sm text-gray-500 mb-6">
              Type a skin name above to see available listings with float values, wear tiers, and prices across marketplaces.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["AK-47 | Asiimov", "AWP | Dragon Lore", "Butterfly Knife | Fade", "M4A4 | Howl", "Desert Eagle | Blaze"].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSelect(s)}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Wear tier reference — collapsible */}
      <section className="py-8 border-t border-gray-100">
        <div className="container-main max-w-3xl mx-auto">
          <button
            onClick={() => setShowWearRef(!showWearRef)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${showWearRef ? "rotate-180" : ""}`} />
            Wear Tier Reference
          </button>

          {showWearRef && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="flex h-6">
                {WEAR_TIERS.map((tier) => (
                  <div key={tier.name} className="h-full" style={{ width: tier.width, backgroundColor: tier.color }} title={`${tier.name}: ${tier.min.toFixed(2)} – ${tier.max.toFixed(2)}`} />
                ))}
              </div>
              <div className="divide-y divide-gray-100">
                {WEAR_TIERS.map((tier) => (
                  <div key={tier.name} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: tier.color }} />
                      <span className="text-sm font-medium text-gray-900">{tier.name}</span>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">{tier.abbr}</span>
                    </div>
                    <span className="text-sm text-gray-500 font-mono">{tier.min.toFixed(2)} – {tier.max.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <AffiliateDisclosure />
    </div>
  );
}
