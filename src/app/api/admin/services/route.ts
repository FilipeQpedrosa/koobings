import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUltraSecureSessionV2 } from '@/lib/ultra-secure-auth-v2';
import { verify } from 'jsonwebtoken';

// JWT Authentication helper
async function verifyAdminJWT(request: NextRequest): Promise<any | null> {
  try {
    // Try both cookie names for admin authentication
    const token = request.cookies.get('admin-auth-token')?.value || request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = verify(token, process.env.NEXTAUTH_SECRET!) as any;
    
    // Check if user is admin
    if (!decoded.isAdmin && decoded.role !== 'ADMIN') {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.log('❌ JWT verification failed:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [ADMIN_SERVICES] Creating service via admin...');
    
    // Verify admin session
    let user = null;
    const ultraSecureSession = verifyUltraSecureSessionV2(request);
    
    if (ultraSecureSession && ultraSecureSession.role === 'ADMIN') {
      console.log('✅ Ultra-Secure admin session verified for POST:', ultraSecureSession.email);
      user = {
        id: ultraSecureSession.userId,
        email: ultraSecureSession.email,
        role: 'ADMIN',
        isAdmin: true
      };
    } else {
      // 🔄 FALLBACK: Try JWT token
      console.log('🔍 Fallback to JWT verification for POST...');
      const jwtUser = await verifyAdminJWT(request);
      if (jwtUser) {
        console.log('✅ JWT admin session verified for POST:', jwtUser.email);
        user = jwtUser;
      }
    }
    
    if (!user) {
      console.error('❌ Unauthorized: Admin access required.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } }, { status: 401 });
    }

    const body = await request.json();
    const { name, duration, price, description, businessId } = body;
    
    if (!name || !duration) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_FIELDS', message: 'Nome e duração são obrigatórios' } }, { status: 400 });
    }

    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Business ID é obrigatório' } }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        id: 'service-' + Date.now(),
        name,
        duration,
        price: price || 0, // Preço é opcional, default 0
        description,
        businessId,
        updatedAt: new Date(),
      },
    });

    console.log('✅ [ADMIN_SERVICES] Service created successfully by admin:', service.name);
    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error: any) {
    console.error('❌ [ADMIN_SERVICES] Error creating service via admin:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message || 'Internal Server Error' } }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [ADMIN_SERVICES] Fetching services via admin...');
    
    // Verify admin session
    let user = null;
    const ultraSecureSession = verifyUltraSecureSessionV2(request);
    
    if (ultraSecureSession && ultraSecureSession.role === 'ADMIN') {
      console.log('✅ Ultra-Secure admin session verified for GET:', ultraSecureSession.email);
      user = {
        id: ultraSecureSession.userId,
        email: ultraSecureSession.email,
        role: 'ADMIN',
        isAdmin: true
      };
    } else {
      // 🔄 FALLBACK: Try JWT token
      console.log('🔍 Fallback to JWT verification for GET...');
      const jwtUser = await verifyAdminJWT(request);
      if (jwtUser) {
        console.log('✅ JWT admin session verified for GET:', jwtUser.email);
        user = jwtUser;
      }
    }
    
    if (!user) {
      console.error('❌ Unauthorized: Admin access required.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Business ID é obrigatório' } }, { status: 400 });
    }

    const services = await prisma.service.findMany({
      where: { businessId },
      orderBy: { name: 'asc' }
    });

    console.log('✅ [ADMIN_SERVICES] Services fetched successfully:', services.length);
    return NextResponse.json({ success: true, data: services });
  } catch (error: any) {
    console.error('❌ [ADMIN_SERVICES] Error fetching services via admin:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message || 'Internal Server Error' } }, { status: 500 });
  }
}
