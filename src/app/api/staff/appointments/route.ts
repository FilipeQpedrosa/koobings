import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.businessId) {
    return NextResponse.json({ error: 'Unauthorized or missing business context' }, { status: 401 });
  }
  const businessId = session.user.businessId;
  const { searchParams } = new URL(req.url);
  const staffId = searchParams.get('staffId');
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  if (!staffId) {
    return NextResponse.json({ error: 'Missing staffId' }, { status: 400 });
  }
  // Ensure staff belongs to business
  const staff = await prisma.staff.findFirst({ where: { id: staffId, businessId } });
  if (!staff) {
    return NextResponse.json({ error: 'Staff not found for this business' }, { status: 404 });
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
    return NextResponse.json(
      appointments.map((apt: any) => ({
        id: apt.id,
        scheduledFor: apt.scheduledFor,
        duration: apt.duration,
        serviceName: apt.service?.name || '',
        status: apt.status,
      }))
    );
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
} 