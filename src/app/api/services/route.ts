import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);

    if (!user) {
      console.error('Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    let businessId: string;

    // Handle both staff members and business owners
    if (user.role === 'BUSINESS_OWNER') {
      if (!user.businessId) {
        return NextResponse.json({ success: false, error: { code: 'BUSINESS_ID_MISSING', message: 'Business ID missing' } }, { status: 400 });
      }
      businessId = user.businessId;
    } else {
      // Get business from staff using email instead of id
      const staff = await prisma.staff.findUnique({
        where: { email: user.email }
      });

      if (!staff) {
        console.error('Staff not found for user:', user.email);
        return NextResponse.json({ success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff not found' } }, { status: 404 });
      }

      businessId = staff.businessId;
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
          { description: { contains: search, mode: 'insensitive' } }
        ] : undefined,
        price: {
          gte: minPrice,
          ...(maxPrice && { lte: maxPrice })
        },
        ...(duration && { duration })
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

export async function POST(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);

    if (!user) {
      console.error('Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    let businessId: string;
    let hasAdminPermission = false;

    // Handle both staff members and business owners
    if (user.role === 'BUSINESS_OWNER') {
      if (!user.businessId) {
        return NextResponse.json({ success: false, error: { code: 'BUSINESS_ID_MISSING', message: 'Business ID missing' } }, { status: 400 });
      }
      businessId = user.businessId;
      hasAdminPermission = true;
    } else {
      // Get business from staff using email instead of id
      const staff = await prisma.staff.findUnique({
        where: { email: user.email }
      });

      if (!staff || staff.role !== 'ADMIN') {
        console.error('Unauthorized: Not admin staff.');
        return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } }, { status: 401 });
      }

      businessId = staff.businessId;
    }

    if (!hasAdminPermission) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } }, { status: 401 });
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
        businessId,
        ...(categoryId ? { categoryId } : {}),
      },
    });
    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ success: false, error: { code: 'SERVICE_CREATE_ERROR', message: 'Failed to create service' } }, { status: 500 });
  }
} 