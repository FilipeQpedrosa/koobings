import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ServiceFiltersState } from '@/hooks/useServiceFilters';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const sort = (searchParams.get('sort') || 'name') as 'name' | 'price-asc' | 'price-desc' | 'duration';
    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = searchParams.get('maxPrice') === 'Infinity' ? undefined : Number(searchParams.get('maxPrice'));
    const duration = searchParams.get('duration') ? Number(searchParams.get('duration')) : null;

    const services = await prisma.service.findMany({
      where: {
        OR: search ? [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { category: { name: { contains: search, mode: 'insensitive' } } },
          { providers: { some: { name: { contains: search, mode: 'insensitive' } } } }
        ] : undefined,
        price: {
          gte: minPrice,
          ...(maxPrice && { lte: maxPrice })
        },
        ...(duration && { duration })
      },
      include: {
        category: true,
        providers: true
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

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
} 