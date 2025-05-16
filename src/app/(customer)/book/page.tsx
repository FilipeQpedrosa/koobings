import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AppointmentBookingForm } from '@/components/Forms/AppointmentBookingForm';

async function getServices(businessId: string) {
  return prisma.service.findMany({
    where: {
      businessId,
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}

async function getStaff(businessId: string) {
  return prisma.staff.findMany({
    where: {
      businessId,
      role: 'STAFF',
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export default async function BookAppointmentPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const businessId = session.user.businessId;
  const [services, staff] = await Promise.all([
    getServices(businessId),
    getStaff(businessId),
  ]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Book an Appointment</h1>
      <div className="max-w-2xl mx-auto">
        <AppointmentBookingForm
          services={services}
          staff={staff}
          patientId={session.user.id}
        />
      </div>
    </div>
  );
} 