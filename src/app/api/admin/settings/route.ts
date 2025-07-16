import { NextResponse, NextRequest } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import prisma from '@/lib/prisma';

// Helper function to transform database settings to UI format
function transformDbSettingsToUI(dbSettings: any[]) {
  const settingsMap = dbSettings.reduce((acc: any, setting: any) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});

  return {
    email: {
      from: settingsMap.EMAIL_FROM || 'noreply@koobings.com',
      server: settingsMap.EMAIL_SERVER || 'smtp.gmail.com',
      port: settingsMap.EMAIL_PORT || '587',
    },
    security: {
      sessionTimeout: settingsMap.SESSION_TIMEOUT || 60,
      requireMFA: settingsMap.REQUIRE_MFA || false,
      enforcePasswordPolicy: settingsMap.ENFORCE_PASSWORD_POLICY || true,
    },
    business: {
      maxActive: settingsMap.MAX_ACTIVE_BUSINESSES || 1000,
      autoApprove: settingsMap.AUTO_APPROVE_BUSINESSES || false,
    },
    system: {
      name: settingsMap.SYSTEM_NAME || 'Koobings Service Manager',
      supportEmail: settingsMap.SUPPORT_EMAIL || 'support@koobings.com',
      defaultTimezone: settingsMap.DEFAULT_TIMEZONE || 'Europe/Lisbon',
      defaultCurrency: settingsMap.DEFAULT_CURRENCY || 'EUR',
      defaultLanguage: settingsMap.DEFAULT_LANGUAGE || 'pt',
      maintenanceMode: settingsMap.MAINTENANCE_MODE || false,
      allowRegistration: settingsMap.ALLOW_REGISTRATION || true,
      defaultPlan: settingsMap.DEFAULT_PLAN || 'standard',
    }
  };
}

// Helper function to transform UI settings to database format
function transformUISettingsToDb(settings: any) {
  return [
    { key: 'EMAIL_FROM', value: settings.email.from },
    { key: 'EMAIL_SERVER', value: settings.email.server },
    { key: 'EMAIL_PORT', value: settings.email.port },
    { key: 'SESSION_TIMEOUT', value: settings.security.sessionTimeout },
    { key: 'REQUIRE_MFA', value: settings.security.requireMFA },
    { key: 'ENFORCE_PASSWORD_POLICY', value: settings.security.enforcePasswordPolicy },
    { key: 'MAX_ACTIVE_BUSINESSES', value: settings.business.maxActive },
    { key: 'AUTO_APPROVE_BUSINESSES', value: settings.business.autoApprove },
    { key: 'SYSTEM_NAME', value: settings.system.name },
    { key: 'SUPPORT_EMAIL', value: settings.system.supportEmail },
    { key: 'DEFAULT_TIMEZONE', value: settings.system.defaultTimezone },
    { key: 'DEFAULT_CURRENCY', value: settings.system.defaultCurrency },
    { key: 'DEFAULT_LANGUAGE', value: settings.system.defaultLanguage },
    { key: 'MAINTENANCE_MODE', value: settings.system.maintenanceMode },
    { key: 'ALLOW_REGISTRATION', value: settings.system.allowRegistration },
    { key: 'DEFAULT_PLAN', value: settings.system.defaultPlan },
  ];
}

export async function GET(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    
    if (!user?.isAdmin || user.role !== 'ADMIN') {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'FORBIDDEN', message: 'Admin access required' } 
      }, { status: 403 });
    }

    console.log('🔧 Admin settings requested by:', user.email);

    // Fetch settings from database using raw SQL
    const dbSettings = await prisma.$queryRaw<Array<{ key: string, value: any, updatedAt: Date }>>`
      SELECT key, value, "updatedAt" FROM system_settings WHERE "isDeleted" = false ORDER BY key ASC
    `;

    const settings = transformDbSettingsToUI(dbSettings);
    const totalSettings = dbSettings.length;
    const lastModified = dbSettings.length > 0 ? Math.max(...dbSettings.map(s => s.updatedAt.getTime())) : null;

    return NextResponse.json({ 
      success: true, 
      data: settings,
      metadata: {
        totalSettings,
        lastModified: lastModified ? new Date(lastModified).toISOString() : null
      }
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ 
      success: false, 
      error: { code: 'SETTINGS_FETCH_ERROR', message: 'Internal Server Error' } 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    
    if (!user?.isAdmin || user.role !== 'ADMIN') {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'FORBIDDEN', message: 'Admin access required' } 
      }, { status: 403 });
    }

    const settings = await request.json();
    const dbSettings = transformUISettingsToDb(settings);

    console.log('🔧 Admin settings update requested by:', user.email);

    // Get admin record using raw SQL
    const admin = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM system_admins WHERE email = ${user.email} LIMIT 1
    `;

    if (!admin.length) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'ADMIN_NOT_FOUND', message: 'Admin not found' } 
      }, { status: 400 });
    }

    const adminId = admin[0].id;
    const now = new Date();

    // Update settings in database using raw SQL
    for (const setting of dbSettings) {
      await prisma.$executeRaw`
        INSERT INTO system_settings (id, key, value, "lastModifiedBy", "updatedAt", "createdAt", "isDeleted")
        VALUES (${crypto.randomUUID()}, ${setting.key}, ${JSON.stringify(setting.value)}, ${adminId}, ${now}, ${now}, false)
        ON CONFLICT (key) DO UPDATE SET
          value = ${JSON.stringify(setting.value)},
          "lastModifiedBy" = ${adminId},
          "updatedAt" = ${now}
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ 
      success: false, 
      error: { code: 'SETTINGS_UPDATE_ERROR', message: 'Internal Server Error' } 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    
    if (!user?.isAdmin || user.role !== 'ADMIN') {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'FORBIDDEN', message: 'Admin access required' } 
      }, { status: 403 });
    }

    const { action } = await request.json() as { action: 'CLEAR_CACHE' | 'PURGE_LOGS' | 'BACKUP_DB' };

    console.log('🔧 Admin maintenance action requested by:', user.email, action);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error performing maintenance action:', error);
    return NextResponse.json({ 
      success: false, 
      error: { code: 'SETTINGS_MAINTENANCE_ERROR', message: 'Internal Server Error' } 
    }, { status: 500 });
  }
} 