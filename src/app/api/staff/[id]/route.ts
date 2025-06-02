import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { StaffRole } from '@prisma/client';

const staffUpdateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.nativeEnum(StaffRole),
  password: z.string().optional(),
  services: z.array(z.string()).optional(),
});

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'STAFF' || session.user.staffRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const staffId = params.id;
    if (!staffId) {
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
    }
    // Verify staff access
    const existingStaff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: { businessId: true },
    });
    if (!existingStaff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }
    if (existingStaff.businessId !== session.user.businessId) {
      return NextResponse.json({ error: 'Unauthorized to delete this staff member' }, { status: 403 });
    }
    // Check for appointments before deleting
    const appointmentCount = await prisma.appointment.count({ where: { staffId } });
    if (appointmentCount > 0) {
      return NextResponse.json({ error: 'Cannot delete staff with existing appointments' }, { status: 400 });
    }
    // Clean up related records before deleting staff
    await prisma.$transaction([
      prisma.staffPermission.deleteMany({ where: { staffId } }),
      prisma.staffAvailability.deleteMany({ where: { staffId } }),
      prisma.staffUnavailability.deleteMany({ where: { staffId } }),
      prisma.relationshipNote.deleteMany({ where: { createdById: staffId } }),
      prisma.dataAccessLog.deleteMany({ where: { staffId } }),
      prisma.staff.update({
        where: { id: staffId },
        data: { services: { set: [] } },
      }),
      prisma.staff.delete({ where: { id: staffId } }),
    ]);
    return NextResponse.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return NextResponse.json({ error: 'Failed to delete staff' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'STAFF' || session.user.staffRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const staffId = params.id;
    if (!staffId) {
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
    }
    const data = await request.json();
    const validated = staffUpdateSchema.parse(data);
    // Verify staff access
    const existingStaff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: { businessId: true },
    });
    if (!existingStaff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }
    if (existingStaff.businessId !== session.user.businessId) {
      return NextResponse.json({ error: 'Unauthorized to update this staff member' }, { status: 403 });
    }
    // Prepare update data
    const updateData: any = {
      name: validated.name,
      email: validated.email.toLowerCase(),
      role: validated.role,
    };
    if (validated.password) {
      updateData.password = validated.password; // Should hash in production
    }
    // Update staff
    const updatedStaff = await prisma.staff.update({
      where: { id: staffId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        businessId: true,
      },
    });
    // Update services if provided
    if (validated.services) {
      await prisma.staff.update({
        where: { id: staffId },
        data: {
          services: {
            set: validated.services.map((serviceId) => ({ id: serviceId })),
          },
        },
      });
    }
    return NextResponse.json(updatedStaff);
  } catch (error) {
    console.error('Error updating staff:', error);
    return NextResponse.json({ error: 'Failed to update staff' }, { status: 500 });
  }
} 