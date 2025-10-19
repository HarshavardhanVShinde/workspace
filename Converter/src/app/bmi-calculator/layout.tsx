import { Metadata } from 'next'
import { siteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'BMI Calculator - Body Mass Index Calculator | TechSynth',
  description: 'Calculate your BMI (Body Mass Index) with our free online calculator. Check if you are underweight, normal weight, overweight, or obese with health recommendations.',
  keywords: 'BMI calculator, body mass index, weight calculator, health calculator, BMI chart, obesity calculator, weight status',
  authors: [{ name: 'TechSynth' }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'BMI Calculator - Check Your Body Mass Index',
    description: 'Free BMI calculator to determine your weight status and get personalized health recommendations based on your height and weight.',
    type: 'website',
    locale: 'en_US',
    url: `${siteUrl}/bmi-calculator`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMI Calculator - Body Mass Index Health Check',
    description: 'Calculate your BMI and understand your weight status with our free online health calculator.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: `${siteUrl}/bmi-calculator` },
}

export { default } from './page'