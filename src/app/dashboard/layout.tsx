'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const navigation = [
    { name: 'Calendar', href: '/dashboard', icon: '📅' },
    { name: 'Clients', href: '/dashboard/clients', icon: '👥' },
    { name: 'Staff', href: '/dashboard/staff', icon: '👨‍⚕️' },
    { name: 'Services', href: '/dashboard/services', icon: '🏥' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`bg-indigo-800 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col transition-all duration-300`}>
        <div className="flex items-center justify-between h-16 px-4 bg-indigo-900">
          <div className={`text-white font-semibold ${!isSidebarOpen && 'hidden'}`}>
            Mind & Wellness
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:text-gray-200"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <nav className="mt-5 flex-1 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${pathname === item.href
                  ? 'bg-indigo-900 text-white'
                  : 'text-indigo-100 hover:bg-indigo-700'}
              `}
            >
              <span className="mr-3">{item.icon}</span>
              <span className={!isSidebarOpen ? 'hidden' : ''}>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="flex-shrink-0 flex border-t border-indigo-700 p-4">
          <button
            className={`
              group flex items-center text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-700 w-full px-2 py-2
            `}
          >
            <span className="mr-3">👤</span>
            <span className={!isSidebarOpen ? 'hidden' : ''}>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Dashboard
            </h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 