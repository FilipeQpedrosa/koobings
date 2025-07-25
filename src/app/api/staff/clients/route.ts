import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createId } from '@paralleldrive/cuid2';

// GET /api/staff/clients - List clients for the business
// POST /api/staff/clients - Add a new client

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.businessId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { businessId } = session.user;
  
  try {
    // Fetch business and setting
    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      return NextResponse.json({ success: false, error: 'Business not found' }, { status: 404 });
    }
    
    // For now, show all clients regardless of restrictions to fix the new client visibility issue
    const clients = await prisma.client.findMany({
      where: {
        businessId,
        isDeleted: { not: true }, // Only show non-deleted clients
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
    
    return NextResponse.json({ success: true, data: clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== 'STAFF' && session.user.role !== 'BUSINESS_OWNER')) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
  }
  
  const businessId = session.user.businessId;
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