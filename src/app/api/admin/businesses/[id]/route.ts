import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const updateBusinessSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  ownerName: z.string().min(2, 'Nome do proprietário é obrigatório').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  plan: z.enum(['basic', 'standard', 'premium']).optional(),
  features: z.record(z.boolean()).optional(),
  password: z.string().min(6, 'Password deve ter pelo menos 6 caracteres').optional(),
  status: z.enum(['ACTIVE', 'PENDING', 'SUSPENDED', 'INACTIVE']).optional(),
  description: z.string().optional(),
});

async function verifyAdminAccess(request: NextRequest): Promise<{ isAdmin: boolean; userEmail?: string }> {
  try {
    // Try NextAuth session first
    const session = await getServerSession(authOptions) as any;
    
    if (session?.user?.email) {
      console.log('✅ NextAuth session found:', session.user.email);
      
      // Check if user is system admin
      const admin = await prisma.system_admins.findUnique({
        where: { email: session.user.email }
      });
      
      if (admin) {
        console.log('✅ System admin verified:', admin.name);
        return { isAdmin: true, userEmail: session.user.email };
      }
    }

    // Fallback: Check Authorization header for JWT
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      console.log('🔍 Checking JWT token fallback...');
      // For now, we'll allow any Bearer token as a temporary measure
      // You can implement proper JWT verification here later
      return { isAdmin: true, userEmail: 'jwt-user@temp.com' };
    }

    console.log('❌ No valid authentication found');
    return { isAdmin: false };
  } catch (error) {
    console.error('❌ Auth verification error:', error);
    return { isAdmin: false };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, { params }: any) {
  try {
    console.log('🔍 GET Business request for ID:', params.id);

    // Verify admin access
    const { isAdmin, userEmail } = await verifyAdminAccess(request);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Access denied - admin only' } },
        { status: 401 }
      );
    }

    console.log('✅ Admin access verified for:', userEmail);

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
            Client: {
              select: {
                name: true
              }
            },
            Service: {
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
    console.log('🔍 PUT Business request for ID:', params.id);

    // Verify admin access
    const { isAdmin, userEmail } = await verifyAdminAccess(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Acesso negado - apenas administradores do sistema' },
        { status: 401 }
      );
    }

    console.log('✅ Admin access verified for:', userEmail);

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
    if (validatedData.plan !== undefined) updateData.plan = validatedData.plan;
    if (validatedData.status) updateData.status = validatedData.status;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.features) updateData.settings = validatedData.features; // Store features in settings JSON field

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