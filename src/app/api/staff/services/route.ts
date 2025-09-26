import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/staff/services - Get staff member's services
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');

    if (staffId) {
      // Return services assigned to a specific staff member
      const services = await prisma.staff.findUnique({
        where: { id: staffId },
        include: {
          services: {
            include: {
              category: true,
            },
          },
        },
      });

      if (!services) {
        return NextResponse.json({ success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff not found' } }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: services.services });
    } else {
      // Return all services for the staff's business
      if (session.user.role !== 'STAFF') {
        return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
      }
      const businessId = session.user.businessId;
      if (!businessId) {
        return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing businessId' } }, { status: 400 });
      }
      const services = await prisma.service.findMany({
        where: { 
          businessId,
          isActive: true, // Only get active services
        },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ success: true, data: services });
    }
  } catch (error) {
    console.error('Error fetching staff services:', error);
    return NextResponse.json(
      { success: false, error: { code: 'STAFF_SERVICES_FETCH_ERROR', message: 'Failed to fetch services' } },
      { status: 500 }
    );
  }
}

// POST /api/staff/services - Update staff service assignments
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const body = await request.json();
    const { staffId, serviceIds } = body;

    if (!staffId || !serviceIds) {
      return NextResponse.json(
        { success: false, error: { code: 'STAFF_ID_AND_SERVICE_IDS_REQUIRED', message: 'Staff ID and service IDs are required' } },
        { status: 400 }
      );
    }

    const staff = await prisma.staff.update({
      where: { id: staffId },
      data: {
        services: {
          set: serviceIds.map((id: string) => ({ id })),
        },
      },
      include: {
        services: true,
      },
    });

    return NextResponse.json({ success: true, data: staff.services });
  } catch (error) {
    console.error('Error updating staff services:', error);
    return NextResponse.json({ success: false, error: { code: 'STAFF_SERVICES_UPDATE_ERROR', message: 'Failed to update services' } }, { status: 500 });
  }
} 