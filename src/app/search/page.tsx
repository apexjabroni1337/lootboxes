"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Search, Gamepad2, FileText, Tag, ExternalLink } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { formatPrice, formatDiscount } from "@/lib/utils";
import { STORES } from "@/lib/types";
import GameAvatar from "@/components/ui/GameAvatar";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        setResults(await res.json());
      } catch {
        setResults(null);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const totalResults =
    (results?.games?.length || 0) +
    (results?.deals?.length || 0) +
    (results?.analytics?.length || 0);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Search</h1>

      <div className="relative mt-4">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search games, deals, articles..."
          className="input w-full py-3 pl-12 text-base"
          autoFocus
        />
      </div>

      <div className="mt-6">
        {loading && (
          <p className="text-center text-sm text-gray-400">Searching...</p>
        )}

        {!loading && query.length >= 2 && totalResults === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              No results found for &ldquo;{query}&rdquo;
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Try a different search term or browse our{" "}
              <Link href="/games" className="text-brand-600 hover:underline">
                games catalog
              </Link>.
            </p>
          </div>
        )}

        {/* Games results */}
        {results?.games?.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase text-gray-400">
              Games ({results.games.length})
            </h2>
            <div className="space-y-2">
              {results.games.map((game: any) => (
                <Link
                  key={game.id}
                  href={`/games/${game.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="h-12 w-9 flex-shrink-0 overflow-hidden rounded-lg">
                    {game.cover_image ? (
                      <img src={game.cover_image} alt={game.title} className="h-full w-full object-cover" />
                    ) : (
                      <GameAvatar gameName={game.title} size="sm" aspectRatio="portrait" className="h-full w-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">{game.title}</div>
                    <div className="text-sm text-gray-500">{game.platforms?.join(", ")}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Deal results */}
        {results?.deals?.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 text-sm font-semibold uppercase text-gray-400">
              Best Deals ({results.deals.length})
            </h2>
            <div className="space-y-2">
              {results.deals.map((deal: any) => {
                const store = STORES[deal.store] || { name: deal.store, color: "#666" };
                return (
                  <Link
                    key={deal.id}
                    href={`/games/${deal.game.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
                  >
                    <div className="h-12 w-9 flex-shrink-0 overflow-hidden rounded-lg">
                      {deal.game.cover_image ? (
                        <img src={deal.game.cover_image} alt={deal.game.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                          <Tag className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">{deal.game.title}</div>
                      <div className="mt-1 flex items-center gap-2 text-sm">
                        <span className="rounded px-1.5 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: store.color }}>
                          {store.name}
                        </span>
                        <span className="text-gray-400 line-through">{formatPrice(deal.original_price)}</span>
                        <span className="font-bold text-gray-900 dark:text-white">{formatPrice(deal.price)}</span>
                      </div>
                    </div>
                    <span className="badge-discount">{formatDiscount(deal.discount_pct)}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Analytics results */}
        {results?.analytics?.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 text-sm font-semibold uppercase text-gray-400">
              Articles ({results.analytics.length})
            </h2>
            <div className="space-y-2">
              {results.analytics.map((article: any) => (
                <Link
                  key={article.id}
                  href={`/analytics/${article.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
                >
                  <FileText className="h-5 w-5 flex-shrink-0 text-gray-400" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">{article.title}</div>
                    <div className="text-sm text-gray-500">{article.excerpt}</div>
                  </div>
                  <span className="badge-type text-xs uppercase">{article.type}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="py-8">
      <div className="container-main">
        <Suspense
          fallback={
            <div className="mx-auto max-w-2xl">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Search</h1>
              <div className="mt-4 h-12 animate-pulse rounded-lg bg-gray-200" />
            </div>
          }
        >
          <SearchContent />
        </Suspense>
      </div>
    </div>
  );
}
