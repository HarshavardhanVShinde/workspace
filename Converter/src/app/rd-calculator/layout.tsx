import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'RD Calculator – Recurring Deposit Interest & Maturity | ToolSynth',
  description: 'Compute Recurring Deposit maturity amount with monthly contributions and compounding interest. Compare RD returns across tenures.',
  keywords: ['RD calculator','recurring deposit','maturity amount','bank RD','interest calculator'],
  path: '/rd-calculator'
})

export { default } from './page'