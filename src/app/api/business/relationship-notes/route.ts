import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: List notes for a client relationship
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const notes = await prisma.relationshipNote.findMany({
      include: {
        createdBy: true,
        patientRelationship: {
          include: {
            patient: true
          }
        }
      }
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

// POST: Create a new note
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const note = await prisma.relationshipNote.create({
      data: body,
      include: {
        createdBy: true,
        patientRelationship: {
          include: {
            patient: true
          }
        }
      }
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
