import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  Package,
  Sparkles,
  Dices,
  Calendar,
  Layers,
  ExternalLink,
} from "lucide-react";
import { getCrateBySlug, getCrateItems, crateSlug } from "@/lib/cs2-cases";

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const crate = await getCrateBySlug(slug);
  if (!crate) return { title: "Case Not Found | LootBoxes" };

  return {
    title: `${crate.name} — All Skins & Contents | LootBoxes`,
    description: `See every skin inside the ${crate.name}. Full item list with images, rarities, and drop tiers. ${crate.description || ""}`,
    openGraph: {
      title: `${crate.name} — CS2 Case Contents`,
      description: `Every item inside the ${crate.name} with images and rarity info.`,
      url: `https://lootboxes.com/cs2/cases/${crateSlug(crate.name)}`,
      images: crate.image ? [{ url: crate.image }] : undefined,
    },
    alternates: {
      canonical: `https://lootboxes.com/cs2/cases/${crateSlug(crate.name)}`,
    },
  };
}

// Rarity display colors
const RARITY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  "Covert": { bg: "bg-red-50", border: "border-red-200", text: "text-red-600" },
  "Classified": { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-600" },
  "Restricted": { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-600" },
  "Mil-Spec Grade": { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600" },
  "Mil-Spec": { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600" },
  "Industrial Grade": { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-600" },
  "Consumer Grade": { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-600" },
  "Base Grade": { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-500" },
  "Distinguished": { bg: "bg-red-50", border: "border-red-200", text: "text-red-600" },
  "Exceptional": { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-600" },
  "Superior": { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-600" },
  "High Grade": { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-600" },
  "Remarkable": { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-600" },
  "Exotic": { bg: "bg-red-50", border: "border-red-200", text: "text-red-600" },
  "Extraordinary": { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700" },
  "Master": { bg: "bg-red-50", border: "border-red-200", text: "text-red-600" },
};

function getRarityStyle(rarity: string) {
  return RARITY_COLORS[rarity] || { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-600" };
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const crate = await getCrateBySlug(slug);
  if (!crate) notFound();

  const items = await getCrateItems(crate.id);
  const normalItems = items.filter((i) => !i.is_rare_special);
  const rareItems = items.filter((i) => i.is_rare_special);

  // Group normal items by rarity
  const itemsByRarity: Record<string, typeof normalItems> = {};
  for (const item of normalItems) {
    const key = item.rarity_name;
    if (!itemsByRarity[key]) itemsByRarity[key] = [];
    itemsByRarity[key].push(item);
  }

  // Known rarity order
  const rarityOrder = [
    "Covert",
    "Classified",
    "Restricted",
    "Mil-Spec Grade",
    "Mil-Spec",
    "Industrial Grade",
    "Consumer Grade",
    "Base Grade",
    "Distinguished",
    "Exceptional",
    "Superior",
    "High Grade",
    "Remarkable",
    "Exotic",
    "Master",
  ];

  const orderedRarities = Object.keys(itemsByRarity).sort((a, b) => {
    const ai = rarityOrder.indexOf(a);
    const bi = rarityOrder.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const isWeaponCase = crate.type === "Weapon Case";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-12">
      {/* Hero */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 dark:from-gray-900 via-gray-50 to-amber-50 dark:to-amber-950/20 py-10">
        <div className="container-main">
          <Link
            href="/cs2/cases"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-200 mb-4"
          >
            <ChevronLeft className="h-4 w-4" /> All Cases & Capsules
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Case image */}
            <div className="w-48 h-48 flex-shrink-0 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-4 flex items-center justify-center shadow-sm">
              {crate.image ? (
                <img
                  src={crate.image}
                  alt={crate.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Package className="h-20 w-20 text-gray-300" />
              )}
            </div>

            {/* Info */}
            <div>
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 mb-2">
                {crate.type}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{crate.name}</h1>
              {crate.description && (
                <p className="text-gray-600 dark:text-gray-300 mt-1 max-w-lg">{crate.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                  <Layers className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <span className="font-semibold">{items.length}</span> items
                </div>
                {crate.first_sale_date && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    Released {crate.first_sale_date}
                  </div>
                )}
                {rareItems.length > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-yellow-700">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">{rareItems.length}</span> rare special items
                  </div>
                )}
              </div>

              {/* CTAs */}
              {isWeaponCase && (
                <div className="flex gap-3 mt-5">
                  <Link
                    href="/cs2/simulator"
                    className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
                  >
                    <Dices className="h-4 w-4" />
                    Open in Simulator
                  </Link>
                  <Link
                    href="/cs2/prices"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Check Prices
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Items by rarity */}
      <div className="container-main mt-8 space-y-8">
        {orderedRarities.map((rarity) => {
          const tierItems = itemsByRarity[rarity];
          const style = getRarityStyle(rarity);
          const sampleColor = tierItems[0]?.rarity_color;

          return (
            <section key={rarity}>
              <div className="flex items-center gap-3 mb-4">
                {sampleColor && (
                  <div
                    className="h-4 w-4 rounded-full ring-2 ring-offset-1"
                    style={{ backgroundColor: sampleColor, ["--tw-ring-color" as any]: sampleColor }}
                  />
                )}
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{rarity}</h2>
                <span className="text-sm text-gray-400 dark:text-gray-500">({tierItems.length} skins)</span>
              </div>

              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {tierItems.map((item) => (
                  <div
                    key={item.id}
                    className={`group flex flex-col items-center rounded-xl border ${style.border} ${style.bg} p-3 hover:shadow-md transition-all`}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-24 w-24 object-contain mb-2 group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="h-24 w-24 rounded-lg flex items-center justify-center text-white text-2xl font-bold mb-2"
                        style={{ backgroundColor: item.rarity_color || "#666" }}
                      >
                        {item.name.split("|")[0]?.trim().charAt(0) || "?"}
                      </div>
                    )}
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 text-center leading-tight line-clamp-2">
                      {item.name}
                    </p>
                    <span className={`mt-1 text-[10px] font-bold ${style.text}`}>
                      {rarity}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* Rare special items */}
        {rareItems.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Rare Special Items</h2>
              <span className="text-sm text-gray-400 dark:text-gray-500">
                ({rareItems.length} knives/gloves) — 0.26% drop chance
              </span>
            </div>

            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {rareItems.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col items-center rounded-xl border border-yellow-200 dark:border-yellow-700/30 bg-yellow-50 dark:bg-yellow-950/30 p-3 hover:shadow-md transition-all"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 object-contain mb-2 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-lg flex items-center justify-center text-white text-2xl font-bold mb-2 bg-yellow-600">
                      ★
                    </div>
                  )}
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 text-center leading-tight line-clamp-2">
                    {item.name}
                  </p>
                  <span className="mt-1 text-[10px] font-bold text-yellow-700">
                    Rare Special ★
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
