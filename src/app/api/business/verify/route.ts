import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET /api/business/verify - Verify if user is a business staff member
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const staff = await prisma.staff.findFirst({
      where: { 
        email: session.user.email,
        business: {
          status: 'ACTIVE'
        }
      },
      include: {
        business: true
      }
    });

    if (!staff) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ 
      role: staff.role,
      businessId: staff.businessId,
      businessStatus: staff.business.status
    });
  } catch (error) {
    console.error('Error verifying business staff:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 