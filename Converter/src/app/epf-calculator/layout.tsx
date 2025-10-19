import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'EPF Calculator – Employee Provident Fund Returns | ToolSynth',
  description: 'Estimate EPF contributions, employer match, interest accrual, and total corpus. Plan retirement savings with accurate EPF projections.',
  keywords: ['EPF calculator','employee provident fund','PF interest','retirement savings','employer contribution'],
  path: '/epf-calculator'
})

export { default } from './page'