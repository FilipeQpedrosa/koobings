import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function parseSettings(settings: any) {
  if (!settings) return {};
  if (typeof settings === 'string') {
    try {
      return JSON.parse(settings);
    } catch {
      return {};
    }
  }
  return settings;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const businessId = session.user.businessId;
  if (!businessId) {
    return NextResponse.json({ error: 'No businessId' }, { status: 400 });
  }
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  const settings = parseSettings(business?.settings);
  return NextResponse.json({
    requireAdminCancelApproval: settings.requireAdminCancelApproval ?? false,
  });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.staffRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const businessId = session.user.businessId;
  if (!businessId) {
    return NextResponse.json({ error: 'No businessId' }, { status: 400 });
  }
  const body = await request.json();
  const { requireAdminCancelApproval } = body;
  if (typeof requireAdminCancelApproval !== 'boolean') {
    return NextResponse.json({ error: 'Invalid value' }, { status: 400 });
  }
  // Update settings JSON
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  const settings = parseSettings(business?.settings);
  settings.requireAdminCancelApproval = requireAdminCancelApproval;
  await prisma.business.update({
    where: { id: businessId },
    data: { settings },
  });
  return NextResponse.json({ success: true, requireAdminCancelApproval });
} 