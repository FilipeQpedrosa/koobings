import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { NoteType } from '@prisma/client'

// GET: List notes for a client relationship
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    const notes = await prisma.relationshipNote.findMany({
      include: {
        createdBy: true,
        clientRelationship: {
          include: {
            client: true,
            business: true,
            staff: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: notes })
  } catch (error) {
    console.error('GET /business/relationship-notes error:', error)
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal Error' } }, { status: 500 })
  }
}

// POST: Create a new note
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    // Input validation
    const schema = z.object({
      noteType: z.enum(['GENERAL', 'PREFERENCE', 'INCIDENT', 'FEEDBACK', 'FOLLOW_UP', 'SPECIAL_REQUEST']),
      content: z.string().min(1),
      createdById: z.string().min(1),
      businessId: z.string().min(1),
      clientId: z.string().min(1),
      clientRelationshipId: z.string().optional(),
      appointmentId: z.string().optional()
    })
    let body
    try {
      body = await request.json()
    } catch (err) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_JSON', message: 'Invalid JSON body' } }, { status: 400 })
    }
    let validatedData
    try {
      validatedData = schema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ success: false, error: { code: 'INVALID_NOTE_DATA', message: 'Invalid note data', details: error.errors } }, { status: 400 })
      }
      throw error
    }
    const note = await prisma.relationshipNote.create({
      data: {
        ...validatedData,
        noteType: validatedData.noteType as NoteType,
      },
      include: {
        createdBy: true,
        clientRelationship: {
          include: {
            client: true,
            business: true,
            staff: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: note })
  } catch (error) {
    console.error('POST /business/relationship-notes error:', error)
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal Error' } }, { status: 500 })
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future.
