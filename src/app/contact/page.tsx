import Link from "next/link";
import { Metadata } from "next";
import {
  Mail,
  MessageSquare,
  Handshake,
  AlertCircle,
  Newspaper,
  Shield,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — LootBoxes.com",
  description:
    "Get in touch with the LootBoxes.com team. Reach out for general inquiries, partnerships, press, editorial corrections, or support.",
  openGraph: {
    title: "Contact Us — LootBoxes.com",
    description: "Get in touch with the LootBoxes.com team.",
    url: "https://lootboxes.com/contact",
    type: "website",
  },
  alternates: { canonical: "https://lootboxes.com/contact" },
};

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    title: "General Inquiries",
    email: "contact@lootboxes.com",
    description:
      "For general questions, feedback, feature requests, or anything else.",
  },
  {
    icon: Handshake,
    title: "Partnerships & Sponsorships",
    email: "partnerships@lootboxes.com",
    description:
      "Interested in partnering with us? Store affiliations, sponsored content, and business development.",
  },
  {
    icon: Shield,
    title: "Editorial & Corrections",
    email: "editorial@lootboxes.com",
    description:
      "Found an error in our data? Have evidence of incorrect drop rates or scores? Let our editorial team know.",
  },
  {
    icon: Newspaper,
    title: "Press & Media",
    email: "press@lootboxes.com",
    description:
      "Media inquiries, interview requests, citations, and press-related questions.",
  },
  {
    icon: AlertCircle,
    title: "Report an Issue",
    email: "support@lootboxes.com",
    description:
      "Broken links, site bugs, incorrect pricing data, or technical issues with the site.",
  },
  {
    icon: MessageSquare,
    title: "Community & Social",
    email: null,
    description:
      "Join our community on Discord, follow us on Twitter/X, or subscribe on YouTube for the latest updates.",
    social: true,
  },
];

export default function ContactPage() {
  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-950 py-8">
        <div className="container-main">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Us</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Have a question, feedback, or business inquiry? We&apos;d love to
              hear from you. Choose the most relevant channel below and
              we&apos;ll get back to you as soon as we can.
            </p>
          </div>
        </div>
      </section>

      <div className="container-main mt-8">
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {CONTACT_CHANNELS.map((channel) => (
              <div
                key={channel.title}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-5 transition-all hover:border-gray-300 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-800/30">
                  <channel.icon className="h-5 w-5 text-brand-600" />
                </div>
                <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
                  {channel.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {channel.description}
                </p>
                {channel.email && (
                  <a
                    href={`mailto:${channel.email}`}
                    className="mt-3 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    {channel.email}
                  </a>
                )}
                {channel.social && (
                  <div className="mt-3 flex gap-2">
                    <a
                      href="https://discord.gg/lootboxes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 transition-colors hover:border-brand-300 hover:text-brand-600"
                    >
                      Discord
                    </a>
                    <a
                      href="https://twitter.com/lootboxescom"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 transition-colors hover:border-brand-300 hover:text-brand-600"
                    >
                      Twitter/X
                    </a>
                    <a
                      href="https://youtube.com/@lootboxes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 transition-colors hover:border-brand-300 hover:text-brand-600"
                    >
                      YouTube
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Response time note */}
          <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Response Times
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              We aim to respond to all inquiries within 48 hours during business
              days. Partnership and press inquiries are typically prioritized.
              For urgent technical issues (site outages, broken deal links),
              please include &quot;URGENT&quot; in the subject line.
            </p>
          </div>

          {/* Legal note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              For legal inquiries, please refer to our{" "}
              <Link
                href="/privacy"
                className="text-brand-600 hover:text-brand-700"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms"
                className="text-brand-600 hover:text-brand-700"
              >
                Terms of Service
              </Link>
              . Data deletion requests can be sent to contact@lootboxes.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
