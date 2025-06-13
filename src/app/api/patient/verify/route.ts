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
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
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
      return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Forbidden' } }, { status: 403 });
    }

    return NextResponse.json({ 
      success: true,
      data: {
        id: client.id,
        businessId: client.businessId,
        status: client.status
      }
    });
  } catch (error) {
    console.error('Error verifying client:', error);
    return NextResponse.json({ success: false, error: { code: 'VERIFY_ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
} 