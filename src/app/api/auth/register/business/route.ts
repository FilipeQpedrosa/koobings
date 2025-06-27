import { NextResponse } from 'next/server';

export async function POST() {
  // Always return forbidden for now
  return NextResponse.json({ error: 'Registration is only available to system administrators.' }, { status: 403 });
} 