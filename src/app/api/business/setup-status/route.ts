import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Business, Prisma } from '@prisma/client';

interface SetupTask {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

type BusinessSettings = {
  businessHours?: Record<string, any>;
  services?: any[];
  staff?: any[];
};

interface BusinessWithSettings extends Omit<Business, 'settings'> {
  settings?: BusinessSettings;
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    // Find the business by email
    const business = await prisma.business.findUnique({
      where: { email: session.user.email },
    }) as BusinessWithSettings | null;

    if (!business) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } },
        { status: 404 }
      );
    }

    // Define setup tasks
    const tasks: SetupTask[] = [
      {
        id: 'company-info',
        title: 'Company Information',
        description: 'Add your business description, logo, and contact details',
        isCompleted: Boolean(business.description && business.logo),
      },
      {
        id: 'business-hours',
        title: 'Business Hours',
        description: 'Set your regular operating hours',
        isCompleted: Boolean(business.settings?.businessHours),
      },
      {
        id: 'services',
        title: 'Services',
        description: 'Add the services you offer',
        isCompleted: Boolean(business.settings?.services?.length),
      },
      {
        id: 'staff',
        title: 'Staff Members',
        description: 'Add your staff members',
        isCompleted: Boolean(business.settings?.staff?.length),
      },
    ];

    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error('GET /business/setup-status error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SETUP_STATUS_ERROR', message: 'Failed to fetch setup status' } },
      { status: 500 }
    );
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future. 