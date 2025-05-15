'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarDays,
  MessageSquare,
  FileText,
  User,
  Menu,
  X,
  Bell,
} from 'lucide-react';

const navigation = [
  { name: 'My Appointments', href: '/client/appointments', icon: CalendarDays },
  { name: 'Messages', href: '/client/messages', icon: MessageSquare },
  { name: 'Documents', href: '/client/documents', icon: FileText },
  { name: 'Profile', href: '/client/profile', icon: User },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/client" className="text-xl font-semibold text-gray-900">
                  Mind & Wellness
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      isActive
                        ? 'border-b-2 border-blue-500 text-gray-900'
                        : 'text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center space-x-4">
              <button className="rounded-full bg-gray-100 p-1 text-gray-500 hover:text-gray-600">
                <Bell className="h-6 w-6" />
              </button>
              <button className="flex rounded-full bg-gray-100 p-1 text-gray-500 hover:text-gray-600">
                <User className="h-6 w-6" />
              </button>
              <button
                type="button"
                className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 