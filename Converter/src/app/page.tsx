"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { motion } from "framer-motion";

const featuredCalculators = [
  {
    name: 'SIP Calculator',
    href: '/sip-calculator',
    description: 'Calculate returns on your SIP investments and plan your financial future with accurate projections.',
    color: 'from-green-500 to-green-600',
    accent: 'text-green-600 dark:text-green-400'
  },
  {
    name: 'BMI Calculator',
    href: '/bmi-calculator',
    description: 'Check your Body Mass Index and understand your health status with personalized recommendations.',
    color: 'from-red-500 to-red-600',
    accent: 'text-red-600 dark:text-red-400'
  },
  {
    name: 'EMI Calculator',
    href: '/emi-calculator',
    description: 'Calculate loan EMIs for home, car, or personal loans with detailed amortization schedules.',
    color: 'from-blue-500 to-blue-600',
    accent: 'text-blue-600 dark:text-blue-400'
  },
  {
    name: 'Currency Converter',
    href: '/currency-converter',
    description: 'Convert between different currencies with real-time exchange rates and historical data.',
    color: 'from-yellow-500 to-yellow-600',
    accent: 'text-yellow-600 dark:text-yellow-400'
  },
  {
    name: 'Age Calculator',
    href: '/age-calculator',
    description: 'Calculate your exact age in years, months, days, and even seconds with precision.',
    color: 'from-purple-500 to-purple-600',
    accent: 'text-purple-600 dark:text-purple-400'
  },
  {
    name: 'Unit Converter',
    href: '/unit-converter',
    description: 'Convert between various units of measurement including length, weight, temperature, and more.',
    color: 'from-indigo-500 to-indigo-600',
    accent: 'text-indigo-600 dark:text-indigo-400'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen pt-8 pb-20">
      {/* Hero Section */}
      <section className="relative mb-16">
        <div className="absolute inset-0 -z-10">
          <div className="h-full w-full bg-gradient-to-br from-brand.indigo/15 via-transparent to-emerald-300/20 dark:from-brand.indigo/25 dark:via-transparent dark:to-emerald-500/10" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <GlassCard className="px-6 sm:px-12 py-12 md:py-20 shadow-soft-lg overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-center mx-auto max-w-4xl"
            >
              <div className="flex justify-center mb-6">
                <Image
                  src="/globe.svg"
                  alt="Calculator Globe"
                  width={56}
                  height={56}
                  priority
                  sizes="56px"
                  className="opacity-90 dark:opacity-80 drop-shadow-sm"
                />
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-white/10 px-4 py-2 text-xs font-medium tracking-wide uppercase text-blue-600 dark:text-blue-400 shadow-inner mb-8 border border-white/60 dark:border-white/20 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></div> Unified Precision Suite
              </span>
              <h1 className="font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl xl:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 leading-[1.1] mb-6">
                Elevate Your <span className="text-brand.indigo">Decisions</span> with Next‑Gen Calculators
              </h1>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10 font-medium">
                Financial clarity, health insights, and everyday conversions—crafted with accuracy, performance, and a modern experience. Fully client-side, privacy‑first, and blazing fast.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <AnimatedButton asChild className="w-full sm:w-auto shadow-lg">
                  <Link href="/sip-calculator" className="group inline-flex items-center justify-center px-8 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Start Calculating
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </AnimatedButton>
                <AnimatedButton variant="outline" asChild className="w-full sm:w-auto border-2 border-blue-600/60 bg-white/50 dark:bg-white/5 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-500/10">
                  <Link href="#calculators" className="inline-flex items-center justify-center px-8 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400">Browse All Tools</Link>
                </AnimatedButton>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      <section id="calculators" className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="flex flex-col items-center mb-12 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4 drop-shadow-sm">
              Professional Grade Calculators
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed font-medium">
              Precision‑built tools engineered for clarity, performance, and trust. Explore our growing library of interactive calculators.
            </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCalculators.map((calculator, i) => {
            return (
              <GlassCard key={calculator.name} delay={i * 0.05} className="group h-full p-8 hover:shadow-glass-lg transition-all duration-300 border border-white/40 dark:border-white/10">
                <Link href={calculator.href} className="flex flex-col h-full">
                  <div className="mb-6">
                    <div className={`h-1 w-full rounded-full bg-gradient-to-r ${calculator.color} mb-4`} />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {calculator.name}
                    </h3>
                  </div>
                  <div className="flex-1">
                    <p className="text-base text-gray-700 dark:text-gray-400 leading-relaxed">
                      {calculator.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/20 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${calculator.accent} group-hover:opacity-80 transition-opacity`}>
                        Launch Calculator
                      </span>
                      <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${calculator.color} flex items-center justify-center`}>
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: '100% Accurate', desc: 'Mathematically verified formulas with precision handling to avoid floating point errors.', color: 'from-emerald-500 to-emerald-600' },
              { title: 'Privacy First', desc: 'All computations run locally in your browser. We do not transmit or store your inputs.', color: 'from-blue-500 to-blue-600' },
              { title: 'Mobile Optimized', desc: 'Responsive, accessible, and fast—crafted for phones, tablets, and widescreen desktops.', color: 'from-purple-500 to-purple-600' }
            ].map((f, i) => (
              <GlassCard key={f.title} delay={0.1 + i * 0.05} className="p-8 flex flex-col h-full text-center border border-white/40 dark:border-white/10 hover:shadow-glass-lg transition-all duration-300 group">
                <div className={`h-1 w-full rounded-full bg-gradient-to-r ${f.color} mb-4`} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">{f.title}</h3>
                <p className="text-base text-gray-700 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
