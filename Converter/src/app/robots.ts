import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'

function getHost() {
  try {
    const url = new URL(siteUrl)
    return url.host
  } catch {
    return siteUrl.replace(/^https?:\/\//, '')
  }
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: getHost(),
  }
}