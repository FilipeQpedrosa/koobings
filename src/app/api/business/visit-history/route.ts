import { createClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { ApiError, handleApiError } from '@/lib/utils/api/error'

// GET: List visit history for a client relationship
export async function GET(request: Request) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const relationshipId = searchParams.get('relationshipId')

    if (!relationshipId) {
      throw new ApiError(400, 'relationshipId is required')
    }

    // Verify ownership of the relationship
    const relationship = await prisma.clientRelationship.findFirst({
      where: {
        id: relationshipId,
        business: {
          email: session.user.email
        }
      }
    })

    if (!relationship) {
      throw new ApiError(404, 'Client relationship not found')
    }

    const visitHistory = await prisma.visitHistory.findMany({
      where: {
        relationshipId
      },
      orderBy: {
        visitDate: 'desc'
      },
      include: {
        clientRelationship: {
          include: {
            client: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(visitHistory)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST: Create a new visit history entry
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const { 
      relationshipId,
      visitDate,
      serviceType,
      staffNotes,
      clientFeedback,
      followUpRequired
    } = json

    // Verify ownership of the relationship
    const relationship = await prisma.clientRelationship.findFirst({
      where: {
        id: relationshipId,
        business: {
          email: session.user.email
        }
      }
    })

    if (!relationship) {
      throw new ApiError(404, 'Client relationship not found')
    }

    const visitHistoryEntry = await prisma.visitHistory.create({
      data: {
        clientRelationship: { connect: { id: relationshipId } },
        visitDate: new Date(visitDate),
        serviceType,
        staffNotes,
        clientFeedback,
        followUpRequired: followUpRequired || false
      },
      include: {
        clientRelationship: {
          include: {
            client: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    // Update lastVisit in the relationship
    await prisma.clientRelationship.update({
      where: { id: relationshipId },
      data: { lastVisit: new Date(visitDate) }
    })

    return NextResponse.json(visitHistoryEntry)
  } catch (error) {
    return handleApiError(error)
  }
}
