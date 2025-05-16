import { createClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { ApiError, handleApiError } from '@/lib/utils/api/error'

// GET: Get a specific client relationship
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
    const relationship = await prisma.clientRelationship.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        preferredStaff: {
          select: {
            id: true,
            name: true
          }
        },
        visitHistory: {
          orderBy: {
            visitDate: 'desc'
          },
          include: {
            createdBy: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        noteHistory: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            createdBy: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    if (!relationship) {
      throw new ApiError(404, 'Relationship not found')
    }

    // Verify ownership
    const business = await prisma.business.findFirst({
      where: { email: session.user.email }
    })

    if (!business || relationship.businessId !== business.id) {
      throw new ApiError(401, 'Unauthorized')
    }

    return NextResponse.json(relationship)
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH: Update a client relationship
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
      status,
      preferences,
      internalNotes,
      flags,
      preferredStaffIds
    } = json

    // Verify ownership
    const business = await prisma.business.findFirst({
      where: { email: session.user.email }
    })

    const existingRelationship = await prisma.clientRelationship.findFirst({
      where: {
        id: params.id,
        business: {
          email: session.user.email
        }
      }
    })

    if (!existingRelationship) {
      throw new ApiError(404, 'Relationship not found')
    }

    const relationship = await prisma.clientRelationship.update({
      where: { id: params.id },
      data: {
        status,
        preferences,
        internalNotes,
        flags,
        preferredStaff: preferredStaffIds ? {
          set: preferredStaffIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        client: true,
        preferredStaff: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(relationship)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE: Delete a client relationship
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
    // Verify ownership
    const business = await prisma.business.findFirst({
      where: { email: session.user.email }
    })

    const relationship = await prisma.clientRelationship.findFirst({
      where: {
        id: params.id,
        business: {
          email: session.user.email
        }
      }
    })

    if (!relationship) {
      throw new ApiError(404, 'Relationship not found')
    }

    await prisma.clientRelationship.delete({
      where: { id: params.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return handleApiError(error)
  }
}
