import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Scientific Calculator – Trigonometry, Logs, Exponents | ToolSynth',
  description: 'Responsive scientific calculator with sin, cos, tan, logs (ln, log10), exponents, roots, memory functions, and DEG/RAD modes. Accessible and fast.',
  keywords: ['scientific calculator','sin','cos','tan','logarithm','ln','log10','exponent','sqrt','memory functions','deg','rad'],
  path: '/scientific-calculator'
})

export { default } from './page'