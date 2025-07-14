import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface StaffResult {
  id: string;
  name: string;
  email: string;
  businessId: string;
  role: any;
}

interface BusinessResult {
  id: string;
  name: string;
  ownerName: string | null;
  email: string;
  slug: string | null;
}

interface AdminResult {
  id: string;
  name: string;
  email: string;
  role: any;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'miguel@lanche.com';
    const debug = searchParams.get('debug');
    
    // Simple protection - only allow in development or with debug key
    if (process.env.NODE_ENV === 'production' && debug !== 'allow123') {
      return NextResponse.json({ 
        error: 'Debug endpoint not available in production without debug key',
        hint: 'Add ?debug=allow123 to access'
      }, { status: 403 });
    }
    
    console.log('🔍 Checking database for:', email);
    
    const results = {
      searchEmail: email,
      staff: null as StaffResult | null,
      business: null as BusinessResult | null,
      admin: null as AdminResult | null,
      pretinhoRecords: {
        staff: [] as StaffResult[],
        business: [] as BusinessResult[],
        admin: [] as AdminResult[]
      }
    };
    
    // Check Staff table
    const staff = await prisma.staff.findUnique({
      where: { email }
    });
    
    if (staff) {
      results.staff = {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        businessId: staff.businessId,
        role: staff.role
      };
    }
    
    // Check Business table
    const business = await prisma.business.findUnique({
      where: { email }
    });
    
    if (business) {
      results.business = {
        id: business.id,
        name: business.name,
        ownerName: business.ownerName,
        email: business.email,
        slug: business.slug
      };
    }
    
    // Check System_admins table
    const admin = await prisma.system_admins.findUnique({
      where: { email }
    });
    
    if (admin) {
      results.admin = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      };
    }
    
    // Find any records with "Pretinho" name
    const staffWithPretinho = await prisma.staff.findMany({
      where: { 
        name: { contains: 'Pretinho', mode: 'insensitive' }
      },
      select: {
        id: true,
        name: true,
        email: true,
        businessId: true,
        role: true
      }
    });
    
    const businessWithPretinho = await prisma.business.findMany({
      where: { 
        OR: [
          { name: { contains: 'Pretinho', mode: 'insensitive' } },
          { ownerName: { contains: 'Pretinho', mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        ownerName: true,
        email: true,
        slug: true
      }
    });
    
    const adminWithPretinho = await prisma.system_admins.findMany({
      where: { 
        name: { contains: 'Pretinho', mode: 'insensitive' }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    results.pretinhoRecords = {
      staff: staffWithPretinho,
      business: businessWithPretinho,
      admin: adminWithPretinho
    };
    
    return NextResponse.json({
      success: true,
      data: results
    });
    
  } catch (error) {
    console.error('❌ Error checking user data:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check user data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 