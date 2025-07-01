import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH: Update a service (staff with ADMIN or canViewSettings)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(request: Request) {
  const { pathname } = new URL(request.url);
  const segments = pathname.split('/');
  const id = segments[segments.length - 1];
  
  try {
    // Try to get business from subdomain header first, then fall back to session
    let business;
    const businessName = request.headers.get('x-business');
    
    if (businessName) {
      business = await prisma.business.findFirst({ where: { name: businessName } });
    } else {
      // Fallback: get business from session
      const session = await getServerSession(authOptions);
      if (!session?.user?.businessId) {
        return NextResponse.json({ error: 'Business subdomain missing and no valid session' }, { status: 400 });
      }
      business = await prisma.business.findFirst({ where: { id: session.user.businessId } });
    }
    
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    
    const serviceId = id;
    const body = await request.json();
    const { name, duration, price, categoryId, description } = body;
    if (!name || !duration || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Ensure the service belongs to this business
    const service = await prisma.service.findFirst({ where: { id: serviceId, businessId: business.id } });
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    const data: any = {
      name,
      duration: Number(duration),
      price: Number(price),
      description: description || undefined,
    };
    if (categoryId) data.categoryId = categoryId;
    const updated = await prisma.service.update({
      where: { id: serviceId },
      data,
      include: { category: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

// DELETE: Remove a service (staff with ADMIN or canViewSettings)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const segments = pathname.split('/');
  const serviceId = segments[segments.length - 1];
  
  try {
    // Try to get business from subdomain header first, then fall back to session
    let business;
    const businessName = request.headers.get('x-business');
    
    if (businessName) {
      business = await prisma.business.findFirst({ where: { name: businessName } });
    } else {
      // Fallback: get business from session
      const session = await getServerSession(authOptions);
      if (!session?.user?.businessId) {
        return NextResponse.json({ error: 'Business subdomain missing and no valid session' }, { status: 400 });
      }
      business = await prisma.business.findFirst({ where: { id: session.user.businessId } });
    }
    
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    
    // Ensure the service belongs to this business
    const service = await prisma.service.findFirst({ where: { id: serviceId, businessId: business.id } });
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    // Find all staff with this service
    const staffWithService = await prisma.staff.findMany({
      where: { services: { some: { id: serviceId } } },
      select: { id: true },
    });
    // Disconnect the service from each staff member
    for (const staff of staffWithService) {
      await prisma.staff.update({
        where: { id: staff.id },
        data: { services: { disconnect: { id: serviceId } } },
      });
    }
    // Delete the service
    await prisma.service.delete({ where: { id: serviceId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
} 