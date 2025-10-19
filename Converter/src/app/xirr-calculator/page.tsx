'use client'

import { useMemo, useState } from 'react'
import StructuredData from '@/components/seo/structured-data'
import { getWebPageJsonLd, getWebAppJsonLd, siteUrl } from '@/lib/seo'
import { GlassCard } from '@/components/ui/glass-card'

export default function XIRRCalculator() {
  const [cashFlows, setCashFlows] = useState<Array<{ date: string; amount: number }>>([
    { date: '2024-01-01', amount: -10000 },
    { date: '2024-06-15', amount: 2000 },
    { date: '2024-12-31', amount: 9000 },
  ])

  const [initialGuess, setInitialGuess] = useState<number>(0.1)

  function xirr(cashFlows: Array<{ date: string; amount: number }>, guess = 0.1) {
    const maxIterations = 100
    const tolerance = 1e-7

    const dates = cashFlows.map((cf) => new Date(cf.date))
    const minDate = Math.min(...dates.map((d) => d.getTime()))

    const f = (rate: number) =>
      cashFlows.reduce((acc, cf) => {
        const t = (new Date(cf.date).getTime() - minDate) / (1000 * 60 * 60 * 24 * 365)
        return acc + cf.amount / Math.pow(1 + rate, t)
      }, 0)

    const df = (rate: number) =>
      cashFlows.reduce((acc, cf) => {
        const t = (new Date(cf.date).getTime() - minDate) / (1000 * 60 * 60 * 24 * 365)
        return acc - (t * cf.amount) / Math.pow(1 + rate, t + 1)
      }, 0)

    let rate = guess
    for (let i = 0; i < maxIterations; i++) {
      const value = f(rate)
      const derivative = df(rate)
      const newRate = rate - value / derivative
      if (Math.abs(newRate - rate) < tolerance) return newRate
      rate = newRate
    }
    return rate
  }

  const jsonLd = useMemo(
    () =>
      getWebPageJsonLd({
        name: 'XIRR Calculator',
        description: 'Calculate the extended internal rate of return for irregular cash flows.',
        url: `${siteUrl}/xirr-calculator`,
        breadcrumb: ['Home', 'XIRR Calculator'],
      }),
    []
  )

  const webAppJsonLd = useMemo(
    () =>
      getWebAppJsonLd({
        name: 'XIRR Calculator',
        description: 'Web-based XIRR calculator for computing IRR of non-periodic cash flows.',
        url: `${siteUrl}/xirr-calculator`,
        applicationCategory: 'Finance',
      }),
    []
  )

  const rate = xirr(cashFlows, initialGuess)

  return (
    <div className="pt-8 pb-24 max-w-7xl mx-auto px-4 sm:px-8">
      <StructuredData data={jsonLd} />
      <StructuredData data={webAppJsonLd} />

      <div className="mb-12 text-center">
        <h1 className="font-extrabold tracking-tight text-4xl sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-4">
          XIRR Calculator
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Compute the extended internal rate of return (XIRR) for uneven cash flows.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Cash Flows</h2>
          <ul className="space-y-3">
            {cashFlows.map((cf, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{cf.date}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{cf.amount}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">XIRR Result</h2>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{(rate * 100).toFixed(2)}%</p>
        </GlassCard>
      </div>
    </div>
  )
}