'use client'

import { useMemo, useState } from 'react'
import StructuredData from '@/components/seo/structured-data'
import { getWebPageJsonLd, getWebAppJsonLd, siteUrl } from '@/lib/seo'
import { GlassCard } from '@/components/ui/glass-card'

export default function GSTCalculator() {
  const [amount, setAmount] = useState<number>(1000)
  const [rate, setRate] = useState<number>(18)

  const calculateGST = (amount: number, rate: number) => {
    const tax = (amount * rate) / 100
    const total = amount + tax
    return { tax, total }
  }

  const result = calculateGST(amount, rate)

  const jsonLd = useMemo(
    () =>
      getWebPageJsonLd({
        name: 'GST Calculator',
        description: 'Compute GST tax and total amount based on rate.',
        url: `${siteUrl}/gst-calculator`,
        breadcrumb: ['Home', 'GST Calculator'],
      }),
    []
  )

  const webAppJsonLd = useMemo(
    () =>
      getWebAppJsonLd({
        name: 'GST Calculator',
        description: 'Web-based calculator to compute GST (Goods and Services Tax) for invoices.',
        url: `${siteUrl}/gst-calculator`,
        applicationCategory: 'Finance',
      }),
    []
  )

  return (
    <div className="pt-8 pb-24 max-w-7xl mx-auto px-4 sm:px-8">
      <StructuredData data={jsonLd} />
      <StructuredData data={webAppJsonLd} />

      <div className="mb-12 text-center">
        <h1 className="font-extrabold tracking-tight text-4xl sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-4">
          GST Calculator
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Calculate GST based on amount and tax rate.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Inputs</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">GST Rate (%)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Result</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">GST Amount: <span className="font-semibold text-gray-900 dark:text-white">{result.tax.toFixed(2)}</span></p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount: <span className="font-semibold text-gray-900 dark:text-white">{result.total.toFixed(2)}</span></p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}