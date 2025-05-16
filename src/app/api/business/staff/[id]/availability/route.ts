import { NextResponse } from 'next/server';
import { prisma, type PrismaClient } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { startOfWeek, endOfWeek, parseISO } from 'date-fns';

interface AvailabilitySlot {
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  type: 'REGULAR' | 'EXCEPTION';
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const businessId = session.user.businessId;

    if (!businessId) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const url = new URL(request.url);
    const weekParam = url.searchParams.get('week');
    
    if (!weekParam) {
      return NextResponse.json({ error: 'Week parameter is required' }, { status: 400 });
    }

    const weekDate = parseISO(weekParam);
    const weekStart = startOfWeek(weekDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(weekDate, { weekStartsOn: 0 });

    const availability = await prisma.staffAvailability.findMany({
      where: {
        staffId: params.id,
        date: {
          gte: weekStart,
          lte: weekEnd
        }
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error fetching staff availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const businessId = session.user.businessId;

    if (!businessId) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const staff = await prisma.staff.findFirst({
      where: {
        id: params.id,
        businessId
      }
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    const { slots } = await request.json() as { slots: AvailabilitySlot[] };

    // Group slots by date for batch operations
    const slotsByDate = slots.reduce((acc: Record<string, AvailabilitySlot[]>, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = [];
      }
      acc[slot.date].push(slot);
      return acc;
    }, {});

    // Process each date's slots in a transaction
    await Promise.all(
      Object.entries(slotsByDate).map(([date, dateSlots]) =>
        prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>) => {
          // Delete existing slots for the date
          await tx.staffAvailability.deleteMany({
            where: {
              staffId: params.id,
              date: parseISO(date)
            }
          });

          // Create new slots
          await tx.staffAvailability.createMany({
            data: dateSlots.map((slot) => ({
              staffId: params.id,
              date: parseISO(slot.date),
              startTime: slot.startTime,
              endTime: slot.endTime,
              isAvailable: slot.isAvailable,
              type: slot.type
            }))
          });
        })
      )
    );

    const updatedAvailability = await prisma.staffAvailability.findMany({
      where: {
        staffId: params.id,
        date: {
          in: Object.keys(slotsByDate).map(date => parseISO(date))
        }
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    });

    return NextResponse.json(updatedAvailability);
  } catch (error) {
    console.error('Error updating staff availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 