import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(request: NextRequest, { params }: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }
    const businessId = params.id;
    const { password } = await request.json();
    if (!password || password.length < 8) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_PASSWORD', message: 'Password must be at least 8 characters.' } }, { status: 400 });
    }
    // Find the business
    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      return NextResponse.json({ success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } }, { status: 404 });
    }
    // Hash and update password
    const passwordHash = await hash(password, 10);
    await prisma.business.update({ where: { id: businessId }, data: { passwordHash } });
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('Error updating owner password:', error);
    return NextResponse.json({ success: false, error: { code: 'OWNER_PASSWORD_UPDATE_ERROR', message: 'Failed to update password' } }, { status: 500 });
  }
} 