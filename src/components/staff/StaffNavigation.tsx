'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Settings, Briefcase } from 'lucide-react';

export default function StaffNavigation() {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Schedule',
      href: '/staff/schedule',
      icon: CalendarDays,
      current: pathname === '/staff/schedule',
    },
    {
      name: 'Services',
      href: '/staff/services',
      icon: Briefcase,
      current: pathname === '/staff/services',
    },
    {
      name: 'Profile',
      href: '/staff/profile',
      icon: Settings,
      current: pathname === '/staff/profile',
    },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <span className="text-xl font-semibold">Staff Portal</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    item.current
                      ? 'border-b-2 border-indigo-500 text-gray-900'
                      : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 