import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { ApiError, handleApiError } from '@/lib/utils/api/error'

// GET: Get a specific visit history entry
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
    const record = await prisma.visitHistory.findUnique({
      where: { id: params.id }
    }) as { businessId: string } | null;
    if (!record) throw new ApiError(404, 'Visit history entry not found')
    const business = await prisma.business.findFirst({
      where: { id: record.businessId, email: session.user.email }
    })
    if (!business) throw new ApiError(401, 'Unauthorized')

    // Step 2: Fetch the full record with relations for response
    const visitHistory = await prisma.visitHistory.findUnique({
      where: { id: params.id },
      include: {
        client: { select: { id: true, name: true } }
      }
    })
    return NextResponse.json(visitHistory)
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH: Update a visit history entry
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
    const { 
      visitDate,
      serviceType,
      staffNotes,
      patientFeedback,
      followUpRequired
    } = json

    // Step 1: Fetch the record for ownership check
    const record = await prisma.visitHistory.findUnique({
      where: { id: params.id }
    }) as { businessId: string } | null;
    if (!record) throw new ApiError(404, 'Visit history entry not found')
    const business = await prisma.business.findFirst({
      where: { id: record.businessId, email: session.user.email }
    })
    if (!business) throw new ApiError(401, 'Unauthorized')

    // Step 2: Update and return the full record with relations
    const visitHistory = await prisma.visitHistory.update({
      where: { id: params.id },
      data: {
        visitDate: visitDate ? new Date(visitDate) : undefined,
        serviceType,
        staffNotes,
        patientFeedback,
        followUpRequired
      },
      include: {
        client: { select: { id: true, name: true } }
      }
    })
    return NextResponse.json(visitHistory)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE: Delete a visit history entry
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
    const record = await prisma.visitHistory.findUnique({
      where: { id: params.id }
    }) as { businessId: string } | null;
    if (!record) throw new ApiError(404, 'Visit history entry not found')
    const business = await prisma.business.findFirst({
      where: { id: record.businessId, email: session.user.email }
    })
    if (!business) throw new ApiError(401, 'Unauthorized')

    // Step 2: Delete the record
    await prisma.visitHistory.delete({
      where: { id: params.id }
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return handleApiError(error)
  }
}
