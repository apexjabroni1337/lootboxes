"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, Gamepad2, FileText } from "lucide-react";
import ScoreBadge from "@/components/analytics/ScoreBadge";

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

  // Keyboard shortcut: Escape to close
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

  // Debounced search
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
    results && (results.games.length > 0 || results.analytics.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl border border-gray-200 bg-white shadow-2xl">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games, articles, drop rates..."
            className="flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400"
          />
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-2 py-0.5 text-xs text-gray-400"
          >
            ESC
          </button>
        </div>

        {/* Results */}
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
              {results!.games.length > 0 && (
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
                      <Gamepad2 className="h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {game.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {game.platforms.join(", ")}
                        </div>
                      </div>
                      {game.lootboxes_score && (
                        <ScoreBadge score={game.lootboxes_score} size="sm" />
                      )}
                    </Link>
                  ))}
                </div>
              )}

              {/* Analytics */}
              {results!.analytics.length > 0 && (
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
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {article.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {article.type}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Quick actions */}
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
