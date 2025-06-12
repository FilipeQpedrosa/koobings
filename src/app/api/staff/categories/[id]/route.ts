import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(request: NextRequest, { params }: any) {
  try {
    const businessName = request.headers.get('x-business');
    if (!businessName) {
      return NextResponse.json({ error: 'Business subdomain missing' }, { status: 400 });
    }
    const business = await prisma.business.findFirst({ where: { name: businessName } });
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    const body = await request.json();
    const { name, description, color } = body;
    // Check if category exists and belongs to business
    const category = await prisma.serviceCategory.findFirst({
      where: { id: params.id, businessId: business.id },
    });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    const updated = await prisma.serviceCategory.update({
      where: { id: params.id },
      data: { name, description, color },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const businessName = request.headers.get('x-business');
    if (!businessName) {
      return NextResponse.json({ error: 'Business subdomain missing' }, { status: 400 });
    }
    const business = await prisma.business.findFirst({ where: { name: businessName } });
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    // Check if category exists and belongs to business
    const category = await prisma.serviceCategory.findFirst({
      where: { id: params.id, businessId: business.id },
      include: { services: { select: { id: true } } },
    });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    if (category.services.length > 0) {
      return NextResponse.json({ error: 'Cannot delete category with existing services' }, { status: 400 });
    }
    await prisma.serviceCategory.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
} 