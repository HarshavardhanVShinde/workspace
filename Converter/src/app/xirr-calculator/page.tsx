'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import StructuredData from '@/components/seo/structured-data'
import { getWebPageJsonLd, getWebAppJsonLd, siteUrl } from '@/lib/seo'
import { GlassCard } from '@/components/ui/glass-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/ui/page-header'
import { xirr as computeXIRR } from '@/utils/xirr'

const XIRRPerformanceChart = dynamic(() => import('@/components/charts/xirr-performance-chart'), { ssr: false })
const XIRRWealthChart = dynamic(() => import('@/components/charts/xirr-wealth-chart'), { ssr: false })

function inr(n: number) { return n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }) }

type Flow = { date: string; amount: number }

export default function XIRRCalculator() {
  const [flows, setFlows] = useState<Flow[]>([
    { date: '2024-01-15', amount: -10000 },
    { date: '2024-02-15', amount: -5000 },
    { date: '2024-05-01', amount: -5000 },
    { date: '2024-12-31', amount: 22000 }, // redemption
  ])
  const [guess, setGuess] = useState<string>('0.10')

  const rate = useMemo(() => {
    const vals = flows.map(f => f.amount)
    const dates = flows.map(f => new Date(f.date))
    const g = parseFloat(guess) || 0.1
    const r = computeXIRR(vals, dates, g)
    return isFinite(r) ? r : NaN
  }, [flows, guess])

  const totals = useMemo(() => {
    const invested = flows.reduce((s, f) => s + (f.amount < 0 ? Math.abs(f.amount) : 0), 0)
    const returned = flows.reduce((s, f) => s + (f.amount > 0 ? f.amount : 0), 0)
    return { invested, returned, net: returned - invested }
  }, [flows])

  const jsonLd = useMemo(() => getWebPageJsonLd({ name: 'XIRR Calculator', description: 'Calculate XIRR (annualized return) for irregular cash flows.', url: `${siteUrl}/xirr-calculator`, breadcrumb: ['Home','XIRR Calculator'] }), [])
  const webAppJsonLd = useMemo(() => getWebAppJsonLd({ name: 'XIRR Calculator', description: 'Web-based XIRR calculator for non-periodic cash flows.', url: `${siteUrl}/xirr-calculator`, applicationCategory: 'Finance' }), [])

  const endDate = useMemo(() => flows.length ? flows[flows.length - 1].date : undefined, [flows])

  function updateFlow(i: number, patch: Partial<Flow>) {
    setFlows(prev => prev.map((f, idx) => idx === i ? { ...f, ...patch } : f))
  }
  function addFlow() {
    const last = flows[flows.length - 1]
    const nextDate = last ? new Date(new Date(last.date).getTime() + 24*60*60*1000).toISOString().slice(0,10) : new Date().toISOString().slice(0,10)
    setFlows(prev => [...prev, { date: nextDate, amount: -1000 }])
  }
  function removeFlow(i: number) {
    setFlows(prev => prev.filter((_, idx) => idx !== i))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <StructuredData data={jsonLd} />
      <StructuredData data={webAppJsonLd} />

      {/* <PageHeader title="XIRR Calculator" description="Compute annualized returns for uneven cash flows; visualize cash flows and projected portfolio values." /> */}
      <div className="mb-12 text-center">
        <h1 className="font-extrabold tracking-tight text-4xl sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-4">
          XIRR Calculator
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Compute annualized returns for uneven cash flows; visualize cash flows and projected portfolio values.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard title="Cash Flows" subtitle="Negative amounts are investments; positive amounts are returns.">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div>Date</div><div>Amount (₹)</div><div className="sm:text-right">Actions</div>
            </div>
            <div className="space-y-2">
              {flows.map((f, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                  <Input type="date" value={f.date} onChange={(e) => updateFlow(i, { date: e.target.value })} className="w-full" />
                  <Input type="number" value={String(f.amount)} onChange={(e) => updateFlow(i, { amount: parseFloat(e.target.value || '0') })} className="w-full" />
                  <div className="flex sm:justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => updateFlow(i, { amount: -(Math.abs(f.amount) || 1000) })}>Make Invest (-)</Button>
                    <Button type="button" variant="ghost" onClick={() => updateFlow(i, { amount: Math.abs(f.amount) || 1000 })}>Make Return (+)</Button>
                    <Button type="button" variant="destructive" onClick={() => removeFlow(i)}>Remove</Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button type="button" onClick={addFlow}>Add Flow</Button>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Initial guess</span>
                <Input type="number" value={guess} onChange={(e) => setGuess(e.target.value)} className="w-24" />
                <input type="range" min={-0.9} max={1} step={0.01} value={parseFloat(guess) || 0} onChange={(e) => setGuess(e.target.value)} className="w-40 h-2 rounded-full bg-white/30 dark:bg-white/10" />
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Results" subtitle="Annualized return and portfolio projection">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="text-xs text-muted-foreground">XIRR (annualized)</div>
                <div className="text-2xl font-semibold mt-1">{isFinite(rate) ? (rate*100).toFixed(2)+'%' : '—'}</div>
              </div>
              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="text-xs text-muted-foreground">Total invested</div>
                <div className="text-xl font-semibold mt-1">{inr(totals.invested)}</div>
              </div>
              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="text-xs text-muted-foreground">Total returns</div>
                <div className="text-xl font-semibold mt-1">{inr(totals.returned)}</div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="text-xs text-muted-foreground">Net gain</div>
              <div className="text-xl font-semibold mt-1">{inr(totals.net)}</div>
            </div>

            <div className="mt-6 space-y-6">
              <XIRRPerformanceChart flows={flows} rate={isFinite(rate) ? rate : null} chartType="line" />
              <XIRRWealthChart flows={flows.filter(f => f.amount < 0)} rate={isFinite(rate) ? rate : null} endDate={endDate} />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard title="About XIRR" subtitle="Irregular cash flows">
          XIRR computes an annualized rate for dated cash flows that are not evenly spaced, capturing real-world investments and redemptions.
        </GlassCard>
        <GlassCard title="Tips" subtitle="Model SIP & redemption">
          Add monthly negative flows (investments) and a positive flow at the end (redemption). Adjust the initial guess if the result seems off.
        </GlassCard>
        <GlassCard title="Disclaimer" subtitle="Financial modeling">
          This tool provides estimates; real returns depend on market performance, fees, and timing.
        </GlassCard>
      </div>
    </div>
  )
}