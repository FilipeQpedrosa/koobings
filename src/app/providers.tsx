'use client';

import { ReactNode, useState, useEffect } from 'react';
import { UltraSecurityProvider } from '@/components/auth/UltraSecurityProvider';

interface ProvidersProps {
  children: ReactNode
}

function AuthStateDetector({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log('🚀 [PROVIDERS] AuthStateDetector mounted - checking context...');
    
    // 🎯 SMART CONTEXT DETECTION
    const isAdminPage = typeof window !== 'undefined' && (
      window.location.pathname.startsWith('/admin') || 
      window.location.pathname.startsWith('/auth/admin')
    );
    
    const isAuthPage = typeof window !== 'undefined' && 
      window.location.pathname.startsWith('/auth');
    
    const isStaffPage = typeof window !== 'undefined' && 
      /\/[^\/]+\/staff/.test(window.location.pathname);

    const isBookingPage = typeof window !== 'undefined' && 
      window.location.pathname.startsWith('/book');
    
    console.log(`🔍 [PROVIDERS] Page context - Admin: ${isAdminPage}, Auth: ${isAuthPage}, Staff: ${isStaffPage}, Booking: ${isBookingPage}`);
    
    // Check if user is logged in by looking for auth cookie
    const checkAuthStatus = async () => {
      try {
        // ⚡ Skip customer auth check on admin/staff/booking/auth pages
        if (isAdminPage || isAuthPage || isStaffPage || isBookingPage) {
          console.log('🚫 [PROVIDERS] Skipping customer auth check on admin/auth/staff/booking page');
          setIsLoggedIn(false);
          setIsChecking(false);
          return;
        }
        
        console.log('🔍 [PROVIDERS] Checking customer auth status...');
        const response = await fetch('/api/customer/profile', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (response.ok) {
          console.log('✅ [PROVIDERS] Customer is logged in - enabling ultra-security');
          setIsLoggedIn(true);
        } else {
          console.log('🔒 [PROVIDERS] Customer not logged in');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.log('🔒 [PROVIDERS] Auth check failed:', error);
        setIsLoggedIn(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthStatus();

    // Listen for login/logout events
    const handleLoginSuccess = () => {
      if (!isAdminPage && !isAuthPage && !isStaffPage && !isBookingPage) {
        console.log('🚀 [PROVIDERS] Customer login detected - enabling ultra-security');
        setIsLoggedIn(true);
      }
    };

    const handleLogout = () => {
      console.log('🚪 [PROVIDERS] Logout detected - disabling ultra-security');
      setIsLoggedIn(false);
    };

    // Listen for custom events
    window.addEventListener('customer-login-success', handleLoginSuccess);
    window.addEventListener('customer-logout', handleLogout);
    window.addEventListener('ultra-aggressive-logout', handleLogout);

    // 🚫 DISABLED: No more automatic polling to prevent 401 spam
    // Check for changes every 30 seconds (only for customer pages)
    // let interval: NodeJS.Timeout | null = null;
    // if (!isAdminPage && !isStaffPage && !isBookingPage) {
    //   interval = setInterval(checkAuthStatus, 30000);
    // }

    return () => {
      window.removeEventListener('customer-login-success', handleLoginSuccess);
      window.removeEventListener('customer-logout', handleLogout);
      window.removeEventListener('ultra-aggressive-logout', handleLogout);
      // if (interval) clearInterval(interval);
    };
  }, []);

  // 🚫 Don't render UltraSecurityProvider on admin/staff/booking/auth pages
  if (typeof window !== 'undefined') {
    const isAdminPage = window.location.pathname.startsWith('/admin') || 
                       window.location.pathname.startsWith('/auth/admin');
    const isAuthPage = window.location.pathname.startsWith('/auth');
    const isStaffPage = /\/[^\/]+\/staff/.test(window.location.pathname);
    const isBookingPage = window.location.pathname.startsWith('/book');
    
    if (isAdminPage || isAuthPage || isStaffPage || isBookingPage) {
      console.log('🏢 [PROVIDERS] Admin/Auth/Staff/Booking page detected - no customer security needed');
      return <>{children}</>;
    }
  }

  if (isChecking) {
    return <>{children}</>;
  }

  return (
    <UltraSecurityProvider isLoggedIn={isLoggedIn}>
      {children}
    </UltraSecurityProvider>
  );
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthStateDetector>
      {children}
    </AuthStateDetector>
  );
} 