import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Policy — LootBoxes.com",
  description:
    "How LootBoxes.com maintains editorial independence. Our reviews, scores, and recommendations are never influenced by advertisers or affiliate partnerships.",
  openGraph: {
    title: "Editorial Policy — LootBoxes.com",
    description:
      "Our commitment to independent, honest gaming coverage and analysis.",
    url: "https://lootboxes.com/editorial-policy",
    type: "website",
  },
  alternates: { canonical: "https://lootboxes.com/editorial-policy" },
};

export default function EditorialPolicyPage() {
  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-950 py-8">
        <div className="container-main">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Editorial Policy
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Last updated: March 1, 2026
            </p>
          </div>
        </div>
      </section>

      <div className="container-main mt-8">
        <div className="mx-auto max-w-3xl">
          {/* Summary box */}
          <div className="rounded-xl border border-brand-200 dark:border-brand-700/30 bg-brand-50 dark:bg-brand-950/30 p-5 mb-8">
            <p className="text-sm font-semibold text-brand-800">In short:</p>
            <p className="mt-1 text-sm text-brand-700 leading-relaxed">
              Our editorial content — including LootBoxes Scores, deal rankings,
              game reviews, and monetization analysis — is never influenced by
              advertisers, sponsors, or affiliate partnerships. We earn revenue
              through affiliate commissions and clearly disclose all
              relationships.
            </p>
          </div>

          <article className="prose prose-gray max-w-none prose-headings:text-gray-900 dark:text-white prose-a:text-brand-600 hover:prose-a:text-brand-700">
            <h2>Editorial Independence</h2>
            <p>
              LootBoxes.com is committed to providing accurate, unbiased
              information to gamers. Our editorial team operates independently
              from our business and advertising teams. No advertiser, sponsor,
              game publisher, or affiliate partner has any influence over our
              editorial decisions, including:
            </p>
            <ul>
              <li>LootBoxes Scores and game monetization ratings</li>
              <li>Deal rankings and price comparison results</li>
              <li>Drop rate analysis and statistical reporting</li>
              <li>Game reviews and editorial recommendations</li>
              <li>
                Content selection — which games we choose to cover or analyze
              </li>
            </ul>

            <h2>How We Score Games</h2>
            <p>
              Every game&apos;s LootBoxes Score is calculated using our{" "}
              <Link href="/methodology">published methodology</Link>. This
              methodology evaluates monetization transparency, fairness, value
              for money, and consumer-friendliness. Scores are determined by
              data and analysis — not by business relationships.
            </p>
            <p>
              We will never change a score because a publisher requested it,
              because we have an affiliate relationship with a store selling the
              game, or for any reason other than a genuine change in the
              game&apos;s monetization practices.
            </p>

            <h2>How We Rank Deals</h2>
            <p>
              When you search for deals on LootBoxes.com, results are ranked
              purely by price — the cheapest legitimate deal appears first.
              Affiliate commission rates have no bearing on deal ranking or
              visibility. A store paying us a higher commission will not appear
              above a store offering a lower price.
            </p>

            <h2>Sponsored Content</h2>
            <p>
              On rare occasions, game publishers or stores may sponsor content on
              LootBoxes.com. When this occurs, we clearly and prominently label
              the content as &quot;Sponsored&quot; or &quot;Partner
              Content&quot; at the top of the page. Even sponsored content
              receives an honest, independently-calculated LootBoxes Score.
            </p>
            <p>
              Sponsored content will never receive a more favorable score or
              analysis than it would have otherwise. If a sponsor requests
              changes to editorial conclusions, we decline.
            </p>

            <h2>Affiliate Relationships</h2>
            <p>
              LootBoxes.com earns revenue through affiliate commissions when you
              purchase games through our links. This is how we keep the site
              free. However, these relationships never influence our editorial
              content. For full details, see our{" "}
              <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>.
            </p>

            <h2>Corrections Policy</h2>
            <p>
              If we publish inaccurate information, we correct it promptly and
              transparently. Significant corrections are noted at the top of the
              affected article. If you believe we&apos;ve published something
              inaccurate, please contact us at{" "}
              <a href="mailto:editorial@lootboxes.com">
                editorial@lootboxes.com
              </a>
              .
            </p>

            <h2>Data Sources</h2>
            <p>
              Our analysis relies on data from publicly available sources
              including official game documentation, community-sourced drop rate
              testing, public API data from game stores and marketplaces, and
              historical pricing records we collect automatically. When data is
              community-sourced, we note the sample size and confidence level.
              When we reference official sources, we link to them directly.
            </p>

            <h2>Questions?</h2>
            <p>
              If you have questions about our editorial practices, contact our
              editorial team at{" "}
              <a href="mailto:editorial@lootboxes.com">
                editorial@lootboxes.com
              </a>
              . You can also visit our{" "}
              <Link href="/contact">Contact page</Link> for more ways to reach
              us.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
