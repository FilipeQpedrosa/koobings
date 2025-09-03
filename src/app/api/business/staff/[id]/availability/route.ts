import { NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const user = getRequestAuthUser(request);

    if (!user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;

    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } }, { status: 404 });
    }

    const url = new URL(request.url);
    const staffId = url.pathname.split('/').slice(-2)[0]; // Extract staff ID from URL

    console.log(`🔍 [STAFF AVAILABILITY GET] Loading availability for staff: ${staffId}`);

    const availability = await prisma.staffAvailability.findUnique({
      where: { staffId: staffId }
    });

    if (!availability) {
      console.log(`📋 [STAFF AVAILABILITY GET] No availability record found for staff ${staffId}, returning empty schedule`);
    } else {
      console.log(`✅ [STAFF AVAILABILITY GET] Found availability for staff ${staffId}:`, JSON.stringify(availability.schedule, null, 2));
    }

    return NextResponse.json({ success: true, data: availability || { schedule: {} } });
  } catch (error) {
    console.error('Error fetching staff availability:', error);
    return NextResponse.json({ success: false, error: { code: 'STAFF_AVAILABILITY_FETCH_ERROR', message: 'Internal server error' } }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(request: Request) {
  try {
    const user = getRequestAuthUser(request);

    if (!user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;

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

    console.log(`💾 [STAFF AVAILABILITY PUT] Saving availability for staff: ${staffId}`);
    console.log(`📋 [STAFF AVAILABILITY PUT] Schedule data:`, JSON.stringify(schedule, null, 2));

    // Upsert the schedule JSON for the staff member (create if doesn't exist, update if exists)
    const updated = await prisma.staffAvailability.upsert({
      where: { staffId: staffId },
      create: {
        id: `${staffId}_availability_${Date.now()}`,
        staffId: staffId,
        schedule: schedule
      },
      update: {
        schedule: schedule
      }
    });

    console.log(`✅ [STAFF AVAILABILITY PUT] Successfully saved availability for staff: ${staffId}`);

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating staff availability:', error);
    return NextResponse.json({ success: false, error: { code: 'STAFF_AVAILABILITY_UPDATE_ERROR', message: 'Internal server error' } }, { status: 500 });
  }
} 