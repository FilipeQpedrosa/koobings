import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/client/reviews - Get client reviews
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId') || session.user.id;

    const reviews = await prisma.review.findMany({
      where: {
        clientId,
      },
      include: {
        appointment: {
          include: {
            service: true,
            staff: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: { code: 'REVIEWS_FETCH_ERROR', message: 'Failed to fetch reviews' } },
      { status: 500 }
    );
  }
}

// POST /api/client/reviews - Create new review
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const body = await request.json();
    const { appointmentId, rating, comment } = body;

    if (!appointmentId || !rating) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_FIELDS', message: 'Appointment ID and rating are required' } },
        { status: 400 }
      );
    }

    // Verify appointment belongs to client and is completed
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        clientId: session.user.id,
        status: 'COMPLETED',
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: { code: 'APPOINTMENT_NOT_FOUND', message: 'Appointment not found or not completed' } },
        { status: 404 }
      );
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        appointmentId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: { code: 'REVIEW_EXISTS', message: 'Review already exists for this appointment' } },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        clientId: session.user.id,
        appointmentId,
        rating,
        comment,
      },
      include: {
        appointment: {
          include: {
            service: true,
            staff: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: { code: 'REVIEW_CREATE_ERROR', message: 'Failed to create review' } },
      { status: 500 }
    );
  }
}

// PATCH /api/client/reviews - Update review
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const body = await request.json();
    const { reviewId, rating, comment } = body;

    if (!reviewId || !rating) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_FIELDS', message: 'Review ID and rating are required' } },
        { status: 400 }
      );
    }

    // Verify review belongs to client
    const existingReview = await prisma.review.findFirst({
      where: {
        id: reviewId,
        clientId: session.user.id,
      },
    });

    if (!existingReview) {
      return NextResponse.json(
        { success: false, error: { code: 'REVIEW_NOT_FOUND', message: 'Review not found' } },
        { status: 404 }
      );
    }

    // Update the review
    const review = await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        rating,
        comment,
      },
      include: {
        appointment: {
          include: {
            service: true,
            staff: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, error: { code: 'REVIEW_UPDATE_ERROR', message: 'Failed to update review' } },
      { status: 500 }
    );
  }
} 