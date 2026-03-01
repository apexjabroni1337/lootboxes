import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lootboxes.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/go/", "/search"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
