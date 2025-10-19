"use client";
import { useMemo } from "react";
import ReactECharts from "echarts-for-react";

interface SWPGrowthChartProps {
  monthlyData: { month: number; balance: number }[];
}

export default function SWPGrowthChart({ monthlyData }: SWPGrowthChartProps) {
  const option = useMemo(() => {
    if (!monthlyData || monthlyData.length === 0) {
      return {
        backgroundColor: 'transparent',
        title: { text: 'No data', left: 'center', textStyle: { color: '#9CA3AF', fontSize: 14 } },
      } as any;
    }

    const months = monthlyData.map((d) => d.month);
    const balances = monthlyData.map((d) => d.balance);

    const maxBalance = Math.max(...balances);
    const minBalance = Math.min(...balances);

    const formatCurrencyShort = (value: number) => {
      const abs = Math.abs(value);
      if (abs >= 1e7) return `₹${(value / 1e7).toFixed(1)}Cr`;
      if (abs >= 1e5) return `₹${(value / 1e5).toFixed(1)}L`;
      if (abs >= 1e3) return `₹${(value / 1e3).toFixed(1)}K`;
      return `₹${Math.round(value).toLocaleString('en-IN')}`;
    };

    const axisLabelColor = '#6B7280'; // gray-500
    const axisLineColor = 'rgba(107,114,128,0.35)';
    const gridLineColor = 'rgba(107,114,128,0.2)';

    return {
      backgroundColor: 'transparent',
      grid: { left: '6%', right: '2%', top: '8%', bottom: '12%', containLabel: true },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line', lineStyle: { color: '#6366F1', width: 2, type: 'dashed' } },
        formatter: (params: any) => {
          const p = params[0];
          return `<div style="padding:8px;">`
            + `<div style="font-weight:600; margin-bottom:4px;">Month ${p.axisValue}</div>`
            + `<div style="color:#111827;">`
            + `<span style=\"display:inline-block;width:10px;height:10px;background:#4F46E5;border-radius:50%;margin-right:6px;\"></span>`
            + `${formatCurrencyShort(p.data)}`
            + `</div>`
            + `</div>`;
        },
        backgroundColor: 'rgba(255,255,255,0.96)',
        borderColor: 'rgba(0,0,0,0.08)',
        borderWidth: 1,
        textStyle: { color: '#374151', fontSize: 13 },
        extraCssText: 'border-radius:8px; box-shadow:0 4px 14px rgba(0,0,0,0.15);'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: months,
        axisLine: { lineStyle: { color: axisLineColor } },
        axisLabel: { color: axisLabelColor },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        min: Math.min(0, Math.floor(minBalance - (maxBalance - minBalance) * 0.05)),
        max: Math.ceil(maxBalance + (maxBalance - minBalance) * 0.05),
        axisLine: { lineStyle: { color: axisLineColor } },
        axisLabel: { color: axisLabelColor, formatter: (value: number) => formatCurrencyShort(value) },
        splitLine: { lineStyle: { color: gridLineColor } },
      },
      dataZoom: [
        { type: 'inside', start: 0, end: 100 },
        { type: 'slider', start: 0, end: 100, height: 20, bottom: '2%' },
      ],
      series: [
        {
          name: 'Balance',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: { width: 3, color: '#4F46E5' },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(79,70,229,0.35)' },
                { offset: 1, color: 'rgba(79,70,229,0.02)' },
              ],
            },
          },
          emphasis: {
            focus: 'series',
          },
          markLine: {
            symbol: 'none',
            data: [{ yAxis: 0, name: 'Zero' }],
            lineStyle: { color: 'rgba(107,114,128,0.6)', type: 'dashed' },
            label: { show: true, color: axisLabelColor },
          },
          data: balances,
        },
      ],
      animationDuration: 600,
      animationEasing: 'cubicOut',
    };
  }, [monthlyData]);

  return (
    <div className="w-full h-[280px] sm:h-[320px] lg:h-[360px] xl:h-[400px]">
      <ReactECharts 
        option={option} 
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'canvas' }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
}