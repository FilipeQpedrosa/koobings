import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { ApiError, handleApiError } from '@/lib/utils/api/error'
import { z } from 'zod'

// GET: Get a specific visit history entry
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').at(-1);
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !session.user || !session.user.email) {
    console.error('Unauthorized: No session or user.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
    if (!visitHistory) throw new ApiError(404, 'Visit history entry not found')
    if (visitHistory.business?.email !== session.user.email) {
      throw new ApiError(401, 'Unauthorized')
    }
    return NextResponse.json(visitHistory)
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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
    if (!visitHistory) throw new ApiError(404, 'Visit history entry not found')
    if (visitHistory.business?.email !== session.user.email) {
      throw new ApiError(401, 'Unauthorized')
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
    return NextResponse.json(updatedVisitHistory)
  } catch (error) {
    console.error('PATCH /business/visit-history/[id] error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    return handleApiError(error)
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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch the record with relations for ownership check
    const visitHistory = await prisma.visitHistory.findUnique({
      where: { id: id },
      include: { business: true }
    })
    if (!visitHistory) throw new ApiError(404, 'Visit history entry not found')
    if (visitHistory.business?.email !== session.user.email) {
      throw new ApiError(401, 'Unauthorized')
    }

    // Delete the record
    await prisma.visitHistory.delete({
      where: { id: id }
    })
    console.info(`Visit history ${id} deleted by user ${session.user.email}`)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('DELETE /business/visit-history/[id] error:', error)
    return handleApiError(error)
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future.
