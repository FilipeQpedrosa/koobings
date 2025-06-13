import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const segments = pathname.split('/');
  const id = segments[segments.indexOf('staff') + 1];
  return NextResponse.json({ success: true, data: { id } });
} 