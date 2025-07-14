import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';

// 🛡️ Enhanced validation schema with data integrity checks
const staffCreationSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome muito longo')
    .refine((name) => {
      // 🔒 Block obviously invalid or generic names in development
      if (process.env.NODE_ENV === 'development') {
        const invalidNames = [
          'pretinho', 'admin', 'test', 'user', 'demo', 'example', 
          'null', 'undefined', 'guest', 'temp', 'temporary',
          'xxx', 'aaa', 'bbb', 'ccc', '123', 'abc'
        ];
        const lowerName = name.toLowerCase().trim();
        
        if (invalidNames.includes(lowerName)) {
          console.error(`🚨 BLOCKED: Invalid staff name detected: "${name}"`);
          return false;
        }
        
        // Block names that are too short or just numbers
        if (lowerName.length < 3 || /^\d+$/.test(lowerName)) {
          console.error(`🚨 BLOCKED: Suspicious staff name pattern: "${name}"`);
          return false;
        }
      }
      return true;
    }, 'Nome do staff inválido ou genérico'),
  role: z.enum(['ADMIN', 'MANAGER', 'STANDARD']),
  password: z.string().min(6, 'Password deve ter pelo menos 6 caracteres'),
  services: z.array(z.string()).optional(),
});

// 📝 Staff audit log helper
async function createStaffAuditLog(operation: string, entityId: string, data: any, creatorId: string, businessId: string) {
  try {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      operation,
      entityType: 'STAFF',
      entityId,
      creatorId,
      businessId,
      data: {
        ...data,
        password: '[REDACTED]',
        passwordHash: '[REDACTED]'
      }
    };
    
    console.log('📋 STAFF AUDIT LOG:', JSON.stringify(auditEntry, null, 2));
    
    // TODO: Can extend this to save to audit_logs table in the future
    // await prisma.auditLog.create({ data: auditEntry });
    
  } catch (error) {
    console.error('❌ Failed to create staff audit log:', error);
  }
}

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
    console.log('🚀 POST /api/business/staff - Starting staff creation');
    
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

    console.log('📦 Parsing request body...');
    const body = await request.json();
    
    // 📋 EXPLICIT LOGGING: Log all received data for audit trail  
    console.log('📋 RAW STAFF DATA RECEIVED:', JSON.stringify({
      ...body,
      password: body.password ? `[${body.password.length} chars]` : 'MISSING'
    }, null, 2));

    // Enhanced input validation with the new schema
    console.log('🔍 Validating data with enhanced Zod schema...');
    const validatedData = staffCreationSchema.parse(body);
    
    // 📋 EXPLICIT LOGGING: Log validated data
    console.log('✅ STAFF VALIDATED DATA:', JSON.stringify({
      ...validatedData,
      password: `[${validatedData.password.length} chars]`
    }, null, 2));

    const { email, name, role, password, services = [] } = validatedData;

    // 🛡️ CRITICAL: Check if email is already in use by business or staff
    console.log('📧 Checking if email already exists...');
    const [existingBusiness, existingStaff] = await Promise.all([
      prisma.business.findUnique({ where: { email } }),
      prisma.staff.findUnique({ where: { email } }),
    ]);

    if (existingBusiness || existingStaff) {
      console.log('❌ Email already in use for staff creation');
      await createStaffAuditLog('CREATE_STAFF_FAILED', 'N/A', {
        reason: 'EMAIL_IN_USE',
        email: email,
        name: name,
        businessId: businessId
      }, user.id || 'UNKNOWN', businessId);
      return NextResponse.json({ 
        success: false, 
        error: { code: 'EMAIL_IN_USE', message: 'Email já está em uso' } 
      }, { status: 400 });
    }

    // 🛡️ Additional validation: Check for suspicious patterns
    const nameLower = name.toLowerCase().trim();
    if (nameLower.includes('pretinho') || nameLower.includes('test')) {
      console.error('🚨 SUSPICIOUS STAFF NAME DETECTED:', name);
      await createStaffAuditLog('CREATE_STAFF_BLOCKED', 'N/A', {
        reason: 'SUSPICIOUS_STAFF_NAME',
        name: name,
        email: email,
        businessId: businessId
      }, user.id || 'UNKNOWN', businessId);
    }

    console.log('🔐 Hashing password...');
    const passwordHash = await hash(password, 10);
    console.log('✅ Password hashed successfully');

    console.log('💾 Starting staff creation transaction...');
    const newStaff = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const staffId = randomUUID();
      const now = new Date();
      
      console.log('👤 Creating staff record with ID:', staffId);
      const createdStaff = await (tx.staff as any).create({
        data: {
          id: staffId,
          email,
          name,
          role,
          password: passwordHash,
          businessId,
          createdAt: now,
          updatedAt: now,
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
      
      console.log('✅ Staff created with data:', {
        id: createdStaff.id,
        name: createdStaff.name,
        email: createdStaff.email,
        role: createdStaff.role,
        businessId: createdStaff.businessId
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

    console.log('✅ Staff creation transaction completed successfully');
    
    // 📋 Create comprehensive audit log
    await createStaffAuditLog('CREATE_STAFF_SUCCESS', newStaff.id, {
      staffName: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      businessId: businessId,
      servicesCount: services.length
    }, user.id || 'UNKNOWN', businessId);

    return NextResponse.json({ success: true, data: newStaff });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Staff validation errors:', error.errors);
      await createStaffAuditLog('CREATE_STAFF_VALIDATION_ERROR', 'N/A', {
        validationErrors: error.errors
      }, 'UNKNOWN', 'UNKNOWN');
      return NextResponse.json({ success: false, error: { code: 'INVALID_INPUT', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    
    console.error('POST /business/staff error:', error);
    await createStaffAuditLog('CREATE_STAFF_ERROR', 'N/A', {
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 'UNKNOWN', 'UNKNOWN');
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