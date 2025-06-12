import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

interface RouteParams {
  params: {
    id: string;
  };
}

// GET: Get a specific category
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: Request, { params }: any) {
  const id = params.id;
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch category and business in one go
    const category = await prisma.serviceCategory.findUnique({
      where: { id },
      include: { services: true, business: true }
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    if (category.business?.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('GET /business/categories/[id] error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// PATCH: Update a category
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(request: Request, { params }: any) {
  const id = params.id;
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.email) {
    console.error('Unauthorized: No session or user.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Input validation
    const schema = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      color: z.string().optional()
    })
    const json = await request.json()
    const { name, description, color } = schema.parse(json)

    // Fetch category and business in one go
    const category = await prisma.serviceCategory.findUnique({
      where: { id },
      include: { business: true }
    })
    if (!category || category.business?.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updatedCategory = await prisma.serviceCategory.update({
      where: { id },
      data: { name, description, color }
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error('PATCH /business/categories/[id] error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// DELETE: Delete a category
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: Request, { params }: any) {
  const id = params.id;
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.email) {
    console.error('Unauthorized: No session or user.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch category and business in one go
    const category = await prisma.serviceCategory.findUnique({
      where: { id },
      include: { business: true }
    })
    if (!category || category.business?.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.serviceCategory.delete({
      where: { id }
    })
    console.info(`Category ${id} deleted by user ${session.user.email}`)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('DELETE /business/categories/[id] error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future.