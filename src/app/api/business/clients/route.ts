import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt';

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
      notes: client.notes
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
    const user = getRequestAuthUser(request);

    if (!user) {
      console.error('Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    let businessId: string;
    let hasAdminPermission = false;

    // Handle both staff members and business owners
    if (user.role === 'BUSINESS_OWNER') {
      if (!user.businessId) {
        return NextResponse.json({ success: false, error: { code: 'BUSINESS_ID_MISSING', message: 'Business ID missing' } }, { status: 400 });
      }
      businessId = user.businessId;
      hasAdminPermission = true;
    } else {
      // For staff members, check admin role
      const staff = await prisma.staff.findUnique({
        where: { email: user.email }
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

    const body = await request.json();
    const { name, email, phone, notes } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_FIELDS', message: 'Name and email are required' } }, { status: 400 });
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone: phone || null,
        notes: notes || null,
        status: 'ACTIVE',
        businessId,
      },
    });

    return NextResponse.json({ success: true, data: client }, { status: 201 });
  } catch (error) {
    console.error('POST /business/clients error:', error);
    return NextResponse.json({ success: false, error: { code: 'CLIENT_CREATE_ERROR', message: 'Failed to create client' } }, { status: 500 });
  }
} 