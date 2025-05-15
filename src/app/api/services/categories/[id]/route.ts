import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/services/categories/[id] - Get a single category
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const category = await prisma.serviceCategory.findFirst({
      where: {
        id: params.id,
        business: {
          id: session.user.businessId,
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT /api/services/categories/[id] - Update a category
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, color } = body;

    // Check if category exists and belongs to the business
    const existingCategory = await prisma.serviceCategory.findFirst({
      where: {
        id: params.id,
        business: {
          id: session.user.businessId,
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const category = await prisma.serviceCategory.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        description,
        color,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/services/categories/[id] - Delete a category
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if category exists and belongs to the business
    const existingCategory = await prisma.serviceCategory.findFirst({
      where: {
        id: params.id,
        business: {
          id: session.user.businessId,
        },
      },
      include: {
        services: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Check if category has services
    if (existingCategory.services.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing services" },
        { status: 400 }
      );
    }

    await prisma.serviceCategory.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
} 