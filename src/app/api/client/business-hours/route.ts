import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dayOfWeek = searchParams.get('dayOfWeek');

    if (!dayOfWeek) {
      return NextResponse.json(
        { success: false, error: { code: 'DAY_OF_WEEK_REQUIRED', message: 'Day of week is required' } },
        { status: 400 }
      );
    }

    const businessHours = await prisma.businessHours.findFirst({
      where: {
        dayOfWeek: parseInt(dayOfWeek),
      },
    });

    if (!businessHours) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_HOURS_NOT_FOUND', message: 'Business hours not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: businessHours });
  } catch (error) {
    console.error('Error fetching business hours:', error);
    return NextResponse.json(
      { success: false, error: { code: 'BUSINESS_HOURS_FETCH_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
} 