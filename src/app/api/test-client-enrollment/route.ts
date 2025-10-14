import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 TEST CLIENT ENROLLMENT - Starting...');
    
    // Test authentication
    const user = getRequestAuthUser(request);
    console.log('🔍 User from token:', user);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'UNAUTHORIZED', message: 'No user found in token' } 
      }, { status: 401 });
    }

    const businessId = user.businessId;
    console.log('🔍 Business ID from token:', businessId);
    
    if (!businessId) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'BUSINESS_ID_MISSING', message: 'No business ID in token' } 
      }, { status: 400 });
    }

    // Get all clients for this business
    const clients = await prisma.client.findMany({
      where: { businessId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isEligible: true,
        businessId: true
      },
      orderBy: { name: 'asc' }
    });

    console.log('🔍 Found clients:', clients.length);

    // Get all services for this business
    const services = await prisma.service.findMany({
      where: { 
        businessId,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        duration: true,
        price: true,
        slots: true
      },
      orderBy: { name: 'asc' }
    });

    console.log('🔍 Found services:', services.length);

    // Test creating a simple appointment
    const testClient = clients[0];
    const testService = services[0];
    
    if (!testClient || !testService) {
      return NextResponse.json({
        success: true,
        data: {
          message: 'No clients or services found to test with',
          clientsCount: clients.length,
          servicesCount: services.length,
          clients: clients,
          services: services
        }
      });
    }

    // Try to create a test appointment
    const testDate = new Date();
    testDate.setHours(10, 0, 0, 0); // 10:00 AM today

    const testAppointment = await prisma.appointments.create({
      data: {
        id: `test-${Date.now()}`,
        scheduledFor: testDate,
        duration: testService.duration,
        status: 'CONFIRMED',
        notes: 'Test appointment',
        staffId: null, // Will be assigned later
        clientId: testClient.id,
        serviceId: testService.id,
        businessId: businessId
      },
      include: {
        Client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        Service: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    console.log('🔍 Test appointment created:', testAppointment.id);

    // Clean up - delete the test appointment
    await prisma.appointments.delete({
      where: { id: testAppointment.id }
    });

    console.log('🔍 Test appointment cleaned up');

    return NextResponse.json({
      success: true,
      data: {
        message: 'Client enrollment test successful',
        user: {
          id: user.id,
          email: user.email,
          businessId: user.businessId,
          role: user.role
        },
        businessId: businessId,
        clientsCount: clients.length,
        servicesCount: services.length,
        testClient: {
          id: testClient.id,
          name: testClient.name,
          email: testClient.email,
          isEligible: testClient.isEligible
        },
        testService: {
          id: testService.id,
          name: testService.name,
          duration: testService.duration
        },
        testAppointment: {
          id: testAppointment.id,
          clientName: testAppointment.Client.name,
          serviceName: testAppointment.Service.name,
          scheduledFor: testAppointment.scheduledFor
        }
      }
    });

  } catch (error: any) {
    console.error('❌ TEST CLIENT ENROLLMENT ERROR:', error);
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'TEST_ERROR', 
        message: error.message || 'Internal Server Error',
        stack: error.stack,
        details: {
          name: error.name,
          cause: error.cause
        }
      } 
    }, { status: 500 });
  }
}
