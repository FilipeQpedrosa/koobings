import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { handleApiError } from '@/lib/utils/api/error'
import { z } from 'zod'

// GET: Get a specific visit history entry
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
    const visitHistory = await prisma.visitHistory.findUnique({
      where: { id: id },
      include: {
        client: { select: { id: true, name: true } },
        business: true
      }
    })
    if (!visitHistory) return NextResponse.json({ success: false, error: { code: 'VISIT_HISTORY_NOT_FOUND', message: 'Visit history entry not found' } }, { status: 404 })
    if (visitHistory.business?.email !== session.user.email) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }
    return NextResponse.json({ success: true, data: visitHistory })
  } catch (error) {
    console.error('GET /business/visit-history/[id] error:', error)
    return handleApiError(error)
  }
}

// PATCH: Update a visit history entry
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
    // Input validation
    const schema = z.object({
      visitDate: z.string().optional(),
      serviceType: z.string().optional(),
      staffNotes: z.string().optional(),
      clientFeedback: z.string().optional(),
      followUpRequired: z.boolean().optional()
    })
    const json = await request.json()
    const { visitDate, serviceType, staffNotes, clientFeedback, followUpRequired } = schema.parse(json)

    // Fetch the record with relations for ownership check
    const visitHistory = await prisma.visitHistory.findUnique({
      where: { id: id },
      include: { business: true }
    })
    if (!visitHistory) return NextResponse.json({ success: false, error: { code: 'VISIT_HISTORY_NOT_FOUND', message: 'Visit history entry not found' } }, { status: 404 })
    if (visitHistory.business?.email !== session.user.email) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    // Update and return the full record with relations
    const updatedVisitHistory = await prisma.visitHistory.update({
      where: { id: id },
      data: {
        visitDate: visitDate ? new Date(visitDate) : undefined,
        serviceType,
        staffNotes,
        clientFeedback,
        followUpRequired
      },
      include: {
        client: { select: { id: true, name: true } },
        business: true
      }
    })
    return NextResponse.json({ success: true, data: updatedVisitHistory })
  } catch (error) {
    console.error('PATCH /business/visit-history/[id] error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_INPUT', message: 'Invalid input', details: error.errors } }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: { code: 'VISIT_HISTORY_UPDATE_ERROR', message: 'Failed to update visit history entry' } }, { status: 500 })
  }
}

// DELETE: Delete a visit history entry
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
    // Fetch the record with relations for ownership check
    const visitHistory = await prisma.visitHistory.findUnique({
      where: { id: id },
      include: { business: true }
    })
    if (!visitHistory) return NextResponse.json({ success: false, error: { code: 'VISIT_HISTORY_NOT_FOUND', message: 'Visit history entry not found' } }, { status: 404 })
    if (visitHistory.business?.email !== session.user.email) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    // Delete the record
    await prisma.visitHistory.delete({
      where: { id: id }
    })
    console.info(`Visit history ${id} deleted by user ${session.user.email}`)
    return NextResponse.json({ success: true, data: null }, { status: 200 })
  } catch (error) {
    console.error('DELETE /business/visit-history/[id] error:', error)
    return NextResponse.json({ success: false, error: { code: 'VISIT_HISTORY_DELETE_ERROR', message: 'Failed to delete visit history entry' } }, { status: 500 })
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future.
