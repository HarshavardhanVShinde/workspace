import { Metadata } from 'next'
import { siteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Currency Converter - Real-time Exchange Rates | TechSynth',
  description: 'Convert between 150+ world currencies with our free online currency converter. Live exchange rates cached every 12 hours for performance.',
  keywords: 'currency converter, exchange rates, forex, USD to INR, EUR to USD, currency calculator, money converter, live rates',
  authors: [{ name: 'TechSynth' }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Currency Converter - Live Exchange Rates',
    description: 'Free currency converter with live exchange rates for global currencies. Quick and accurate conversions with 12-hour caching.',
    type: 'website',
    locale: 'en_US',
    url: `${siteUrl}/currency-converter`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Currency Converter - Foreign Exchange Calculator',
    description: 'Convert currencies with live exchange rates using our free online currency converter.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: `${siteUrl}/currency-converter` },
}

export { default } from './page'