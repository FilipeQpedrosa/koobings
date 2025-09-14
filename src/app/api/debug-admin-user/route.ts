import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('[DEBUG_ADMIN] 🔍 Checking admin user existence...');

    // Check if admin user exists in system_admins table
    const adminUser = await prisma.system_admins.findFirst({
      where: {
        email: 'f.queirozpedrosa@gmail.com'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    console.log('[DEBUG_ADMIN] Admin user found:', adminUser);

    // Also check all admin users
    const allAdmins = await prisma.system_admins.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    console.log('[DEBUG_ADMIN] All admin users:', allAdmins);

    return NextResponse.json({
      success: true,
      data: {
        targetAdmin: adminUser,
        allAdmins: allAdmins,
        adminExists: !!adminUser,
        totalAdmins: allAdmins.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[DEBUG_ADMIN] ❌ Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 