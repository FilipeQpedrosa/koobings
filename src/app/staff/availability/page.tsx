import { Metadata } from 'next';
import AvailabilityScheduler from '@/components/Staff/availability/AvailabilityScheduler';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Staff Availability',
  description: 'Manage your working hours and availability',
};

async function getStaffAvailability(email: string) {
  const staff = await prisma.staff.findUnique({
    where: { email },
    include: {
      availability: true,
    },
  });

  return staff?.availability?.schedule;
}

export default async function AvailabilityPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const initialSchedule = await getStaffAvailability(session.user.email);

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Availability Settings</h1>
          <p className="text-muted-foreground">
            Set your regular working hours and manage your availability
          </p>
        </div>
        
        <AvailabilityScheduler
          initialSchedule={initialSchedule}
          onSave={async (schedule) => {
            'use server';
            
            const response = await fetch('/api/staff/availability', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(schedule),
            });

            if (!response.ok) {
              throw new Error('Failed to update availability');
            }
          }}
        />
      </div>
    </div>
  );
} 