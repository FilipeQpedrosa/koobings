import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';

export async function GET(request: NextRequest) {
  console.log('[DASHBOARD_STATS_GET] Starting request...');
  
  try {
    // Get authenticated user
    const user = getRequestAuthUser(request);
    console.log('[DASHBOARD_STATS_GET] User found:', !!user);
    console.log('[DASHBOARD_STATS_GET] User role:', user?.role);
    console.log('[DASHBOARD_STATS_GET] User businessId:', user?.businessId);

    if (!user || !['BUSINESS_OWNER', 'STAFF'].includes(user.role)) {
      console.log('[DASHBOARD_STATS_GET] Unauthorized access attempt');
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const businessId = user.businessId;
    
    if (!businessId) {
      console.log('[DASHBOARD_STATS_GET] Missing business ID');
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_ID_REQUIRED', message: 'Business ID missing' } },
        { status: 400 }
      );
    }

    console.log('[DASHBOARD_STATS_GET] Fetching stats for businessId:', businessId);

    // Calculate date ranges
    const today = new Date();
    const startToday = startOfDay(today);
    const endToday = endOfDay(today);
    const startThisWeek = startOfWeek(today);
    const endThisWeek = endOfWeek(today);

    const [
      totalAppointments,
      todayAppointments,
      upcomingAppointments,
      completedAppointments,
      totalClients
    ] = await Promise.all([
      // Total appointments for this business (exclude deleted clients)
      (prisma as any).appointments.count({
        where: { 
          businessId,
          Client: {
            isDeleted: false
          }
        }
      }),
      
      // Today's appointments (exclude deleted clients)
      (prisma as any).appointments.count({
        where: {
          businessId,
          scheduledFor: {
            gte: startToday,
            lte: endToday
          },
          Client: {
            isDeleted: false
          }
        }
      }),
      
      // Upcoming appointments (from tomorrow onwards, exclude deleted clients)
      (prisma as any).appointments.count({
        where: {
          businessId,
          scheduledFor: {
            gt: endToday
          },
          status: {
            in: ['PENDING', 'CONFIRMED']
          },
          Client: {
            isDeleted: false
          }
        }
      }),
      
      // Completed appointments this week (exclude deleted clients)
      (prisma as any).appointments.count({
        where: {
          businessId,
          scheduledFor: {
            gte: startThisWeek,
            lte: endThisWeek
          },
          status: 'COMPLETED',
          Client: {
            isDeleted: false
          }
        }
      }),
      
      // Total unique clients (exclude deleted clients)
      prisma.client.count({
        where: { 
          businessId,
          isDeleted: false
        }
      })
    ]);

    // Calculate completion rate (completed vs total this week, exclude deleted clients)
    const thisWeekTotal = await (prisma as any).appointments.count({
      where: {
        businessId,
        scheduledFor: {
          gte: startThisWeek,
          lte: endThisWeek
        },
        Client: {
          isDeleted: false
        }
      }
    });

    const completionRate = thisWeekTotal > 0 ? Math.round((completedAppointments / thisWeekTotal) * 100) : 0;

    console.log('[DASHBOARD_STATS_GET] Stats calculated successfully');
    
    return NextResponse.json({
      totalAppointments,
      todayAppointments,
      upcomingAppointments,
      totalClients,
      completionRate,
    });
  } catch (error: any) {
    console.error('[DASHBOARD_STATS_GET] Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'STATS_FETCH_ERROR', message: 'Internal error' } },
      { status: 500 }
    );
  }
} 