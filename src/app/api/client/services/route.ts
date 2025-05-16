import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/client/services - Browse available services
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const staffId = searchParams.get('staffId');

    // Fetch all services with their categories and providers
    const services = await prisma.service.findMany({
      where: {
        categoryId: categoryId || undefined,
        name: search ? {
          contains: search,
          mode: 'insensitive',
        } : undefined,
        providers: staffId ? {
          some: {
            id: staffId,
          },
        } : undefined,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        providers: {
          select: {
            id: true,
            name: true,
            email: true,
            schedules: true,
          },
        },
      },
      orderBy: {
        category: {
          name: 'asc',
        },
      },
    });

    // If no services found, return empty array instead of empty object
    if (!services || services.length === 0) {
      return NextResponse.json([]);
    }

    // Group services by category
    const groupedServices = services.reduce((acc, service) => {
      const categoryName = service.category?.name || 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(service);
      return acc;
    }, {} as Record<string, typeof services>);

    return NextResponse.json(groupedServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// GET /api/client/services/categories - Get service categories
export async function categories() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      include: {
        _count: {
          select: {
            services: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 