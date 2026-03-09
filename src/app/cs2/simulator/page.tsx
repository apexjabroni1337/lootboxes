import Link from "next/link";
import { Dices, ChevronLeft } from "lucide-react";
import { getWeaponCases, getCrateItems } from "@/lib/cs2-cases";
import CS2NewsletterCTA from "@/components/cs2/CS2NewsletterCTA";
import SimulatorClient from "./SimulatorClient";

export const revalidate = 86400; // Cases change rarely — revalidate daily

export default async function CS2SimulatorPage() {
  // Fetch all weapon cases from DB
  const cases = await getWeaponCases();

  // Fetch items for every case in parallel
  const itemEntries = await Promise.all(
    cases.map(async (c) => {
      const items = await getCrateItems(c.id);
      return [c.id, items] as const;
    })
  );
  const itemsByCase: Record<string, any[]> = {};
  for (const [id, items] of itemEntries) {
    itemsByCase[id] = items;
  }

  // Serialize case data for client
  const caseData = cases.map((c) => ({
    id: c.id,
    name: c.name,
    image: c.image,
    first_sale_date: c.first_sale_date,
    type: c.type,
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 py-10">
        <div className="container-main">
          <Link
            href="/cs2"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ChevronLeft className="h-4 w-4" /> CS2 Skins Hub
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white">
              <Dices className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Case Opening Simulator</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Open CS2 cases with real Valve drop rates and real case contents — completely free.
            Every case, every skin, accurate to the game. See how much you&apos;d actually spend to get that knife.
          </p>
          {cases.length > 0 && (
            <p className="text-sm text-gray-400 mt-2">
              {cases.length} weapon cases available with real item pools
            </p>
          )}
        </div>
      </section>

      {/* Simulator */}
      {cases.length > 0 ? (
        <SimulatorClient cases={caseData} itemsByCase={itemsByCase} />
      ) : (
        <div className="container-main py-16 text-center">
          <Dices className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Loading Case Data...</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            The CS2 case database is being populated. Please check back shortly.
          </p>
        </div>
      )}

      {/* Newsletter */}
      <div className="border-t border-gray-100 py-8">
        <div className="container-main">
          <CS2NewsletterCTA />
        </div>
      </div>
    </div>
  );
}
