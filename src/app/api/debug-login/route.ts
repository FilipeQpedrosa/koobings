import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(request: NextRequest) {
  try {
    console.log('🐛 Debug login endpoint called');
    
    const { email, password } = await request.json();
    console.log('📧 Email:', email);

    // Step 1: Check admin exists
    console.log('Step 1: Finding admin...');
    const admin = await prisma.system_admins.findUnique({
      where: { email }
    });

    if (!admin) {
      return NextResponse.json({ 
        success: false, 
        step: 1,
        message: 'Admin not found' 
      });
    }
    
    console.log('✅ Step 1: Admin found');

    // Step 2: Verify password
    console.log('Step 2: Verifying password...');
    const isValidPassword = await compare(password, admin.passwordHash);
    
    if (!isValidPassword) {
      return NextResponse.json({ 
        success: false, 
        step: 2,
        message: 'Invalid password' 
      });
    }
    
    console.log('✅ Step 2: Password verified');

    // Step 3: Create basic JWT
    console.log('Step 3: Creating JWT...');
    const basicPayload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: 'ADMIN'
    };
    
    const token = sign(basicPayload, JWT_SECRET, { expiresIn: '7d' });
    console.log('✅ Step 3: JWT created');

    // Step 4: Return response
    console.log('Step 4: Creating response...');
    const response = NextResponse.json({ 
      success: true, 
      step: 4,
      message: 'Login successful',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      token: token.substring(0, 50) + '...'
    });
    
    console.log('✅ Step 4: Response created');
    return response;
    
  } catch (error) {
    console.error('🚨 Debug login error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 