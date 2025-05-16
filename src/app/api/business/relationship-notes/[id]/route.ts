import { createClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { ApiError, handleApiError } from '@/lib/utils/api/error'

// GET: Get a specific note
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
    const note = await prisma.relationshipNote.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true
          }
        },
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

    if (!note) {
      throw new ApiError(404, 'Note not found')
    }

    // Verify ownership through the relationship
    const business = await prisma.business.findFirst({
      where: { 
        email: session.user.email,
        clientRelationships: {
          some: {
            id: note.relationshipId
          }
        }
      }
    })

    if (!business) {
      throw new ApiError(401, 'Unauthorized')
    }

    return NextResponse.json(note)
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH: Update a note
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
    const { noteType, content } = json

    // Verify ownership through the relationship and staff
    const existingNote = await prisma.relationshipNote.findFirst({
      where: {
        id: params.id,
        clientRelationship: {
          business: {
            email: session.user.email
          }
        }
      }
    })

    if (!existingNote) {
      throw new ApiError(404, 'Note not found')
    }

    const note = await prisma.relationshipNote.update({
      where: { id: params.id },
      data: {
        noteType,
        content
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true
          }
        },
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

    return NextResponse.json(note)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE: Delete a note
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
    const existingNote = await prisma.relationshipNote.findFirst({
      where: {
        id: params.id,
        clientRelationship: {
          business: {
            email: session.user.email
          }
        }
      }
    })

    if (!existingNote) {
      throw new ApiError(404, 'Note not found')
    }

    await prisma.relationshipNote.delete({
      where: { id: params.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return handleApiError(error)
  }
}
