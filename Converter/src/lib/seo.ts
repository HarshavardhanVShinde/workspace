import type { Metadata } from 'next'
export const siteUrl = 'https://techsynth.co'
export const siteName = 'ToolSynth'

export type WebPageJsonLdInput = {
  name: string
  description: string
  url: string
  breadcrumb?: string[]
}

export function getWebPageJsonLd(input: WebPageJsonLdInput) {
  const { name, description, url, breadcrumb } = input
  const data: any = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
  }

  if (breadcrumb && breadcrumb.length > 0) {
    data.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumb.map((label, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: label,
        item: index === breadcrumb.length - 1 ? url : `${siteUrl}/${label.toLowerCase().replace(/\s+/g, '-')}`,
      })),
    }
  }

  return data
}

export type WebAppJsonLdInput = {
  name: string
  description: string
  url: string
  applicationCategory?: string
}

export function getWebAppJsonLd(input: WebAppJsonLdInput) {
  const { name, description, url, applicationCategory } = input
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory,
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'INR',
      category: applicationCategory || 'Utility',
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
  }
}

export function buildMetadata({ title, description, keywords, path }: { title: string, description: string, keywords: string[] | string, path: string }): Metadata {
  const url = `${siteUrl}${path}`
  const kw = Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim()).filter(Boolean)
  return {
    title,
    description,
    keywords: kw,
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: 'article',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    metadataBase: new URL(siteUrl),
  }
}