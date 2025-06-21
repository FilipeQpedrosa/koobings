import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { hash } from 'bcryptjs';
import { Prisma } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: any
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !session.user.businessId) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = session.user.businessId;

    const staff = await prisma.staff.findFirst({
      where: {
        id: params.id,
        businessId
      },
      include: {
        services: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true
          }
        },
        availability: true,
      }
    });

    if (!staff) {
      return NextResponse.json({ success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff member not found' } }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: staff });
  } catch (error) {
    console.error('GET /business/staff/[id] error:', error);
    return NextResponse.json({ success: false, error: { code: 'STAFF_FETCH_ERROR', message: error instanceof Error ? error.message : String(error) } }, { status: 500 });
  }
}

// PUT /api/business/staff/[id] - Update staff member
export async function PUT(request: Request, { params }: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.businessId || session.user.staffRole !== 'ADMIN') {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }
    const staffIdToUpdate = params.id;
    const businessId = session.user.businessId;

    // Validate input
    const schema = z.object({
      email: z.string().email(),
      name: z.string().min(1),
      role: z.enum(['ADMIN', 'MANAGER', 'STANDARD']),
      password: z.string().min(6).optional().or(z.literal('')),
      services: z.array(z.string()).optional(),
    });

    const data = await request.json();
    const { email, name, role, password, services = [] } = schema.parse(data);

    const updateData: Prisma.StaffUpdateArgs['data'] = {
      email,
      name,
      role,
      services: { set: services.map(id => ({ id })) },
    };

    if (password) {
      updateData.password = await hash(password, 10);
    }

    const updatedStaff = await prisma.staff.update({
      where: { id: staffIdToUpdate, businessId },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedStaff });
  } catch (error) {
    console.error('PUT /business/staff/[id] error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_INPUT', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }, { status: 500 });
  }
}

// DELETE /api/business/staff/[id] - Delete staff member
export async function DELETE(request: Request, { params }: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.businessId || session.user.staffRole !== 'ADMIN') {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }
    const staffIdToDelete = params.id;
    const businessId = session.user.businessId;

    // Ensure we don't delete the last admin
    if (session.user.id === staffIdToDelete) {
      return NextResponse.json({ success: false, error: { code: 'CANNOT_DELETE_SELF', message: 'You cannot delete your own account.' } }, { status: 400 });
    }

    await prisma.staff.delete({
      where: {
        id: staffIdToDelete,
        businessId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /business/staff/[id] error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }, { status: 500 });
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future. 