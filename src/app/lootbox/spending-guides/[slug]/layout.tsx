import { Metadata } from "next";
import { getGuideBySlug, SPENDING_GUIDES } from "@/data/spending-guides";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return { title: "Guide Not Found" };
  }

  const title = `${guide.gameName} Spending Guide — Best Value at Any Budget`;
  const description = `Smart spending advice for ${guide.gameName}. Free-to-play tips, budget recommendations, best value purchases, and what to avoid in ${guide.gameName}'s ${guide.systemType} system.`;

  return {
    title,
    description,
    alternates: { canonical: `/lootbox/spending-guides/${slug}` },
    openGraph: { title, description, url: `/lootbox/spending-guides/${slug}`, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export async function generateStaticParams() {
  return SPENDING_GUIDES.map((g) => ({ slug: g.gameSlug }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
