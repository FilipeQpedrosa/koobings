import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get('date');
    if (!dateParam) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_DATE', message: 'Missing date parameter' } }, { status: 400 });
    }
    const date = new Date(dateParam);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_DATE', message: 'Invalid date parameter' } }, { status: 400 });
    }

    // Calculate start and end of the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Filter by business if user is a business owner
    const where: any = {
      scheduledFor: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };
    if (session.user.role === 'BUSINESS_OWNER') {
      where.businessId = session.user.businessId;
    } else if (session.user.role === 'STAFF') {
      where.staffId = session.user.id;
    }

    // Count all bookings for today
    const booked = await prisma.appointments.count({ where });
    // Count completed bookings for today
    const completed = await prisma.appointments.count({
      where: {
        ...where,
        status: 'COMPLETED',
      },
    });

    return NextResponse.json({ success: true, data: { booked, completed } });
  } catch (error) {
    console.error('Error fetching appointment summary:', error);
    return NextResponse.json({ success: false, error: { code: 'SUMMARY_FETCH_ERROR', message: 'Failed to fetch summary' } }, { status: 500 });
  }
} 