"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "./WishlistProvider";

interface WishlistButtonProps {
  slug: string;
  size?: "sm" | "md";
  className?: string;
}

export default function WishlistButton({
  slug,
  size = "sm",
  className = "",
}: WishlistButtonProps) {
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(slug);

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const padding = size === "sm" ? "p-1.5" : "p-2";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={`rounded-full transition-all ${padding} ${
        wishlisted
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-black/40 text-white/80 hover:bg-black/60 hover:text-white backdrop-blur-sm"
      } ${className}`}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`${iconSize} ${wishlisted ? "fill-current" : ""}`}
      />
    </button>
  );
}
