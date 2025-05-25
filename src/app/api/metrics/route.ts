import { NextResponse } from 'next/server';
import { register } from '@/lib/metrics';

export async function GET() {
  try {
    const metrics = await register.metrics();
    return new NextResponse(metrics, {
      headers: {
        'Content-Type': register.contentType
      }
    });
  } catch (err) {
    console.error('Error generating metrics:', err);
    return new NextResponse('Error generating metrics', { status: 500 });
  }
} 