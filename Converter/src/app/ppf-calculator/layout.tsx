import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'PPF Calculator – Public Provident Fund Returns | ToolSynth',
  description: 'Estimate PPF maturity value and yearly contributions with compounding. Plan long-term savings using tax-efficient PPF contributions.',
  keywords: ['PPF calculator','public provident fund','PPF maturity','PPF interest','tax-saving','long-term savings'],
  path: '/ppf-calculator'
})

export { default } from './page'