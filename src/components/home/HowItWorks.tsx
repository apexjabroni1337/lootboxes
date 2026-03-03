import { Database, Shield, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";

const pillars = [
  {
    icon: Database,
    number: "01",
    title: "Catalog Every System",
    description:
      "We track gacha banners, loot boxes, card packs, cosmetic shops, and battle passes across every major title — building the most complete monetization database on the web.",
    gradient: "from-blue-600 to-cyan-500",
    bgGlow: "bg-blue-500/10",
  },
  {
    icon: Eye,
    number: "02",
    title: "Expose the Real Odds",
    description:
      "Every drop rate, pity system, and pull cost gets documented and verified. We crunch the numbers so you can see exactly what your money buys before you spend it.",
    gradient: "from-purple-600 to-fuchsia-500",
    bgGlow: "bg-purple-500/10",
  },
  {
    icon: Shield,
    number: "03",
    title: "Score & Rank Fairness",
    description:
      "Our LootBoxes Score rates each game on transparency, value, and player fairness — so you can instantly tell which games respect your wallet and which don't.",
    gradient: "from-emerald-600 to-teal-500",
    bgGlow: "bg-emerald-500/10",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      {/* Subtle radial background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/80 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />

      <div className="container-main relative">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-400">
            Our Mission
          </span>
          <h2 className="mt-5 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            The Premier Loot Box Database
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500 dark:text-gray-400">
            We believe every player deserves to know the real odds before they spend.
            LootBoxes.com exists to bring transparency to in-game monetization.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900"
            >
              {/* Background glow */}
              <div
                className={`absolute -right-10 -top-10 h-40 w-40 rounded-full ${pillar.bgGlow} blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70 opacity-0 group-hover:opacity-100`}
              />

              {/* Number watermark */}
              <span className="absolute right-4 top-2 text-7xl font-black text-gray-100 select-none dark:text-gray-800/60">
                {pillar.number}
              </span>

              {/* Icon */}
              <div
                className={`relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${pillar.gradient} shadow-lg`}
              >
                <pillar.icon className="h-6 w-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="relative mt-5 text-lg font-bold text-gray-900 dark:text-white">
                {pillar.title}
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/lootbox"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            Explore the Database
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
