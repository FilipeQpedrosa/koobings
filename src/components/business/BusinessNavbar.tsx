'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Bell, Settings, LogOut } from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'PROVIDER' | 'RECEPTIONIST' | 'ASSISTANT';
  business: {
    name: string;
  };
}

interface BusinessNavbarProps {
  staff: Staff;
}

export default function BusinessNavbar({ staff }: BusinessNavbarProps) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/business/dashboard" className="text-xl font-bold text-gray-800">
                {staff.business.name}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button>
            <Link
              href="/business/settings"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Settings</span>
              <Settings className="h-6 w-6" />
            </Link>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">{staff.name}</span>
              <button
                onClick={() => signOut()}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Sign out</span>
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 