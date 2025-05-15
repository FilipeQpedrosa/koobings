import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import PatientNavbar from '@/components/patient/PatientNavbar';
import PatientSidebar from '@/components/patient/PatientSidebar';

const prisma = new PrismaClient();

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Verify if user is a patient
  const patient = await prisma.patient.findUnique({
    where: { email: session.user?.email },
    include: {
      business: true
    }
  });

  if (!patient) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientNavbar patient={patient} />
      <div className="flex">
        <PatientSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 