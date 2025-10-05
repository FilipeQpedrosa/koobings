import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { verifyUltraSecureSessionV2 } from '@/lib/ultra-secure-auth-v2'; // Add this import
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const updateBusinessSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  ownerName: z.string().min(2, 'Nome do proprietário é obrigatório').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  type: z.string().optional(),  // Use 'type' instead of 'plan'
  settings: z.record(z.any()).optional(),  // Use 'settings' instead of 'features'
  password: z.string().min(6, 'Password deve ter pelo menos 6 caracteres').optional(),
  status: z.enum(['ACTIVE', 'PENDING', 'SUSPENDED', 'INACTIVE']).optional(),
  description: z.string().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, { params }: any) {
  try {
    console.log('🔍 GET Business request for ID:', params.id);

    // 🚀 PRIORITY 1: Try Ultra-Secure Session first
    console.log('🔍 Checking Ultra-Secure session for individual business...');
    let user = null;
    const ultraSecureSession = verifyUltraSecureSessionV2(request);
    
    if (ultraSecureSession && ultraSecureSession.role === 'ADMIN') {
      console.log('✅ Ultra-Secure admin session verified for individual business:', ultraSecureSession.email);
      user = {
        id: ultraSecureSession.userId,
        email: ultraSecureSession.email,
        role: 'ADMIN',
        isAdmin: true
      };
    } else {
      // 🔄 FALLBACK: Try JWT token
      console.log('🔍 Fallback to JWT verification for individual business...');
      user = getRequestAuthUser(request);
    }
    
    console.log('🔧 [DEBUG] Authentication result:', user ? { id: user.id, email: user.email, role: user.role, isAdmin: user.isAdmin } : 'No user found');
    
    if (!user) {
      console.log('❌ [DEBUG] Both Ultra-Secure and JWT verification failed for individual business');
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (!user.isAdmin || user.role !== 'ADMIN') {
      console.log('❌ [DEBUG] User is not admin:', { role: user.role, isAdmin: user.isAdmin });
      return NextResponse.json(
        { error: 'Acesso negado - apenas administradores do sistema' },
        { status: 403 }
      );
    }

    console.log('✅ Admin access verified for individual business:', user.email);

    const business = await prisma.business.findUnique({
      where: { id: params.id },
      include: {
        Staff: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        Service: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true
          }
        },
        appointments: {
          select: {
            id: true,
            scheduledFor: true,
            duration: true,
            status: true,
            createdAt: true,
            notes: true,
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
                name: true,
                duration: true,
                price: true
              }
            },
            Staff: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            scheduledFor: 'desc'
          },
          take: 10
        },
        _count: {
          select: {
            Client: true,
            Staff: true,
            Service: true
          }
        }
      }
    });

    if (!business) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } },
        { status: 404 }
      );
    }

    console.log('✅ Business found:', business.name);
    return NextResponse.json({ success: true, data: business });

  } catch (error) {
    console.error('❌ Error fetching business:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch business' } },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 PUT Business request for ID:', params.id);

    // 🚀 PRIORITY 1: Try Ultra-Secure Session first
    console.log('🔍 Checking Ultra-Secure session for PUT individual business...');
    let user = null;
    const ultraSecureSession = verifyUltraSecureSessionV2(request);
    
    if (ultraSecureSession && ultraSecureSession.role === 'ADMIN') {
      console.log('✅ Ultra-Secure admin session verified for PUT individual business:', ultraSecureSession.email);
      user = {
        id: ultraSecureSession.userId,
        email: ultraSecureSession.email,
        role: 'ADMIN',
        isAdmin: true
      };
    } else {
      // 🔄 FALLBACK: Try JWT token
      console.log('🔍 Fallback to JWT verification for PUT individual business...');
      user = getRequestAuthUser(request);
    }
    
    console.log('🔧 [DEBUG] Authentication result:', user ? { id: user.id, email: user.email, role: user.role, isAdmin: user.isAdmin } : 'No user found');
    
    if (!user) {
      console.log('❌ [DEBUG] Both Ultra-Secure and JWT verification failed for PUT individual business');
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (!user.isAdmin || user.role !== 'ADMIN') {
      console.log('❌ [DEBUG] User is not admin:', { role: user.role, isAdmin: user.isAdmin });
      return NextResponse.json(
        { error: 'Acesso negado - apenas administradores do sistema' },
        { status: 403 }
      );
    }

    console.log('✅ Admin access verified for PUT individual business:', user.email);

    const body = await request.json();
    console.log('📝 Raw request body:', body);

    // Check if business exists first
    const existingBusiness = await prisma.business.findUnique({
      where: { id: params.id }
    });

    if (!existingBusiness) {
      return NextResponse.json(
        { error: 'Negócio não encontrado' },
        { status: 404 }
      );
    }

    console.log('✅ Existing business found:', existingBusiness.name);

    // Simple update - only the fields that are safe
    const updateData: any = {};
    
    if (body.email && body.email !== existingBusiness.email) {
      updateData.email = body.email;
    }
    if (body.ownerName) {
      updateData.ownerName = body.ownerName;
    }
    if (body.phone !== undefined) {
      updateData.phone = body.phone;
    }
    if (body.address !== undefined) {
      updateData.address = body.address;
    }
    if (body.description !== undefined) {
      updateData.description = body.description;
    }
    if (body.type && ['HAIR_SALON', 'NAIL_SALON', 'BARBERSHOP', 'SPA', 'MASSAGE', 'FITNESS', 'MEDICAL', 'DENTAL', 'PSYCHOLOGY', 'OTHER'].includes(body.type)) {
      updateData.type = body.type;
    }
    if (body.status && ['ACTIVE', 'PENDING', 'SUSPENDED', 'INACTIVE'].includes(body.status)) {
      updateData.status = body.status;
    }
    if (body.settings && typeof body.settings === 'object') {
      updateData.settings = body.settings;
    }

    console.log('📋 Safe update data:', updateData);

    // Simple business update
    const updatedBusiness = await prisma.business.update({
      where: { id: params.id },
      data: updateData
    });

    console.log('✅ Business updated successfully:', updatedBusiness.name);

    // Handle password separately if provided
    if (body.password && body.password.trim().length >= 6) {
      try {
        const passwordHash = await bcrypt.hash(body.password, 10);
        
        // Find staff admin
        const staffAdmin = await prisma.staff.findFirst({
          where: {
            businessId: params.id,
            role: 'ADMIN'
          }
        });

        if (staffAdmin) {
          await prisma.staff.update({
            where: { id: staffAdmin.id },
            data: { 
              passwordHash,
              ...(body.email && { email: body.email }),
              ...(body.ownerName && { name: body.ownerName })
            }
          });
          console.log('✅ Staff password updated');
        }
      } catch (passwordError) {
        console.error('❌ Password update failed:', passwordError);
        // Don't fail the whole request
      }
    }

    return NextResponse.json({
      message: 'Negócio atualizado com sucesso',
      business: updatedBusiness,
      success: true
    });

  } catch (error) {
    console.error('❌ Error updating business:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 