'use client'

import { useMemo, useState } from 'react'
import StructuredData from '@/components/seo/structured-data'
import { getWebPageJsonLd, siteUrl, siteName } from '@/lib/seo'
import { GlassCard } from '@/components/ui/glass-card'
import dynamic from 'next/dynamic'

const SipGrowthChart = dynamic(() => import('@/components/charts/sip-growth-chart'), { ssr: false })

type SipFrequency = 'monthly' | 'quarterly' | 'yearly' | 'weekly' | 'daily'
type PlanType = 'sip' | 'lumpsum'

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(1000)
  const [annualRate, setAnnualRate] = useState<number>(12)
  const [years, setYears] = useState<number>(10)
const [lumpsum, setLumpsum] = useState<number>(0)
const [frequency, setFrequency] = useState<SipFrequency>('monthly')
const [planType, setPlanType] = useState<PlanType>('sip')

  const periodsPerYear = (freq: SipFrequency) => {
    switch (freq) {
      case 'monthly': return 12
      case 'quarterly': return 4
      case 'yearly': return 1
      case 'weekly': return 52
      case 'daily': return 365
      default: return 12
    }
  }

  const calculateSIP = (monthly: number, annualRate: number, years: number, freq: SipFrequency, lumpSumEnabled: boolean, lumpSumAmount: number) => {
    const m = periodsPerYear(freq)
    const n = years * m
    const r = annualRate / 100 / m
    const lump = lumpSumEnabled ? lumpSumAmount : 0

    // Future value of SIP contributions and optional lump sum
    let total = 0
    if (n > 0 && r > 0) {
      const sipFV = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
      const lumpFV = lump * Math.pow(1 + r, n)
      total = sipFV + lumpFV
    } else if (n > 0) {
      total = monthly * n + lump
    }

    const invested = monthly * n + lump
    return { invested, total, gain: Math.max(0, total - invested) }
  }

  const result = calculateSIP(
  planType === 'sip' ? monthlyInvestment : 0,
  annualRate,
  years,
  frequency,
  planType === 'lumpsum',
  lumpsum
)

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
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'SIP Calculator',
      description: 'Web-based SIP calculator for estimating future value of monthly investments.',
      url: `${siteUrl}/sip-calculator`,
      applicationCategory: 'Finance',
      offers: {
        '@type': 'Offer',
        price: 0,
        priceCurrency: 'INR',
        category: 'Finance',
      },
      publisher: {
        '@type': 'Organization',
        name: siteName,
        url: siteUrl,
      },
    }),
    []
  )

  const formatINR = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(amount))

  const freqOptions: SipFrequency[] = ['monthly', 'quarterly', 'yearly', 'weekly', 'daily']
  const presetMonthly = [1000, 5000, 10000, 25000]
  const presetYears = [5, 10, 20, 30]
  const presetRates = [8, 12, 15]

  return (
    <div className="pt-8 pb-24 max-w-7xl mx-auto px-4 sm:px-8">
      <StructuredData data={jsonLd} />
      <StructuredData data={webAppJsonLd} />

      <div className="mb-12 text-center">
        <h1 className="font-extrabold tracking-tight text-4xl sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-4">
          SIP Calculator
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Estimate returns from a Systematic Investment Plan. Adjust values with sliders and toggles, view results in cards, and see the breakdown chart.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Controls */}
        <GlassCard className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Inputs</h2>
        {/* Plan Type Toggle */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block tracking-wide">Plan Type</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPlanType('sip')}
              className={`px-3 py-2 rounded-lg border transition-all text-sm font-medium ${planType === 'sip' ? 'bg-white/60 dark:bg-white/10 border-white/50' : 'bg-white/30 dark:bg-white/5 border-white/30 hover:bg-white/50 dark:hover:bg-white/10'}`}
            >
              SIP (Monthly)
            </button>
            <button
              onClick={() => setPlanType('lumpsum')}
              className={`px-3 py-2 rounded-lg border transition-all text-sm font-medium ${planType === 'lumpsum' ? 'bg-white/60 dark:bg-white/10 border-white/50' : 'bg-white/30 dark:bg-white/5 border-white/30 hover:bg-white/50 dark:hover:bg-white/10'}`}
            >
              Lumpsum (One-time)
            </button>
          </div>
        </div>

          {/* Frequency Toggle */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block tracking-wide">Contribution Frequency</label>
            <div className="flex flex-wrap gap-2">
              {freqOptions.map((f) => (
                <button
                  key={f}
                  onClick={() => planType !== 'lumpsum' && setFrequency(f)}
                  disabled={planType === 'lumpsum'}
                  className={`px-3 py-2 rounded-lg border transition-all text-sm font-medium ${frequency === f ? 'bg-white/60 dark:bg-white/10 border-white/50' : 'bg-white/30 dark:bg-white/5 border-white/30 hover:bg-white/50 dark:hover:bg-white/10'} ${planType === 'lumpsum' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">Frequency applies to SIP (monthly contributions). Lumpsum is compounded without recurring contributions.</p>
          </div>

          {/* Monthly Investment Slider */}
         {planType === 'sip' && (
         <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">Monthly Investment</label>
              <div className="text-sm text-gray-600 dark:text-gray-400">{formatINR(monthlyInvestment)}</div>
            </div>
            <input
              type="range"
              min={500}
              max={200000}
              step={500}
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(parseInt(e.target.value) || 0)}
              className="w-full accent-yellow-500"
            />
            <input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(parseFloat(e.target.value) || 0)}
             className="mt-3 w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
              placeholder="1000"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {presetMonthly.map((v) => (
                <button key={v} onClick={() => setMonthlyInvestment(v)} className="px-3 py-2 rounded-lg bg-white/40 dark:bg-white/10 border border-white/30 hover:bg-white/60 dark:hover:bg-white/20 text-sm">
                  {formatINR(v)}
                </button>
              ))}
            </div>
         </div>
         )}

          {/* Annual Rate Slider */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">Annual Rate (%)</label>
              <div className="text-sm text-gray-600 dark:text-gray-400">{annualRate.toFixed(1)}%</div>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={0.1}
              value={annualRate}
              onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
              className="w-full accent-yellow-500"
            />
            <input
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
             className="mt-3 w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
              placeholder="12"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {presetRates.map((v) => (
                <button key={v} onClick={() => setAnnualRate(v)} className="px-3 py-2 rounded-lg bg-white/40 dark:bg-white/10 border border-white/30 hover:bg-white/60 dark:hover:bg-white/20 text-sm">
                  {v}%
                </button>
              ))}
            </div>
          </div>

          {/* Years Slider */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">Years</label>
              <div className="text-sm text-gray-600 dark:text-gray-400">{years} yrs</div>
            </div>
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={years}
              onChange={(e) => setYears(parseInt(e.target.value) || 0)}
              className="w-full accent-yellow-500"
            />
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(parseFloat(e.target.value) || 0)}
             className="mt-3 w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
              placeholder="10"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {presetYears.map((v) => (
                <button key={v} onClick={() => setYears(v)} className="px-3 py-2 rounded-lg bg-white/40 dark:bg-white/10 border border-white/30 hover:bg-white/60 dark:hover:bg-white/20 text-sm">
                  {v} yrs
                </button>
              ))}
            </div>
          </div>


         {/* Lumpsum Amount (shown when planType is lumpsum) */}
         {planType === 'lumpsum' && (
         <div className="mb-4">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Lumpsum Amount</span>
             <span className="text-sm text-gray-600 dark:text-gray-400">{formatINR(lumpsum)}</span>
           </div>
           <input
             type="range"
             min={0}
             max={2000000}
             step={1000}
             value={lumpsum}
             onChange={(e) => setLumpsum(parseInt(e.target.value) || 0)}
             className="w-full accent-yellow-500"
           />
           <input
             type="number"
             value={lumpsum}
             onChange={(e) => setLumpsum(parseFloat(e.target.value) || 0)}
             className="mt-3 w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
             placeholder="0"
           />
         </div>
         )}
        </GlassCard>

        {/* Results & Chart */}
        <div className="space-y-6">
          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl p-4 bg-white/50 dark:bg-white/10 border border-white/30">
                <div className="text-xs text-gray-600 dark:text-gray-400">Invested</div>
                <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{formatINR(result.invested)}</div>
              </div>
              <div className="rounded-xl p-4 bg-white/50 dark:bg-white/10 border border-white/30">
                <div className="text-xs text-gray-600 dark:text-gray-400">Future Value</div>
                <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{formatINR(result.total)}</div>
              </div>
              <div className="rounded-xl p-4 bg-white/50 dark:bg-white/10 border border-white/30">
                <div className="text-xs text-gray-600 dark:text-gray-400">Estimated Gain</div>
                <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{formatINR(result.gain)}</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 sm:p-6">
            <SipGrowthChart
              lumpsum={planType === 'lumpsum' ? lumpsum : 0}
              contribution={planType === 'sip' ? monthlyInvestment : 0}
              annualRatePercent={annualRate}
              years={years}
              frequency={frequency}
            />
            <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">Chart displays the breakdown between total invested and total gains based on your inputs.</p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}