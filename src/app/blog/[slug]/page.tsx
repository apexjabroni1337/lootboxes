import Link from "next/link";
import { Calendar, Clock, ArrowLeft, ChevronRight, User } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getBlogPost, getAllBlogPosts } from "@/data/blog-posts";
import { notFound } from "next/navigation";
import NewsletterForm from "@/components/newsletter/NewsletterForm";

// Deterministic accent color for blog post covers
const POST_ACCENTS = [
  { bg: "from-brand-600 to-indigo-700", light: "bg-brand-50 border-brand-200 text-brand-700" },
  { bg: "from-purple-600 to-violet-800", light: "bg-purple-50 border-purple-200 text-purple-700" },
  { bg: "from-emerald-600 to-teal-800", light: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { bg: "from-amber-500 to-orange-700", light: "bg-amber-50 border-amber-200 text-amber-700" },
  { bg: "from-rose-500 to-pink-700", light: "bg-rose-50 border-rose-200 text-rose-700" },
  { bg: "from-cyan-500 to-blue-700", light: "bg-cyan-50 border-cyan-200 text-cyan-700" },
];

function getPostAccent(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash + slug.charCodeAt(i)) | 0;
  }
  return POST_ACCENTS[Math.abs(hash) % POST_ACCENTS.length];
}

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} — Lootboxes.com Blog`,
    description: post.excerpt,
  };
}

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ").trim();
      if (text) {
        elements.push(
          <p key={elements.length} dangerouslySetInnerHTML={{
            __html: text
              .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
              .replace(/\*(.+?)\*/g, "<em>$1</em>")
              .replace(/\u201C/g, "\u201C")
              .replace(/\u201D/g, "\u201D")
          }} />
        );
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={elements.length}>
          {listItems.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{
              __html: item
                .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                .replace(/\*(.+?)\*/g, "<em>$1</em>")
            }} />
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      elements.push(
        <h2 key={elements.length}>{trimmed.replace("## ", "")}</h2>
      );
    } else if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      elements.push(
        <h3 key={elements.length}>{trimmed.replace("### ", "")}</h3>
      );
    } else if (trimmed.startsWith("\u2022 ") || trimmed.startsWith("- ")) {
      flushParagraph();
      inList = true;
      listItems.push(trimmed.replace(/^[\u2022\-]\s+/, ""));
    } else if (trimmed === "") {
      flushParagraph();
      flushList();
    } else {
      if (inList) {
        flushList();
      }
      currentParagraph.push(trimmed);
    }
  }
  flushParagraph();
  flushList();

  return elements;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllBlogPosts();
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3);
  const accent = post.featured
    ? { bg: "from-red-600 to-red-900", light: "bg-red-50 border-red-200 text-red-700" }
    : getPostAccent(post.slug);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── Hero Cover ─── */}
      <div className="relative overflow-hidden">
        {/* Background image or gradient */}
        <div className="h-64 sm:h-80 md:h-96 relative">
          {post.coverImage ? (
            <>
              <img
                src={post.coverImage}
                alt={post.coverAlt || post.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
            </>
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${accent.bg}`} />
          )}

          {/* Back button overlay */}
          <div className="container-main absolute top-0 left-0 right-0 pt-6 z-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-md hover:bg-white/25 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Blog
            </Link>
          </div>

          {/* Title overlay on hero */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="container-main pb-8 md:pb-10">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight max-w-4xl drop-shadow-sm">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Article Body ─── */}
      <div className="container-main relative -mt-6 z-10">
        <div className="mx-auto max-w-3xl">
          {/* Meta card */}
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime} min read
            </span>
          </div>

          {/* Excerpt / lead paragraph */}
          <p className="mt-8 text-lg md:text-xl text-gray-600 leading-relaxed font-light border-l-4 border-brand-500 pl-5">
            {post.excerpt}
          </p>

          {/* Article content */}
          <article className="mt-10 prose prose-lg prose-gray max-w-none
            prose-headings:text-gray-900 prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-3
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-5
            prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-800 prose-strong:font-semibold
            prose-li:text-gray-600 prose-li:leading-relaxed
            prose-ul:my-4 prose-ul:space-y-2
          ">
            {renderMarkdown(post.content)}
          </article>

          {/* Divider */}
          <div className="mt-12 border-t border-gray-200" />

          {/* Author + nav row */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm">
                LB
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{post.author}</p>
                <p className="text-xs text-gray-400">Published {formatDate(post.date)}</p>
              </div>
            </div>
            <Link
              href="/blog"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              All articles <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* ─── Related Articles ─── */}
          {related.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Keep Reading</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {related.map((r) => {
                  const rAccent = r.featured
                    ? { bg: "from-red-600 to-red-900", light: "bg-red-50 border-red-200 text-red-700" }
                    : getPostAccent(r.slug);
                  return (
                    <Link
                      key={r.slug}
                      href={`/blog/${r.slug}`}
                      className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg hover:-translate-y-0.5"
                    >
                      {/* Mini cover */}
                      <div className="relative h-28 overflow-hidden">
                        {r.coverImage ? (
                          <>
                            <img
                              src={r.coverImage}
                              alt={r.coverAlt || r.title}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          </>
                        ) : (
                          <div className={`h-full w-full bg-gradient-to-br ${rAccent.bg}`} />
                        )}
                        <div className="absolute bottom-2 left-2 flex gap-1">
                          {r.tags.slice(0, 1).map((t) => (
                            <span key={t} className="rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-brand-600 line-clamp-2 leading-snug">
                          {r.title}
                        </h4>
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                          <span>{formatDate(r.date)}</span>
                          <span>&middot;</span>
                          <span>{r.readTime} min</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── Newsletter CTA ─── */}
          <div className="mt-10 mb-8 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 p-6 sm:p-8 text-center shadow-lg">
            <h3 className="text-lg font-bold text-white">
              Stay in the loop
            </h3>
            <p className="mt-1 text-sm text-brand-100">
              Regulation updates, industry analysis, and game monetization news. No spam, ever.
            </p>
            <NewsletterForm variant="inline" className="mx-auto mt-4 max-w-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
