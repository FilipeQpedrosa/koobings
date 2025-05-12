import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { hours } = await request.json();

    // Delete existing hours
    await prisma.businessHours.deleteMany({
      where: {
        businessId: session.user.id,
      },
    });

    // Create new hours
    await prisma.businessHours.createMany({
      data: hours.map((hour: any) => ({
        businessId: session.user.id,
        dayOfWeek: hour.day,
        startTime: hour.start,
        endTime: hour.end,
        isClosed: !hour.isOpen,
      })),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving business hours:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 