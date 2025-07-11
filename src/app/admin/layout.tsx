'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isAdmin: boolean;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        console.log('🔒 [AdminLayout] Checking JWT authentication...');
        
        const response = await fetch('/api/auth/verify-token');
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.user) {
            console.log('🔒 [AdminLayout] User found:', data.user);
            
            // Check if user is admin
            if (data.user.role === 'ADMIN' && data.user.isAdmin) {
              console.log('✅ [AdminLayout] Admin authorization successful!');
              setUser(data.user);
            } else {
              console.log('❌ [AdminLayout] Not authorized admin, redirecting');
              console.log('❌ [AdminLayout] User role:', data.user.role);
              console.log('❌ [AdminLayout] User isAdmin:', data.user.isAdmin);
              router.push('/auth/admin-signin');
              return;
            }
          } else {
            console.log('❌ [AdminLayout] No valid user, redirecting to login');
            router.push('/auth/admin-signin');
            return;
          }
        } else {
          console.log('❌ [AdminLayout] Auth verification failed, redirecting to login');
          router.push('/auth/admin-signin');
          return;
        }
      } catch (error) {
        console.error('🚨 [AdminLayout] Auth check error:', error);
        router.push('/auth/admin-signin');
        return;
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    console.log('🔄 [AdminLayout] Loading authentication...');
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading admin dashboard...</p>
      </div>
    </div>;
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 