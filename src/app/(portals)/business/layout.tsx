import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BusinessSidebar from '@/components/business/BusinessSidebar';

export default async function BusinessPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'BUSINESS') {
    redirect('/auth/signin');
  }

  return (
    <div className="flex min-h-screen">
      <BusinessSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
} 