import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { CustomerHeader } from '@/components/layout/customer-header';

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // If user is staff/admin, redirect to staff portal
  if (session?.user?.type === 'staff') {
    redirect('http://localhost:4000/staff/dashboard');
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 