import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG SERVICE DESCRIPTION - Starting...');
    
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } 
      }, { status: 401 });
    }

    const businessId = user.businessId;
    if (!businessId) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'BUSINESS_ID_MISSING', message: 'Business ID missing' } 
      }, { status: 400 });
    }

    const serviceId = request.nextUrl.searchParams.get('serviceId');
    
    console.log('🔍 Debug params:', { serviceId, businessId });

    if (!serviceId) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'SERVICE_ID_MISSING', message: 'Service ID is required' } 
      }, { status: 400 });
    }

    // Get service details
    const service = await prisma.service.findFirst({
      where: { 
        id: serviceId,
        businessId
      },
      select: {
        id: true,
        name: true,
        description: true,
        duration: true,
        price: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('🔍 Service found:', service ? 'YES' : 'NO');
    if (service) {
      console.log('🔍 Service details:', {
        id: service.id,
        name: service.name,
        description: service.description,
        descriptionLength: service.description?.length || 0,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      });
    }

    // Get all services for this business to compare
    const allServices = await prisma.service.findMany({
      where: { businessId },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { updatedAt: 'desc' }
    });

    console.log('🔍 All services:', allServices.length);
    console.log('🔍 Services with descriptions:', allServices.filter(s => s.description && s.description.trim().length > 0).length);

    return NextResponse.json({
      success: true,
      data: {
        service: service,
        allServices: allServices,
        debug: {
          serviceId,
          businessId,
          serviceFound: !!service,
          hasDescription: service?.description ? true : false,
          descriptionLength: service?.description?.length || 0
        }
      }
    });

  } catch (error: any) {
    console.error('❌ DEBUG SERVICE DESCRIPTION ERROR:', error);
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'DEBUG_ERROR', 
        message: error.message || 'Internal Server Error',
        stack: error.stack
      } 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 DEBUG SERVICE DESCRIPTION POST - Starting...');
    
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } 
      }, { status: 401 });
    }

    const businessId = user.businessId;
    if (!businessId) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'BUSINESS_ID_MISSING', message: 'Business ID missing' } 
      }, { status: 400 });
    }

    const body = await request.json();
    const { serviceId, description } = body;
    
    console.log('🔍 POST Debug params:', { serviceId, description, businessId });

    if (!serviceId) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'SERVICE_ID_MISSING', message: 'Service ID is required' } 
      }, { status: 400 });
    }

    // Update service description
    const updatedService = await prisma.service.update({
      where: { 
        id: serviceId,
        businessId 
      },
      data: {
        description: description,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        description: true,
        updatedAt: true
      }
    });

    console.log('✅ Service description updated:', {
      id: updatedService.id,
      name: updatedService.name,
      description: updatedService.description,
      updatedAt: updatedService.updatedAt
    });

    return NextResponse.json({
      success: true,
      data: {
        service: updatedService,
        debug: {
          serviceId,
          description,
          updatedAt: updatedService.updatedAt
        }
      }
    });

  } catch (error: any) {
    console.error('❌ DEBUG SERVICE DESCRIPTION POST ERROR:', error);
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'DEBUG_ERROR', 
        message: error.message || 'Internal Server Error',
        stack: error.stack
      } 
    }, { status: 500 });
  }
}
