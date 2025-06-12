import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { ApiError, handleApiError } from '@/lib/utils/api/error'
import { z } from 'zod'
import { NoteType } from '@prisma/client'

// GET: Get a specific note
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: Request, { params }: any) {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !session.user || !session.user.email) {
    console.error('Unauthorized: No session or user.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch the record with relations for ownership check and response
    const note = await prisma.relationshipNote.findUnique({
      where: { id: params.id },
      include: {
        createdBy: { select: { id: true, name: true } }
      }
    })
    if (!note) throw new ApiError(404, 'Note not found')
    const business = await prisma.business.findFirst({
      where: { id: note.businessId, email: session.user.email }
    })
    if (!business) throw new ApiError(401, 'Unauthorized')
    return NextResponse.json(note)
  } catch (error) {
    console.error('GET /relationship-notes/[id] error:', error);
    return handleApiError(error)
  }
}

// PATCH: Update a note
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(request: Request, { params }: any) {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !session.user || !session.user.email) {
    console.error('Unauthorized: No session or user.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    // Input validation
    const schema = z.object({
      noteType: z.string().min(1),
      content: z.string().min(1)
    })
    const { noteType, content } = schema.parse(json)

    // Fetch the record for ownership check
    const record = await prisma.relationshipNote.findUnique({
      where: { id: params.id }
    }) as { businessId: string } | null;
    if (!record) throw new ApiError(404, 'Note not found')
    const business = await prisma.business.findFirst({
      where: { id: record.businessId, email: session.user.email }
    })
    if (!business) throw new ApiError(401, 'Unauthorized')

    // Update and return the full record with relations
    const note = await prisma.relationshipNote.update({
      where: { id: params.id },
      data: {
        noteType: NoteType[noteType as keyof typeof NoteType],
        content
      },
      include: {
        createdBy: { select: { id: true, name: true } }
      }
    })
    return NextResponse.json(note)
  } catch (error) {
    console.error('PATCH /relationship-notes/[id] error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    return handleApiError(error)
  }
}

// DELETE: Delete a note
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: Request, { params }: any) {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !session.user || !session.user.email) {
    console.error('Unauthorized: No session or user.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch the record for ownership check
    const record = await prisma.relationshipNote.findUnique({
      where: { id: params.id }
    }) as { businessId: string } | null;
    if (!record) throw new ApiError(404, 'Note not found')
    const business = await prisma.business.findFirst({
      where: { id: record.businessId, email: session.user.email }
    })
    if (!business) throw new ApiError(401, 'Unauthorized')

    // Delete the record
    await prisma.relationshipNote.delete({
      where: { id: params.id }
    })
    // Logging
    console.info(`Note ${params.id} deleted by user ${session.user.email}`)
    // 204 No Content should not return a body
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('DELETE /relationship-notes/[id] error:', error);
    return handleApiError(error)
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future.
