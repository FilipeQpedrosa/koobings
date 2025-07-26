import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { createId } from '@paralleldrive/cuid2';

// GET: List all clients for a business
export async function GET(req: NextRequest) {
  try {
    const user = getRequestAuthUser(req);
    
    if (!user) {
      console.error('Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;
    
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID' } }, { status: 400 });
    }

    console.log('🔧 DEBUG: Fetching clients for businessId:', businessId);

    const clients = await prisma.client.findMany({
      where: { 
        businessId,
        isDeleted: { not: true }
      },
      include: {
        _count: {
          select: {
            appointments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('🔧 DEBUG: Found', clients.length, 'clients for business');
    console.log('🔧 DEBUG: Latest client:', clients[0] ? {
      id: clients[0].id,
      name: clients[0].name,
      createdAt: clients[0].createdAt
    } : 'No clients found');

    const response = NextResponse.json({ success: true, data: clients });
    
    // Add anti-cache headers to ensure fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
  } catch (error) {
    console.error('GET /staff/clients error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal Error' } }, { status: 500 });
  }
}

// POST: Create a new client
export async function POST(req: NextRequest) {
  try {
    const user = getRequestAuthUser(req);
    
    if (!user) {
      console.error('Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;
    
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID' } }, { status: 400 });
    }

    const data = await req.json();
    const { name, email, phone, notes } = data;
    
    if (!name) {
      return NextResponse.json({ success: false, error: { code: 'NAME_REQUIRED', message: 'Name is required' } }, { status: 400 });
    }
    
    // Check for existing email if provided
    if (email) {
      const existingClient = await prisma.client.findFirst({
        where: { 
          email: email,
          businessId: businessId,
          isDeleted: false
        }
      });
      
      if (existingClient) {
        return NextResponse.json({ 
          success: false, 
          error: { 
            code: 'EMAIL_ALREADY_EXISTS', 
            message: 'Cliente com este email já existe' 
          } 
        }, { status: 400 });
      }
    }

    console.log('🔧 DEBUG: Creating new client:', name, 'for businessId:', businessId);

    const client = await prisma.client.create({
      data: {
        id: createId(),
        name,
        email,
        phone,
        notes,
        businessId: businessId,
        status: 'ACTIVE',
        isDeleted: false,
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: {
            appointments: true
          }
        }
      }
    });
    
    console.log('🔧 DEBUG: Client created successfully:', client.id);
    
    const response = NextResponse.json({ success: true, data: client }, { status: 201 });
    
    // Add anti-cache headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
  } catch (err: any) {
    console.error('POST /staff/clients error:', err);
    
    if (err.code === 'P2002') {
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