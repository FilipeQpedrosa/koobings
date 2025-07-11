'use client';

import { ReactNode } from 'react';
import DashboardSidebar from './DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  businessSlug: string;
  user: {
    name: string;
    role: string;
    businessName: string;
  };
}

export default function DashboardLayout({ children, businessSlug, user }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar businessSlug={businessSlug} user={user} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 