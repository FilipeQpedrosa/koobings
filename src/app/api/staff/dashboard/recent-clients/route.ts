import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface AppointmentWithClient {
  client: {
    id: string;
    name: string;
    lastVisit: Date | null;
  };
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const recentClients = await prisma.appointment.findMany({
      where: {
        staffId: session.user.id,
      },
      select: {
        client: {
          select: {
            id: true,
            name: true,
            lastVisit: true,
          },
        },
      },
      orderBy: {
        scheduledFor: 'desc',
      },
      take: 5,
      distinct: ['clientId'],
    });

    return NextResponse.json(recentClients.map((apt: AppointmentWithClient) => apt.client));
  } catch (error) {
    console.error('[RECENT_CLIENTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 