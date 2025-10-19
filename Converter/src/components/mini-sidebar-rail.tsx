"use client";
import { useEffect, useState } from 'react';
import { NAV_CATEGORIES } from '@/lib/nav-data';
import { useNavUI } from '@/components/ui/nav-context';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DollarSign, Calculator, Percent, Heart, Activity, Calendar, Ruler, Globe } from 'lucide-react';

const iconMap: Record<string, any> = { DollarSign, Calculator, Percent, Heart, Activity, Calendar, Ruler, Globe };

export default function MiniSidebarRail() {
  const { sidebarOpen, openSidebar } = useNavUI();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  // Hide rail when expanded sidebar open (avoid duplicate)
  if (!mounted) return null;
  return (
    <AnimatePresence>
      {!sidebarOpen && (
        <motion.nav
          key="rail"
          aria-label="Collapsed navigation"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          className="hidden md:flex fixed top-16 left-0 z-40 w-16 h-[calc(100vh-4rem)] flex-col items-center gap-3 py-4 bg-white/70 dark:bg-white/10 backdrop-blur-xl border-r border-white/30 shadow-glass"
        >
          {NAV_CATEGORIES.flatMap(cat => cat.items).map(item => {
            const Icon = iconMap[item.icon || 'Calculator'] || Calculator;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex h-11 w-11 items-center justify-center rounded-xl border border-transparent transition-colors ${active ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-400/40' : 'text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-white/20 hover:text-indigo-600'}`}
                onClick={(e) => {
                  // keep collapsed state; no open
                }}
              >
                <Icon className="h-5 w-5" />
                <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-lg bg-gray-900/90 text-white text-xs px-2 py-1 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={openSidebar}
            className="mt-2 text-[11px] font-medium tracking-wide px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Expand navigation"
          >
            ++
          </button>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
