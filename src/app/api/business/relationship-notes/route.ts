import { createClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { ApiError, handleApiError } from '@/lib/utils/api/error'

// GET: List notes for a client relationship
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

    const notes = await prisma.relationshipNote.findMany({
      where: {
        relationshipId
      },
      orderBy: {
        createdAt: 'desc'
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

    return NextResponse.json(notes)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST: Create a new note
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
      noteType,
      content
    } = json

    // Verify ownership of the relationship and get staff ID
    const [relationship, staff] = await Promise.all([
      prisma.clientRelationship.findFirst({
        where: {
          id: relationshipId,
          business: {
            email: session.user.email
          }
        }
      }),
      prisma.staff.findFirst({
        where: {
          email: session.user.email
        }
      })
    ])

    if (!relationship) {
      throw new ApiError(404, 'Client relationship not found')
    }

    if (!staff) {
      throw new ApiError(404, 'Staff member not found')
    }

    const note = await prisma.relationshipNote.create({
      data: {
        clientRelationship: { connect: { id: relationshipId } },
        createdBy: { connect: { id: staff.id } },
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
