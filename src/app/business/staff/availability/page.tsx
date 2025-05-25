import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { StaffAvailabilityManager } from '@/components/Staff/StaffAvailabilityManager';
import { redirect } from 'next/navigation';

async function getStaffMembers(businessId: string) {
  // Only fetch staff; schedules/availability should be fetched in the manager or elsewhere if needed
  return prisma.staff.findMany({
    where: {
      businessId,
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

  // Use the correct role string (likely 'BUSINESS'), but fallback to string for now
  const businessId = session.user.businessId || session.user.id;

  if (!businessId) {
    redirect('/auth/signin');
  }

  const staff = await getStaffMembers(businessId);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Staff Availability Management</h1>
      <StaffAvailabilityManager staff={staff} />
    </div>
  );
} 