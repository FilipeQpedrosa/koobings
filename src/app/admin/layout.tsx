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
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[AdminLayout] session:', session, 'status:', status);
    }
    
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      console.log('[AdminLayout] Not authenticated, redirecting to admin signin');
      router.push('/auth/admin-signin');
      return;
    }
    
    // Redirect if not a system admin with proper email
    if (status === 'authenticated' && 
        (session?.user?.role !== 'ADMIN' || session?.user?.email !== 'f.queirozpedrosa@gmail.com')) {
      console.log('[AdminLayout] Not authorized admin, redirecting to admin signin');
      router.push('/auth/admin-signin');
      return;
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
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