import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure — LootBoxes.com",
  description:
    "LootBoxes.com earns commissions through affiliate links. Learn how we make money, which stores we partner with, and how this affects (and doesn't affect) our content.",
  openGraph: {
    title: "Affiliate Disclosure — LootBoxes.com",
    description:
      "Full transparency about how LootBoxes.com earns revenue through affiliate partnerships.",
    url: "https://lootboxes.com/affiliate-disclosure",
    type: "website",
  },
  alternates: { canonical: "https://lootboxes.com/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-950 py-8">
        <div className="container-main">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Affiliate Disclosure
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Last updated: March 1, 2026
            </p>
          </div>
        </div>
      </section>

      <div className="container-main mt-8">
        <div className="mx-auto max-w-3xl">
          {/* FTC compliance summary */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 p-5 mb-8">
            <p className="text-sm font-semibold text-amber-800">
              FTC Disclosure:
            </p>
            <p className="mt-1 text-sm text-amber-700 leading-relaxed">
              LootBoxes.com is a participant in various affiliate advertising
              programs. When you click on links to stores and make a purchase, we
              may earn a commission at no additional cost to you. This helps fund
              the site and allows us to keep it free for everyone.
            </p>
          </div>

          <article className="prose prose-gray max-w-none prose-headings:text-gray-900 dark:text-white prose-a:text-brand-600 hover:prose-a:text-brand-700">
            <h2>How We Make Money</h2>
            <p>
              LootBoxes.com is free to use. We generate revenue primarily
              through affiliate commissions — when you click a deal link on our
              site and make a purchase at a partner store, we may receive a small
              commission from that store. This commission comes from the store,
              not from you. You pay the exact same price whether you use our link
              or go to the store directly.
            </p>

            <h2>What Are Affiliate Links?</h2>
            <p>
              An affiliate link is a special URL that contains a tracking code
              identifying LootBoxes.com as the source of the referral. When you
              click one of our deal links, you&apos;re redirected through our
              tracking system before arriving at the store. This allows the store
              to credit us for the referral if you make a purchase.
            </p>
            <p>
              On LootBoxes.com, affiliate links appear in the following places:
            </p>
            <ul>
              <li>
                &quot;Get Deal&quot; and &quot;View Deal&quot; buttons on deal
                pages
              </li>
              <li>Store links on individual game pages</li>
              <li>
                CS2 skin marketplace links (Skinport, Buff163, DMarket, etc.)
              </li>
              <li>Featured deal sections on the homepage</li>
              <li>Price comparison tables</li>
              <li>Deal alert emails and newsletters</li>
            </ul>

            <h2>Our Store Partners</h2>
            <p>
              We maintain affiliate partnerships with the following game stores
              and marketplaces. Commission rates typically range from 3% to 15%
              depending on the store and product category:
            </p>
            <ul>
              <li>Humble Bundle</li>
              <li>Fanatical</li>
              <li>Green Man Gaming (GMG)</li>
              <li>GOG.com</li>
              <li>GameBillet</li>
              <li>2Game</li>
              <li>Gamesplanet</li>
              <li>DLGamer</li>
              <li>IndieGala</li>
              <li>GamersGate</li>
            </ul>
            <p>
              For CS2 skin marketplaces, we partner with Skinport, Buff163,
              DMarket, Tradeit.gg, Mannco.store, and Waxpeer, among others.
            </p>

            <h2>What This Means for You</h2>
            <p>There are a few important things to understand:</p>
            <ul>
              <li>
                <strong>You never pay more.</strong> Affiliate commissions come
                from the store&apos;s marketing budget, not from your wallet. The
                price you see is the price you pay.
              </li>
              <li>
                <strong>Our rankings are not affected.</strong> Deals are ranked
                by price, not by which store pays us more. A store with a lower
                commission but a better price will always appear first.
              </li>
              <li>
                <strong>Our scores are not affected.</strong> LootBoxes Scores
                are calculated using our published methodology. No affiliate
                relationship can change a score.
              </li>
              <li>
                <strong>We include non-partner stores.</strong> If a store we
                don&apos;t have an affiliate relationship with (like Steam) has
                the best price, we still show it. We won&apos;t hide a better
                deal just because we can&apos;t earn a commission on it.
              </li>
            </ul>

            <h2>How We Disclose Affiliate Links</h2>
            <p>
              In compliance with FTC guidelines, we disclose affiliate
              relationships in the following ways:
            </p>
            <ul>
              <li>
                This dedicated Affiliate Disclosure page (which you&apos;re
                reading now)
              </li>
              <li>
                Inline disclosures on pages containing affiliate links, such as
                deal pages, game pages, and CS2 marketplace comparison pages
              </li>
              <li>
                A site-wide disclosure in the footer of every page on
                LootBoxes.com
              </li>
              <li>Disclosure notices in our email newsletters</li>
            </ul>

            <h2>Non-Affiliate Revenue</h2>
            <p>
              In addition to affiliate commissions, LootBoxes.com may generate
              revenue through clearly labeled sponsored content and display
              advertising. All sponsored content is marked as such in accordance
              with our{" "}
              <Link href="/editorial-policy">Editorial Policy</Link>.
            </p>

            <h2>Your Choice</h2>
            <p>
              Using our affiliate links is entirely optional. If you prefer, you
              can navigate to any store directly by typing the URL in your
              browser. We appreciate when you use our links because it helps keep
              LootBoxes.com free, but we respect your choice either way.
            </p>

            <h2>Questions?</h2>
            <p>
              If you have questions about our affiliate relationships, email us
              at{" "}
              <a href="mailto:contact@lootboxes.com">contact@lootboxes.com</a>.
              For questions about how affiliate partnerships relate to our
              editorial independence, see our{" "}
              <Link href="/editorial-policy">Editorial Policy</Link>.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
