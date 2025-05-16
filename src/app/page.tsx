import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // If user is staff/admin, redirect to business portal
  if (session?.user?.role && ['STAFF', 'ADMIN'].includes(session.user.role)) {
    redirect('/business/dashboard');
  }

  // Default to customer portal
  redirect('/services');
} 