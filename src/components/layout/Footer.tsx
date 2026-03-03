import Link from "next/link";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import { STORES } from "@/lib/types";
import Logo from "@/components/brand/Logo";

const FOOTER_SECTIONS = {
  "Loot Box Database": [
    { label: "Loot Box Database", href: "/lootbox" },
    { label: "Rankings", href: "/lootbox/rankings" },
    { label: "Drop Rates", href: "/drop-rates" },
    { label: "Analytics", href: "/analytics" },
    { label: "Blog", href: "/blog" },
    { label: "Methodology", href: "/methodology" },
  ],
  "Game Deals": [
    { label: "Hot Deals", href: "/deals" },
    { label: "Browse Games", href: "/games" },
    { label: "New Releases", href: "/games/new-releases" },
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
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      {/* Store strip */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
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

      {/* Main footer links */}
      <div className="container-main py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* Brand column */}
          <div className="col-span-2">
            <Logo size="sm" />
            <p className="mt-3 max-w-xs text-sm text-gray-500">
              Loot box transparency for every game. Data-driven analysis, drop rates,
              and monetization scores — plus price comparison across 13+ stores.
            </p>

            {/* Social links */}
            <div className="mt-5 flex gap-2">
              <a
                href="https://twitter.com/lootboxescom"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-colors hover:border-brand-300 hover:text-brand-600"
                aria-label="Twitter"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="https://youtube.com/@lootboxes"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-colors hover:border-brand-300 hover:text-brand-600"
                aria-label="YouTube"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a
                href="https://discord.gg/lootboxes"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-colors hover:border-brand-300 hover:text-brand-600"
                aria-label="Discord"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
              </a>
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
            &copy; {new Date().getFullYear()} LootBoxes.com. All rights reserved.
          </p>
          <p className="max-w-lg text-center text-[11px] text-gray-400 sm:text-right">
            LootBoxes.com earns commissions on purchases made through our affiliate
            links. This doesn&apos;t affect our ratings or recommendations. Prices
            and availability are subject to change.
          </p>
        </div>
      </div>
    </footer>
  );
}
