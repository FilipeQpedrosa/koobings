import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import StaffSidebar from '@/components/Staff/StaffSidebar';

export default async function StaffPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'STAFF') {
    redirect('/auth/signin');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 min-h-0">
        <StaffSidebar />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
} 