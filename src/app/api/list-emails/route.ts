import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('📧 Listing all emails in database...');
    
    const [businesses, staff] = await Promise.all([
      prisma.business.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          slug: true,
          status: true,
          createdAt: true
        }
      }),
      prisma.staff.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          businessId: true,
          createdAt: true
        }
      })
    ]);
    
    const businessEmails = businesses.map(b => ({
      type: 'business',
      id: b.id,
      name: b.name,
      email: b.email,
      slug: b.slug,
      status: b.status,
      createdAt: b.createdAt
    }));
    
    const staffEmails = staff.map(s => ({
      type: 'staff',
      id: s.id,
      name: s.name,
      email: s.email,
      role: s.role,
      businessId: s.businessId,
      createdAt: s.createdAt
    }));
    
    const allEmails = [...businessEmails, ...staffEmails];
    
    // Group by email to find duplicates
    const emailGroups = allEmails.reduce((acc, item) => {
      if (!acc[item.email]) {
        acc[item.email] = [];
      }
      acc[item.email].push(item);
      return acc;
    }, {} as Record<string, typeof allEmails>);
    
    const duplicateEmails = Object.entries(emailGroups)
      .filter(([email, items]) => items.length > 1)
      .map(([email, items]) => ({ email, items }));
    
    return NextResponse.json({
      summary: {
        totalBusinesses: businesses.length,
        totalStaff: staff.length,
        totalEmails: allEmails.length,
        uniqueEmails: Object.keys(emailGroups).length,
        duplicateEmails: duplicateEmails.length
      },
      businesses: businessEmails,
      staff: staffEmails,
      duplicates: duplicateEmails,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ List emails error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 