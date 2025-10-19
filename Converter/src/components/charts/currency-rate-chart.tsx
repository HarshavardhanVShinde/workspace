"use client";
import ReactECharts from "echarts-for-react";
import { useMemo } from "react";

export interface RatePoint { date: string; rate: number }

interface Props {
  points: RatePoint[]; // sorted by date asc
  from: string;
  to: string;
}

export default function CurrencyRateChart({ points, from, to }: Props) {
  const option = useMemo(() => {
    if (!points || points.length === 0) {
      return {
        backgroundColor: "transparent",
        title: { text: "No history available", left: "center", textStyle: { color: "#9CA3AF", fontSize: 14 } },
      } as any;
    }

    const labels = points.map(p => p.date);
    const values = points.map(p => p.rate);

    const axisLabelColor = "#6B7280";
    const axisLineColor = "rgba(107,114,128,0.35)";
    const gridLineColor = "rgba(107,114,128,0.2)";

    return {
      backgroundColor: "transparent",
      grid: { left: "6%", right: "2%", top: "8%", bottom: "12%", containLabel: true },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "line", lineStyle: { color: "#F59E0B", width: 2, type: "dashed" } },
        formatter: (params: any) => {
          const p = params?.[0];
          const dateLabel = p?.axisValue ?? "";
          const val = p?.data;
          return `<div style=\"padding:8px\"><div style=\"font-weight:600; margin-bottom:4px\">${dateLabel}</div><div style=\"color:#111827\">Rate: ${val}</div></div>`;
        },
        backgroundColor: "rgba(255,255,255,0.96)",
        borderColor: "rgba(0,0,0,0.08)",
        borderWidth: 1,
        textStyle: { color: "#374151", fontSize: 13 },
        extraCssText: "border-radius:8px; box-shadow:0 4px 14px rgba(0,0,0,0.15);",
      },
      legend: { bottom: "0", left: "center", textStyle: { fontSize: 12 }, data: ["Exchange Rate"] },
      xAxis: { type: "category", boundaryGap: false, data: labels, axisLine: { lineStyle: { color: axisLineColor } }, axisLabel: { color: axisLabelColor }, axisTick: { show: false } },
      yAxis: { type: "value", axisLine: { lineStyle: { color: axisLineColor } }, axisLabel: { color: axisLabelColor }, splitLine: { lineStyle: { color: gridLineColor } } },
      dataZoom: [ { type: "inside", start: 0, end: 100 }, { type: "slider", start: 0, end: 100, height: 20, bottom: "8%" } ],
      series: [
        {
          name: "Exchange Rate",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 4,
          lineStyle: { width: 3, color: "#F59E0B" },
          areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [ { offset: 0, color: "rgba(245,158,11,0.20)" }, { offset: 1, color: "rgba(245,158,11,0.02)" } ] } },
          data: values,
        },
      ],
      animationDuration: 600,
      animationEasing: "cubicOut",
    } as any;
  }, [points, from, to]);

  return (
    <div className="w-full h-[280px] sm:h-[320px] lg:h-[360px] xl:h-[400px]">
      <ReactECharts option={option} style={{ height: "100%", width: "100%" }} opts={{ renderer: "canvas" }} notMerge={true} lazyUpdate={true} />
    </div>
  );
}