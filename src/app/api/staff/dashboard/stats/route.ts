import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { addDays, startOfDay, endOfDay } from 'date-fns';

const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'] as const;
type AppointmentStatus = typeof VALID_STATUSES[number];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const now = new Date();
    const sevenDaysFromNow = addDays(now, 7);
    const thirtyDaysAgo = addDays(now, -30);

    // Get total appointments
    const totalAppointments = await prisma.appointment.count({
      where: {
        staffId: session.user.id,
      },
    });

    // Get upcoming appointments (next 7 days)
    const upcomingAppointments = await prisma.appointment.count({
      where: {
        staffId: session.user.id,
        scheduledFor: {
          gte: startOfDay(now),
          lte: endOfDay(sevenDaysFromNow),
        },
        status: 'CONFIRMED',
      },
    });

    // Get total unique clients
    const totalClients = await prisma.appointment.findMany({
      where: {
        staffId: session.user.id,
      },
      select: {
        clientId: true,
      },
      distinct: ['clientId'],
    });

    // Get completion rate for last 30 days
    const recentAppointments = await prisma.appointment.findMany({
      where: {
        staffId: session.user.id,
        scheduledFor: {
          gte: startOfDay(thirtyDaysAgo),
          lte: endOfDay(now),
        },
        status: {
          in: ['COMPLETED', 'CANCELLED'] as AppointmentStatus[],
        },
      },
    });

    const completedAppointments = recentAppointments.filter(
      (apt) => apt.status === 'COMPLETED'
    ).length;

    const completionRate = recentAppointments.length > 0
      ? Math.round((completedAppointments / recentAppointments.length) * 100)
      : 100;

    return NextResponse.json({
      totalAppointments,
      upcomingAppointments,
      totalClients: totalClients.length,
      completionRate,
    });
  } catch (error) {
    console.error('[DASHBOARD_STATS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 