"use client";
import ReactECharts from "echarts-for-react";
import { useMemo } from "react";

interface AgeProgressChartProps {
  pastDays: number;
  remainingDays: number;
}

export default function AgeProgressChart({ pastDays, remainingDays }: AgeProgressChartProps) {
  const option = useMemo(() => {
    const total = Math.max(1, pastDays + remainingDays);
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        formatter: (p: any) => {
          const pct = ((p.value / total) * 100).toFixed(1);
          return `${p.name}: ${p.value} days (${pct}%)`;
        },
        backgroundColor: "rgba(255,255,255,0.95)",
        borderColor: "rgba(0,0,0,0.08)",
        borderWidth: 1,
        textStyle: { color: "#374151", fontSize: 13 },
        extraCssText: "border-radius:8px; box-shadow:0 4px 14px rgba(0,0,0,0.15);",
      },
      legend: {
        bottom: "4%",
        itemWidth: 12,
        itemHeight: 12,
        textStyle: { fontSize: 12 },
      },
      series: [
        {
          name: "Current Year Progress",
          type: "pie",
          radius: ["45%", "75%"],
          center: ["50%", "45%"],
          avoidLabelOverlap: true,
          itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 3 },
          label: { show: false, position: "center" },
          labelLine: { show: false },
          data: [
            {
              value: pastDays,
              name: "Days since last birthday",
              itemStyle: {
                color: {
                  type: "linear",
                  x: 0, y: 0, x2: 1, y2: 1,
                  colorStops: [
                    { offset: 0, color: "#6366F1" },
                    { offset: 1, color: "#4F46E5" },
                  ],
                },
              },
            },
            {
              value: remainingDays,
              name: "Days until next birthday",
              itemStyle: {
                color: {
                  type: "linear",
                  x: 0, y: 0, x2: 1, y2: 1,
                  colorStops: [
                    { offset: 0, color: "#10B981" },
                    { offset: 1, color: "#059669" },
                  ],
                },
              },
            },
          ],
          animationType: "scale",
          animationEasing: "elasticOut",
        },
      ],
    };
  }, [pastDays, remainingDays]);

  return (
    <div className="w-full h-[260px] sm:h-[320px] lg:h-[360px]">
      <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}