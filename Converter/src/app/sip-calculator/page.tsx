'use client'

import { useMemo, useState } from 'react'
import StructuredData from '@/components/seo/structured-data'
import { getWebPageJsonLd, getWebAppJsonLd, siteUrl } from '@/lib/seo'
import { GlassCard } from '@/components/ui/glass-card'

export default function SIPCalculator() {
  const [calculationType, setCalculationType] = useState<'sip' | 'lumpsum'>('sip')
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(1000)
  const [lumpsumAmount, setLumpsumAmount] = useState<number>(50000)
  const [annualRate, setAnnualRate] = useState<number>(12)
  const [years, setYears] = useState<number>(10)

  const calculateSIP = (monthly: number, annualRate: number, years: number) => {
    const n = years * 12
    const r = annualRate / 12 / 100
    const total = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
    const invested = monthly * n
    return { invested, total, gain: total - invested }
  }

  const calculateLumpsum = (principal: number, annualRate: number, years: number) => {
    const r = annualRate / 100
    const total = principal * Math.pow(1 + r, years)
    const invested = principal
    return { invested, total, gain: total - invested }
  }

  const result = calculationType === 'sip' 
    ? calculateSIP(monthlyInvestment, annualRate, years)
    : calculateLumpsum(lumpsumAmount, annualRate, years)

  const jsonLd = useMemo(
    () =>
      getWebPageJsonLd({
        name: 'SIP Calculator',
        description: 'Calculate returns for Systematic Investment Plan (SIP).',
        url: `${siteUrl}/sip-calculator`,
        breadcrumb: ['Home', 'SIP Calculator'],
      }),
    []
  )

  const webAppJsonLd = useMemo(
    () =>
      getWebAppJsonLd({
        name: 'SIP Calculator',
        description: 'Web-based SIP calculator for estimating future value of monthly investments.',
        url: `${siteUrl}/sip-calculator`,
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
          {calculationType === 'sip' ? 'SIP Calculator' : 'Lumpsum Calculator'}
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          {calculationType === 'sip' 
            ? 'Estimate returns from a Systematic Investment Plan.'
            : 'Calculate returns from a one-time lumpsum investment.'
          }
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Inputs</h2>
          
          {/* Investment Type Toggle */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block tracking-wide">
              Investment Type
            </label>
            <div className="flex bg-white/60 dark:bg-white/10 rounded-xl p-1 border border-white/30">
              <button
                onClick={() => setCalculationType('sip')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  calculationType === 'sip'
                    ? 'bg-brand.indigo text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                SIP
              </button>
              <button
                onClick={() => setCalculationType('lumpsum')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  calculationType === 'lumpsum'
                    ? 'bg-brand.indigo text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Lumpsum
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {calculationType === 'sip' ? (
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Monthly Investment</label>
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md text-gray-900 dark:text-white"
                />
              </div>
            ) : (
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Lumpsum Amount</label>
                <input
                  type="number"
                  value={lumpsumAmount}
                  onChange={(e) => setLumpsumAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-md text-gray-900 dark:text-white"
                />
              </div>
            )}
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
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Results</h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
              <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">
                {calculationType === 'sip' ? 'Total Investment' : 'Principal Amount'}
              </div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                ₹{result.invested.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Total Value</div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                ₹{result.total.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">Capital Gains</div>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                ₹{result.gain.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}