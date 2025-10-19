// This file enables static generation for calculator routes
export const dynamic = 'force-static'

export async function generateStaticParams() {
  return [
    { slug: 'sip-calculator' },
    { slug: 'emi-calculator' },
    { slug: 'xirr-calculator' },
    { slug: 'gst-calculator' },
    { slug: 'fd-calculator' },
    { slug: 'income-tax-calculator' },
    { slug: 'ppf-calculator' },
    { slug: 'rd-calculator' },
    { slug: 'epf-calculator' },
    { slug: 'swp-calculator' },
    { slug: 'currency-converter' },
    { slug: 'unit-converter' },
    { slug: 'age-calculator' },
    { slug: 'bmi-calculator' },
    { slug: 'scientific-calculator' },
  ]
}