import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lootboxes.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    "",
    "/deals",
    "/games",
    "/analytics",
    "/blog",
    "/drop-rates",
    "/newsletter",
    "/about",
    "/privacy",
    "/terms",
    "/search",
    "/methodology",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/deals" ? ("hourly" as const) : ("weekly" as const),
    priority: route === "" ? 1.0 : route === "/deals" ? 0.9 : 0.7,
  }));

  // TODO: Add dynamic game pages from Supabase
  // const supabase = createServerClient();
  // const { data: games } = await supabase.from("games").select("slug, updated_at");
  // const gamePages = (games || []).map(g => ({
  //   url: `${BASE_URL}/games/${g.slug}`,
  //   lastModified: new Date(g.updated_at),
  //   changeFrequency: "daily" as const,
  //   priority: 0.8,
  // }));

  return [...staticPages];
}
