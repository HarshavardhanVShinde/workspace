"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import PageHeader from "@/components/ui/page-header";

const RDGrowthChart = dynamic(() => import("@/components/charts/rd-growth-chart"), { ssr: false });

function formatINR(n: number) {
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });
}

function monthlyRateFromComp(annualRatePercent: number, compPerYear: number) {
  const r = (annualRatePercent || 0) / 100;
  const periodsPerYear = compPerYear || 4; // RD typically quarterly
  const monthsPerPeriod = 12 / periodsPerYear;
  const monthlyFactor = Math.pow(1 + r / periodsPerYear, 1 / monthsPerPeriod);
  return monthlyFactor - 1; // effective monthly rate consistent with selected compounding
}

export default function RDCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState<number>(1000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [timeYears, setTimeYears] = useState<number>(5);
  const [compounding, setCompounding] = useState<string>("4"); // 12-monthly, 4-quarterly, 2-half-yearly, 1-yearly
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number>(Date.now());

  const [altSavingsRate, setAltSavingsRate] = useState<number>(3.5);
  const [altSipRate, setAltSipRate] = useState<number>(10);

  const results = useMemo(() => {
    const P = monthlyAmount;
    const rAnnual = interestRate;
    const years = timeYears;
    const compPerYear = parseInt(compounding);
    if (P <= 0 || rAnnual <= 0 || years <= 0 || !compPerYear) return null;

    const N = Math.round(years * 12);
    const i_m = monthlyRateFromComp(rAnnual, compPerYear);

    // Annuity-due FV (deposit at start of month)
    const maturityValue = i_m > 0 ? P * (((Math.pow(1 + i_m, N) - 1) / i_m) * (1 + i_m)) : P * N;
    const totalInvestment = P * N;
    const totalInterest = Math.max(0, maturityValue - totalInvestment);

    // Build monthly timeline including comparison alternatives
    const monthlyData: { month: number; principal: number; interest: number; balance: number; altSavings: number; altSip: number }[] = [];
    let balance = 0;
    let principalCum = 0;

    const iSavings = monthlyRateFromComp(altSavingsRate, 12);
    const iSip = monthlyRateFromComp(altSipRate, 12);
    let balanceSavings = 0;
    let balanceSip = 0;

    for (let m = 1; m <= N; m++) {
      balance = (balance + P) * (1 + i_m);
      principalCum += P;
      const interestCum = Math.max(0, balance - principalCum);

      balanceSavings = (balanceSavings + P) * (1 + iSavings);
      balanceSip = (balanceSip + P) * (1 + iSip);

      monthlyData.push({ month: m, principal: principalCum, interest: interestCum, balance, altSavings: balanceSavings, altSip: balanceSip });
    }

    return { totalInvestment, totalInterest, maturityValue, monthlyData };
  }, [monthlyAmount, interestRate, timeYears, compounding, altSavingsRate, altSipRate, lastUpdatedAt]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title="RD Calculator" description="Recurring deposits with monthly contributions and flexible compounding." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <GlassCard title="Inputs" subtitle="Monthly deposit with compounding frequency." className="p-6 sm:p-8 border-2 border-white/50 dark:border-white/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-200">Monthly deposit (₹)</label>
              <Input type="number" value={monthlyAmount} onChange={(e) => setMonthlyAmount(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-200">Interest rate (% p.a.)</label>
              <Input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-200">Tenure (years)</label>
              <Input type="number" value={timeYears} onChange={(e) => setTimeYears(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-200">Compounding</label>
              <Select onValueChange={setCompounding} defaultValue={compounding}>
                <SelectTrigger className="bg-white/80 dark:bg-white/10 border border-white/30 dark:border-white/20 h-10">
                  <SelectValue placeholder="Select compounding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">Monthly</SelectItem>
                  <SelectItem value="4">Quarterly</SelectItem>
                  <SelectItem value="2">Half-Yearly</SelectItem>
                  <SelectItem value="1">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="mt-4 w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setLastUpdatedAt(Date.now())}>
            Update
          </Button>
          <div className="mt-3 text-xs text-gray-600 dark:text-gray-300">RDs are typically compounded quarterly; other options provided for flexibility.</div>
        </GlassCard>

        <GlassCard title="Results" subtitle="Investment breakdown" className="p-6 sm:p-8 border-2 border-white/50 dark:border-white/20">
          {results ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Total Investment</div>
                <div className="text-xl font-semibold mt-1 text-gray-900 dark:text-white">{formatINR(results.totalInvestment)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Total Interest</div>
                <div className="text-xl font-semibold mt-1 text-gray-900 dark:text-white">{formatINR(results.totalInterest)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Maturity Value</div>
                <div className="text-xl font-semibold mt-1 text-gray-900 dark:text-white">{formatINR(results.maturityValue)}</div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-400">Enter valid inputs and click Update to see results.</div>
          )}
        </GlassCard>
      </div>

      <div className="mt-6">
        <GlassCard title="Growth & Comparison" subtitle="Principal vs interest accumulation and alternatives" className="p-6 sm:p-8 border-2 border-white/50 dark:border-white/20">
          {results ? (
            <RDGrowthChart monthlyData={results.monthlyData} />
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-400">Chart appears after calculating results.</div>
          )}
        </GlassCard>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard title="How RD is calculated" subtitle="Standard banking formula" className="border-2 border-white/50 dark:border-white/20">
          Future value of a recurring deposit (monthly contributions) is computed using the annuity-due formula: FV = P × [((1 + i)^N − 1)/i] × (1 + i), where P is monthly deposit, i is effective monthly rate derived from the selected compounding frequency, and N is number of months.
        </GlassCard>
        <GlassCard title="Benefits" subtitle="Why choose RD" className="border-2 border-white/50 dark:border-white/20">
          - Guaranteed, low-risk returns
          - Discipline of monthly savings
          - Suitable for short-to-medium horizons
          - Predictable maturity value
        </GlassCard>
        <GlassCard title="RD vs others" subtitle="Fixed income comparisons" className="border-2 border-white/50 dark:border-white/20">
          RDs typically compound quarterly and offer assured returns. Savings accounts compound monthly at lower rates, while SIPs target market-linked returns that are not guaranteed. Choose based on risk tolerance and horizon.
        </GlassCard>
      </div>

      <div className="mt-6">
        <GlassCard title="FAQs" subtitle="Common questions" className="p-6 sm:p-8 border-2 border-white/50 dark:border-white/20">
          <div className="space-y-3 text-sm">
            <div>
              <div className="font-semibold">Is interest credited monthly or quarterly?</div>
              <div>Banks generally credit interest quarterly for RDs. We convert the quarterly rate to an effective monthly rate for accurate month-wise growth visualization.</div>
            </div>
            <div>
              <div className="font-semibold">Are rates fixed for the entire tenure?</div>
              <div>Calculations assume a constant annual rate. Actual bank policies may vary and could change rates over time.</div>
            </div>
            <div>
              <div className="font-semibold">Why does my bank’s figure differ slightly?</div>
              <div>Minor differences can arise from rounding rules and credit dates. Our model uses precise compounding and month-start deposits.</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}