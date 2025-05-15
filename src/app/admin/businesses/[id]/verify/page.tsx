import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import BusinessVerificationForm from '@/components/admin/BusinessVerificationForm';

const prisma = new PrismaClient();

export default async function VerifyBusinessPage({
  params
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const business = await prisma.business.findUnique({
    where: { id: params.id },
    include: {
      verification: true
    }
  });

  if (!business) {
    redirect('/admin/businesses');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Verify Business: {business.name}</h1>
      <BusinessVerificationForm business={business} />
    </div>
  );
} 