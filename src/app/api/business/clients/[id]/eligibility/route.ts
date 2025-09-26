import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('🔄 Updating client eligibility status...');
    
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

    const clientId = params.id;
    const body = await request.json();
    const { isEligible } = body;

    if (typeof isEligible !== 'boolean') {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'INVALID_DATA', message: 'isEligible must be a boolean' } 
      }, { status: 400 });
    }

    // Check if client exists and belongs to business
    const existingClient = await prisma.client.findUnique({
      where: { 
        id: clientId,
        businessId 
      }
    });

    if (!existingClient) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'CLIENT_NOT_FOUND', message: 'Client not found' } 
      }, { status: 404 });
    }

    // Update client eligibility
    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: { 
        isEligible,
        updatedAt: new Date()
      },
    });

    console.log('✅ Client eligibility updated:', {
      clientId,
      isEligible,
      updatedBy: user.email
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedClient.id,
        name: updatedClient.name,
        isEligible: updatedClient.isEligible
      }
    });

  } catch (error) {
    console.error('❌ PATCH /business/clients/[id]/eligibility error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : 'Internal Error'
      }
    }, { status: 500 });
  }
}
