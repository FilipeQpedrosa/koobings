import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { startOfWeek, endOfWeek, parseISO } from 'date-fns';

// GET: Get staff schedule
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: Request, { params }: any) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = session.user.businessId;

    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } }, { status: 404 });
    }

    const url = new URL(request.url);
    const weekParam = url.searchParams.get('week');
    let weekStart, weekEnd;
    if (weekParam) {
      const weekDate = parseISO(weekParam);
      weekStart = startOfWeek(weekDate, { weekStartsOn: 0 });
      weekEnd = endOfWeek(weekDate, { weekStartsOn: 0 });
    } else {
      // Default to current week
      const now = new Date();
      weekStart = startOfWeek(now, { weekStartsOn: 0 });
      weekEnd = endOfWeek(now, { weekStartsOn: 0 });
    }

    const staff = await prisma.staff.findFirst({
      where: {
        id: params.id,
        businessId
      },
      include: {
        availability: true,
        appointments: {
          where: {
            scheduledFor: {
              gte: weekStart,
              lte: weekEnd
            },
            status: { in: ['PENDING', 'CONFIRMED'] }
          },
          select: {
            id: true,
            scheduledFor: true,
            duration: true,
            status: true,
            client: { select: { id: true, name: true } },
            service: { select: { id: true, name: true } }
          }
        }
      }
    });

    if (!staff) {
      return NextResponse.json({ success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff member not found' } }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {
      availability: staff.availability?.schedule || {},
      appointments: staff.appointments
    }});
  } catch (error) {
    console.error('Error fetching staff schedule:', error);
    return NextResponse.json({ success: false, error: { code: 'STAFF_SCHEDULE_FETCH_ERROR', message: 'Internal server error' } }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(request: Request, { params }: any) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = session.user.businessId;

    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } }, { status: 404 });
    }

    const staff = await prisma.staff.findFirst({
      where: {
        id: params.id,
        businessId
      }
    });

    if (!staff) {
      return NextResponse.json({ success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff member not found' } }, { status: 404 });
    }

    const { schedule } = await request.json();

    // Update the schedule JSON for the staff member
    const updated = await prisma.staffAvailability.update({
      where: { staffId: params.id },
      data: { schedule }
    });

    return NextResponse.json({ success: true, data: { schedule: updated.schedule } });
  } catch (error) {
    console.error('Error updating staff schedule:', error);
    return NextResponse.json({ success: false, error: { code: 'STAFF_SCHEDULE_UPDATE_ERROR', message: 'Internal server error' } }, { status: 500 });
  }
} 