import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { ApiError, handleApiError } from '@/lib/utils/api/error'
import { z } from 'zod'

// GET: List visit history for a client relationship
export async function GET(request: Request) {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !session.user || !session.user.email) {
    console.error('Unauthorized: No session or user.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const relationshipId = searchParams.get('relationshipId')

    if (!relationshipId) {
      return NextResponse.json({ error: 'relationshipId is required' }, { status: 400 })
    }

    // Verify ownership of the client
    const client = await prisma.client.findFirst({
      where: {
        id: relationshipId,
        business: {
          email: session.user.email
        }
      }
    })

    if (!client) {
      return NextResponse.json({ error: 'Client relationship not found' }, { status: 404 })
    }

    const visitHistory = await prisma.visitHistory.findMany({
      where: {
        clientId: relationshipId
      },
      orderBy: {
        visitDate: 'desc'
      },
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(visitHistory)
  } catch (error) {
    console.error('GET /business/visit-history error:', error)
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
}

// POST: Create a new visit history entry
export async function POST(request: Request) {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !session.user || !session.user.email) {
    console.error('Unauthorized: No session or user.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Input validation
    const schema = z.object({
      relationshipId: z.string().min(1),
      visitDate: z.string().min(1),
      serviceType: z.string().min(1),
      staffNotes: z.string().optional(),
      clientFeedback: z.string().optional(),
      followUpRequired: z.boolean().optional()
    })
    let json
    try {
      json = await request.json()
    } catch (err) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    let parsed
    try {
      parsed = schema.parse(json)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
      }
      throw error
    }
    const { relationshipId, visitDate, serviceType, staffNotes, clientFeedback, followUpRequired } = parsed

    // Verify ownership of the client
    const client = await prisma.client.findFirst({
      where: {
        id: relationshipId,
        business: {
          email: session.user.email
        }
      }
    })

    if (!client) {
      return NextResponse.json({ error: 'Client relationship not found' }, { status: 404 })
    }

    const visitHistoryEntry = await prisma.visitHistory.create({
      data: {
        client: { connect: { id: relationshipId } },
        business: { connect: { id: client.businessId } },
        visitDate: new Date(visitDate),
        serviceType,
        staffNotes,
        clientFeedback,
        followUpRequired: followUpRequired || false
      },
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Update lastVisit in the client
    await prisma.client.update({
      where: { id: relationshipId },
      data: { lastVisit: new Date(visitDate) }
    })

    return NextResponse.json(visitHistoryEntry)
  } catch (error) {
    console.error('POST /business/visit-history error:', error)
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future.
