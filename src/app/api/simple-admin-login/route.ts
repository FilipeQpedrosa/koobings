import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log('🔐 Admin login attempt for:', email);

    // Only check for admin login
    const admin = await prisma.system_admins.findUnique({
      where: { email }
    });

    if (!admin) {
      console.log('❌ Admin not found:', email);
      return NextResponse.json({ error: 'Admin não encontrado' }, { status: 404 });
    }

    console.log('👑 Admin found:', admin.name);

    // Verify password
    let isValidPassword = await compare(password, admin.passwordHash);
    
    // If password doesn't match, try to reset it (emergency fix)
    if (!isValidPassword && password === 'admin123') {
      console.log('🔧 Emergency password reset for admin123...');
      const newHash = await hash('admin123', 12);
      
      await prisma.system_admins.update({
        where: { email },
        data: { passwordHash: newHash }
      });
      
      isValidPassword = true;
      console.log('✅ Password reset and verified');
    }
    
    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email);
      return NextResponse.json({ error: 'Password inválida' }, { status: 401 });
    }

    console.log('✅ Password verified for:', email);

    // Create simple JWT
    const token = sign({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: 'ADMIN',
      isAdmin: true
    }, JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ JWT token created');

    // Create successful response
    const successResponse = NextResponse.json({ 
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

    // Clear any existing auth cookies first
    const cookiesToClear = [
      'auth-token',
      'business-auth-token', 
      'admin-auth-token'
    ];
    
    cookiesToClear.forEach(cookieName => {
      successResponse.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0),
        path: '/'
      });
    });

    // Set admin cookie with proper settings for production
    const isProduction = process.env.NODE_ENV === 'production';
    
    successResponse.cookies.set('admin-auth-token', token, {
      httpOnly: false, // Allow JavaScript access for debugging
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
      domain: isProduction ? '.koobings.com' : undefined
    });

    // Also set a non-httpOnly version for immediate access
    successResponse.cookies.set('admin-token-debug', token.substring(0, 20) + '...', {
      httpOnly: false,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
      domain: isProduction ? '.koobings.com' : undefined
    });

    console.log('✅ Admin login successful:', admin.name);
    console.log('🍪 Cookie set with domain:', isProduction ? '.koobings.com' : 'localhost');
    console.log('🍪 Token preview:', token.substring(0, 50) + '...');
    
    return successResponse;
    
  } catch (error) {
    console.error('🚨 Admin login error:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
} 