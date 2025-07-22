import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { confirm } = await request.json();
    
    if (!['APPLY_REJECTED_STATUS_MIGRATION', 'APPLY_ACCEPTED_STATUS_MIGRATION'].includes(confirm)) {
      return NextResponse.json({ 
        error: 'Send POST with {"confirm": "APPLY_REJECTED_STATUS_MIGRATION"} or {"confirm": "APPLY_ACCEPTED_STATUS_MIGRATION"} to apply migration'
      }, { status: 400 });
    }
    
    if (confirm === 'APPLY_REJECTED_STATUS_MIGRATION') {
      console.log('🔧 Applying REJECTED status migration to production database');
      
      // Apply the migration directly via SQL
      await prisma.$executeRaw`
        ALTER TYPE "AppointmentStatus" ADD VALUE IF NOT EXISTS 'REJECTED';
      `;
      
      console.log('✅ REJECTED status added to AppointmentStatus enum');
    }
    
    if (confirm === 'APPLY_ACCEPTED_STATUS_MIGRATION') {
      console.log('🔧 Applying ACCEPTED status migration to production database');
      
      // Apply the migration directly via SQL
      await prisma.$executeRaw`
        ALTER TYPE "AppointmentStatus" ADD VALUE IF NOT EXISTS 'ACCEPTED';
      `;
      
      console.log('✅ ACCEPTED status added to AppointmentStatus enum');
    }
    
    // Verify the migration worked
    const result = await prisma.$queryRaw`
      SELECT enumlabel 
      FROM pg_enum 
      WHERE enumtypid = (
        SELECT oid FROM pg_type WHERE typname = 'AppointmentStatus'
      )
      ORDER BY enumsortorder;
    `;
    
    console.log('✅ Migration applied successfully');
    console.log('📋 Current AppointmentStatus values:', result);
    
    return NextResponse.json({
      success: true,
      message: `${confirm === 'APPLY_REJECTED_STATUS_MIGRATION' ? 'REJECTED' : 'ACCEPTED'} status migration applied successfully`,
      currentStatuses: result
    });
    
  } catch (error: any) {
    console.error('❌ Migration error:', error);
    
    return NextResponse.json({
      error: 'Migration failed',
      details: error.message,
      message: 'Failed to apply status migration'
    }, { status: 500 });
  }
} 