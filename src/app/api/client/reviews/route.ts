import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET /api/client/reviews - Get client reviews
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId') || session.user.id;

    const reviews = await prisma.review.findMany({
      where: {
        patientId,
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

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/client/reviews - Create new review
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { appointmentId, rating, comment } = body;

    if (!appointmentId || !rating) {
      return NextResponse.json(
        { error: 'Appointment ID and rating are required' },
        { status: 400 }
      );
    }

    // Verify appointment belongs to client and is completed
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: session.user.id,
        status: 'COMPLETED',
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found or not completed' },
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
        { error: 'Review already exists for this appointment' },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        patientId: session.user.id,
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

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

// PATCH /api/client/reviews - Update review
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { reviewId, rating, comment } = body;

    if (!reviewId || !rating) {
      return NextResponse.json(
        { error: 'Review ID and rating are required' },
        { status: 400 }
      );
    }

    // Verify review belongs to client
    const existingReview = await prisma.review.findFirst({
      where: {
        id: reviewId,
        patientId: session.user.id,
      },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
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

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
} 