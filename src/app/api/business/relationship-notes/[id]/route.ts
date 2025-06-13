import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { ApiError, handleApiError } from '@/lib/utils/api/error'
import { z } from 'zod'
import { NoteType } from '@prisma/client'

// GET: Get a specific note
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').at(-1);
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !session.user || !session.user.email) {
    console.error('Unauthorized: No session or user.');
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
  }

  try {
    // Fetch the record with relations for ownership check and response
    const note = await prisma.relationshipNote.findUnique({
      where: { id: id },
      include: {
        createdBy: { select: { id: true, name: true } }
      }
    })
    if (!note) return NextResponse.json({ success: false, error: { code: 'NOTE_NOT_FOUND', message: 'Note not found' } }, { status: 404 })
    const business = await prisma.business.findFirst({
      where: { id: note.businessId, email: session.user.email }
    })
    if (!business) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    return NextResponse.json({ success: true, data: note })
  } catch (error) {
    console.error('GET /relationship-notes/[id] error:', error);
    return handleApiError(error)
  }
}

// PATCH: Update a note
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(request: Request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').at(-1);
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !session.user || !session.user.email) {
    console.error('Unauthorized: No session or user.');
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
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
      where: { id: id }
    }) as { businessId: string } | null;
    if (!record) return NextResponse.json({ success: false, error: { code: 'NOTE_NOT_FOUND', message: 'Note not found' } }, { status: 404 })
    const business = await prisma.business.findFirst({
      where: { id: record.businessId, email: session.user.email }
    })
    if (!business) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })

    // Update and return the full record with relations
    const note = await prisma.relationshipNote.update({
      where: { id: id },
      data: {
        noteType: NoteType[noteType as keyof typeof NoteType],
        content
      },
      include: {
        createdBy: { select: { id: true, name: true } }
      }
    })
    return NextResponse.json({ success: true, data: note })
  } catch (error) {
    console.error('PATCH /relationship-notes/[id] error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_INPUT', message: 'Invalid input', details: error.errors } }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: { code: 'NOTE_UPDATE_ERROR', message: 'Failed to update note' } }, { status: 500 })
  }
}

// DELETE: Delete a note
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: Request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').at(-1);
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !session.user || !session.user.email) {
    console.error('Unauthorized: No session or user.');
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
  }

  try {
    // Fetch the record for ownership check
    const record = await prisma.relationshipNote.findUnique({
      where: { id: id }
    }) as { businessId: string } | null;
    if (!record) return NextResponse.json({ success: false, error: { code: 'NOTE_NOT_FOUND', message: 'Note not found' } }, { status: 404 })
    const business = await prisma.business.findFirst({
      where: { id: record.businessId, email: session.user.email }
    })
    if (!business) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })

    // Delete the record
    await prisma.relationshipNote.delete({
      where: { id: id }
    })
    // Logging
    console.info(`Note ${id} deleted by user ${session.user.email}`)
    // 204 No Content should not return a body
    return NextResponse.json({ success: true, data: null }, { status: 204 })
  } catch (error) {
    console.error('DELETE /relationship-notes/[id] error:', error);
    return NextResponse.json({ success: false, error: { code: 'NOTE_DELETE_ERROR', message: 'Failed to delete note' } }, { status: 500 })
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future.
