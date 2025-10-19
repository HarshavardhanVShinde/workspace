'use client'

import { useMemo, useState } from 'react'
import StructuredData from '@/components/seo/structured-data'
import { getWebPageJsonLd, getWebAppJsonLd, siteUrl } from '@/lib/seo'
import { GlassCard } from '@/components/ui/glass-card'
import dynamic from 'next/dynamic'

const FDGrowthChart = dynamic(() => import('@/components/charts/fd-growth-chart'), { ssr: false })

type FDFrequency = 'yearly' | 'quarterly' | 'monthly'

export default function FDCalculator() {
  const [principal, setPrincipal] = useState<number>(100000)
  const [annualRate, setAnnualRate] = useState<number>(7)
  const [years, setYears] = useState<number>(5)
  const [frequency, setFrequency] = useState<FDFrequency>('yearly')

  const periodsPerYear = (freq: FDFrequency) => {
    switch (freq) {
      case 'monthly': return 12
      case 'quarterly': return 4
      default: return 1
    }
  }

  const calculateFD = (principal: number, annualRate: number, years: number, freq: FDFrequency) => {
    const m = periodsPerYear(freq)
    const r = annualRate / 100 / m
    const n = years * m
    const total = principal * Math.pow(1 + r, n)
    const invested = principal
    return { invested, total, gain: Math.max(0, total - invested) }
  }

  const result = calculateFD(principal, annualRate, years, frequency)

  const yearlyData = useMemo(() => {
    const m = periodsPerYear(frequency)
    const r = annualRate / 100 / m
    return Array.from({ length: Math.max(0, Math.floor(years)) }, (_, i) => {
      const year = i + 1
      const balance = principal * Math.pow(1 + r, m * year)
      return { year, balance }
    })
  }, [principal, annualRate, years, frequency])

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

  const formatINR = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(amount))
  const freqOptions: FDFrequency[] = ['yearly', 'quarterly', 'monthly']

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

          {/* Compounding Frequency */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block tracking-wide">Compounding Frequency</label>
            <div className="flex flex-wrap gap-2">
              {freqOptions.map((f) => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`px-3 py-2 rounded-lg border transition-all text-sm font-medium ${frequency === f ? 'bg-white/60 dark:bg-white/10 border-white/50' : 'bg-white/30 dark:bg-white/5 border-white/30 hover:bg-white/50 dark:hover:bg-white/10'}`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">Interest is compounded based on the selected frequency.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Principal</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
                className="mt-3 w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Annual Rate (%)</label>
              <input
                type="number"
                value={annualRate}
                onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
                className="mt-3 w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Years</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(parseFloat(e.target.value) || 0)}
                className="mt-3 w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl p-4 bg-white/50 dark:bg-white/10 border border-white/30">
                <div className="text-xs text-gray-600 dark:text-gray-400">Invested</div>
                <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{formatINR(result.invested)}</div>
              </div>
              <div className="rounded-xl p-4 bg-white/50 dark:bg-white/10 border border-white/30">
                <div className="text-xs text-gray-600 dark:text-gray-400">Maturity Value</div>
                <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{formatINR(result.total)}</div>
              </div>
              <div className="rounded-xl p-4 bg-white/50 dark:bg-white/10 border border-white/30">
                <div className="text-xs text-gray-600 dark:text-gray-400">Estimated Gain</div>
                <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{formatINR(result.gain)}</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 sm:p-6">
            <FDGrowthChart yearlyData={yearlyData} />
            <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">Chart shows yearly balance growth with {frequency} compounding.</p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}