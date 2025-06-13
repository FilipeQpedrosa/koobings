import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

interface RouteParams {
  params: {
    id: string;
  };
}

// GET: Get a specific service
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').at(-1);
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    const service = await prisma.service.findUnique({
      where: { id: id },
      include: {
        category: true,
        business: true
      }
    })

    if (!service) {
      return NextResponse.json({ success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } }, { status: 404 })
    }

    // Ownership check: service.business.email === session.user.email
    if (service.business?.email !== session.user.email) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error('GET /business/services/[id] error:', error)
    return NextResponse.json({ success: false, error: { code: 'SERVICE_FETCH_ERROR', message: 'Failed to fetch service' } }, { status: 500 })
  }
}

// PATCH: Update a service
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(request: Request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').at(-1);
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    // Ownership check
    const service = await prisma.service.findUnique({
      where: { id: id },
      include: { business: true }
    })
    if (!service) {
      return NextResponse.json({ success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } }, { status: 404 })
    }
    if (service.business?.email !== session.user.email) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    // Input validation
    const schema = z.object({
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      price: z.number().nonnegative().optional(),
      duration: z.number().int().positive().optional(),
      staffIds: z.array(z.string()).optional()
    })
    const body = await request.json()
    const { staffIds, ...rest } = schema.parse(body)

    const updatedService = await prisma.service.update({
      where: { id: id },
      data: {
        ...rest,
        ...(staffIds && {
          staff: {
            set: staffIds.map((id: string) => ({ id }))
          }
        })
      },
      include: {
        category: true,
        business: true,
        staff: true
      }
    })

    return NextResponse.json({ success: true, data: updatedService })
  } catch (error) {
    console.error('PATCH /business/services/[id] error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_INPUT', message: 'Invalid input', details: error.errors } }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: { code: 'SERVICE_UPDATE_ERROR', message: 'Failed to update service' } }, { status: 500 })
  }
}

// DELETE: Delete a service
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: Request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').at(-1);
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    // Ownership check
    const service = await prisma.service.findUnique({
      where: { id: id },
      include: { business: true }
    })
    if (!service) {
      return NextResponse.json({ success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } }, { status: 404 })
    }
    if (service.business?.email !== session.user.email) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    await prisma.service.delete({
      where: { id: id }
    })
    console.info(`Service ${id} deleted by user ${session.user.email}`)
    return NextResponse.json({ success: true, data: null }, { status: 200 })
  } catch (error) {
    console.error('DELETE /business/services/[id] error:', error)
    return NextResponse.json({ success: false, error: { code: 'SERVICE_DELETE_ERROR', message: 'Failed to delete service' } }, { status: 500 })
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future.