import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { StaffRole } from '@prisma/client';
import { hash } from 'bcryptjs';

// Validation schema for staff
const staffSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.nativeEnum(StaffRole),
  businessId: z.string(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.businessId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { businessId } = session.user;

    // Find business by ID
    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      return NextResponse.json({ success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } }, { status: 404 });
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
    return NextResponse.json({ success: true, data: staff });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { success: false, error: { code: 'STAFF_FETCH_ERROR', message: 'Failed to fetch staff' } },
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
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const data = await request.json();
    const emailLower = data.email.toLowerCase();

    if (!data.password || data.password.length < 8) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_PASSWORD', message: 'Password is required and must be at least 8 characters.' } },
        { status: 400 }
      );
    }

    // Case-insensitive check for existing email in staff or business tables
    const [existingStaff, existingBusiness] = await Promise.all([
      prisma.staff.findFirst({ where: { email: { equals: emailLower, mode: 'insensitive' } } }),
      prisma.business.findFirst({ where: { email: { equals: emailLower, mode: 'insensitive' } } }),
    ]);
    if (existingStaff || existingBusiness) {
      return NextResponse.json(
        { success: false, error: { code: 'EMAIL_IN_USE', message: 'Email is already in use by another staff member or business.' } },
        { status: 400 }
      );
    }

    const validatedData = staffSchema.parse({ ...data, email: emailLower, businessId: session.user.businessId });

    try {
      const passwordHash = await hash(data.password, 10);
      const staff = await prisma.staff.create({
        data: {
          ...validatedData,
          password: passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          businessId: true,
        },
      });
      return NextResponse.json({ success: true, data: staff });
    } catch (error: any) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return NextResponse.json(
          { success: false, error: { code: 'EMAIL_IN_USE', message: 'Email is already in use by another staff member or business.' } },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error creating staff:', error);
    return NextResponse.json(
      { success: false, error: { code: 'STAFF_CREATE_ERROR', message: 'Failed to create staff' } },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== 'STAFF' || session.user.staffRole !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    // Backend guard for settings
    if (
      session.user.staffRole !== 'ADMIN' &&
      !(session.user.permissions && session.user.permissions.includes('canViewSettings'))
    ) {
      return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to access settings' } }, { status: 403 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: 'STAFF_ID_REQUIRED', message: 'Staff ID is required' } },
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
        { success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff not found' } },
        { status: 404 }
      );
    }

    // Check if user has permission to update
    if (existingStaff.businessId !== session.user.businessId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED_UPDATE', message: 'Unauthorized to update this staff member' } },
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

    return NextResponse.json({ success: true, data: staff });
  } catch (error) {
    console.error('Error updating staff:', error);
    return NextResponse.json(
      { success: false, error: { code: 'STAFF_UPDATE_ERROR', message: 'Failed to update staff' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== 'STAFF' || session.user.staffRole !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: 'STAFF_ID_REQUIRED', message: 'Staff ID is required' } },
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
        { success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff not found' } },
        { status: 404 }
      );
    }

    // Check if user has permission to delete
    if (existingStaff.businessId !== session.user.businessId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED_DELETE', message: 'Unauthorized to delete this staff member' } },
        { status: 403 }
      );
    }

    await prisma.staff.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: { message: 'Staff deleted successfully' } });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return NextResponse.json(
      { success: false, error: { code: 'STAFF_DELETE_ERROR', message: 'Failed to delete staff' } },
      { status: 500 }
    );
  }
} 