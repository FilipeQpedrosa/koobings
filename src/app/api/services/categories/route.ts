import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/services/categories - List all categories
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const categories = await prisma.serviceCategory.findMany({
      where: {
        business: {
          id: session.user.businessId,
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: { code: 'CATEGORIES_FETCH_ERROR', message: 'Failed to fetch categories' } },
      { status: 500 }
    );
  }
}

// POST /api/services/categories - Create a new category
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, color } = body;

    const category = await prisma.serviceCategory.create({
      data: {
        name,
        description,
        color,
        business: {
          connect: {
            id: session.user.businessId,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: { code: 'CATEGORY_CREATE_ERROR', message: 'Failed to create category' } },
      { status: 500 }
    );
  }
} 