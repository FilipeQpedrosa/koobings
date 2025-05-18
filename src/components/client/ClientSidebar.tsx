'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  FileText,
  User,
  Bell,
  CreditCard,
  History
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Appointments', href: '/client/appointments', icon: CalendarDays },
  { name: 'Messages', href: '/client/messages', icon: MessageSquare },
  { name: 'Documents', href: '/client/documents', icon: FileText },
  { name: 'Profile', href: '/client/profile', icon: User },
  { name: 'Notifications', href: '/client/notifications', icon: Bell },
  { name: 'Billing', href: '/client/billing', icon: CreditCard },
  { name: 'History', href: '/client/history', icon: History },
];

export default function ClientSidebar() {
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
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon
                  className={`
                    mr-3 h-5 w-5
                    ${isActive
                      ? 'text-blue-500'
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