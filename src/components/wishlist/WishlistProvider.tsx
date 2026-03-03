"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface WishlistContextValue {
  items: string[]; // array of game slugs
  isWishlisted: (slug: string) => boolean;
  toggle: (slug: string) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue>({
  items: [],
  isWishlisted: () => false,
  toggle: () => {},
  count: 0,
});

export function useWishlist() {
  return useContext(WishlistContext);
}

const STORAGE_KEY = "lb-wishlist";

export default function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, mounted]);

  const isWishlisted = useCallback(
    (slug: string) => items.includes(slug),
    [items]
  );

  const toggle = useCallback((slug: string) => {
    setItems((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  return (
    <WishlistContext.Provider
      value={{ items, isWishlisted, toggle, count: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
