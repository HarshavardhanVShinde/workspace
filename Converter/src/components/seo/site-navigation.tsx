"use client";
import React from "react";
import { NAV_CATEGORIES } from "@/lib/nav-data";
import { siteUrl } from "@/lib/seo";

export default function SiteNavigationStructuredData() {
  const graph = [] as any[];

  for (const cat of NAV_CATEGORIES) {
    for (const item of cat.items) {
      graph.push({
        "@type": "SiteNavigationElement",
        name: item.label,
        url: `${siteUrl}${item.href}`,
      });
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}