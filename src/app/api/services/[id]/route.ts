import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: Request, { params }: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const businessId = session.user.businessId;
    if (!businessId) {
      return NextResponse.json({ error: 'No business context' }, { status: 400 });
    }
    const { id } = params;
    const service = await prisma.service.findFirst({
      where: { id, businessId },
      include: { category: true, staff: true },
    });
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(request: Request, { params }: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const businessId = session.user.businessId;
    if (!businessId) {
      return NextResponse.json({ error: 'No business context' }, { status: 400 });
    }
    const { id } = params;
    const body = await request.json();
    const updated = await prisma.service.updateMany({
      where: { id, businessId },
      data: body,
    });
    if (updated.count === 0) {
      return NextResponse.json({ error: 'Service not found or not authorized' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: Request, { params }: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const businessId = session.user.businessId;
    if (!businessId) {
      return NextResponse.json({ error: 'No business context' }, { status: 400 });
    }
    const { id } = params;
    const deleted = await prisma.service.deleteMany({
      where: { id, businessId },
    });
    if (deleted.count === 0) {
      return NextResponse.json({ error: 'Service not found or not authorized' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(request: Request, { params }: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const businessId = session.user.businessId;
    if (!businessId) {
      return NextResponse.json({ error: 'No business context' }, { status: 400 });
    }
    const { id } = params;
    const body = await request.json();
    const { name, duration, price, categoryId, description } = body;
    if (!name || !duration || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service || service.businessId !== businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const updated = await prisma.service.update({
      where: { id },
      data: {
        name,
        duration,
        price,
        description,
        category: categoryId ? { connect: { id: categoryId } } : { disconnect: true },
      },
      include: { category: true, staff: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
} 