import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Share2, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";

// TODO: Replace with getPost("blog", slug) + MDXRemote rendering
const MOCK_POST = {
  title: "The 25 Best Steam Summer Sale Deals You Shouldn't Miss",
  excerpt: "We dug through thousands of discounts to find the ones actually worth your money.",
  date: "2026-02-20",
  author: "Lootboxes Team",
  tags: ["Steam", "Deals", "Guide"],
  readTime: 8,
  content: `
## Why Trust Our Picks?

We don't just list every game on sale — we analyze price history across all major stores to find **genuinely good deals**. Every pick here is either at or near its all-time lowest price.

## Our Selection Criteria

Each game in this list was selected based on three factors: the depth of the discount relative to its price history, the game's overall quality (Metacritic, user reviews), and whether it represents good value at the sale price.

## The Top Picks

### Tier 1: Must-Buys (Historic Lows)

These games are at their lowest prices ever. If you've been waiting to pull the trigger, now's the time.

### Tier 2: Great Deals

Not quite historic lows, but still excellent prices that we rarely see.

### Tier 3: Solid Discounts

Good games at good prices — worth it if they're on your wishlist.

## How to Get Even Better Deals

Stack your savings by checking Humble Bundle's store (often has additional coupons), using regional pricing where applicable, and waiting for flash deals during the event.

## Final Thoughts

This summer sale has some standout deals, particularly in the RPG and indie categories. The key is patience — not every deal is as good as it looks. Always check the price history before buying.
  `,
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    title: MOCK_POST.title,
    description: MOCK_POST.excerpt,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = MOCK_POST;

  return (
    <div className="py-8">
      <div className="container-main">
        <div className="mx-auto max-w-3xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="badge-type">{t}</span>
            ))}
          </div>

          {/* Title */}
          <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span>By {post.author}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime} min read
            </span>
          </div>

          {/* Cover image placeholder */}
          <div className="mt-6 h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700">
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl font-bold text-white/20">Cover Image</span>
            </div>
          </div>

          {/* Article body — TODO: replace with MDXRemote */}
          <article className="prose prose-gray mt-8 max-w-none prose-headings:text-gray-900 prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline">
            {post.content.split("\n").map((line, i) => {
              if (line.startsWith("## "))
                return <h2 key={i}>{line.replace("## ", "")}</h2>;
              if (line.startsWith("### "))
                return <h3 key={i}>{line.replace("### ", "")}</h3>;
              if (line.trim()) return <p key={i}>{line}</p>;
              return null;
            })}
          </article>

          {/* Share + nav */}
          <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6">
            <Link
              href="/blog"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              <ArrowLeft className="h-4 w-4" /> More articles
            </Link>
            <button className="btn-secondary flex items-center gap-1 text-sm">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>

          {/* Newsletter CTA */}
          <div className="mt-8 rounded-xl border border-brand-200 bg-brand-50 p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900">
              Get the best deals in your inbox
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Weekly curated deals, price drops, and analysis. No spam.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                className="input w-64 text-sm"
              />
              <button className="btn-primary text-sm">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
