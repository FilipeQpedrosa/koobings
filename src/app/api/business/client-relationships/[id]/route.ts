import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Get a specific client relationship
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: Request, { params }: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    const relationship = await prisma.clientRelationship.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        business: true,
        staff: true
      }
    })

    if (!relationship) {
      return NextResponse.json({ success: false, error: { code: 'RELATIONSHIP_NOT_FOUND', message: 'Relationship not found' } }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: relationship })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: { code: 'RELATIONSHIP_FETCH_ERROR', message: 'Failed to fetch relationship' } }, { status: 500 })
  }
}

// PATCH: Update a client relationship
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(request: Request, { params }: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    const body = await request.json()
    const relationship = await prisma.clientRelationship.update({
      where: { id: params.id },
      data: body,
      include: {
        client: true,
        business: true,
        staff: true
      }
    })

    return NextResponse.json({ success: true, data: relationship })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: { code: 'RELATIONSHIP_UPDATE_ERROR', message: 'Failed to update relationship' } }, { status: 500 })
  }
}

// DELETE: Delete a client relationship
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: Request, { params }: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    await prisma.clientRelationship.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true, data: null }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: { code: 'RELATIONSHIP_DELETE_ERROR', message: 'Failed to delete relationship' } }, { status: 500 })
  }
}
