"use client";

import React from "react";

type Props = {
  pastDays: number; // days since last birthday
  remainingDays: number; // days until next birthday
};

export default function AgeProgressBars({ pastDays, remainingDays }: Props) {
  const total = Math.max(1, pastDays + remainingDays);
  const pastPct = Math.round((pastDays / total) * 1000) / 10; // one decimal
  const remainingPct = Math.round((remainingDays / total) * 1000) / 10;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Since last birthday</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{pastDays.toLocaleString("en-IN")} days • {pastPct}%</p>
          </div>
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{pastPct}%</div>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200/70 dark:bg-gray-800/60 overflow-hidden" aria-label="Days since last birthday" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pastPct} role="progressbar">
          <div className="h-full transition-all duration-700 ease-out rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500" style={{ width: `${pastPct}%` }} />
        </div>
      </div>

      <div>
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Until next birthday</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{remainingDays.toLocaleString("en-IN")} days • {remainingPct}%</p>
          </div>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{remainingPct}%</div>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200/70 dark:bg-gray-800/60 overflow-hidden" aria-label="Days until next birthday" aria-valuemin={0} aria-valuemax={100} aria-valuenow={remainingPct} role="progressbar">
          <div className="h-full transition-all duration-700 ease-out rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" style={{ width: `${remainingPct}%` }} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
          <p className="text-gray-500 dark:text-gray-400">Total days in this cycle</p>
          <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{total.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
          <p className="text-gray-500 dark:text-gray-400">Progress to next birthday</p>
          <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{pastPct}%</p>
        </div>
      </div>
    </div>
  );
}