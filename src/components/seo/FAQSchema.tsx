/**
 * FAQPage JSON-LD structured data component.
 * Can trigger FAQ rich results in Google SERPs.
 *
 * Usage:
 *   <FAQSchema faqs={[
 *     { question: "What is...?", answer: "It is..." },
 *   ]} />
 */

interface FAQ {
  question: string;
  answer: string;
}

export default function FAQSchema({ faqs }: { faqs: FAQ[] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
