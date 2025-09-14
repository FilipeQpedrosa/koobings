import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('[EMERGENCY_SETUP] 🚨 Emergency admin setup...');

    // Check if admin already exists
    const existingAdmin = await prisma.system_admins.findFirst({
      where: {
        email: 'f.queirozpedrosa@gmail.com'
      }
    });

    if (existingAdmin) {
      console.log('[EMERGENCY_SETUP] ✅ Admin already exists');
      return NextResponse.json({
        success: true,
        message: 'Admin já existe',
        data: {
          adminExists: true,
          adminEmail: existingAdmin.email,
          adminId: existingAdmin.id
        }
      });
    }

    // Create admin user
    const hashedPassword = await hash('admin123', 12);
    
    const newAdmin = await prisma.system_admins.create({
      data: {
        id: `admin_${Date.now()}`,
        email: 'f.queirozpedrosa@gmail.com',
        name: 'Filipe Pedrosa',
        passwordHash: hashedPassword,
        role: 'SUPER_ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('[EMERGENCY_SETUP] ✅ Admin created:', newAdmin.email);

    return NextResponse.json({
      success: true,
      message: 'Admin criado com sucesso',
      data: {
        adminCreated: true,
        adminEmail: newAdmin.email,
        adminId: newAdmin.id,
        adminRole: newAdmin.role
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[EMERGENCY_SETUP] ❌ Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('[EMERGENCY_SETUP] 🔍 Checking admin status...');

    // Check if admin exists
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

    // Get all admins
    const allAdmins = await prisma.system_admins.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

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
    console.error('[EMERGENCY_SETUP] ❌ Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 