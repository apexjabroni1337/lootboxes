import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getBlogPost, getAllBlogPosts } from "@/data/blog-posts";
import { notFound } from "next/navigation";
import NewsletterForm from "@/components/newsletter/NewsletterForm";

// Deterministic gradient for blog post covers
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

  // Get related posts (excluding current)
  const allPosts = getAllBlogPosts();
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  const gradient = post.featured
    ? "from-red-600 to-red-900"
    : getPostGradient(post.slug);

  return (
    <div className="pb-12">
      {/* Cover image */}
      <div className="relative h-48 sm:h-72 overflow-hidden">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.coverAlt || post.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className={`h-full w-full bg-gradient-to-br ${gradient}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="container-main absolute inset-0 flex items-end pb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm hover:bg-white/30"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
          </Link>
        </div>
      </div>

      <div className="container-main">
        <div className="mx-auto max-w-3xl">
          {/* Tags */}
          <div className="-mt-4 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="badge-type border border-white bg-white shadow-sm">{t}</span>
            ))}
          </div>

          {/* Title */}
          <h1 className="mt-6 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="mt-3 text-lg text-gray-500">
            {post.excerpt}
          </p>

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

          {/* Article body */}
          <article className="prose prose-gray mt-8 max-w-none prose-headings:text-gray-900 prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-li:text-gray-600">
            {renderMarkdown(post.content)}
          </article>

          {/* Share + nav */}
          <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6">
            <Link
              href="/blog"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              <ArrowLeft className="h-4 w-4" /> More articles
            </Link>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900">More from the Blog</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {r.tags.slice(0, 2).map((t) => (
                        <span key={t} className="badge-type text-[10px]">{t}</span>
                      ))}
                    </div>
                    <h4 className="mt-2 text-sm font-semibold text-gray-900 group-hover:text-brand-600 line-clamp-2">
                      {r.title}
                    </h4>
                    <p className="mt-1 text-xs text-gray-400">{formatDate(r.date)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="mt-8 rounded-xl border border-brand-200 bg-brand-50 p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900">
              Stay informed on loot box news
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get the latest regulation updates, industry analysis, and game monetization news. No spam.
            </p>
            <NewsletterForm variant="inline" className="mx-auto mt-4 max-w-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
