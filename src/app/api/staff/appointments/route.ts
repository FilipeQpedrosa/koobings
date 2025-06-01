import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const staffId = searchParams.get('staffId');
  if (!staffId) {
    return NextResponse.json({ error: 'Missing staffId' }, { status: 400 });
  }
  try {
    const appointments = await prisma.appointment.findMany({
      where: { staffId },
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