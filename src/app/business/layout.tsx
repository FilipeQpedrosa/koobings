import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import BusinessNavbar from '@/components/business/BusinessNavbar';
import BusinessSidebar from '@/components/business/BusinessSidebar';

const prisma = new PrismaClient();

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Verify if user is business staff
  const staff = await prisma.staff.findUnique({
    where: { email: session.user?.email },
    include: {
      business: true
    }
  });

  if (!staff) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BusinessNavbar staff={staff} />
      <div className="flex">
        <BusinessSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 