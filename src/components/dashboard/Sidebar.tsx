'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  Users,
  Settings,
  FileText,
  BarChart,
  Clock,
  User,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: BarChart,
    roles: ['BUSINESS_OWNER', 'STAFF'],
  },
  {
    href: '/dashboard/appointments',
    label: 'Appointments',
    icon: Calendar,
    roles: ['BUSINESS_OWNER', 'STAFF'],
  },
  {
    href: '/dashboard/schedule',
    label: 'Schedule',
    icon: Clock,
    roles: ['BUSINESS_OWNER', 'STAFF'],
  },
  {
    href: '/dashboard/services',
    label: 'Services',
    icon: Briefcase,
    roles: ['BUSINESS_OWNER'],
  },
  {
    href: '/dashboard/customers',
    label: 'Customers',
    icon: Users,
    roles: ['BUSINESS_OWNER'],
  },
  {
    href: '/dashboard/staff',
    label: 'Staff',
    icon: Users,
    roles: ['BUSINESS_OWNER'],
  },
  {
    href: '/dashboard/reports',
    label: 'Reports',
    icon: FileText,
    roles: ['BUSINESS_OWNER'],
  },
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: User,
    roles: ['BUSINESS_OWNER', 'STAFF'],
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: Settings,
    roles: ['BUSINESS_OWNER'],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole as string)
  );

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 flex-shrink-0 h-6 w-6',
                        isActive
                          ? 'text-gray-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
} 