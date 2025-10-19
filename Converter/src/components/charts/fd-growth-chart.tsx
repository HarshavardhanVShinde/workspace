"use client";
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

interface FDGrowthChartProps {
  yearlyData: {
    year: number;
    balance: number;
  }[];
}

export default function FDGrowthChart({ yearlyData }: FDGrowthChartProps) {
  const option = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: yearlyData.map(d => `Year ${d.year}`),
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '₹{value}'
        }
      },
      series: [
        {
          name: 'Balance',
          type: 'line',
          data: yearlyData.map(d => d.balance),
          smooth: true,
        },
      ],
    };
  }, [yearlyData]);

  return <ReactECharts option={option} style={{ height: 300 }} />;
}