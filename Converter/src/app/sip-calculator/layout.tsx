import { Metadata } from 'next'
import { siteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'SIP Calculator - Mutual Fund Investment Calculator | TechSynth',
  description: 'Calculate your SIP (Systematic Investment Plan) returns with our free online calculator. Plan your mutual fund investments and visualize wealth creation over time.',
  keywords: 'SIP calculator, mutual fund calculator, investment calculator, systematic investment plan, wealth creation, financial planning',
  authors: [{ name: 'TechSynth' }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'SIP Calculator - Plan Your Mutual Fund Investments',
    description: 'Free online SIP calculator to compute returns on your systematic investment plans. Make informed investment decisions with accurate projections.',
    type: 'website',
    locale: 'en_US',
    url: `${siteUrl}/sip-calculator`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SIP Calculator - Mutual Fund Investment Planning',
    description: 'Calculate SIP returns and plan your financial future with our free investment calculator.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: `${siteUrl}/sip-calculator` },
}

export { default } from './page'