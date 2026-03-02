import Link from "next/link";
import { Shield, Heart, BarChart3, DollarSign, Users, Target } from "lucide-react";

export const metadata = {
  title: "About LootBoxes.com",
  description:
    "We help gamers save money on games and make smarter spending decisions on in-game purchases. Learn about our editorial policy and affiliate disclosures.",
};

export default function AboutPage() {
  return (
    <div className="pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="container-main relative text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            About LootBoxes.com
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-brand-100 sm:text-lg">
            Helping gamers spend their money wisely — with the best deals across every store
            and honest, data-driven analysis of in-game monetization.
          </p>
        </div>
      </section>

      <div className="container-main max-w-3xl">
        <div className="mt-12 space-y-10 text-gray-600">
          {/* Mission */}
          <section>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-brand-600" />
              <h2 className="text-xl font-semibold text-gray-900">Our Mission</h2>
            </div>
            <p className="mt-3">
              LootBoxes.com exists for one reason: to help gamers spend their
              money wisely. We do this in two ways — by finding you the best
              deals on games across every storefront, and by giving you honest,
              data-driven analysis of in-game monetization so you know what&apos;s
              actually worth buying.
            </p>
          </section>

          {/* What We Do */}
          <section>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-600" />
              <h2 className="text-xl font-semibold text-gray-900">What We Do</h2>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                { icon: DollarSign, title: "Deal Aggregation", desc: "We compare prices across Steam, Epic, GOG, Humble Bundle, and 20+ other stores to find you the cheapest price on any game." },
                { icon: BarChart3, title: "Loot Box Analytics", desc: "We analyze drop rates, battle pass value, and in-game economies with real math — not guesswork." },
                { icon: Shield, title: "Consumer Advocacy", desc: "Our LootBoxes Score rates every game's monetization on transparency, fairness, and value." },
                { icon: Heart, title: "Community First", desc: "No paywalls on critical information. Drop rates and deal data should be accessible to everyone." },
              ].map((item) => (
                <div key={item.title} className="card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
                    <item.icon className="h-5 w-5 text-brand-600" />
                  </div>
                  <h3 className="mt-3 font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Editorial Policy */}
          <section id="editorial" className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Editorial Policy
            </h2>
            <p className="mt-3">
              Our reviews and scores are editorially independent. Sponsors pay
              for coverage, never for favorable ratings. Every LootBoxes Score is
              calculated using our published methodology, and we will never change
              a score based on a business relationship.
            </p>
            <p className="mt-3">
              When a game publisher sponsors an analytics article, we label it
              clearly as &quot;Sponsored&quot; or &quot;Partner Content.&quot; The
              analysis within still receives an honest score.
            </p>
            <Link
              href="/methodology"
              className="mt-3 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Read our full scoring methodology →
            </Link>
          </section>

          {/* Affiliate Disclosure */}
          <section id="disclosure" className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Affiliate Disclosure
            </h2>
            <p className="mt-3">
              LootBoxes.com earns a commission when you purchase through our
              affiliate links. This is how we keep the site running and free to
              use. These commissions never affect our deal rankings, LootBoxes
              Scores, or editorial recommendations.
            </p>
            <p className="mt-3">
              We partner with stores including Humble Bundle, Fanatical, Green Man
              Gaming, GOG, Amazon, and others. Commission rates vary by store and
              typically range from 3% to 15%.
            </p>
          </section>

          {/* Contact */}
          <section id="contact">
            <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="card">
                <h3 className="text-sm font-semibold text-gray-900">General Inquiries</h3>
                <a
                  href="mailto:contact@lootboxes.com"
                  className="mt-1 block text-sm text-brand-600 hover:text-brand-700"
                >
                  contact@lootboxes.com
                </a>
              </div>
              <div className="card">
                <h3 className="text-sm font-semibold text-gray-900">Partnerships & Sponsorships</h3>
                <a
                  href="mailto:partnerships@lootboxes.com"
                  className="mt-1 block text-sm text-brand-600 hover:text-brand-700"
                >
                  partnerships@lootboxes.com
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
