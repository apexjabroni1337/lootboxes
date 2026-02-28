import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using Lootboxes.com.",
};

export default function TermsPage() {
  return (
    <div className="pb-12">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="container-main">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            <p className="mt-2 text-sm text-gray-500">
              Last updated: February 28, 2026
            </p>
          </div>
        </div>
      </section>

      <div className="container-main mt-8">
        <div className="mx-auto max-w-3xl">
          <article className="prose prose-gray max-w-none prose-headings:text-gray-900">
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using Lootboxes.com, you agree to these terms of
              service. If you do not agree, please do not use the site.
            </p>

            <h2>Service Description</h2>
            <p>
              Lootboxes.com is a price comparison and analytics platform for
              video game deals. We aggregate publicly available pricing data
              from legitimate game stores and provide editorial analysis of
              in-game monetization systems.
            </p>

            <h2>Accuracy of Information</h2>
            <p>
              While we strive for accuracy, game prices change frequently and
              may not always be perfectly up to date. We recommend verifying
              the final price on the store&apos;s website before making a purchase.
              Lootboxes.com is not responsible for pricing errors on third-party
              stores.
            </p>

            <h2>Affiliate Disclosure</h2>
            <p>
              Lootboxes.com earns commissions through affiliate links. When you
              click a deal and make a purchase, we may receive a small commission
              at no additional cost to you. This never influences our editorial
              content, scores, or recommendations.
            </p>

            <h2>User Conduct</h2>
            <p>
              You agree not to scrape, crawl, or programmatically access the
              site without permission; attempt to interfere with site
              functionality; or misrepresent yourself or your affiliation when
              submitting data (e.g., drop rates).
            </p>

            <h2>Intellectual Property</h2>
            <p>
              All original content, analysis, scores, and editorial material on
              Lootboxes.com is our intellectual property. Game titles, logos, and
              related assets belong to their respective publishers.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              Lootboxes.com is provided &quot;as is&quot; without warranty.
              We are not liable for any losses arising from your use of
              the site, reliance on pricing data, or purchases made through
              affiliate links.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of
              the site after changes constitutes acceptance of the new terms.
            </p>

            <h2>Contact</h2>
            <p>
              Questions? Reach us at contact@lootboxes.com.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
