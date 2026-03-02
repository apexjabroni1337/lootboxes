import { Metadata } from "next";
import Link from "next/link";
import {
  Eye,
  Shield,
  ShieldCheck,
  DollarSign,
  Scale,
  Swords,
  Gamepad2,
  Brain,
  BarChart3,
  BookOpen,
  HelpCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import {
  SCORE_CATEGORIES,
  SCORE_TIERS,
  METHODOLOGY_VERSION,
  METHODOLOGY_DATE,
} from "@/lib/scoring";

export const metadata: Metadata = {
  title: "How We Rate Games — Lootboxes Score Methodology",
  description:
    "Our transparent, criteria-based rating system for evaluating game monetization. Learn exactly how we score loot boxes, gacha systems, and in-game purchases.",
};

const ICON_MAP: Record<string, React.ReactNode> = {
  Eye: <Eye className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  DollarSign: <DollarSign className="w-5 h-5" />,
  Scale: <Scale className="w-5 h-5" />,
  Swords: <Swords className="w-5 h-5" />,
  Gamepad2: <Gamepad2 className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
};

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Is the Lootboxes Score subjective?",
    answer:
      "No. Each sub-score is determined by specific, measurable criteria. A game either publishes drop rates or it doesn't; a pity system either exists with known thresholds or it doesn't. We document the evidence for every score and make it reproducible. What is intentional is our choice of which criteria matter — we weight Consumer Protection highest because informed consent is the foundation of fair monetization.",
  },
  {
    question: "How often do you update scores?",
    answer:
      "Scores are re-evaluated quarterly and immediately after major monetization patches. Games change regularly: a patch adding a pity system, a region-specific compliance change, or a new spending limit feature can all shift a score. We track version history for every game and explain what changed.",
  },
  {
    question: "Can game developers dispute their score?",
    answer:
      "Yes. If a developer believes we've misunderstood their monetization system, missed a feature, or made a factual error, they can submit evidence through our feedback form. We review all disputes and will update a score if the evidence warrants it. Any changes are documented with a version note explaining the revision.",
  },
  {
    question: "Why is Consumer Protection weighted highest?",
    answer:
      "Because transparency and informed consent are the bedrock of fair monetization. A system can be cosmetic-only (good P2W score) but still exploit vulnerable players through psychological manipulation and hidden odds. Conversely, a system with strong disclosure and safeguards is ethical even if pricey. Consumer Protection (40%) ensures players can make informed decisions; the other categories evaluate whether those decisions are rewarded with good value.",
  },
  {
    question: "Do you accept payment for higher scores?",
    answer:
      "Absolutely not. Our scoring is independent and advertiser-free. We don't accept sponsorships from game publishers, and no amount of money will change a score. Our credibility depends entirely on our reputation for honesty.",
  },
  {
    question: "How do you handle games with multiple monetization systems?",
    answer:
      "Many games mix gacha, battle passes, cosmetic shops, and seasonal content. We evaluate the entire ecosystem: if 90% of desirable content is locked behind gacha but 10% is available via battle pass, the overall Player Control score reflects that mix. We score based on the player's realistic experience, not the best-case scenario.",
  },
  {
    question: "Where can I see how my favorite game scored?",
    answer:
      "Visit the Loot Box Database and search by title. Every scored game has a detailed breakdown showing all 8 sub-scores, the data sources we used, and the version history. If your favorite game isn't listed yet, you can submit it through the feedback form to request a review.",
  },
];

function ScaleVisualization() {
  const exampleGames = [
    { title: "EA FC 25", score: 2.1, position: 10 },
    { title: "Genshin Impact", score: 3.2, position: 20 },
    { title: "Overwatch 2", score: 4.5, position: 35 },
    { title: "Valorant", score: 7.2, position: 65 },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-4">The 1-10 Scale</h3>

      {/* Color bands */}
      <div className="flex h-12 rounded-lg overflow-hidden mb-6 border border-gray-200">
        <div className="flex-1 bg-red-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">1-3: Poor</span>
        </div>
        <div className="flex-1 bg-amber-400 flex items-center justify-center">
          <span className="text-amber-900 text-xs font-bold">4-6: Fair</span>
        </div>
        <div className="flex-1 bg-emerald-400 flex items-center justify-center">
          <span className="text-emerald-900 text-xs font-bold">7-8: Good</span>
        </div>
        <div className="flex-1 bg-emerald-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">9-10: Excellent</span>
        </div>
      </div>

      {/* Example games */}
      <div className="space-y-3">
        {exampleGames.map((game) => (
          <div key={game.title}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-900">
                {game.title}
              </span>
              <span className="text-sm font-bold text-gray-600">
                {game.score}
              </span>
            </div>
            <div className="w-full h-6 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
              <div
                className={`h-full ${
                  game.score >= 9
                    ? "bg-emerald-500"
                    : game.score >= 7
                      ? "bg-emerald-400"
                      : game.score >= 4
                        ? "bg-amber-400"
                        : "bg-red-500"
                }`}
                style={{ width: `${game.position}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="font-semibold text-red-600 mb-1">1-3: Poor</div>
          <p className="text-gray-600">Predatory or exploitative monetization</p>
        </div>
        <div>
          <div className="font-semibold text-amber-600 mb-1">4-6: Fair</div>
          <p className="text-gray-600">Mixed practices, room for improvement</p>
        </div>
        <div>
          <div className="font-semibold text-emerald-600 mb-1">7-8: Good</div>
          <p className="text-gray-600">Above-average, consumer-friendly</p>
        </div>
        <div>
          <div className="font-semibold text-emerald-700 mb-1">
            9-10: Excellent
          </div>
          <p className="text-gray-600">Industry-leading practices</p>
        </div>
      </div>
    </div>
  );
}

function CriteriaTable({ subScore }: { subScore: typeof SCORE_CATEGORIES[0]["subScores"][0] }) {
  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">
              Score
            </th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">
              Rating
            </th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">
              What This Means
            </th>
          </tr>
        </thead>
        <tbody>
          {subScore.criteria.map((criterion, idx) => {
            let bgColor = "bg-white";

            if (criterion.range[0] >= 9) {
              bgColor = "bg-emerald-50";
            } else if (criterion.range[0] >= 7) {
              bgColor = "bg-emerald-50";
            } else if (criterion.range[0] >= 4) {
              bgColor = "bg-amber-50";
            } else {
              bgColor = "bg-red-50";
            }

            return (
              <tr
                key={idx}
                className={`border-b border-gray-200 last:border-b-0 ${bgColor}`}
              >
                <td className="px-4 py-3 font-bold text-gray-900">
                  {criterion.range[0]}-{criterion.range[1]}
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {criterion.label}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {criterion.description}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function MethodologyPage() {
  return (
    <div className="container-main py-8">
      {/* Hero */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            How We Rate Games
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mb-3">
          Our transparent, criteria-based methodology for evaluating game
          monetization. Every score is documented, reproducible, and open to
          scrutiny.
        </p>
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 text-sm">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-900">
            Methodology v{METHODOLOGY_VERSION} — {METHODOLOGY_DATE}
          </span>
        </div>
      </div>

      {/* Scale Section */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          The Lootboxes Scale (1-10)
        </h2>
        <ScaleVisualization />
      </div>

      {/* Three Categories Section */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Three Scoring Categories
        </h2>

        <div className="space-y-10">
          {SCORE_CATEGORIES.map((category) => (
            <div key={category.id}>
              {/* Category Card Header */}
              <div
                className={`rounded-xl border ${category.borderColor} ${category.bgColor} p-6 mb-6`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {category.name}
                    </h3>
                    <p className={`text-sm font-semibold ${category.color}`}>
                      Weight: {Math.round(category.weight * 100)}%
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{category.description}</p>
                <div className="bg-white bg-opacity-60 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">
                      Why It Matters:
                    </span>{" "}
                    {category.whyItMatters}
                  </p>
                </div>
              </div>

              {/* Sub-scores */}
              <div className="space-y-8 ml-0">
                {category.subScores.map((subScore) => (
                  <div key={subScore.key}>
                    {/* Sub-score Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`${subScore.iconColor}`}>
                        {ICON_MAP[subScore.icon]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {subScore.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {subScore.description}
                        </p>
                      </div>
                    </div>

                    {/* Criteria Table */}
                    <CriteriaTable subScore={subScore} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How We Calculate */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          How We Calculate Your Score
        </h2>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 mb-6">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">
            The Weighted Formula
          </h3>
          <div className="bg-white rounded-lg p-6 border border-blue-200 mb-6">
            <code className="text-sm font-mono text-blue-900">
              Overall = (Consumer Protection avg × 0.40) + (Value & Fairness
              avg × 0.35) + (Player Experience avg × 0.25)
            </code>
          </div>

          <h3 className="font-bold text-gray-900 mb-4">
            Worked Example: Genshin Impact
          </h3>
          <div className="space-y-4 text-sm text-gray-700">
            <div className="grid grid-cols-3 gap-4 font-mono">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">
                  Category Scores
                </p>
                <p>Consumer Protection:</p>
                <p>Value & Fairness:</p>
                <p>Player Experience:</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">
                  Calculation
                </p>
                <p>(7 + 8 + 3) / 3 = 6.0</p>
                <p>(2 + 3 + 8) / 3 = 4.3</p>
                <p>(3 + 3) / 2 = 3.0</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">
                  Weighted
                </p>
                <p>6.0 × 0.40 = 2.40</p>
                <p>4.3 × 0.35 = 1.51</p>
                <p>3.0 × 0.25 = 0.75</p>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-4 mt-4">
              <p className="font-bold text-gray-900 text-base">
                Overall Score: 2.40 + 1.51 + 0.75 = 4.66 → rounds to{" "}
                <span className="text-amber-600">4.7 (Fair)</span>
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">Why these weights?</span> Consumer
              Protection is weighted highest (40%) because informed consent is
              the foundation of fair monetization. A system can be
              consumer-friendly in value but exploitative in design. Without
              transparency and safeguards, players cannot make genuinely
              informed decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Our Data Sources
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Shield className="w-6 h-6" />,
              color: "text-blue-600",
              title: "Official Disclosures",
              desc: "Drop rates published directly by the developer, often required by law. China, Japan, South Korea, and Apple/Google all mandate these.",
              examples: "Genshin gacha rates, Honkai Star Rail pull odds, etc.",
            },
            {
              icon: <Eye className="w-6 h-6" />,
              color: "text-emerald-600",
              title: "Community Research",
              desc: "Large-sample empirical testing and rate verification by trusted independent researchers and data-mining communities.",
              examples:
                "Rate verification from 100k+ player samples, third-party simulations, etc.",
            },
            {
              icon: <BookOpen className="w-6 h-6" />,
              color: "text-purple-600",
              title: "User Submissions",
              desc: "Aggregated player reports and feedback that help us spot discrepancies and flag games for re-review.",
              examples:
                "Player-reported pity thresholds, budget documentation, feature changes.",
            },
          ].map((source, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <div className={`mb-3 ${source.color}`}>{source.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{source.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{source.desc}</p>
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">Examples:</span>{" "}
                {source.examples}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">Cross-referencing & Verification:</span> We
            require multiple independent sources before publishing a score. If
            official and community data disagree, we flag the game for manual
            review and note the discrepancy in our database.
          </p>
        </div>
      </div>

      {/* Score Updates */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Score Updates & Version History
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-700">
              Scores are <span className="font-semibold">living documents</span>.
              When a game receives a major monetization patch, changes its
              regional pricing, or adds new safeguards, we re-evaluate and
              publish a new score version. All changes are documented with the
              date and reason for the update.
            </p>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  Version
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  Changes
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-blue-600">v2.0</td>
                <td className="px-6 py-4 text-gray-600">March 2026</td>
                <td className="px-6 py-4 text-gray-600">
                  Introduced three-category framework with 8 sub-scores and
                  weighted calculation
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-500">v1.0</td>
                <td className="px-6 py-4 text-gray-600">Initial Release</td>
                <td className="px-6 py-4 text-gray-600">
                  Original 4-score system (Transparency, Value, Fairness,
                  Control)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => (
            <details
              key={idx}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden group"
            >
              <summary className="px-6 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 flex items-center justify-between">
                <span>{item.question}</span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-gray-700 text-sm">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/lootbox"
          className="group flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all"
        >
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              Browse the Loot Box Database
            </h3>
            <p className="text-sm text-gray-600">
              See how every game scores in our database
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/drop-rates"
          className="group flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-6 hover:shadow-lg hover:border-emerald-300 transition-all"
        >
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
              View Drop Rate Database
            </h3>
            <p className="text-sm text-gray-600">
              Raw odds and rate data for every game
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-600 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
