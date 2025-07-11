import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { getRequestAuthUser } from '@/lib/jwt';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);

    if (!user) {
      console.error('Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    let businessId: string;

    // Handle both staff members and business owners
    if (user.role === 'BUSINESS_OWNER') {
      // For business owners, use the businessId from JWT directly
      if (!user.businessId) {
        console.error('Business owner missing businessId');
        return NextResponse.json({ success: false, error: { code: 'BUSINESS_ID_MISSING', message: 'Business ID missing' } }, { status: 400 });
      }
      businessId = user.businessId!;
      console.log('🏢 Business owner requesting staff, businessId:', businessId);
    } else {
      // For staff members, get business from staff lookup
      const staff = await (prisma.staff as any).findUnique({
        where: { id: user.id },
        include: { Business: true }
      });

      if (!staff) {
        console.error('Staff not found for user:', user.id);
        return NextResponse.json({ success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff not found' } }, { status: 404 });
      }

      businessId = staff.businessId;
      console.log('👤 Staff member requesting staff, businessId:', businessId);
    }

    console.log('🔍 Fetching staff for businessId:', businessId);

    const staffMembers = await (prisma.staff as any).findMany({
      where: {
        businessId
      },
      include: {
        Service: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    console.log('📊 Found staff members:', staffMembers.length);
    console.log('👥 Staff data:', JSON.stringify(staffMembers, null, 2));

    const response = { success: true, data: staffMembers };
    console.log('📤 Returning response:', JSON.stringify(response, null, 2));

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /business/staff error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);

    if (!user) {
      console.error('Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    let businessId: string;
    let hasAdminPermission = false;

    // Handle both staff members and business owners
    if (user.role === 'BUSINESS_OWNER') {
      // Business owners have full admin permissions
      if (!user.businessId) {
        console.error('Business owner missing businessId');
        return NextResponse.json({ success: false, error: { code: 'BUSINESS_ID_MISSING', message: 'Business ID missing' } }, { status: 400 });
      }
      businessId = user.businessId!;
      hasAdminPermission = true;
    } else {
      // For staff members, check admin role
      const staff = await (prisma.staff as any).findUnique({
        where: { id: user.id },
        include: { Business: true }
      });

      if (!staff || staff.role !== 'ADMIN') {
        console.error('Unauthorized: Not admin staff.');
        return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } }, { status: 401 });
      }

      businessId = staff.businessId;
      hasAdminPermission = true;
    }

    if (!hasAdminPermission) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } }, { status: 401 });
    }

    // Input validation
    const schema = z.object({
      email: z.string().email(),
      name: z.string().min(1),
      role: z.enum(['ADMIN', 'MANAGER', 'STANDARD']),
      password: z.string().min(6),
      services: z.array(z.string()).optional(),
    });
    let data;
    try {
      data = schema.parse(await request.json());
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ success: false, error: { code: 'INVALID_INPUT', message: 'Invalid input', details: error.errors } }, { status: 400 });
      }
      throw error;
    }
    const { email, name, role, password, services = [] } = data;

    const passwordHash = await hash(password, 10);

    const newStaff = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const createdStaff = await (tx.staff as any).create({
        data: {
          id: randomUUID(),
          email,
          name,
          role,
          password: passwordHash,
          businessId,
          updatedAt: new Date(),
          Service: {
            connect: services.map((id: string) => ({ id })),
          },
        },
        include: {
          Service: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return (tx.staff as any).findUnique({
        where: { id: createdStaff.id },
        include: {
          Service: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });

    return NextResponse.json({ success: true, data: newStaff });
  } catch (error) {
    console.error('POST /business/staff error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: error instanceof Error ? error.message : String(error) } },
      { status: 500 }
    );
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future. 

export async function PUT(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);

    if (!user) {
      console.error('Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    let businessId: string;
    let hasAdminPermission = false;

    // Handle both staff members and business owners
    if (user.role === 'BUSINESS_OWNER') {
      // Business owners have full admin permissions
      if (!user.businessId) {
        console.error('Business owner missing businessId');
        return NextResponse.json({ success: false, error: { code: 'BUSINESS_ID_MISSING', message: 'Business ID missing' } }, { status: 400 });
      }
      businessId = user.businessId!;
      hasAdminPermission = true;
    } else {
      // For staff members, check admin role
      const staff = await (prisma.staff as any).findUnique({
        where: { id: user.id },
        include: { Business: true }
      });

      if (!staff || staff.role !== 'ADMIN') {
        console.error('Unauthorized: Not admin staff.');
        return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } }, { status: 401 });
      }

      businessId = staff.businessId;
      hasAdminPermission = true;
    }

    if (!hasAdminPermission) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } }, { status: 401 });
    }

    // Input validation
    const schema = z.object({
      id: z.string(),
      email: z.string().email().optional(),
      name: z.string().min(1).optional(),
      role: z.enum(['ADMIN', 'MANAGER', 'STANDARD']).optional(),
      password: z.string().min(6).optional(),
      services: z.array(z.string()).optional(),
    });

    let data;
    try {
      data = schema.parse(await request.json());
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ success: false, error: { code: 'INVALID_INPUT', message: 'Invalid input', details: error.errors } }, { status: 400 });
      }
      throw error;
    }

    const { id, email, name, role, password, services } = data;

    // Check if staff exists and belongs to the business
    const existingStaff = await (prisma.staff as any).findFirst({
      where: {
        id,
        businessId
      }
    });

    if (!existingStaff) {
      return NextResponse.json({ success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff member not found' } }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (password) updateData.password = await hash(password, 10);

    const updatedStaff = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update staff basic info
      const staff = await (tx.staff as any).update({
        where: { id },
        data: updateData,
      });

      // Update services if provided
      if (services !== undefined) {
        // First disconnect all current services
        await (tx.staff as any).update({
          where: { id },
          data: {
            Service: {
              set: [],
            },
          },
        });

        // Then connect new services
        if (services.length > 0) {
          await (tx.staff as any).update({
            where: { id },
            data: {
              Service: {
                connect: services.map((serviceId: string) => ({ id: serviceId })),
              },
            },
          });
        }
      }

      // Return updated staff with services
      return (tx.staff as any).findUnique({
        where: { id },
        include: {
          Service: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });

    console.log('✅ Staff updated successfully:', updatedStaff.name);

    return NextResponse.json({ success: true, data: updatedStaff });
  } catch (error) {
    console.error('PUT /business/staff error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: error instanceof Error ? error.message : String(error) } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);

    if (!user) {
      console.error('Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    let businessId: string;
    let hasAdminPermission = false;

    // Handle both staff members and business owners
    if (user.role === 'BUSINESS_OWNER') {
      // Business owners have full admin permissions
      if (!user.businessId) {
        console.error('Business owner missing businessId');
        return NextResponse.json({ success: false, error: { code: 'BUSINESS_ID_MISSING', message: 'Business ID missing' } }, { status: 400 });
      }
      businessId = user.businessId!;
      hasAdminPermission = true;
    } else {
      // For staff members, check admin role
      const staff = await (prisma.staff as any).findUnique({
        where: { id: user.id },
        include: { Business: true }
      });

      if (!staff || staff.role !== 'ADMIN') {
        console.error('Unauthorized: Not admin staff.');
        return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } }, { status: 401 });
      }

      businessId = staff.businessId;
      hasAdminPermission = true;
    }

    if (!hasAdminPermission) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } }, { status: 401 });
    }

    // Get staff ID from query parameters
    const url = new URL(request.url);
    const staffId = url.searchParams.get('id');

    if (!staffId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_ID', message: 'Staff ID is required' } }, { status: 400 });
    }

    // Check if staff exists and belongs to the business
    const existingStaff = await (prisma.staff as any).findFirst({
      where: {
        id: staffId,
        businessId
      }
    });

    if (!existingStaff) {
      return NextResponse.json({ success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff member not found' } }, { status: 404 });
    }

    // Prevent deletion of the current user
    if (staffId === user.id) {
      return NextResponse.json({ success: false, error: { code: 'CANNOT_DELETE_SELF', message: 'Cannot delete your own account' } }, { status: 400 });
    }

    // Delete the staff member
    await (prisma.staff as any).delete({
      where: { id: staffId }
    });

    console.log('🗑️ Staff deleted successfully:', existingStaff.name);

    return NextResponse.json({ success: true, message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('DELETE /business/staff error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: error instanceof Error ? error.message : String(error) } },
      { status: 500 }
    );
  }
} 