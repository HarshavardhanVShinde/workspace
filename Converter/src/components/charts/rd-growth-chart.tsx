"use client";
import { useMemo } from "react";
import ReactECharts from "echarts-for-react";

interface RDMonthlyPoint {
  month: number;
  principal: number;
  interest: number;
  balance: number;
  altSavings?: number;
  altSip?: number;
}

interface RDGrowthChartProps {
  monthlyData: RDMonthlyPoint[];
}

export default function RDGrowthChart({ monthlyData }: RDGrowthChartProps) {
  const option = useMemo(() => {
    if (!monthlyData || monthlyData.length === 0) {
      return {
        backgroundColor: 'transparent',
        title: { text: 'No data', left: 'center', textStyle: { color: '#9CA3AF', fontSize: 14 } },
      } as any;
    }

    const months = monthlyData.map(d => d.month);
    const principal = monthlyData.map(d => d.principal);
    const interest = monthlyData.map(d => d.interest);
    const balances = monthlyData.map(d => d.balance);
    const altSavings = monthlyData.map(d => d.altSavings ?? null);
    const altSip = monthlyData.map(d => d.altSip ?? null);

    const maxBalance = Math.max(...balances, ...(altSavings.filter(x => x !== null) as number[]), ...(altSip.filter(x => x !== null) as number[]));
    const minBalance = Math.min(...balances);

    const formatCurrencyShort = (value: number) => {
      const abs = Math.abs(value);
      if (abs >= 1e7) return `₹${(value / 1e7).toFixed(1)}Cr`;
      if (abs >= 1e5) return `₹${(value / 1e5).toFixed(1)}L`;
      if (abs >= 1e3) return `₹${(value / 1e3).toFixed(1)}K`;
      return `₹${Math.round(value).toLocaleString('en-IN')}`;
    };

    const axisLabelColor = '#6B7280';
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
          const rdBalance = balances[p.dataIndex];
          const prin = principal[p.dataIndex];
          const intr = interest[p.dataIndex];
          const sav = altSavings[p.dataIndex];
          const sip = altSip[p.dataIndex];
          let html = `<div style="padding:8px;">` +
            `<div style="font-weight:600; margin-bottom:4px;">Month ${p.axisValue}</div>` +
            `<div style="color:#111827;">` +
            `<span style=\"display:inline-block;width:10px;height:10px;background:#4F46E5;border-radius:50%;margin-right:6px;\"></span>` +
            `${formatCurrencyShort(rdBalance)} (RD Balance)` +
            `</div>` +
            `<div style="color:#111827;">` +
            `<span style=\"display:inline-block;width:10px;height:10px;background:#6366F1;border-radius:50%;margin-right:6px;\"></span>` +
            `${formatCurrencyShort(prin)} (Principal)` +
            `</div>` +
            `<div style="color:#111827;">` +
            `<span style=\"display:inline-block;width:10px;height:10px;background:#10B981;border-radius:50%;margin-right:6px;\"></span>` +
            `${formatCurrencyShort(intr)} (Interest)` +
            `</div>`;
          if (sav != null) {
            html += `<div style="color:#111827;">` +
              `<span style=\"display:inline-block;width:10px;height:10px;background:#F59E0B;border-radius:50%;margin-right:6px;\"></span>` +
              `${formatCurrencyShort(sav)} (Savings)` +
              `</div>`;
          }
          if (sip != null) {
            html += `<div style="color:#111827;">` +
              `<span style=\"display:inline-block;width:10px;height:10px;background:#EF4444;border-radius:50%;margin-right:6px;\"></span>` +
              `${formatCurrencyShort(sip)} (SIP)` +
              `</div>`;
          }
          html += `</div>`;
          return html;
        },
        backgroundColor: 'rgba(255,255,255,0.96)',
        borderColor: 'rgba(0,0,0,0.08)',
        borderWidth: 1,
        textStyle: { color: '#374151', fontSize: 13 },
        extraCssText: 'border-radius:8px; box-shadow:0 4px 14px rgba(0,0,0,0.15);'
      },
      legend: {
        bottom: '0',
        left: 'center',
        textStyle: { fontSize: 12 },
        itemGap: 16,
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
        { type: 'slider', start: 0, end: 100, height: 20, bottom: '8%' },
      ],
      series: [
        {
          name: 'Principal',
          type: 'line',
          smooth: true,
          symbol: 'none',
          stack: 'comp',
          lineStyle: { width: 2, color: '#6366F1' },
          areaStyle: {
            color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [ { offset: 0, color: 'rgba(99,102,241,0.35)' }, { offset: 1, color: 'rgba(99,102,241,0.03)' } ] }
          },
          data: principal,
        },
        {
          name: 'Interest',
          type: 'line',
          smooth: true,
          symbol: 'none',
          stack: 'comp',
          lineStyle: { width: 2, color: '#10B981' },
          areaStyle: {
            color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [ { offset: 0, color: 'rgba(16,185,129,0.35)' }, { offset: 1, color: 'rgba(16,185,129,0.03)' } ] }
          },
          data: interest,
        },
        {
          name: 'RD Balance',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          showSymbol: false,
          lineStyle: { width: 3, color: '#4F46E5' },
          data: balances,
        },
        {
          name: 'Savings (alt)',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2, type: 'dashed', color: '#F59E0B' },
          data: altSavings,
        },
        {
          name: 'SIP (alt)',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2, type: 'dashed', color: '#EF4444' },
          data: altSip,
        }
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