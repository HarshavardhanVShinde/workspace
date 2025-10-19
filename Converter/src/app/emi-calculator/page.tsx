'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Calendar, Percent } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { motion } from 'framer-motion'
import Decimal from 'decimal.js'
import StructuredData from '@/components/seo/structured-data'
import { getWebPageJsonLd, getWebAppJsonLd, siteUrl } from '@/lib/seo'

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState<string>('1000000')
  const [interestRate, setInterestRate] = useState<string>('8.5')
  const [loanTenure, setLoanTenure] = useState<string>('20')
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years')
  const [results, setResults] = useState({
    emi: 0,
    totalInterest: 0,
    totalAmount: 0,
    principalPercentage: 0,
    interestPercentage: 0
  })

  const calculateEMI = () => {
    try {
      const P = new Decimal(loanAmount || '0')
      const R = new Decimal(interestRate || '0').div(100).div(12) // Monthly interest rate
      const N = tenureType === 'years' 
        ? new Decimal(loanTenure || '0').mul(12) 
        : new Decimal(loanTenure || '0') // Total number of months

      if (P.isZero() || R.isZero() || N.isZero()) {
        setResults({
          emi: 0,
          totalInterest: 0,
          totalAmount: 0,
          principalPercentage: 0,
          interestPercentage: 0
        })
        return
      }

      // EMI Formula: P * R * (1+R)^N / ((1+R)^N - 1)
      const onePlusR = R.plus(1)
      const onePlusRPowerN = onePlusR.pow(N.toNumber())
      const emi = P.mul(R).mul(onePlusRPowerN).div(onePlusRPowerN.minus(1))
      
      const totalAmount = emi.mul(N)
      const totalInterest = totalAmount.minus(P)
      
      const principalPercentage = P.div(totalAmount).mul(100)
      const interestPercentage = totalInterest.div(totalAmount).mul(100)

      setResults({
        emi: Math.round(emi.toNumber()),
        totalInterest: Math.round(totalInterest.toNumber()),
        totalAmount: Math.round(totalAmount.toNumber()),
        principalPercentage: Math.round(principalPercentage.toNumber() * 10) / 10,
        interestPercentage: Math.round(interestPercentage.toNumber() * 10) / 10
      })
    } catch (error) {
      console.error('Error calculating EMI:', error)
      setResults({
        emi: 0,
        totalInterest: 0,
        totalAmount: 0,
        principalPercentage: 0,
        interestPercentage: 0
      })
    }
  }

  useEffect(() => {
    calculateEMI()
  }, [loanAmount, interestRate, loanTenure, tenureType])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  // Generate amortization schedule (first 12 months)
  const generateAmortizationSchedule = () => {
    if (results.emi === 0) return []
    
    const schedule = []
    let balance = parseFloat(loanAmount || '0')
    const monthlyRate = parseFloat(interestRate || '0') / 100 / 12
    
    for (let month = 1; month <= Math.min(12, parseFloat(loanTenure || '0') * (tenureType === 'years' ? 12 : 1)); month++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = results.emi - interestPayment
      balance -= principalPayment
      
      schedule.push({
        month,
        emi: results.emi,
        principal: Math.round(principalPayment),
        interest: Math.round(interestPayment),
        balance: Math.round(balance)
      })
    }
    
    return schedule
  }

  const amortizationSchedule = generateAmortizationSchedule()

  return (
    <div className="pt-8 pb-24 max-w-7xl mx-auto px-4 sm:px-8">
      <StructuredData data={getWebPageJsonLd({
        name: 'EMI Calculator',
        description: 'Calculate monthly EMI, total interest, and amortization schedule.',
        url: `${siteUrl}/emi-calculator`,
        breadcrumb: ['Home', 'EMI Calculator']
      })} />
      <StructuredData data={getWebAppJsonLd({
        name: 'EMI Calculator',
        description: 'Web-based EMI calculator to compute monthly payments and amortization.',
        url: `${siteUrl}/emi-calculator`,
        applicationCategory: 'Finance'
      })} />
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="font-extrabold tracking-tight text-4xl sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-4">
          EMI Calculator
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Calculate your Equated Monthly Installment (EMI) for home loans, car loans, or personal loans with detailed amortization schedule.
        </p>
      </div>

      <div className="grid gap-10 xl:grid-cols-3">
        {/* Input Section */}
        <div className="xl:col-span-1">
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Loan Details</h2>

            <div className="space-y-6">
              {/* Loan Amount */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 tracking-wide">
                  <DollarSign className="h-4 w-4 mr-2 text-blue-500" />
                  Loan Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                    placeholder="1000000"
                    min="50000"
                    step="50000"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum ₹50,000</p>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 tracking-wide">
                  <Percent className="h-4 w-4 mr-2 text-blue-500" />
                  Annual Interest Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                    placeholder="8.5"
                    min="1"
                    max="50"
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Typically 6-15% for home loans</p>
              </div>

              {/* Loan Tenure */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 tracking-wide">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  Loan Tenure
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                    placeholder="20"
                    min="1"
                    max={tenureType === 'years' ? '30' : '360'}
                  />
                  <select
                    value={tenureType}
                    onChange={(e) => setTenureType(e.target.value as 'years' | 'months')}
                    className="px-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Max {tenureType === 'years' ? '30 years' : '360 months'}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Results Section */}
        <div className="xl:col-span-2 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Monthly EMI</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(results.emi)}
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Interest</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(results.totalInterest)}
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(results.totalAmount)}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Breakdown Chart */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Principal Amount</span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {results.principalPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-white/30 dark:bg-white/10 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${results.principalPercentage}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Interest</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  {results.interestPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-white/30 dark:bg-white/10 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-red-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${results.interestPercentage}%` }}
                ></div>
              </div>
            </div>
          </GlassCard>

          {/* Amortization Schedule */}
          {amortizationSchedule.length > 0 && (
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Amortization Schedule (First 12 Months)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 font-medium text-gray-700 dark:text-gray-300">Month</th>
                      <th className="text-right py-3 font-medium text-gray-700 dark:text-gray-300">EMI</th>
                      <th className="text-right py-3 font-medium text-gray-700 dark:text-gray-300">Principal</th>
                      <th className="text-right py-3 font-medium text-gray-700 dark:text-gray-300">Interest</th>
                      <th className="text-right py-3 font-medium text-gray-700 dark:text-gray-300">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortizationSchedule.map((row) => (
                      <tr key={row.month} className="border-b border-white/10">
                        <td className="py-3 text-gray-600 dark:text-gray-400">{row.month}</td>
                        <td className="py-3 text-right font-medium text-gray-900 dark:text-white">
                          {formatNumber(row.emi)}
                        </td>
                        <td className="py-3 text-right text-blue-600 dark:text-blue-400">
                          {formatNumber(row.principal)}
                        </td>
                        <td className="py-3 text-right text-red-600 dark:text-red-400">
                          {formatNumber(row.interest)}
                        </td>
                        <td className="py-3 text-right text-gray-700 dark:text-gray-300">
                          {formatNumber(row.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Information Section */}
      <GlassCard className="mt-16 p-8">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">About EMI</h3>
        <div className="grid sm:grid-cols-2 gap-10 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          <div className="space-y-5">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">What is EMI?</h4>
              <p>Equated Monthly Installment (EMI) is a fixed amount paid by a borrower to a lender at a specified date each calendar month.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">EMI Formula</h4>
              <p className="mb-2">EMI = P × R × (1+R)^N / ((1+R)^N - 1)</p>
              <ul className="space-y-1">
                <li>• P = Principal loan amount</li>
                <li>• R = Monthly interest rate</li>
                <li>• N = Number of monthly installments</li>
              </ul>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Factors Affecting EMI</h4>
              <ul className="space-y-2">
                <li><strong>Loan Amount:</strong> Higher amount = Higher EMI</li>
                <li><strong>Interest Rate:</strong> Higher rate = Higher EMI</li>
                <li><strong>Loan Tenure:</strong> Longer tenure = Lower EMI</li>
                <li><strong>Credit Score:</strong> Better score = Lower interest rate</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tips</h4>
              <ul className="space-y-2">
                <li>• Compare interest rates from different lenders</li>
                <li>• Consider making prepayments to reduce interest</li>
                <li>• EMI should not exceed 40% of your monthly income</li>
              </ul>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}