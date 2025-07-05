'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('🔒 [AdminLayout] Session status:', status);
    console.log('🔒 [AdminLayout] Session data:', session);
    
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[AdminLayout] session:', session, 'status:', status);
    }
    
    // CRITICAL: Don't redirect while session is loading
    if (status === 'loading') {
      console.log('🔒 [AdminLayout] Session still loading, waiting...');
      return;
    }
    
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      console.log('❌ [AdminLayout] Not authenticated, redirecting to admin signin');
      router.push('/auth/admin-signin');
      return;
    }
    
    // CRITICAL: Only redirect if we have a session AND it's not authorized
    // This prevents redirecting during the brief moment after login when session is updating
    if (status === 'authenticated' && session?.user) {
      console.log('🔒 [AdminLayout] Checking authorization...');
      console.log('🔒 [AdminLayout] User role:', session.user.role);
      console.log('🔒 [AdminLayout] User email:', session.user.email);
      console.log('🔒 [AdminLayout] Required role: ADMIN');
      console.log('🔒 [AdminLayout] Required email: f.queirozpedrosa@gmail.com');
      
      if (session.user.role !== 'ADMIN' || session.user.email !== 'f.queirozpedrosa@gmail.com') {
        console.log('❌ [AdminLayout] Not authorized admin, redirecting to admin signin');
        console.log('❌ [AdminLayout] Actual role:', session.user.role);
        console.log('❌ [AdminLayout] Actual email:', session.user.email);
        router.push('/auth/admin-signin');
        return;
      }
      
      console.log('✅ [AdminLayout] Authorization successful!');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    console.log('🔄 [AdminLayout] Loading session...');
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading admin dashboard...</p>
      </div>
    </div>;
  }

  // Show loading if we don't have session data yet (prevents flash)
  if (status === 'authenticated' && !session?.user) {
    console.log('🔄 [AdminLayout] Session authenticated but no user data yet...');
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Verifying admin access...</p>
      </div>
    </div>;
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