import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';
import { verifyUltraSecureSessionV2 } from '@/lib/ultra-secure-auth-v2'; // Add this import

// Function to generate slug from business name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single
}

// Ensure unique slug
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existing = await prisma.business.findUnique({
      where: { slug }
    });
    
    if (!existing) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// 🛡️ Enhanced validation with data integrity checks
const createBusinessSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  ownerName: z.string()
    .min(2, 'Nome do proprietário é obrigatório')
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
          console.error(`🚨 BLOCKED: Invalid owner name detected: "${name}"`);
          return false;
        }
        
        // Block names that are too short or just numbers
        if (lowerName.length < 3 || /^\d+$/.test(lowerName)) {
          console.error(`🚨 BLOCKED: Suspicious owner name pattern: "${name}"`);
          return false;
        }
      }
      return true;
    }, 'Nome do proprietário inválido ou genérico'),
  phone: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  plan: z.enum(['basic', 'standard', 'premium']).default('standard'),
  // slug: z.string().optional(), // COMMENTED - field doesn't exist in database
  features: z.record(z.boolean()).optional(),
  password: z.string().min(6, 'Password deve ter pelo menos 6 caracteres'),
});

// 📝 Audit log helper
async function createAuditLog(operation: string, entityType: string, entityId: string, data: any, adminUserId: string) {
  try {
    // For now, just comprehensive logging - can extend to database audit table later
    const auditEntry = {
      timestamp: new Date().toISOString(),
      operation,
      entityType,
      entityId,
      adminUserId,
      data: {
        ...data,
        password: '[REDACTED]',
        passwordHash: '[REDACTED]'
      }
    };
    
    console.log('📋 AUDIT LOG:', JSON.stringify(auditEntry, null, 2));
    
    // TODO: Can extend this to save to audit_logs table in the future
    // await prisma.auditLog.create({ data: auditEntry });
    
  } catch (error) {
    console.error('❌ Failed to create audit log:', error);
  }
}

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

// GET /api/admin/businesses - List all businesses
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/admin/businesses - Listing businesses for admin');
    
    // 🚀 PRIORITY 1: Try Ultra-Secure Session first
    console.log('🔍 Checking Ultra-Secure session for GET...');
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
      user = await verifyAdminJWT(request);
    }
    
    if (!user) {
      console.log('❌ Both Ultra-Secure and JWT verification failed for GET');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('✅ Authentication verified for GET, admin user:', { id: user.id, email: user.email, role: user.role });

    // Get businesses with proper relations
    const businesses = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        ownerName: true,
        phone: true,
        address: true,
        description: true,
        slug: true,
        status: true,
        settings: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            Staff: true,
            Service: true,
            Client: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`✅ Found ${businesses.length} businesses for admin dashboard`);

    return NextResponse.json({ 
      businesses: businesses.map(business => ({
        ...business,
        plan: (business.settings as any)?.plan || 'standard',
        features: (business.settings as any)?.features || {}
      })),
      count: businesses.length,
      success: true
    });
    
  } catch (error) {
    console.error('❌ Error listing businesses:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch businesses', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
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
    
    // 🚀 PRIORITY 1: Try Ultra-Secure Session first
    console.log('🔍 Checking Ultra-Secure session...');
    let user = null;
    const ultraSecureSession = verifyUltraSecureSessionV2(request);
    
    if (ultraSecureSession && ultraSecureSession.role === 'ADMIN') {
      console.log('✅ Ultra-Secure admin session verified:', ultraSecureSession.email);
      user = {
        id: ultraSecureSession.userId,
        email: ultraSecureSession.email,
        role: 'ADMIN',
        isAdmin: true
      };
    } else {
      // 🔄 FALLBACK: Try JWT token
      console.log('🔍 Fallback to JWT verification...');
      user = await verifyAdminJWT(request);
    }
    
    if (!user) {
      console.log('❌ Both Ultra-Secure and JWT verification failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('✅ Authentication verified, admin user:', { id: user.id, email: user.email, role: user.role });

    console.log('📦 Parsing request body...');
    const body = await request.json();
    
    // 📋 EXPLICIT LOGGING: Log all received data for audit trail
    console.log('📋 RAW REQUEST DATA RECEIVED:', JSON.stringify({
      ...body,
      password: body.password ? `[${body.password.length} chars]` : 'MISSING'
    }, null, 2));
    
    console.log('🔍 Validating data with enhanced Zod schema...');
    const validatedData = createBusinessSchema.parse(body);
    
    // 📋 EXPLICIT LOGGING: Log validated data
    console.log('✅ VALIDATED DATA:', JSON.stringify({
      ...validatedData,
      password: `[${validatedData.password.length} chars]`
    }, null, 2));

    // Generate slug
    console.log('🔤 Generating unique slug...');
    const baseSlug = generateSlug(validatedData.name);
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
      await createAuditLog('CREATE_BUSINESS_FAILED', 'BUSINESS', 'N/A', {
        reason: 'EMAIL_IN_USE',
        email: validatedData.email,
        ownerName: validatedData.ownerName
      }, user.id);
      return NextResponse.json({ error: 'Email já está em uso' }, { status: 400 });
    }

    // 🛡️ Additional validation: Check for suspicious patterns
    const ownerNameLower = validatedData.ownerName.toLowerCase().trim();
    if (ownerNameLower.includes('pretinho') || ownerNameLower.includes('test')) {
      console.error('🚨 SUSPICIOUS OWNER NAME DETECTED:', validatedData.ownerName);
      await createAuditLog('CREATE_BUSINESS_BLOCKED', 'BUSINESS', 'N/A', {
        reason: 'SUSPICIOUS_OWNER_NAME',
        ownerName: validatedData.ownerName,
        email: validatedData.email
      }, user.id);
    }

    // Create business and staff admin in a transaction
    console.log('💾 Starting database transaction...');
    const result = await prisma.$transaction(async (tx) => {
      const businessId = crypto.randomUUID();
      const staffId = crypto.randomUUID();
      const now = new Date();
      
      // Create the business
      console.log('📝 Creating business record with ID:', businessId);
      const business = await tx.business.create({
        data: {
          id: businessId,
          name: validatedData.name,
          slug: uniqueSlug,
          email: validatedData.email,
          ownerName: validatedData.ownerName,
          phone: validatedData.phone,
          address: validatedData.address,
          description: validatedData.description,
          // plan: validatedData.plan, // REMOVED - field doesn't exist in Business model
          settings: { features, plan: validatedData.plan }, // Store features and plan in settings JSON field
          passwordHash,
          status: 'ACTIVE',
          createdAt: now,
          updatedAt: now,
        },
      });
      
      console.log('✅ Business created with data:', {
        id: business.id,
        name: business.name,
        ownerName: business.ownerName,
        email: business.email,
        slug: business.slug
      });

      // Create the admin staff member for this business
      console.log('👤 Creating admin staff record with ID:', staffId);
      const adminStaff = await tx.staff.create({
        data: {
          id: staffId,
          name: validatedData.ownerName, // 📋 EXPLICIT: Using same ownerName
          email: validatedData.email,    // 📋 EXPLICIT: Using same email
          password: passwordHash,        // 📋 EXPLICIT: Using same password hash in password field
          role: 'ADMIN',
          businessId: business.id,
          createdAt: now,
          updatedAt: now,
        },
      });
      
      console.log('✅ Admin staff created with data:', {
        id: adminStaff.id,
        name: adminStaff.name,
        email: adminStaff.email,
        role: adminStaff.role,
        businessId: adminStaff.businessId
      });

      return { business, adminStaff };
    });
    
    console.log('✅ Transaction completed successfully');
    
    // 📋 Create comprehensive audit log
    await createAuditLog('CREATE_BUSINESS_SUCCESS', 'BUSINESS', result.business.id, {
      businessName: result.business.name,
      ownerName: result.business.ownerName,
      email: result.business.email,
      slug: result.business.slug,
      plan: (result.business.settings as any)?.plan || validatedData.plan, // Access plan from settings with fallback
      adminStaffId: result.adminStaff.id,
      adminStaffName: result.adminStaff.name
    }, user.id);

    return NextResponse.json({
      business: {
        id: result.business.id,
        name: result.business.name,
        slug: result.business.slug,
        email: result.business.email,
        ownerName: result.business.ownerName,
        phone: result.business.phone,
        plan: (result.business.settings as any)?.plan || validatedData.plan, // Access plan from settings with fallback
        status: result.business.status,
        features: (result.business.settings as any)?.features || features, // Access features from settings with fallback
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
      loginUrl: `${process.env.NEXTAUTH_URL}/${result.business.slug}/staff/dashboard`
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Validation errors:', error.errors);
      await createAuditLog('CREATE_BUSINESS_VALIDATION_ERROR', 'BUSINESS', 'N/A', {
        validationErrors: error.errors
      }, 'UNKNOWN');
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    
    console.error('❌ Error creating business:', error);
    await createAuditLog('CREATE_BUSINESS_ERROR', 'BUSINESS', 'N/A', {
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 'UNKNOWN');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 