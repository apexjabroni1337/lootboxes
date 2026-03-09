/**
 * BlogPosting JSON-LD structured data component.
 * Enables rich results for blog articles in Google SERPs (author, date, image).
 *
 * Usage:
 *   <BlogPostingSchema
 *     title="My Article Title"
 *     description="Short excerpt..."
 *     url="https://lootboxes.com/blog/my-article"
 *     datePublished="2025-01-15"
 *     author="LootBoxes Team"
 *     image="https://lootboxes.com/og-default.png"
 *   />
 */

interface BlogPostingSchemaProps {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  image?: string;
}

export default function BlogPostingSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author,
  image,
}: BlogPostingSchemaProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "LootBoxes.com",
      logo: {
        "@type": "ImageObject",
        url: "https://lootboxes.com/icon.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
