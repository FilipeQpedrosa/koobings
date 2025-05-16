import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const businessId = session.user.businessId;

    if (!businessId) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const staff = await prisma.staff.findMany({
      where: {
        businessId
      },
      include: {
        schedules: {
          select: {
            dayOfWeek: true,
            startTime: true,
            endTime: true
          }
        },
        services: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const businessId = session.user.businessId;

    if (!businessId) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const data = await request.json();
    const { email, name, role, services = [] } = data;

    if (!email || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const staff = await prisma.staff.create({
      data: {
        email,
        name,
        role,
        businessId,
        services: {
          connect: services.map((id: string) => ({ id }))
        }
      },
      include: {
        schedules: true,
        services: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error creating staff member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 