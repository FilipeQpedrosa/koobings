import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const businessId = session.user.businessId;

    if (!businessId) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const staff = await prisma.staff.findFirst({
      where: {
        id: params.id,
        businessId
      }
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    const { serviceIds } = await request.json();

    // Verify all services belong to the business
    const services = await prisma.service.findMany({
      where: {
        id: { in: serviceIds },
        businessId
      }
    });

    if (services.length !== serviceIds.length) {
      return NextResponse.json(
        { error: 'One or more services are invalid' },
        { status: 400 }
      );
    }

    // Update staff services
    await prisma.staff.update({
      where: { id: params.id },
      data: {
        services: {
          set: serviceIds.map((id: string) => ({ id }))
        }
      }
    });

    const updatedStaff = await prisma.staff.findFirst({
      where: {
        id: params.id
      },
      include: {
        services: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true
          }
        }
      }
    });

    return NextResponse.json(updatedStaff);
  } catch (error) {
    console.error('Error updating staff services:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 