import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().optional()
})

// GET: Get a specific category
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').at(-1);
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    // Fetch category and business in one go
    const category = await prisma.serviceCategory.findUnique({
      where: { id },
      include: { services: true, business: true }
    })

    if (!category) {
      return NextResponse.json({ success: false, error: { code: 'CATEGORY_NOT_FOUND', message: 'Category not found' } }, { status: 404 })
    }
    if (category.business?.email !== session.user.email) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    return NextResponse.json({ success: true, data: category })
  } catch (error) {
    console.error('GET /business/categories/[id] error:', error)
    return NextResponse.json({ success: false, error: { code: 'CATEGORY_FETCH_ERROR', message: 'Failed to fetch category' } }, { status: 500 })
  }
}

// PATCH: Update a category
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(request: Request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').at(-1);
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.email) {
    console.error('Unauthorized: No session or user.');
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
  }

  try {
    // Input validation
    const json = await request.json()
    const { name, description, color } = categorySchema.parse(json)

    // Fetch category and business in one go
    const category = await prisma.serviceCategory.findUnique({
      where: { id },
      include: { business: true }
    })
    if (!category || category.business?.email !== session.user.email) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    const updatedCategory = await prisma.serviceCategory.update({
      where: { id },
      data: { name, description, color }
    })

    return NextResponse.json({ success: true, data: updatedCategory })
  } catch (error) {
    console.error('PATCH /business/categories/[id] error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_INPUT', message: 'Invalid input', details: error.errors } }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: { code: 'CATEGORY_UPDATE_ERROR', message: 'Failed to update category' } }, { status: 500 })
  }
}

// DELETE: Delete a category
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: Request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').at(-1);
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.email) {
    console.error('Unauthorized: No session or user.');
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
  }

  try {
    // Fetch category and business in one go
    const category = await prisma.serviceCategory.findUnique({
      where: { id },
      include: { business: true }
    })
    if (!category || category.business?.email !== session.user.email) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    await prisma.serviceCategory.delete({
      where: { id }
    })
    console.info(`Category ${id} deleted by user ${session.user.email}`)
    return NextResponse.json({ success: true, data: null }, { status: 200 })
  } catch (error) {
    console.error('DELETE /business/categories/[id] error:', error)
    return NextResponse.json({ success: false, error: { code: 'CATEGORY_DELETE_ERROR', message: 'Failed to delete category' } }, { status: 500 })
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future.