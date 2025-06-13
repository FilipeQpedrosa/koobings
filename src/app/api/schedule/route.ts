import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for staff availability schedule JSON
const staffAvailabilitySchema = z.object({
  staffId: z.string(),
  schedule: z.record(z.any()), // Accepts any JSON for schedule
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const staffId = searchParams.get('staffId');

    if (staffId) {
      const availability = await prisma.staffAvailability.findUnique({
        where: { staffId },
        include: {
          staff: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      });
      return NextResponse.json({ success: true, data: availability });
    } else {
      const availabilities = await prisma.staffAvailability.findMany({
        include: {
          staff: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      });
      return NextResponse.json({ success: true, data: availabilities });
    }
  } catch (error) {
    console.error('Error fetching staff availabilities:', error);
    return NextResponse.json(
      { success: false, error: { code: 'AVAILABILITY_FETCH_ERROR', message: 'Failed to fetch staff availabilities' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['BUSINESS_OWNER', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const data = await request.json();
    const validatedData = staffAvailabilitySchema.parse(data);

    // If staff member, can only modify own schedule
    if (session.user.role === 'STAFF' && validatedData.staffId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED_MODIFY', message: 'Unauthorized to modify other staff schedules' } },
        { status: 403 }
      );
    }

    // Upsert staff availability (one per staff)
    const availability = await prisma.staffAvailability.upsert({
      where: { staffId: validatedData.staffId },
      update: { schedule: validatedData.schedule },
      create: {
        staffId: validatedData.staffId,
        schedule: validatedData.schedule,
      },
      include: {
        staff: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: availability });
  } catch (error) {
    console.error('Error creating/updating staff availability:', error);
    return NextResponse.json(
      { success: false, error: { code: 'AVAILABILITY_CREATE_UPDATE_ERROR', message: 'Failed to create/update staff availability' } },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['BUSINESS_OWNER', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { staffId, schedule } = data;

    if (!staffId) {
      return NextResponse.json(
        { success: false, error: { code: 'STAFF_ID_REQUIRED', message: 'Staff ID is required' } },
        { status: 400 }
      );
    }

    // Verify access
    if (session.user.role === 'STAFF' && staffId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED_UPDATE', message: 'Unauthorized to update this schedule' } },
        { status: 403 }
      );
    }

    const availability = await prisma.staffAvailability.update({
      where: { staffId },
      data: { schedule },
      include: {
        staff: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: availability });
  } catch (error) {
    console.error('Error updating staff availability:', error);
    return NextResponse.json(
      { success: false, error: { code: 'AVAILABILITY_UPDATE_ERROR', message: 'Failed to update staff availability' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['BUSINESS_OWNER', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');

    if (!staffId) {
      return NextResponse.json(
        { success: false, error: { code: 'STAFF_ID_REQUIRED', message: 'Staff ID is required' } },
        { status: 400 }
      );
    }

    // Verify access
    if (session.user.role === 'STAFF' && staffId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED_DELETE', message: 'Unauthorized to delete this schedule' } },
        { status: 403 }
      );
    }

    await prisma.staffAvailability.delete({
      where: { staffId },
    });

    return NextResponse.json({ success: true, data: { message: 'Staff availability deleted successfully' } });
  } catch (error) {
    console.error('Error deleting staff availability:', error);
    return NextResponse.json(
      { success: false, error: { code: 'AVAILABILITY_DELETE_ERROR', message: 'Failed to delete staff availability' } },
      { status: 500 }
    );
  }
} 