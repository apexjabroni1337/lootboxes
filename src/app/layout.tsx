import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/components/theme/ThemeProvider";
import WishlistProvider from "@/components/wishlist/WishlistProvider";

export const metadata: Metadata = {
  title: {
    default: "LootBoxes.com — Gaming Deals, Drop Rates & In-Game Value Analysis",
    template: "%s | LootBoxes.com",
  },
  description:
    "Find the best gaming deals across every store. Get data-driven loot box analysis, battle pass reviews, and drop rates for every major game.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://lootboxes.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lootboxes.com",
    siteName: "LootBoxes.com",
    title: "LootBoxes.com — Gaming Deals, Drop Rates & In-Game Value Analysis",
    description:
      "Find the best gaming deals across every store. Get data-driven loot box analysis, battle pass reviews, and drop rates for every major game.",
    images: [
      {
        url: "https://lootboxes.com/og-default.png",
        width: 1200,
        height: 630,
        alt: "LootBoxes.com — Gaming Deals, Drop Rates & In-Game Value Analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LootBoxes.com",
    description:
      "Gaming deals, drop rates, and in-game value analysis. Save smarter. Spend wiser.",
    images: ["https://lootboxes.com/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://lootboxes.com",
  },
  keywords: [
    "game deals",
    "gaming deals",
    "video game prices",
    "loot box",
    "drop rates",
    "battle pass review",
    "game price comparison",
    "steam deals",
    "pc game deals",
    "lootboxes score",
  ],
};

// JSON-LD structured data for Google
function JsonLd() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "LootBoxes.com",
      url: "https://lootboxes.com",
      description:
        "Compare game deals across 30+ stores. Transparent loot box analysis, drop rates, and monetization reviews.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://lootboxes.com/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "LootBoxes.com",
      url: "https://lootboxes.com",
      logo: "https://lootboxes.com/icon.svg",
      description:
        "Data-driven loot box transparency, game deal comparison, and monetization analysis for every major game.",
      foundingDate: "2024",
      sameAs: [],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: "https://lootboxes.com/contact",
      },
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script to prevent dark-mode flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("lb-theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme:dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})()`,
          }}
        />
        <JsonLd />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0074C5" />
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" />
        <link rel="preconnect" href="https://images.igdb.com" />
        <link rel="dns-prefetch" href="https://cdn.akamai.steamstatic.com" />
        <link rel="dns-prefetch" href="https://api.skinport.com" />
        <link rel="dns-prefetch" href="https://bymykel.github.io" />
      </head>
      <body className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <ThemeProvider>
          <WishlistProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </WishlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
