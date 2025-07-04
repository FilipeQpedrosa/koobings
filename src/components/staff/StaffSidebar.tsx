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
    title: 'Agenda',
    href: '/staff/schedule',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: 'Equipe',
    href: '/staff/settings/staff',
    icon: <Users className="h-5 w-5" />,
    adminOnly: true,
  },
  {
    title: 'Clientes',
    href: '/staff/clients',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Agendamentos',
    href: '/staff/bookings',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: 'Configurações',
    href: '/staff/settings',
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: 'Perfil',
    href: '/staff/profile',
    icon: <User className="h-5 w-5" />,
  },
];

interface StaffSidebarProps {
  className?: string;
  open?: boolean;
  onClose?: () => void;
}

const StaffSidebar: React.FC<StaffSidebarProps> = ({ className, open = false, onClose }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const staffRole = session?.user?.staffRole;
  const staffName = session?.user?.name;
  const businessName = session?.user?.businessName;
  const _canViewSettings = session?.user?.staffRole === 'ADMIN' || session?.user?.permissions?.includes('canViewSettings');

  // Debug logging to track session data
  React.useEffect(() => {
    if (session?.user) {
      console.log('🔍 StaffSidebar session debug:', {
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        staffRole: session.user.staffRole,
        businessId: session.user.businessId,
        businessName: session.user.businessName,
        timestamp: new Date().toISOString()
      });
    }
  }, [session]);

  const filteredNavItems = navItems.filter(item => {
    if (item.title === 'Configurações') {
      return _canViewSettings;
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
        'hidden sm:block w-64 bg-gradient-to-b from-slate-50 to-gray-100 shadow-lg border-r border-gray-200 pb-12',
        className
      )}
      style={{ minWidth: '16rem' }}
      aria-label="Sidebar"
    >
      <div className="space-y-4 py-6">
        <Link
          href="/staff/profile"
          className="flex items-center gap-3 px-4 py-3 mx-3 bg-white hover:bg-blue-50 hover:shadow-md rounded-xl transition-all duration-200 border border-gray-100"
        >
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
              {staffName ? staffName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold leading-tight text-gray-800 truncate">{staffName || 'Funcionário'}</div>
              <div className="text-xs text-blue-600 capitalize font-medium">{staffRole?.toLowerCase() || ''}</div>
              {businessName && (
                <div className="text-xs text-gray-500 truncate">{businessName}</div>
              )}
            </div>
          </div>
        </Link>
        <div className="px-3 py-2">
          <div className="space-y-2">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  pathname === item.href
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-md hover:transform hover:scale-102'
                )}
              >
                <div className="flex items-center w-full">
                  <div className={pathname === item.href ? 'text-white' : 'text-gray-500'}>
                    {item.icon}
                  </div>
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
          className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 hover:shadow-md"
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Sair</span>
        </button>
      </div>
    </nav>
  );

  // Mobile sidebar
  const mobileSidebar = open ? (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-40 sm:hidden backdrop-blur-sm"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
        }}
        aria-label="Close sidebar backdrop"
      />
      {/* Sidebar panel */}
      <nav
        className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-white via-slate-50 to-gray-100 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out sm:hidden border-r border-gray-200"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '16rem',
          height: '100vh',
          maxHeight: '100vh',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
        }}
        aria-label="Mobile Sidebar"
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
          <span className="font-bold text-lg text-white">Menu</span>
          <button 
            onClick={onClose} 
            aria-label="Close sidebar"
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <CloseIcon className="h-6 w-6 text-white" />
          </button>
        </div>
        
        {/* Profile section */}
        <Link
          href="/staff/profile"
          className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 bg-white hover:bg-blue-50 transition-colors mx-3 mt-3 rounded-xl shadow-sm"
          onClick={onClose}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
            {staffName ? staffName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate">{staffName || 'Funcionário'}</div>
            <div className="text-xs text-blue-600 capitalize font-medium">{staffRole?.toLowerCase() || ''}</div>
            {businessName && (
              <div className="text-xs text-gray-500 truncate">{businessName}</div>
            )}
          </div>
        </Link>
        
        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 py-4">
            <div className="space-y-2">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                    pathname === item.href
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-md'
                  )}
                  onClick={onClose}
                >
                  <div className="flex items-center w-full">
                    <div className={pathname === item.href ? 'text-white' : 'text-gray-500'}>
                      {item.icon}
                    </div>
                    <span className="ml-3">{item.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sign out button */}
        <div className="px-3 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => { 
              signOut(); 
              if (onClose) onClose(); 
            }}
            className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 hover:shadow-md bg-white"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Sair</span>
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