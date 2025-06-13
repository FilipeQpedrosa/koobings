import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: Request, { params }: any) {
  try {
    const staff = await prisma.staff.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        services: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true
          }
        }
      }
    });

    if (!staff) {
      return NextResponse.json(
        { success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff member not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: staff });
  } catch (error) {
    console.error('Error fetching staff member:', error);
    return NextResponse.json(
      { success: false, error: { code: 'STAFF_FETCH_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
} 