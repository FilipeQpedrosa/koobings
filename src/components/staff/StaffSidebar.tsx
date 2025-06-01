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
  X as CloseIcon,
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
  // {
  //   title: 'Availability',
  //   href: '/staff/availability',
  //   icon: <Clock className="h-5 w-5" />,
  // },
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
  open?: boolean;
  onClose?: () => void;
}

export default function StaffSidebar({ className, open = false, onClose }: StaffSidebarProps) {
  const pathname = usePathname();
  const [staffRole, setStaffRole] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setStaffRole(sessionStorage.getItem('staffRole'));
    }
  }, []);

  // Desktop sidebar (always visible)
  const desktopSidebar = (
    <nav
      className={cn(
        'hidden sm:block w-64 bg-white shadow-none pb-12',
        className
      )}
      style={{ minWidth: '16rem' }}
      aria-label="Sidebar"
    >
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
      <div className="px-3 py-2 mt-auto">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Sign Out</span>
        </button>
      </div>
    </nav>
  );

  // Mobile sidebar overlay (drawer + backdrop, does not push content, main content visible but not clickable)
  const mobileSidebar = open ? (
    <>
      {/* Backdrop covers the whole screen, disables interaction with main content */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden cursor-pointer"
        onClick={onClose}
        aria-label="Close sidebar backdrop"
      />
      {/* Sidebar drawer overlays content, does not push it */}
      <nav
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 flex flex-col pb-12 transform transition-transform duration-200 sm:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
          className
        )}
        style={{ minWidth: '16rem' }}
        aria-label="Sidebar"
      >
        {/* Close button on mobile */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={onClose} aria-label="Close sidebar">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
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
                    onClick={onClose}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
        <div className="px-3 py-2 mt-auto">
          <button
            onClick={() => { signOut(); if (onClose) onClose(); }}
            className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Sign Out</span>
          </button>
        </div>
      </nav>
    </>
  ) : null;

  return (
    <>
      {desktopSidebar}
      {mobileSidebar}
    </>
  );
} 