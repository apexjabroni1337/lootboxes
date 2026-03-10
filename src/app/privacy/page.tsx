import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — LootBoxes.com",
  description:
    "How LootBoxes.com collects, uses, stores, and protects your personal data. Learn about your privacy rights and how to control your information.",
  openGraph: {
    title: "Privacy Policy — LootBoxes.com",
    description: "How LootBoxes.com handles your personal data.",
    url: "https://lootboxes.com/privacy",
    type: "website",
  },
  alternates: { canonical: "https://lootboxes.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-950 py-8">
        <div className="container-main">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Privacy Policy
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
            <p className="text-sm font-semibold text-brand-800">
              Privacy at a glance:
            </p>
            <p className="mt-1 text-sm text-brand-700 leading-relaxed">
              We collect minimal data. We never sell your personal information.
              We use cookies only for essential site functionality and anonymous
              analytics. You can request deletion of your data at any time.
            </p>
          </div>

          <article className="prose prose-gray max-w-none prose-headings:text-gray-900 dark:text-white prose-a:text-brand-600 hover:prose-a:text-brand-700">
            <h2>1. Who We Are</h2>
            <p>
              LootBoxes.com (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) is
              a video game price comparison and monetization analysis website.
              This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website at
              lootboxes.com (the &quot;Site&quot;). Please read this policy
              carefully. If you do not agree with the terms of this policy,
              please do not access the Site.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>Information You Provide</h3>
            <p>
              We collect information you voluntarily provide when you interact
              with the Site:
            </p>
            <ul>
              <li>
                <strong>Newsletter subscription:</strong> Your email address when
                you subscribe to our deal alerts or weekly digest.
              </li>
              <li>
                <strong>Contact forms:</strong> Your name, email, and message
                content when you contact us.
              </li>
            </ul>

            <h3>Information Collected Automatically</h3>
            <p>
              When you visit the Site, we automatically collect certain
              information:
            </p>
            <ul>
              <li>
                <strong>Usage data:</strong> Pages visited, time spent on pages,
                referral URLs, and interaction patterns. This data is collected
                anonymously through Vercel Analytics and does not contain
                personally identifiable information.
              </li>
              <li>
                <strong>Affiliate click data:</strong> When you click a deal
                link, we log the click event (deal ID, timestamp) to measure
                popularity. We do not log personally identifiable information
                with click events.
              </li>
              <li>
                <strong>Device information:</strong> Browser type, operating
                system, and screen resolution — collected anonymously for site
                optimization.
              </li>
              <li>
                <strong>Cookies:</strong> We use essential and analytics cookies.
                See our{" "}
                <Link href="/cookies">Cookie Policy</Link> for full details.
              </li>
            </ul>

            <h3>Information We Do Not Collect</h3>
            <p>
              We do not collect payment information, social security numbers, or
              other sensitive personal data. We do not require you to create an
              account to use the Site.
            </p>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li>
                To send our newsletter and deal alerts (only if you opted in)
              </li>
              <li>
                To respond to your inquiries and provide customer support
              </li>
              <li>
                To analyze site usage and improve our content and services
              </li>
              <li>
                To measure the popularity of deals and optimize our deal
                discovery features
              </li>
              <li>To detect and prevent technical issues or abuse</li>
            </ul>

            <h2>4. How We Share Your Information</h2>
            <p>
              We do not sell, trade, rent, or otherwise share your personal
              information with third parties for their marketing purposes. We may
              share information in the following limited circumstances:
            </p>
            <ul>
              <li>
                <strong>Service providers:</strong> We use Vercel (hosting and
                analytics), Supabase (database), and Resend (email delivery).
                These providers process data on our behalf and are contractually
                obligated to protect it.
              </li>
              <li>
                <strong>Affiliate partners:</strong> When you click an affiliate
                link, the destination store may set their own cookies and collect
                data according to their own privacy policies. We do not share
                your personal data with these stores.
              </li>
              <li>
                <strong>Legal requirements:</strong> We may disclose information
                if required by law, court order, or governmental regulation.
              </li>
            </ul>

            <h2>5. Cookies and Tracking</h2>
            <p>
              We use a limited number of cookies for essential site
              functionality and anonymous analytics. We do not use advertising
              cookies, retargeting pixels, or cross-site tracking technologies.
              For detailed information about the cookies we use, please see our{" "}
              <Link href="/cookies">Cookie Policy</Link>.
            </p>

            <h2>6. Third-Party Links</h2>
            <p>
              The Site contains links to third-party websites, including game
              stores and marketplaces. These sites have their own privacy
              policies, and we are not responsible for their practices. We
              encourage you to review the privacy policy of any third-party site
              you visit through our links.
            </p>

            <h2>7. Data Retention</h2>
            <ul>
              <li>
                <strong>Newsletter subscribers:</strong> Email addresses are
                retained until you unsubscribe. You can unsubscribe at any time
                via the link in every email.
              </li>
              <li>
                <strong>Analytics data:</strong> Anonymous usage data is retained
                for up to 12 months, then automatically deleted.
              </li>
              <li>
                <strong>Click tracking:</strong> Anonymous affiliate click data
                is retained for up to 6 months.
              </li>
              <li>
                <strong>Contact inquiries:</strong> Messages are retained for up
                to 24 months unless you request earlier deletion.
              </li>
            </ul>

            <h2>8. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul>
              <li>
                <strong>Access</strong> the personal data we hold about you
              </li>
              <li>
                <strong>Correct</strong> inaccurate personal data
              </li>
              <li>
                <strong>Delete</strong> your personal data
              </li>
              <li>
                <strong>Withdraw consent</strong> for data processing (e.g.,
                unsubscribe from newsletters)
              </li>
              <li>
                <strong>Port</strong> your data to another service
              </li>
              <li>
                <strong>Object</strong> to processing of your personal data
              </li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:contact@lootboxes.com">contact@lootboxes.com</a>.
              We will process your request within 30 days.
            </p>

            <h2>9. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your
              data, including encrypted data transmission (HTTPS), secure
              database hosting with access controls, and regular security
              reviews. However, no method of transmission over the Internet is
              100% secure, and we cannot guarantee absolute security.
            </p>

            <h2>10. Children&apos;s Privacy</h2>
            <p>
              The Site is not directed at children under the age of 13. We do
              not knowingly collect personal information from children under 13.
              If you are a parent or guardian and believe your child has provided
              us with personal information, please contact us and we will delete
              it.
            </p>

            <h2>11. International Users</h2>
            <p>
              If you are accessing the Site from outside the United States,
              please be aware that your information may be transferred to,
              stored, and processed in the United States where our servers are
              located. By using the Site, you consent to this transfer.
            </p>

            <h2>12. California Privacy Rights (CCPA)</h2>
            <p>
              If you are a California resident, you have additional rights under
              the California Consumer Privacy Act (CCPA), including the right to
              know what personal information is collected, the right to request
              deletion, and the right to opt out of the sale of personal
              information. As noted above, we do not sell personal information.
            </p>

            <h2>13. European Privacy Rights (GDPR)</h2>
            <p>
              If you are located in the European Economic Area (EEA), you have
              additional rights under the General Data Protection Regulation
              (GDPR). Our legal basis for processing personal data is consent
              (for newsletter subscriptions) and legitimate interest (for
              anonymous analytics and site improvement). You can withdraw consent
              at any time.
            </p>

            <h2>14. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with an updated &quot;Last updated&quot;
              date. We encourage you to review this page periodically. Continued
              use of the Site after changes constitutes acceptance of the
              updated policy.
            </p>

            <h2>15. Contact</h2>
            <p>
              For privacy-related questions or to exercise your data rights,
              contact us at:
            </p>
            <ul>
              <li>
                Email:{" "}
                <a href="mailto:contact@lootboxes.com">
                  contact@lootboxes.com
                </a>
              </li>
              <li>
                Subject line: &quot;Privacy Request&quot; for data-related
                inquiries
              </li>
            </ul>
            <p>
              For more ways to reach us, visit our{" "}
              <Link href="/contact">Contact page</Link>.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
