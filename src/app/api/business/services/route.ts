import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET: List all services for a business
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.businessId) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    const services = await prisma.service.findMany({
      where: { businessId: session.user.businessId },
      include: {
        category: true,
      },
    })

    return NextResponse.json({ success: true, data: services })
  } catch (error) {
    console.error('GET /business/services error:', error)
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal Error' } }, { status: 500 })
  }
}

// POST: Create a new service
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.businessId) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    // Input validation
    const schema = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      duration: z.number().int().positive(),
      price: z.number().nonnegative(),
      categoryId: z.string().optional(),
    })
    let body
    try {
      body = await request.json()
    } catch (err) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_JSON', message: 'Invalid JSON body' } }, { status: 400 })
    }
    let validatedData
    try {
      validatedData = schema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ success: false, error: { code: 'INVALID_SERVICE_DATA', message: 'Invalid service data', details: error.errors } }, { status: 400 })
      }
      throw error
    }
    const service = await prisma.service.create({
      data: {
        ...validatedData,
        businessId: session.user.businessId,
      },
    })

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error('POST /business/services error:', error)
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal Error' } }, { status: 500 })
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future.