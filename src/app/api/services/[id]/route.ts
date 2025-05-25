import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service || service.businessId !== businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
} 