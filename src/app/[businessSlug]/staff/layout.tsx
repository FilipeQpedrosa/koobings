"use client";

import { useState } from 'react';
import StaffSidebar from '@/components/Staff/StaffSidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface BusinessStaffLayoutProps {
  children: React.ReactNode;
}

export default function BusinessStaffLayout({ children }: BusinessStaffLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="sm:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-md"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar */}
      <StaffSidebar 
        className="hidden sm:block" 
        open={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 