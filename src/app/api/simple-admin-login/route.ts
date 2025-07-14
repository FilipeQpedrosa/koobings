import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log('🔐 Simple admin login for:', email);

    // Only check for admin login
    const admin = await prisma.system_admins.findUnique({
      where: { email }
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    console.log('👑 Admin found:', admin.name);

    // Verify password
    const isValidPassword = await compare(password, admin.passwordHash);
    
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    console.log('✅ Password verified');

    // Create simple JWT
    const token = sign({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: 'ADMIN',
      isAdmin: true
    }, JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ Token created');

    // Create response with cookie
    const response = NextResponse.json({ 
      success: true, 
      redirectUrl: '/admin/dashboard',
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'ADMIN',
        isAdmin: true
      }
    });

    // Set admin cookie
    response.cookies.set('admin-auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    console.log('✅ Response ready');
    return response;
    
  } catch (error) {
    console.error('🚨 Simple admin login error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 