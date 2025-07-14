import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug admin endpoint called');
    
    // Test JWT verification
    const token = request.cookies.get('admin-auth-token')?.value || request.cookies.get('auth-token')?.value;
    console.log('🍪 Auth token found:', !!token);
    
    if (!token) {
      return NextResponse.json({ 
        error: 'No auth token found',
        debug: {
          cookies: Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value]))
        }
      }, { status: 401 });
    }
    
    let decoded;
    try {
      decoded = verify(token, process.env.NEXTAUTH_SECRET!) as any;
      console.log('✅ JWT decoded:', { id: decoded.id, email: decoded.email, role: decoded.role, isAdmin: decoded.isAdmin });
    } catch (jwtError) {
      return NextResponse.json({ 
        error: 'JWT verification failed',
        jwtError: jwtError instanceof Error ? jwtError.message : 'Unknown JWT error'
      }, { status: 401 });
    }
    
    // Check admin status
    const isAdmin = decoded.isAdmin || decoded.role === 'ADMIN';
    console.log('🔐 Is admin:', isAdmin);
    
    if (!isAdmin) {
      return NextResponse.json({ 
        error: 'Not admin',
        decoded
      }, { status: 403 });
    }
    
    // Test database connection
    let businessCount;
    try {
      businessCount = await prisma.business.count();
      console.log('📊 Total businesses in database:', businessCount);
    } catch (dbError) {
      return NextResponse.json({ 
        error: 'Database error',
        dbError: dbError instanceof Error ? dbError.message : 'Unknown DB error'
      }, { status: 500 });
    }
    
    // Test business query
    let businesses;
    try {
      businesses = await prisma.business.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          ownerName: true,
          phone: true,
          plan: true,
          status: true,
          createdAt: true,
        },
        take: 5, // Just first 5 for testing
      });
      console.log('📋 Sample businesses:', businesses);
    } catch (queryError) {
      return NextResponse.json({ 
        error: 'Query error',
        queryError: queryError instanceof Error ? queryError.message : 'Unknown query error'
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      debug: {
        jwtValid: true,
        isAdmin,
        businessCount,
        sampleBusinesses: businesses,
        user: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          isAdmin: decoded.isAdmin
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    return NextResponse.json({ 
      error: 'Debug endpoint error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 