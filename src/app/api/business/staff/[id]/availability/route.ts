import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
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
    const staffId = url.pathname.split('/').slice(-2)[0]; // Extract staff ID from URL
    
    if (!weekParam) {
      return NextResponse.json({ success: false, error: { code: 'WEEK_PARAM_REQUIRED', message: 'Week parameter is required' } }, { status: 400 });
    }

    const availability = await prisma.staffAvailability.findUnique({
      where: { staffId: staffId }
    });

    return NextResponse.json({ success: true, data: availability?.schedule || {} });
  } catch (error) {
    console.error('Error fetching staff availability:', error);
    return NextResponse.json({ success: false, error: { code: 'STAFF_AVAILABILITY_FETCH_ERROR', message: 'Internal server error' } }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(request: Request) {
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
    const staffId = url.pathname.split('/').slice(-2)[0]; // Extract staff ID from URL

    const staff = await prisma.staff.findFirst({
      where: {
        id: staffId,
        businessId
      }
    });

    if (!staff) {
      return NextResponse.json({ success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff member not found' } }, { status: 404 });
    }

    const { schedule } = await request.json();

    // Update the schedule JSON for the staff member
    const updated = await prisma.staffAvailability.update({
      where: { staffId: staffId },
      data: { schedule }
    });

    return NextResponse.json({ success: true, data: updated.schedule });
  } catch (error) {
    console.error('Error updating staff availability:', error);
    return NextResponse.json({ success: false, error: { code: 'STAFF_AVAILABILITY_UPDATE_ERROR', message: 'Internal server error' } }, { status: 500 });
  }
} 