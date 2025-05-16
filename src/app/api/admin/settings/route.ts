import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { SystemSettings, SystemSettingRecord } from '@/types/settings';

const prisma = new PrismaClient();

const DEFAULT_SETTINGS: SystemSettings = {
  email: {
    from: process.env.EMAIL_FROM || 'noreply@example.com',
    server: process.env.EMAIL_SERVER_HOST || 'smtp.example.com',
    port: process.env.EMAIL_SERVER_PORT || '587',
  },
  security: {
    sessionTimeout: 60,
    requireMFA: false,
    enforcePasswordPolicy: true,
  },
  business: {
    maxActive: 1000,
    autoApprove: false,
  }
};

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await prisma.systemAdmin.findUnique({
      where: { email: session.user?.email }
    });

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get settings from database
    const settings = await prisma.systemSettings.findMany({
      include: {
        lastModifiedByAdmin: {
          select: {
            name: true
          }
        }
      }
    });
    
    // Convert settings array to object
    const settingsObject = settings.reduce<Partial<SystemSettings>>((acc, setting) => {
      const [category, key] = setting.key.split('.');
      if (!acc[category as keyof SystemSettings]) {
        acc[category as keyof SystemSettings] = {} as any;
      }
      (acc[category as keyof SystemSettings] as any)[key] = setting.value;
      return acc;
    }, {});

    // Merge with default settings
    const mergedSettings: SystemSettings = {
      ...DEFAULT_SETTINGS,
      ...settingsObject
    };

    return NextResponse.json(mergedSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await prisma.systemAdmin.findUnique({
      where: { email: session.user?.email }
    });

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json() as SystemSettings;

    // Update settings in database
    await prisma.$transaction(async (tx) => {
      // Flatten settings object into key-value pairs
      const flattenedSettings = Object.entries(data).flatMap(([category, values]) =>
        Object.entries(values).map(([key, value]) => ({
          key: `${category}.${key}`,
          value
        }))
      );

      // Update or create each setting
      for (const setting of flattenedSettings) {
        await tx.systemSettings.upsert({
          where: { key: setting.key },
          update: {
            value: setting.value,
            lastModifiedBy: admin.id,
            updatedAt: new Date()
          },
          create: {
            key: setting.key,
            value: setting.value,
            lastModifiedBy: admin.id
          }
        });
      }

      // Log the settings change
      await tx.adminActivity.create({
        data: {
          adminId: admin.id,
          action: 'UPDATED_SYSTEM_SETTINGS',
          details: data
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await prisma.systemAdmin.findUnique({
      where: { email: session.user?.email }
    });

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action } = await request.json() as { action: 'CLEAR_CACHE' | 'PURGE_LOGS' | 'BACKUP_DB' };

    switch (action) {
      case 'CLEAR_CACHE':
        // Implement cache clearing logic
        await prisma.adminActivity.create({
          data: {
            adminId: admin.id,
            action: 'CLEARED_SYSTEM_CACHE',
            details: { timestamp: new Date() }
          }
        });
        break;

      case 'PURGE_LOGS':
        // Delete old activity logs
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        await prisma.$transaction(async (tx) => {
          await tx.adminActivity.deleteMany({
            where: {
              createdAt: {
                lt: oneMonthAgo
              }
            }
          });

          await tx.adminActivity.create({
            data: {
              adminId: admin.id,
              action: 'PURGED_OLD_LOGS',
              details: { timestamp: new Date() }
            }
          });
        });
        break;

      case 'BACKUP_DB':
        // In a real application, implement database backup logic
        await prisma.adminActivity.create({
          data: {
            adminId: admin.id,
            action: 'INITIATED_DB_BACKUP',
            details: { timestamp: new Date() }
          }
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error performing maintenance action:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 