"use client";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import dynamic from "next/dynamic";
import PageHeader from "@/components/ui/page-header";

const PPFGrowthChart = dynamic(() => import("@/components/charts/ppf-growth-chart"), { ssr: false });

function inr(n: number) {
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}

export default function PPFCalculator() {
  const [yearlyInvestment, setYearlyInvestment] = useState<string>("150000");
  const [timePeriod, setTimePeriod] = useState<string>("15");
  const [interestRate, setInterestRate] = useState<string>("7.1");
  const [extendYears, setExtendYears] = useState<string>("0");
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number>(Date.now());

  const result = useMemo(() => {
    const P = Math.max(0, parseFloat(yearlyInvestment) || 0);
    const tBase = Math.max(1, Math.min(15, parseFloat(timePeriod) || 15));
    const tExt = Math.max(0, Math.min(10, parseFloat(extendYears) || 0));
    const t = tBase + tExt;
    const r = (parseFloat(interestRate) || 0) / 100;

    if (P <= 0 || t <= 0 || r < 0) return null;

    let maturityValue = 0;
    let totalInvestment = 0;
    const yearlyData: { year: number; principal: number; interest: number; balance: number }[] = [];

    for (let i = 1; i <= t; i++) {
      totalInvestment += P;
      const interest = (maturityValue + P) * r;
      maturityValue += P + interest;
      yearlyData.push({ year: i, principal: P, interest, balance: maturityValue });
    }

    return {
      totalInvestment,
      maturityValue,
      totalInterest: maturityValue - totalInvestment,
      yearlyData,
      years: t,
    };
  }, [yearlyInvestment, timePeriod, interestRate, extendYears, lastUpdatedAt]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Title via shared PageHeaderFromPath */}
      <PageHeader title="PPF Calculator" description="Estimate your PPF corpus with annual contributions and tax-free interest." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard title="Inputs" subtitle="Yearly investment with interest compounded annually.">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Yearly investment (₹)</label>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <Input type="number" value={yearlyInvestment} onChange={(e) => setYearlyInvestment(e.target.value)} className="w-full sm:w-48" />
                <input type="range" min={500} max={150000} step={500} value={Number(yearlyInvestment)} onChange={(e) => setYearlyInvestment(e.target.value)} className="w-full sm:flex-1 h-2 rounded-full bg-white/30 dark:bg-white/10" />
                <span className="sm:min-w-[6rem] sm:text-right text-sm text-muted-foreground">₹{Number(yearlyInvestment).toLocaleString("en-IN")}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">PPF allows up to ₹1.5 lakh contribution per year.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Time period (years)</label>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <Input type="number" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="w-full sm:w-28" />
                <input type="range" min={1} max={15} step={1} value={Number(timePeriod)} onChange={(e) => setTimePeriod(e.target.value)} className="w-full sm:flex-1 h-2 rounded-full bg-white/30 dark:bg-white/10" />
                <span className="sm:min-w-[4rem] sm:text-right text-sm text-muted-foreground">{timePeriod} yr</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">PPF matures at 15 years; you can extend in 5-year blocks.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Extend after maturity (years)</label>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <Input type="number" value={extendYears} onChange={(e) => setExtendYears(e.target.value)} className="w-full sm:w-28" />
                <input type="range" min={0} max={10} step={1} value={Number(extendYears)} onChange={(e) => setExtendYears(e.target.value)} className="w-full sm:flex-1 h-2 rounded-full bg-white/30 dark:bg-white/10" />
                <span className="sm:min-w-[4rem] sm:text-right text-sm text-muted-foreground">{extendYears} yr</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Optional extension (for modeling only). Real extension is in 5-year blocks.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Interest rate (% p.a.)</label>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <Input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full sm:w-28" />
                <input type="range" min={6} max={10} step={0.1} value={Number(interestRate)} onChange={(e) => setInterestRate(e.target.value)} className="w-full sm:flex-1 h-2 rounded-full bg-white/30 dark:bg-white/10" />
                <span className="sm:min-w-[4rem] sm:text-right text-sm text-muted-foreground">{interestRate}%</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Government-notified rate changes periodically. Default shown for reference.</p>
            </div>

            <Button className="w-full" onClick={() => setLastUpdatedAt(Date.now())}>Update</Button>
          </div>
        </GlassCard>

        <GlassCard title="Results" subtitle="Projected maturity value and yearly progression.">
          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                  <div className="text-xs text-muted-foreground">Maturity value</div>
                  <div className="text-2xl font-semibold mt-1">{inr(result.maturityValue)}</div>
                  <div className="text-xs mt-1">Across {result.years} years</div>
                </div>
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                  <div className="text-xs text-muted-foreground">Total investment</div>
                  <div className="text-xl font-semibold mt-1">{inr(result.totalInvestment)}</div>
                </div>
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                  <div className="text-xs text-muted-foreground">Total interest</div>
                  <div className="text-xl font-semibold mt-1">{inr(result.totalInterest)}</div>
                </div>
              </div>

              <div className="mt-6">
                <PPFGrowthChart yearlyData={result.yearlyData} />
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Enter valid inputs and click Update to see results.</div>
          )}
        </GlassCard>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard title="About PPF" subtitle="Safe, tax-efficient long-term savings">
          Public Provident Fund (PPF) is a government-backed savings scheme with EEE tax benefits. Interest is compounded yearly and credited annually.
        </GlassCard>
        <GlassCard title="Rules & limits" subtitle="Key points">
          Maximum yearly contribution is ₹1.5 lakh; account tenure is 15 years. Partial withdrawals are allowed after year 7 subject to rules.
        </GlassCard>
        <GlassCard title="Disclaimer" subtitle="Simplified model">
          This tool assumes annual deposit at start of year and yearly compounding. Actual interest crediting and contributions may vary.
        </GlassCard>
      </div>
    </div>
  );
}