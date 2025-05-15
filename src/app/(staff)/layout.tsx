import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import StaffNavbar from '@/components/staff/StaffNavbar';

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and is a staff member
  if (!session?.user || session.user.type !== 'staff') {
    redirect('/staff/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <StaffNavbar />
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
} 