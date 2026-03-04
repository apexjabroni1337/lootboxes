import Link from "next/link";
import { Calendar, Clock, ArrowRight, Sparkles, BookOpen, Scale, Gamepad2, Shield } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getAllBlogPosts } from "@/data/blog-posts";

// Deterministic gradient for blog posts
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

export const metadata = {
  title: "Blog — Loot Box News, Regulation & Industry Analysis",
  description:
    "The latest news on loot box regulation, lawsuits, game monetization changes, and in-depth analysis of the gaming industry's most controversial practices.",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const featured = posts.find((p) => p.featured) || posts[0];
  const rest = posts.filter((p) => p.slug !== featured.slug);

  return (
    <div className="pb-12">
      {/* Page hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-8 sm:py-10">
        <div className="container-main">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-brand-600" />
            <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          </div>
          <p className="mt-1 text-gray-500">
            Loot box news, regulation updates, and in-depth industry analysis.
          </p>
        </div>
      </section>

      <div className="container-main mt-8">
        {/* Featured post — large hero card */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
        >
          <div className="relative h-48 sm:h-64 overflow-hidden">
            {featured.coverImage ? (
              <img
                src={featured.coverImage}
                alt={featured.coverAlt || featured.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-red-600 to-red-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute left-4 top-4 flex gap-2">
              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                FEATURED
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                Legal
              </span>
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
              <div className="h-32 overflow-hidden rounded-lg">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.coverAlt || post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className={`h-full w-full bg-gradient-to-br ${getPostGradient(post.slug)} flex items-center justify-center`}>
                    <BookOpen className="h-6 w-6 text-white/30" />
                  </div>
                )}
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
