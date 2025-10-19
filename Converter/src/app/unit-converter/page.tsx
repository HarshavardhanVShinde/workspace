'use client'

import { useState } from 'react'
import { Ruler } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

const units = {
  length: {
    m: { name: 'Meter', factor: 1 },
    cm: { name: 'Centimeter', factor: 0.01 },
    mm: { name: 'Millimeter', factor: 0.001 },
    km: { name: 'Kilometer', factor: 1000 },
    in: { name: 'Inch', factor: 0.0254 },
    ft: { name: 'Foot', factor: 0.3048 },
  }
}

export default function UnitConverter() {
  const [value, setValue] = useState<string>('1')
  const [fromUnit, setFromUnit] = useState('m')
  const [toUnit, setToUnit] = useState('cm')

  const convert = () => {
    const inputValue = parseFloat(value || '0')
    const fromFactor = (units.length as any)[fromUnit].factor
    const toFactor = (units.length as any)[toUnit].factor
    
    const meters = inputValue * fromFactor
    const result = meters / toFactor
    
    return result.toFixed(6).replace(/\.?0+$/, '')
  }

  return (
    <div className="pt-8 pb-24 max-w-4xl mx-auto px-4 sm:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-soft text-white">
          <Ruler className="h-10 w-10" />
        </div>
        <h1 className="font-extrabold tracking-tight text-4xl sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-4">
          Unit Converter
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Convert between different units of length measurement.
        </p>
      </div>

      <GlassCard className="p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Value
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
              placeholder="Enter value"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                From
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
              >
                {Object.entries(units.length).map(([key, unit]) => (
                  <option key={key} value={key}>{unit.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                To
              </label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
              >
                {Object.entries(units.length).map(([key, unit]) => (
                  <option key={key} value={key}>{unit.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl border border-white/20">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {value} {(units.length as any)[fromUnit].name} = {convert()} {(units.length as any)[toUnit].name}
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}