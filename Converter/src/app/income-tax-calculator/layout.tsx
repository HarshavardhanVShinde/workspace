import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Income Tax Calculator – Old vs New Regime | ToolSynth',
  description: 'Calculate your income tax liability under old and new regimes with slabs, deductions, and cess. Compare tax outcomes accurately.',
  keywords: ['income tax calculator','tax slabs','new regime','old regime','tax deductions','tax planning'],
  path: '/income-tax-calculator'
})

export { default } from './page'