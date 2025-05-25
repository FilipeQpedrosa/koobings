"use client";
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import StaffSidebar from '@/components/Staff/StaffSidebar';

export default function StaffPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.staffRole) {
      sessionStorage.setItem('staffRole', session.user.staffRole);
    }
  }, [session]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <StaffSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
} 