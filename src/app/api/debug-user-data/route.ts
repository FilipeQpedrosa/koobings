import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ 
      error: 'Email parameter is required',
      usage: 'Add ?email=user@example.com to the URL'
    }, { status: 400 });
  }

  console.log('🔍 Debug user data for email:', email);

  try {
    // Check in system_admins table
    const admin = await prisma.system_admins.findUnique({
      where: { email }
    });

    if (admin) {
      return NextResponse.json({
        found: true,
        type: 'system_admin',
        data: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          createdAt: admin.createdAt
        }
      });
    }

    // Check in business table
    const business = await prisma.business.findUnique({
      where: { email }
    });

    if (business) {
      return NextResponse.json({
        found: true,
        type: 'business_owner',
        data: {
          id: business.id,
          email: business.email,
          name: business.name,
          ownerName: business.ownerName,
          slug: business.slug,
          status: business.status,
          createdAt: business.createdAt
        }
      });
    }

    // Check in staff table
    const staff = await prisma.staff.findUnique({
      where: { email },
      include: {
        Business: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });

    if (staff) {
      return NextResponse.json({
        found: true,
        type: 'staff',
        data: {
          id: staff.id,
          email: staff.email,
          name: staff.name,
          role: staff.role,
          businessId: staff.businessId,
          businessName: staff.Business?.name,
          businessSlug: staff.Business?.slug,
          createdAt: staff.createdAt
        }
      });
    }

    // User not found in any table
    return NextResponse.json({
      found: false,
      message: `No user found with email: ${email}`,
      searchedIn: ['system_admins', 'business', 'staff']
    });

  } catch (error) {
    console.error('❌ Error searching for user:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 