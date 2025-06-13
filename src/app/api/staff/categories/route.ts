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

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'STAFF') return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    const businessId = session.user.businessId;
    if (!businessId) return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing businessId' } }, { status: 400 });
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
    console.error('Error in GET /staff/categories:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'STAFF') return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    const businessId = session.user.businessId;
    if (!businessId) return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing businessId' } }, { status: 400 });
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
    console.error('Error in POST /staff/categories:', error);
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_CATEGORY_DATA', message: 'Invalid category data', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
} 