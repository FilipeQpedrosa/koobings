'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings } from 'lucide-react';

interface CustomerUser {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER';
}

export function GlobalCustomerHeader() {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Add logout state

  const checkCustomerAuth = async () => {
    // Prevent auth checks during logout
    if (isLoggingOut) {
      console.log('🚫 GlobalCustomerHeader: Logout in progress, skipping auth check...');
      return;
    }
    
    // 🚫 CHECK CLIENT-SIDE LOGOUT STATE FIRST
    if (typeof window !== 'undefined') {
      const { isUserLoggedOut } = await import('@/lib/logout-tracker');
      
      // Check if ANY user was logged out (don't need specific email here)
      const globalLogout = localStorage.getItem('user_logged_out');
      if (globalLogout === 'true') {
        console.log('🚫 GlobalCustomerHeader: User marked as logged out, skipping auth check');
        setCustomer(null);
        setLoading(false);
        setHasCheckedAuth(true);
        return;
      }
    }
    
    // Prevent multiple simultaneous auth checks
    if (isCheckingAuth) {
      console.log('⚠️ GlobalCustomerHeader: Auth check already in progress, skipping...');
      return;
    }
    
    try {
      setIsCheckingAuth(true);
      console.log('🔍 GlobalCustomerHeader: Starting auth check...');
      
      const response = await fetch('/api/customer/profile', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-cache'
      });
      
      console.log('📡 GlobalCustomerHeader: Profile API response:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCustomer({
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            role: 'CUSTOMER'
          });
          console.log('✅ GlobalCustomerHeader: Customer logged in:', data.data.name);
        } else {
          console.log('❌ GlobalCustomerHeader: Customer profile fetch failed:', data);
          setCustomer(null);
        }
      } else if (response.status === 401) {
        // 401 is expected when not logged in - don't log as error
        console.log('ℹ️ GlobalCustomerHeader: Customer not authenticated (expected)');
        setCustomer(null);
      } else {
        console.log('❌ GlobalCustomerHeader: Unexpected response status:', response.status);
        setCustomer(null);
      }
    } catch (error) {
      console.log('❌ GlobalCustomerHeader: Auth check error:', error);
      setCustomer(null);
    } finally {
      setLoading(false);
      setIsCheckingAuth(false);
      setHasCheckedAuth(true);
    }
  };

  // Initial auth check - ONLY once on mount
  useEffect(() => {
    if (!hasCheckedAuth && !isLoggingOut) {
      const timeoutId = setTimeout(() => {
        console.log('🔍 GlobalCustomerHeader: Starting initial auth check...');
        checkCustomerAuth();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [hasCheckedAuth, isLoggingOut]);

  // Listen for login success events and logout events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'customer-login-success' && !isLoggingOut) {
        console.log('🔄 GlobalCustomerHeader: Login success detected, refreshing...');
        // Reset the check flag and trigger a fresh auth check
        setHasCheckedAuth(false);
        setLoading(true);
        setCustomer(null);
      }
      
      if (e.key === 'customer' && e.newValue === null) {
        console.log('🔄 GlobalCustomerHeader: Logout detected via storage, clearing state...');
        setCustomer(null);
        setHasCheckedAuth(true);
        setLoading(false);
      }
    };

    const handleCustomEvent = (e: CustomEvent) => {
      if (e.type === 'customer-login-success' && !isLoggingOut) {
        console.log('🔄 GlobalCustomerHeader: Custom login event detected');
        // Reset the check flag and trigger a fresh auth check
        setHasCheckedAuth(false);
        setLoading(true);
        setCustomer(null);
      }
      
      if (e.type === 'customer-logout') {
        console.log('🔄 GlobalCustomerHeader: Custom logout event detected');
        setCustomer(null);
        setHasCheckedAuth(true);
        setLoading(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('customer-login-success' as any, handleCustomEvent);
    window.addEventListener('customer-logout' as any, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('customer-login-success' as any, handleCustomEvent);
      window.removeEventListener('customer-logout' as any, handleCustomEvent);
    };
  }, [isLoggingOut]);

  const handleLogout = async () => {
    console.log('🚪 [CUSTOMER_LOGOUT] Simple logout started...');
    
    setIsLoggingOut(true);
    
    try {
      // Step 1: Clear local state immediately
      setCustomer(null);
      setHasCheckedAuth(true);
      setLoading(false);
      
      // Step 2: Call logout API
      console.log('🔌 [CUSTOMER_LOGOUT] Calling logout API...');
      try {
        const response = await fetch('/api/auth/client/logout', {
          method: 'POST',
          credentials: 'include'
        });
        
        if (response.ok) {
          console.log('✅ [CUSTOMER_LOGOUT] API logout successful');
        } else {
          console.warn('⚠️ [CUSTOMER_LOGOUT] API logout failed with status:', response.status);
        }
      } catch (error) {
        console.warn('⚠️ [CUSTOMER_LOGOUT] API logout failed, continuing...', error);
      }
      
      // Step 3: Clear browser storage
      console.log('🧹 [CUSTOMER_LOGOUT] Clearing storage...');
      try {
        localStorage.clear();
        sessionStorage.clear();
        localStorage.setItem('user_logged_out', 'true');
      } catch (e) {
        console.warn('Storage clear failed:', e);
      }
      
      // Step 4: Dispatch logout events
      console.log('📡 [CUSTOMER_LOGOUT] Dispatching logout events...');
      window.dispatchEvent(new CustomEvent('customer-logout'));
      window.dispatchEvent(new CustomEvent('ultra-aggressive-logout', { 
        detail: { reason: 'MANUAL_LOGOUT', timestamp: new Date().toISOString() } 
      }));
      
      console.log('✅ [CUSTOMER_LOGOUT] Logout completed successfully');
      
    } catch (error) {
      console.error('❌ [CUSTOMER_LOGOUT] Error during logout:', error);
    }
    
    // Step 5: Redirect to homepage
    console.log('🔄 [CUSTOMER_LOGOUT] Redirecting to homepage...');
    window.location.href = '/';
  };

  // Don't render anything while checking auth for the first time
  if (loading && !hasCheckedAuth) {
    return null;
  }

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => router.push('/')}
          >
            <div className="bg-blue-600 p-2 rounded-lg mr-3">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Koobings</span>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {customer ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Olá, {customer.name.split(' ')[0]}!</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/customer/profile')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/auth/client/signin')}
                >
                  Entrar
                </Button>
                <Button 
                  onClick={() => router.push('/auth/client/signup')}
                >
                  Registar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 