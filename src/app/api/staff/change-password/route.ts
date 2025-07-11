import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { compare, hash } from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_FIELDS', message: 'Missing fields' } }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, error: { code: 'PASSWORD_TOO_SHORT', message: 'New password must be at least 8 characters.' } }, { status: 400 });
    }

    let currentPasswordHash: string;
    
    // Check if user is BUSINESS_OWNER or STAFF
    if (user.role === 'BUSINESS_OWNER') {
      const business = await prisma.business.findUnique({
        where: { id: user.id },
      });
      if (!business) {
        return NextResponse.json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'Business not found' } }, { status: 404 });
      }
      currentPasswordHash = business.passwordHash;
    } else {
      // Fetch staff user
      const staff = await prisma.staff.findUnique({
        where: { id: user.id },
      });
      if (!staff) {
        return NextResponse.json({ success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff not found' } }, { status: 404 });
      }
      currentPasswordHash = staff.password;
    }

    // Validate current password
    const isValid = await compare(currentPassword, currentPasswordHash);
    if (!isValid) {
      return NextResponse.json({ success: false, error: { code: 'INCORRECT_PASSWORD', message: 'Current password is incorrect' } }, { status: 400 });
    }

    // Hash new password
    const newPasswordHash = await hash(newPassword, 10);
    
    // Update password based on user type
    if (user.role === 'BUSINESS_OWNER') {
      await prisma.business.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash },
      });
    } else {
      await prisma.staff.update({
        where: { id: user.id },
        data: { password: newPasswordHash },
      });
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ success: false, error: { code: 'CHANGE_PASSWORD_ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
} 