import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import prisma from '@/lib/prisma';
import { addDays } from 'date-fns';

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const businessId = request.headers.get('x-business');
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'BUSINESS_ID_MISSING', message: 'Business subdomain missing' } }, { status: 400 });
    }
    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      return NextResponse.json({ success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } }, { status: 404 });
    }
    const now = new Date();
    const weekFromNow = addDays(now, 7);
    // Appointments for all staff in this business
    // @ts-ignore - Schema uses 'appointments' model, TypeScript is incorrect
    const recentAppointments = await prisma.appointments.findMany({
      where: {
        businessId: business.id,
        scheduledFor: { gte: now, lte: weekFromNow },
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true
          }
        },
        staff: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { scheduledFor: 'desc' },
      take: 20,
    });
    // @ts-ignore - Schema uses 'appointments' model, TypeScript is incorrect
    const totalAppointments = await prisma.appointments.count({ where: { businessId: business.id } });
    // @ts-ignore - Schema uses 'appointments' model, TypeScript is incorrect
    const completedAppointments = await prisma.appointments.count({ where: { businessId: business.id, status: 'COMPLETED' } });
    // @ts-ignore - Schema uses 'appointments' model, TypeScript is incorrect
    const upcomingAppointmentsCount = await prisma.appointments.count({ where: { businessId: business.id, status: 'PENDING', scheduledFor: { gte: now } } });
    // @ts-ignore - Schema uses 'appointments' model, TypeScript is incorrect
    const clientIds = await prisma.appointments.findMany({ where: { businessId: business.id }, select: { clientId: true } });
    const totalClients = new Set(clientIds.map((c: any) => c.clientId)).size;
    const completionRate = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;
    return NextResponse.json({
      success: true,
      data: {
        businessName: business.name,
        stats: {
          totalAppointments,
          upcomingAppointments: upcomingAppointmentsCount,
          totalClients,
          completionRate,
        },
        appointments: recentAppointments.map((apt: any) => ({
          id: apt.id,
          clientName: apt.client?.name || 'Cliente Desconhecido',
          serviceName: apt.service?.name || 'Serviço Desconhecido',
          dateTime: apt.scheduledFor,
          status: apt.status,
          duration: apt.duration,
          client: {
            id: apt.client?.id || null,
            name: apt.client?.name || 'Cliente Desconhecido',
            email: apt.client?.email || null,
            phone: apt.client?.phone || null
          },
          services: apt.service ? [{
            id: apt.service.id,
            name: apt.service.name,
            duration: apt.service.duration,
            price: apt.service.price
          }] : [{ name: 'Serviço Desconhecido' }],
          staff: {
            id: apt.staff?.id || null,
            name: apt.staff?.name || 'Staff Desconhecido'
          }
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching staff dashboard data:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
} 