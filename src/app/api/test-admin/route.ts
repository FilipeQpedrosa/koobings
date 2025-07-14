import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Test admin endpoint called');
    
    const { email, password } = await request.json();
    console.log('📧 Testing login for:', email);

    // Check if it's an admin login
    const admin = await prisma.system_admins.findUnique({
      where: { email }
    });

    if (admin) {
      console.log('👑 System admin found:', admin.name);
      console.log('🔑 Admin ID:', admin.id);
      console.log('📝 Admin role:', admin.role);
      
      // Verify password
      const isValidPassword = await compare(password, admin.passwordHash);
      console.log('✅ Password valid:', isValidPassword);
      
      if (isValidPassword) {
        return NextResponse.json({ 
          success: true, 
          message: 'Admin login successful',
          admin: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role
          }
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid password' 
        }, { status: 401 });
      }
    } else {
      console.log('❌ Admin not found');
      return NextResponse.json({ 
        success: false, 
        message: 'Admin not found' 
      }, { status: 404 });
    }
    
  } catch (error) {
    console.error('🚨 Test admin endpoint error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 