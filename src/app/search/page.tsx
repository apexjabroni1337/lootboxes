"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Gamepad2, FileText } from "lucide-react";
import { useSearchParams } from "next/navigation";
import ScoreBadge from "@/components/analytics/ScoreBadge";

export default function SearchPage() {
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
    (results?.games?.length || 0) + (results?.analytics?.length || 0);

  return (
    <div className="py-8">
      <div className="container-main">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-900">Search</h1>

          {/* Search input */}
          <div className="relative mt-4">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search games, articles, drop rates..."
              className="input w-full py-3 pl-12 text-base"
              autoFocus
            />
          </div>

          {/* Results */}
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
                      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                    >
                      <Gamepad2 className="h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {game.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {game.platforms?.join(", ")}
                        </div>
                      </div>
                      {game.lootboxes_score && (
                        <ScoreBadge score={game.lootboxes_score} size="sm" />
                      )}
                    </Link>
                  ))}
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
                      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                    >
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {article.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {article.excerpt}
                        </div>
                      </div>
                      <span className="badge-type text-xs uppercase">
                        {article.type}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
