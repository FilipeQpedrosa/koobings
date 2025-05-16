import { createClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { ApiError, handleApiError } from '@/lib/utils/api/error'

// GET: Get a specific visit history entry
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const visitHistory = await prisma.visitHistory.findUnique({
      where: { id: params.id },
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

    if (!visitHistory) {
      throw new ApiError(404, 'Visit history entry not found')
    }

    // Verify ownership through the relationship
    const business = await prisma.business.findFirst({
      where: { 
        email: session.user.email,
        clientRelationships: {
          some: {
            id: visitHistory.relationshipId
          }
        }
      }
    })

    if (!business) {
      throw new ApiError(401, 'Unauthorized')
    }

    return NextResponse.json(visitHistory)
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH: Update a visit history entry
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const { 
      visitDate,
      serviceType,
      staffNotes,
      clientFeedback,
      followUpRequired
    } = json

    // Verify ownership through the relationship
    const existingVisit = await prisma.visitHistory.findFirst({
      where: {
        id: params.id,
        clientRelationship: {
          business: {
            email: session.user.email
          }
        }
      }
    })

    if (!existingVisit) {
      throw new ApiError(404, 'Visit history entry not found')
    }

    const visitHistory = await prisma.visitHistory.update({
      where: { id: params.id },
      data: {
        visitDate: visitDate ? new Date(visitDate) : undefined,
        serviceType,
        staffNotes,
        clientFeedback,
        followUpRequired
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

// DELETE: Delete a visit history entry
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Verify ownership through the relationship
    const existingVisit = await prisma.visitHistory.findFirst({
      where: {
        id: params.id,
        clientRelationship: {
          business: {
            email: session.user.email
          }
        }
      }
    })

    if (!existingVisit) {
      throw new ApiError(404, 'Visit history entry not found')
    }

    await prisma.visitHistory.delete({
      where: { id: params.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return handleApiError(error)
  }
}
