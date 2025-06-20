import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger'; // Assuming a logger utility exists

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch (err) {
      logger.error('check-availability: Invalid JSON body', { err });
      return NextResponse.json({ success: false, error: { code: 'INVALID_JSON', message: 'Invalid JSON body' } }, { status: 400 });
    }
    const { staffId, date, startTime, duration } = body;
    if (!staffId || !date || !startTime || !duration) {
      logger.warn('check-availability: Missing required fields', { body });
      return NextResponse.json({ success: false, error: { code: 'MISSING_FIELDS', message: 'Missing required fields: staffId, date, startTime, duration' } }, { status: 400 });
    }
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);
    
    logger.info(`check-availability: Checking for staff ${staffId} between ${start.toISOString()} and ${end.toISOString()}`);

    // 1. Check for explicit unavailability (vacation, sick, etc.)
    const unavailabilities = await prisma.staffUnavailability.findMany({
      where: {
        staffId,
        start: { lte: end },
        end: { gte: start },
      },
    });
    if (unavailabilities.length > 0) {
      logger.info(`check-availability: Staff ${staffId} is unavailable due to explicit block.`, { unavailabilities });
      return NextResponse.json({
        success: true,
        data: {
          available: false,
          reason: 'Explicit unavailability',
          unavailabilities,
        }
      });
    }

    // 2. Check for overlapping appointments
    const conflictingAppointments = await prisma.appointment.findMany({
      where: {
        staffId,
        status: { not: 'CANCELLED' },
        scheduledFor: {
          lt: end,
        },
      },
    });

    const trueConflict = conflictingAppointments.find((appt: any) => {
      const existingStart = appt.scheduledFor;
      const existingEnd = new Date(existingStart.getTime() + appt.duration * 60000);
      return existingStart < end && existingEnd > start;
    });

    if (trueConflict) {
        logger.info(`check-availability: Staff ${staffId} has a conflicting appointment.`, { trueConflict });
        return NextResponse.json({
          success: true,
          data: {
            available: false,
            reason: 'Overlapping appointment',
            overlapping: trueConflict,
          }
        });
    }

    // 3. Otherwise, staff is fully available
    logger.info(`check-availability: Staff ${staffId} is available.`);
    return NextResponse.json({
      success: true,
      data: {
        available: true,
        reason: 'Fully available by default',
      }
    });
  } catch (error) {
    logger.error('check-availability: An unexpected error occurred', {
       message: error instanceof Error ? error.message : 'Unknown error',
       stack: error instanceof Error ? error.stack : undefined,
       details: error 
    });
    return NextResponse.json({ success: false, error: { code: 'AVAILABILITY_CHECK_ERROR', message: error instanceof Error ? error.message : 'Internal Server Error' } }, { status: 500 });
  }
} 