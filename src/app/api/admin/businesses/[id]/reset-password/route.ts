import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Only allow system admins
    const admin = await prisma.systemAdmin.findUnique({ where: { email: session.user.email } });
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { newPassword } = await request.json();
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }
    const passwordHash = await hash(newPassword, 12);
    await prisma.business.update({
      where: { id: params.id },
      data: { passwordHash },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resetting business password:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 