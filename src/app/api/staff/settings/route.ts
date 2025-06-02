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

export async function GET(request: Request) {
  const businessName = request.headers.get('x-business');
  if (!businessName) {
    return NextResponse.json({ error: 'Business subdomain missing' }, { status: 400 });
  }
  const business = await prisma.business.findFirst({ where: { name: businessName } });
  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }
  const settings = parseSettings(business?.settings);
  return NextResponse.json({
    requireAdminCancelApproval: settings.requireAdminCancelApproval ?? false,
  });
}

export async function PATCH(request: Request) {
  const businessName = request.headers.get('x-business');
  if (!businessName) {
    return NextResponse.json({ error: 'Business subdomain missing' }, { status: 400 });
  }
  const business = await prisma.business.findFirst({ where: { name: businessName } });
  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }
  const body = await request.json();
  const { requireAdminCancelApproval } = body;
  if (typeof requireAdminCancelApproval !== 'boolean') {
    return NextResponse.json({ error: 'Invalid value' }, { status: 400 });
  }
  // Update settings JSON
  const settings = parseSettings(business?.settings);
  settings.requireAdminCancelApproval = requireAdminCancelApproval;
  await prisma.business.update({
    where: { id: business.id },
    data: { settings },
  });
  return NextResponse.json({ success: true, requireAdminCancelApproval });
} 