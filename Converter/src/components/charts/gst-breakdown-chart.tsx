"use client";
import ReactECharts from "echarts-for-react";

interface Props {
  originalAmount: number;
  gstAmount: number;
}

export default function GSTBreakdownChart({ originalAmount, gstAmount }: Props) {
  const option = {
    tooltip: { trigger: "item" },
    legend: { bottom: 0 },
    series: [
      {
        name: "Breakdown",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: "#fff", borderWidth: 2 },
        label: { show: true, formatter: "{b}: ₹{c}" },
        data: [
          { value: originalAmount, name: "Original Amount" },
          { value: gstAmount, name: "GST Amount" },
        ],
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 320 }} />;
}