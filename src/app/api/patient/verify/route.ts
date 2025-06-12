import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/patient/verify - Verify if user is a client (was patient)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await prisma.client.findFirst({
      where: { 
        email: session.user.email,
        status: 'ACTIVE'
      },
      include: {
        business: true
      }
    });

    if (!client) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ 
      id: client.id,
      businessId: client.businessId,
      status: client.status
    });
  } catch (error) {
    console.error('Error verifying client:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 