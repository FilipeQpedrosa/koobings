import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const businessId = params.id;
    const { password } = await request.json();
    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }
    // Find the business
    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    // Hash and update password
    const passwordHash = await hash(password, 10);
    await prisma.business.update({ where: { id: businessId }, data: { passwordHash } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating owner password:', error);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
} 