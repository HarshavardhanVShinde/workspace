"use client";
import React from 'react';
import { useNavUI } from '@/components/ui/nav-context';
import Header from '@/components/header';
import FaqStructuredData from '@/components/seo/faq-structured-data';
import Footer from './footer';

export default function LayoutShellClient({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useNavUI();
  return (
    <div className="min-h-screen flex flex-col" data-sidebar-open={sidebarOpen ? 'true' : 'false'}>
      {/* Sidebars removed per request */}
      <Header />
      <main className={
        `flex-1 pt-20 relative z-10`
      }>
        {/* Page-specific structured data */}
        <FaqStructuredData />
        <div className="min-h-full pb-16">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
