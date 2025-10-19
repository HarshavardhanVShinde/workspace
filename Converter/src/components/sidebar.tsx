"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calculator,
  Heart,
  DollarSign,
  Home,
  Calendar,
  Ruler,
  Menu,
  X,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Globe,
  Percent,
  Activity
} from 'lucide-react'
import { clsx } from 'clsx'
import { NAV_CATEGORIES } from '@/lib/nav-data'

// Icon mapping for navigation items
const iconMap = {
  Calculator,
  Heart,
  DollarSign,
  Home,
  Calendar,
  Ruler,
  TrendingUp,
  Globe,
  Percent,
  Activity
}

// Home item to show at the top
const homeItem = {
  name: 'Home',
  href: '/',
  icon: Home,
  description: 'Welcome to TechSynth Calculator Hub'
}

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>([]) // All sections closed by default
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    // Automatically expand the section that contains the current path
    if (pathname) {
      const matchingSection = NAV_CATEGORIES.find(section =>
        section.items.some(item => item.href === pathname)
      )
      if (matchingSection && !expandedSections.includes(matchingSection.key)) {
        setExpandedSections([matchingSection.key])
      }
    }
  }, [pathname])

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionKey) 
        ? prev.filter(key => key !== sectionKey)
        : [sectionKey] // Only allow one section to be open at a time
    )
  }

  const getIcon = (iconName?: string) => {
    return iconName ? iconMap[iconName as keyof typeof iconMap] || Calculator : Calculator
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-glass border border-white/40 hover:bg-white/90 dark:hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand.indigo"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isMobileMenuOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.25 }}
              >
                <X className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ opacity: 0, rotate: 45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -45 }}
                transition={{ duration: 0.25 }}
              >
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.button
            aria-label="Close navigation menu"
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        aria-label="Primary"
        role="navigation"
        className={clsx('fixed top-0 left-0 h-full w-80 z-50 lg:translate-x-0')}
        initial={false}
        animate={{ x: isDesktop ? 0 : (isMobileMenuOpen ? 0 : -320) }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      >
        <div className="flex flex-col h-full rounded-r-2xl border-r border-white/40 bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-glass">
          {/* Header */}
          <div className="p-6 border-b border-white/40">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-brand.indigo to-brand.indigoLight rounded-xl flex items-center justify-center shadow-soft text-white">
                <Calculator className="h-6 w-6" />
              </div>
              <div className="leading-tight">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">TechSynth</h1>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Hub</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-transparent">
            <div className="space-y-2 pr-1">
              {/* Home Link */}
              <Link
                href={homeItem.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                  'group relative flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand.indigo/60',
                  pathname === homeItem.href
                    ? 'bg-gradient-to-r from-brand.indigo/15 to-brand.indigoLight/10 text-brand.indigo dark:text-brand.indigoLight ring-1 ring-brand.indigo/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/60 dark:bg-white/10 shadow-inner">
                  <homeItem.icon
                    className={clsx(
                      'h-5 w-5 flex-shrink-0 transition-colors',
                      pathname === homeItem.href ? 'text-brand.indigo' : 'text-gray-500 group-hover:text-brand.indigo'
                    )}
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold tracking-tight">{homeItem.name}</div>
                  <div className="text-[11px] leading-snug text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                    {homeItem.description}
                  </div>
                </div>
              </Link>

              {/* Accordion Sections */}
              {NAV_CATEGORIES.map((section) => (
                <div key={section.key} className="space-y-1">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.key)}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-white/5 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand.indigo/60"
                  >
                    <span className="tracking-wide">{section.label}</span>
                    <motion.div
                      animate={{ rotate: expandedSections.includes(section.key) ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </button>

                  {/* Section Items */}
                  <AnimatePresence>
                    {expandedSections.includes(section.key) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 ml-2">
                          {section.items.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = getIcon(item.icon)

                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={clsx(
                                  'group relative flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand.indigo/60',
                                  isActive
                                    ? 'bg-gradient-to-r from-brand.indigo/15 to-brand.indigoLight/10 text-brand.indigo dark:text-brand.indigoLight ring-1 ring-brand.indigo/30'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/40 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                )}
                              >
                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/40 dark:bg-white/5 shadow-inner">
                                  <Icon
                                    className={clsx(
                                      'h-4 w-4 flex-shrink-0 transition-colors',
                                      isActive ? 'text-brand.indigo' : 'text-gray-400 group-hover:text-brand.indigo'
                                    )}
                                  />
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="font-medium tracking-tight text-xs">{item.label}</div>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/40">
            <div className="text-[11px] text-gray-600 dark:text-gray-400 text-center leading-relaxed">
              © 2025 TechSynth.net<br />All calculators work offline
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}