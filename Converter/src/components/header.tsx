"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Heart,
  Calculator,
  Globe,
  Menu,
  X,
  ChevronDown,
  Percent,
} from "lucide-react";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useNavUI } from "@/components/ui/nav-context";
import { NAV_CATEGORIES } from "@/lib/nav-data";

type NavCategory = {
  key: string;
  label: string;
  items: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
    description?: string;
  }>;
};

// Transform NAV_CATEGORIES into structure with icon components inline for header usage
const categories: NavCategory[] = NAV_CATEGORIES.map(cat => ({
  ...cat,
  items: cat.items.map(i => {
    return { ...i, icon: undefined };
  })
}));

interface DropdownState {
  openKey: string | null;
  viaKeyboard: boolean;
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<DropdownState>({ openKey: null, viaKeyboard: false });
  const navRef = useRef<HTMLDivElement | null>(null);

  // Close on route change (mobile)
  useEffect(() => {
    setMobileOpen(false);
    setDropdown({ openKey: null, viaKeyboard: false });
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target as Node)) {
        setDropdown({ openKey: null, viaKeyboard: false });
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function openDropdown(key: string, keyboard = false) {
    setDropdown({ openKey: key, viaKeyboard: keyboard });
  }
  function closeDropdown() {
    setDropdown({ openKey: null, viaKeyboard: false });
  }

  function handleKey(e: React.KeyboardEvent<HTMLButtonElement>, key: string) {
    if (["Enter", " ", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      if (dropdown.openKey === key) {
        closeDropdown();
      } else {
        openDropdown(key, true);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (dropdown.openKey !== key) openDropdown(key, true); // open first
    } else if (e.key === "Escape") {
      closeDropdown();
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      // TODO: lateral nav between buttons
    }
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50" ref={navRef}>
      <div className="w-full">
        <div className="flex items-center justify-start h-16 border-b border-white/20 bg-white/80 dark:bg-white/10 backdrop-blur-md shadow-sm px-4 sm:px-8">
          {/* Left / Brand */}
          <div className="flex items-center gap-3 mr-8">
            <Link href="/" className="flex items-center gap-2 group" aria-label="ToolSynth Home">
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">ToolSynth</h1>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-2" aria-label="Main navigation">
            {categories.map(cat => {
              const isOpen = dropdown.openKey === cat.key;
              return (
                <div
                  key={cat.key}
                  className="relative"
                  onMouseEnter={() => openDropdown(cat.key)}
                  onMouseLeave={() => closeDropdown()}
                >
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    onKeyDown={(e) => handleKey(e, cat.key)}
                    onClick={() => (isOpen ? closeDropdown() : openDropdown(cat.key, true))}
                    className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
                  >
                    {cat.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        key="dropdown"
                        role="menu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute left-1/10 top-full mt-2 w-[520px] max-w-[85vw] rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xl py-3 overflow-hidden"
                        onMouseEnter={() => openDropdown(cat.key)}
                      >
                        <ul className="outline-none grid grid-cols-2 gap-1 sm:gap-0 p-2" tabIndex={-1}>
                          {cat.items.map(item => (
                            <li key={item.href} role="none">
                              <Link
                                role="menuitem"
                                href={item.href}
                                className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg group transition-colors"
                              >
                                <span className="font-medium tracking-tight">{item.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            <div className="pl-4 ml-2 border-l border-white/30">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden ml-auto">
            <ThemeToggle />
            <button
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(o => !o)}
              className="p-2 rounded-lg bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/30 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <Fragment>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-l border-white/20 shadow-xl flex flex-col"
              aria-label="Mobile navigation"
            >
              <div className="px-6 pt-6 pb-4 border-b border-white/20 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600" onClick={() => setMobileOpen(false)}>ToolSynth</Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-lg bg-white/70 dark:bg-white/10 border border-white/30"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
                {categories.map(cat => {
                  const isCatOpen = dropdown.openKey === cat.key;
                  return (
                    <div key={cat.key} className="px-2">
                      <button
                        onClick={() => openDropdown(isCatOpen ? '' : cat.key)}
                        className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                      >
                        <span>{cat.label}</span>
                        <ChevronDown className={`h-5 w-5 transform transition-transform ${isCatOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isCatOpen && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden space-y-1 mt-2"
                          >
                            {cat.items.map(item => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/60 dark:bg-white/5 border border-white/30 backdrop-blur-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
                                  onClick={() => setMobileOpen(false)}
                                >
                                  <span className="tracking-tight">{item.label}</span>
                                  {item.icon}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
                <div className="px-4 pt-4 border-t border-white/20 text-[11px] text-gray-500 dark:text-gray-400">© 2025 ToolSynth. All rights reserved.</div>
              </div>
            </motion.nav>
          </Fragment>
        )}
      </AnimatePresence>
    </header>
  );
}