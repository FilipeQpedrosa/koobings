import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { StaffRole } from '@prisma/client';
import { UserRole } from '@/types/dashboard';

const BUSINESS_OWNER: UserRole = 'BUSINESS_OWNER';

// Validation schema for staff
const staffSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.nativeEnum(StaffRole),
  businessId: z.string(),
});

export async function GET(request: NextRequest) {
  try {
    // Get business ID from subdomain (middleware sets x-business header)
    const businessId = request.headers.get('x-business');
    if (!businessId) {
      return NextResponse.json({ error: 'Business subdomain missing' }, { status: 400 });
    }
    // Find business by ID
    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    // Optionally: add permission checks here if needed
    const staff = await prisma.staff.findMany({
      where: { businessId: business.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        businessId: true,
      },
    });
    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Allow staff with staffRole 'ADMIN' to manage staff
    if (!session?.user?.role || session.user.role !== 'STAFF' || session.user.staffRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const emailLower = data.email.toLowerCase();

    // Case-insensitive check for existing email in staff or business tables
    const [existingStaff, existingBusiness] = await Promise.all([
      prisma.staff.findFirst({ where: { email: { equals: emailLower, mode: 'insensitive' } } }),
      prisma.business.findFirst({ where: { email: { equals: emailLower, mode: 'insensitive' } } }),
    ]);
    if (existingStaff || existingBusiness) {
      return NextResponse.json(
        { error: 'Email is already in use by another staff member or business.' },
        { status: 400 }
      );
    }

    const validatedData = staffSchema.parse({ ...data, email: emailLower, businessId: session.user.businessId });

    try {
      const staff = await prisma.staff.create({
        data: {
          ...validatedData,
          password: '', // This should be handled by a separate password reset flow
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          businessId: true,
        },
      });
      return NextResponse.json(staff);
    } catch (error: any) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return NextResponse.json(
          { error: 'Email is already in use by another staff member or business.' },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error creating staff:', error);
    return NextResponse.json(
      { error: 'Failed to create staff' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== 'STAFF' || session.user.staffRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Backend guard for settings
    if (
      session.user.staffRole !== 'ADMIN' &&
      !(session.user.permissions && session.user.permissions.includes('canViewSettings'))
    ) {
      return NextResponse.json({ error: 'Not authorized to access settings' }, { status: 403 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Staff ID is required' },
        { status: 400 }
      );
    }

    // Verify staff access
    const existingStaff = await prisma.staff.findUnique({
      where: { id },
      select: {
        businessId: true,
      },
    });

    if (!existingStaff) {
      return NextResponse.json(
        { error: 'Staff not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to update
    if (existingStaff.businessId !== session.user.businessId) {
      return NextResponse.json(
        { error: 'Unauthorized to update this staff member' },
        { status: 403 }
      );
    }

    const staff = await prisma.staff.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        businessId: true,
      },
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error updating staff:', error);
    return NextResponse.json(
      { error: 'Failed to update staff' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== 'STAFF' || session.user.staffRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Staff ID is required' },
        { status: 400 }
      );
    }

    // Verify staff access
    const existingStaff = await prisma.staff.findUnique({
      where: { id },
      select: {
        businessId: true,
      },
    });

    if (!existingStaff) {
      return NextResponse.json(
        { error: 'Staff not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to delete
    if (existingStaff.businessId !== session.user.businessId) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this staff member' },
        { status: 403 }
      );
    }

    await prisma.staff.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return NextResponse.json(
      { error: 'Failed to delete staff' },
      { status: 500 }
    );
  }
} 