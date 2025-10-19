"use client";
import ReactECharts from "echarts-for-react";
import { useMemo } from "react";

interface FlowPoint { date: string; amount: number }

interface Props {
  flows: FlowPoint[]; // raw flows with ISO date and amount
  rate: number | null; // annual rate
  chartType?: "line" | "bar"; // rendering type for cash flow series
}

function toDate(d: string) {
  const v = new Date(d);
  return isNaN(v.getTime()) ? null : v;
}

function formatCurrencyShort(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e9) return sign + "₹" + (abs / 1e9).toFixed(2) + "B";
  if (abs >= 1e6) return sign + "₹" + (abs / 1e6).toFixed(2) + "M";
  if (abs >= 1e3) return sign + "₹" + (abs / 1e3).toFixed(2) + "K";
  return sign + "₹" + Math.round(abs).toLocaleString("en-IN");
}

export default function XIRRPerformanceChart({ flows, rate, chartType = "line" }: Props) {
  const option = useMemo(() => {
    const valid = flows
      .map(f => ({ date: toDate(f.date), amount: f.amount, rawDate: f.date }))
      .filter(f => f.date);
    if (!valid.length) {
      return { backgroundColor: "transparent", title: { text: "No data", left: "center", textStyle: { color: "#9CA3AF", fontSize: 14 } } } as any;
    }

    // Sort by date ascending
    valid.sort((a, b) => (a.date as Date).getTime() - (b.date as Date).getTime());

    // Aggregate cash flows per date label
    const labels = Array.from(new Set(valid.map(v => v.rawDate)));
    const cashValues = labels.map(lbl => valid.filter(v => v.rawDate === lbl).reduce((s, v) => s + v.amount, 0));

    // Compute portfolio value at each date using XIRR if available
    const portfolioValues: number[] = [];
    for (let j = 0; j < labels.length; j++) {
      const t = toDate(labels[j])!;
      let val = 0;
      if (rate != null && isFinite(rate)) {
        for (const v of valid) {
          const days = ((t.getTime() - (v.date as Date).getTime()) / (1000 * 60 * 60 * 24));
          if (days >= 0) {
            val += v.amount * Math.pow(1 + rate, days / 365.0);
          }
        }
      }
      portfolioValues.push(val);
    }

    const maxVal = Math.max(...cashValues, ...portfolioValues.filter(v => isFinite(v)));
    const minVal = Math.min(...cashValues, ...portfolioValues.filter(v => isFinite(v)));

    const axisLabelColor = "#6B7280";
    const axisLineColor = "rgba(107,114,128,0.35)";
    const gridLineColor = "rgba(107,114,128,0.2)";

    return {
      backgroundColor: "transparent",
      grid: { left: "6%", right: "2%", top: "8%", bottom: "12%", containLabel: true },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "line", lineStyle: { color: "#6366F1", width: 2, type: "dashed" } },
        formatter: (params: any) => {
          const lines: string[] = [];
          const dateLabel = params?.[0]?.axisValue ?? "";
          lines.push(`<div style="font-weight:600; margin-bottom:4px;">${dateLabel}</div>`);
          params.forEach((p: any) => {
            const color = p.color;
            lines.push(`<div style="color:#111827;"><span style=\"display:inline-block;width:10px;height:10px;background:${color};border-radius:50%;margin-right:6px;\"></span>${formatCurrencyShort(p.data)} (${p.seriesName})</div>`);
          });
          return `<div style="padding:8px;">${lines.join("")}</div>`;
        },
        backgroundColor: "rgba(255,255,255,0.96)",
        borderColor: "rgba(0,0,0,0.08)",
        borderWidth: 1,
        textStyle: { color: "#374151", fontSize: 13 },
        extraCssText: "border-radius:8px; box-shadow:0 4px 14px rgba(0,0,0,0.15);"
      },
      legend: { bottom: "0", left: "center", textStyle: { fontSize: 12 }, itemGap: 16 },
      xAxis: { type: "category", boundaryGap: chartType === "bar", data: labels, axisLine: { lineStyle: { color: axisLineColor } }, axisLabel: { color: axisLabelColor }, axisTick: { show: false }, splitLine: { show: false } },
      yAxis: { type: "value", min: Math.min(0, Math.floor(minVal - (maxVal - minVal) * 0.05)), max: Math.ceil(maxVal + (maxVal - minVal) * 0.05), axisLine: { lineStyle: { color: axisLineColor } }, axisLabel: { color: axisLabelColor, formatter: (value: number) => formatCurrencyShort(value) }, splitLine: { lineStyle: { color: gridLineColor } } },
      dataZoom: [ { type: "inside", start: 0, end: 100 }, { type: "slider", start: 0, end: 100, height: 20, bottom: "8%" } ],
      series: [
        {
          name: "Cash Flow",
          type: chartType,
          smooth: chartType === "line",
          symbol: chartType === "line" ? "circle" : undefined,
          symbolSize: chartType === "line" ? 4 : undefined,
          lineStyle: chartType === "line" ? { width: 2, color: "#EF4444" } : undefined,
          itemStyle: chartType === "bar" ? { color: (p: any) => (p.data >= 0 ? "#10B981" : "#EF4444") } : undefined,
          data: cashValues,
        },
        {
          name: "Portfolio Value",
          type: "line",
          smooth: true,
          symbol: "none",
          lineStyle: { width: 3, color: "#4F46E5" },
          areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [ { offset: 0, color: "rgba(79,70,229,0.20)" }, { offset: 1, color: "rgba(79,70,229,0.02)" } ] } },
          data: portfolioValues,
        },
      ],
      animationDuration: 600,
      animationEasing: "cubicOut",
    } as any;
  }, [flows, rate, chartType]);

  return (
    <div className="w-full h-[280px] sm:h-[320px] lg:h-[360px] xl:h-[400px]">
      <ReactECharts option={option} style={{ height: "100%", width: "100%" }} opts={{ renderer: "canvas" }} notMerge={true} lazyUpdate={true} />
    </div>
  );
}