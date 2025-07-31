import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 DEBUG: Starting Prisma test...');
    
    // Try to import prisma
    let prisma;
    try {
      const prismaModule = await import('@/lib/prisma');
      prisma = prismaModule.prisma;
      console.log('✅ Prisma import successful');
    } catch (importError) {
      console.error('❌ Prisma import failed:', importError);
      return NextResponse.json({
        success: false,
        error: 'Failed to import Prisma',
        details: importError instanceof Error ? importError.message : 'Unknown import error'
      }, { status: 500 });
    }
    
    // Check if prisma is defined
    if (!prisma) {
      return NextResponse.json({
        success: false,
        error: 'Prisma client is undefined after import',
        debug: {
          prismaType: typeof prisma,
          nodeEnv: process.env.NODE_ENV,
          databaseUrl: process.env.DATABASE_URL ? 'present' : 'missing'
        }
      }, { status: 500 });
    }
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Raw query successful:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Prisma connection working',
      rawQuery: result,
      debug: {
        prismaType: typeof prisma,
        nodeEnv: process.env.NODE_ENV,
        databaseUrl: process.env.DATABASE_URL ? 'present' : 'missing'
      }
    });
    
  } catch (error) {
    console.error('🚨 Debug Prisma error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 