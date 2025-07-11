import { redirect } from 'next/navigation';
import { headers, cookies } from 'next/headers';
import { getServerAuthUser } from '@/lib/jwt';

export default async function PortalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerAuthUser();
  
  if (!user) {
    redirect('/auth/signin');
  }
  
  // Simply allow all authenticated users to access any portal
  return <>{children}</>;
} 