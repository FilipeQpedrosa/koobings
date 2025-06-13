import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

interface RouteParams {
  params: {
    id: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: Request, { params }: any) {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(request: Request, { params }: any) {
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
      }
    });

    if (!staff) {
      return NextResponse.json({ success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff member not found' } }, { status: 404 });
    }

    // Input validation
    const schema = z.object({
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
      role: z.enum(['ADMIN', 'MANAGER', 'STANDARD']).optional(),
      phone: z.string().optional(),
      isActive: z.boolean().optional()
    });
    const data = schema.parse(await request.json());

    const updateData = { ...data };
    if (data.role) {
      updateData.role = data.role;
    }

    const updatedStaff = await prisma.staff.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json({ success: true, data: updatedStaff });
  } catch (error) {
    console.error('PUT /business/staff/[id] error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_INPUT', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'STAFF_UPDATE_ERROR', message: 'Internal server error' } }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: Request, { params }: any) {
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
      }
    });

    if (!staff) {
      return NextResponse.json({ success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff member not found' } }, { status: 404 });
    }

    // Delete staff record
    await prisma.staff.delete({
      where: { id: params.id }
    });
    console.info(`Staff member ${params.id} deleted by business ${businessId}`);
    return NextResponse.json({ success: true, data: null }, { status: 200 });
  } catch (error) {
    console.error('DELETE /business/staff/[id] error:', error);
    return NextResponse.json({ success: false, error: { code: 'STAFF_DELETE_ERROR', message: 'Internal server error' } }, { status: 500 });
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future. 