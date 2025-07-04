import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 DEBUG SESSION API CALLED');
    
    const session = await getServerSession(authOptions);
    
    console.log('📋 Current session:', JSON.stringify(session, null, 2));
    
    if (!session?.user?.email) {
      return NextResponse.json({
        error: 'No session found',
        session: null
      });
    }

    // Get current user data from database
    const email = session.user.email;
    console.log('🔍 Looking up email in database:', email);
    
    // Check all user types for this email
    const [admin, business, staff] = await Promise.all([
      prisma.systemAdmin.findUnique({
        where: { email },
        select: { id: true, email: true, name: true, role: true }
      }),
      prisma.business.findUnique({
        where: { email },
        select: { id: true, email: true, name: true, ownerName: true, status: true }
      }),
      prisma.staff.findUnique({
        where: { email },
        include: { business: { select: { id: true, name: true, email: true } } }
      })
    ]);

    console.log('📊 Database results:');
    console.log('  - Admin:', admin);
    console.log('  - Business:', business);
    console.log('  - Staff:', staff);

    return NextResponse.json({
      success: true,
      session,
      databaseResults: {
        admin,
        business,
        staff,
        foundIn: {
          admin: !!admin,
          business: !!business,
          staff: !!staff
        }
      },
      analysis: {
        sessionRole: session.user.role,
        sessionBusinessId: session.user.businessId,
        sessionStaffRole: session.user.staffRole,
        sessionName: session.user.name,
        expectedName: staff?.name || business?.name || business?.ownerName || admin?.name,
        expectedBusinessId: staff?.businessId || business?.id,
        mismatch: {
          name: session.user.name !== (staff?.name || business?.name || business?.ownerName || admin?.name),
          businessId: session.user.businessId !== (staff?.businessId || business?.id)
        }
      }
    });

  } catch (error) {
    console.error('❌ Debug session error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 