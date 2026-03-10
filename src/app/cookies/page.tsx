import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — LootBoxes.com",
  description:
    "Learn about the cookies LootBoxes.com uses, why we use them, and how you can control them. We use minimal cookies — no advertising trackers.",
  openGraph: {
    title: "Cookie Policy — LootBoxes.com",
    description: "What cookies LootBoxes.com uses and how to control them.",
    url: "https://lootboxes.com/cookies",
    type: "website",
  },
  alternates: { canonical: "https://lootboxes.com/cookies" },
};

export default function CookiePolicyPage() {
  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-950 py-8">
        <div className="container-main">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cookie Policy</h1>
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
              We use a minimal number of cookies — only what&apos;s necessary
              for the site to work and to understand anonymous traffic patterns.
              We do not use advertising cookies, retargeting pixels, or
              cross-site tracking.
            </p>
          </div>

          <article className="prose prose-gray max-w-none prose-headings:text-gray-900 dark:text-white prose-a:text-brand-600 hover:prose-a:text-brand-700">
            <h2>What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device
              (computer, tablet, or phone) when you visit a website. They help
              websites remember your preferences, understand how you use the
              site, and improve your experience. Cookies can be &quot;session
              cookies&quot; (deleted when you close your browser) or
              &quot;persistent cookies&quot; (remain until they expire or you
              delete them).
            </p>

            <h2>Cookies We Use</h2>
            <p>
              LootBoxes.com uses a limited set of cookies, organized into the
              following categories:
            </p>

            <h3>Essential Cookies</h3>
            <p>
              These cookies are necessary for the Site to function. They enable
              core features and cannot be disabled without affecting site
              functionality.
            </p>
            <div className="not-prose overflow-x-auto mb-6">
              <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                      Cookie
                    </th>
                    <th className="px-4 py-2.5 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                      Purpose
                    </th>
                    <th className="px-4 py-2.5 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr>
                    <td className="px-4 py-2.5 text-gray-700 dark:text-gray-200 font-mono text-xs">
                      __vercel_live_token
                    </td>
                    <td className="px-4 py-2.5 text-gray-600 dark:text-gray-300">
                      Vercel deployment and routing
                    </td>
                    <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-gray-700 dark:text-gray-200 font-mono text-xs">
                      theme
                    </td>
                    <td className="px-4 py-2.5 text-gray-600 dark:text-gray-300">
                      Remembers your light/dark mode preference
                    </td>
                    <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Analytics Cookies</h3>
            <p>
              These cookies help us understand how visitors use the Site. All
              data collected is anonymous and aggregated — we cannot identify
              individual users.
            </p>
            <div className="not-prose overflow-x-auto mb-6">
              <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                      Cookie
                    </th>
                    <th className="px-4 py-2.5 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                      Purpose
                    </th>
                    <th className="px-4 py-2.5 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr>
                    <td className="px-4 py-2.5 text-gray-700 dark:text-gray-200 font-mono text-xs">
                      va_*
                    </td>
                    <td className="px-4 py-2.5 text-gray-600 dark:text-gray-300">
                      Vercel Analytics — anonymous page views and performance
                      metrics
                    </td>
                    <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Cookies We Do NOT Use</h3>
            <p>
              For transparency, here are categories of cookies we deliberately
              do not use:
            </p>
            <ul>
              <li>
                <strong>Advertising cookies</strong> — We do not serve targeted
                ads
              </li>
              <li>
                <strong>Retargeting pixels</strong> — We do not follow you
                around the web
              </li>
              <li>
                <strong>Social media tracking</strong> — No Facebook Pixel,
                TikTok Pixel, or similar
              </li>
              <li>
                <strong>Cross-site tracking</strong> — We do not share browsing
                data with ad networks
              </li>
              <li>
                <strong>Google Analytics</strong> — We use Vercel&apos;s
                privacy-focused analytics instead
              </li>
            </ul>

            <h2>Third-Party Cookies</h2>
            <p>
              When you click an affiliate link and visit a third-party store
              (e.g., Humble Bundle, GOG, Fanatical), that store may set its own
              cookies on your device. These cookies are governed by the
              respective store&apos;s cookie and privacy policies, not ours. We
              have no control over these cookies.
            </p>
            <p>
              Similarly, if we embed third-party content (such as YouTube videos
              or Discord widgets), those services may set their own cookies.
            </p>

            <h2>How to Control Cookies</h2>
            <p>
              You can control and manage cookies in several ways:
            </p>
            <ul>
              <li>
                <strong>Browser settings:</strong> Most browsers allow you to
                block or delete cookies through their settings menu. Note that
                blocking essential cookies may affect site functionality.
              </li>
              <li>
                <strong>Private browsing:</strong> Using incognito or private
                browsing mode prevents persistent cookies from being stored.
              </li>
              <li>
                <strong>Cookie extensions:</strong> Browser extensions like
                uBlock Origin or Privacy Badger can provide additional control
                over cookies and trackers.
              </li>
            </ul>
            <p>
              Below are links to cookie management instructions for common
              browsers:
            </p>
            <ul>
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Microsoft Edge
                </a>
              </li>
            </ul>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy if we add or remove cookies.
              Changes will be posted on this page with an updated &quot;Last
              updated&quot; date. If we begin using any new category of cookies
              (such as advertising cookies), we will update this policy and
              provide notice.
            </p>

            <h2>Contact</h2>
            <p>
              If you have questions about our use of cookies, contact us at{" "}
              <a href="mailto:contact@lootboxes.com">contact@lootboxes.com</a>{" "}
              or visit our <Link href="/contact">Contact page</Link>. For
              broader privacy questions, see our{" "}
              <Link href="/privacy">Privacy Policy</Link>.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
