import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dayOfWeek = searchParams.get('dayOfWeek');

    if (!dayOfWeek) {
      return NextResponse.json(
        { error: 'Day of week is required' },
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
        { error: 'Business hours not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(businessHours);
  } catch (error) {
    console.error('Error fetching business hours:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 