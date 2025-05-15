import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/providers - Get all providers with their services
export async function GET() {
  try {
    const providers = await prisma.staff.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(providers);
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
} 