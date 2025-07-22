import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { prisma } from '@/lib/prisma';

// GET /api/admin/businesses/[id]/payments
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
        settings: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const settings = business.settings as any || {};
    const paymentSettings = {
      enabled: settings.payments?.enabled ?? false,
      provider: settings.payments?.provider ?? null,
      currency: settings.payments?.currency ?? 'EUR',
      autoCharge: settings.payments?.autoCharge ?? false,
      depositPercentage: settings.payments?.depositPercentage ?? 0,
      processingFee: settings.payments?.processingFee ?? 2.9,
      // Admin-only settings
      adminEnabled: settings.payments?.adminEnabled ?? false,
      adminNotes: settings.payments?.adminNotes ?? '',
      lastUpdatedBy: settings.payments?.lastUpdatedBy ?? null,
      lastUpdatedAt: settings.payments?.lastUpdatedAt ?? null
    };

    return NextResponse.json({
      success: true,
      data: {
        business: {
          id: business.id,
          name: business.name,
          slug: business.slug,
          createdAt: business.createdAt,
          updatedAt: business.updatedAt
        },
        paymentSettings
      }
    });

  } catch (error) {
    console.error('❌ Error fetching business payment settings:', error);
    return NextResponse.json({
      error: 'Failed to fetch payment settings'
    }, { status: 500 });
  }
}

// PUT /api/admin/businesses/[id]/payments
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getRequestAuthUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const { 
      adminEnabled, 
      adminNotes, 
      provider, 
      currency, 
      processingFee,
      autoCharge,
      depositPercentage 
    } = await request.json();

    // Get current business settings
    const business = await prisma.business.findUnique({
      where: { id: params.id },
      select: { settings: true, name: true }
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const currentSettings = business.settings as any || {};

    // Update payment settings with admin controls
    const updatedSettings = {
      ...currentSettings,
      payments: {
        ...currentSettings.payments,
        // Admin-controlled settings
        adminEnabled: adminEnabled ?? currentSettings.payments?.adminEnabled ?? false,
        adminNotes: adminNotes ?? currentSettings.payments?.adminNotes ?? '',
        lastUpdatedBy: user.id,
        lastUpdatedAt: new Date().toISOString(),
        // Optional provider settings
        ...(provider !== undefined && { provider }),
        ...(currency !== undefined && { currency }),
        ...(processingFee !== undefined && { processingFee }),
        ...(autoCharge !== undefined && { autoCharge }),
        ...(depositPercentage !== undefined && { depositPercentage }),
        // Business can only enable payments if admin has enabled it
        enabled: adminEnabled === false ? false : (currentSettings.payments?.enabled ?? false)
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
    console.log('🔧 Admin payment settings update:', {
      businessId: params.id,
      businessName: business.name,
      adminUser: user.email,
      adminEnabled,
      adminNotes
    });

    return NextResponse.json({
      success: true,
      message: 'Payment settings updated successfully',
      data: {
        paymentSettings: updatedSettings.payments,
        updatedBy: user.email,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error updating business payment settings:', error);
    return NextResponse.json({
      error: 'Failed to update payment settings'
    }, { status: 500 });
  }
}

// POST /api/admin/businesses/[id]/payments/test
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getRequestAuthUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const { action } = await request.json();

    const business = await prisma.business.findUnique({
      where: { id: params.id },
      select: { name: true, settings: true }
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const settings = business.settings as any || {};
    const paymentSettings = settings.payments || {};

    let testResult = {};

    switch (action) {
      case 'test_connection':
        // Simulate payment provider connection test
        testResult = {
          action: 'test_connection',
          provider: paymentSettings.provider || 'none',
          status: paymentSettings.adminEnabled ? 'success' : 'disabled',
          message: paymentSettings.adminEnabled ? 
            'Payment provider connection successful' : 
            'Payments disabled by admin',
          timestamp: new Date().toISOString()
        };
        break;

      case 'simulate_payment':
        // Simulate a test payment
        testResult = {
          action: 'simulate_payment',
          amount: 25.00,
          currency: paymentSettings.currency || 'EUR',
          status: paymentSettings.adminEnabled ? 'completed' : 'failed',
          transactionId: `test_${Date.now()}`,
          fees: paymentSettings.adminEnabled ? 0.73 : 0,
          message: paymentSettings.adminEnabled ? 
            'Test payment processed successfully' : 
            'Payment failed - disabled by admin',
          timestamp: new Date().toISOString()
        };
        break;

      default:
        return NextResponse.json({ 
          error: 'Invalid test action. Use "test_connection" or "simulate_payment"' 
        }, { status: 400 });
    }

    // Log the admin test
    console.log('🧪 Admin payment test:', {
      businessId: params.id,
      businessName: business.name,
      adminUser: user.email,
      ...testResult
    });

    return NextResponse.json({
      success: true,
      message: 'Payment test completed',
      data: testResult
    });

  } catch (error) {
    console.error('❌ Error running payment test:', error);
    return NextResponse.json({
      error: 'Failed to run payment test'
    }, { status: 500 });
  }
} 