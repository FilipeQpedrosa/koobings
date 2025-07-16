import { NextResponse, NextRequest } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    
    if (!user?.isAdmin || user.role !== 'ADMIN') {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'FORBIDDEN', message: 'Admin access required' } 
      }, { status: 403 });
    }

    // Get system statistics
    const [
      totalBusinesses,
      activeBusinesses,
      totalStaff,
    ] = await Promise.all([
      prisma.business.count(),
      prisma.business.count({ where: { status: 'ACTIVE' } }),
      prisma.staff.count(),
    ]);

    // Get appointments count using raw query to avoid model naming issues
    const appointmentsResult = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM appointments
    `;
    const totalAppointments = Number(appointmentsResult[0].count);

    // Check system health (basic check)
    let systemHealth: 'healthy' | 'warning' | 'error' = 'healthy';
    
    try {
      // Test database connection
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      systemHealth = 'error';
    }

    const stats = {
      totalBusinesses,
      activeBusinesses,
      totalStaff,
      totalAppointments,
      systemHealth,
    };

    return NextResponse.json({ 
      success: true, 
      data: stats 
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ 
      success: false, 
      error: { code: 'STATS_FETCH_ERROR', message: 'Internal Server Error' } 
    }, { status: 500 });
  }
} 