import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET: List all client relationships for a business
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    const relationships = await prisma.clientRelationship.findMany({
      include: {
        client: true,
        business: true,
        staff: true
      }
    })

    return NextResponse.json({ success: true, data: relationships })
  } catch (error) {
    console.error('GET /business/client-relationships error:', error)
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal Error' } }, { status: 500 })
  }
}

// POST: Create a new client relationship
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    // Input validation
    const schema = z.object({
      clientId: z.string().min(1),
      businessId: z.string().min(1),
      staffId: z.string().optional(),
      type: z.string().optional(),
      status: z.string().optional(),
      notes: z.string().optional()
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
        return NextResponse.json({ success: false, error: { code: 'INVALID_RELATIONSHIP_DATA', message: 'Invalid relationship data', details: error.errors } }, { status: 400 })
      }
      throw error
    }
    const relationship = await prisma.clientRelationship.create({
      data: validatedData,
      include: {
        client: true,
        business: true,
        staff: true
      }
    })

    return NextResponse.json({ success: true, data: relationship })
  } catch (error) {
    console.error('POST /business/client-relationships error:', error)
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal Error' } }, { status: 500 })
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future.
