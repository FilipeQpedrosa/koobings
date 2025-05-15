import { NextResponse } from 'next/server';
import { PrismaClient, VerificationStatus, BusinessStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import { sendVerificationEmail } from '@/lib/email';

const prisma = new PrismaClient();

// POST /api/admin/businesses/[id]/verify - Verify a business
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify if the user is a system admin
    const admin = await prisma.systemAdmin.findUnique({
      where: { email: session.user.email }
    });

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { status, notes } = body as { status: VerificationStatus; notes?: string };

    // Get business details
    const business = await prisma.business.findUnique({
      where: { id: params.id }
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Update business verification status
    const verification = await prisma.businessVerification.update({
      where: { businessId: params.id },
      data: {
        status,
        notes,
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    });

    // If approved, update business status
    if (status === 'APPROVED') {
      await prisma.business.update({
        where: { id: params.id },
        data: { status: BusinessStatus.ACTIVE }
      });
    }

    // Send email notification
    await sendVerificationEmail(
      business.email,
      business.name,
      status,
      notes
    );

    return NextResponse.json(verification);
  } catch (error) {
    console.error('Error verifying business:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 