import Link from "next/link";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import { STORES } from "@/lib/types";

const FOOTER_SECTIONS = {
  Product: [
    { label: "Hot Deals", href: "/deals" },
    { label: "Browse Games", href: "/games" },
    { label: "Analytics", href: "/analytics" },
    { label: "Drop Rates", href: "/drop-rates" },
    { label: "Price Alerts", href: "/newsletter" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Editorial Policy", href: "/about#editorial" },
    { label: "Affiliate Disclosure", href: "/about#disclosure" },
    { label: "Contact", href: "/about#contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const TRACKED_STORES = [
  "steam",
  "epic",
  "gog",
  "humble",
  "fanatical",
  "gmg",
  "gamebillet",
  "2game",
  "gamesplanet",
  "dlgamer",
  "indiegala",
  "gamersgate",
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      {/* Store strip */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container-main py-6">
          <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Comparing prices across {TRACKED_STORES.length}+ stores
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            {TRACKED_STORES.map((key) => {
              const store = STORES[key];
              if (!store) return null;
              return (
                <span
                  key={key}
                  className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5"
                >
                  <span
                    className="inline-flex h-4 w-4 items-center justify-center rounded text-[8px] font-bold text-white"
                    style={{ backgroundColor: store.color }}
                  >
                    {store.name.charAt(0)}
                  </span>
                  <span className="text-xs font-medium text-gray-600">
                    {store.name}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Newsletter strip */}
      <div className="border-b border-gray-200 bg-brand-50">
        <div className="container-main flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Never miss a deal
            </h3>
            <p className="text-sm text-gray-600">
              Get the best gaming deals and analytics delivered weekly.
            </p>
          </div>
          <NewsletterForm variant="inline" className="w-full sm:w-auto" />
        </div>
      </div>

      {/* Main footer links */}
      <div className="container-main py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                <span className="text-base font-bold text-white">L</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                Loot<span className="text-brand-600">boxes</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-gray-500">
              The smartest way to buy games. Compare prices across every store,
              track historic lows, and analyze in-game monetization — all in one place.
            </p>

            {/* Social links */}
            <div className="mt-5 flex gap-2">
              {[
                { label: "Twitter", href: "https://twitter.com/lootboxescom" },
                { label: "YouTube", href: "https://youtube.com/@lootboxes" },
                { label: "Discord", href: "https://discord.gg/lootboxes" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-[11px] font-bold text-gray-400 transition-colors hover:border-brand-300 hover:text-brand-600"
                  aria-label={s.label}
                >
                  {s.label.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_SECTIONS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold text-gray-900">{heading}</h4>
              <ul className="mt-3 space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors hover:text-gray-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Lootboxes.com. All rights reserved.
          </p>
          <p className="max-w-lg text-center text-[11px] text-gray-400 sm:text-right">
            Lootboxes.com earns commissions on purchases made through our affiliate
            links. This doesn&apos;t affect our ratings or recommendations. Prices
            and availability are subject to change.
          </p>
        </div>
      </div>
    </footer>
  );
}
