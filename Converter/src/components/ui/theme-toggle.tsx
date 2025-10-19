"use client";
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = resolvedTheme || theme;
  if (!mounted) return (
    <div className="h-10 w-10 rounded-xl border border-white/30 bg-white/40 dark:bg-white/10 backdrop-blur-xl" />
  );
  const isDark = current === 'dark';
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative h-11 w-11 inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/60 dark:bg-white/10 backdrop-blur-xl shadow-glass hover:shadow-soft-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand.indigo focus-visible:ring-offset-2"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="text-yellow-400"
          >
            <Sun className="h-5 w-5" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: 45, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -45, scale: 0.6 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="text-indigo-600"
          >
            <Moon className="h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
