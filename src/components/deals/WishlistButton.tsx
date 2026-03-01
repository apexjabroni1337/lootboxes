"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface WishlistButtonProps {
  dealId: string;
  className?: string;
}

function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("lootboxes_wishlist") || "[]");
  } catch {
    return [];
  }
}

function setWishlist(ids: string[]) {
  try {
    localStorage.setItem("lootboxes_wishlist", JSON.stringify(ids));
  } catch {}
}

export default function WishlistButton({ dealId, className = "" }: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    setWishlisted(getWishlist().includes(dealId));
  }, [dealId]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const list = getWishlist();
    let next: string[];
    if (list.includes(dealId)) {
      next = list.filter((id) => id !== dealId);
    } else {
      next = [...list, dealId];
    }
    setWishlist(next);
    setWishlisted(next.includes(dealId));
  };

  return (
    <button
      onClick={toggle}
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110 hover:bg-white ${className}`}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`h-4 w-4 transition-colors ${
          wishlisted
            ? "fill-red-500 text-red-500"
            : "fill-transparent text-gray-500 hover:text-red-400"
        }`}
      />
    </button>
  );
}
