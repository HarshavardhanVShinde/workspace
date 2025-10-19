"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import PageHeader from "@/components/ui/page-header";

const EPFGrowthChart = dynamic(() => import("@/components/charts/epf-growth-chart"), { ssr: false });

function formatINR(n: number) {
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}

export default function EPFCalculator() {
  const [monthlySalary, setMonthlySalary] = useState<number>(50000);
  const [employeePct, setEmployeePct] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [currentAge, setCurrentAge] = useState<number>(25);
  const [retirementAge, setRetirementAge] = useState<number>(58);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number>(Date.now());

  const { workingYears, annualContribution, totalContribution, totalInterest, maturityValue, yearlyData } = useMemo(() => {
    const years = Math.max(0, retirementAge - currentAge);
    const r = interestRate / 100;
    const employeeAnnual = monthlySalary * (employeePct / 100) * 12;
    const employerAnnual = monthlySalary * 0.0367 * 12; // 3.67% of basic -> common assumption
    const annual = employeeAnnual + employerAnnual;

    let balance = 0;
    let interestAcc = 0;
    const data: { year: number; contribution: number; interest: number; balance: number }[] = [];
    for (let y = 1; y <= years; y++) {
      const interest = (balance + annual) * r;
      balance += annual + interest;
      interestAcc += interest;
      data.push({ year: y, contribution: annual, interest, balance });
    }

    return {
      workingYears: years,
      annualContribution: annual,
      totalContribution: annual * years,
      totalInterest: interestAcc,
      maturityValue: balance,
      yearlyData: data,
    };
  }, [monthlySalary, employeePct, interestRate, currentAge, retirementAge, lastUpdatedAt]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Title is provided by shared PageHeaderFromPath */}
      <PageHeader title="EPF Calculator" description="Estimate your EPF corpus at retirement with employee/employer contributions and annual interest." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard title="Inputs" subtitle="Configure EPF assumptions for employee and employer contributions.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Monthly salary (₹)</label>
              <Input type="number" value={monthlySalary} onChange={(e) => setMonthlySalary(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Employee contribution (%)</label>
              <Input type="number" value={employeePct} onChange={(e) => setEmployeePct(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Interest rate (% p.a.)</label>
              <Input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Current age (years)</label>
              <Input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Retirement age (years)</label>
              <Input type="number" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} />
            </div>
          </div>
          <Button className="mt-4 w-full" onClick={() => setLastUpdatedAt(Date.now())}>Update</Button>
          <div className="mt-4 text-xs text-muted-foreground">
            Assumptions: Employer contributes ~3.67% of basic; interest compounded yearly.
          </div>
        </GlassCard>

        <GlassCard title="Results" subtitle="Projected EPF balance and breakdown till retirement.">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="text-xs text-muted-foreground">Total at retirement</div>
              <div className="text-2xl font-semibold mt-1">{formatINR(maturityValue)}</div>
              <div className="text-xs mt-1">Across {workingYears} years</div>
            </div>
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="text-xs text-muted-foreground">Total contribution</div>
              <div className="text-xl font-semibold mt-1">{formatINR(totalContribution)}</div>
              <div className="text-xs mt-1">Annual: {formatINR(annualContribution)}</div>
            </div>
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="text-xs text-muted-foreground">Total interest earned</div>
              <div className="text-xl font-semibold mt-1">{formatINR(totalInterest)}</div>
              <div className="text-xs mt-1">Rate: {interestRate}% p.a.</div>
            </div>
          </div>

          <div className="mt-6">
            <EPFGrowthChart yearlyData={yearlyData} />
          </div>
        </GlassCard>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard title="What is EPF?" subtitle="Employee Provident Fund basics">
          EPF is a retirement savings scheme where both employee and employer contribute a fixed percentage of salary. Funds earn interest and compound annually.
        </GlassCard>
        <GlassCard title="Tips" subtitle="Improve your EPF corpus">
          Increase employee contribution when possible, avoid premature withdrawals, and keep track of interest rate notifications from EPFO.
        </GlassCard>
        <GlassCard title="Disclaimer" subtitle="Simplified model">
          Calculations assume constant salary, fixed employer rate, and yearly compounding. Real-life contributions and interest crediting may vary.
        </GlassCard>
      </div>
    </div>
  );
}