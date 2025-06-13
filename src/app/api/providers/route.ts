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

    return NextResponse.json({ success: true, data: providers });
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json(
      { success: false, error: { code: 'PROVIDERS_FETCH_ERROR', message: 'Failed to fetch providers' } },
      { status: 500 }
    );
  }
} 