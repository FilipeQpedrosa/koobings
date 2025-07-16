import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This is a public endpoint that bypasses all authentication middleware
export async function GET(request: NextRequest) {
  try {
    console.log('📡 Public businesses endpoint called');
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    
    // Simple database query with no authentication required
    const businesses = await prisma.business.findMany({
      where: {
        status: 'ACTIVE',
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { ownerName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
          ]
        })
      },
      select: {
        id: true,
        name: true,
        email: true,
        ownerName: true,
        phone: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            Staff: true,
            appointments: true,
            Service: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit results
    });

    console.log(`✅ Found ${businesses.length} businesses`);

    return NextResponse.json({
      success: true,
      businesses: businesses.map(business => ({
        id: business.id,
        name: business.name,
        email: business.email,
        ownerName: business.ownerName,
        phone: business.phone || '',
        plan: 'standard', // Default plan for display
        status: business.status,
        features: {}, // Empty features for display
        createdAt: business.createdAt.toISOString(),
        _count: {
          staff: business._count.Staff,
          appointments: business._count.appointments,
          services: business._count.Service
        }
      })),
      total: businesses.length
    });

  } catch (error) {
    console.error('❌ Public businesses endpoint error:', error);
    
    // Return empty array instead of error to prevent breaking UI
    return NextResponse.json({
      success: true,
      businesses: [],
      total: 0,
      error: 'Database temporarily unavailable'
    });
  }
} 