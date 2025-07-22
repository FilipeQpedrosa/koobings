import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { prisma } from '@/lib/prisma';

// GET /api/admin/businesses/[id]/visibility
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getRequestAuthUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const business = await prisma.business.findUnique({
      where: { id: params.id },
      select: { 
        id: true, 
        name: true, 
        slug: true,
        status: true,
        settings: true,
        createdAt: true,
        updatedAt: true,
        // Business stats for visibility decision
        _count: {
          select: {
            Service: true,
            Staff: true,
            appointments: true
          }
        }
      }
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const settings = business.settings as any || {};
    const visibilitySettings = {
      // Business visibility controls
      isPublic: settings.visibility?.isPublic ?? false,
      showInMarketplace: settings.visibility?.showInMarketplace ?? false,
      showInSearch: settings.visibility?.showInSearch ?? false,
      allowOnlineBooking: settings.visibility?.allowOnlineBooking ?? true,
      
      // Admin controls
      adminApproved: settings.visibility?.adminApproved ?? false,
      adminNotes: settings.visibility?.adminNotes ?? '',
      lastUpdatedBy: settings.visibility?.lastUpdatedBy ?? null,
      lastUpdatedAt: settings.visibility?.lastUpdatedAt ?? null,
      
      // Business readiness indicators
      hasServices: business._count.Service > 0,
      hasStaff: business._count.Staff > 0,
      hasBookings: business._count.appointments > 0,
      businessStatus: business.status || 'PENDING'
    };

    return NextResponse.json({
      success: true,
      data: {
        business: {
          id: business.id,
          name: business.name,
          slug: business.slug,
          status: business.status,
          createdAt: business.createdAt,
          updatedAt: business.updatedAt,
          stats: business._count
        },
        visibilitySettings
      }
    });

  } catch (error) {
    console.error('❌ Error fetching business visibility settings:', error);
    return NextResponse.json({
      error: 'Failed to fetch visibility settings'
    }, { status: 500 });
  }
}

// PUT /api/admin/businesses/[id]/visibility
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getRequestAuthUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const { 
      adminApproved,
      adminNotes,
      isPublic,
      showInMarketplace,
      showInSearch,
      allowOnlineBooking
    } = await request.json();

    // Get current business settings
    const business = await prisma.business.findUnique({
      where: { id: params.id },
      select: { settings: true, name: true, status: true }
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const currentSettings = business.settings as any || {};

    // Update visibility settings with admin controls
    const updatedSettings = {
      ...currentSettings,
      visibility: {
        ...currentSettings.visibility,
        // Admin controls
        adminApproved: adminApproved ?? currentSettings.visibility?.adminApproved ?? false,
        adminNotes: adminNotes ?? currentSettings.visibility?.adminNotes ?? '',
        lastUpdatedBy: user.id,
        lastUpdatedAt: new Date().toISOString(),
        
        // Business visibility - only if admin approved
        isPublic: adminApproved === false ? false : (isPublic ?? currentSettings.visibility?.isPublic ?? false),
        showInMarketplace: adminApproved === false ? false : (showInMarketplace ?? currentSettings.visibility?.showInMarketplace ?? false),
        showInSearch: adminApproved === false ? false : (showInSearch ?? currentSettings.visibility?.showInSearch ?? false),
        allowOnlineBooking: adminApproved === false ? false : (allowOnlineBooking ?? currentSettings.visibility?.allowOnlineBooking ?? true)
      }
    };

    // Update business settings
    await prisma.business.update({
      where: { id: params.id },
      data: { 
        settings: updatedSettings,
        updatedAt: new Date()
      }
    });

    // Log the admin action
    console.log('👁️ Admin visibility settings update:', {
      businessId: params.id,
      businessName: business.name,
      adminUser: user.email,
      adminApproved,
      isPublic,
      showInMarketplace,
      adminNotes
    });

    return NextResponse.json({
      success: true,
      message: 'Visibility settings updated successfully',
      data: {
        visibilitySettings: updatedSettings.visibility,
        updatedBy: user.email,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error updating business visibility settings:', error);
    return NextResponse.json({
      error: 'Failed to update visibility settings'
    }, { status: 500 });
  }
}

// POST /api/admin/businesses/[id]/visibility/preview
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getRequestAuthUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    // Get business basic info
    const business = await prisma.business.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        email: true,
        phone: true,
        address: true,
        settings: true
      }
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Get counts separately to avoid TypeScript issues
    const serviceCount = await prisma.service.count({
      where: { businessId: params.id }
    });

    const staffCount = await prisma.staff.count({
      where: { businessId: params.id }
    });

    const appointmentCount = await prisma.appointments.count({
      where: { businessId: params.id }
    });

    const settings = business.settings as any || {};
    const visibilitySettings = settings.visibility || {};

    // Simulate how this business would appear in client portal
    const clientPortalPreview = {
      // Basic info that would be shown
      id: business.id,
      name: business.name,
      slug: business.slug,
      description: business.description,
      address: business.address,
      
      // Services that would be available for booking
      availableServices: serviceCount,
      activeStaff: staffCount,
      
      // Visibility flags
      visibility: {
        wouldShowInMarketplace: visibilitySettings.adminApproved && visibilitySettings.showInMarketplace,
        wouldShowInSearch: visibilitySettings.adminApproved && visibilitySettings.showInSearch,
        wouldAllowBooking: visibilitySettings.adminApproved && visibilitySettings.allowOnlineBooking,
        isPublic: visibilitySettings.adminApproved && visibilitySettings.isPublic
      },
      
      // Business readiness score
      readinessScore: calculateReadinessScore({
        hasServices: serviceCount > 0,
        hasStaff: staffCount > 0,
        hasDescription: !!business.description,
        hasAddress: !!business.address,
        hasPhone: !!business.phone,
        appointmentCount: appointmentCount
      }),
      
      stats: {
        services: serviceCount,
        staff: staffCount,
        appointments: appointmentCount
      }
    };

    console.log('👁️ Admin visibility preview:', {
      businessId: params.id,
      businessName: business.name,
      adminUser: user.email,
      preview: clientPortalPreview.visibility
    });

    return NextResponse.json({
      success: true,
      message: 'Visibility preview generated',
      data: clientPortalPreview
    });

  } catch (error) {
    console.error('❌ Error generating visibility preview:', error);
    return NextResponse.json({
      error: 'Failed to generate preview'
    }, { status: 500 });
  }
}

// Helper function to calculate business readiness score
function calculateReadinessScore(checks: {
  hasServices: boolean;
  hasStaff: boolean;
  hasDescription: boolean;
  hasAddress: boolean;
  hasPhone: boolean;
  appointmentCount: number;
}): { score: number; percentage: number; issues: string[] } {
  const issues: string[] = [];
  let score = 0;
  
  if (checks.hasServices) score += 25; else issues.push('Sem serviços ativos');
  if (checks.hasStaff) score += 20; else issues.push('Sem staff ativo');
  if (checks.hasDescription) score += 15; else issues.push('Sem descrição');
  if (checks.hasAddress) score += 15; else issues.push('Sem endereço');
  if (checks.hasPhone) score += 10; else issues.push('Sem telefone');
  if (checks.appointmentCount > 0) score += 15; else issues.push('Sem agendamentos históricos');
  
  return {
    score,
    percentage: score,
    issues
  };
} 