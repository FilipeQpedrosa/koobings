import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const user = getRequestAuthUser(req);
    if (!user?.businessId) {
      console.error('Unauthorized: No JWT token or missing business context.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED_OR_MISSING_BUSINESS', message: 'Unauthorized or missing business context' } }, { status: 401 });
    }
    
    const businessId = user.businessId;
    const { searchParams } = new URL(req.url);

    // Optional date filters
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');
    const limit = searchParams.get('limit');

    console.log('🔧 DEBUG: Fetching appointments for businessId:', businessId);

    const where: any = { 
      businessId,
      client: {
        isDeleted: false // Only include appointments from non-deleted clients
      }
    };

    if (startDateStr) {
      const startDate = startOfDay(new Date(startDateStr));
      const endDate = endDateStr ? endOfDay(new Date(endDateStr)) : endOfDay(new Date(startDateStr));
      
      where.scheduledFor = {
        gte: startDate,
        lte: endDate,
      };
    }

    const appointments = await (prisma as any).appointments.findMany({
      where,
      take: limit ? parseInt(limit, 10) : undefined,
      orderBy: { scheduledFor: 'desc' },
      include: {
        service: { select: { name: true } },
        client: { 
          select: { 
            name: true,
            isDeleted: true
          } 
        }
      },
    });

    console.log('🔧 DEBUG: Found', appointments.length, 'appointments for business');
    console.log('🔧 DEBUG: Latest appointment:', appointments[0] ? {
      id: appointments[0].id,
      clientName: appointments[0].client?.name,
      scheduledFor: appointments[0].scheduledFor
    } : 'No appointments found');

    const response = NextResponse.json({ success: true, data: appointments });
    
    // Add anti-cache headers to ensure fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;

  } catch (e) {
    console.error("Error fetching appointments:", e);
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