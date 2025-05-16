import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET /api/patient/verify - Verify if user is a patient
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const patient = await prisma.patient.findFirst({
      where: { 
        email: session.user.email,
        status: 'ACTIVE'
      },
      include: {
        business: true
      }
    });

    if (!patient) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ 
      id: patient.id,
      businessId: patient.businessId,
      status: patient.status
    });
  } catch (error) {
    console.error('Error verifying patient:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 