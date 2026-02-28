import { Shield, Heart, BarChart3, DollarSign } from "lucide-react";

export const metadata = {
  title: "About Lootboxes.com",
  description:
    "We help gamers save money on games and make smarter spending decisions on in-game purchases. Learn about our editorial policy and affiliate disclosures.",
};

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="container-main max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">
          About Lootboxes.com
        </h1>

        <div className="mt-8 space-y-8 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">Our Mission</h2>
            <p className="mt-3">
              Lootboxes.com exists for one reason: to help gamers spend their
              money wisely. We do this in two ways — by finding you the best
              deals on games across every storefront, and by giving you honest,
              data-driven analysis of in-game monetization so you know what&apos;s
              actually worth buying.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">What We Do</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                { icon: DollarSign, title: "Deal Aggregation", desc: "We compare prices across Steam, Epic, GOG, Humble Bundle, and 20+ other stores to find you the cheapest price on any game." },
                { icon: BarChart3, title: "Loot Box Analytics", desc: "We analyze drop rates, battle pass value, and in-game economies with real math — not guesswork." },
                { icon: Shield, title: "Consumer Advocacy", desc: "Our Lootboxes Score rates every game's monetization on transparency, fairness, and value." },
                { icon: Heart, title: "Community First", desc: "No paywalls on critical information. Drop rates and deal data should be accessible to everyone." },
              ].map((item) => (
                <div key={item.title} className="card">
                  <item.icon className="h-6 w-6 text-brand-600" />
                  <h3 className="mt-2 font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="editorial">
            <h2 className="text-xl font-semibold text-gray-900">
              Editorial Policy
            </h2>
            <p className="mt-3">
              Our reviews and scores are editorially independent. Sponsors pay
              for coverage, never for favorable ratings. Every Lootboxes Score is
              calculated using our published methodology, and we will never change
              a score based on a business relationship.
            </p>
            <p className="mt-3">
              When a game publisher sponsors an analytics article, we label it
              clearly as &quot;Sponsored&quot; or &quot;Partner Content.&quot; The
              analysis within still receives an honest score.
            </p>
          </section>

          <section id="disclosure">
            <h2 className="text-xl font-semibold text-gray-900">
              Affiliate Disclosure
            </h2>
            <p className="mt-3">
              Lootboxes.com earns a commission when you purchase through our
              affiliate links. This is how we keep the site running and free to
              use. These commissions never affect our deal rankings, Lootboxes
              Scores, or editorial recommendations.
            </p>
            <p className="mt-3">
              We partner with stores including Humble Bundle, Fanatical, Green Man
              Gaming, GOG, Amazon, and others. Commission rates vary by store and
              typically range from 3% to 15%.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
            <p className="mt-3">
              For general inquiries:{" "}
              <a
                href="mailto:contact@lootboxes.com"
                className="text-brand-600 hover:text-brand-700"
              >
                contact@lootboxes.com
              </a>
            </p>
            <p className="mt-2">
              For partnership and sponsorship inquiries:{" "}
              <a
                href="mailto:partnerships@lootboxes.com"
                className="text-brand-600 hover:text-brand-700"
              >
                partnerships@lootboxes.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
