import Link from "next/link";
import { Calendar, Clock, BookOpen, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getAllBlogPosts } from "@/data/blog-posts";

// Deterministic color accent per card index
const CARD_ACCENTS = [
  { bar: "from-blue-500 to-cyan-400", tag: "bg-blue-50 text-blue-700" },
  { bar: "from-rose-500 to-pink-400", tag: "bg-rose-50 text-rose-700" },
  { bar: "from-amber-500 to-orange-400", tag: "bg-amber-50 text-amber-700" },
  { bar: "from-emerald-500 to-teal-400", tag: "bg-emerald-50 text-emerald-700" },
  { bar: "from-purple-500 to-violet-400", tag: "bg-purple-50 text-purple-700" },
  { bar: "from-cyan-500 to-blue-400", tag: "bg-cyan-50 text-cyan-700" },
];

// Fallback gradient for posts without cover images
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
        {/* ─── Featured post — Magazine split with bottom gradient bar ─── */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group block overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 transition-shadow hover:shadow-xl"
        >
          <div className="flex flex-col md:flex-row">
            {/* Left: Image */}
            <div className="md:w-1/2 h-48 md:h-64 overflow-hidden relative">
              {featured.coverImage ? (
                <img
                  src={featured.coverImage}
                  alt={featured.coverAlt || featured.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className={`h-full w-full bg-gradient-to-br ${getPostGradient(featured.slug)}`} />
              )}
              <div className="absolute top-3 left-3">
                <span className="bg-[#0074C5] text-white text-[10px] font-bold px-3 py-1 rounded-lg shadow-md flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  FEATURED
                </span>
              </div>
            </div>

            {/* Right: Content */}
            <div className="md:w-1/2 p-6 flex flex-col justify-center border-l border-gray-100">
              <div className="flex flex-wrap gap-2 mb-3">
                {featured.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h2 className="text-gray-900 font-serif text-xl md:text-2xl font-bold leading-snug group-hover:text-[#0074C5] transition-colors">
                {featured.title}
              </h2>
              <p className="text-gray-500 text-sm mt-3 line-clamp-3 leading-relaxed">
                {featured.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
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
          </div>
          {/* Bottom gradient bar */}
          <div className="h-1 bg-gradient-to-r from-[#0074C5] via-purple-500 to-rose-500" />
        </Link>

        {/* ─── Post grid ─── */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, idx) => {
            const accent = CARD_ACCENTS[idx % CARD_ACCENTS.length];
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-lg transition-all"
              >
                {/* Cover image */}
                <div className="h-36 overflow-hidden">
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

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {post.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${accent.tag}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-gray-900 font-serif text-base font-bold line-clamp-2 leading-snug group-hover:text-[#0074C5] transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm text-gray-500 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-400">
                    <span>{formatDate(post.date)}</span>
                    <span>{post.readTime} min</span>
                  </div>
                </div>

                {/* Bottom color bar */}
                <div className={`h-1 bg-gradient-to-r ${accent.bar}`} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
