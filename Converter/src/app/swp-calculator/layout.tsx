import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'SWP Calculator – Systematic Withdrawal Plan | ToolSynth',
  description: 'Estimate withdrawals, remaining corpus, and sustainability of SWP plans based on return assumptions and monthly payouts.',
  keywords: ['SWP calculator','systematic withdrawal plan','mutual fund','monthly withdrawals','retirement income'],
  path: '/swp-calculator'
})

export { default } from './page'