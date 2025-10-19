"use client";
import { useState, useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import PageHeader from "@/components/ui/page-header";
import ClientOnly from "@/components/ui/client-only";

const SWPGrowthChart = dynamic(() => import("@/components/charts/swp-growth-chart"), { ssr: false });

export default function SWPCalculator() {
  // Defaults inspired by screenshot; editable via sliders/inputs
  const [totalInvestment, setTotalInvestment] = useState("500000");
  const [withdrawalPerMonth, setWithdrawalPerMonth] = useState("10000");
  const [expectedReturnRate, setExpectedReturnRate] = useState("8");
  const [timePeriod, setTimePeriod] = useState("5");

  const numeric = useMemo(() => ({
    P: parseFloat(totalInvestment) || 0,
    W: parseFloat(withdrawalPerMonth) || 0,
    rMonthly: (parseFloat(expectedReturnRate) || 0) / 100 / 12,
    months: (parseFloat(timePeriod) || 0) * 12,
  }), [totalInvestment, withdrawalPerMonth, expectedReturnRate, timePeriod]);

  const calculate = () => {
    const { P, W, rMonthly, months } = numeric;
    if (P <= 0 || W < 0 || rMonthly < 0 || months <= 0) return null;

    let totalWithdrawal = 0;
    let balance = P;
    const monthlyData: { month: number; balance: number }[] = [];

    for (let i = 0; i < months; i++) {
      const interest = balance * rMonthly;
      balance += interest - W;
      totalWithdrawal += W;
      monthlyData.push({ month: i + 1, balance });
      if (balance <= 0) {
        // Stop if the corpus depletes
        break;
      }
    }

    return {
      totalWithdrawal,
      finalValue: balance,
      monthlyData,
    };
  };

  const result = useMemo(calculate, [numeric]);

  return (
    <div className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader title="SWP Calculator" description="Plan Systematic Withdrawal (SWP) monthly payouts and visualize remaining corpus." />
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <GlassCard className="p-6 sm:p-8 border-2 border-white/50 dark:border-white/20 bg-gradient-to-br from-white/90 to-white/70 dark:from-white/10 dark:to-white/5 backdrop-blur-xl shadow-xl">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Inputs</h2>
          <div className="space-y-6">
            {/* Total Investment */}
            <div>
              <label htmlFor="totalInvestment" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Total investment (₹)</label>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <Input
                  id="totalInvestment"
                  type="number"
                  value={totalInvestment}
                  onChange={(e) => setTotalInvestment(e.target.value)}
                  className="w-full sm:w-48"
                  aria-describedby="totalInvestment-help"
                />
                <input
                  type="range"
                  min={10000}
                  max={5000000}
                  step={10000}
                  value={Number(totalInvestment)}
                  onChange={(e) => setTotalInvestment(e.target.value)}
                  className="w-full sm:flex-1 h-2 rounded-full bg-white/30 dark:bg-white/10"
                  aria-label="Total investment slider"
                />
                <span className="sm:min-w-[6rem] sm:text-right text-sm text-gray-600 dark:text-gray-400">₹{Number(totalInvestment).toLocaleString("en-IN")}</span>
              </div>
              <p id="totalInvestment-help" className="mt-1 text-xs text-gray-500">Initial corpus you invest into the SWP.</p>
            </div>

            {/* Withdrawal per month */}
            <div>
              <label htmlFor="withdrawalPerMonth" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Withdrawal per month (₹)</label>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <Input
                  id="withdrawalPerMonth"
                  type="number"
                  value={withdrawalPerMonth}
                  onChange={(e) => setWithdrawalPerMonth(e.target.value)}
                  className="w-full sm:w-48"
                  aria-describedby="withdrawal-help"
                />
                <input
                  type="range"
                  min={1000}
                  max={200000}
                  step={500}
                  value={Number(withdrawalPerMonth)}
                  onChange={(e) => setWithdrawalPerMonth(e.target.value)}
                  className="w-full sm:flex-1 h-2 rounded-full bg-white/30 dark:bg-white/10"
                  aria-label="Withdrawal per month slider"
                />
                <span className="sm:min-w-[6rem] sm:text-right text-sm text-gray-600 dark:text-gray-400">₹{Number(withdrawalPerMonth).toLocaleString("en-IN")}</span>
              </div>
              <p id="withdrawal-help" className="mt-1 text-xs text-gray-500">Fixed monthly payout from your corpus.</p>
            </div>

            {/* Expected return rate */}
            <div>
              <label htmlFor="expectedReturnRate" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Expected return rate (% p.a.)</label>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <Input
                  id="expectedReturnRate"
                  type="number"
                  value={expectedReturnRate}
                  onChange={(e) => setExpectedReturnRate(e.target.value)}
                  className="w-full sm:w-28"
                  aria-describedby="rate-help"
                />
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={0.25}
                  value={Number(expectedReturnRate)}
                  onChange={(e) => setExpectedReturnRate(e.target.value)}
                  className="w-full sm:flex-1 h-2 rounded-full bg-white/30 dark:bg-white/10"
                  aria-label="Expected return rate slider"
                />
                <span className="sm:min-w-[4rem] sm:text-right text-sm text-gray-600 dark:text-gray-400">{expectedReturnRate}%</span>
              </div>
              <p id="rate-help" className="mt-1 text-xs text-gray-500">Average annual return. We compound monthly for accuracy.</p>
            </div>

            {/* Time period */}
            <div>
              <label htmlFor="timePeriod" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Time period (years)</label>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <Input
                  id="timePeriod"
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="w-full sm:w-28"
                  aria-describedby="time-help"
                />
                <input
                  type="range"
                  min={1}
                  max={40}
                  step={1}
                  value={Number(timePeriod)}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="w-full sm:flex-1 h-2 rounded-full bg-white/30 dark:bg-white/10"
                  aria-label="Time period slider"
                />
                <span className="sm:min-w-[4rem] sm:text-right text-sm text-gray-600 dark:text-gray-400">{timePeriod} yr</span>
              </div>
              <p id="time-help" className="mt-1 text-xs text-gray-500">Total duration for withdrawals. Corpus may deplete earlier.</p>
            </div>

            <div className="pt-2">
              <Button onClick={() => { /* no-op, computation is live via useMemo */ }} className="w-full">Update</Button>
            </div>
          </div>
        </GlassCard>

        {/* Results & Chart */}
        <GlassCard className="p-6 sm:p-8 border-2 border-white/50 dark:border-white/20 bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl shadow-xl">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Results</h2>
          {result ? (
            <div className="space-y-4" aria-live="polite">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/20 p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total investment</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">₹{numeric.P.toLocaleString("en-IN")}</p>
                </div>
                <div className="rounded-xl bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/20 p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total withdrawal</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">₹{result.totalWithdrawal.toLocaleString("en-IN")}</p>
                </div>
                <div className="rounded-xl bg-green-100/60 dark:bg-green-900/30 border border-green-200/50 dark:border-green-800/40 p-4">
                  <p className="text-xs text-green-700 dark:text-green-300">Final value</p>
                  <p className="text-base font-semibold text-green-700 dark:text-green-300">₹{Math.max(0, result.finalValue).toLocaleString("en-IN")}</p>
                </div>
              </div>

              <div className="mt-4">
                <ClientOnly>
                  <SWPGrowthChart monthlyData={result.monthlyData} />
                </ClientOnly>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">Enter valid inputs to see results and chart.</p>
          )}
        </GlassCard>
      </div>

      {/* Concept explanation */}
      <GlassCard className="mt-10 p-6 border-2 border-white/50 dark:border-white/20 bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">What is an SWP?</h2>
        <p className="mt-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-3xl">
          A Systematic Withdrawal Plan allows you to withdraw a fixed amount from your investment at regular intervals. The remaining amount continues to earn returns. Actual performance varies; use this calculator for planning and to compare scenarios.
        </p>
      </GlassCard>
    </div>
  );
}