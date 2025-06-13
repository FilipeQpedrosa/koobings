import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/business/verify - Verify if user is a business staff member
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
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
      return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Forbidden' } }, { status: 403 });
    }

    return NextResponse.json({ 
      success: true,
      data: {
        role: staff.role,
        businessId: staff.businessId,
        businessStatus: staff.business.status
      }
    });
  } catch (error) {
    console.error('GET /business/verify error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
}
// TODO: Add rate limiting middleware for abuse protection in the future. 