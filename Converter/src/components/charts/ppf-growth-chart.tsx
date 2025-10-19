"use client";
import ReactECharts from "echarts-for-react";
import { useMemo } from "react";

interface PPFGrowthChartProps {
  yearlyData: {
    year: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

export default function PPFGrowthChart({ yearlyData }: PPFGrowthChartProps) {
  const option = useMemo(() => {
    return {
      backgroundColor: "transparent",
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: { data: ["Principal", "Interest"], bottom: 0 },
      grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
      xAxis: { type: "category", data: yearlyData.map((d) => `Year ${d.year}`) },
      yAxis: {
        type: "value",
        axisLabel: { formatter: (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}` },
        splitLine: { lineStyle: { color: "rgba(107,114,128,0.2)" } },
      },
      series: [
        {
          name: "Principal",
          type: "bar",
          stack: "total",
          itemStyle: { color: "#6366F1" },
          data: yearlyData.map((d) => d.principal),
        },
        {
          name: "Interest",
          type: "bar",
          stack: "total",
          itemStyle: { color: "#10B981" },
          data: yearlyData.map((d) => d.interest),
        },
      ],
      animationDuration: 600,
      animationEasing: "cubicOut",
    };
  }, [yearlyData]);

  return <ReactECharts option={option} style={{ height: 320 }} />;
}