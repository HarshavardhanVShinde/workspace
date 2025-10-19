"use client";
import ReactECharts from "echarts-for-react";
import { useMemo } from "react";

interface FlowPoint { date: string; amount: number }

interface Props {
  flows: FlowPoint[]; // investment flows only (negative values)
  rate: number | null; // computed annual XIRR rate
  endDate?: string; // maturity date label for final value alignment
}

function toDate(d: string) {
  const v = new Date(d);
  return isNaN(v.getTime()) ? null : v;
}

function formatINR(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e9) return sign + "₹" + (abs / 1e9).toFixed(2) + "B";
  if (abs >= 1e6) return sign + "₹" + (abs / 1e6).toFixed(2) + "M";
  if (abs >= 1e3) return sign + "₹" + (abs / 1e3).toFixed(2) + "K";
  return sign + "₹" + Math.round(abs).toLocaleString("en-IN");
}

export default function XIRRWealthChart({ flows, rate, endDate }: Props) {
  const option = useMemo(() => {
    const valid = flows
      .map(f => ({ date: toDate(f.date), amount: f.amount, rawDate: f.date }))
      .filter(f => f.date && isFinite(f.amount));
    if (!valid.length) {
      return { backgroundColor: "transparent", title: { text: "No data", left: "center", textStyle: { color: "#9CA3AF", fontSize: 14 } } } as any;
    }

    // sort and labels (append endDate if provided and not included)
    valid.sort((a, b) => (a.date as Date).getTime() - (b.date as Date).getTime());
    const labelsSet = new Set(valid.map(v => v.rawDate));
    if (endDate && !labelsSet.has(endDate)) labelsSet.add(endDate);
    const labels = Array.from(labelsSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    // cumulative invested (positive values)
    const investedCumulative: number[] = [];
    let cum = 0;
    for (const lbl of labels) {
      const dayFlows = valid.filter(v => v.rawDate === lbl);
      for (const v of dayFlows) {
        if (v.amount < 0) cum += Math.abs(v.amount);
      }
      investedCumulative.push(cum);
    }

    // portfolio value at each label using XIRR rate, compounding investments only
    const portfolioValues: number[] = [];
    for (const lbl of labels) {
      const t = toDate(lbl)!;
      let val = 0;
      if (rate != null && isFinite(rate)) {
        for (const v of valid) {
          const days = ((t.getTime() - (v.date as Date).getTime()) / (1000 * 60 * 60 * 24));
          if (days >= 0) {
            val += Math.abs(v.amount) * Math.pow(1 + rate, days / 365.0);
          }
        }
      }
      portfolioValues.push(val);
    }

    const maxVal = Math.max(...investedCumulative, ...portfolioValues.filter(v => isFinite(v)));
    const axisLabelColor = "#6B7280";
    const axisLineColor = "rgba(107,114,128,0.35)";
    const gridLineColor = "rgba(107,114,128,0.15)";

    return {
      backgroundColor: "transparent",
      grid: { left: "6%", right: "4%", top: "8%", bottom: "12%", containLabel: true },
      title: { text: "Wealth Projection", left: "left", textStyle: { color: "#111827", fontSize: 14, fontWeight: 600 } },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "line", lineStyle: { color: "#6366F1", width: 2, type: "dashed" } },
        formatter: (params: any) => {
          const dateLabel = params?.[0]?.axisValue ?? "";
          const lines = [`<div style=\"font-weight:600; margin-bottom:6px;\">${dateLabel}</div>`];
          params.forEach((p: any) => {
            const color = p.color;
            lines.push(`<div style=\"color:#111827\"><span style=\"display:inline-block;width:10px;height:10px;background:${color};border-radius:50%;margin-right:6px;\"></span>${formatINR(p.data)} (${p.seriesName})</div>`);
          });
          return `<div style=\"padding:8px\">${lines.join("")}</div>`;
        },
        backgroundColor: "rgba(255,255,255,0.96)",
        borderColor: "rgba(0,0,0,0.08)",
        borderWidth: 1,
        textStyle: { color: "#374151", fontSize: 13 },
        extraCssText: "border-radius:8px; box-shadow:0 4px 14px rgba(0,0,0,0.15);"
      },
      legend: { bottom: "0", left: "center", textStyle: { fontSize: 12 }, itemGap: 16 },
      xAxis: { type: "category", boundaryGap: false, data: labels, axisLine: { lineStyle: { color: axisLineColor } }, axisLabel: { color: axisLabelColor }, axisTick: { show: false }, splitLine: { show: false } },
      yAxis: { type: "value", min: 0, max: Math.ceil(maxVal * 1.1), axisLine: { lineStyle: { color: axisLineColor } }, axisLabel: { color: axisLabelColor, formatter: (value: number) => formatINR(value) }, splitLine: { lineStyle: { color: gridLineColor } } },
      series: [
        {
          name: "Investment Amount",
          type: "line",
          smooth: true,
          symbol: "none",
          lineStyle: { width: 3, color: "#10B981" },
          areaStyle: { color: "rgba(16,185,129,0.12)" },
          data: investedCumulative,
        },
        {
          name: "Portfolio Growth (returns)",
          type: "line",
          smooth: true,
          symbol: "none",
          lineStyle: { width: 3, color: "#4F46E5" },
          areaStyle: { color: "rgba(79,70,229,0.12)" },
          data: portfolioValues,
        },
      ],
      animationDuration: 600,
      animationEasing: "cubicOut",
    } as any;
  }, [flows, rate, endDate]);

  return (
    <div className="w-full h-[280px] sm:h-[320px] lg:h-[360px] xl:h-[400px]">
      <ReactECharts option={option} style={{ height: "100%", width: "100%" }} opts={{ renderer: "canvas" }} notMerge={true} lazyUpdate={true} />
    </div>
  );
}