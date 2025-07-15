import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }
    
    console.log('🔍 Checking email:', email);
    
    // Exatamente a mesma verificação que a API de criação de negócio faz
    const [existingBusiness, existingStaff] = await Promise.all([
      prisma.business.findUnique({ where: { email: email } }),
      prisma.staff.findUnique({ where: { email: email } }),
    ]);
    
    const isInUse = !!(existingBusiness || existingStaff);
    
    return NextResponse.json({
      email: email,
      inUse: isInUse,
      foundIn: {
        business: !!existingBusiness,
        staff: !!existingStaff
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Check email error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email;
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }
    
    console.log('🔍 POST checking email:', email);
    
    // Exatamente a mesma verificação que a API de criação de negócio faz
    const [existingBusiness, existingStaff] = await Promise.all([
      prisma.business.findUnique({ where: { email: email } }),
      prisma.staff.findUnique({ where: { email: email } }),
    ]);
    
    const isInUse = !!(existingBusiness || existingStaff);
    
    if (isInUse) {
      return NextResponse.json({ error: 'Email já está em uso' }, { status: 400 });
    }
    
    return NextResponse.json({
      email: email,
      available: true,
      message: 'Email disponível'
    });
    
  } catch (error) {
    console.error('❌ Check email POST error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 