import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { ApiError, handleApiError } from '@/lib/utils/api/error'

// GET: Get a specific note
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Step 1: Fetch the record for ownership check
    const record = await prisma.relationshipNote.findUnique({
      where: { id: params.id }
    }) as { businessId: string } | null;
    if (!record) throw new ApiError(404, 'Note not found')
    const business = await prisma.business.findFirst({
      where: { id: record.businessId, email: session.user.email }
    })
    if (!business) throw new ApiError(401, 'Unauthorized')

    // Step 2: Fetch the full record with relations for response
    const note = await prisma.relationshipNote.findUnique({
      where: { id: params.id },
      include: {
        createdBy: { select: { id: true, name: true } }
      }
    })
    return NextResponse.json(note)
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH: Update a note
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const { noteType, content } = json

    // Step 1: Fetch the record for ownership check
    const record = await prisma.relationshipNote.findUnique({
      where: { id: params.id }
    }) as { businessId: string } | null;
    if (!record) throw new ApiError(404, 'Note not found')
    const business = await prisma.business.findFirst({
      where: { id: record.businessId, email: session.user.email }
    })
    if (!business) throw new ApiError(401, 'Unauthorized')

    // Step 2: Update and return the full record with relations
    const note = await prisma.relationshipNote.update({
      where: { id: params.id },
      data: {
        noteType,
        content
      },
      include: {
        createdBy: { select: { id: true, name: true } }
      }
    })
    return NextResponse.json(note)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE: Delete a note
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Step 1: Fetch the record for ownership check
    const record = await prisma.relationshipNote.findUnique({
      where: { id: params.id }
    }) as { businessId: string } | null;
    if (!record) throw new ApiError(404, 'Note not found')
    const business = await prisma.business.findFirst({
      where: { id: record.businessId, email: session.user.email }
    })
    if (!business) throw new ApiError(401, 'Unauthorized')

    // Step 2: Delete the record
    await prisma.relationshipNote.delete({
      where: { id: params.id }
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return handleApiError(error)
  }
}
