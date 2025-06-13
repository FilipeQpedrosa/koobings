import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const clients = await prisma.client.findMany();
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
    const data = await request.json();
    if (!data.businessId) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_ID_REQUIRED', message: 'businessId is required' } },
        { status: 400 }
      );
    }
    const client = await prisma.client.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status,
        notes: data.notes,
        business: {
          connect: { id: data.businessId }
        }
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