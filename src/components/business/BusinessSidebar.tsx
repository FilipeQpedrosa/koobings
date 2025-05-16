'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Users, Calendar, Briefcase } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/business/dashboard', icon: Home },
  { name: 'Services', href: '/business/services', icon: Briefcase },
  { name: 'Staff', href: '/business/staff', icon: Users },
  { name: 'Schedule', href: '/business/schedule', icon: Calendar },
  { name: 'Settings', href: '/business/settings', icon: Settings },
];

export default function BusinessSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-gray-800">
      <div className="flex flex-col flex-1">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
          <h1 className="text-xl font-semibold text-white">Business Portal</h1>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-6 w-6 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 