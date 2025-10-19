'use client'

import { useState, useEffect, useMemo } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import Select from 'react-select'
import PageHeader from '@/components/ui/page-header'

// Types for ExchangeRate-API response
type ExchangeResponse = {
  result: 'success' | 'error'
  base: string
  rates: Record<string, number>
  time_last_update_utc?: string
  time_next_update_utc?: string
  cached_at?: string
}

type Option = { value: string; label: string }

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('100')
  const [fromCurrency, setFromCurrency] = useState<string>('USD')
  const [toCurrency, setToCurrency] = useState<string>('INR')
  const [convertedAmount, setConvertedAmount] = useState<number>(0)
  const [exchangeRate, setExchangeRate] = useState<number>(0)
  const [rates, setRates] = useState<Record<string, number>>({})
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [nextUpdate, setNextUpdate] = useState<string>('')
  const [cachedAt, setCachedAt] = useState<string>('')
  const [loadingRates, setLoadingRates] = useState<boolean>(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Fetch exchange rates once (cached for 12 hours by the API route)
  useEffect(() => {
    let cancelled = false
    async function loadRates() {
      setLoadingRates(true)
      setFetchError(null)
      try {
        const res = await fetch('/api/exchange', {
          headers: { Accept: 'application/json' },
          cache: 'force-cache',
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: ExchangeResponse = await res.json()
        if (!cancelled && data?.rates && data.result === 'success') {
          setRates(data.rates)
          setLastUpdate(data.time_last_update_utc || '')
          setNextUpdate(data.time_next_update_utc || '')
          setCachedAt(data.cached_at || '')
          // Ensure defaults exist in list
          setFromCurrency((prev) => prev in data.rates ? prev : data.base || 'USD')
          setToCurrency((prev) => prev in data.rates ? prev : 'INR')
        }
      } catch (e) {
        setFetchError('Failed to load live rates. Please try again later.')
      } finally {
        if (!cancelled) setLoadingRates(false)
      }
    }
    loadRates()
    return () => { cancelled = true }
  }, [])

  const currencyList = useMemo(() => Object.keys(rates).sort(), [rates])

  const displayNames = useMemo(() => {
    try {
      return new Intl.DisplayNames(['en'], { type: 'currency' })
    } catch {
      return null as any
    }
  }, [])

  const currencyOptions = useMemo<Option[]>(() => {
    return currencyList.map((code) => {
      const name = (displayNames && typeof (displayNames as any).of === 'function') ? (displayNames as any).of(code) : undefined
      return { value: code, label: `${name || code} (${code})` }
    })
  }, [currencyList, displayNames])

  const selectStyles = useMemo(() => {
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
    return {
      control: (base: any, state: any) => ({
        ...base,
        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 12,
        minHeight: 48,
        boxShadow: state.isFocused ? '0 0 0 2px #F59E0B55' : 'none',
        ':hover': { borderColor: 'rgba(255,255,255,0.5)' },
      }),
      menu: (base: any) => ({
        ...base,
        backgroundColor: isDark ? 'rgba(24,24,27,0.95)' : 'rgba(255,255,255,0.95)',
        borderRadius: 12,
        overflow: 'hidden',
        zIndex: 9999,
      }),
      option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isFocused
          ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.04)')
          : 'transparent',
        color: isDark ? '#fff' : '#111827',
        padding: '12px 16px',
      }),
      singleValue: (base: any) => ({ ...base, color: isDark ? '#fff' : '#111827' }),
      input: (base: any) => ({ ...base, color: isDark ? '#fff' : '#111827' }),
      placeholder: (base: any) => ({ ...base, color: isDark ? '#9CA3AF' : '#6B7280' }),
    }
  }, [])

  const rateFor = (code: string) => rates[code] ?? 0

  const convertCurrency = () => {
    const inputAmount = parseFloat(amount) || 0

    if (inputAmount === 0 || fromCurrency === toCurrency) {
      setConvertedAmount(inputAmount)
      setExchangeRate(1)
      return
    }

    // Convert from source currency to USD, then to target currency using USD-based table
    const amountInUSD = inputAmount / rateFor(fromCurrency)
    const finalAmount = amountInUSD * rateFor(toCurrency)
    const rate = rateFor(toCurrency) / rateFor(fromCurrency)

    setConvertedAmount(finalAmount)
    setExchangeRate(rate)
  }

  useEffect(() => {
    if (Object.keys(rates).length > 0) convertCurrency()
  }, [amount, fromCurrency, toCurrency, rates])

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const safeFormatCurrency = (value: number, currencyCode: string) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    } catch {
      // Fallback for non-standard codes
      return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ` ${currencyCode}`
    }
  }

  const quickAmounts = [1, 5, 10, 100]

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="h-4 bg-white/20 rounded w-1/4"></div>
      <div className="h-12 bg-white/20 rounded-xl"></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-16 bg-white/20 rounded-xl"></div>
        <div className="h-16 bg-white/20 rounded-xl"></div>
        <div className="h-16 bg-white/20 rounded-xl"></div>
      </div>
      <div className="h-24 bg-white/20 rounded-xl"></div>
    </div>
  )

  return (
    <div className="min-h-screen pt-4 sm:pt-8 pb-8 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader 
          title="Currency Converter" 
          description="Convert between world currencies with live rates cached every 12 hours." 
        />

        <div className="mt-8 grid gap-6 lg:gap-10 lg:grid-cols-3">
          {/* Main Converter Section */}
          <div className="lg:col-span-2">
            <GlassCard className="p-4 sm:p-6 lg:p-8">
              {loadingRates ? (
                <LoadingSkeleton />
              ) : (
                <div className="space-y-6">
                  {/* Amount Input */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block tracking-wide">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-3 text-lg bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                      placeholder="100"
                      min="0"
                      step="0.01"
                      disabled={!!fetchError}
                    />
                  </div>

                  {/* Currency Selection - Mobile Optimized */}
                  <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-end">
                    {/* From Currency */}
                    <div className="sm:col-span-1">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block tracking-wide">
                        From
                      </label>
                      <Select
                        value={currencyOptions.find((o) => o.value === fromCurrency) ?? null}
                        onChange={(opt) => setFromCurrency((opt as Option)?.value)}
                        options={currencyOptions}
                        isDisabled={!!fetchError}
                        isSearchable
                        styles={selectStyles}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Select currency"
                        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                        menuPosition="fixed"
                      />
                    </div>

                    {/* Swap Button - Mobile Friendly */}
                    <div className="flex justify-center sm:col-span-1">
                      <button
                        onClick={swapCurrencies}
                        className="w-full sm:w-auto px-6 py-3 bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 rounded-xl transition-all border border-white/30 shadow-soft text-sm font-medium touch-manipulation"
                        title="Swap currencies"
                        disabled={!!fetchError}
                      >
                        ⇅ Swap
                      </button>
                    </div>

                    {/* To Currency */}
                    <div className="sm:col-span-1">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block tracking-wide">
                        To
                      </label>
                      <Select
                        value={currencyOptions.find((o) => o.value === toCurrency) ?? null}
                        onChange={(opt) => setToCurrency((opt as Option)?.value)}
                        options={currencyOptions}
                        isDisabled={!!fetchError}
                        isSearchable
                        styles={selectStyles}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Select currency"
                        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                        menuPosition="fixed"
                      />
                    </div>
                  </div>

                  {/* Result - Enhanced Mobile Layout */}
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 dark:from-yellow-500/20 dark:to-orange-500/20 rounded-xl p-4 sm:p-6 border border-white/30">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Converted Amount</p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 break-words">
                        {safeFormatCurrency(convertedAmount, toCurrency)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        1 {fromCurrency} = {exchangeRate ? exchangeRate.toFixed(6) : '—'} {toCurrency}
                      </p>
                    </div>
                  </div>

                  {/* Quick Conversion - Mobile Grid */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Conversions</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {quickAmounts.map((quickAmount) => {
                        const converted = rateFor(fromCurrency) && rateFor(toCurrency)
                          ? (quickAmount / rateFor(fromCurrency)) * rateFor(toCurrency)
                          : 0
                        return (
                          <button
                            key={quickAmount}
                            onClick={() => setAmount(quickAmount.toString())}
                            className="p-3 bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 rounded-xl transition-all border border-white/30 text-center touch-manipulation active:scale-95"
                            disabled={!!fetchError}
                          >
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {quickAmount} {fromCurrency}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ≈ {converted.toFixed(2)} {toCurrency}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Data meta & disclaimer */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 space-y-1">
                    {lastUpdate && (
                      <p>
                        Last updated: {new Date(lastUpdate).toLocaleString()}
                      </p>
                    )}
                    {nextUpdate && (
                      <p>
                        Next update: {new Date(nextUpdate).toLocaleString()}
                      </p>
                    )}
                    {cachedAt && (
                      <p>
                        Cached at: {new Date(cachedAt).toLocaleString()}
                      </p>
                    )}
                    <p className="mt-2 text-gray-400 dark:text-gray-500">
                      Rates are for informational purposes only and may not be suitable for actual financial transactions.
                    </p>
                  </div>

                  {/* Error state */}
                  {fetchError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <div className="text-sm text-red-600 dark:text-red-400">{fetchError}</div>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Side Information Panel - Mobile Responsive */}
          <div className="lg:col-span-1">
            <GlassCard className="p-4 sm:p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exchange Rate Info</h3>
                
                {!loadingRates && !fetchError && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-white/20">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Base Currency</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">USD</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-white/20">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Currencies</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{currencyList.length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-white/20">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Cache Duration</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">12 hours</span>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        💡 Rates are cached for optimal performance on Vercel. The API is only called once every 12 hours.
                      </p>
                    </div>
                  </div>
                )}
                
                {loadingRates && (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-white/20 rounded w-3/4"></div>
                    <div className="h-4 bg-white/20 rounded w-1/2"></div>
                    <div className="h-4 bg-white/20 rounded w-2/3"></div>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}