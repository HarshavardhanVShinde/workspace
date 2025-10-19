"use client";
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

interface EPFGrowthChartProps {
  yearlyData: {
    year: number;
    contribution: number;
    interest: number;
    balance: number;
  }[];
}

export default function EPFGrowthChart({ yearlyData }: EPFGrowthChartProps) {
  const option = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Contribution', 'Interest']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: yearlyData.map(d => d.year)
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '₹{value}'
        }
      },
      series: [
        {
          name: 'Contribution',
          type: 'bar',
          stack: 'total',
          label: {
            show: false,
          },
          emphasis: {
            focus: 'series'
          },
          data: yearlyData.map(d => d.contribution)
        },
        {
          name: 'Interest',
          type: 'bar',
          stack: 'total',
          label: {
            show: false,
          },
          emphasis: {
            focus: 'series'
          },
          data: yearlyData.map(d => d.interest)
        }
      ]
    };
  }, [yearlyData]);

  return <ReactECharts option={option} style={{ height: 400 }} />;
}