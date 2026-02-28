import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Shield, BarChart3, Users, Scale } from "lucide-react";
import ScoreBadge from "@/components/analytics/ScoreBadge";

export const metadata: Metadata = {
  title: "Methodology — How the Lootboxes Score Works",
  description:
    "Our transparent methodology for rating in-game monetization fairness. Learn how we calculate the Lootboxes Score.",
};

export default function MethodologyPage() {
  return (
    <div className="pb-12">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-brand-50 to-white py-8 sm:py-10">
        <div className="container-main">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/analytics"
              className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Analytics
            </Link>

            <h1 className="text-3xl font-bold text-gray-900">
              How the Lootboxes Score Works
            </h1>
            <p className="mt-3 text-lg text-gray-500">
              Our mission is transparency. Here&apos;s exactly how we rate every
              game&apos;s monetization system.
            </p>
          </div>
        </div>
      </section>

      <div className="container-main mt-8">
        <div className="mx-auto max-w-3xl">
          {/* Score scale visual */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">The Score Scale</h2>
            <p className="mt-2 text-sm text-gray-500">
              The Lootboxes Score rates monetization fairness from 1 to 10.
              Higher is better for the player.
            </p>

            <div className="mt-6 space-y-3">
              {[
                { range: "9-10", label: "Excellent", desc: "Cosmetic-only, fair pricing, no predatory mechanics", color: "bg-success-100 text-success-800" },
                { range: "7-8", label: "Good", desc: "Minor concerns but overall player-friendly monetization", color: "bg-blue-100 text-blue-800" },
                { range: "5-6", label: "Mixed", desc: "Some value offered but notable concerns around pricing or mechanics", color: "bg-yellow-100 text-yellow-800" },
                { range: "3-4", label: "Poor", desc: "Aggressive monetization, poor value, or manipulative design", color: "bg-orange-100 text-orange-800" },
                { range: "1-2", label: "Predatory", desc: "Exploitative mechanics targeting vulnerable players, extreme pricing", color: "bg-red-100 text-red-800" },
              ].map((tier) => (
                <div key={tier.range} className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-gray-50">
                  <span className={`inline-flex items-center justify-center rounded-lg px-3 py-1 text-sm font-bold ${tier.color}`}>
                    {tier.range}
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">{tier.label}</span>
                    <p className="text-sm text-gray-500">{tier.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scoring criteria */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">Scoring Criteria</h2>
            <p className="mt-2 text-gray-500">
              Each game is evaluated across five weighted dimensions.
            </p>

            <div className="mt-6 space-y-4">
              {[
                {
                  icon: Scale,
                  title: "Value Proposition (25%)",
                  desc: "How much content do you get for your money? We compare the cost per item/hour against industry benchmarks and the base game price.",
                },
                {
                  icon: Shield,
                  title: "Transparency (25%)",
                  desc: "Are drop rates published? Are prices clear? Can you see exactly what you're buying? Games that hide odds or use obfuscated currency systems score lower.",
                },
                {
                  icon: Users,
                  title: "Player Impact (20%)",
                  desc: "Does spending money give gameplay advantages (pay-to-win) or is it purely cosmetic? Games with pay-to-win mechanics get significant penalties.",
                },
                {
                  icon: BarChart3,
                  title: "Pricing Fairness (20%)",
                  desc: "Are individual item prices reasonable relative to the base game? A $70 game selling $30 skins scores lower than a free game doing the same.",
                },
                {
                  icon: CheckCircle,
                  title: "Psychological Design (10%)",
                  desc: "Does the game use dark patterns like FOMO timers, artificial scarcity, or loss aversion mechanics to pressure spending?",
                },
              ].map((criterion) => (
                <div key={criterion.title} className="flex gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-100">
                    <criterion.icon className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{criterion.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{criterion.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Process */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">Our Process</h2>
            <article className="prose prose-gray mt-4 max-w-none prose-headings:text-gray-900">
              <p>
                Every analysis follows the same rigorous process. We purchase or play
                the game ourselves, document every monetization touchpoint, compare
                prices across regions, research community sentiment, and compile
                everything into a standardized scorecard.
              </p>
              <p>
                For games with randomized rewards (loot boxes, gacha), we either use
                officially published rates or conduct empirical testing with a
                statistically significant sample size. All data sources are disclosed
                in each article.
              </p>
              <p>
                Scores are reviewed quarterly to account for updates and changes to
                monetization systems. If a game improves its practices, we update the
                score accordingly — and vice versa.
              </p>
            </article>
          </div>

          {/* Example scores */}
          <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-bold text-gray-900">Example Scores</h2>
            <div className="mt-4 space-y-3">
              {[
                { game: "Baldur's Gate 3", score: 9.2, reason: "Zero microtransactions, full content included in purchase price" },
                { game: "Diablo IV", score: 5.2, reason: "Battle pass is fair value, but shop prices are aggressive" },
                { game: "Counter-Strike 2", score: 3.8, reason: "Opaque drop rates, skin gambling ecosystem, high-value rarity" },
                { game: "FIFA 25", score: 2.1, reason: "Pay-to-win Ultimate Team, undisclosed pack weights, aggressive FOMO" },
              ].map((example) => (
                <div key={example.game} className="flex items-center gap-4 rounded-lg bg-white p-3 shadow-sm">
                  <ScoreBadge score={example.score} size="lg" />
                  <div>
                    <span className="text-sm font-semibold text-gray-900">{example.game}</span>
                    <p className="text-xs text-gray-500">{example.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500">
              Disagree with a score? We welcome constructive feedback.
            </p>
            <a
              href="mailto:contact@lootboxes.com"
              className="mt-2 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Send us your thoughts →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
