import { MetadataRoute } from "next";
import { createServerClient } from "@/lib/supabase";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lootboxes.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient();

  // Fetch all game slugs for dynamic pages
  const { data: games } = await supabase
    .from("games")
    .select("slug, updated_at")
    .order("updated_at", { ascending: false });

  // Fetch analytics article slugs
  const { data: analytics } = await supabase
    .from("analytics")
    .select("slug, updated_at")
    .order("updated_at", { ascending: false });

  // Static pages with priority and frequency
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/deals`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/games`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/analytics`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/drop-rates`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/newsletter`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/methodology`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // Dynamic game pages
  const gamePages: MetadataRoute.Sitemap = (games || []).map((game) => ({
    url: `${BASE_URL}/games/${game.slug}`,
    lastModified: game.updated_at ? new Date(game.updated_at) : new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Dynamic analytics article pages
  const analyticsPages: MetadataRoute.Sitemap = (analytics || []).map(
    (article) => ({
      url: `${BASE_URL}/analytics/${article.slug}`,
      lastModified: article.updated_at
        ? new Date(article.updated_at)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  return [...staticPages, ...gamePages, ...analyticsPages];
}
