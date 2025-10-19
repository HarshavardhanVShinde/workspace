"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { FAQ_DATA } from "@/lib/faq-data";
import { siteUrl } from "@/lib/seo";

export default function FaqStructuredData() {
  const pathname = usePathname() || "/";
  const faqs = FAQ_DATA[pathname];
  if (!faqs || faqs.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq, idx) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
      url: `${siteUrl}${pathname}#faq-${idx + 1}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}