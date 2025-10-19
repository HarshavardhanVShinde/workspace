import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'XIRR Calculator – Extended Internal Rate of Return | ToolSynth',
  description: 'Compute XIRR (annualized returns) for irregular cash flows. Model SIP-style investments and a final maturity inflow to get precise performance.',
  keywords: [
    'XIRR calculator', 'internal rate of return', 'irregular cash flows', 'SIP XIRR', 'investment returns', 'annualized return'
  ],
  path: '/xirr-calculator'
})

export { default } from './page'