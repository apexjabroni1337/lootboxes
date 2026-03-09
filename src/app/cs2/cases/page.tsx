import Link from "next/link";
import { ChevronLeft, Package, Dices, Calendar, Layers } from "lucide-react";
import { getAllCrates, getCrateTypes, crateSlug } from "@/lib/cs2-cases";
import { createServerClient } from "@/lib/supabase";

export const metadata = {
  title: "All CS2 Cases & Capsules — Complete Database | LootBoxes",
  description:
    "Browse every CS2 weapon case, sticker capsule, and souvenir package ever released. See what's inside each case with full item lists and skin images.",
  openGraph: {
    title: "All CS2 Cases & Capsules — Complete Database",
    description:
      "Every weapon case, capsule, and souvenir package in Counter-Strike 2.",
    url: "https://lootboxes.com/cs2/cases",
    type: "website",
  },
  alternates: { canonical: "https://lootboxes.com/cs2/cases" },
};

export const revalidate = 86400;

export default async function CS2CasesPage() {
  const supabase = createServerClient();

  // Fetch all crates
  const crates = await getAllCrates();

  // Fetch item counts per crate in a single query
  const { data: countData } = await supabase
    .from("cs2_crate_items")
    .select("crate_id");

  const itemCounts: Record<string, number> = {};
  for (const row of countData || []) {
    itemCounts[row.crate_id] = (itemCounts[row.crate_id] || 0) + 1;
  }

  // Get crate types for filtering
  const types = await getCrateTypes();

  // Group crates by type
  const cratesByType: Record<string, typeof crates> = {};
  for (const crate of crates) {
    if (!cratesByType[crate.type]) cratesByType[crate.type] = [];
    cratesByType[crate.type].push(crate);
  }

  // Order types: Weapon Case first, then alphabetical
  const orderedTypes = [
    "Weapon Case",
    ...types.filter((t) => t !== "Weapon Case").sort(),
  ].filter((t) => cratesByType[t]?.length > 0);

  return (
    <div className="min-h-screen bg-white pb-12">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 py-10">
        <div className="container-main">
          <Link
            href="/cs2"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ChevronLeft className="h-4 w-4" /> CS2 Skins Hub
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
              <Package className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              CS2 Cases & Capsules
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Every weapon case, sticker capsule, and souvenir package ever released in
            Counter-Strike 2 and CS:GO. Browse contents, see every skin, and try your
            luck in our simulator.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mt-5">
            <div className="rounded-lg border border-amber-200 bg-white px-4 py-2">
              <p className="text-2xl font-black text-gray-900">{crates.length}</p>
              <p className="text-[11px] text-gray-500 font-medium">Total Crates</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-white px-4 py-2">
              <p className="text-2xl font-black text-gray-900">{types.length}</p>
              <p className="text-[11px] text-gray-500 font-medium">Categories</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-white px-4 py-2">
              <p className="text-2xl font-black text-gray-900">
                {Object.values(itemCounts).reduce((a, b) => a + b, 0).toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-500 font-medium">Total Items</p>
            </div>
          </div>
        </div>
      </section>

      {/* Jump nav */}
      <div className="container-main mt-6 mb-8">
        <div className="flex flex-wrap gap-2">
          {orderedTypes.map((type) => (
            <a
              key={type}
              href={`#${type.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-colors"
            >
              {type} ({cratesByType[type].length})
            </a>
          ))}
        </div>
      </div>

      {/* Crate sections by type */}
      <div className="container-main space-y-12">
        {orderedTypes.map((type) => {
          const typeCrates = cratesByType[type];
          return (
            <section key={type} id={type.toLowerCase().replace(/\s+/g, "-")}>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-6 rounded-full bg-amber-400" />
                <h2 className="text-xl font-bold text-gray-900">{type}</h2>
                <span className="text-sm text-gray-400">({typeCrates.length})</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {typeCrates.map((crate) => {
                  const count = itemCounts[crate.id] || 0;
                  const slug = crateSlug(crate.name);
                  const isWeaponCase = type === "Weapon Case";

                  return (
                    <Link
                      key={crate.id}
                      href={`/cs2/cases/${slug}`}
                      className="group flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all"
                    >
                      {/* Image */}
                      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 relative">
                        {crate.image ? (
                          <img
                            src={crate.image}
                            alt={crate.name}
                            className="h-full w-full object-contain group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        ) : (
                          <Package className="h-16 w-16 text-gray-300" />
                        )}
                        {isWeaponCase && (
                          <div className="absolute top-2 right-2">
                            <Dices className="h-4 w-4 text-purple-400" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-3 border-t border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
                          {crate.name}
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-1 text-[11px] text-gray-500">
                            <Layers className="h-3 w-3" />
                            {count} items
                          </div>
                          {crate.first_sale_date && (
                            <div className="flex items-center gap-1 text-[11px] text-gray-400">
                              <Calendar className="h-3 w-3" />
                              {crate.first_sale_date.substring(0, 4)}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
