import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const updateDescriptionSchema = z.object({
  description: z.string(),
});

export async function PATCH(request: NextRequest, { params }: { params: { slotId: string } }) {
  try {
    console.log(`📝 PATCH /api/slots/${params.slotId}/description - Updating slot description...`);
    
    // Authentication check
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

    // Check if user is staff or business owner
    if (user.role !== 'STAFF' && user.role !== 'BUSINESS_OWNER' && !user.isAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'FORBIDDEN', message: 'Only staff can update descriptions' } 
      }, { status: 403 });
    }

    const slotId = params.slotId;
    const body = await request.json();
    const validatedData = updateDescriptionSchema.parse(body);

    console.log('📝 Description update data:', validatedData);

    // Parse slot ID format: serviceId-day-startTime
    const slotIdParts = slotId.split('-');
    if (slotIdParts.length < 3) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'INVALID_SLOT_ID', message: 'Invalid slot ID format' } 
      }, { status: 400 });
    }

    const serviceId = slotIdParts.slice(0, -2).join('-');
    console.log('📝 Service ID:', serviceId);

    // Find the service
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        businessId
      }
    });

    if (!service) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } 
      }, { status: 404 });
    }

    // Update service description
    const updatedService = await prisma.service.update({
      where: { id: service.id },
      data: {
        description: validatedData.description,
        updatedAt: new Date()
      }
    });

    console.log('✅ Description updated successfully for service:', updatedService.id);

    return NextResponse.json({
      success: true,
      data: {
        description: updatedService.description
      }
    });

  } catch (error) {
    console.error('❌ PATCH /api/slots/[slotId]/description error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : 'Internal Error'
      }
    }, { status: 500 });
  }
}
