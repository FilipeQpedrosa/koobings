import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';

// GET: List services - SIMPLIFIED VERSION
export async function GET(request: NextRequest) {
  try {
    console.log('🔧 GET /api/business/services - Starting...');
    
    // Simple auth check
    const user = getRequestAuthUser(request);
    if (!user || !user.businessId) {
      console.log('❌ No user or businessId found');
      return NextResponse.json({ 
        success: false, 
        error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } 
      }, { status: 401 });
    }

    console.log('✅ User authenticated:', user.email);

    // Get services with minimal data
    const services = await prisma.service.findMany({
      where: {
        businessId: user.businessId
      },
      select: {
        id: true,
        name: true,
        description: true,
        duration: true,
        price: true,
        eventType: true,
        capacity: true,
        isActive: true,
        slotsNeeded: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('✅ Found services:', services.length);

    return NextResponse.json({
      success: true,
      data: services
    });

  } catch (error) {
    console.error('❌ GET /api/business/services error:', error);
    return NextResponse.json({ 
      success: false, 
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } 
    }, { status: 500 });
  }
}

// POST: Create service - SIMPLIFIED VERSION
export async function POST(request: NextRequest) {
  try {
    console.log('🔧 POST /api/business/services - Starting...');
    
    const user = getRequestAuthUser(request);
    if (!user || !user.businessId) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } 
      }, { status: 401 });
    }

    const body = await request.json();
    console.log('📋 Request body:', body);

    // Validate required fields
    if (!body.name || !body.price) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'VALIDATION_ERROR', message: 'Nome e preço são obrigatórios' } 
      }, { status: 400 });
    }

    // Create service with minimal data
    const service = await prisma.service.create({
      data: {
        id: require('crypto').randomUUID(),
        businessId: user.businessId,
        name: body.name,
        description: body.description || '',
        duration: body.duration || 30,
        price: parseFloat(body.price),
        eventType: body.eventType || 'INDIVIDUAL',
        capacity: body.capacity || 1,
        isActive: body.isActive !== false,
        availabilitySchedule: body.availabilitySchedule || {},
        slots: {},
        slotsNeeded: Math.ceil((body.duration || 30) / 30),
        updatedAt: new Date()
      }
    });

    console.log('✅ Service created:', service.id);

    return NextResponse.json({
      success: true,
      data: service
    });

  } catch (error) {
    console.error('❌ POST /api/business/services error:', error);
    return NextResponse.json({ 
      success: false, 
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } 
    }, { status: 500 });
  }
}