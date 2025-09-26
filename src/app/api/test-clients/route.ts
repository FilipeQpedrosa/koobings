import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    console.log('🧪 Testing staff clients API...');
    
    const user = getRequestAuthUser(req);
    console.log('👤 User:', user ? { id: user.id, email: user.email, businessId: user.businessId } : 'No user');
    
    if (!user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;
    console.log('🏢 Business ID:', businessId);
    
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID' } }, { status: 400 });
    }

    // Simple query without complex relations
    console.log('🔍 Fetching clients...');
    const clients = await prisma.client.findMany({
      where: { 
        businessId,
        isDeleted: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        isEligible: true,
        status: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('✅ Found', clients.length, 'clients');

    return NextResponse.json({ 
      success: true, 
      data: clients,
      message: `Found ${clients.length} clients for business ${businessId}`
    });
    
  } catch (error) {
    console.error('❌ Staff clients API error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Internal Error'
      }
    }, { status: 500 });
  }
}
