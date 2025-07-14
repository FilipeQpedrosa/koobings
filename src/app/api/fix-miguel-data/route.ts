import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { confirm } = await request.json();
    
    if (confirm !== 'FIX_MIGUEL_DATA') {
      return NextResponse.json({ 
        error: 'Send POST with {"confirm": "FIX_MIGUEL_DATA"} to fix miguel@lanche.com data'
      }, { status: 400 });
    }
    
    const email = 'miguel@lanche.com';
    const correctName = 'Miguel';
    
    console.log(`🔧 Fixing data for ${email}`);
    
    let updates = [];
    
    // Check Staff table
    const staff = await prisma.staff.findUnique({
      where: { email }
    });
    
    if (staff) {
      console.log(`Staff found: ${staff.name} -> ${correctName}`);
      await prisma.staff.update({
        where: { email },
        data: { name: correctName }
      });
      updates.push(`Staff: ${staff.name} -> ${correctName}`);
    }
    
    // Check Business table  
    const business = await prisma.business.findUnique({
      where: { email }
    });
    
    if (business) {
      console.log(`Business found: ${business.ownerName} -> ${correctName}`);
      await prisma.business.update({
        where: { email },
        data: { ownerName: correctName }
      });
      updates.push(`Business: ${business.ownerName} -> ${correctName}`);
    }
    
    // Check Admin table
    const admin = await prisma.system_admins.findUnique({
      where: { email }
    });
    
    if (admin) {
      console.log(`Admin found: ${admin.name} -> ${correctName}`);
      await prisma.system_admins.update({
        where: { email },
        data: { name: correctName }
      });
      updates.push(`Admin: ${admin.name} -> ${correctName}`);
    }
    
    if (updates.length === 0) {
      return NextResponse.json({
        error: `No records found for ${email}`,
        message: 'User might not exist in database'
      }, { status: 404 });
    }
    
    console.log(`✅ Fixed ${updates.length} records for ${email}`);
    
    return NextResponse.json({
      success: true,
      message: `Fixed ${updates.length} records for ${email}`,
      updates: updates
    });
    
  } catch (error) {
    console.error('❌ Error fixing miguel data:', error);
    return NextResponse.json({ 
      error: 'Failed to fix data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const email = 'miguel@lanche.com';
    
    console.log(`🔍 Checking current data for ${email}`);
    
    const staff = await prisma.staff.findUnique({
      where: { email },
      select: { id: true, name: true, email: true }
    });
    
    const business = await prisma.business.findUnique({
      where: { email },
      select: { id: true, name: true, ownerName: true, email: true, slug: true }
    });
    
    const admin = await prisma.system_admins.findUnique({
      where: { email },
      select: { id: true, name: true, email: true }
    });
    
    const currentData = [];
    if (staff) currentData.push(`Staff: ${staff.name}`);
    if (business) currentData.push(`Business: ${business.ownerName}`);
    if (admin) currentData.push(`Admin: ${admin.name}`);
    
    return NextResponse.json({
      email,
      currentData,
      foundRecords: currentData.length,
      needsFix: currentData.some(data => data.includes('Pretinho'))
    });
    
  } catch (error) {
    console.error('❌ Error checking miguel data:', error);
    return NextResponse.json({ 
      error: 'Failed to check data' 
    }, { status: 500 });
  }
} 