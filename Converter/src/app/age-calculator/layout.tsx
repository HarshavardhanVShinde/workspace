import { Metadata } from 'next'
import { siteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Age Calculator - Calculate Exact Age | TechSynth',
  description: 'Calculate your exact age in years, months, days, hours, minutes, and seconds. Find out days until your next birthday and interesting age statistics.',
  keywords: 'age calculator, calculate age, age in days, age in hours, birthday calculator, days until birthday, age counter, birth date calculator',
  authors: [{ name: 'TechSynth' }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Age Calculator - Calculate Your Exact Age',
    description: 'Free age calculator to find your exact age in various units. Calculate days until birthday and get interesting age statistics.',
    type: 'website',
    locale: 'en_US',
    url: `${siteUrl}/age-calculator`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Age Calculator - Precise Age Calculation',
    description: 'Calculate your exact age and get birthday countdown with our free online age calculator.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: `${siteUrl}/age-calculator` },
}

export { default } from './page'