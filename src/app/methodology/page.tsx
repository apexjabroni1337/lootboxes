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
  ChevronDown,
} from "lucide-react";
import {
  SCORE_CATEGORIES,
  SCORE_TIERS,
  METHODOLOGY_VERSION,
  METHODOLOGY_DATE,
} from "@/lib/scoring";

export const metadata: Metadata = {
  title: "How We Rate Games — LootBoxes Score Methodology",
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
    question: "Is the LootBoxes Score subjective?",
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
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 shadow-lg">
      <h3 className="font-bold text-white text-lg mb-5">The 1-10 Scale</h3>

      {/* Color bands */}
      <div className="flex h-14 rounded-xl overflow-hidden mb-8 ring-1 ring-white/10">
        <div className="flex-1 bg-gradient-to-b from-red-500 to-red-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold drop-shadow">1-3: Poor</span>
        </div>
        <div className="flex-1 bg-gradient-to-b from-amber-400 to-amber-500 flex items-center justify-center">
          <span className="text-amber-950 text-xs font-bold">4-6: Fair</span>
        </div>
        <div className="flex-1 bg-gradient-to-b from-emerald-400 to-emerald-500 flex items-center justify-center">
          <span className="text-emerald-950 text-xs font-bold">7-8: Good</span>
        </div>
        <div className="flex-1 bg-gradient-to-b from-emerald-500 to-teal-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold drop-shadow">9-10: Excellent</span>
        </div>
      </div>

      {/* Example games */}
      <div className="space-y-4">
        {exampleGames.map((game) => (
          <div key={game.title}>
            <div className="flex justify-between mb-1.5">
              <span className="text-sm font-semibold text-white">
                {game.title}
              </span>
              <span className={`text-sm font-bold ${
                game.score >= 7 ? "text-emerald-400" : game.score >= 4 ? "text-amber-400" : "text-red-400"
              }`}>
                {game.score}
              </span>
            </div>
            <div className="w-full h-7 bg-white/10 rounded-lg overflow-hidden relative ring-1 ring-white/5">
              <div
                className={`h-full rounded-lg ${
                  game.score >= 9
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : game.score >= 7
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                      : game.score >= 4
                        ? "bg-gradient-to-r from-amber-500 to-amber-400"
                        : "bg-gradient-to-r from-red-500 to-red-400"
                }`}
                style={{ width: `${game.position}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 grid grid-cols-2 gap-4 text-xs">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 h-3 w-3 rounded-sm bg-red-500 flex-shrink-0" />
          <div>
            <div className="font-bold text-red-400 mb-0.5">1-3: Poor</div>
            <p className="text-gray-400">Predatory or exploitative monetization</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-0.5 h-3 w-3 rounded-sm bg-amber-400 flex-shrink-0" />
          <div>
            <div className="font-bold text-amber-400 mb-0.5">4-6: Fair</div>
            <p className="text-gray-400">Mixed practices, room for improvement</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-0.5 h-3 w-3 rounded-sm bg-emerald-400 flex-shrink-0" />
          <div>
            <div className="font-bold text-emerald-400 mb-0.5">7-8: Good</div>
            <p className="text-gray-400">Above-average, consumer-friendly</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-0.5 h-3 w-3 rounded-sm bg-teal-500 flex-shrink-0" />
          <div>
            <div className="font-bold text-teal-400 mb-0.5">9-10: Excellent</div>
            <p className="text-gray-400">Industry-leading practices</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CriteriaTable({ subScore }: { subScore: typeof SCORE_CATEGORIES[0]["subScores"][0] }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Score</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Rating</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">What This Means</th>
          </tr>
        </thead>
        <tbody>
          {subScore.criteria.map((criterion, idx) => {
            let bgColor = "bg-white";
            if (criterion.range[0] >= 9) bgColor = "bg-emerald-50";
            else if (criterion.range[0] >= 7) bgColor = "bg-emerald-50";
            else if (criterion.range[0] >= 4) bgColor = "bg-amber-50";
            else bgColor = "bg-red-50";

            return (
              <tr key={idx} className={`border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${bgColor}`}>
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">
                  {criterion.range[0]}-{criterion.range[1]}
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{criterion.label}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{criterion.description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Collapsible section wrapper using native <details> (zero JS) ── */
function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
  icon,
  badge,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
}) {
  return (
    <details
      open={defaultOpen || undefined}
      className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 overflow-hidden shadow-sm"
    >
      <summary className="flex items-center justify-between gap-3 px-6 py-4 cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          {icon}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          {badge && (
            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-6">
        {children}
      </div>
    </details>
  );
}

/* ── Collapsible sub-section (for items inside a category) ── */
function CollapsibleSubSection({
  title,
  subtitle,
  icon,
  iconColor,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open={defaultOpen || undefined}
      className="group/sub rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden"
    >
      <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          {icon && <div className={iconColor}>{icon}</div>}
          <div className="min-w-0">
            <h4 className="font-bold text-gray-900 dark:text-white">{title}</h4>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{subtitle}</p>
            )}
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-transform group-open/sub:rotate-180" />
      </summary>
      <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-4 bg-gray-50 dark:bg-gray-900/30">
        {children}
      </div>
    </details>
  );
}

export default function MethodologyPage() {
  return (
    <div className="container-main py-8">
      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            How We Rate Games
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mb-3">
          Our transparent, criteria-based methodology for evaluating game
          monetization. Every score is documented, reproducible, and open to
          scrutiny.
        </p>
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 rounded-lg px-3 py-1.5 text-sm">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-900">
            Methodology v{METHODOLOGY_VERSION} — {METHODOLOGY_DATE}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* ── Scale Section ── */}
        <CollapsibleSection title="The LootBoxes Scale (1-10)" defaultOpen>
          <ScaleVisualization />
        </CollapsibleSection>

        {/* ── Three Categories ── */}
        {SCORE_CATEGORIES.map((category, catIdx) => (
          <CollapsibleSection
            key={category.id}
            title={category.name}
            defaultOpen={catIdx === 0}
            badge={`Weight: ${Math.round(category.weight * 100)}%`}
            icon={
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                catIdx === 0 ? "bg-blue-100 text-blue-600" :
                catIdx === 1 ? "bg-emerald-100 text-emerald-600" :
                "bg-purple-100 text-purple-600"
              }`}>
                {catIdx === 0 ? <Shield className="w-4 h-4" /> :
                 catIdx === 1 ? <DollarSign className="w-4 h-4" /> :
                 <Gamepad2 className="w-4 h-4" />}
              </div>
            }
          >
            {/* Category overview */}
            <div className={`rounded-lg border ${category.borderColor} ${category.bgColor} p-5 mb-5`}>
              <p className="text-gray-700 dark:text-gray-200 mb-3">{category.description}</p>
              <div className="bg-white dark:bg-gray-950 bg-opacity-60 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  <span className="font-semibold text-gray-900 dark:text-white">Why It Matters:</span>{" "}
                  {category.whyItMatters}
                </p>
              </div>
            </div>

            {/* Sub-scores — each collapsible */}
            <div className="space-y-3">
              {category.subScores.map((subScore, subIdx) => (
                <CollapsibleSubSection
                  key={subScore.key}
                  title={subScore.name}
                  subtitle={subScore.description}
                  icon={ICON_MAP[subScore.icon]}
                  iconColor={subScore.iconColor}
                  defaultOpen={catIdx === 0 && subIdx === 0}
                >
                  <CriteriaTable subScore={subScore} />
                </CollapsibleSubSection>
              ))}
            </div>
          </CollapsibleSection>
        ))}

        {/* ── How We Calculate ── */}
        <CollapsibleSection title="How We Calculate Your Score">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">
              The Weighted Formula
            </h3>
            <div className="bg-white dark:bg-gray-950 rounded-lg p-5 border border-blue-200 mb-6">
              <code className="text-sm font-mono text-blue-900">
                Overall = (Consumer Protection avg × 0.40) + (Value & Fairness
                avg × 0.35) + (Player Experience avg × 0.25)
              </code>
            </div>

            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              Worked Example: Genshin Impact
            </h3>
            <div className="space-y-4 text-sm text-gray-700 dark:text-gray-200">
              <div className="grid grid-cols-3 gap-4 font-mono">
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase">Category Scores</p>
                  <p>Consumer Protection:</p>
                  <p>Value & Fairness:</p>
                  <p>Player Experience:</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase">Calculation</p>
                  <p>(7 + 8 + 3) / 3 = 6.0</p>
                  <p>(2 + 3 + 8) / 3 = 4.3</p>
                  <p>(3 + 3) / 2 = 3.0</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase">Weighted</p>
                  <p>6.0 × 0.40 = 2.40</p>
                  <p>4.3 × 0.35 = 1.51</p>
                  <p>3.0 × 0.25 = 0.75</p>
                </div>
              </div>

              <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
                <p className="font-bold text-gray-900 dark:text-white text-base">
                  Overall Score: 2.40 + 1.51 + 0.75 = 4.66 → rounds to{" "}
                  <span className="text-amber-600">4.7 (Fair)</span>
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-200">
                <span className="font-semibold text-gray-900 dark:text-white">Why these weights?</span> Consumer
                Protection is weighted highest (40%) because informed consent is
                the foundation of fair monetization. A system can be
                consumer-friendly in value but exploitative in design. Without
                transparency and safeguards, players cannot make genuinely
                informed decisions.
              </p>
            </div>
          </div>
        </CollapsibleSection>

        {/* ── Data Sources ── */}
        <CollapsibleSection title="Our Data Sources">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
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
                examples: "Rate verification from 100k+ player samples, third-party simulations, etc.",
              },
              {
                icon: <BookOpen className="w-6 h-6" />,
                color: "text-purple-600",
                title: "User Submissions",
                desc: "Aggregated player reports and feedback that help us spot discrepancies and flag games for re-review.",
                examples: "Player-reported pity thresholds, budget documentation, feature changes.",
              },
            ].map((source, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <div className={`mb-3 ${source.color}`}>{source.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{source.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{source.desc}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-700 dark:text-gray-200">Examples:</span>{" "}
                  {source.examples}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-200">
              <span className="font-semibold text-gray-900 dark:text-white">Cross-referencing & Verification:</span> We
              require multiple independent sources before publishing a score. If
              official and community data disagree, we flag the game for manual
              review and note the discrepancy in our database.
            </p>
          </div>
        </CollapsibleSection>

        {/* ── Score Updates ── */}
        <CollapsibleSection title="Score Updates & Version History">
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <p className="text-sm text-gray-700 dark:text-gray-200">
                Scores are <span className="font-semibold">living documents</span>.
                When a game receives a major monetization patch, changes its
                regional pricing, or adds new safeguards, we re-evaluate and
                publish a new score version.
              </p>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-200">Version</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-200">Date</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-200">Changes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900">
                  <td className="px-6 py-4 font-semibold text-blue-600">v2.0</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">March 2026</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    Introduced three-category framework with 8 sub-scores and weighted calculation
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900">
                  <td className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">v1.0</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">Initial Release</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    Original 4-score system (Transparency, Value, Fairness, Control)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* ── FAQ ── */}
        <CollapsibleSection title="Frequently Asked Questions" badge={`${FAQ_ITEMS.length} questions`}>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <details
                key={idx}
                className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden group/faq"
              >
                <summary className="px-5 py-3.5 font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900 flex items-center justify-between">
                  <span>{item.question}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 group-open/faq:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </CollapsibleSection>
      </div>

      {/* Bottom CTA */}
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <Link
          href="/lootbox"
          className="group flex items-center justify-between bg-blue-50 dark:bg-blue-950/30 border border-blue-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all"
        >
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
              Browse the Loot Box Database
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              See how every game scores in our database
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/drop-rates"
          className="group flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-700/30 rounded-xl p-6 hover:shadow-lg hover:border-emerald-300 transition-all"
        >
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
              View Drop Rate Database
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Raw odds and rate data for every game
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-600 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
