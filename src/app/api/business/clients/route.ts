import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { createId } from '@paralleldrive/cuid2';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Business clients API called');
    
    const user = getRequestAuthUser(request);

    if (!user) {
      console.error('❌ Unauthorized: No valid JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;
    console.log('👤 User access, businessId:', businessId);

    // Get clients with basic info
    const clients = await prisma.client.findMany({
      where: {
        businessId,
        isDeleted: false
      },
      orderBy: { name: 'asc' }
    });

    console.log('📊 Found clients:', clients.length);

    // Simple client mapping
    const clientsWithMetrics = clients.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      lastVisit: null,
      totalVisits: 0,
      totalAppointments: 0,
      status: client.status,
      notes: client.notes,
      isEligible: client.isEligible // ✅ NEW: Campo apto/não apto
    }));

    // Simple metrics
    const metrics = {
      totalClients: clientsWithMetrics.length,
      visitsThisMonth: 0,
      clientsWithContact: clientsWithMetrics.filter(c => c.phone || c.email).length
    };

    console.log('📈 Calculated metrics:', metrics);

    return NextResponse.json({ 
      success: true, 
      data: {
        clients: clientsWithMetrics,
        metrics
      }
    });
  } catch (error) {
    console.error('❌ GET /business/clients error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🆕 Creating new client via business API');
    
    const user = getRequestAuthUser(request);

    if (!user) {
      console.error('❌ Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    console.log('👤 User found:', { role: user.role, businessId: user.businessId, email: user.email });

    let businessId: string;
    let hasAdminPermission = false;

    // Handle both staff members and business owners
    if (user.role === 'BUSINESS_OWNER') {
      if (!user.businessId) {
        console.error('❌ Business owner missing businessId');
        return NextResponse.json({ success: false, error: { code: 'BUSINESS_ID_MISSING', message: 'Business ID missing' } }, { status: 400 });
      }
      businessId = user.businessId;
      hasAdminPermission = true;
      console.log('✅ Business owner access granted');
    } else {
      // For staff members, check admin role
      console.log('🔍 Checking staff permissions for email:', user.email);
      
      const staff = await prisma.staff.findUnique({
        where: { email: user.email },
        select: {
          id: true,
          role: true,
          businessId: true,
          email: true
        }
      });

      console.log('👥 Staff found:', staff);

      if (!staff || staff.role !== 'ADMIN') {
        console.error('❌ Unauthorized: Not admin staff.');
        return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } }, { status: 401 });
      }

      businessId = staff.businessId;
      hasAdminPermission = true;
      console.log('✅ Staff admin access granted');
    }

    if (!hasAdminPermission) {
      console.error('❌ No admin permission');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } }, { status: 401 });
    }

    const body = await request.json();
    console.log('📝 Request body:', { ...body, phone: body.phone ? '[REDACTED]' : 'none' });
    
    const { name, email, phone, notes } = body;

    if (!name || !email) {
      console.error('❌ Missing required fields:', { name: !!name, email: !!email });
      return NextResponse.json({ success: false, error: { code: 'MISSING_FIELDS', message: 'Name and email are required' } }, { status: 400 });
    }

    // Check for existing client with same email in this business
    const existingClient = await prisma.client.findFirst({
      where: {
        email: email,
        businessId: businessId,
        isDeleted: false
      }
    });

    if (existingClient) {
      console.error('❌ Client with email already exists:', email);
      return NextResponse.json({ 
        success: false, 
        error: { 
          code: 'EMAIL_ALREADY_EXISTS', 
          message: 'Cliente com este email já existe' 
        } 
      }, { status: 400 });
    }

    console.log('🆕 Creating client for business:', businessId);

    const client = await prisma.client.create({
      data: {
        id: createId(),
        name,
        email,
        phone: phone || null,
        notes: notes || null,
        status: 'ACTIVE',
        businessId,
        isDeleted: false,
        isEligible: true, // ✅ NEW: Por defeito, cliente é apto
        updatedAt: new Date()
      },
    });

    console.log('✅ Client created successfully:', { id: client.id, name: client.name, email: client.email });

    return NextResponse.json({ success: true, data: client }, { status: 201 });
  } catch (error) {
    console.error('❌ POST /business/clients error:', error);
    
    // Handle Prisma unique constraint errors
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ 
        success: false, 
        error: { 
          code: 'EMAIL_ALREADY_EXISTS', 
          message: 'Cliente com este email já existe' 
        } 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'CLIENT_CREATE_ERROR', 
        message: 'Failed to create client',
        details: error instanceof Error ? error.message : 'Unknown error'
      } 
    }, { status: 500 });
  }
} 