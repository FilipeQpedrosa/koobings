'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileText,
  MessageSquare,
  Settings,
  Activity,
  DollarSign
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/business/dashboard', icon: LayoutDashboard },
  { name: 'Appointments', href: '/business/appointments', icon: CalendarDays },
  { name: 'Clients', href: '/business/clients', icon: Users },
  { name: 'Staff', href: '/business/staff', icon: Users },
  { name: 'Services', href: '/business/services', icon: FileText },
  { name: 'Messages', href: '/business/messages', icon: MessageSquare },
  { name: 'Analytics', href: '/business/analytics', icon: Activity },
  { name: 'Billing', href: '/business/billing', icon: DollarSign },
  { name: 'Settings', href: '/business/settings', icon: Settings },
];

export default function BusinessSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-sm">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon
                  className={`
                    mr-3 h-5 w-5
                    ${isActive
                      ? 'text-gray-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                    }
                  `}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
} 