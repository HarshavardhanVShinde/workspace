'use client'
import { useEffect } from 'react'
import { captureError } from '@/lib/logger'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    captureError(error, { where: 'global' })
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white/70 dark:bg-white/10 border border-white/30 rounded-2xl p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Something went wrong</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">An unexpected error occurred. You can try reloading the page.</p>
        <button
          onClick={() => reset()}
          className="inline-flex px-6 py-2 rounded-lg bg-brand.indigo text-white hover:bg-brand.indigoLight transition-colors"
        >
          Reload
        </button>
      </div>
    </div>
  )
}