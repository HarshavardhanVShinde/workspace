import { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'
import { NAV_CATEGORIES } from '@/lib/nav-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl

  const urls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/scientific-calculator`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  const seen = new Set<string>()
  for (const cat of NAV_CATEGORIES) {
    for (const item of cat.items) {
      const url = `${baseUrl}${item.href}`
      if (seen.has(url)) continue
      seen.add(url)
      urls.push({
        url,
        lastModified: new Date(),
        changeFrequency: item.href.includes('currency') ? 'daily' : 'weekly',
        priority: item.href.includes('sip') || item.href.includes('emi') ? 0.9 : 0.85,
      })
    }
  }

  return urls
}