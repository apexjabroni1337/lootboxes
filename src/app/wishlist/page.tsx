"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { useEffect, useState } from "react";

interface WishlistGame {
  slug: string;
  title: string;
  cover_image: string | null;
}

export default function WishlistPage() {
  const { items, toggle, count } = useWishlist();
  const [games, setGames] = useState<WishlistGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      setGames([]);
      setLoading(false);
      return;
    }

    // Fetch game details for wishlisted slugs
    async function fetchGames() {
      try {
        const res = await fetch(
          `/api/games/by-slugs?slugs=${items.join(",")}`
        );
        if (res.ok) {
          const data = await res.json();
          setGames(data.games || []);
        }
      } catch {
        // Fallback: just show slugs
        setGames(items.map((s) => ({ slug: s, title: s, cover_image: null })));
      }
      setLoading(false);
    }

    fetchGames();
  }, [items]);

  return (
    <div className="pb-12">
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-8 sm:py-10 dark:border-gray-800 dark:from-gray-900 dark:to-gray-950">
        <div className="container-main">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Wishlist
            </h1>
            {count > 0 && (
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {count} {count === 1 ? "game" : "games"}
              </span>
            )}
          </div>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Track games you&apos;re interested in. We&apos;ll show you the best
            deals when prices drop.
          </p>
        </div>
      </section>

      <div className="container-main mt-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <Heart className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              Your wishlist is empty
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Browse games and tap the heart icon to add them here.
            </p>
            <Link href="/deals" className="btn-primary mt-6 inline-flex">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Deals
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {games.map((game) => (
              <div
                key={game.slug}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Cover */}
                <Link href={`/games/${game.slug}`} className="flex-shrink-0">
                  {game.cover_image ? (
                    <img
                      src={game.cover_image}
                      alt={game.title}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      <Heart className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/games/${game.slug}`}
                    className="font-semibold text-gray-900 hover:text-brand-600 dark:text-white"
                  >
                    {game.title}
                  </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/games/${game.slug}`}
                    className="btn-primary text-xs"
                  >
                    View Deals
                  </Link>
                  <button
                    onClick={() => toggle(game.slug)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
