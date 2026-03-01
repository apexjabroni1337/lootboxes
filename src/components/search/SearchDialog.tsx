"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, FileText, Tag } from "lucide-react";
import { formatPrice, formatDiscount } from "@/lib/utils";
import { STORES } from "@/lib/types";
import GameAvatar from "@/components/ui/GameAvatar";

interface SearchResult {
  games: {
    id: string;
    title: string;
    slug: string;
    cover_image: string | null;
    platforms: string[];
    genres: string[];
    lootboxes_score: number | null;
  }[];
  deals: {
    id: string;
    store: string;
    price: number;
    original_price: number;
    discount_pct: number;
    is_historic_low: boolean;
    game: {
      id: string;
      title: string;
      slug: string;
      cover_image: string | null;
    };
  }[];
  analytics: {
    id: string;
    title: string;
    slug: string;
    type: string;
    excerpt: string;
    lootboxes_score: number | null;
    cover_image: string | null;
  }[];
}

export default function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setQuery("");
      setResults(null);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.length < 2) {
      setResults(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch {
        setResults(null);
      }
      setLoading(false);
    }, 300);
  }, [query]);

  if (!open) return null;

  const hasResults =
    results &&
    ((results.games?.length || 0) > 0 ||
      (results.deals?.length || 0) > 0 ||
      (results.analytics?.length || 0) > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games, deals, articles..."
            className="flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400"
          />
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-2 py-0.5 text-xs text-gray-400"
          >
            ESC
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {loading && (
            <div className="py-8 text-center text-sm text-gray-400">
              Searching...
            </div>
          )}

          {!loading && query.length >= 2 && !hasResults && (
            <div className="py-8 text-center text-sm text-gray-400">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {hasResults && (
            <>
              {/* Games */}
              {results!.games?.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-semibold uppercase text-gray-400">
                    Games
                  </div>
                  {results!.games.map((game) => (
                    <Link
                      key={game.id}
                      href={`/games/${game.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="h-8 w-6 flex-shrink-0 overflow-hidden rounded">
                        {game.cover_image ? (
                          <img src={game.cover_image} alt={game.title} className="h-full w-full object-cover" />
                        ) : (
                          <GameAvatar gameName={game.title} size="sm" aspectRatio="portrait" className="h-full w-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{game.title}</div>
                        <div className="text-xs text-gray-500">{game.platforms?.join(", ")}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Deals */}
              {results!.deals?.length > 0 && (
                <div className="mt-1">
                  <div className="px-3 py-2 text-xs font-semibold uppercase text-gray-400">
                    Best Deals
                  </div>
                  {results!.deals.map((deal) => {
                    const store = STORES[deal.store] || { name: deal.store, color: "#666" };
                    return (
                      <Link
                        key={deal.id}
                        href={`/games/${deal.game.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-50"
                      >
                        <div className="h-8 w-6 flex-shrink-0 overflow-hidden rounded">
                          {deal.game.cover_image ? (
                            <img src={deal.game.cover_image} alt={deal.game.title} className="h-full w-full object-cover" />
                          ) : (
                            <Tag className="h-4 w-4 text-gray-400 mx-auto mt-2" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{deal.game.title}</div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="rounded px-1 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: store.color }}>
                              {store.name}
                            </span>
                            <span className="text-gray-400 line-through">{formatPrice(deal.original_price)}</span>
                            <span className="font-bold text-gray-900">{formatPrice(deal.price)}</span>
                          </div>
                        </div>
                        <span className="badge-discount text-xs">{formatDiscount(deal.discount_pct)}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Analytics */}
              {results!.analytics?.length > 0 && (
                <div className="mt-1">
                  <div className="px-3 py-2 text-xs font-semibold uppercase text-gray-400">
                    Articles
                  </div>
                  {results!.analytics.map((article) => (
                    <Link
                      key={article.id}
                      href={`/analytics/${article.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-50"
                    >
                      <FileText className="h-4 w-4 flex-shrink-0 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{article.title}</div>
                        <div className="text-xs text-gray-500">{article.type}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Quick links when empty */}
          {!query && (
            <div className="py-4">
              <div className="px-3 py-2 text-xs font-semibold uppercase text-gray-400">
                Quick links
              </div>
              {[
                { href: "/deals", label: "Today's Best Deals", icon: "🔥" },
                { href: "/games", label: "Browse All Games", icon: "🎮" },
                { href: "/analytics", label: "Latest Analysis", icon: "📊" },
                { href: "/drop-rates", label: "Drop Rate Database", icon: "🎲" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
