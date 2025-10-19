"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";

// Lazy-load the ECharts React wrapper to avoid SSR issues and reduce TTI
const EChartsReact = dynamic(() => import("echarts-for-react"), { ssr: false });

export type SipFrequency = "monthly" | "quarterly" | "yearly" | "weekly" | "daily";

export interface SipGrowthChartProps {
  lumpsum: number; // one-time investment amount (₹)
  contribution: number; // periodic investment amount (₹)
  annualRatePercent: number; // expected annual return (%)
  years: number; // investment duration in years
  frequency: SipFrequency; // compounding & contribution frequency
}

function periodsPerYear(freq: SipFrequency): number {
  switch (freq) {
    case "monthly": return 12;
    case "quarterly": return 4;
    case "yearly": return 1;
    case "weekly": return 52;
    case "daily": return 365;
    default: return 12;
  }
}

export default function SipGrowthChart({ lumpsum, contribution, annualRatePercent, years, frequency }: SipGrowthChartProps) {
  const option = useMemo(() => {
    const m = periodsPerYear(frequency);
    const i = (annualRatePercent || 0) / 100 / m; // periodic rate
    const n = Math.max(0, Math.round((years || 0) * m));

    // Calculate final values
    let fv = 0;
    if (n > 0 && i > 0) {
      const sip_fv = contribution * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
      const lumpsum_fv = lumpsum * Math.pow(1 + i, n);
      fv = sip_fv + lumpsum_fv;
    } else if (n > 0) {
      fv = (contribution * n) + lumpsum;
    }
    
    const totalInvested = (contribution * n) + lumpsum;
    const totalGains = Math.max(0, fv - totalInvested);

    // Format currency for display
    const formatCurrency = (value: number) => {
      if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
      if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
      if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
      return `₹${Math.round(value)}`;
    };

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: function(params: any) {
          const percentage = params.percent;
          const value = params.value;
          return `
            <div style="padding: 8px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
              <div style="color: ${params.color};">
                <span style="display: inline-block; width: 10px; height: 10px; background: ${params.color}; border-radius: 50%; margin-right: 6px;"></span>
                ${formatCurrency(value)} (${percentage}%)
              </div>
            </div>
          `;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        textStyle: {
          color: '#374151',
          fontSize: 13
        },
        extraCssText: 'border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);'
      },
      legend: {
        orient: 'horizontal',
        bottom: '5%',
        left: 'center',
        textStyle: {
          fontSize: 13,
          fontWeight: 500
        },
        itemGap: 20,
        icon: 'circle',
        itemWidth: 12,
        itemHeight: 12
      },
      series: [
        {
          name: 'SIP Investment Breakdown',
          type: 'pie',
          radius: ['45%', '75%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 3
          },
          label: {
            show: false,
            position: 'center'
          },
          labelLine: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
              formatter: function(params: any) {
                return `${params.name}\n${params.percent}%`;
              }
            }
          },
          data: [
            {
              value: totalInvested,
              name: 'Total Invested',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 1, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#6366f1' },
                    { offset: 1, color: '#4f46e5' }
                  ]
                }
              }
            },
            {
              value: totalGains,
              name: 'Total Gains',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 1, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#10B981' },
                    { offset: 1, color: '#059669' }
                  ]
                }
              }
            }
          ],
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx: number) {
            return Math.random() * 200;
          }
        }
      ]
    };
  }, [lumpsum, contribution, annualRatePercent, years, frequency]);

  return (
    <div className="w-full h-[280px] sm:h-[320px] lg:h-[360px] xl:h-[400px]">
      <EChartsReact 
        option={option} 
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}