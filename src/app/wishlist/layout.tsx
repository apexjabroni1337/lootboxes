import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist — Track Games You Want | LootBoxes",
  description:
    "Keep track of games you want and get notified when they go on sale. Your personal LootBoxes.com wishlist.",
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
