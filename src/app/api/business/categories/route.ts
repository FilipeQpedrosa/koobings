import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().optional(),
});

type CategoryInput = z.infer<typeof categorySchema>;

function getPaginationParams(url: URL) {
  const page = Number(url.searchParams.get('page')) || 1;
  const limit = Number(url.searchParams.get('limit')) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

async function getBusinessId(session: any) {
  if (!session || !session.user) throw new Error('Unauthorized');
  // Adjust this logic as needed for your user model
  return session.user.role === 'BUSINESS' ? session.user.id : session.user.businessId;
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const businessId = await getBusinessId(session);
    const url = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(url);

    const [categories, total] = await Promise.all([
      prisma.serviceCategory.findMany({
        where: { businessId, isDeleted: false },
        include: { services: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.serviceCategory.count({
        where: { businessId, isDeleted: false },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: categories,
      meta: {
        page,
        limit,
        total,
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Error in GET /business/categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const businessId = await getBusinessId(session);
    let body;
    try {
      body = await request.json();
    } catch (err) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    let validatedData;
    try {
      validatedData = categorySchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Invalid category data', details: error.errors }, { status: 400 });
      }
      throw error;
    }
    const category = await prisma.serviceCategory.create({
      data: {
        ...validatedData,
        businessId,
      },
      include: { services: true },
    });
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error in POST /business/categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const businessId = await getBusinessId(session);
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('id');
    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
    let body;
    try {
      body = await request.json();
    } catch (err) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    let validatedData;
    try {
      validatedData = categorySchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Invalid category data', details: error.errors }, { status: 400 });
      }
      throw error;
    }
    const existingCategory = await prisma.serviceCategory.findFirst({
      where: { id: categoryId, businessId, isDeleted: false },
    });
    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    const category = await prisma.serviceCategory.update({
      where: { id: categoryId },
      data: { ...validatedData },
      include: { services: true },
    });
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error in PUT /business/categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const businessId = await getBusinessId(session);
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('id');
    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
    const existingCategory = await prisma.serviceCategory.findFirst({
      where: { id: categoryId, businessId, isDeleted: false },
    });
    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    await prisma.serviceCategory.update({
      where: { id: categoryId },
      data: { isDeleted: true },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /business/categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future.