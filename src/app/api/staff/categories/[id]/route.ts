import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(request: NextRequest, { params }: any) {
  try {
    // Try to get business from subdomain header first, then fall back to session
    let business;
    const businessName = request.headers.get('x-business');
    
    if (businessName) {
      business = await prisma.business.findFirst({ where: { name: businessName } });
    } else {
      // Fallback: get business from session
      const session = await getServerSession(authOptions);
      if (!session?.user?.businessId) {
        return NextResponse.json({ success: false, error: { code: 'BUSINESS_SUBDOMAIN_MISSING', message: 'Business subdomain missing and no valid session' } }, { status: 400 });
      }
      business = await prisma.business.findFirst({ where: { id: session.user.businessId } });
    }
    
    if (!business) {
      return NextResponse.json({ success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } }, { status: 404 });
    }
    const body = await request.json();
    const { name, description, color } = body;
    // Check if category exists and belongs to business
    const category = await prisma.serviceCategory.findFirst({
      where: { id: params.id, businessId: business.id },
    });
    if (!category) {
      return NextResponse.json({ success: false, error: { code: 'CATEGORY_NOT_FOUND', message: 'Category not found' } }, { status: 404 });
    }
    const updated = await prisma.serviceCategory.update({
      where: { id: params.id },
      data: { name, description, color },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ success: false, error: { code: 'CATEGORY_UPDATE_ERROR', message: 'Failed to update category' } }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: NextRequest, { params }: any) {
  try {
    // Try to get business from subdomain header first, then fall back to session
    let business;
    const businessName = request.headers.get('x-business');
    
    if (businessName) {
      business = await prisma.business.findFirst({ where: { name: businessName } });
    } else {
      // Fallback: get business from session
      const session = await getServerSession(authOptions);
      if (!session?.user?.businessId) {
        return NextResponse.json({ success: false, error: { code: 'BUSINESS_SUBDOMAIN_MISSING', message: 'Business subdomain missing and no valid session' } }, { status: 400 });
      }
      business = await prisma.business.findFirst({ where: { id: session.user.businessId } });
    }
    
    if (!business) {
      return NextResponse.json({ success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } }, { status: 404 });
    }
    // Check if category exists and belongs to business
    const category = await prisma.serviceCategory.findFirst({
      where: { id: params.id, businessId: business.id },
      include: { services: { select: { id: true } } },
    });
    if (!category) {
      return NextResponse.json({ success: false, error: { code: 'CATEGORY_NOT_FOUND', message: 'Category not found' } }, { status: 404 });
    }
    if (category.services.length > 0) {
      return NextResponse.json({ success: false, error: { code: 'CATEGORY_HAS_SERVICES', message: 'Cannot delete category with existing services' } }, { status: 400 });
    }
    await prisma.serviceCategory.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ success: false, error: { code: 'CATEGORY_DELETE_ERROR', message: 'Failed to delete category' } }, { status: 500 });
  }
} 