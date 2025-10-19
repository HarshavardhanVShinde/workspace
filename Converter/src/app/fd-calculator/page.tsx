'use client'

import { useMemo, useState } from 'react'
import StructuredData from '@/components/seo/structured-data'
import { getWebPageJsonLd, getWebAppJsonLd, siteUrl } from '@/lib/seo'
import { GlassCard } from '@/components/ui/glass-card'

export default function FDCalculator() {
  const [principal, setPrincipal] = useState<number>(100000)
  const [annualRate, setAnnualRate] = useState<number>(7)
  const [years, setYears] = useState<number>(5)

  const calculateFD = (principal: number, annualRate: number, years: number) => {
    const r = annualRate / 100
    const total = principal * Math.pow(1 + r, years)
    return { invested: principal, total, gain: total - principal }
  }

  const result = calculateFD(principal, annualRate, years)

  const jsonLd = useMemo(
    () =>
      getWebPageJsonLd({
        name: 'FD Calculator',
        description: 'Calculate returns for fixed deposits over time.',
        url: `${siteUrl}/fd-calculator`,
        breadcrumb: ['Home', 'FD Calculator'],
      }),
    []
  )

  const webAppJsonLd = useMemo(
    () =>
      getWebAppJsonLd({
        name: 'FD Calculator',
        description: 'Web-based fixed deposit calculator for estimating maturity value.',
        url: `${siteUrl}/fd-calculator`,
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
          FD Calculator
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Estimate maturity value of fixed deposits based on rate and time.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Inputs</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Principal</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Annual Rate (%)</label>
              <input
                type="number"
                value={annualRate}
                onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Years</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Result</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Invested: <span className="font-semibold text-gray-900 dark:text-white">{result.invested.toFixed(2)}</span></p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Maturity Value: <span className="font-semibold text-gray-900 dark:text-white">{result.total.toFixed(2)}</span></p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Gain: <span className="font-semibold text-gray-900 dark:text-white">{result.gain.toFixed(2)}</span></p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}