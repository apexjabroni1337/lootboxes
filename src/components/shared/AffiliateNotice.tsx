import Link from "next/link";

/**
 * FTC-compliant affiliate disclosure for any page with outbound deal links.
 * Lighter than the CS2-specific AffiliateDisclosure component — uses generic
 * language suitable for game deal pages, the homepage, and game detail pages.
 */
export default function AffiliateNotice() {
  return (
    <div className="border-t border-gray-100 bg-gray-50/70">
      <div className="container-main py-4">
        <p className="text-[11px] text-gray-400 leading-relaxed text-center max-w-3xl mx-auto">
          <span className="font-semibold text-gray-500">
            Affiliate Disclosure:
          </span>{" "}
          Some links on this page are affiliate links. LootBoxes.com may earn a
          commission if you make a purchase through these links, at no extra cost
          to you. This helps keep the site free for everyone. Affiliate
          relationships never influence our deal rankings, scores, or editorial
          recommendations.{" "}
          <Link
            href="/affiliate-disclosure"
            className="underline hover:text-gray-600"
          >
            Learn more
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
