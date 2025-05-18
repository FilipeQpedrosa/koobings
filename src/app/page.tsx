import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  switch (session.user.role) {
    case 'ADMIN':
      redirect('/admin/businesses');
    case 'BUSINESS':
      redirect('/business/portal/dashboard');
    case 'STAFF':
      redirect('/staff/portal/dashboard');
    default:
      redirect('/services');
  }
} 