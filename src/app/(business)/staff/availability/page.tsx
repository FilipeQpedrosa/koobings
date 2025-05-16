import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { StaffAvailabilityManager } from '@/components/Staff/StaffAvailabilityManager';
import { redirect } from 'next/navigation';

async function getStaffMembers(businessId: string) {
  return prisma.staff.findMany({
    where: {
      businessId,
    },
    include: {
      schedules: true,
      availability: {
        where: {
          date: {
            gte: new Date(),
          },
        },
        orderBy: {
          date: 'asc',
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export default async function StaffAvailabilityPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const businessId = session.user.role === 'business' ? session.user.id : session.user.businessId;
  const staff = await getStaffMembers(businessId);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Staff Availability Management</h1>
      <StaffAvailabilityManager staff={staff} />
    </div>
  );
} 