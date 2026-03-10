import CS2PricesClient from "./CS2PricesClient";

/**
 * CS2 Prices page — renders instantly, data loads client-side.
 *
 * Previously this was a server component that fetched 2000+ items from
 * SteamWebAPI before rendering. On Vercel serverless (cold starts wipe
 * in-memory cache), that external fetch could take 5-15 seconds, blocking
 * the entire page load.
 *
 * Now the page renders the shell immediately and the client component
 * fetches data via our own API routes (which have proper Cache-Control
 * headers and Vercel edge caching).
 */
export default function CS2PricesPage() {
  return (
    <CS2PricesClient
      initialMultiItems={[]}
      initialFallbackItems={[]}
      defaultMode="default"
    />
  );
}
