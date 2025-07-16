import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(req: NextRequest) {
  const user = getRequestAuthUser(req);
  if (!user?.businessId) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED_OR_MISSING_BUSINESS', message: 'Unauthorized or missing business context' } }, { status: 401 });
  }
  const businessId = user.businessId;
  const { searchParams } = new URL(req.url);

  // Optional date filters
  const startDateStr = searchParams.get('startDate');
  const endDateStr = searchParams.get('endDate');
  const limit = searchParams.get('limit');

  try {
    const where: any = { businessId };

    if (startDateStr) {
      const startDate = startOfDay(new Date(startDateStr));
      const endDate = endDateStr ? endOfDay(new Date(endDateStr)) : endOfDay(new Date(startDateStr));
      
      where.scheduledFor = {
        gte: startDate,
        lte: endDate,
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      take: limit ? parseInt(limit, 10) : undefined,
      orderBy: { scheduledFor: 'desc' },
      include: {
        service: { select: { name: true } },
        client: { select: { name: true } }
      },
    });

    return NextResponse.json(appointments); // Directly return the enhanced appointment objects

  } catch (e) {
    console.error("Error fetching appointments:", e);
    return NextResponse.json({ success: false, error: { code: 'APPOINTMENTS_FETCH_ERROR', message: 'Failed to fetch appointments' } }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method Not Allowed' } }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method Not Allowed' } }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method Not Allowed' } }, { status: 405 });
} 