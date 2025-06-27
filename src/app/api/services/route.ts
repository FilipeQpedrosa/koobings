import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }
    const businessId = session.user.businessId;
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'NO_BUSINESS_CONTEXT', message: 'No business context' } }, { status: 400 });
    }
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const sort = (searchParams.get('sort') || 'name') as 'name' | 'price-asc' | 'price-desc' | 'duration';
    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = searchParams.get('maxPrice') === 'Infinity' ? undefined : Number(searchParams.get('maxPrice'));
    const duration = searchParams.get('duration') ? Number(searchParams.get('duration')) : null;

    const services = await prisma.service.findMany({
      where: {
        businessId,
        OR: search ? [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { category: { name: { contains: search, mode: 'insensitive' } } },
          { staff: { some: { name: { contains: search, mode: 'insensitive' } } } }
        ] : undefined,
        price: {
          gte: minPrice,
          ...(maxPrice && { lte: maxPrice })
        },
        ...(duration && { duration })
      },
      include: {
        category: true,
        staff: true
      },
      orderBy: (() => {
        switch (sort) {
          case 'name':
            return { name: 'asc' };
          case 'price-asc':
            return { price: 'asc' };
          case 'price-desc':
            return { price: 'desc' };
          case 'duration':
            return { duration: 'asc' };
          default:
            return { name: 'asc' };
        }
      })()
    });

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVICES_FETCH_ERROR', message: 'Failed to fetch services' } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }
    const businessId = session.user.businessId;
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'NO_BUSINESS_CONTEXT', message: 'No business context' } }, { status: 400 });
    }
    const body = await request.json();
    const { name, duration, price, categoryId, description } = body;
    if (!name || !duration || !price) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_FIELDS', message: 'Missing required fields' } }, { status: 400 });
    }
    const service = await prisma.service.create({
      data: {
        name,
        duration,
        price,
        description,
        business: { connect: { id: businessId } },
        ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
      },
      include: { category: true, staff: true },
    });
    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ success: false, error: { code: 'SERVICE_CREATE_ERROR', message: 'Failed to create service' } }, { status: 500 });
  }
} 