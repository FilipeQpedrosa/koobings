import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Get a specific client relationship
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const relationship = await prisma.patientRelationship.findUnique({
      where: { id: params.id },
      include: {
        patient: true,
        business: true,
        preferredStaff: true,
        visitHistory: true,
        noteHistory: true
      }
    })

    if (!relationship) {
      return new NextResponse('Relationship not found', { status: 404 })
    }

    return NextResponse.json(relationship)
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

// PATCH: Update a client relationship
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const relationship = await prisma.patientRelationship.update({
      where: { id: params.id },
      data: body,
      include: {
        patient: true,
        business: true,
        preferredStaff: true,
        visitHistory: true,
        noteHistory: true
      }
    })

    return NextResponse.json(relationship)
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

// DELETE: Delete a client relationship
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await prisma.patientRelationship.delete({
      where: { id: params.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
