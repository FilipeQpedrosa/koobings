"use client";

import { useState, useEffect } from "react";
import StaffSidebar from '@/components/Staff/StaffSidebar';
import { Menu } from 'lucide-react';
import { usePathname } from "next/navigation";

export default function StaffPortalLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }
    
    // Clean up on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [sidebarOpen]);

  // Close sidebar automatically on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden max-w-full">
      {/* Hamburger for mobile - only show when sidebar is closed */}
      {!sidebarOpen && (
        <button
          className="sm:hidden fixed top-4 left-4 z-40 bg-white rounded-full shadow-lg p-3 border border-gray-200 transition-all hover:shadow-xl"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}
      
      <div className="flex-1 flex flex-col sm:flex-row min-h-0 overflow-x-hidden max-w-full">
        {/* Sidebar - handles its own mobile/desktop rendering */}
        <StaffSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main content */}
        <main className="flex-1 w-full min-w-0 p-2 sm:p-8 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
} 