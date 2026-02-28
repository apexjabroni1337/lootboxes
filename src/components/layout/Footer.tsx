import Link from "next/link";
import NewsletterForm from "@/components/newsletter/NewsletterForm";

const FOOTER_LINKS = {
  Product: [
    { label: "Deals", href: "/deals" },
    { label: "Analytics", href: "/analytics" },
    { label: "Drop Rates", href: "/drop-rates" },
    { label: "Blog", href: "/blog" },
  ],
  Company: [
    { label: "About", href: "/about" },
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

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
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

      {/* Links */}
      <div className="container-main py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                <span className="text-base font-bold text-white">L</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                Loot<span className="text-brand-600">boxes</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              Save smarter. Spend wiser. The best gaming deals and in-game value
              analysis in one place.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold text-gray-900">{heading}</h4>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-700"
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
        <div className="mt-12 border-t border-gray-200 pt-6">
          <p className="text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Lootboxes.com. All rights
            reserved. Lootboxes.com earns commissions on purchases made through
            our affiliate links. This doesn&apos;t affect our ratings or
            recommendations.
          </p>
        </div>
      </div>
    </footer>
  );
}
