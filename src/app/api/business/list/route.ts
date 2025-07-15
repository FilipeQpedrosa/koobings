import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/business/list - List all businesses (bypass Vercel auth on /admin/*)
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Business list API called - PRODUCTION VERSION');
    
    // Simple query to get all businesses with basic info
    const businesses = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        ownerName: true,
        status: true,
        slug: true,
        createdAt: true,
        phone: true,
        address: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`✅ Found ${businesses.length} businesses`);

    // Count for stats
    const totalCount = await prisma.business.count();

    return NextResponse.json({ 
      businesses,
      count: totalCount,
      success: true,
      message: `Found ${businesses.length} businesses`
    });
    
  } catch (error) {
    console.error('❌ Error fetching business list:', error);
    
    return NextResponse.json({ 
      error: 'Failed to fetch businesses', 
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
} 