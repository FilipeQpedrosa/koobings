import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const businessId = session.user.businessId;
    if (!businessId) {
      return NextResponse.json(
        { success: false, error: { code: 'NO_BUSINESS_CONTEXT', message: 'No business context' } },
        { status: 400 }
      );
    }

    const clients = await prisma.client.findMany({
      where: { businessId },
    });
    
    return NextResponse.json({ success: true, data: clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { success: false, error: { code: 'CLIENTS_FETCH_ERROR', message: 'Failed to fetch clients' } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const businessId = session.user.businessId;
    if (!businessId) {
      return NextResponse.json(
        { success: false, error: { code: 'NO_BUSINESS_CONTEXT', message: 'No business context' } },
        { status: 400 }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_REQUIRED_FIELDS', message: 'Name and email are required' } },
        { status: 400 }
      );
    }

    const client = await prisma.client.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        status: data.status || 'ACTIVE',
        notes: data.notes || null,
        businessId: businessId,
      },
    });
    
    return NextResponse.json({ success: true, data: client });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { success: false, error: { code: 'CLIENT_CREATE_ERROR', message: 'Failed to create client' } },
      { status: 500 }
    );
  }
} 