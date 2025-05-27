"use client";

import { useState, useEffect } from "react";
import StaffSidebar from '@/components/Staff/StaffSidebar';
import { Menu, X as CloseIcon } from 'lucide-react';
import { usePathname } from "next/navigation";

export default function StaffPortalLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Prevent background scroll (vertical and horizontal) when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('overflow-hidden', 'overflow-x-hidden');
    } else {
      document.body.classList.remove('overflow-hidden', 'overflow-x-hidden');
    }
    // Clean up on unmount
    return () => document.body.classList.remove('overflow-hidden', 'overflow-x-hidden');
  }, [sidebarOpen]);

  // Close sidebar automatically on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hamburger for mobile */}
      <button
        className={`sm:hidden fixed top-4 left-4 z-50 bg-white rounded-full shadow p-2 border border-gray-200 transition-all ${sidebarOpen ? 'ring-2 ring-primary' : ''}`}
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? <CloseIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      {/* Mobile sidebar and backdrop overlay at top level */}
      {sidebarOpen && (
        <StaffSidebar className="block sm:hidden" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar (always visible on sm+) */}
        <StaffSidebar className="hidden sm:block" />
        {/* Main content */}
        <main className="flex-1 p-2 sm:p-8 overflow-y-auto w-full max-w-full">{children}</main>
      </div>
    </div>
  );
} 