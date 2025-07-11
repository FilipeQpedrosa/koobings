'use client';

import React, { useEffect, useMemo } from 'react';
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
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

interface StaffSidebarProps {
  className?: string;
  open?: boolean;
  onClose?: () => void;
}

const StaffSidebar: React.FC<StaffSidebarProps> = ({ className, open = false, onClose }) => {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  
  // Extract user information from useAuth
  const staffRole = user?.staffRole || user?.role;
  const staffName = user?.name;
  const businessName = user?.businessName;
  const isAdmin = user?.isAdmin || user?.staffRole === 'ADMIN' || user?.role === 'ADMIN';
  const _canViewSettings = isAdmin || user?.permissions?.includes('canViewSettings');

  // Detect business slug from current pathname
  const businessSlug = useMemo(() => {
    // Check if we're on a business-specific route like /[businessSlug]/staff/dashboard
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length >= 3 && pathSegments[1] === 'staff') {
      return pathSegments[0];
    }
    return null;
  }, [pathname]);

  // Generate navigation items with correct base URL
  const navItems: NavItem[] = useMemo(() => {
    const baseUrl = businessSlug ? `/${businessSlug}/staff` : '/staff';
    
    return [
      {
        title: 'Dashboard',
        href: `${baseUrl}/dashboard`,
        icon: <Home className="h-5 w-5" />,
      },
      {
        title: 'Agenda',
        href: `${baseUrl}/schedule`,
        icon: <Calendar className="h-5 w-5" />,
      },
      {
        title: 'Equipe',
        href: `${baseUrl}/settings/staff`,
        icon: <Users className="h-5 w-5" />,
        adminOnly: true,
      },
      {
        title: 'Clientes',
        href: `${baseUrl}/clients`,
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: 'Agendamentos',
        href: `${baseUrl}/bookings`,
        icon: <Calendar className="h-5 w-5" />,
      },
      {
        title: 'Configurações',
        href: `${baseUrl}/settings`,
        icon: <Settings className="h-5 w-5" />,
      },
      {
        title: 'Perfil',
        href: `${baseUrl}/profile`,
        icon: <User className="h-5 w-5" />,
      },
    ];
  }, [businessSlug]);

  // Debug logging to track user data
  useEffect(() => {
    if (user) {
      console.log('🔍 StaffSidebar user debug:', {
        name: user.name,
        email: user.email,
        role: user.role,
        staffRole: user.staffRole,
        businessId: user.businessId,
        businessName: user.businessName,
        isAdmin: user.isAdmin,
        permissions: user.permissions,
        pathname,
        businessSlug,
        timestamp: new Date().toISOString()
      });
    }
  }, [user, pathname, businessSlug]);

  const filteredNavItems = navItems.filter(item => {
    if (item.title === 'Configurações') {
      return _canViewSettings;
    }
    if (item.adminOnly) {
      return isAdmin;
    }
    return true;
  });

  const handleLogout = async () => {
    try {
      // Call the force logout API endpoint
      const response = await fetch('/api/auth/force-logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Trigger auth refresh to clear state
      localStorage.setItem('auth-refresh', Date.now().toString());
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'auth-refresh',
        newValue: Date.now().toString()
      }));

      if (response.ok) {
        // The API will handle clearing cookies, so we just redirect
        window.location.href = '/auth/signin';
      } else {
        // Fallback: manually clear cookies and redirect
        document.cookie = 'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = '/auth/signin';
      }
    } catch (error) {
      // Fallback: manually clear cookies and redirect
      document.cookie = 'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = '/auth/signin';
    }
  };

  // Generate profile URL with correct base
  const profileUrl = businessSlug ? `/${businessSlug}/staff/profile` : '/staff/profile';

  // Render mobile sidebar when open prop is true
  if (open) {
    return (
      <>
        {/* Backdrop overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm"
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
        {/* Mobile Sidebar panel */}
        <nav
          className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-white via-slate-50 to-gray-100 shadow-2xl z-50 flex flex-col border-r border-gray-200"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '16rem',
            height: '100vh',
            maxHeight: '100vh',
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
            href={profileUrl}
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
                handleLogout(); 
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
    );
  }

  // Render desktop sidebar when open prop is false (default desktop state)
  return (
    <nav
      className={cn(
        'hidden sm:block w-64 bg-gradient-to-b from-slate-50 to-gray-100 shadow-lg border-r border-gray-200 pb-12',
        className
      )}
      style={{ minWidth: '16rem' }}
      aria-label="Desktop Sidebar"
    >
      <div className="space-y-4 py-6">
        <Link
          href={profileUrl}
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
          onClick={handleLogout}
          className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 hover:shadow-md"
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Sair</span>
        </button>
      </div>
    </nav>
  );
};

export default StaffSidebar; 