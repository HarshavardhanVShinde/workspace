export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white/70 dark:bg-white/10 border border-white/30 rounded-2xl p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Page not found</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="mt-4 space-y-2">
          <a href="/" className="text-sm underline text-blue-700 dark:text-blue-400">Go to Home</a>
          <div className="text-xs text-gray-600 dark:text-gray-400">Popular calculators:</div>
          <div className="flex flex-wrap gap-2 justify-center text-xs">
            <a href="/sip-calculator" className="underline hover:text-blue-600">SIP</a>
            <a href="/emi-calculator" className="underline hover:text-blue-600">EMI</a>
            <a href="/fd-calculator" className="underline hover:text-blue-600">FD</a>
            <a href="/bmi-calculator" className="underline hover:text-blue-600">BMI</a>
            <a href="/age-calculator" className="underline hover:text-blue-600">Age</a>
            <a href="/currency-converter" className="underline hover:text-blue-600">Currency</a>
            <a href="/unit-converter" className="underline hover:text-blue-600">Unit</a>
            <a href="/scientific-calculator" className="underline hover:text-blue-600">Scientific</a>
          </div>
        </div>
      </div>
    </div>
  )
}