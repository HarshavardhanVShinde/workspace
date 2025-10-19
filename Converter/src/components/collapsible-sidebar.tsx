"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_CATEGORIES } from '@/lib/nav-data';
import { useNavUI } from '@/components/ui/nav-context';
import { ChevronDown, ChevronRight, X } from 'lucide-react';

export default function CollapsibleSidebar() {
  const { sidebarOpen, closeSidebar } = useNavUI();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    // Expand category whose child matches path
    const match = NAV_CATEGORIES.find(c => c.items.some(i => i.href === pathname));
    if (match && !expanded.includes(match.key)) {
      setExpanded(prev => [...prev, match.key]);
    }
  }, [pathname]);

  function toggleCat(key: string) {
    setExpanded(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  }

  // Build breadcrumb segments excluding empty first slash
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumb = [
    { label: 'Home', href: '/' },
    ...segments.map((seg, idx) => ({
      label: seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      href: '/' + segments.slice(0, idx + 1).join('/')
    }))
  ];

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            key="overlay"
            aria-label="Close navigation panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>
      <motion.aside
        aria-label="Section navigation"
        className="fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-[280px] md:w-[300px]"
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      >
        <div className="flex flex-col h-full bg-white/80 dark:bg-white/10 backdrop-blur-xl border-r border-white/30 shadow-glass rounded-r-2xl overflow-hidden">
          <div className="h-14 px-4 flex items-center justify-between border-b border-white/30">
            <span className="font-semibold tracking-tight text-gray-800 dark:text-gray-100">Navigation</span>
            <button
              onClick={closeSidebar}
              className="md:hidden p-2 rounded-lg bg-white/60 dark:bg-white/10 border border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="px-4 py-3 border-b border-white/30 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
            <ol className="flex flex-wrap items-center gap-1 text-[11px] font-medium text-gray-600 dark:text-gray-400">
              {breadcrumb.map((b, i) => {
                const isLast = i === breadcrumb.length - 1;
                return (
                  <li key={b.href} className="flex items-center gap-1">
                    {!isLast ? (
                      <Link href={b.href} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1">
                        {b.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-indigo-600 dark:text-indigo-400 px-1">{b.label}</span>
                    )}
                    {!isLast && <span className="text-gray-400">/</span>}
                  </li>
                );
              })}
            </ol>
          </nav>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {NAV_CATEGORIES.map(cat => {
              const isExpanded = expanded.includes(cat.key);
              return (
                <div key={cat.key} className="group border border-white/30 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-md shadow-inner">
                  <button
                    onClick={() => toggleCat(cat.key)}
                    aria-expanded={isExpanded}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <span className="tracking-tight">{cat.label}</span>
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.ul
                        key="panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden border-t border-white/30"
                      >
                        {cat.items.map(item => {
                          const active = pathname === item.href;
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={closeSidebar}
                                className={`block px-5 py-2 text-[13px] font-medium tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${active ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/10 hover:text-indigo-600'}`}
                              >
                                {item.label}
                              </Link>
                            </li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          <div className="p-3 text-[11px] text-center text-gray-500 dark:text-gray-400 border-t border-white/30">
            © 2025 CalcHub
          </div>
        </div>
      </motion.aside>
    </>
  );
}
