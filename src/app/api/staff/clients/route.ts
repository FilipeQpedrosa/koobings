import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt';
import { createId } from '@paralleldrive/cuid2';

// GET /api/staff/clients - List clients for the business
// POST /api/staff/clients - Add a new client

export async function GET(req: NextRequest) {
  const user = getRequestAuthUser(req);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const businessId = user.businessId;
  if (!businessId) {
    return NextResponse.json({ success: false, error: 'Business ID missing' }, { status: 400 });
  }
  const staffId = user.id;
  const staffRole = user.staffRole;
  
  try {
    // Fetch business and setting
    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      return NextResponse.json({ success: false, error: 'Business not found' }, { status: 404 });
    }
    
    const restrict = business.restrictStaffToViewAllClients;
    let clients;
    
    // Admins sempre veem todos os clientes, mas excluir dados dummy
    if (user.role === 'STAFF' && staffRole === 'ADMIN') {
      clients = await prisma.client.findMany({
        where: {
          businessId,
          NOT: { 
            OR: [
              { email: 'system@scheduler.local' },
              { name: { contains: 'Ana Santos' } },
              { name: { contains: 'João Silva' } }
            ]
          }
        },
        include: {
          _count: {
            select: {
              appointments: true
            }
          }
        },
        orderBy: { name: 'asc' },
      });
    } else if (!restrict) {
      clients = await prisma.client.findMany({
        where: {
          businessId,
          NOT: { 
            OR: [
              { email: 'system@scheduler.local' },
              { name: { contains: 'Ana Santos' } },
              { name: { contains: 'João Silva' } }
            ]
          }
        },
        include: {
          _count: {
            select: {
              appointments: true
            }
          }
        },
        orderBy: { name: 'asc' },
      });
    } else {
      clients = await prisma.client.findMany({
        where: {
          businessId,
          NOT: { 
            OR: [
              { email: 'system@scheduler.local' },
              { name: { contains: 'Ana Santos' } },
              { name: { contains: 'João Silva' } }
            ]
          },
          OR: [
            { appointments: { some: { staffId } } },
            { relationshipNotes: { some: { createdById: staffId } } },
          ],
        },
        include: {
          _count: {
            select: {
              appointments: true
            }
          }
        },
        orderBy: { name: 'asc' },
      });
    }
    
    return NextResponse.json({ success: true, data: clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = getRequestAuthUser(req);
  if (!user) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
  }
  
  const businessId = user.businessId;
  if (!businessId) {
    return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Business ID missing' } }, { status: 400 });
  }

  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) {
    return NextResponse.json({ success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } }, { status: 404 });
  }

  const data = await req.json();
  const { name, email, phone } = data;
  if (!name) {
    return NextResponse.json({ success: false, error: { code: 'NAME_REQUIRED', message: 'Name is required' } }, { status: 400 });
  }
  
  try {
    // Check for existing email if provided
    if (email) {
      console.log(`🔍 Checking for existing client with email: ${email} in business: ${businessId}`);
      
      const existingClient = await prisma.client.findFirst({
        where: { 
          email: email,
          businessId: businessId,
          isDeleted: false // Only check non-deleted clients
        }
      });
      
      if (existingClient) {
        console.log(`❌ Client with email ${email} already exists:`, existingClient.id);
        return NextResponse.json({ 
          success: false, 
          error: { 
            code: 'EMAIL_ALREADY_EXISTS', 
            message: 'Cliente com este email já existe' 
          } 
        }, { status: 400 });
      }
      
      console.log(`✅ Email ${email} is available for new client`);
    }

    console.log(`🆕 Creating new client: ${name} (${email}) for business: ${businessId}`);

    const client = await prisma.client.create({
      data: {
        id: createId(),
        name,
        email,
        phone,
        businessId: business.id,
        status: 'ACTIVE',
        isDeleted: false,
        updatedAt: new Date(),
      },
    });
    
    console.log(`✅ Client created successfully:`, client.id);
    return NextResponse.json({ success: true, data: client }, { status: 201 });
  } catch (err: any) {
    console.error('❌ Error creating client:', err);
    
    if (err.code === 'P2002') {
      // This is a Prisma unique constraint violation
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
        message: err.message || 'Failed to create client' 
      } 
    }, { status: 500 });
  }
} 