import Link from "next/link";
import { ArrowLeft, Calendar, Share2, AlertTriangle, TrendingDown, DollarSign } from "lucide-react";
import ScoreBadge from "@/components/analytics/ScoreBadge";
import GameAvatar from "@/components/ui/GameAvatar";
import { formatDate } from "@/lib/utils";

// TODO: Replace with Supabase query + MDX content
const MOCK_ANALYSIS = {
  title: "Diablo IV Season Pass & Shop: Full Monetization Breakdown",
  excerpt: "We dissected every purchasable item, tracked the battle pass value, and calculated whether the premium shop is worth your money.",
  type: "economy",
  game: { title: "Diablo IV", slug: "diablo-4" },
  lootboxes_score: 5.2,
  published_at: "2026-02-10",
  updated_at: "2026-02-18",
  author: "Lootboxes Team",
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    title: `${MOCK_ANALYSIS.title} — Lootboxes Analysis`,
    description: MOCK_ANALYSIS.excerpt,
  };
}

export default function AnalyticsArticlePage({ params }: { params: { slug: string } }) {
  const article = MOCK_ANALYSIS;

  return (
    <div className="pb-12">
      <div className="container-main pt-8">
        <div className="mx-auto max-w-3xl">
          {/* Back link */}
          <Link
            href="/analytics"
            className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600"
          >
            <ArrowLeft className="h-4 w-4" /> All Analysis
          </Link>

          {/* Type badge + Score */}
          <div className="flex items-center gap-3">
            <span className="badge-type uppercase">{article.type}</span>
            <ScoreBadge score={article.lootboxes_score} size="lg" showLabel />
          </div>

          {/* Title */}
          <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 text-lg text-gray-500">{article.excerpt}</p>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span>By {article.author}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Published {formatDate(article.published_at)}
            </span>
            {article.updated_at !== article.published_at && (
              <span className="text-brand-600">
                Updated {formatDate(article.updated_at)}
              </span>
            )}
          </div>

          {/* Game link */}
          <div className="mt-4">
            <Link
              href={`/games/${article.game.slug}`}
              className="inline-flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 hover:border-brand-300 hover:text-brand-600"
            >
              <div className="h-8 w-8 overflow-hidden rounded-md">
                <GameAvatar gameName={article.game.title} size="sm" aspectRatio="square" />
              </div>
              View {article.game.title} deals & prices
            </Link>
          </div>

          {/* Article body — TODO: replace with MDXRemote */}
          <article className="prose prose-gray mt-8 max-w-none prose-headings:text-gray-900 prose-a:text-brand-600">
            <h2>Executive Summary</h2>
            <p>
              Diablo IV uses a hybrid monetization model combining a seasonal battle pass
              with a premium cosmetic shop. We analyzed every item available in Season 4
              to determine whether it represents good value for players.
            </p>

            <div className="not-prose my-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
                <DollarSign className="mx-auto h-6 w-6 text-brand-600" />
                <div className="mt-2 text-2xl font-bold text-gray-900">$9.99</div>
                <div className="text-sm text-gray-500">Battle Pass Price</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
                <TrendingDown className="mx-auto h-6 w-6 text-success-600" />
                <div className="mt-2 text-2xl font-bold text-gray-900">$0.14</div>
                <div className="text-sm text-gray-500">Cost per Item</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
                <AlertTriangle className="mx-auto h-6 w-6 text-warning-600" />
                <div className="mt-2 text-2xl font-bold text-gray-900">$28.50</div>
                <div className="text-sm text-gray-500">Avg. Shop Skin Price</div>
              </div>
            </div>

            <h2>Battle Pass Value Analysis</h2>
            <p>
              The Season 4 battle pass contains 90 tiers with a mix of cosmetic items,
              premium currency, and emotes. At $9.99, the premium track offers roughly
              70 unique items — a cost per item of approximately $0.14.
            </p>
            <p>
              Compared to purchasing equivalent cosmetics from the shop directly,
              the battle pass represents a significant discount. However, approximately
              40% of the items are filler (emblems, minor recolors) that most players
              would not purchase individually.
            </p>

            <h2>Premium Shop Pricing</h2>
            <p>
              The cosmetic shop rotates offerings weekly with prices ranging from $5
              for basic emotes to $28 for full armor sets. At these price points,
              a single shop armor set costs nearly 3x the entire battle pass.
            </p>

            <h2>Our Verdict</h2>
            <p>
              The battle pass is reasonable value for active players who will complete
              most tiers. The premium shop, however, is significantly overpriced relative
              to the content provided. We scored Diablo IV a 5.2/10 — the battle pass
              lifts the score, but aggressive shop pricing drags it down.
            </p>

            <h2>Spending Recommendation</h2>
            <p>
              If you play Diablo IV regularly, the battle pass is worth the $9.99.
              We recommend avoiding the premium shop unless a specific item is
              exceptionally appealing to you — the prices do not represent good value
              compared to other games in the genre.
            </p>
          </article>

          {/* Share + nav */}
          <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6">
            <Link
              href="/analytics"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              <ArrowLeft className="h-4 w-4" /> More analysis
            </Link>
            <button className="btn-secondary flex items-center gap-1 text-sm">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
