import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt';

const updateBusinessSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  ownerName: z.string().min(2, 'Nome do proprietário é obrigatório').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  plan: z.enum(['basic', 'standard', 'premium']).optional(),
  slug: z.string().optional(),
  features: z.record(z.boolean()).optional(),
  password: z.string().min(6, 'Password deve ter pelo menos 6 caracteres').optional(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, { params }: any) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    // Verify if the user is a system admin
    const admin = await prisma.systemAdmin.findUnique({
      where: { email: session.user.email }
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Forbidden' } },
        { status: 403 }
      );
    }

    const business = await prisma.business.findUnique({
      where: { id: params.id },
      include: {
        verification: true,
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        services: {
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
            client: {
              select: {
                name: true
              }
            },
            service: {
              select: {
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
            clients: true,
            staff: true,
            services: true
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

    return NextResponse.json({ success: true, data: business });
  } catch (error) {
    console.error('Error fetching business:', error);
    return NextResponse.json(
      { success: false, error: { code: 'BUSINESS_FETCH_ERROR', message: 'Internal Server Error' } },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check JWT authentication (like admin pages use)
    console.log('🔍 Verifying JWT auth for business update...');
    const user = getRequestAuthUser(request);
    
    if (!user) {
      console.log('❌ No valid JWT token found');
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (!user.isAdmin || user.role !== 'ADMIN') {
      console.log('❌ User is not admin:', { role: user.role, isAdmin: user.isAdmin });
      return NextResponse.json(
        { error: 'Acesso negado - apenas administradores do sistema' },
        { status: 403 }
      );
    }

    console.log('✅ JWT auth successful for admin:', user.name);

    const body = await request.json();
    console.log('📝 Update business request:', { id: params.id, body });

    // Validate input
    const validatedData = updateBusinessSchema.parse(body);
    console.log('✅ Validation passed:', validatedData);

    // Check if business exists
    const existingBusiness = await prisma.business.findUnique({
      where: { id: params.id },
      include: {
        staff: {
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

    // Check for slug conflicts (excluding current business)
    if (validatedData.slug && validatedData.slug !== existingBusiness.slug) {
      const slugExists = await prisma.business.findFirst({
        where: {
          slug: validatedData.slug,
          id: { not: params.id }
        }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug já está em uso por outro negócio' },
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
    if (validatedData.plan) updateData.plan = validatedData.plan;
    if (validatedData.slug !== undefined) updateData.slug = validatedData.slug;
    if (validatedData.features) updateData.features = validatedData.features;

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
              staff: true,
              appointments: true,
              services: true,
            }
          }
        }
      });

      // Update staff admin if needed
      if (existingBusiness.staff.length > 0) {
        const staffAdmin = existingBusiness.staff[0];
        const staffUpdateData: any = {};

        if (validatedData.email) staffUpdateData.email = validatedData.email;
        if (validatedData.ownerName) staffUpdateData.name = validatedData.ownerName;
        if (passwordHash) staffUpdateData.password = passwordHash;

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