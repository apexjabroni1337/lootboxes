import Link from "next/link";
import { Calendar, Clock, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Deterministic gradient for blog posts (similar to GameAvatar concept)
const POST_GRADIENTS = [
  "from-brand-500 to-brand-700",
  "from-purple-500 to-indigo-700",
  "from-emerald-500 to-teal-700",
  "from-amber-500 to-orange-700",
  "from-rose-500 to-pink-700",
  "from-cyan-500 to-blue-700",
];

function getPostGradient(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash + slug.charCodeAt(i)) | 0;
  }
  return POST_GRADIENTS[Math.abs(hash) % POST_GRADIENTS.length];
}

// TODO: Replace with getAllPosts("blog") once MDX files exist
const MOCK_POSTS = [
  {
    slug: "best-steam-summer-sale-deals-2026",
    title: "The 25 Best Steam Summer Sale Deals You Shouldn't Miss",
    excerpt: "We dug through thousands of discounts to find the ones actually worth your money. Here's our curated list of the best value picks this summer.",
    date: "2026-02-20",
    author: "Lootboxes Team",
    tags: ["Steam", "Deals", "Guide"],
    cover_image: null,
    readTime: 8,
  },
  {
    slug: "are-battlepasses-worth-it",
    title: "Are Battle Passes Worth It? A Data-Driven Analysis",
    excerpt: "We calculated the actual dollar-per-hour value of battle passes across 15 major games. The results might surprise you.",
    date: "2026-02-15",
    author: "Lootboxes Team",
    tags: ["Analysis", "Battle Pass", "Value"],
    cover_image: null,
    readTime: 12,
  },
  {
    slug: "humble-choice-february-2026-review",
    title: "Humble Choice February 2026: Is It Worth Subscribing?",
    excerpt: "Breaking down this month's Humble Choice bundle with price comparisons, review scores, and our verdict on overall value.",
    date: "2026-02-05",
    author: "Lootboxes Team",
    tags: ["Humble Bundle", "Review", "Subscription"],
    cover_image: null,
    readTime: 6,
  },
  {
    slug: "gacha-spending-calculator",
    title: "How Much Does It Really Cost to Get a 5-Star in Genshin Impact?",
    excerpt: "We built a Monte Carlo simulator to calculate the true cost of pulling a 5-star character, factoring in pity, soft pity, and 50/50 mechanics.",
    date: "2026-01-28",
    author: "Lootboxes Team",
    tags: ["Genshin Impact", "Gacha", "Drop Rates"],
    cover_image: null,
    readTime: 15,
  },
  {
    slug: "game-key-stores-ranked",
    title: "Every PC Game Store Ranked: Where to Buy Your Games in 2026",
    excerpt: "Steam, GOG, Epic, Humble, Fanatical, GMG — we ranked every legitimate PC game store by price, features, and consumer-friendliness.",
    date: "2026-01-20",
    author: "Lootboxes Team",
    tags: ["Guide", "Stores", "PC Gaming"],
    cover_image: null,
    readTime: 10,
  },
  {
    slug: "loot-box-legislation-tracker",
    title: "Loot Box Laws Around the World: 2026 Status Tracker",
    excerpt: "A country-by-country breakdown of where loot box regulation stands right now, from Belgium's ban to the FTC's latest proposals.",
    date: "2026-01-10",
    author: "Lootboxes Team",
    tags: ["Regulation", "Loot Boxes", "Industry"],
    cover_image: null,
    readTime: 14,
  },
];

export const metadata = {
  title: "Blog — Game Deals Insights & Analysis",
  description:
    "Expert analysis, deal guides, and industry insights about video game pricing, loot boxes, and getting the best value for your gaming dollar.",
};

export default function BlogPage() {
  const featured = MOCK_POSTS[0];
  const rest = MOCK_POSTS.slice(1);

  return (
    <div className="pb-12">
      {/* Page hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-8 sm:py-10 dark:border-gray-800 dark:from-gray-900 dark:to-gray-950">
        <div className="container-main">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-brand-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog</h1>
          </div>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Deal guides, industry analysis, and insights to help you game smarter.
          </p>
        </div>
      </section>

      <div className="container-main mt-8">
        {/* Featured post */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
        >
          <div className={`relative h-48 bg-gradient-to-br ${getPostGradient(featured.slug)} sm:h-64`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="mx-auto h-8 w-8 text-white/40" />
                <span className="mt-2 block text-sm font-medium text-white/50">Featured</span>
              </div>
            </div>
            <div className="absolute left-4 top-4">
              <span className="badge-featured">Featured</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {featured.tags.map((t) => (
                <span key={t} className="badge-type text-xs">{t}</span>
              ))}
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 group-hover:text-brand-600">
              {featured.title}
            </h2>
            <p className="mt-2 text-gray-500">{featured.excerpt}</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(featured.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {featured.readTime} min read
              </span>
            </div>
          </div>
        </Link>

        {/* Post grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card group flex flex-col transition-shadow hover:shadow-md"
            >
              <div className={`h-32 rounded-lg bg-gradient-to-br ${getPostGradient(post.slug)}`}>
                <div className="flex h-full items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white/30" />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.slice(0, 2).map((t) => (
                  <span key={t} className="badge-type text-[10px]">{t}</span>
                ))}
              </div>
              <h3 className="mt-2 text-base font-semibold text-gray-900 group-hover:text-brand-600">
                {post.title}
              </h3>
              <p className="mt-1 flex-1 text-sm text-gray-500 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                <span>{formatDate(post.date)}</span>
                <span>{post.readTime} min</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
