import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const { emergency_key } = await request.json();
    
    // Emergency access key (remove this after login is fixed)
    if (emergency_key !== 'koobings_emergency_2025') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('🚨 EMERGENCY ADMIN ACCESS ACTIVATED');
    
    // Get admin from database
    const admin = await prisma.system_admins.findFirst({
      where: { email: 'f.queirozpedrosa@gmail.com' }
    });
    
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }
    
    // Create JWT token directly
    const token = sign({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: 'ADMIN',
      isAdmin: true
    }, JWT_SECRET, { expiresIn: '7d' });
    
    console.log('✅ Emergency admin access granted');
    
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
      },
      message: 'Emergency access granted'
    });
    
    // Set admin cookie
    response.cookies.set('admin-auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });
    
    return response;
    
  } catch (error) {
    console.error('🚨 Emergency access error:', error);
    return NextResponse.json({ 
      error: 'Emergency access failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 