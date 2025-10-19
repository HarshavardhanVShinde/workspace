import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'FD Calculator – Fixed Deposit Interest & Maturity | ToolSynth',
  description: 'Calculate fixed deposit interest, maturity amount, and effective yield across tenures and compounding frequencies.',
  keywords: ['FD calculator','fixed deposit','interest calculator','maturity amount','bank FD','compound interest'],
  path: '/fd-calculator'
})

export { default } from './page'