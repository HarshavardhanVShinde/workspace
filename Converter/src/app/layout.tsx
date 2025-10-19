import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { NavUIProvider } from "@/components/ui/nav-context";
import { ThemeProvider } from "@/components/ui/theme-provider";
import LayoutShellClient from "@/components/layout-shell-client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteUrl, siteName } from "@/lib/seo";

export const revalidate = 3600;
export const dynamic = 'force-static';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap'
});

export const metadata: Metadata = {
  title: "ToolSynth - Calculator Hub | Free Online Calculators",
  description: "Comprehensive collection of free online calculators including SIP, BMI, EMI, Currency Converter, Age Calculator, and Unit Converter. Fast, accurate, and mobile-friendly.",
  keywords: "calculator, SIP calculator, BMI calculator, EMI calculator, currency converter, age calculator, unit converter, financial calculator",
  authors: [{ name: "ToolSynth" }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "ToolSynth - Calculator Hub",
    description: "Free online calculators for finance, health, and daily conversions.",
    url: siteUrl,
    siteName,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ToolSynth - Calculator Hub",
    description: "Free online calculators for finance, health, and conversions.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode; }>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/vercel.svg`,
  };
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} font-sans antialiased min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-[#0f172a] dark:via-[#0b1120] dark:to-[#020617] relative`}>
        {/* Ambient radial accent */}
        <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(circle_at_center,white,transparent_70%)]">
          <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-indigo-200/40 dark:bg-indigo-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-emerald-200/40 dark:bg-emerald-500/10 blur-3xl" />
        </div>
        {/* Global structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        <ThemeProvider>
          <NavUIProvider>
            <LayoutShellClient>{children}</LayoutShellClient>
          </NavUIProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
