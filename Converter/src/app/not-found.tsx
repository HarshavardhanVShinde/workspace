export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white/70 dark:bg-white/10 border border-white/30 rounded-2xl p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Page not found</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">The page you’re looking for doesn’t exist or has moved.</p>
      </div>
    </div>
  )
}