import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'GST Calculator – Goods & Services Tax | ToolSynth',
  description: 'Calculate GST for inclusive or exclusive pricing with accurate breakdowns. Supports multiple rates and shows total amount, GST component, and net price.',
  keywords: ['GST calculator','goods and services tax','GST inclusive','GST exclusive','tax calculator','GST breakdown'],
  path: '/gst-calculator'
})

export { default } from './page'