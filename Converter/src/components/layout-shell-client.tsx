"use client";
import React from 'react';
import { useNavUI } from '@/components/ui/nav-context';
import Header from '@/components/header';

export default function LayoutShellClient({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useNavUI();
  return (
    <div className="min-h-screen flex flex-col" data-sidebar-open={sidebarOpen ? 'true' : 'false'}>
      {/* Sidebars removed per request */}
      <Header />
      <main className={
        `flex-1 pt-20 relative z-10`
      }>
        <div className="min-h-full pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}
