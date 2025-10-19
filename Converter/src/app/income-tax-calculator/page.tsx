"use client";
import { useState, useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(n)));
}

type Regime = "new" | "old";

function calcTaxSlabs(taxable: number, regime: Regime) {
  let tax = 0;
  const slabsNew = [
    { upto: 300000, rate: 0 },
    { upto: 600000, rate: 0.05 },
    { upto: 900000, rate: 0.10 },
    { upto: 1200000, rate: 0.15 },
    { upto: 1500000, rate: 0.20 },
    { upto: Infinity, rate: 0.30 },
  ];
  const slabsOld = [
    { upto: 250000, rate: 0 },
    { upto: 500000, rate: 0.05 },
    { upto: 1000000, rate: 0.20 },
    { upto: Infinity, rate: 0.30 },
  ];
  const slabs = regime === "new" ? slabsNew : slabsOld;

  let last = 0;
  for (const s of slabs) {
    const span = Math.min(taxable, s.upto) - last;
    if (span > 0) tax += span * s.rate;
    last = s.upto;
    if (taxable <= s.upto) break;
  }

  // Section 87A rebate (assumed resident individual)
  if (regime === "new" && taxable <= 700000) tax = 0;
  if (regime === "old" && taxable <= 500000) tax = 0;

  const cess = tax * 0.04; // health & education cess
  return { tax, cess, total: tax + cess };
}

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState<string>("1200000");
  const [regime, setRegime] = useState<Regime>("new");
  const [stdDeduction, setStdDeduction] = useState<string>("50000");
  const [section80C, setSection80C] = useState<string>("150000"); // PF/PPF/ELSS etc.
  const [section80D, setSection80D] = useState<string>("25000"); // Medical insurance

  const result = useMemo(() => {
    const gross = parseFloat(income) || 0;
    const sd = Math.min(parseFloat(stdDeduction) || 0, 50000);
    const d80c = Math.min(parseFloat(section80C) || 0, 150000);
    const d80d = Math.min(parseFloat(section80D) || 0, 100000); // simplified cap

    // New regime allows std deduction; many section deductions disallowed.
    const allowed80c = regime === "old" ? d80c : 0;
    const allowed80d = regime === "old" ? d80d : 0;

    const taxable = Math.max(0, gross - sd - allowed80c - allowed80d);
    const { tax, cess, total } = calcTaxSlabs(taxable, regime);
    const effectiveRate = gross > 0 ? (total / gross) * 100 : 0;

    return { gross, taxable, tax, cess, total, effectiveRate };
  }, [income, regime, stdDeduction, section80C, section80D]);

  return (
    <div className="pt-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Intro blurb below shared PageHeader */}
      <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl">
        Compare your income tax under the New vs Old regime, with standard deduction and common deductions. Figures are indicative; consult a tax professional for personalized advice.
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <GlassCard className="p-6 sm:p-8 border-2 border-white/50 dark:border-white/20 bg-gradient-to-br from-white/90 to-white/70 dark:from-white/10 dark:to-white/5 backdrop-blur-xl shadow-xl">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Inputs</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Annual Income (₹)</label>
              <Input type="number" value={income} onChange={(e) => setIncome(e.target.value)} />
              <p className="mt-1 text-xs text-gray-500">Gross salary income before deductions.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Regime</label>
              <Select value={regime} onValueChange={(v) => setRegime(v as Regime)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select regime" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New Regime (FY 2024–25)</SelectItem>
                  <SelectItem value="old">Old Regime</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Standard Deduction</label>
                <Input type="number" value={stdDeduction} onChange={(e) => setStdDeduction(e.target.value)} />
                <p className="mt-1 text-xs text-gray-500">Max ₹50,000</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Section 80C</label>
                <Input type="number" value={section80C} onChange={(e) => setSection80C(e.target.value)} />
                <p className="mt-1 text-xs text-gray-500">PF, PPF, ELSS etc. Max ₹1,50,000 (Old)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Section 80D</label>
                <Input type="number" value={section80D} onChange={(e) => setSection80D(e.target.value)} />
                <p className="mt-1 text-xs text-gray-500">Health insurance. Simplified cap ₹25,000 (Old)</p>
              </div>
            </div>

            <div className="pt-2">
              <Button className="w-full" onClick={() => { /* live via useMemo */ }}>Update</Button>
            </div>
          </div>
        </GlassCard>

        {/* Results */}
        <GlassCard className="p-6 sm:p-8 border-2 border-white/50 dark:border-white/20 bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl shadow-xl">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/20 p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Gross Income</p>
              <p className="text-base font-semibold text-gray-900 dark:text-white">{formatINR(result.gross)}</p>
            </div>
            <div className="rounded-xl bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/20 p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Taxable Income</p>
              <p className="text-base font-semibold text-gray-900 dark:text-white">{formatINR(result.taxable)}</p>
            </div>
            <div className="rounded-xl bg-blue-100/60 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-800/40 p-4">
              <p className="text-xs text-blue-700 dark:text-blue-300">Tax Payable</p>
              <p className="text-base font-semibold text-blue-700 dark:text-blue-300">{formatINR(result.total)}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/20 p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Tax (before cess)</p>
              <p className="text-base font-semibold text-gray-900 dark:text-white">{formatINR(result.tax)}</p>
            </div>
            <div className="rounded-xl bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/20 p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Cess (4%)</p>
              <p className="text-base font-semibold text-gray-900 dark:text-white">{formatINR(result.cess)}</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/20 p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400">Effective Tax Rate</p>
            <p className="text-base font-semibold text-gray-900 dark:text-white">{result.effectiveRate.toFixed(1)}%</p>
          </div>
        </GlassCard>
      </div>

      {/* Info */}
      <div className="mt-8 bg-white/30 dark:bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/20 dark:border-white/10">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Notes & Assumptions</h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>• New regime slabs assumed for FY 2024–25 with ₹50,000 standard deduction for salaried individuals.</li>
          <li>• Old regime allows popular deductions like 80C/80D; caps are simplified.</li>
          <li>• Section 87A rebate applied: up to ₹7L (new) / ₹5L (old) taxable income → no tax.</li>
          <li>• Actual tax depends on residency, surcharges, exemptions, and precise rules.</li>
        </ul>
      </div>
    </div>
  );
}