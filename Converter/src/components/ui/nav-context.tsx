"use client";
import { createContext, useCallback, useContext, useState, ReactNode, useEffect } from 'react';

interface NavUIContextValue {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const NavUIContext = createContext<NavUIContextValue | undefined>(undefined);

export function NavUIProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarOpen(o => !o), []);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  // Close on escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSidebarOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value: NavUIContextValue = { sidebarOpen, toggleSidebar, openSidebar, closeSidebar };
  return <NavUIContext.Provider value={value}>{children}</NavUIContext.Provider>;
}

export function useNavUI() {
  const ctx = useContext(NavUIContext);
  if (!ctx) throw new Error('useNavUI must be used within NavUIProvider');
  return ctx;
}
