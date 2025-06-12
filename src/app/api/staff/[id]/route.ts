import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { StaffRole } from '@prisma/client';
import { hash } from 'bcryptjs';

const staffUpdateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.nativeEnum(StaffRole),
  password: z.string().optional(),
  services: z.array(z.string()).optional(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: Request) {
  const { pathname } = new URL(request.url);
  const segments = pathname.split('/');
  const id = segments[segments.indexOf('staff') + 1];
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'STAFF' || session.user.staffRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!id) {
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
    }
    // Verify staff access
    const existingStaff = await prisma.staff.findUnique({
      where: { id: id },
      select: { businessId: true },
    });
    if (!existingStaff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }
    if (existingStaff.businessId !== session.user.businessId) {
      return NextResponse.json({ error: 'Unauthorized to delete this staff member' }, { status: 403 });
    }
    // Check for appointments before deleting
    const appointmentCount = await prisma.appointment.count({ where: { staffId: id } });
    if (appointmentCount > 0) {
      return NextResponse.json({ error: 'Cannot delete staff with existing appointments' }, { status: 400 });
    }
    // Clean up related records before deleting staff
    await prisma.$transaction([
      prisma.staffPermission.deleteMany({ where: { staffId: id } }),
      prisma.staffPermission.deleteMany({ where: { staffId: id } }),
      prisma.staffAvailability.deleteMany({ where: { staffId: id } }),
      prisma.staffUnavailability.deleteMany({ where: { staffId: id } }),
      prisma.relationshipNote.deleteMany({ where: { createdById: id } }),
      prisma.dataAccessLog.deleteMany({ where: { staffId: id } }),
      prisma.staff.update({
        where: { id: id },
        data: { services: { set: [] } },
      }),
      prisma.staff.delete({ where: { id: id } }),
    ]);
    return NextResponse.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return NextResponse.json({ error: 'Failed to delete staff' }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const segments = pathname.split('/');
  const staffId = segments[segments.indexOf('staff') + 1];
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'STAFF' || session.user.staffRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
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
      updateData.password = await hash(validated.password, 10);
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