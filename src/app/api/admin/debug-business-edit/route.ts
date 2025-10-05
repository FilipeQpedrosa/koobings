import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { verifyUltraSecureSessionV2 } from '@/lib/ultra-secure-auth-v2';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Business Edit Debug Request');

    // Check authentication
    let user = null;
    const ultraSecureSession = verifyUltraSecureSessionV2(request);
    
    if (ultraSecureSession && ultraSecureSession.role === 'ADMIN') {
      console.log('✅ Ultra-Secure admin session verified');
      user = {
        id: ultraSecureSession.userId,
        email: ultraSecureSession.email,
        role: 'ADMIN',
        isAdmin: true
      };
    } else {
      user = getRequestAuthUser(request);
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    if (!user.isAdmin || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado - apenas administradores' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { businessId, testData } = body;

    console.log('🔍 Testing business edit with:', { businessId, testData });

    // Check if business exists
    const existingBusiness = await prisma.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        status: true,
        settings: true
      }
    });

    if (!existingBusiness) {
      return NextResponse.json({
        success: false,
        error: 'Business not found',
        businessId
      });
    }

    console.log('✅ Business found:', existingBusiness);

    // Test validation
    const validationErrors = [];
    
    if (testData.email && !testData.email.includes('@')) {
      validationErrors.push('Invalid email format');
    }
    
    if (testData.type && !['HAIR_SALON', 'NAIL_SALON', 'BARBERSHOP', 'SPA', 'MASSAGE', 'FITNESS', 'MEDICAL', 'DENTAL', 'PSYCHOLOGY', 'OTHER'].includes(testData.type)) {
      validationErrors.push('Invalid business type');
    }
    
    if (testData.status && !['ACTIVE', 'PENDING', 'SUSPENDED', 'INACTIVE'].includes(testData.status)) {
      validationErrors.push('Invalid status');
    }

    // Test database connection
    const dbTest = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection test:', dbTest);

    // Test business update (dry run)
    const updateData: any = {};
    
    if (testData.email && testData.email !== existingBusiness.email) {
      updateData.email = testData.email;
    }
    if (testData.ownerName) {
      updateData.ownerName = testData.ownerName;
    }
    if (testData.phone !== undefined) {
      updateData.phone = testData.phone;
    }
    if (testData.address !== undefined) {
      updateData.address = testData.address;
    }
    if (testData.description !== undefined) {
      updateData.description = testData.description;
    }
    if (testData.type && ['HAIR_SALON', 'NAIL_SALON', 'BARBERSHOP', 'SPA', 'MASSAGE', 'FITNESS', 'MEDICAL', 'DENTAL', 'PSYCHOLOGY', 'OTHER'].includes(testData.type)) {
      updateData.type = testData.type;
    }
    if (testData.status && ['ACTIVE', 'PENDING', 'SUSPENDED', 'INACTIVE'].includes(testData.status)) {
      updateData.status = testData.status;
    }
    if (testData.settings && typeof testData.settings === 'object') {
      updateData.settings = testData.settings;
    }

    console.log('📋 Update data prepared:', updateData);

    return NextResponse.json({
      success: true,
      debug: {
        authentication: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            isAdmin: user.isAdmin
          }
        },
        business: {
          found: true,
          data: existingBusiness
        },
        validation: {
          errors: validationErrors,
          passed: validationErrors.length === 0
        },
        database: {
          connected: true,
          test: dbTest
        },
        updateData: {
          prepared: updateData,
          fieldsCount: Object.keys(updateData).length
        }
      }
    });

  } catch (error) {
    console.error('❌ Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
