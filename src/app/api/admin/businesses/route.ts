import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { generateSlug, ensureUniqueSlug } from '@/lib/business';
import { z } from 'zod';
import crypto from 'crypto';

const createBusinessSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  ownerName: z.string().min(2, 'Nome do proprietário é obrigatório'),
  phone: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  plan: z.enum(['basic', 'standard', 'premium']).default('standard'),
  slug: z.string().optional(),
  features: z.record(z.boolean()).optional(),
  password: z.string().min(6, 'Password deve ter pelo menos 6 caracteres'),
});

// JWT Authentication helper
async function verifyAdminJWT(request: NextRequest): Promise<any | null> {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
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

// GET /api/admin/businesses - List all businesses
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Admin businesses API called');
    
    // Verify JWT token
    const user = await verifyAdminJWT(request);
    
    if (!user) {
      console.log('❌ Admin access denied - no valid JWT token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('✅ Admin access granted to:', user.email);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { slug: { contains: search, mode: 'insensitive' as const } },
      ]
    } : {};

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          email: true,
          ownerName: true,
          phone: true,
          plan: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          features: true,
          _count: {
            select: {
              Staff: true,
              appointments: true,
              Service: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.business.count({ where })
    ]);

    console.log('📊 Found businesses:', businesses.length);
    
    return NextResponse.json({
      businesses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching businesses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/businesses - Create new business
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/admin/businesses - Starting business creation');
    
    // Verify environment variables
    if (!process.env.NEXTAUTH_SECRET) {
      console.error('❌ NEXTAUTH_SECRET not found');
      return NextResponse.json({ error: 'Server configuration error: NEXTAUTH_SECRET missing' }, { status: 500 });
    }
    
    // Verify JWT token
    console.log('🔍 Verifying JWT token...');
    const user = await verifyAdminJWT(request);
    
    if (!user) {
      console.log('❌ JWT verification failed or user not admin');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('✅ JWT verified, user:', { id: user.id, email: user.email, role: user.role });

    console.log('📦 Parsing request body...');
    const body = await request.json();
    console.log('📋 Request body received:', { 
      ...body, 
      password: body.password ? '[REDACTED]' : 'MISSING' 
    });
    
    console.log('🔍 Validating data with Zod...');
    const validatedData = createBusinessSchema.parse(body);
    console.log('✅ Data validation passed');

    // Generate slug
    console.log('🔤 Generating unique slug...');
    const baseSlug = validatedData.slug || generateSlug(validatedData.name);
    const uniqueSlug = await ensureUniqueSlug(baseSlug);
    console.log('✅ Unique slug generated:', uniqueSlug);

    // Default features based on plan
    const defaultFeatures = {
      basic: {
        multipleStaff: false,
        advancedReports: false,
        smsNotifications: false,
        customBranding: false,
        apiAccess: false,
        calendarIntegration: false,
      },
      standard: {
        multipleStaff: true,
        advancedReports: true,
        smsNotifications: false,
        customBranding: false,
        apiAccess: false,
        calendarIntegration: true,
      },
      premium: {
        multipleStaff: true,
        advancedReports: true,
        smsNotifications: true,
        customBranding: true,
        apiAccess: true,
        calendarIntegration: true,
      }
    };

    const features = {
      ...defaultFeatures[validatedData.plan],
      ...validatedData.features
    };
    console.log('✅ Features configured:', features);

    // Use provided password (now required)
    console.log('🔐 Hashing password...');
    const password = validatedData.password;
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed successfully');

    // Check if email is already in use by business or staff
    console.log('📧 Checking if email already exists...');
    const [existingBusiness, existingStaff] = await Promise.all([
      prisma.business.findUnique({ where: { email: validatedData.email } }),
      prisma.staff.findUnique({ where: { email: validatedData.email } }),
    ]);

    if (existingBusiness || existingStaff) {
      console.log('❌ Email already in use');
      return NextResponse.json({ error: 'Email já está em uso' }, { status: 400 });
    }

    // Create business and staff admin in a transaction
    console.log('💾 Starting database transaction...');
    const result = await prisma.$transaction(async (tx) => {
      // Create the business
      console.log('📝 Creating business record...');
      const business = await tx.business.create({
        data: {
          id: crypto.randomUUID(),
          name: validatedData.name,
          slug: uniqueSlug,
          email: validatedData.email,
          ownerName: validatedData.ownerName,
          phone: validatedData.phone,
          address: validatedData.address,
          description: validatedData.description,
          plan: validatedData.plan,
          features,
          passwordHash,
          status: 'ACTIVE',
          updatedAt: new Date(),
        },
      });
      console.log('✅ Business created with ID:', business.id);

      // Create the admin staff member for this business
      console.log('👤 Creating admin staff record...');
      const adminStaff = await tx.staff.create({
        data: {
          id: crypto.randomUUID(),
          name: validatedData.ownerName,
          email: validatedData.email,
          password: passwordHash, // Same password as business
          role: 'ADMIN',
          businessId: business.id,
          updatedAt: new Date(),
        },
      });
      console.log('✅ Admin staff created with ID:', adminStaff.id);

      return { business, adminStaff };
    });
    
    console.log('✅ Transaction completed successfully');

    return NextResponse.json({
      business: {
        id: result.business.id,
        name: result.business.name,
        slug: result.business.slug,
        email: result.business.email,
        ownerName: result.business.ownerName,
        phone: result.business.phone,
        plan: result.business.plan,
        status: result.business.status,
        features: result.business.features,
        createdAt: result.business.createdAt,
      },
      adminStaff: {
        id: result.adminStaff.id,
        name: result.adminStaff.name,
        email: result.adminStaff.email,
        role: result.adminStaff.role,
      },
      tempPassword: password,
      isCustomPassword: !!validatedData.password,
      loginUrl: `${process.env.NEXTAUTH_URL}/${uniqueSlug}/staff/dashboard`
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    
    console.error('Error creating business:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 