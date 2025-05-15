'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CalendarDays, 
  Users, 
  UserCircle, 
  Settings, 
  Menu, 
  X,
  LogOut,
  Home
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Appointments', href: '/dashboard/appointments', icon: CalendarDays },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Staff', href: '/dashboard/staff', icon: UserCircle },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile header */}
      <div className="fixed top-0 z-40 w-full bg-white shadow-sm md:hidden">
        <div className="px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="font-semibold text-gray-900">Mind & Wellness</div>
          <button className="text-gray-500 hover:text-gray-600">
            <UserCircle className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Sidebar for desktop / Mobile slide-over */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between px-4 md:h-20">
            <Link href="/dashboard" className="font-semibold text-gray-900">
              Mind & Wellness
            </Link>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-900'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-gray-200 p-4">
            <button className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
              <LogOut className="mr-3 h-5 w-5 text-gray-400" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:pl-64">
        {/* Desktop header */}
        <header className="hidden md:flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-600">
              <UserCircle className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 py-8 md:px-6 md:py-8">
          {/* Add top margin for mobile to account for fixed header */}
          <div className="mt-16 md:mt-0">{children}</div>
        </main>
      </div>
    </div>
  );
} 