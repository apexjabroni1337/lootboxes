import Link from "next/link";
import { Search, Tag, TrendingDown, Zap } from "lucide-react";

export default function PromoBanners() {
  return (
    <section className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-4">
      <div className="container-main">
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Banner 1 — Value proposition */}
          <Link
            href="/deals"
            className="group flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-5 py-4 shadow-sm transition-all hover:border-brand-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/30 text-brand-600 transition-colors group-hover:bg-brand-100 dark:hover:bg-brand-900/40">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Compare 15+ Stores Instantly
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Find the lowest price for any game — updated every 30 minutes
              </p>
            </div>
          </Link>

          {/* Banner 2 — Current deals */}
          <Link
            href="/deals?filter=historic-low"
            className="group flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-5 py-4 shadow-sm transition-all hover:border-success-600/30 hover:shadow-md"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-success-50 text-success-600 transition-colors group-hover:bg-success-50">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Historic Low Prices Right Now
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Games at their cheapest price ever — grab them before they go up
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
