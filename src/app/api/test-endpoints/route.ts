import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Simple test endpoint to check if database and APIs are working
export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Testing database connection...');
    
    // Check if prisma is defined
    if (!prisma) {
      console.error('🚨 Prisma client is undefined!');
      return NextResponse.json({
        success: false,
        error: 'Prisma client not initialized',
        debug: {
          prismaExists: !!prisma,
          nodeEnv: process.env.NODE_ENV,
          databaseUrl: process.env.DATABASE_URL ? 'present' : 'missing'
        }
      }, { status: 500 });
    }
    
    // Test database connection with raw queries first
    const appointmentCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "appointments"`;
    const clientCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Client"`;
    const serviceCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Service"`;
    const businessCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Business"`;
    
    console.log('📊 Database stats:', {
      appointments: appointmentCount,
      clients: clientCount,
      services: serviceCount,
      businesses: businessCount
    });
    
    // Test a simple appointment query
    const recentAppointments = await prisma.$queryRaw`
      SELECT 
        a.id,
        c.name as client_name,
        s.name as service_name,
        a."scheduledFor",
        a.status
      FROM "appointments" a
      LEFT JOIN "Client" c ON a."clientId" = c.id
      LEFT JOIN "Service" s ON a."serviceId" = s.id
      ORDER BY a."createdAt" DESC
      LIMIT 3
    `;
    
    return NextResponse.json({
      success: true,
      message: 'Database connection working',
      stats: {
        appointments: Number((appointmentCount as any)[0]?.count || 0),
        clients: Number((clientCount as any)[0]?.count || 0),
        services: Number((serviceCount as any)[0]?.count || 0),
        businesses: Number((businessCount as any)[0]?.count || 0)
      },
      recentAppointments: recentAppointments || []
    });
    
  } catch (error) {
    console.error('🚨 Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 