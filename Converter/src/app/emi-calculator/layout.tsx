import { Metadata } from 'next'
import { siteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'EMI Calculator - Loan EMI Calculator | TechSynth',
  description: 'Calculate your EMI (Equated Monthly Installment) for home loans, car loans, and personal loans. Get detailed amortization schedule and payment breakdowns.',
  keywords: 'EMI calculator, loan calculator, home loan EMI, car loan calculator, personal loan calculator, loan payment calculator, amortization schedule',
  authors: [{ name: 'TechSynth' }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'EMI Calculator - Calculate Loan Payments',
    description: 'Free EMI calculator to compute monthly loan payments with detailed amortization schedule. Plan your loans with accurate EMI calculations.',
    type: 'website',
    locale: 'en_US',
    url: `${siteUrl}/emi-calculator`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EMI Calculator - Loan Payment Planning',
    description: 'Calculate your loan EMI and view detailed payment schedules with our free online calculator.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: `${siteUrl}/emi-calculator` },
}

export { default } from './page'