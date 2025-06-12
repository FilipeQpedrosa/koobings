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
export async function GET(request: Request, { params }: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        business: true
      }
    })

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Ownership check: service.business.email === session.user.email
    if (service.business?.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('GET /business/services/[id] error:', error)
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
}

// PATCH: Update a service
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(request: Request, { params }: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ownership check
    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: { business: true }
    })
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    if (service.business?.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
      where: { id: params.id },
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

    return NextResponse.json(updatedService)
  } catch (error) {
    console.error('PATCH /business/services/[id] error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
}

// DELETE: Delete a service
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: Request, { params }: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ownership check
    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: { business: true }
    })
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    if (service.business?.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.service.delete({
      where: { id: params.id }
    })
    console.info(`Service ${params.id} deleted by user ${session.user.email}`)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('DELETE /business/services/[id] error:', error)
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future.