import { Mail, TrendingDown, BarChart3, Bell } from "lucide-react";
import NewsletterForm from "@/components/newsletter/NewsletterForm";

export const metadata = {
  title: "Newsletter — Weekly Gaming Deals & Loot Box Analysis",
  description:
    "Get the best gaming deals and loot box analysis delivered to your inbox every week. Free, no spam.",
};

export default function NewsletterPage() {
  return (
    <div className="py-16">
      <div className="container-main max-w-2xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100">
          <Mail className="h-7 w-7 text-brand-600" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl">
          The LootBoxes Weekly
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          One email per week. The best deals, smartest analysis, and everything
          you need to spend wisely on games. No spam, unsubscribe anytime.
        </p>

        {/* Signup form */}
        <NewsletterForm variant="stacked" className="mx-auto mt-8 max-w-md" />

        <p className="mt-3 text-xs text-gray-400">
          Join 0 gamers saving money every week. (We just launched — be the
          first!)
        </p>

        {/* What you get */}
        <div className="mt-12 grid gap-6 text-left sm:grid-cols-3">
          <div className="card text-center">
            <TrendingDown className="mx-auto h-6 w-6 text-success-600" />
            <h3 className="mt-3 text-sm font-semibold text-gray-900">
              Top 5 Deals
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Hand-picked best deals of the week with affiliate links to save
              you time.
            </p>
          </div>
          <div className="card text-center">
            <BarChart3 className="mx-auto h-6 w-6 text-brand-600" />
            <h3 className="mt-3 text-sm font-semibold text-gray-900">
              Featured Analysis
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              One deep-dive battle pass or loot box review with our LootBoxes
              Score.
            </p>
          </div>
          <div className="card text-center">
            <Bell className="mx-auto h-6 w-6 text-warning-500" />
            <h3 className="mt-3 text-sm font-semibold text-gray-900">
              Quick Hits
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Industry news, deal trends, and data points you won&apos;t find
              anywhere else.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
