import { NextResponse } from 'next/server';
import { PrismaClient, VerificationStatus, BusinessStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

const prisma = new PrismaClient();

// POST /api/admin/businesses/[id]/verify - Verify a business
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(request: Request, { params }: any) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    // Verify if the user is a system admin
    const admin = await prisma.systemAdmin.findUnique({
      where: { email: session.user.email }
    });

    if (!admin) {
      return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Forbidden' } }, { status: 403 });
    }

    const body = await request.json();
    const { status, notes } = body as { status: VerificationStatus; notes?: string };

    // Get business details
    const business = await prisma.business.findUnique({
      where: { id: params.id }
    });

    if (!business) {
      return NextResponse.json({ success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } }, { status: 404 });
    }

    // Update business verification status
    const verification = await prisma.businessVerification.upsert({
      where: { businessId: params.id },
      update: {
        status,
        notes,
        verifiedAt: new Date(),
        verifiedBy: admin.id
      },
      create: {
        businessId: params.id,
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

    // Send email notification only if status is APPROVED or REJECTED
    if (status === 'APPROVED' || status === 'REJECTED') {
      await sendVerificationEmail(
        business.email,
        business.name,
        status,
        notes
      );
    }

    return NextResponse.json({ success: true, data: verification });
  } catch (error) {
    console.error('Error verifying business:', error);
    return NextResponse.json({ success: false, error: { code: 'BUSINESS_VERIFY_ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
} 