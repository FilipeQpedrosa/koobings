import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt';
import { z } from 'zod';
import { randomUUID } from 'crypto';

// GET: List all services for a business
export async function GET(req: NextRequest) {
  try {
    const user = getRequestAuthUser(req);
    
    if (!user) {
      console.error('Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;
    
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID' } }, { status: 400 });
    }

    const services = await prisma.service.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('GET /business/services error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal Error' } }, { status: 500 });
  }
}

// POST: Create a new service
export async function POST(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    if (!user) {
      console.error('Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID' } }, { status: 400 });
    }

    // Input validation
    const schema = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      duration: z.number().int().positive(),
      price: z.number().nonnegative(),
      categoryId: z.string().optional(),
    });

    let body;
    try {
      body = await request.json();
    } catch (err) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_JSON', message: 'Invalid JSON body' } }, { status: 400 });
    }

    let validatedData;
    try {
      validatedData = schema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ success: false, error: { code: 'INVALID_SERVICE_DATA', message: 'Invalid service data', details: error.errors } }, { status: 400 });
      }
      throw error;
    }

    const service = await prisma.service.create({
      data: {
        id: randomUUID(),
        updatedAt: new Date(),
        ...validatedData,
        businessId,
      },
    });

    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error) {
    console.error('POST /business/services error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : 'Internal Error'
      }
    }, { status: 500 });
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future.