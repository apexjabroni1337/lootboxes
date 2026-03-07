import Link from "next/link";

/**
 * FTC-compliant affiliate disclosure shown on all CS2 pages
 * that contain outbound marketplace links.
 */
export default function AffiliateDisclosure() {
  return (
    <div className="border-t border-gray-100 bg-gray-50/70">
      <div className="container-main py-4">
        <p className="text-[11px] text-gray-400 leading-relaxed text-center">
          <span className="font-semibold text-gray-500">Affiliate Disclosure:</span>{" "}
          Some links on this page are affiliate links. LootBoxes.com may earn a commission
          if you make a purchase through these links, at no extra cost to you. This helps
          support free tools like our{" "}
          <Link href="/cs2/simulator" className="underline hover:text-gray-600">
            Case Simulator
          </Link>{" "}
          and{" "}
          <Link href="/cs2/prices" className="underline hover:text-gray-600">
            Price Tracker
          </Link>
          . We only recommend marketplaces we&apos;ve personally reviewed and trust.
        </p>
      </div>
    </div>
  );
}
