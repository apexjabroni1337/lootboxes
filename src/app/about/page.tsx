import Link from "next/link";
import {
  Shield,
  Heart,
  BarChart3,
  DollarSign,
  Users,
  Target,
  Globe,
  Gamepad2,
  TrendingUp,
  Mail,
  MessageSquare,
  Handshake,
} from "lucide-react";

export const metadata = {
  title: "About LootBoxes.com — Who We Are & What We Do",
  description:
    "LootBoxes.com helps gamers save money on games and make smarter spending decisions on in-game purchases. Learn about our mission, team, and values.",
  openGraph: {
    title: "About LootBoxes.com",
    description:
      "Helping gamers spend wisely — with the best deals and honest monetization analysis.",
    url: "https://lootboxes.com/about",
    type: "website",
  },
  alternates: { canonical: "https://lootboxes.com/about" },
};

export default function AboutPage() {
  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-white dark:bg-gray-950/5 blur-3xl" />
        </div>
        <div className="container-main relative text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            About LootBoxes.com
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-brand-100 sm:text-lg">
            Helping gamers spend their money wisely — with the best deals across
            every store and honest, data-driven analysis of in-game
            monetization.
          </p>
        </div>
      </section>

      <div className="container-main max-w-4xl">
        <div className="mt-12 space-y-14 text-gray-600 dark:text-gray-300">
          {/* Mission */}
          <section>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-brand-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Our Mission
              </h2>
            </div>
            <p className="mt-3 leading-relaxed">
              LootBoxes.com exists for one reason: to help gamers spend their
              money wisely. We do this in two ways — by finding you the best
              deals on games across every storefront, and by giving you honest,
              data-driven analysis of in-game monetization so you know
              what&apos;s actually worth buying.
            </p>
            <p className="mt-3 leading-relaxed">
              We believe every gamer deserves access to transparent information
              about how games monetize their players. Whether it&apos;s loot box
              drop rates, battle pass value, or skin marketplace pricing — you
              shouldn&apos;t need to spend money just to find out if
              something&apos;s worth spending money on.
            </p>
          </section>

          {/* What We Do */}
          <section>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                What We Do
              </h2>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: DollarSign,
                  title: "Deal Aggregation",
                  desc: "We compare prices across Steam, Epic, GOG, Humble Bundle, and 20+ other legitimate stores to find you the cheapest price on any game.",
                },
                {
                  icon: BarChart3,
                  title: "Loot Box Analytics",
                  desc: "We analyze drop rates, battle pass value, and in-game economies with real math — not guesswork. Every game gets a LootBoxes Score.",
                },
                {
                  icon: Shield,
                  title: "Consumer Advocacy",
                  desc: "Our LootBoxes Score rates every game's monetization on transparency, fairness, and value — giving you an honest picture before you spend.",
                },
                {
                  icon: Heart,
                  title: "Community First",
                  desc: "No paywalls on critical information. Drop rates, deal data, and monetization analysis should be accessible to everyone.",
                },
                {
                  icon: Gamepad2,
                  title: "CS2 Skins Hub",
                  desc: "A dedicated section for Counter-Strike 2 with case simulators, price tracking, marketplace comparison, and investment tools.",
                },
                {
                  icon: TrendingUp,
                  title: "Market Intelligence",
                  desc: "Track historical price trends, identify the best time to buy, and get alerts when games hit their lowest prices ever.",
                },
              ].map((item) => (
                <div key={item.title} className="card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-800/30">
                    <item.icon className="h-5 w-5 text-brand-600" />
                  </div>
                  <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Our Values */}
          <section>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-brand-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Our Values
              </h2>
            </div>
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Independence Above All
                </h3>
                <p className="mt-2 text-sm leading-relaxed">
                  Our editorial content is never influenced by business
                  relationships. Affiliate commissions, sponsorships, and
                  partnerships have zero impact on our LootBoxes Scores, deal
                  rankings, or recommendations. If we recommend something,
                  it&apos;s because we think it&apos;s good for gamers — period.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Transparency Is Non-Negotiable
                </h3>
                <p className="mt-2 text-sm leading-relaxed">
                  We publish our{" "}
                  <Link
                    href="/methodology"
                    className="text-brand-600 hover:text-brand-700 underline"
                  >
                    scoring methodology
                  </Link>{" "}
                  openly. We clearly label all affiliate links. We disclose
                  every partnership. If a game publisher sponsors content, we say
                  so — clearly and prominently.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Data Over Opinions
                </h3>
                <p className="mt-2 text-sm leading-relaxed">
                  Our analysis is built on real data: actual drop rate
                  percentages, historical pricing records, marketplace
                  transaction volumes, and community-sourced information. We show
                  our work so you can verify our conclusions yourself.
                </p>
              </div>
            </div>
          </section>

          {/* Quick Links */}
          <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Important Pages
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link
                href="/editorial-policy"
                className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-4 transition-all hover:border-brand-300 hover:shadow-sm"
              >
                <Shield className="h-5 w-5 text-brand-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Editorial Policy
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    How we maintain editorial independence
                  </p>
                </div>
              </Link>
              <Link
                href="/affiliate-disclosure"
                className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-4 transition-all hover:border-brand-300 hover:shadow-sm"
              >
                <Handshake className="h-5 w-5 text-brand-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Affiliate Disclosure
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    How we earn revenue and stay free
                  </p>
                </div>
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-4 transition-all hover:border-brand-300 hover:shadow-sm"
              >
                <Mail className="h-5 w-5 text-brand-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Contact Us
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Get in touch with the team
                  </p>
                </div>
              </Link>
              <Link
                href="/methodology"
                className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-4 transition-all hover:border-brand-300 hover:shadow-sm"
              >
                <BarChart3 className="h-5 w-5 text-brand-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Scoring Methodology
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    How LootBoxes Scores are calculated
                  </p>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
