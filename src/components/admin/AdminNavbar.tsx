'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Settings, User, LogOut } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isAdmin: boolean;
}

export default function AdminNavbar() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/auth/verify-token');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Error fetching admin user:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

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
        // Clear the auth token cookie manually for JWT
        document.cookie = 'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        // Redirect to admin signin
        window.location.href = '/auth/admin-signin';
      } else {
        // Fallback: manually clear cookies and redirect
        document.cookie = 'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = '/auth/admin-signin';
      }
    } catch (error) {
      // Fallback: manually clear cookies and redirect
      document.cookie = 'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = '/auth/admin-signin';
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/admin" className="text-xl font-bold text-gray-800">
                Service Scheduler Admin
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/admin/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/admin/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                {loading ? 'Loading...' : (user?.name || 'Admin')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 