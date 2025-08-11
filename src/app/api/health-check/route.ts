// CACHE BUSTER - 04/08/2025 14:56 - FORCE NEW DEPLOYMENT
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    deployment: 'vercel',
    version: '1.0.1' // Version bump to force cache invalidation
  });
} 