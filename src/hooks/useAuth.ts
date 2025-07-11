import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  staffRole?: string;
  businessId?: string;
  businessName?: string;
  businessSlug?: string;
  permissions?: string[];
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  refresh: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; redirectUrl?: string; error?: string }>;
  logout: () => void;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to manually refresh auth state
  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/custom-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem('auth-refresh', Date.now().toString());
        return { success: true, redirectUrl: data.redirectUrl };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  // Logout function
  const logout = () => {
    fetch('/api/auth/custom-logout', {
      method: 'POST',
      credentials: 'include'
    }).finally(() => {
      setUser(null);
      localStorage.setItem('auth-refresh', Date.now().toString());
      window.location.href = '/auth/signin';
    });
  };

  // Check for JWT token authentication
  useEffect(() => {
    async function checkJwtAuth() {
      try {
        console.log('🔍 useAuth: Checking authentication...', {
          timestamp: new Date().toISOString(),
          refreshTrigger
        });
        
        const response = await fetch('/api/auth/verify-token', {
          cache: 'no-store',
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            console.log('✅ useAuth: User authenticated:', data.user.name);
            setUser({
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role || 'STAFF',
              staffRole: data.user.staffRole || 'ADMIN',
              businessId: data.user.businessId,
              businessName: data.user.businessName,
              businessSlug: data.user.businessSlug,
              permissions: data.user.permissions || [],
              isAdmin: data.user.isAdmin || false
            });
          } else {
            console.log('❌ useAuth: No valid user data');
            setUser(null);
          }
        } else {
          console.log('❌ useAuth: Auth verification failed');
          setUser(null);
        }
      } catch (error) {
        console.log('❌ useAuth: JWT auth verification failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkJwtAuth();
  }, [refreshTrigger]);

  // Listen for storage events to refresh auth when login/logout happens in other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-refresh') {
        console.log('🔄 useAuth: Auth change detected, refreshing...');
        refresh();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    user,
    loading,
    authenticated: !!user,
    refresh,
    login,
    logout
  };
} 