import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Simple test endpoint to check if database and APIs are working
export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Testing database connection...');
    
    // Test database connection
    const appointmentCount = await prisma.appointment.count();
    const clientCount = await prisma.client.count();
    const serviceCount = await prisma.service.count();
    const businessCount = await prisma.business.count();
    
    console.log('📊 Database stats:', {
      appointments: appointmentCount,
      clients: clientCount,
      services: serviceCount,
      businesses: businessCount
    });
    
    // Test a simple appointment query
    const recentAppointments = await prisma.appointment.findMany({
      take: 3,
      include: {
        client: {
          select: {
            name: true,
            isDeleted: true
          }
        },
        service: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Database connection working',
      stats: {
        appointments: appointmentCount,
        clients: clientCount,
        services: serviceCount,
        businesses: businessCount
      },
      recentAppointments: recentAppointments.map(apt => ({
        id: apt.id,
        clientName: apt.client?.name,
        serviceName: apt.service?.name,
        scheduledFor: apt.scheduledFor,
        status: apt.status,
        clientDeleted: apt.client?.isDeleted
      }))
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