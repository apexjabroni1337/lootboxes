import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How LootBoxes.com collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="pb-12">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="container-main">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="mt-2 text-sm text-gray-500">
              Last updated: February 28, 2026
            </p>
          </div>
        </div>
      </section>

      <div className="container-main mt-8">
        <div className="mx-auto max-w-3xl">
          <article className="prose prose-gray max-w-none prose-headings:text-gray-900">
            <h2>Information We Collect</h2>
            <p>
              LootBoxes.com collects minimal data to provide our service.
              We collect your email address when you subscribe to our newsletter,
              anonymous usage analytics to improve the site, and affiliate click
              data (no personally identifiable information) to track which deals
              are most popular.
            </p>

            <h2>How We Use Your Data</h2>
            <p>
              Email addresses are used solely for sending our weekly deal digest
              newsletter. You can unsubscribe at any time via the link in every
              email. We never sell, rent, or share your email with third parties.
            </p>

            <h2>Cookies</h2>
            <p>
              We use essential cookies for site functionality and anonymous
              analytics cookies (via Vercel Analytics) to understand traffic
              patterns. We do not use advertising cookies or trackers.
            </p>

            <h2>Affiliate Links</h2>
            <p>
              When you click a deal link, you are redirected through our tracking
              endpoint before arriving at the store. We log the click (without
              any personal data) to measure which deals are popular. The stores
              themselves may set their own cookies — please refer to their
              privacy policies for details.
            </p>

            <h2>Data Retention</h2>
            <p>
              Newsletter subscriber data is retained until you unsubscribe.
              Anonymous analytics data is retained for up to 12 months.
              Click tracking data is retained for up to 6 months.
            </p>

            <h2>Your Rights</h2>
            <p>
              You can request deletion of your data at any time by contacting
              us at contact@lootboxes.com. We will process your request within
              30 days.
            </p>

            <h2>Contact</h2>
            <p>
              For privacy-related questions, email us at contact@lootboxes.com.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
