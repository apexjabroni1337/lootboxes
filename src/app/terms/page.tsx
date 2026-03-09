import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — LootBoxes.com",
  description:
    "Terms and conditions for using LootBoxes.com, including service description, user conduct, intellectual property, disclaimers, and limitation of liability.",
  openGraph: {
    title: "Terms of Service — LootBoxes.com",
    description: "Terms and conditions for using LootBoxes.com.",
    url: "https://lootboxes.com/terms",
    type: "website",
  },
  alternates: { canonical: "https://lootboxes.com/terms" },
};

export default function TermsPage() {
  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="container-main">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900">
              Terms of Service
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Last updated: March 1, 2026
            </p>
          </div>
        </div>
      </section>

      <div className="container-main mt-8">
        <div className="mx-auto max-w-3xl">
          <article className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-brand-600 hover:prose-a:text-brand-700">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using LootBoxes.com (the &quot;Site&quot;),
              you agree to be bound by these Terms of Service
              (&quot;Terms&quot;). If you do not agree to these Terms, please do
              not use the Site. We reserve the right to modify these Terms at any
              time, and your continued use of the Site constitutes acceptance of
              any changes.
            </p>

            <h2>2. Service Description</h2>
            <p>
              LootBoxes.com is a price comparison and analytics platform for
              video games. Our services include:
            </p>
            <ul>
              <li>
                Aggregating and comparing publicly available game pricing data
                from legitimate stores
              </li>
              <li>
                Editorial analysis and scoring of in-game monetization systems
                (loot boxes, battle passes, microtransactions)
              </li>
              <li>
                CS2 skin price tracking, marketplace comparison, and simulation
                tools
              </li>
              <li>Deal alerts and newsletter services</li>
              <li>Drop rate analysis and community-sourced data</li>
            </ul>
            <p>
              We do not sell games, process payments, or act as a storefront. We
              redirect you to third-party stores where you can make purchases
              directly.
            </p>

            <h2>3. Accuracy of Information</h2>
            <p>
              While we strive for accuracy, game prices change frequently and
              may not always be perfectly up to date. We aggregate data from
              third-party sources and cannot guarantee its accuracy at all times.
              You should always verify the final price and availability on the
              store&apos;s website before making a purchase. LootBoxes.com is
              not responsible for pricing errors, availability changes, or any
              discrepancies on third-party stores.
            </p>
            <p>
              LootBoxes Scores, drop rate analyses, and monetization assessments
              represent our editorial opinion based on available data. They are
              provided for informational purposes and should not be considered
              definitive or exhaustive.
            </p>

            <h2>4. Affiliate Links & Commercial Relationships</h2>
            <p>
              LootBoxes.com earns commissions through affiliate links. When you
              click a deal link and make a purchase, we may receive a
              commission from the store at no additional cost to you. These
              commissions never influence our editorial content, scores, or deal
              rankings. For full details, see our{" "}
              <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>.
            </p>

            <h2>5. No Financial or Investment Advice</h2>
            <p>
              Nothing on LootBoxes.com constitutes financial advice, investment
              advice, or any recommendation to buy, sell, or hold any digital
              asset, skin, or virtual item for profit. Information about skin
              prices, market trends, and historical data is provided for
              informational and entertainment purposes only. Any decisions you
              make regarding the purchase, sale, or trading of virtual items are
              made at your own risk. We strongly recommend consulting a qualified
              financial advisor before making any investment decisions.
            </p>

            <h2>6. User Conduct</h2>
            <p>When using the Site, you agree not to:</p>
            <ul>
              <li>
                Scrape, crawl, or programmatically access the Site or its data
                without our prior written consent
              </li>
              <li>
                Use bots, spiders, or automated tools to access or interact with
                the Site
              </li>
              <li>
                Attempt to interfere with, compromise, or disrupt the Site or
                its infrastructure
              </li>
              <li>
                Misrepresent yourself or your affiliation when submitting data
                (e.g., drop rates, reviews)
              </li>
              <li>
                Use the Site for any unlawful purpose or in violation of any
                applicable laws
              </li>
              <li>
                Reproduce, distribute, or republish our editorial content
                without attribution and permission
              </li>
              <li>
                Attempt to reverse engineer any part of the Site
              </li>
            </ul>

            <h2>7. Intellectual Property</h2>
            <p>
              All original content on LootBoxes.com — including editorial text,
              analysis, LootBoxes Scores, scoring methodology, website design,
              logos, and branding — is our intellectual property and is protected
              by applicable copyright and trademark laws. You may not reproduce,
              distribute, or create derivative works from our content without
              written permission.
            </p>
            <p>
              Game titles, logos, screenshots, artwork, and related assets
              displayed on the Site belong to their respective publishers and
              rights holders. Their use on LootBoxes.com is for informational
              and editorial purposes under fair use principles.
            </p>

            <h2>8. Third-Party Links and Services</h2>
            <p>
              The Site contains links to third-party websites and services,
              including game stores, marketplaces, and external tools. We are not
              responsible for the content, privacy practices, or terms of
              service of these third-party sites. Your interactions with
              third-party sites are governed by their respective terms and
              policies.
            </p>

            <h2>9. Newsletter and Communications</h2>
            <p>
              By subscribing to our newsletter or deal alerts, you consent to
              receive periodic emails from LootBoxes.com. You can unsubscribe at
              any time using the link provided in every email. We will not share
              your email address with third parties for marketing purposes.
            </p>

            <h2>10. Disclaimer of Warranties</h2>
            <p>
              The Site and all content are provided &quot;as is&quot; and
              &quot;as available&quot; without warranties of any kind, either
              express or implied. We disclaim all warranties, including but not
              limited to warranties of merchantability, fitness for a particular
              purpose, accuracy, and non-infringement. We do not warrant that
              the Site will be uninterrupted, error-free, secure, or free of
              viruses or other harmful components.
            </p>

            <h2>11. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, LootBoxes.com and its
              operators shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising out of or
              related to your use of the Site. This includes, without
              limitation, damages for loss of profits, data, goodwill, or other
              intangible losses resulting from:
            </p>
            <ul>
              <li>Your use of or inability to use the Site</li>
              <li>
                Any purchases made through third-party stores linked from the
                Site
              </li>
              <li>
                Inaccurate pricing data, scores, or analytical content
              </li>
              <li>
                Unauthorized access to or alteration of your data
              </li>
              <li>
                Any third-party content, products, or services accessed through
                the Site
              </li>
            </ul>

            <h2>12. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless LootBoxes.com, its
              operators, and affiliates from any claims, liabilities, damages,
              losses, or expenses arising from your violation of these Terms or
              your use of the Site.
            </p>

            <h2>13. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the United States. Any disputes arising from these
              Terms or your use of the Site shall be resolved through binding
              arbitration in accordance with applicable rules, unless prohibited
              by local law.
            </p>

            <h2>14. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or
              invalid, that provision shall be limited or eliminated to the
              minimum extent necessary, and the remaining provisions shall
              continue in full force and effect.
            </p>

            <h2>15. Changes to Terms</h2>
            <p>
              We reserve the right to update these Terms at any time. Changes
              will be posted on this page with an updated &quot;Last
              updated&quot; date. Your continued use of the Site after changes
              are posted constitutes acceptance of the revised Terms.
            </p>

            <h2>16. Contact</h2>
            <p>
              If you have questions about these Terms of Service, please contact
              us at{" "}
              <a href="mailto:contact@lootboxes.com">contact@lootboxes.com</a>{" "}
              or visit our <Link href="/contact">Contact page</Link>.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
