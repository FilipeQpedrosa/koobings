import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt';  // Use the same JWT system as status API
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

    // Use the same JWT authentication as the status API
    const user = getRequestAuthUser(request);
    console.log('🔧 [DEBUG] Authentication result:', user ? { id: user.id, email: user.email, role: user.role, isAdmin: user.isAdmin } : 'No user found');
    
    if (!user) {
      console.log('❌ [DEBUG] No authenticated user found');
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

    console.log('✅ Admin access verified for:', user.email);

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

    // Use the same JWT authentication as the status API
    const user = getRequestAuthUser(request);
    console.log('🔧 [DEBUG] Authentication result:', user ? { id: user.id, email: user.email, role: user.role, isAdmin: user.isAdmin } : 'No user found');
    
    if (!user) {
      console.log('❌ [DEBUG] No authenticated user found');
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

    console.log('✅ Admin access verified for:', user.email);

    const body = await request.json();
    console.log('📝 Update business request:', { id: params.id, body });

    // Validate input
    const validatedData = updateBusinessSchema.parse(body);
    console.log('✅ Validation passed:', validatedData);

    // Check if business exists
    const existingBusiness = await prisma.business.findUnique({
      where: { id: params.id },
      include: {
        Staff: {
          where: { role: 'ADMIN' },
          take: 1
        }
      }
    });

    if (!existingBusiness) {
      return NextResponse.json(
        { error: 'Negócio não encontrado' },
        { status: 404 }
      );
    }

    console.log('✅ Existing business found:', existingBusiness.name);

    // Check for email conflicts (excluding current business)
    if (validatedData.email && validatedData.email !== existingBusiness.email) {
      const emailExists = await prisma.business.findFirst({
        where: {
          email: validatedData.email,
          id: { not: params.id }
        }
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email já está em uso por outro negócio' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};
    
    if (validatedData.name) updateData.name = validatedData.name;
    if (validatedData.email) updateData.email = validatedData.email;
    if (validatedData.ownerName) updateData.ownerName = validatedData.ownerName;
    if (validatedData.phone !== undefined) updateData.phone = validatedData.phone;
    if (validatedData.address !== undefined) updateData.address = validatedData.address;
    if (validatedData.type !== undefined) updateData.type = validatedData.type;
    if (validatedData.status) updateData.status = validatedData.status;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.settings) updateData.settings = validatedData.settings; // Store features in settings JSON field

    console.log('📋 Business update data:', updateData);

    // Handle password update for staff admin
    let passwordHash = null;
    if (validatedData.password) {
      passwordHash = await bcrypt.hash(validatedData.password, 10);
      console.log('🔐 Password will be updated for staff admin');
    }

    // Update business in transaction
    const updatedBusiness = await prisma.$transaction(async (tx) => {
      // Update business
      const business = await tx.business.update({
        where: { id: params.id },
        data: updateData,
        include: {
          _count: {
            select: {
              Staff: true,
              appointments: true,
              Service: true,
            }
          }
        }
      });

      // Update staff admin if needed
      if (existingBusiness.Staff.length > 0) {
        const staffAdmin = existingBusiness.Staff[0];
        const staffUpdateData: any = {};

        if (validatedData.email) staffUpdateData.email = validatedData.email;
        if (validatedData.ownerName) staffUpdateData.name = validatedData.ownerName;
        if (passwordHash) staffUpdateData.passwordHash = passwordHash;

        if (Object.keys(staffUpdateData).length > 0) {
          await tx.staff.update({
            where: { id: staffAdmin.id },
            data: staffUpdateData
          });
          console.log('👤 Staff admin updated:', staffUpdateData);
        }
      }

      return business;
    });

    console.log('✅ Business updated successfully:', updatedBusiness.name);

    return NextResponse.json({
      message: 'Negócio atualizado com sucesso',
      business: updatedBusiness,
      updatedFields: Object.keys(updateData),
      passwordUpdated: !!validatedData.password
    });

  } catch (error) {
    console.error('❌ Error updating business:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 