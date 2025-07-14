'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  UserPlus, 
  CalendarDays, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardSidebarProps {
  businessSlug: string;
  user: {
    name: string;
    role: string;
    businessName: string;
  };
}

export default function DashboardSidebar({ businessSlug, user }: DashboardSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Use generic staff portal routes that work for all businesses
  const navigation = [
    { name: 'Dashboard', href: `/${businessSlug}/staff/dashboard`, icon: LayoutDashboard },
    { name: 'Agenda', href: '/staff/schedule', icon: Calendar },
    { name: 'Equipe', href: '/staff/settings/staff', icon: Users },
    { name: 'Clientes', href: '/staff/clients', icon: UserPlus },
    { name: 'Agendamentos', href: '/staff/bookings', icon: CalendarDays },
    { name: 'Configurações', href: '/staff/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      console.log('🚪 Dashboard logout initiated - complete cleanup');
      
      // Clear all local storage and session storage immediately
      localStorage.removeItem('auth-refresh');
      localStorage.removeItem('user-session');
      localStorage.removeItem('auth-token');
      sessionStorage.clear();
      
      // Clear all cookies manually
      document.cookie = 'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'admin-auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'business-auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      // Call the logout API endpoint (use custom-logout for consistency)
      const response = await fetch('/api/auth/custom-logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        credentials: 'include'
      });

      // Always redirect regardless of API response to ensure clean state
      console.log('🔄 Forcing complete page refresh after logout');
      window.location.href = '/auth/signin';
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Fallback: force redirect even if API call fails
      window.location.href = '/auth/signin';
    }
  };

  // Determine theme colors based on business
  const isOrlando = user.businessName?.toLowerCase().includes('orlando');
  const isJulia = user.businessName?.toLowerCase().includes('ju-unha') || user.businessName?.toLowerCase().includes('julia');
  const isAna = user.businessName?.toLowerCase().includes('ana') || user.businessName?.toLowerCase().includes('clínica');
  
  const themeColors = {
    primary: isOrlando ? 'blue' : isJulia ? 'pink' : isAna ? 'green' : 'indigo',
    primaryClasses: isOrlando 
      ? 'bg-blue-600 text-white hover:bg-blue-700' 
      : isJulia 
        ? 'bg-pink-600 text-white hover:bg-pink-700'
        : isAna
          ? 'bg-green-600 text-white hover:bg-green-700'
          : 'bg-indigo-600 text-white hover:bg-indigo-700',
    primaryBorder: isOrlando 
      ? 'border-blue-200 bg-blue-50' 
      : isJulia 
        ? 'border-pink-200 bg-pink-50'
        : isAna
          ? 'border-green-200 bg-green-50'
          : 'border-indigo-200 bg-indigo-50'
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-md"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <h1 className="text-lg font-semibold text-gray-900">
              {user.businessName}
            </h1>
          </div>

          {/* User info */}
          <div className={`p-4 border-b ${themeColors.primaryBorder}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full ${themeColors.primaryClasses} flex items-center justify-center`}>
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href === `/${businessSlug}/staff/dashboard` && pathname.includes('/dashboard'));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive
                      ? `${themeColors.primaryClasses} shadow-sm`
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 transition-colors ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </>
  );
} 