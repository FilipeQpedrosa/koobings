import { createClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { ApiError, handleApiError } from '@/lib/utils/api/error'

// GET: List all client relationships for a business
export async function GET() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const relationships = await prisma.clientRelationship.findMany({
      where: {
        business: {
          email: session.user.email
        }
      },
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
          take: 5 // Get only last 5 visits
        },
        noteHistory: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5, // Get only last 5 notes
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

    return NextResponse.json(relationships)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST: Create a new client relationship
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const { 
      clientId,
      status,
      preferences,
      internalNotes,
      flags,
      preferredStaffIds
    } = json

    const business = await prisma.business.findFirst({
      where: { email: session.user.email }
    })

    if (!business) {
      throw new ApiError(404, 'Business not found')
    }

    // Check if client exists and belongs to the business
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        businessId: business.id
      }
    })

    if (!client) {
      throw new ApiError(404, 'Client not found')
    }

    // Check if relationship already exists
    const existingRelationship = await prisma.clientRelationship.findUnique({
      where: { clientId }
    })

    if (existingRelationship) {
      throw new ApiError(400, 'Relationship already exists for this client')
    }

    const relationship = await prisma.clientRelationship.create({
      data: {
        client: { connect: { id: clientId } },
        business: { connect: { id: business.id } },
        status: status || 'ACTIVE',
        preferences: preferences || {},
        internalNotes,
        flags: flags || [],
        preferredStaff: preferredStaffIds ? {
          connect: preferredStaffIds.map(id => ({ id }))
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
