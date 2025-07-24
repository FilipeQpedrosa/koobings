import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getRequestAuthUser } from '@/lib/jwt-safe'
import { z } from 'zod'

// GET: Get a specific service
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getRequestAuthUser(request);
    
    if (!user) {
      console.error('Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    const businessId = user.businessId;
    
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID' } }, { status: 400 });
    }

    const service = await prisma.service.findFirst({
      where: { 
        id: params.id,
        businessId 
      },
      include: {
        service_categories: true,
        Business: true
      }
    })

    if (!service) {
      return NextResponse.json({ success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error('GET /business/services/[id] error:', error)
    return NextResponse.json({ success: false, error: { code: 'SERVICE_FETCH_ERROR', message: 'Failed to fetch service' } }, { status: 500 })
  }
}

// Shared validation schema for both PATCH and PUT
const updateServiceSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  duration: z.number().int().positive().optional(),
  categoryId: z.string().optional(),
  image: z.string().optional(),
  staffIds: z.array(z.string()).optional()
})

// Shared update logic for both PATCH and PUT
async function updateService(request: NextRequest, params: { id: string }) {
  try {
    const user = getRequestAuthUser(request);
    
    if (!user) {
      console.error('Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    const businessId = user.businessId;
    
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID' } }, { status: 400 });
    }

    // Ownership check
    const service = await prisma.service.findFirst({
      where: { 
        id: params.id,
        businessId 
      },
      include: { Business: true }
    })
    
    if (!service) {
      return NextResponse.json({ success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } }, { status: 404 })
    }

    // Input validation
    const body = await request.json()
    const { staffIds, ...rest } = updateServiceSchema.parse(body)

    const updatedService = await prisma.service.update({
      where: { id: params.id },
      data: {
        ...rest,
        ...(staffIds && {
          Staff: {
            set: staffIds.map((id: string) => ({ id }))
          }
        })
      },
      include: {
        service_categories: true,
        Business: true,
        Staff: true
      }
    })

    return NextResponse.json({ success: true, data: updatedService })
  } catch (error) {
    console.error('UPDATE service error:', error)
    return NextResponse.json({ success: false, error: { code: 'SERVICE_UPDATE_ERROR', message: 'Failed to update service' } }, { status: 500 })
  }
}

// PATCH: Update a service (partial update)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  return updateService(request, params);
}

// PUT: Update a service (full update - for compatibility)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return updateService(request, params);
}

// DELETE: Delete a service
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getRequestAuthUser(request);
    
    if (!user) {
      console.error('Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    const businessId = user.businessId;
    
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID' } }, { status: 400 });
    }

    // Ownership check
    const service = await prisma.service.findFirst({
      where: { 
        id: params.id,
        businessId 
      },
      include: { Business: true }
    })
    
    if (!service) {
      return NextResponse.json({ success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } }, { status: 404 })
    }

    await prisma.service.delete({
      where: { id: params.id }
    })
    
    console.info(`✅ Service ${params.id} deleted by user ${user.email}`)
    return NextResponse.json({ success: true, data: null }, { status: 200 })
  } catch (error) {
    console.error('DELETE /business/services/[id] error:', error)
    return NextResponse.json({ success: false, error: { code: 'SERVICE_DELETE_ERROR', message: 'Failed to delete service' } }, { status: 500 })
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future.