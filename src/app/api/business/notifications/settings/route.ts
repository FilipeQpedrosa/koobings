import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { prisma } from '@/lib/prisma';

interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  paymentEnabled: boolean;
  paymentProvider: 'stripe' | 'paypal' | 'mbway' | null;
  emailTemplates: {
    accepted: string;
    rejected: string;
    completed: string;
    cancelled: string;
  };
  paymentSettings: {
    currency: string;
    autoCharge: boolean;
    depositPercentage: number;
  };
}

// GET /api/business/notifications/settings
export async function GET(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    if (!user?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get business notification settings
    let business = await prisma.business.findUnique({
      where: { id: user.businessId },
      select: { settings: true, name: true }
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const settings = business.settings as any || {};
    const notificationSettings: NotificationSettings = {
      emailEnabled: settings.notifications?.emailEnabled ?? true,
      smsEnabled: settings.notifications?.smsEnabled ?? false,
      paymentEnabled: (settings.payments?.enabled ?? false) && (settings.payments?.adminEnabled ?? false), // Must be enabled by both business and admin
      paymentProvider: settings.payments?.provider ?? null,
      emailTemplates: {
        accepted: settings.notifications?.templates?.accepted ?? '',
        rejected: settings.notifications?.templates?.rejected ?? '',
        completed: settings.notifications?.templates?.completed ?? '',
        cancelled: settings.notifications?.templates?.cancelled ?? ''
      },
      paymentSettings: {
        currency: settings.payments?.currency ?? 'EUR',
        autoCharge: settings.payments?.autoCharge ?? false,
        depositPercentage: settings.payments?.depositPercentage ?? 0
      }
    };

    return NextResponse.json({
      success: true,
      data: notificationSettings
    });

  } catch (error) {
    console.error('❌ Error fetching notification settings:', error);
    return NextResponse.json({
      error: 'Failed to fetch settings'
    }, { status: 500 });
  }
}

// PUT /api/business/notifications/settings
export async function PUT(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    if (!user?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newSettings: Partial<NotificationSettings> = await request.json();

    // Get current business settings
    const business = await prisma.business.findUnique({
      where: { id: user.businessId },
      select: { settings: true }
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const currentSettings = business.settings as any || {};

    // Merge new settings with existing ones
    const updatedSettings = {
      ...currentSettings,
      notifications: {
        ...currentSettings.notifications,
        emailEnabled: newSettings.emailEnabled ?? currentSettings.notifications?.emailEnabled ?? true,
        smsEnabled: newSettings.smsEnabled ?? currentSettings.notifications?.smsEnabled ?? false,
        templates: {
          ...currentSettings.notifications?.templates,
          ...newSettings.emailTemplates
        }
      },
      payments: {
        ...currentSettings.payments,
        // Business can only enable payments if admin has enabled them
        enabled: newSettings.paymentEnabled && (currentSettings.payments?.adminEnabled ?? false) ? 
          newSettings.paymentEnabled : 
          (currentSettings.payments?.enabled ?? false),
        provider: newSettings.paymentProvider ?? currentSettings.payments?.provider,
        currency: newSettings.paymentSettings?.currency ?? currentSettings.payments?.currency ?? 'EUR',
        autoCharge: newSettings.paymentSettings?.autoCharge ?? currentSettings.payments?.autoCharge ?? false,
        depositPercentage: newSettings.paymentSettings?.depositPercentage ?? currentSettings.payments?.depositPercentage ?? 0
      }
    };

    // Update business settings
    await prisma.business.update({
      where: { id: user.businessId },
      data: { 
        settings: updatedSettings,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      data: updatedSettings
    });

  } catch (error) {
    console.error('❌ Error updating notification settings:', error);
    return NextResponse.json({
      error: 'Failed to update settings'
    }, { status: 500 });
  }
}

// POST /api/business/notifications/settings/test
export async function POST(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    if (!user?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, email } = await request.json();

    if (!type || !email) {
      return NextResponse.json({ 
        error: 'Type and email are required' 
      }, { status: 400 });
    }

    // Send test notification
    const testResult = await sendTestNotification(type, email, user.businessId);

    return NextResponse.json({
      success: true,
      message: 'Test notification sent',
      data: testResult
    });

  } catch (error) {
    console.error('❌ Error sending test notification:', error);
    return NextResponse.json({
      error: 'Failed to send test notification'
    }, { status: 500 });
  }
}

async function sendTestNotification(type: string, email: string, businessId: string) {
  // Get business info
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { name: true }
  });

  const testTemplates = {
    accepted: {
      subject: '✅ [TESTE] Agendamento Confirmado',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">🧪 Email de Teste - Agendamento Confirmado</h2>
          <p>Este é um email de teste do sistema de notificações.</p>
          <p>Em caso real, o cliente receberia a confirmação do agendamento.</p>
          <p>Enviado por: <strong>${business?.name}</strong></p>
        </div>
      `
    },
    rejected: {
      subject: '❌ [TESTE] Agendamento Rejeitado',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">🧪 Email de Teste - Agendamento Rejeitado</h2>
          <p>Este é um email de teste do sistema de notificações.</p>
          <p>Em caso real, o cliente seria informado sobre a rejeição.</p>
          <p>Enviado por: <strong>${business?.name}</strong></p>
        </div>
      `
    },
    completed: {
      subject: '🏆 [TESTE] Serviço Concluído',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">🧪 Email de Teste - Serviço Concluído</h2>
          <p>Este é um email de teste do sistema de notificações.</p>
          <p>Em caso real, o cliente receberia confirmação da conclusão.</p>
          <p>Enviado por: <strong>${business?.name}</strong></p>
        </div>
      `
    }
  };

  const template = testTemplates[type as keyof typeof testTemplates];
  
  if (!template) {
    throw new Error('Invalid test type');
  }

  // Simulate sending test email
  console.log(`📧 TEST EMAIL - To: ${email}, Subject: ${template.subject}`);
  
  return {
    type,
    email,
    subject: template.subject,
    sent: true,
    timestamp: new Date().toISOString()
  };
} 