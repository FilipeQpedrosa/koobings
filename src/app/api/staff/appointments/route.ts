import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.businessId) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED_OR_MISSING_BUSINESS', message: 'Unauthorized or missing business context' } }, { status: 401 });
  }
  const businessId = session.user.businessId;
  const { searchParams } = new URL(req.url);
  const staffId = searchParams.get('staffId');
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  if (!staffId) {
    return NextResponse.json({ success: false, error: { code: 'MISSING_STAFF_ID', message: 'Missing staffId' } }, { status: 400 });
  }
  // Ensure staff belongs to business
  const staff = await prisma.staff.findFirst({ where: { id: staffId, businessId } });
  if (!staff) {
    return NextResponse.json({ success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff not found for this business' } }, { status: 404 });
  }
  try {
    const where: any = { staffId };
    if (start && end) {
      where.scheduledFor = {
        gte: new Date(start),
        lte: new Date(end),
      };
    }
    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { scheduledFor: 'asc' },
      include: {
        service: { select: { name: true } },
      },
    });
    return NextResponse.json({ success: true, data: appointments.map((apt: any) => ({
      id: apt.id,
      scheduledFor: apt.scheduledFor,
      duration: apt.duration,
      serviceName: apt.service?.name || '',
      status: apt.status,
    })) });
  } catch (e) {
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