import { createClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET: Get a specific service
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        providers: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Verify ownership
    const business = await prisma.business.findFirst({
      where: { email: session.user.email }
    })

    if (!business || service.businessId !== business.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// PATCH: Update a service
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const { name, description, price, duration, categoryId, providerIds } = json

    // Verify ownership
    const business = await prisma.business.findFirst({
      where: { email: session.user.email }
    })

    const existingService = await prisma.service.findUnique({
      where: { id: params.id }
    })

    if (!existingService || !business || existingService.businessId !== business.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const service = await prisma.service.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price,
        duration,
        categoryId: categoryId || null,
        providers: providerIds ? {
          set: providerIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        category: true,
        providers: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// DELETE: Delete a service
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Verify ownership
    const business = await prisma.business.findFirst({
      where: { email: session.user.email }
    })

    const service = await prisma.service.findUnique({
      where: { id: params.id }
    })

    if (!service || !business || service.businessId !== business.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.service.delete({
      where: { id: params.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}