import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { verify } from 'jsonwebtoken';

// JWT Authentication helper
async function verifyAdminJWT(request: NextRequest): Promise<any | null> {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = verify(token, process.env.NEXTAUTH_SECRET!) as any;
    
    // Check if user is admin
    if (!decoded.isAdmin && decoded.role !== 'ADMIN') {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.log('❌ JWT verification failed:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAdminJWT(request);
    if (!user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }
    
    // Verify user is system admin
    const admin = await prisma.systemAdmin.findUnique({ where: { email: user.email } });
    if (!admin) {
      return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Forbidden' } }, { status: 403 });
    }
    
    const { newPassword } = await request.json();
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_PASSWORD', message: 'Password must be at least 8 characters.' } }, { status: 400 });
    }
    
    // Extract business id from the URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').filter(Boolean).at(-2);
    if (!id) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Business ID missing in URL' } }, { status: 400 });
    }
    
    const passwordHash = await hash(newPassword, 12);
    await prisma.business.update({
      where: { id },
      data: { passwordHash },
    });
    
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('Error resetting business password:', error);
    return NextResponse.json({ success: false, error: { code: 'RESET_PASSWORD_ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
} 