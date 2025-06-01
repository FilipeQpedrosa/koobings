import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { addDays } from 'date-fns';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const email = session.user.email;
  const now = new Date();

  const staff = await prisma.staff.findUnique({
    where: { email },
    include: {
      appointments: {
        include: {
          client: true,
          service: true,
        },
        orderBy: {
          scheduledFor: 'asc',
        },
      },
    },
  });
  if (!staff) {
    return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
  }

  const totalAppointments = await prisma.appointment.count({
    where: { staffId: staff.id },
  });
  const completedAppointments = await prisma.appointment.count({
    where: { staffId: staff.id, status: 'COMPLETED' },
  });
  const upcomingAppointmentsCount = await prisma.appointment.count({
    where: {
      staffId: staff.id,
      status: 'PENDING',
      scheduledFor: { gte: now },
    },
  });
  const clientIds = await prisma.appointment.findMany({
    where: { staffId: staff.id },
    select: { clientId: true },
  });
  const totalClients = new Set(clientIds.map(c => c.clientId)).size;
  const weekFromNow = addDays(now, 7);
  const upcomingAppointments = staff.appointments
    .filter(apt => apt.scheduledFor >= now && apt.scheduledFor <= weekFromNow)
    .map(apt => ({
      id: apt.id,
      clientName: apt.client.name,
      serviceName: apt.service.name,
      dateTime: apt.scheduledFor,
      status: apt.status,
      duration: apt.duration,
    }));
  const completionRate = totalAppointments > 0
    ? Math.round((completedAppointments / totalAppointments) * 100)
    : 0;

  // Check for canViewAllBookings permission
  const canViewAllBookings = Array.isArray(session.user.permissions) && session.user.permissions.includes('canViewAllBookings');

  let appointmentsQuery = {};
  if (canViewAllBookings) {
    // Show all bookings for the business
    appointmentsQuery = { businessId: staff.businessId };
  } else {
    // Only show bookings for this staff
    appointmentsQuery = { staffId: staff.id };
  }

  const recentAppointments = await prisma.appointment.findMany({
    where: appointmentsQuery,
    include: {
      client: true,
      service: true,
    },
    orderBy: { scheduledFor: 'desc' },
    take: 20,
  });
  return NextResponse.json({
    stats: {
      totalAppointments,
      upcomingAppointments: upcomingAppointmentsCount,
      totalClients,
      completionRate,
    },
    appointments: recentAppointments.map(apt => ({
      id: apt.id,
      clientName: apt.client?.name || 'Unknown',
      serviceName: apt.service?.name || 'Unknown',
      dateTime: apt.scheduledFor,
      status: apt.status,
      duration: apt.duration,
    })),
  });
} 