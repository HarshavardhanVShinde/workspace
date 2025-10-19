"use client";
import React from "react";
import Link from "next/link";
import { NAV_CATEGORIES } from "@/lib/nav-data";

export default function Footer() {
  return (
    <footer
      className="relative mt-auto border-t border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-sm"
      aria-label="Footer"
    >
      {/* subtle gradient line for a modern touch */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Top: brand + navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Brand/summary */}
          <div className="lg:col-span-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">TechSynth Calculators</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Fast, accurate, and mobile-friendly tools for finance, health, and daily conversions. Free to use, accessible, and optimized for performance.
            </p>
            <div className="mt-3">
              <Link
                href="/"
                className="group inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Browse all calculators
                <svg
                  className="ml-1 h-4 w-4 -translate-x-0.5 opacity-80 transition-transform duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 10 10.293 6.707a1 1 0 010-1.414z" />
                  <path d="M4 10a1 1 0 011-1h9a1 1 0 110 2H5a1 1 0 01-1-1z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Navigation groups */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {NAV_CATEGORIES.map((cat) => (
                <nav key={cat.label} aria-label={cat.label}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                    {cat.label}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {cat.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-sm text-gray-700 dark:text-gray-300 underline-offset-4 hover:underline hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: utility links */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-gray-200/60 dark:border-white/10 pt-6">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} TechSynth. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-gray-600 dark:text-gray-400">
            <Link href="/sitemap.xml" className="underline-offset-4 hover:underline hover:text-blue-600 dark:hover:text-blue-300 transition-colors">Sitemap</Link>
            <span aria-hidden className="text-gray-300 dark:text-gray-600">•</span>
            <Link href="/robots.txt" className="underline-offset-4 hover:underline hover:text-blue-600 dark:hover:text-blue-300 transition-colors">Robots</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}