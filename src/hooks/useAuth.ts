import { useState, useEffect } from 'react';
import { z } from 'zod';

// 🛡️ Robust user data validation schema
const userSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  role: z.string().min(1, "Role is required"),
  staffRole: z.string().optional(),
  businessId: z.string().optional(),
  businessName: z.string().optional(),
  businessSlug: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  isAdmin: z.boolean().optional()
});

// Type derived from schema for better type safety
type ValidatedUser = z.infer<typeof userSchema>;

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

/**
 * 🔒 Validates user data structure and types
 * Returns null if validation fails, triggering automatic logout
 */
function validateUserData(userData: any): ValidatedUser | null {
  const parsed = userSchema.safeParse(userData);
  
  if (!parsed.success) {
    console.error("🚨 User data validation failed:", parsed.error.format());
    console.error("🚨 Received data:", userData);
    return null;
  }
  
  return parsed.data;
}

/**
 * 🧹 Comprehensive cleanup of all authentication-related data
 */
function clearAllAuthData() {
  // Clear localStorage
  localStorage.removeItem('auth-refresh');
  localStorage.removeItem('user-session');
  localStorage.removeItem('auth-token');
  
  // Clear sessionStorage as backup
  sessionStorage.removeItem('auth-refresh');
  sessionStorage.removeItem('user-session');
  sessionStorage.removeItem('auth-token');
  
  // Clear all cookies manually as backup
  document.cookie = 'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'admin-auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'business-auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  
  console.log('🧹 All authentication data cleared');
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to manually refresh auth state
  const refresh = () => {
    console.log('🔄 Manual auth refresh triggered');
    setRefreshTrigger(prev => prev + 1);
  };

  // Enhanced login function with validation and force refresh
  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Login attempt for:', email);
      
      // Clear any existing session data before login
      clearAllAuthData();
      setUser(null);
      
      const response = await fetch('/api/auth/custom-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
        cache: 'no-store'
      });

      const data = await response.json();

      if (data.success && data.user) {
        // 🛡️ CRITICAL: Validate user data before setting state
        const validatedUser = validateUserData(data.user);
        
        if (!validatedUser) {
          console.error("🚨 Login failed: Invalid user data from backend");
          clearAllAuthData();
          return { success: false, error: 'Invalid user data received' };
        }
        
        console.log('✅ Login successful for:', validatedUser.name);
        setUser(validatedUser);
        
        // Trigger refresh across tabs and force cache invalidation
        const refreshToken = Date.now().toString();
        localStorage.setItem('auth-refresh', refreshToken);
        
        // Return success with redirect but don't navigate yet - let the component handle it
        return { success: true, redirectUrl: data.redirectUrl };
      } else {
        console.error('❌ Login failed:', data.error);
        clearAllAuthData();
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error("🚨 Login network error:", error);
      clearAllAuthData();
      return { success: false, error: 'Network error' };
    }
  };

  // Enhanced logout function with complete cleanup
  const logout = () => {
    console.log("🚪 Logout initiated - complete session cleanup");
    
    // First clear local state immediately
    setUser(null);
    setLoading(true);
    
    // Clear all auth data
    clearAllAuthData();
    
    // Call backend logout (don't wait for it)
    fetch('/api/auth/custom-logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache',
      }
    }).finally(() => {
      // Force complete page refresh to clear any cached state
      console.log('🔄 Forcing complete page refresh after logout');
      window.location.href = '/auth/signin';
    });
  };

  // Enhanced session check with better cache busting
  useEffect(() => {
    async function checkJwtAuth() {
      try {
        console.log('🔍 useAuth: Checking authentication...', {
          timestamp: new Date().toISOString(),
          refreshTrigger
        });
        
        // Add timestamp to prevent caching
        const timestamp = Date.now();
        const response = await fetch(`/api/auth/verify-token?t=${timestamp}`, {
          cache: 'no-store',
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.user) {
            // 🛡️ CRITICAL: Validate user data before using it
            const validatedUser = validateUserData(data.user);
            
            if (!validatedUser) {
              console.error("🚨 SECURITY: Invalid user data detected, forcing logout");
              clearAllAuthData();
              setUser(null);
              setLoading(false);
              return;
            }
            
            console.log('✅ useAuth: User authenticated and validated:', validatedUser.name);
            setUser(validatedUser);
          } else {
            console.log('❌ useAuth: No valid user data');
            setUser(null);
          }
        } else {
          console.log('❌ useAuth: Auth verification failed, status:', response.status);
          setUser(null);
          // If unauthorized, clear any stale data
          if (response.status === 401) {
            clearAllAuthData();
          }
        }
      } catch (error) {
        console.error('❌ useAuth: JWT auth verification failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkJwtAuth();
  }, [refreshTrigger]);

  // Enhanced storage listener for cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-refresh') {
        console.log('🔄 useAuth: Auth change detected in another tab, refreshing...');
        // Add small delay to ensure backend state is synchronized
        setTimeout(() => {
          refresh();
        }, 100);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Clear user data when component unmounts (cleanup)
  useEffect(() => {
    return () => {
      // Only log, don't clear data on unmount as it might be navigation
      console.log('🧹 useAuth: Component unmounting');
    };
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