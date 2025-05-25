'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Clock,
  Users,
  Settings,
  Home,
  LogOut,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/staff/dashboard',
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: 'Schedule',
    href: '/staff/schedule',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: 'Availability',
    href: '/staff/availability',
    icon: <Clock className="h-5 w-5" />,
  },
  {
    title: 'Staff',
    href: '/staff/settings/staff',
    icon: <Users className="h-5 w-5" />,
    adminOnly: true,
  },
  {
    title: 'Clients',
    href: '/staff/clients',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Bookings',
    href: '/staff/bookings',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: 'Settings',
    href: '/staff/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

interface StaffSidebarProps {
  className?: string;
}

export default function StaffSidebar({ className }: StaffSidebarProps) {
  const pathname = usePathname();
  const [staffRole, setStaffRole] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setStaffRole(sessionStorage.getItem('staffRole'));
    }
  }, []);

  return (
    <div className={cn('pb-12 w-64', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navItems
              .filter(item => !item.adminOnly || staffRole === 'ADMIN')
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                    pathname === item.href
                      ? 'bg-accent text-accent-foreground'
                      : 'transparent'
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              ))}
          </div>
        </div>
      </div>
      <div className="px-3 py-2">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Sign Out</span>
        </button>
      </div>
    </div>
  );
} 