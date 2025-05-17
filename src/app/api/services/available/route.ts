import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Service, ServiceCategory } from '@prisma/client';

type ServiceWithCategory = Service & {
  category: ServiceCategory | null;
};

export async function GET() {
  try {
    // Fetch all active services with their categories
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Group services by category
    const groupedServices = services.reduce((acc, service) => {
      const categoryName = service.category?.name || 'Other';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(service);
      return acc;
    }, {} as Record<string, ServiceWithCategory[]>);

    return NextResponse.json(groupedServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
} 