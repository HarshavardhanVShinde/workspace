'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import StructuredData from '@/components/seo/structured-data'
import { getWebPageJsonLd, getWebAppJsonLd, siteUrl } from '@/lib/seo'
import { GlassCard } from '@/components/ui/glass-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/ui/page-header'

const GSTBreakdownChart = dynamic(() => import('@/components/charts/gst-breakdown-chart'), { ssr: false })

function inr(n: number) {
  return n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
}

type PriceMode = 'exclusive' | 'inclusive'
type SupplyType = 'intra' | 'inter' // intra-state => CGST+SGST, inter-state => IGST

export default function GSTCalculator() {
  const [amount, setAmount] = useState<string>('1000')
  const [rate, setRate] = useState<string>('18')
  const [priceMode, setPriceMode] = useState<PriceMode>('exclusive')
  const [supplyType, setSupplyType] = useState<SupplyType>('intra')

  const result = useMemo(() => {
    const a = Math.max(0, parseFloat(amount) || 0)
    const r = Math.max(0, parseFloat(rate) || 0)
    const rateDec = r / 100

    let base = 0, gst = 0, total = 0
    if (priceMode === 'exclusive') {
      base = a
      gst = base * rateDec
      total = base + gst
    } else {
      total = a
      base = total / (1 + rateDec)
      gst = total - base
    }

    const cgst = supplyType === 'intra' ? gst / 2 : 0
    const sgst = supplyType === 'intra' ? gst / 2 : 0
    const igst = supplyType === 'inter' ? gst : 0

    return { base, gst, total, rate: r, cgst, sgst, igst }
  }, [amount, rate, priceMode, supplyType])

  const jsonLd = useMemo(
    () =>
      getWebPageJsonLd({
        name: 'GST Calculator',
        description: 'Compute GST for inclusive or exclusive pricing with CGST/SGST or IGST breakdown.',
        url: `${siteUrl}/gst-calculator`,
        breadcrumb: ['Home', 'GST Calculator'],
      }),
    []
  )

  const webAppJsonLd = useMemo(
    () =>
      getWebAppJsonLd({
        name: 'GST Calculator',
        description: 'Web-based GST calculator supporting inclusive/exclusive pricing and intra/inter-state tax split.',
        url: `${siteUrl}/gst-calculator`,
        applicationCategory: 'Finance',
      }),
    []
  )

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <StructuredData data={jsonLd} />
      <StructuredData data={webAppJsonLd} />

      {/* <PageHeader title="GST Calculator" description="Calculate GST for invoices with inclusive/exclusive pricing and CGST/SGST or IGST breakdown." /> */}
      <div className="mb-12 text-center">
        <h1 className="font-extrabold tracking-tight text-4xl sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-4">
          GST Calculator
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Calculate GST for invoices with inclusive/exclusive pricing and CGST/SGST or IGST breakdown.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard title="Inputs" subtitle="Enter amount, choose GST rate and pricing mode.">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Amount (₹)</label>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full sm:w-48" />
                <input
                  type="range"
                  min={0}
                  max={200000}
                  step={100}
                  value={Number(amount)}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full sm:flex-1 h-2 rounded-full bg-white/30 dark:bg-white/10"
                />
                <span className="sm:min-w-[6rem] sm:text-right text-sm text-muted-foreground">{inr(Number(amount))}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">If price is inclusive of GST, toggle below. Otherwise, amount is treated as pre-tax.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">GST rate (% p.a.)</label>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full sm:w-24" />
                <input
                  type="range"
                  min={0}
                  max={28}
                  step={0.5}
                  value={Number(rate)}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full sm:flex-1 h-2 rounded-full bg-white/30 dark:bg-white/10"
                />
                <span className="sm:min-w-[4rem] sm:text-right text-sm text-muted-foreground">{rate}%</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Common slabs: 5%, 12%, 18%, 28%. Choose what applies.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Pricing mode</label>
                <div className="mt-2 inline-flex rounded-lg border bg-white/50 dark:bg-white/10 backdrop-blur p-1">
                  <Button type="button" variant={priceMode === 'exclusive' ? 'default' : 'ghost'} className="px-3" onClick={() => setPriceMode('exclusive')}>Exclusive</Button>
                  <Button type="button" variant={priceMode === 'inclusive' ? 'default' : 'ghost'} className="px-3" onClick={() => setPriceMode('inclusive')}>Inclusive</Button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Exclusive: GST added on top. Inclusive: amount includes GST.</p>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Supply type</label>
                <div className="mt-2 inline-flex rounded-lg border bg-white/50 dark:bg-white/10 backdrop-blur p-1">
                  <Button type="button" variant={supplyType === 'intra' ? 'default' : 'ghost'} className="px-3" onClick={() => setSupplyType('intra')}>Intra-state (CGST+SGST)</Button>
                  <Button type="button" variant={supplyType === 'inter' ? 'default' : 'ghost'} className="px-3" onClick={() => setSupplyType('inter')}>Inter-state (IGST)</Button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Intra-state splits GST equally into CGST and SGST; inter-state uses IGST.</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Results" subtitle="Breakdown of tax and totals">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="text-xs text-muted-foreground">Net price (pre-tax)</div>
                <div className="text-2xl font-semibold mt-1">{inr(result.base)}</div>
              </div>
              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="text-xs text-muted-foreground">GST amount</div>
                <div className="text-xl font-semibold mt-1">{inr(result.gst)}</div>
                <div className="text-xs mt-1">
                  {supplyType === 'intra' ? (
                    <>CGST {inr(result.cgst)} + SGST {inr(result.sgst)}</>
                  ) : (
                    <>IGST {inr(result.igst)}</>
                  )}
                </div>
              </div>
              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="text-xs text-muted-foreground">Total price</div>
                <div className="text-2xl font-semibold mt-1">{inr(result.total)}</div>
              </div>
            </div>

            <div className="mt-6">
              <GSTBreakdownChart originalAmount={result.base} gstAmount={result.gst} />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard title="About GST" subtitle="Goods & Services Tax">
          GST is a value-added tax applicable on most goods and services in India. Rates vary by item; common slabs include 5%, 12%, 18%, 28%.
        </GlassCard>
        <GlassCard title="Inclusive vs Exclusive" subtitle="How pricing works">
          Exclusive pricing adds GST on top of the base price. Inclusive pricing means the listed amount already includes GST; the tool backs out the tax component.
        </GlassCard>
        <GlassCard title="Disclaimer" subtitle="Simplified model">
          This tool provides an approximate breakdown for estimation. Actual tax treatment may vary by item classification and state regulations.
        </GlassCard>
      </div>
    </div>
  )
}