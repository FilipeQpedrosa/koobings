import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { compare, hash } from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'STAFF') {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_FIELDS', message: 'Missing fields' } }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, error: { code: 'PASSWORD_TOO_SHORT', message: 'New password must be at least 8 characters.' } }, { status: 400 });
    }

    // Fetch staff user
    const staff = await prisma.staff.findUnique({
      where: { id: session.user.id },
    });
    if (!staff) {
      return NextResponse.json({ success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff not found' } }, { status: 404 });
    }

    // Validate current password
    const isValid = await compare(currentPassword, staff.password);
    if (!isValid) {
      return NextResponse.json({ success: false, error: { code: 'INCORRECT_PASSWORD', message: 'Current password is incorrect' } }, { status: 400 });
    }

    // Hash and update new password
    const newPasswordHash = await hash(newPassword, 10);
    await prisma.staff.update({
      where: { id: staff.id },
      data: { password: newPasswordHash },
    });

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ success: false, error: { code: 'CHANGE_PASSWORD_ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
} 