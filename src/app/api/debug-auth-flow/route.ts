import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  console.log('🔍 DEBUG AUTH FLOW');
  console.log('🔍 Session:', session);
  console.log('🔍 Request URL:', request.url);
  console.log('🔍 Request headers:', Object.fromEntries(request.headers.entries()));
  
  return NextResponse.json({
    session,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  console.log('🔍 DEBUG AUTH FLOW - POST');
  console.log('🔍 Body:', body);
  console.log('🔍 Testing credentials...');
  
  // Test the authorize function directly
  const credentials = {
    email: body.email,
    password: body.password,
    role: body.role || 'ADMIN'
  };
  
  console.log('🔍 Testing with credentials:', { email: credentials.email, role: credentials.role });
  
  try {
    // Import the authorize function logic
    const { compare } = await import('bcryptjs');
    const { prisma } = await import('@/lib/prisma');
    
    if (credentials.role === 'ADMIN') {
      console.log('🔍 Testing admin login...');
      
      if (credentials.email !== 'f.queirozpedrosa@gmail.com') {
        return NextResponse.json({
          success: false,
          error: 'Unauthorized email for admin access',
          email: credentials.email
        });
      }
      
      const admin = await prisma.systemAdmin.findUnique({
        where: { email: credentials.email }
      });
      
      if (!admin) {
        return NextResponse.json({
          success: false,
          error: 'Admin not found',
          email: credentials.email
        });
      }
      
      const passwordMatch = await compare(credentials.password, admin.passwordHash);
      
      return NextResponse.json({
        success: passwordMatch,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        },
        passwordMatch,
        expectedRedirect: '/admin/dashboard'
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Only admin testing supported'
    });
    
  } catch (error) {
    console.error('🔍 Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 