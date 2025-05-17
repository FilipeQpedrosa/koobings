'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Home, Users } from 'lucide-react';

const StaffSidebar = () => {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/staff/dashboard', icon: Home },
    { name: 'Schedule', href: '/staff/schedule', icon: Calendar },
    { name: 'Clients', href: '/staff/clients', icon: Users },
  ];

  return (
    <div className="flex h-full flex-col gap-y-5 bg-white px-6 py-4">
      <div className="flex h-16 shrink-0 items-center">
        <h2 className="text-2xl font-bold">Staff Portal</h2>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6
                        ${
                          isActive
                            ? 'bg-gray-50 text-primary'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                        }
                      `}
                    >
                      <item.icon
                        className={`h-6 w-6 shrink-0 ${
                          isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default StaffSidebar; 