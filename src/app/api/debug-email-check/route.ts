import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email') || 'sporttv@sporttv.com';
    
    console.log('🔍 DEBUG: Checking email in production:', email);
    
    // Exatamente a mesma verificação que a API de criação de negócio faz
    const [existingBusiness, existingStaff] = await Promise.all([
      prisma.business.findUnique({ where: { email: email } }),
      prisma.staff.findUnique({ where: { email: email } }),
    ]);
    
    // Contar todos os registros
    const counts = await Promise.all([
      prisma.business.count(),
      prisma.staff.count(),
    ]);
    
    // Listar todos os emails
    const allEmails = await Promise.all([
      prisma.business.findMany({ select: { email: true, name: true } }),
      prisma.staff.findMany({ select: { email: true, name: true } }),
    ]);
    
    return NextResponse.json({
      email: email,
      exists: {
        business: !!existingBusiness,
        staff: !!existingStaff,
        any: !!(existingBusiness || existingStaff)
      },
      conflictingRecords: {
        business: existingBusiness,
        staff: existingStaff
      },
      totalCounts: {
        businesses: counts[0],
        staff: counts[1]
      },
      allEmails: {
        businesses: allEmails[0],
        staff: allEmails[1]
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT_SET'
    });
    
  } catch (error) {
    console.error('❌ Debug email check error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 