import Link from "next/link";
import { Calculator, ChevronLeft, ArrowRight, Info } from "lucide-react";

export default function TradeUpPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 py-10">
        <div className="container-main">
          <Link href="/cs2" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ChevronLeft className="h-4 w-4" /> CS2 Skins Hub
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
              <Calculator className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Trade-Up Calculator</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Calculate the expected value of trade-up contracts before you commit. Know exactly whether your trade-up is profitable.
          </p>
        </div>
      </section>

      <div className="container-main py-10">
        <div className="max-w-3xl mx-auto">
          {/* How it works */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">How Trade-Up Contracts Work</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="font-bold text-gray-900 mb-1">1. Input Skins</p>
                <p>Submit 10 skins of the same rarity from eligible collections.</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="font-bold text-gray-900 mb-1">2. Possible Outcomes</p>
                <p>You receive 1 skin of the next rarity tier from the input collections.</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="font-bold text-gray-900 mb-1">3. Float Calculation</p>
                <p>Output float is determined by the average float of your 10 inputs.</p>
              </div>
            </div>
          </div>

          {/* Coming soon notice */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 mb-8">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-900">Interactive Calculator Coming Soon</p>
                <p className="text-sm text-amber-700 mt-1 leading-relaxed">
                  We&apos;re building a full interactive trade-up calculator with skin search, automatic EV calculation, and float prediction. For now, check out the key trade-up insights below.
                </p>
              </div>
            </div>
          </div>

          {/* Key insights */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">Trade-Up Key Insights</h2>
          <div className="space-y-4 mb-10">
            {[
              {
                title: "Knives & Gloves Now Craftable",
                desc: "As of October 2025, Valve updated trade-ups to allow crafting knives and gloves. This massively increased the potential EV of certain trade-ups.",
              },
              {
                title: "Float Average Matters",
                desc: "The output float = average of all 10 input floats × (max float - min float) + min float. Control your inputs to target specific wear tiers.",
              },
              {
                title: "Collection Mixing Strategy",
                desc: "Using skins from multiple collections changes the outcome pool. Strategic mixing can increase your odds of getting expensive outcomes.",
              },
              {
                title: "Expected Value Formula",
                desc: "EV = Σ(probability of each outcome × market price of that outcome) - total cost of 10 inputs. Positive EV = profitable trade-up.",
              },
            ].map((insight) => (
              <div key={insight.title} className="rounded-lg border border-gray-200 bg-white p-5">
                <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{insight.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/cs2/prices" className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600 transition-colors">
              Find Trade-Up Inputs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
