'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Users,
  Settings,
  Home,
  LogOut,
  X as CloseIcon,
  User,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import StaffSidebar from '@/components/Staff/StaffSidebar';

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
  {
    title: 'Profile',
    href: '/staff/profile',
    icon: <User className="h-5 w-5" />,
  },
];

interface StaffSidebarProps {
  className?: string;
  open?: boolean;
  onClose?: () => void;
}

function StaffAvatar({ name }: { name?: string }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  return (
    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
      {initials}
    </div>
  );
}

const StaffSidebar: React.FC<StaffSidebarProps> = ({ className, open = false, onClose }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const staffRole = session?.user?.staffRole;
  const staffName = session?.user?.name;
  const [canViewSettings, setCanViewSettings] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (session?.user?.permissions) {
      setCanViewSettings(session.user.permissions.includes('canViewSettings'));
    }
  }, [session]);

  const filteredNavItems = navItems.filter(item => {
    if (item.title === 'Settings') {
      return staffRole === 'ADMIN';
    }
    if (item.adminOnly) {
      return staffRole === 'ADMIN';
    }
    return true;
  });

  // Desktop sidebar
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
        <Link
          href="/staff/profile"
          className="flex items-center gap-3 px-3 py-2 mb-2 hover:bg-gray-100 rounded-lg transition"
        >
          <div className="flex items-center gap-3 w-full">
            <StaffAvatar name={staffName} />
            <div>
              <div className="font-semibold leading-tight">{staffName || 'Staff'}</div>
              <div className="text-xs text-gray-500 capitalize">{staffRole?.toLowerCase() || ''}</div>
            </div>
          </div>
        </Link>
        <div className="px-3 py-2">
          <div className="space-y-1">
            {filteredNavItems.map((item) => (
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
                <div className="flex items-center w-full">
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </div>
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

  // Mobile sidebar
  const mobileSidebar = open ? (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden cursor-pointer"
        onClick={onClose}
        aria-label="Close sidebar backdrop"
      />
      <nav
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 flex flex-col pb-12 transform transition-transform duration-200 sm:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
          className
        )}
        style={{ minWidth: '16rem' }}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={onClose} aria-label="Close sidebar">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <Link
          href="/staff/profile"
          className="flex items-center gap-3 px-4 py-4 border-b hover:bg-gray-100 transition"
        >
          <div className="flex items-center gap-3 w-full">
            <StaffAvatar name={staffName} />
            <div>
              <div className="font-semibold leading-tight">{staffName || 'Staff'}</div>
              <div className="text-xs text-gray-500 capitalize">{staffRole?.toLowerCase() || ''}</div>
            </div>
          </div>
        </Link>
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {filteredNavItems.map((item) => (
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
                  <div className="flex items-center w-full">
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </div>
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
};

export default StaffSidebar; 