import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import * as yup from 'yup';

const categorySchema = yup.object({
  name: yup.string().required(),
  description: yup.string(),
  color: yup.string(),
});

type CategoryInput = yup.InferType<typeof categorySchema>;

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
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const businessId = await getBusinessId(session);
    const body = await request.json();
    const validatedData = await categorySchema.validate(body);
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
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ error: 'Invalid category data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const businessId = await getBusinessId(session);
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('id');
    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
    const body = await request.json();
    const validatedData = await categorySchema.validate(body);
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
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ error: 'Invalid category data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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