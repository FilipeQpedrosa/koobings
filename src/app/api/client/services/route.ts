import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET /api/client/services - Browse available services
export async function GET(request: Request) {
  try {
    // Try to get businessId from session if available
    let businessId = null;
    try {
      const session = await getServerSession(authOptions);
      businessId = session?.user?.businessId || null;
    } catch {}
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const staffId = searchParams.get('staffId');

    // Fetch all services with their categories and providers, filtered by businessId if available
    const services = await prisma.service.findMany({
      where: {
        ...(businessId ? { businessId } : {}),
        categoryId: categoryId || undefined,
        name: search ? {
          contains: search,
          mode: 'insensitive',
        } : undefined,
        staff: staffId ? {
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
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
            // schedules: true, // Only include if schedules is a valid field on Staff
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
      return NextResponse.json({ success: true, data: [] });
    }

    // Group services by category
    const groupedServices = services.reduce((acc, service) => {
      const categoryName = service.category?.name || service.categoryId || 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(service);
      return acc;
    }, {} as Record<string, typeof services>);

    return NextResponse.json({ success: true, data: groupedServices });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVICES_FETCH_ERROR', message: 'Failed to fetch services' } },
      { status: 500 }
    );
  }
} 