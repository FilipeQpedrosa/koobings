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
    console.error("🚨 INVALID USER DATA DETECTED:", {
      errors: parsed.error.issues,
      receivedData: userData,
      timestamp: new Date().toISOString()
    });
    return null;
  }
  
  console.log("✅ User data validation passed:", parsed.data.name);
  return parsed.data;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to manually refresh auth state
  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Login function with validation
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

      if (data.success && data.user) {
        // 🛡️ CRITICAL: Validate user data before setting state
        const validatedUser = validateUserData(data.user);
        
        if (!validatedUser) {
          console.error("🚨 Login failed: Invalid user data from backend");
          return { success: false, error: 'Invalid user data received' };
        }
        
        setUser(validatedUser);
        localStorage.setItem('auth-refresh', Date.now().toString());
        return { success: true, redirectUrl: data.redirectUrl };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error("🚨 Login network error:", error);
      return { success: false, error: 'Network error' };
    }
  };

  // Logout function
  const logout = () => {
    console.log("🚪 Logout initiated");
    fetch('/api/auth/custom-logout', {
      method: 'POST',
      credentials: 'include'
    }).finally(() => {
      setUser(null);
      localStorage.setItem('auth-refresh', Date.now().toString());
      window.location.href = '/auth/signin';
    });
  };

  // Check for JWT token authentication with robust validation
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
            // 🛡️ CRITICAL: Validate user data before using it
            const validatedUser = validateUserData(data.user);
            
            if (!validatedUser) {
              console.error("🚨 SECURITY: Invalid user data detected, forcing logout");
              // Force logout if validation fails - prevents corrupted data usage
              logout();
              return;
            }
            
            console.log('✅ useAuth: User authenticated and validated:', validatedUser.name);
            setUser(validatedUser);
          } else {
            console.log('❌ useAuth: No valid user data');
            setUser(null);
          }
        } else {
          console.log('❌ useAuth: Auth verification failed');
          setUser(null);
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