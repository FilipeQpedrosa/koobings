import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Optionally, check if user is admin
  // const admin = await prisma.systemAdmin.findUnique({ where: { email: session.user.email } });
  // if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const [totalBusinesses, activeBusinesses, pendingVerifications] = await Promise.all([
    prisma.business.count(),
    prisma.business.count({ where: { status: 'ACTIVE' } }),
    prisma.businessVerification.count({ where: { status: 'PENDING' } })
  ]);

  return NextResponse.json({
    totalBusinesses,
    activeBusinesses,
    pendingVerifications
  });
} 