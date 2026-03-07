import Link from "next/link";
import { ExternalLink, ChevronLeft, Star, CheckCircle, XCircle, ArrowRight, Shield } from "lucide-react";
import AffiliateDisclosure from "@/components/cs2/AffiliateDisclosure";

const MARKETPLACES = [
  {
    name: "CSFloat",
    dealId: "csfloat",
    logo: "C",
    color: "#4f8df0",
    sellerFee: "2%",
    buyerFee: "0%",
    payment: ["Credit Card", "Crypto", "PayPal"],
    cashout: ["Bank Transfer", "Crypto", "PayPal"],
    minCashout: "$5",
    trustScore: 9.2,
    highlight: "Lowest fees in the industry",
    hasApi: true,
    hasBargain: true,
    hasInspect: true,
    p2p: true,
    editorPick: true,
  },
  {
    name: "Skinport",
    dealId: "skinport",
    logo: "S",
    color: "#eb4b98",
    sellerFee: "5%",
    buyerFee: "0%",
    payment: ["Credit Card", "PayPal", "Klarna", "iDEAL"],
    cashout: ["Bank Transfer", "PayPal"],
    minCashout: "$10",
    trustScore: 9.0,
    highlight: "Best UI & checkout experience",
    hasApi: true,
    hasBargain: false,
    hasInspect: true,
    p2p: false,
    editorPick: false,
  },
  {
    name: "Buff163",
    dealId: "buff163",
    logo: "B",
    color: "#ff6b35",
    sellerFee: "2.5%",
    buyerFee: "0%",
    payment: ["Alipay", "WeChat Pay", "Credit Card"],
    cashout: ["Alipay", "Bank Transfer"],
    minCashout: "¥10",
    trustScore: 8.8,
    highlight: "Largest marketplace by volume",
    hasApi: true,
    hasBargain: true,
    hasInspect: true,
    p2p: true,
    editorPick: false,
  },
  {
    name: "DMarket",
    dealId: "dmarket",
    logo: "D",
    color: "#00c9a7",
    sellerFee: "3%",
    buyerFee: "0%",
    payment: ["Credit Card", "Crypto", "PayPal"],
    cashout: ["Crypto", "PayPal"],
    minCashout: "$5",
    trustScore: 8.5,
    highlight: "Best for instant crypto cashout",
    hasApi: true,
    hasBargain: false,
    hasInspect: true,
    p2p: true,
    editorPick: false,
  },
  {
    name: "Tradeit.gg",
    dealId: "tradeit",
    logo: "T",
    color: "#5865F2",
    sellerFee: "0-7%",
    buyerFee: "0%",
    payment: ["Crypto", "Skins"],
    cashout: ["Crypto", "Skins"],
    minCashout: "$1",
    trustScore: 8.3,
    highlight: "Instant skin-to-skin trading",
    hasApi: true,
    hasBargain: false,
    hasInspect: true,
    p2p: true,
    editorPick: false,
  },
  {
    name: "BitSkins",
    dealId: "bitskins",
    logo: "B",
    color: "#f97316",
    sellerFee: "5%",
    buyerFee: "0%",
    payment: ["Credit Card", "Crypto", "PayPal"],
    cashout: ["PayPal", "Crypto", "Bank"],
    minCashout: "$5",
    trustScore: 8.2,
    highlight: "Established since 2015",
    hasApi: true,
    hasBargain: false,
    hasInspect: true,
    p2p: false,
    editorPick: false,
  },
  {
    name: "Mannco.store",
    dealId: "mannco",
    logo: "M",
    color: "#cf6a32",
    sellerFee: "5%",
    buyerFee: "0%",
    payment: ["Credit Card", "Crypto"],
    cashout: ["Crypto", "Bank Transfer"],
    minCashout: "$10",
    trustScore: 7.8,
    highlight: "Best for TF2 + CS2 combined",
    hasApi: false,
    hasBargain: false,
    hasInspect: false,
    p2p: false,
    editorPick: false,
  },
  {
    name: "Waxpeer",
    dealId: "waxpeer",
    logo: "W",
    color: "#7c3aed",
    sellerFee: "5%",
    buyerFee: "0%",
    payment: ["Crypto", "Credit Card"],
    cashout: ["Crypto"],
    minCashout: "$5",
    trustScore: 7.9,
    highlight: "P2P with automated bot trading",
    hasApi: true,
    hasBargain: true,
    hasInspect: true,
    p2p: true,
    editorPick: false,
  },
  {
    name: "Steam Market",
    dealId: "steam",
    logo: "V",
    color: "#1b2838",
    sellerFee: "15%",
    buyerFee: "0%",
    payment: ["Steam Wallet"],
    cashout: ["Steam Wallet only"],
    minCashout: "N/A",
    trustScore: 9.5,
    highlight: "Most trusted — but highest fees",
    hasApi: false,
    hasBargain: false,
    hasInspect: false,
    p2p: false,
    editorPick: false,
  },
];

const Check = () => <CheckCircle className="h-4 w-4 text-emerald-500" />;
const Cross = () => <XCircle className="h-4 w-4 text-gray-300" />;

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-r from-gray-50 via-slate-50 to-gray-100 py-10">
        <div className="container-main">
          <Link href="/cs2" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ChevronLeft className="h-4 w-4" /> CS2 Skins Hub
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-700 text-white">
              <ExternalLink className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Marketplace Comparison</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Side-by-side comparison of every major CS2 skin marketplace. Fees, cashout options, features, and trust ratings — updated for 2026.
          </p>
        </div>
      </section>

      {/* Quick recommendation banner */}
      <section className="border-b border-blue-100 bg-blue-50/60 py-4">
        <div className="container-main flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Our Pick:</span>
          </div>
          <p className="text-sm text-blue-800">
            <strong>CSFloat</strong> offers the lowest seller fees (2%) with full P2P trading. Best overall for most users.
          </p>
          <a
            href="/go/cs2/csfloat?from=compare-banner"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Visit CSFloat <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </section>

      {/* Comparison cards */}
      <section className="py-10">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MARKETPLACES.map((mp) => (
              <div
                key={mp.name}
                className={`rounded-xl border bg-white p-6 shadow-sm relative ${
                  mp.editorPick ? "border-blue-300 ring-2 ring-blue-100" : "border-gray-200"
                }`}
              >
                {mp.editorPick && (
                  <div className="absolute -top-3 left-4 inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold text-white">
                    <Star className="h-3 w-3" /> EDITOR&apos;S PICK
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white text-xl font-bold"
                    style={{ backgroundColor: mp.color }}
                  >
                    {mp.logo}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{mp.name}</h3>
                    <p className="text-xs text-gray-500">{mp.highlight}</p>
                  </div>
                </div>

                {/* Trust score */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${mp.trustScore * 10}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900">{mp.trustScore}/10</span>
                </div>

                {/* Key details */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Seller Fee</span>
                    <span className={`font-bold ${parseFloat(mp.sellerFee) <= 2 ? "text-emerald-600" : parseFloat(mp.sellerFee) >= 10 ? "text-red-500" : "text-gray-900"}`}>
                      {mp.sellerFee}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Min Cashout</span>
                    <span className="font-medium text-gray-900">{mp.minCashout}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Payment</span>
                    <span className="text-xs text-gray-700 text-right">{mp.payment.join(", ")}</span>
                  </div>
                </div>

                {/* Feature checks */}
                <div className="border-t border-gray-100 pt-3 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      {mp.hasApi ? <Check /> : <Cross />}
                      <span className="text-gray-700">API Access</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {mp.hasBargain ? <Check /> : <Cross />}
                      <span className="text-gray-700">Bargain System</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {mp.hasInspect ? <Check /> : <Cross />}
                      <span className="text-gray-700">In-Game Inspect</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {mp.p2p ? <Check /> : <Cross />}
                      <span className="text-gray-700">P2P Trading</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href={`/go/cs2/${mp.dealId}?from=compare`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                    mp.editorPick
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Visit {mp.name} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fee comparison summary */}
      <section className="py-10 border-t border-gray-100 bg-gray-50">
        <div className="container-main">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Fee Comparison</h2>
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="grid grid-cols-4 gap-0 border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span>Marketplace</span>
              <span>Seller Fee</span>
              <span>You Keep ($100)</span>
              <span className="text-right">Visit</span>
            </div>
            {[...MARKETPLACES]
              .sort((a, b) => parseFloat(a.sellerFee) - parseFloat(b.sellerFee))
              .map((mp) => {
                const feeNum = parseFloat(mp.sellerFee);
                const keep = 100 - feeNum;
                return (
                  <div key={mp.name} className="grid grid-cols-4 gap-0 border-b border-gray-50 px-5 py-3 items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded text-white text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: mp.color }}>
                        {mp.logo}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{mp.name}</span>
                    </div>
                    <span className={`text-sm font-bold ${feeNum <= 3 ? "text-emerald-600" : feeNum >= 10 ? "text-red-500" : "text-amber-600"}`}>{mp.sellerFee}</span>
                    <span className="text-sm font-bold text-gray-900">{isNaN(keep) ? "Varies" : `$${keep.toFixed(0)}`}</span>
                    <div className="text-right">
                      <a
                        href={`/go/cs2/${mp.dealId}?from=compare-table`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                      >
                        Visit <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="mt-8 text-center">
            <Link href="/cs2/prices" className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800 transition-colors">
              Start Tracking Prices <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Affiliate disclosure */}
      <AffiliateDisclosure />
    </div>
  );
}
