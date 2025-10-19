'use client'

import { useMemo, useState } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import PageHeading from '@/components/ui/page-heading'
import AgeProgressBars from '@/components/ui/age-progress-bars'
import ClientOnly from '@/components/ui/client-only'
import dynamic from 'next/dynamic'

const AgeProgressChart = dynamic(() => import('@/components/charts/age-progress-chart'), { ssr: false })

function daysBetween(a: Date, b: Date): number {
  const ms = 1000 * 60 * 60 * 24
  const ad = new Date(a.getFullYear(), a.getMonth(), a.getDate())
  const bd = new Date(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.floor((bd.getTime() - ad.getTime()) / ms)
}

function diffYMD(birth: Date, asOf: Date) {
  let years = asOf.getFullYear() - birth.getFullYear()
  let months = asOf.getMonth() - birth.getMonth()
  let days = asOf.getDate() - birth.getDate()

  if (days < 0) {
    const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0)
    days += prevMonth.getDate()
    months -= 1
  }
  if (months < 0) {
    months += 12
    years -= 1
  }
  return { years, months, days }
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>('')
  const [computed, setComputed] = useState<null | {
    ymd: { years: number; months: number; days: number }
    totalMonths: number
    remainderDays: number
    weeks: number
    weekDays: number
    totalDays: number
    totalHours: number
    totalMinutes: number
    totalSeconds: number
    sinceLastBirthdayDays: number
    untilNextBirthdayDays: number
  }>(null)

  const today = useMemo(() => new Date(), [])

  const calculate = () => {
    if (!birthDate) return
    const birth = new Date(birthDate)
    const asOf = new Date()

    const ymd = diffYMD(birth, asOf)
    const totalDays = daysBetween(birth, asOf)
    const totalMonths = ymd.years * 12 + ymd.months
    const remainderDays = ymd.days

    const weeks = Math.floor(totalDays / 7)
    const weekDays = totalDays % 7

    const totalHours = totalDays * 24
    const totalMinutes = totalHours * 60
    const totalSeconds = totalMinutes * 60

    let lastBirthday = new Date(asOf.getFullYear(), birth.getMonth(), birth.getDate())
    if (asOf < lastBirthday) {
      lastBirthday = new Date(asOf.getFullYear() - 1, birth.getMonth(), birth.getDate())
    }
    const nextBirthday = new Date(lastBirthday.getFullYear() + 1, birth.getMonth(), birth.getDate())

    const sinceLastBirthdayDays = daysBetween(lastBirthday, asOf)
    const untilNextBirthdayDays = Math.max(0, daysBetween(asOf, nextBirthday))

    setComputed({
      ymd,
      totalMonths,
      remainderDays,
      weeks,
      weekDays,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      sinceLastBirthdayDays,
      untilNextBirthdayDays,
    })
  }

  return (
    <div className="pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeading title="Age Calculator" />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Inputs */}
        <GlassCard className="p-6 sm:p-8 border-2 border-white/50 dark:border-white/20 bg-gradient-to-br from-white/90 to-white/70 dark:from-white/10 dark:to-white/5 backdrop-blur-xl shadow-xl">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Enter Details</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Date of Birth</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
              />
              <p className="mt-2 text-xs text-gray-500">Age is calculated as of today ({today.toLocaleDateString()}).</p>
            </div>
            <button
              onClick={calculate}
              className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-soft font-medium"
            >
              Calculate Age
            </button>
          </div>
        </GlassCard>

        {/* Right: Chart */}
        <GlassCard className="p-6 sm:p-8 border-2 border-white/50 dark:border-white/20 bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl shadow-xl">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Progress to Next Birthday</h2>
          {computed ? (
            <AgeProgressBars pastDays={computed.sinceLastBirthdayDays} remainingDays={computed.untilNextBirthdayDays} />
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">Enter your birth date and click Calculate to see progress.</p>
          )}
        </GlassCard>
      </div>

      {/* Breakdown */}
      <GlassCard className="mt-8 p-6 border-2 border-white/50 dark:border-white/20 bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Detailed Age</h2>
        {computed ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-700 dark:text-gray-300">Age:</p>
              <ul className="text-sm sm:text-base text-gray-900 dark:text-white space-y-1">
                <li>{computed.ymd.years} years {computed.ymd.months} months {computed.ymd.days} days</li>
                <li>or {computed.totalMonths} months {computed.remainderDays} days</li>
                <li>or {computed.weeks} weeks {computed.weekDays} days</li>
                <li>or {computed.totalDays.toLocaleString('en-IN')} days</li>
                <li>or {computed.totalHours.toLocaleString('en-IN')} hours</li>
                <li>or {computed.totalMinutes.toLocaleString('en-IN')} minutes</li>
                <li>or {computed.totalSeconds.toLocaleString('en-IN')} seconds</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-700 dark:text-gray-300">Birthday Timeline:</p>
              <ul className="text-sm sm:text-base text-gray-900 dark:text-white space-y-1">
                <li>{computed.sinceLastBirthdayDays} days since last birthday</li>
                <li>{computed.untilNextBirthdayDays} days until next birthday</li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Results will appear here after calculation.</p>
        )}
      </GlassCard>
    </div>
  )
}