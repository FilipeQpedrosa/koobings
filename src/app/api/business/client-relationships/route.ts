import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: List all client relationships for a business
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const relationships = await prisma.patientRelationship.findMany({
      include: {
        patient: true,
        business: true,
        preferredStaff: true,
        visitHistory: true,
        noteHistory: true
      }
    })

    return NextResponse.json(relationships)
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

// POST: Create a new client relationship
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const relationship = await prisma.patientRelationship.create({
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
