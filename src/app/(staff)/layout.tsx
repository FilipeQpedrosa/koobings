import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import StaffSidebar from '@/components/staff/StaffSidebar';

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'staff') {
    redirect('/auth/signin');
  }

  return (
    <div className="flex min-h-screen">
      <StaffSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
} 